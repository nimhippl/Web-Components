function getQuestById(quests, id) {
    return quests.find(quest => String(quest.id) === String(id));
}

function updateQuestInspector(panel, eventName, quest) {
    panel.setConfig({
        title: quest.title,
        subtitle: 'Selected quest',
        description: quest.description || quest.lockedReason || 'No description provided.',
        icon: quest.icon || '📜',
        eventName,
        fields: [
            { label: 'State', value: quest.state },
            { label: 'Difficulty', value: quest.difficulty || 'normal' },
            { label: 'Category', value: quest.category || 'none' },
            { label: 'Progress', value: quest.progress ? `${quest.progress.value} / ${quest.progress.max}` : 'none' },
            { label: 'Rewards', value: quest.rewards ? quest.rewards.length : 0 },
            { label: 'ID', value: quest.id }
        ]
    });
}

export function initQuestListDemo(questExamples) {
    const questList = document.getElementById('questListDemo');
    const inspectorPanel = document.getElementById('questListInspector');

    if (!questList || !inspectorPanel) return;

    const quests = questExamples.map(quest => ({
        ...quest,
        progress: quest.progress ? { ...quest.progress } : undefined,
        rewards: quest.rewards ? quest.rewards.map(reward => ({ ...reward })) : []
    }));

    inspectorPanel.clear();
    questList.setQuests(quests);

    questList.addEventListener('gwc-quest-click', event => {
        updateQuestInspector(inspectorPanel, 'gwc-quest-click', event.detail.quest);
    });

    questList.addEventListener('gwc-quest-claim', event => {
        const quest = getQuestById(quests, event.detail.id);

        if (!quest) return;

        quest.state = 'claimed';
        quest.description = `${quest.description || quest.title} Reward already claimed.`;

        questList.setQuests(quests);
        updateQuestInspector(inspectorPanel, 'gwc-quest-claim', quest);
    });

    questList.addEventListener('gwc-quest-filter-change', event => {
        inspectorPanel.setConfig({
            title: 'Quest filter changed',
            subtitle: 'Quest list event',
            description: 'The app can use this event to persist selected quest tabs or load remote quest data.',
            icon: '🔎',
            eventName: 'gwc-quest-filter-change',
            fields: [
                { label: 'Filter', value: event.detail.filter }
            ]
        });
    });
}