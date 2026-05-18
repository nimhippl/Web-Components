function cloneSlot(slot) {
    return {
        ...slot,
        item: slot.item ? { ...slot.item, tags: slot.item.tags ? [...slot.item.tags] : undefined } : undefined
    };
}

function applyInventoryAction(slots, detail) {
    const sourceSlot = slots.find(slot => String(slot.slotId) === String(detail.slotId));

    if (!sourceSlot) return false;

    const equipmentTypes = ['weapon', 'armor', 'skin'];

    if (detail.action === 'equip' && equipmentTypes.includes(sourceSlot.item?.type)) {
        slots.forEach(slot => {
            if (slot.item?.type === sourceSlot.item.type && slot.state === 'equipped') {
                slot.state = 'filled';
                slot.action = 'equip';
                slot.actionLabel = 'Equip';
            }
        });

        sourceSlot.state = 'equipped';
        sourceSlot.action = 'unequip';
        sourceSlot.actionLabel = 'Unequip';

        return true;
    }

    if (detail.action === 'unequip') {
        sourceSlot.state = 'filled';
        sourceSlot.action = 'equip';
        sourceSlot.actionLabel = 'Equip';

        return true;
    }

    if (detail.action === 'use' && sourceSlot.item?.quantity) {
        sourceSlot.item.quantity -= 1;

        if (sourceSlot.item.quantity <= 0) {
            sourceSlot.item = undefined;
            sourceSlot.state = 'empty';
            sourceSlot.action = 'inspect';
            sourceSlot.emptyText = 'Empty slot';
        }

        return true;
    }

    return false;
}

function updateInventoryGridInspector(panel, eventName, detail) {
    const item = detail.item;
    const slot = detail.slot;

    panel.setConfig({
        title: item?.name || slot?.emptyText || 'Empty slot',
        subtitle: 'Inventory grid selection',
        description: item?.description || slot?.lockedReason || 'No item in this inventory cell.',
        icon: item?.icon || '🎒',
        eventName,
        fields: [
            { label: 'Slot ID', value: detail.slotId || 'none' },
            { label: 'State', value: detail.state || 'none' },
            { label: 'Action', value: detail.action || 'click' },
            { label: 'Item ID', value: item?.id || 'none' },
            { label: 'Type', value: item?.type || 'none' },
            { label: 'Rarity', value: item?.rarity || 'none' },
            { label: 'Quantity', value: item?.quantity ?? 'none' }
        ]
    });
}

export function initInventoryGridDemo(inventorySlotExamples) {
    const inventoryGrid = document.getElementById('inventoryGridDemo');
    const inspectorPanel = document.getElementById('inventoryGridInspector');

    if (!inventoryGrid || !inspectorPanel) return;

    const slots = inventorySlotExamples.map(cloneSlot);

    inspectorPanel.clear();

    inventoryGrid.setConfig({
        title: 'Inventory',
        subtitle: 'Click a cell to inspect it. Selected items expose their action.',
        slots,
        capacity: 18,
        columns: 6,
        filter: 'all',
        variant: 'board',
        showFilters: true,
        showCapacity: true,
        showEmptySlots: true,
        showActions: 'selected',
        showNames: false,
        emptyText: 'Empty slot'
    });

    inventoryGrid.addEventListener('gwc-inventory-grid-slot-click', event => {
        updateInventoryGridInspector(inspectorPanel, 'gwc-inventory-grid-slot-click', event.detail);
    });

    inventoryGrid.addEventListener('gwc-inventory-grid-slot-action', event => {
        updateInventoryGridInspector(inspectorPanel, 'gwc-inventory-grid-slot-action', event.detail);

        const changed = applyInventoryAction(slots, event.detail);

        if (changed) {
            inventoryGrid.setSlots(slots);
        }
    });

    inventoryGrid.addEventListener('gwc-inventory-grid-filter-change', event => {
        inspectorPanel.setConfig({
            title: 'Inventory filter changed',
            subtitle: 'Inventory grid event',
            description: 'The app can use this event to store selected tabs or request filtered inventory data.',
            icon: '🔎',
            eventName: 'gwc-inventory-grid-filter-change',
            fields: [
                { label: 'Filter', value: event.detail.filter }
            ]
        });
    });
}