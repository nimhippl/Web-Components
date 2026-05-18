function getTooltipText(emblemData) {
    return [
        emblemData.description,
        `State: ${emblemData.state}`,
        `Rarity: ${emblemData.rarity || 'common'}`,
        `Shape: ${emblemData.shape || 'shield'}`
    ].filter(Boolean).join(' · ');
}

function createEmblemElement(emblemData, options = {}) {
    const emblem = document.createElement('gwc-emblem');

    emblem.setAttribute('size', options.size || 'medium');
    emblem.setAttribute('shape', emblemData.shape || 'shield');
    emblem.setAttribute('interactive', 'true');
    emblem.setAttribute('show-state', options.showState === false ? 'false' : 'true');
    emblem.setAttribute('show-rarity', options.showRarity === false ? 'false' : 'true');
    emblem.setConfig(emblemData);

    return emblem;
}

function createTooltipWrapper(emblemData, emblem) {
    const tooltip = document.createElement('gwc-tooltip');

    tooltip.setAttribute('tooltip-title', emblemData.name);
    tooltip.setAttribute('text', getTooltipText(emblemData));
    tooltip.setAttribute('position', 'top');
    tooltip.appendChild(emblem);

    return tooltip;
}

function createEmblemDemoItem(emblemData, options = {}) {
    const item = document.createElement('div');
    item.className = 'emblem-demo-item';

    const emblem = createEmblemElement(emblemData, options);
    const tooltip = createTooltipWrapper(emblemData, emblem);

    emblem.addEventListener('gwc-emblem-click', event => {
        const parentGrid = item.parentElement;

        if (parentGrid) {
            parentGrid.querySelectorAll('gwc-emblem').forEach(element => {
                element.removeAttribute('selected');
            });
        }

        emblem.setAttribute('selected', 'true');
    });

    item.appendChild(tooltip);

    const name = document.createElement('div');
    name.className = 'emblem-demo-name';
    name.textContent = emblemData.name;

    const description = document.createElement('div');
    description.className = 'emblem-demo-description';
    description.textContent = options.descriptionText || emblemData.state;

    item.appendChild(name);
    item.appendChild(description);

    return item;
}

function createEmblemSelectionOption(emblemData, panel) {
    const item = document.createElement('div');
    item.className = 'emblem-selection-option';

    const emblem = createEmblemElement(emblemData, {
        size: 'medium',
        showState: true,
        showRarity: true
    });

    const tooltip = createTooltipWrapper(emblemData, emblem);

    emblem.addEventListener('gwc-emblem-click', event => {
        document.querySelectorAll('#emblemSelectionContainer .emblem-selection-option').forEach(option => {
            option.classList.remove('selected');
        });

        document.querySelectorAll('#emblemSelectionContainer gwc-emblem').forEach(element => {
            element.removeAttribute('selected');
        });

        item.classList.add('selected');
        emblem.setAttribute('selected', 'true');

        panel.setConfig({
            title: emblemData.name,
            subtitle: 'Selected emblem',
            description: emblemData.description || 'No description provided.',
            icon: emblemData.icon || '◆',
            eventName: 'gwc-emblem-click',
            fields: [
                { label: 'State', value: emblemData.state || 'unlocked' },
                { label: 'Rarity', value: emblemData.rarity || 'common' },
                { label: 'Shape', value: emblemData.shape || 'shield' },
                { label: 'ID', value: emblemData.id }
            ]
        });
    });

    const name = document.createElement('div');
    name.className = 'emblem-selection-name';
    name.textContent = emblemData.name;

    const meta = document.createElement('div');
    meta.className = 'emblem-selection-meta';
    meta.textContent = `${emblemData.shape || 'shield'} · ${emblemData.rarity || 'common'}`;

    item.appendChild(tooltip);
    item.appendChild(name);
    item.appendChild(meta);

    return item;
}

function initEmblemSelectionFlow(emblemSelectionOptions) {
    const selectionContainer = document.getElementById('emblemSelectionContainer');
    const selectedPanel = document.getElementById('selectedEmblemPanel');

    if (!selectionContainer || !selectedPanel) return;

    selectedPanel.clear();

    emblemSelectionOptions.forEach(emblemData => {
        selectionContainer.appendChild(
            createEmblemSelectionOption(emblemData, selectedPanel)
        );
    });
}

export function initEmblemDemo(emblems, emblemShapes, emblemSelectionOptions = []) {
    initEmblemSelectionFlow(emblemSelectionOptions);

    const emblemsContainer = document.getElementById('emblemsContainer');
    const emblemShapesContainer = document.getElementById('emblemShapesContainer');

    if (!emblemsContainer || !emblemShapesContainer) return;

    emblems.forEach(emblemData => {
        emblemsContainer.appendChild(
            createEmblemDemoItem(emblemData, {
                descriptionText: `${emblemData.state} · ${emblemData.rarity}`
            })
        );
    });

    emblemShapes.forEach(emblemData => {
        emblemShapesContainer.appendChild(
            createEmblemDemoItem(emblemData, {
                size: 'medium',
                showState: false,
                showRarity: true,
                descriptionText: `${emblemData.shape} · ${emblemData.rarity}`
            })
        );
    });
}