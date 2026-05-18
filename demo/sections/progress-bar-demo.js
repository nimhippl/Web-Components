function createProgressExample(config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'progress-example-card';

    const progress = document.createElement('gwc-progress-bar');
    progress.setConfig(config);

    wrapper.appendChild(progress);

    return wrapper;
}

function updateProgressEventPanel(panel, eventName, detail) {
    panel.setConfig({
        title: eventName === 'gwc-progress-complete' ? 'Progress completed' : 'Progress changed',
        subtitle: 'Progress event',
        description: 'This panel shows how your game can react to progress updates.',
        icon: eventName === 'gwc-progress-complete' ? '✅' : '📊',
        eventName,
        fields: [
            { label: 'Value', value: detail.value },
            { label: 'Max', value: detail.max },
            { label: 'Percent', value: `${Math.round(detail.percent)}%` },
            { label: 'Complete', value: detail.complete }
        ]
    });
}

export function initProgressBarDemo(progressExamples) {
    const interactiveProgress = document.getElementById('interactiveProgress');
    const progressEventPanel = document.getElementById('progressEventPanel');
    const progressExamplesContainer = document.getElementById('progressExamplesContainer');

    const decreaseButton = document.getElementById('decreaseProgress');
    const increaseButton = document.getElementById('increaseProgress');
    const completeButton = document.getElementById('completeProgress');
    const resetButton = document.getElementById('resetProgress');

    if (!interactiveProgress || !progressEventPanel || !progressExamplesContainer) return;

    const resetConfig = {
        value: 1250,
        max: 2000,
        label: 'Interactive XP Progress',
        description: 'Use the controls below to update progress and trigger events.',
        suffix: 'XP',
        tone: 'xp',
        variant: 'line',
        showValue: true,
        showPercent: true,
        animated: true,
        striped: true,
        completedLabel: 'Level ready'
    };

    interactiveProgress.setConfig(resetConfig);

    decreaseButton?.addEventListener('click', () => {
        const config = interactiveProgress.getConfig();
        interactiveProgress.setValue(Math.max(0, config.value - 250));
    });

    increaseButton?.addEventListener('click', () => {
        const config = interactiveProgress.getConfig();
        interactiveProgress.setValue(config.value + 250);
    });

    completeButton?.addEventListener('click', () => {
        const config = interactiveProgress.getConfig();
        interactiveProgress.setValue(config.max);
    });

    resetButton?.addEventListener('click', () => {
        interactiveProgress.setConfig(resetConfig);
        progressEventPanel.clear();
    });

    interactiveProgress.addEventListener('gwc-progress-change', event => {
        updateProgressEventPanel(progressEventPanel, 'gwc-progress-change', event.detail);
    });

    interactiveProgress.addEventListener('gwc-progress-complete', event => {
        updateProgressEventPanel(progressEventPanel, 'gwc-progress-complete', event.detail);
    });

    progressExamples.forEach(config => {
        progressExamplesContainer.appendChild(createProgressExample(config));
    });
}