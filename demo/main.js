import '../dist/index.js';

import { renderDemoPage } from './render-page.js';

import {
    players,
    progressExamples,
    countdownExamples,
    statExamples,
    playerCardExamples,
    questExamples,
    inventorySlotExamples,
    badges,
    streakMasterReward,
    rewards,
    revealRewards,
    emblems,
    emblemShapes,
    emblemSelectionOptions
} from './data.js';

import { createThemeSwitcher } from './helpers.js';
import { initLeaderboardDemo } from './sections/leaderboard-demo.js';
import { initBadgeDemo } from './sections/badge-demo.js';
import { initRewardCardsDemo } from './sections/reward-card-demo.js';
import { initEmblemDemo } from './sections/emblem-demo.js';
import { initRewardRevealDemo } from './sections/reward-reveal-demo.js';
import { initProgressBarDemo } from './sections/progress-bar-demo.js';
import { initStatCardDemo } from './sections/stat-card-demo.js';
import { initPlayerCardDemo } from './sections/player-card-demo.js';
import { initQuestListDemo } from './sections/quest-list-demo.js';
import { initInventorySlotDemo } from './sections/inventory-slot-demo.js';
import { initInventoryGridDemo } from './sections/inventory-grid-demo.js';
import { initCountdownDemo } from './sections/countdown-demo.js';

await renderDemoPage();

const leaderboard = initLeaderboardDemo(players);

initProgressBarDemo(progressExamples);
initStatCardDemo(statExamples);
initPlayerCardDemo(playerCardExamples);
initQuestListDemo(questExamples);
initInventorySlotDemo(inventorySlotExamples);
initInventoryGridDemo(inventorySlotExamples);
initBadgeDemo(badges, streakMasterReward);
initRewardCardsDemo(rewards);
initRewardRevealDemo(revealRewards);
initEmblemDemo(emblems, emblemShapes, emblemSelectionOptions);
initCountdownDemo(countdownExamples);

function applyThemeToTarget(target, theme) {
    if (target === 'leaderboard') {
        leaderboard?.setAttribute('theme', theme);
        return;
    }

    if (target === 'progress-bar') {
        document.querySelectorAll('gwc-progress-bar').forEach(progressBar => {
            progressBar.setAttribute('theme', theme);
        });

        document.querySelectorAll('#progressEventPanel').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'stat-card') {
        document.querySelectorAll('gwc-stat-card').forEach(statCard => {
            statCard.setAttribute('theme', theme);
        });

        document.querySelectorAll('#statCardInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'player-card') {
        document.querySelectorAll('gwc-player-card').forEach(playerCard => {
            playerCard.setAttribute('theme', theme);
        });

        document.querySelectorAll('#playerCardInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'quest-list') {
        document.querySelectorAll('gwc-quest-list').forEach(questList => {
            questList.setAttribute('theme', theme);
        });

        document.querySelectorAll('#questListInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'inventory-slot') {
        document.querySelectorAll('gwc-inventory-slot').forEach(slot => {
            slot.setAttribute('theme', theme);
        });

        document.querySelectorAll('#inventorySlotInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'inventory-grid') {
        document.querySelectorAll('gwc-inventory-grid').forEach(grid => {
            grid.setAttribute('theme', theme);
        });

        document.querySelectorAll('#inventoryGridInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'badge') {
        document.querySelectorAll('gwc-badge').forEach(badge => {
            badge.setAttribute('theme', theme);
        });

        document.querySelectorAll('#claimableRewardDemo gwc-reward-card').forEach(rewardCard => {
            rewardCard.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'reward-card') {
        document.querySelectorAll('#rewardsContainer gwc-reward-card').forEach(rewardCard => {
            rewardCard.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'reward-reveal') {
        document.querySelectorAll('gwc-reward-reveal').forEach(rewardReveal => {
            rewardReveal.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'emblem') {
        document.querySelectorAll('gwc-emblem').forEach(emblem => {
            emblem.setAttribute('theme', theme);
        });

        document.querySelectorAll('gwc-inspector-panel').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }

    if (target === 'countdown') {
        document.querySelectorAll('gwc-countdown').forEach(countdown => {
            countdown.setAttribute('theme', theme);
        });

        document.querySelectorAll('#countdownInspector').forEach(panel => {
            panel.setAttribute('theme', theme);
        });

        return;
    }
}

createThemeSwitcher(applyThemeToTarget);