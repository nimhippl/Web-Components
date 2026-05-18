import { setActiveButton } from '../helpers.js';

function getRankMap(entries) {
    const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
    const rankMap = new Map();

    sortedEntries.forEach((player, index) => {
        rankMap.set(player.id, index + 1);
    });

    return rankMap;
}

function rememberPreviousRanks(players) {
    const rankMap = getRankMap(players);

    players.forEach(player => {
        player.previousRank = rankMap.get(player.id);
    });
}

const rankModeDescriptions = {
    ordinal: {
        title: 'Ordinal rank',
        text: 'Same scores still get unique positions, using a stable tie-breaker. Example: 1, 2, 3.'
    },
    competition: {
        title: 'Competition rank',
        text: 'Tied players share the same rank, and the next rank is skipped. Example: 1, 1, 3.'
    },
    dense: {
        title: 'Dense rank',
        text: 'Tied players share the same rank, but the next rank is not skipped. Example: 1, 1, 2.'
    }
};

function updateRankModeTooltip(rankMode) {
    const tooltip = document.getElementById('rankModeTooltip');
    const data = rankModeDescriptions[rankMode] || rankModeDescriptions.ordinal;

    if (!tooltip) return;

    tooltip.setAttribute('tooltip-title', data.title);
    tooltip.setAttribute('text', data.text);
}

export function initLeaderboardDemo(players) {
    const leaderboard = document.getElementById('leaderboard1');

    if (!leaderboard) return null;

    leaderboard.setData(players);

    document.querySelectorAll('[data-variant]').forEach(button => {
        button.addEventListener('click', event => {
            const clickedButton = event.currentTarget;
            const variant = clickedButton.dataset.variant;

            leaderboard.setAttribute('variant', variant);
            setActiveButton(clickedButton, '[data-variant]');
        });
    });

    document.querySelectorAll('[data-rank-mode]').forEach(button => {
        button.addEventListener('click', event => {
            const clickedButton = event.currentTarget;
            const rankMode = clickedButton.dataset.rankMode;

            leaderboard.setAttribute('rank-mode', rankMode);
            setActiveButton(clickedButton, '[data-rank-mode]');
            updateRankModeTooltip(rankMode);
        });
    });

    document.getElementById('addPlayer')?.addEventListener('click', () => {
        rememberPreviousRanks(players);

        const names = ['CometStrike', 'PhoenixRise', 'StormBreaker', 'VoidWalker', 'StarGazer', 'NightHawk'];
        const shouldUseAvatar = Math.random() > 0.35;

        const newPlayer = {
            id: Date.now(),
            name: names[Math.floor(Math.random() * names.length)],
            score: Math.floor(Math.random() * 2000) + 500,
            previousRank: players.length + 1,
            avatar: shouldUseAvatar
                ? `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
                : undefined
        };

        players.push(newPlayer);
        leaderboard.setData(players);
    });

    document.getElementById('updateScores')?.addEventListener('click', () => {
        rememberPreviousRanks(players);

        players.forEach(player => {
            player.score += Math.floor(Math.random() * 300) - 80;

            if (player.score < 0) {
                player.score = 0;
            }
        });

        leaderboard.setData(players);
    });

    document.getElementById('resetLeaderboard')?.addEventListener('click', () => {
        players.length = 0;

        players.push(
            {
                id: 1,
                name: 'AlexTheGreat',
                score: 2450,
                previousRank: 2,
                avatar: 'https://i.pravatar.cc/150?img=1'
            },
            {
                id: 2,
                name: 'ShadowNinja',
                score: 2450,
                previousRank: 1,
                avatar: 'https://i.pravatar.cc/150?img=2'
            },
            {
                id: 3,
                name: 'DragonSlayer',
                score: 1920,
                previousRank: 4,
                avatar: 'https://i.pravatar.cc/150?img=3'
            },
            {
                id: 4,
                name: 'MysticMage',
                score: 1750,
                previousRank: 3,
                isCurrentPlayer: true
            },
            {
                id: 5,
                name: 'IceQueen',
                score: 1420,
                previousRank: 5
            }
        );

        leaderboard.setAttribute('variant', 'card');
        leaderboard.setAttribute('rank-mode', 'ordinal');

        setActiveButton(document.querySelector('[data-variant="card"]'), '[data-variant]');
        setActiveButton(document.querySelector('[data-rank-mode="ordinal"]'), '[data-rank-mode]');
        updateRankModeTooltip('ordinal');

        leaderboard.setData(players);
    });

    return leaderboard;
}