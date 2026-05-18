function createStatCard(statData, inspectorPanel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'stat-card-demo-item';

    const statCard = document.createElement('gwc-stat-card');
    statCard.setConfig(statData);

    statCard.addEventListener('gwc-stat-card-click', event => {
        document.querySelectorAll('#statCardsContainer gwc-stat-card').forEach(card => {
            card.removeAttribute('selected');
        });

        statCard.setAttribute('selected', 'true');

        inspectorPanel.setConfig({
            title: statData.label,
            subtitle: 'Selected stat',
            description: statData.description || 'No description provided.',
            icon: statData.icon || '📈',
            eventName: 'gwc-stat-card-click',
            fields: [
                { label: 'Value', value: statData.value },
                { label: 'Delta', value: statData.delta || 'none' },
                { label: 'Tone', value: statData.tone || 'neutral' },
                { label: 'Variant', value: statData.variant || 'card' },
                { label: 'ID', value: statData.id || 'none' }
            ]
        });
    });

    wrapper.appendChild(statCard);

    return wrapper;
}

export function initStatCardDemo(statExamples) {
    const container = document.getElementById('statCardsContainer');
    const inspectorPanel = document.getElementById('statCardInspector');

    if (!container || !inspectorPanel) return;

    inspectorPanel.clear();

    statExamples.forEach(statData => {
        container.appendChild(createStatCard(statData, inspectorPanel));
    });
}