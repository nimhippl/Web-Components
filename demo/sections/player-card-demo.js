function createPlayerCard(playerData, inspectorPanel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'player-card-demo-item';

    const playerCard = document.createElement('gwc-player-card');
    playerCard.setConfig(playerData);

    playerCard.addEventListener('gwc-player-card-click', event => {
        document.querySelectorAll('#playerCardsContainer gwc-player-card').forEach(card => {
            card.removeAttribute('selected');
        });

        playerCard.setAttribute('selected', 'true');

        inspectorPanel.setConfig({
            title: playerData.name,
            subtitle: 'Selected player',
            description: playerData.title || 'No title provided.',
            image: playerData.avatar || undefined,
            icon: playerData.avatar ? undefined : playerData.initials || '👤',
            eventName: 'gwc-player-card-click',
            fields: [
                { label: 'Level', value: playerData.level || 'none' },
                { label: 'Rank', value: playerData.rank || 'none' },
                { label: 'Score', value: playerData.score || 'none' },
                { label: 'Status', value: playerData.status || 'offline' },
                { label: 'Current player', value: Boolean(playerData.isCurrentPlayer) },
                { label: 'ID', value: playerData.id || 'none' }
            ]
        });
    });

    wrapper.appendChild(playerCard);

    return wrapper;
}

export function initPlayerCardDemo(playerCardExamples) {
    const container = document.getElementById('playerCardsContainer');
    const inspectorPanel = document.getElementById('playerCardInspector');

    if (!container || !inspectorPanel) return;

    inspectorPanel.clear();

    playerCardExamples.forEach(playerData => {
        container.appendChild(createPlayerCard(playerData, inspectorPanel));
    });
}