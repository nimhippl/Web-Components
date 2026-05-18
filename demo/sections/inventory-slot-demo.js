function cloneSlot(slot) {
    return {
        ...slot,
        item: slot.item ? { ...slot.item, tags: slot.item.tags ? [...slot.item.tags] : undefined } : undefined
    };
}

function updateInventoryInspector(panel, eventName, detail) {
    const item = detail.item;

    panel.setConfig({
        title: item?.name || detail.config.emptyText || 'Empty slot',
        subtitle: 'Inventory slot',
        description: item?.description || detail.config.lockedReason || 'No item in this slot.',
        icon: item?.icon || '🎒',
        eventName,
        fields: [
            { label: 'Slot ID', value: detail.slotId || 'none' },
            { label: 'State', value: detail.state },
            { label: 'Action', value: detail.action || 'click' },
            { label: 'Item ID', value: item?.id || 'none' },
            { label: 'Type', value: item?.type || 'none' },
            { label: 'Rarity', value: item?.rarity || 'none' },
            { label: 'Quantity', value: item?.quantity ?? 'none' }
        ]
    });
}

function createInventorySlot(slotData, inspectorPanel, slots, renderSlots) {
    const wrapper = document.createElement('div');
    wrapper.className = 'inventory-slot-demo-item';

    const slot = document.createElement('gwc-inventory-slot');
    slot.setConfig(slotData);

    slot.addEventListener('gwc-inventory-slot-click', event => {
        document.querySelectorAll('#inventorySlotsContainer gwc-inventory-slot').forEach(element => {
            element.removeAttribute('selected');
        });

        slot.setAttribute('selected', 'true');
        updateInventoryInspector(inspectorPanel, 'gwc-inventory-slot-click', event.detail);
    });

    slot.addEventListener('gwc-inventory-slot-action', event => {
        updateInventoryInspector(inspectorPanel, 'gwc-inventory-slot-action', event.detail);

        const sourceSlot = slots.find(item => String(item.slotId) === String(event.detail.slotId));

        if (!sourceSlot) return;

        const equipmentTypes = ['weapon', 'armor', 'skin'];

        if (event.detail.action === 'equip' && equipmentTypes.includes(sourceSlot.item?.type)) {
            slots.forEach(item => {
                if (item.item?.type === sourceSlot.item.type && item.state === 'equipped') {
                    item.state = 'filled';
                    item.action = 'equip';
                    item.actionLabel = 'Equip';
                }
            });

            sourceSlot.state = 'equipped';
            sourceSlot.action = 'unequip';
            sourceSlot.actionLabel = 'Unequip';

            renderSlots();
            return;
        }

        if (event.detail.action === 'unequip') {
            sourceSlot.state = 'filled';
            sourceSlot.action = 'equip';
            sourceSlot.actionLabel = 'Equip';

            renderSlots();
            return;
        }

        if (event.detail.action === 'unequip') {
            sourceSlot.state = 'filled';
            sourceSlot.action = 'equip';
            sourceSlot.actionLabel = 'Equip';
            renderSlots();
            return;
        }

        if (event.detail.action === 'use' && sourceSlot.item?.quantity) {
            sourceSlot.item.quantity -= 1;

            if (sourceSlot.item.quantity <= 0) {
                sourceSlot.item = undefined;
                sourceSlot.state = 'empty';
                sourceSlot.action = 'inspect';
                sourceSlot.emptyText = 'Empty slot';
            }

            renderSlots();
        }
    });

    wrapper.appendChild(slot);

    return wrapper;
}

export function initInventorySlotDemo(inventorySlotExamples) {
    const container = document.getElementById('inventorySlotsContainer');
    const inspectorPanel = document.getElementById('inventorySlotInspector');

    if (!container || !inspectorPanel) return;

    const slots = inventorySlotExamples.map(cloneSlot);

    inspectorPanel.clear();

    const renderSlots = () => {
        container.innerHTML = '';

        slots.forEach(slotData => {
            container.appendChild(
                createInventorySlot(slotData, inspectorPanel, slots, renderSlots)
            );
        });
    };

    renderSlots();
}