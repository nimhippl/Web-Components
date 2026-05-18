function renderEventLog(logElement, lines) {
    logElement.innerHTML = `
    <div class="demo-event-log-title">Reward reveal events</div>
    ${lines.map(line => `<div class="demo-event-log-line">${line}</div>`).join('')}
  `;
}

function createLogLine(eventName, detail) {
    const rewardName = detail.reward?.name ? ` · ${detail.reward.name}` : '';
    const rewardCount = detail.rewards?.length ? ` · rewards: ${detail.rewards.length}` : '';

    return `<code>${eventName}</code>${rewardName}${rewardCount} · state: ${detail.state}`;
}

export function initRewardRevealDemo(revealRewards) {
    const rewardReveal = document.getElementById('rewardRevealDemo');
    const eventLog = document.getElementById('rewardRevealEventLog');
    const openSequenceButton = document.getElementById('openRewardRevealSequence');
    const openAllButton = document.getElementById('openRewardRevealAll');
    const resetButton = document.getElementById('resetRewardReveal');
    const setActiveRevealMode = activeButton => {
        [openSequenceButton, openAllButton].forEach(button => {
            button?.classList.remove('active');
        });

        activeButton?.classList.add('active');
    };

    if (!rewardReveal || !eventLog) return;

    const logLines = [];

    const pushLog = (eventName, detail) => {
        logLines.unshift(createLogLine(eventName, detail));

        if (logLines.length > 8) {
            logLines.pop();
        }

        renderEventLog(eventLog, logLines);
    };

    rewardReveal.setRewards(revealRewards);
    renderEventLog(eventLog, ['Click “Open sequence reveal” or “Open all rewards”.']);

    openSequenceButton?.addEventListener('click', () => {
        setActiveRevealMode(openSequenceButton);

        rewardReveal.setAttribute('variant', 'chest');
        rewardReveal.setAttribute('mode', 'sequence');
        rewardReveal.reset();
        rewardReveal.open();
    });

    openAllButton?.addEventListener('click', () => {
        setActiveRevealMode(openAllButton);

        rewardReveal.setAttribute('variant', 'cards');
        rewardReveal.setAttribute('mode', 'all');
        rewardReveal.reset();
        rewardReveal.open();
    });

    resetButton?.addEventListener('click', () => {
        setActiveRevealMode(openSequenceButton);

        rewardReveal.setAttribute('variant', 'chest');
        rewardReveal.setAttribute('mode', 'sequence');
        rewardReveal.reset();

        logLines.length = 0;
        renderEventLog(eventLog, ['Reward reveal was reset.']);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-open', event => {
        pushLog('gwc-reward-reveal-open', event.detail);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-start', event => {
        pushLog('gwc-reward-reveal-start', event.detail);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-item', event => {
        pushLog('gwc-reward-reveal-item', event.detail);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-complete', event => {
        pushLog('gwc-reward-reveal-complete', event.detail);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-close', event => {
        pushLog('gwc-reward-reveal-close', event.detail);
    });

    rewardReveal.addEventListener('gwc-reward-reveal-reward-click', event => {
        pushLog('gwc-reward-reveal-reward-click', event.detail);
    });
}