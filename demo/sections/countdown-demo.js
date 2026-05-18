function updateCountdownInspector(panel, eventName, detail) {
    panel.setConfig({
        title: eventName.replace('gwc-countdown-', 'Countdown '),
        subtitle: 'Countdown event',
        description: 'The app can react to countdown events, but server time should stay authoritative.',
        icon: detail.state === 'complete' ? '✅' : '⏱️',
        eventName,
        fields: [
            { label: 'State', value: detail.state },
            { label: 'Remaining', value: `${Math.ceil(detail.remainingMs / 1000)} sec` },
            { label: 'Progress', value: `${Math.round(detail.percent)}%` },
            { label: 'Days', value: detail.parts.days },
            { label: 'Hours', value: detail.parts.hours },
            { label: 'Minutes', value: detail.parts.minutes },
            { label: 'Seconds', value: detail.parts.seconds }
        ]
    });
}

function createCountdownExample(config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'countdown-example-card';

    const countdown = document.createElement('gwc-countdown');
    countdown.setConfig({
        ...config,
        showControls: false
    });

    wrapper.appendChild(countdown);

    return wrapper;
}

export function initCountdownDemo(countdownExamples) {
    const interactiveCountdown = document.getElementById('interactiveCountdown');
    const countdownInspector = document.getElementById('countdownInspector');
    const countdownExamplesContainer = document.getElementById('countdownExamplesContainer');
    const addTimeButton = document.getElementById('addCountdownTime');
    const shortCountdownButton = document.getElementById('shortCountdown');

    if (!interactiveCountdown || !countdownInspector || !countdownExamplesContainer) return;

    countdownInspector.clear();

    addTimeButton?.addEventListener('click', () => {
        interactiveCountdown.addTime(30);
    });

    shortCountdownButton?.addEventListener('click', () => {
        interactiveCountdown.setConfig({
            label: 'Short cooldown',
            description: 'A short countdown for quick testing.',
            duration: 10,
            tone: 'warning',
            variant: 'card',
            showDays: false,
            showLabels: true,
            showControls: true,
            completeLabel: 'Cooldown ready'
        });
    });

    [
        'gwc-countdown-start',
        'gwc-countdown-pause',
        'gwc-countdown-reset',
        'gwc-countdown-complete'
    ].forEach(eventName => {
        interactiveCountdown.addEventListener(eventName, event => {
            updateCountdownInspector(countdownInspector, eventName, event.detail);
        });
    });

    interactiveCountdown.addEventListener('gwc-countdown-tick', event => {
        updateCountdownInspector(countdownInspector, 'gwc-countdown-tick', event.detail);
    });

    countdownExamples.forEach(config => {
        countdownExamplesContainer.appendChild(createCountdownExample(config));
    });
}