export const players = [
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
        name: 'ThunderBolt',
        score: 1580,
        previousRank: 5,
        avatar: 'https://i.pravatar.cc/150?img=5',
        details: [
            { label: 'Class', value: 'Storm Archer' },
            { label: 'Level', value: 18 },
            { label: 'Wins', value: 42 },
            { label: 'Guild', value: 'Lightning Order' }
        ]
    },
    {
        id: 6,
        name: 'IceQueen',
        score: 1420,
        previousRank: 7
    },
    {
        id: 7,
        name: 'FireStarter',
        score: 1290,
        previousRank: 6,
        avatar: 'https://i.pravatar.cc/150?img=7'
    },
    {
        id: 8,
        name: 'LightningFast',
        score: 1150,
        previousRank: 8
    },
];

export const badges = [
    {
        id: 1,
        name: 'First Win',
        description: 'Win your first game. No reward to claim.',
        icon: '🏆',
        rarity: 'common',
        state: 'unlocked',
        unlockedAt: new Date('2024-01-15')
    },
    {
        id: 2,
        name: 'Century Club',
        description: 'Reward already claimed: 250 XP.',
        icon: '💯',
        rarity: 'rare',
        state: 'claimed',
        claimedAt: new Date('2024-02-20')
    },
    {
        id: 3,
        name: 'Streak Master',
        description: 'Win 10 games in a row. Reward: 100 coins.',
        icon: '🔥',
        rarity: 'epic',
        state: 'claimable',
        progress: 10,
        maxProgress: 10
    },
    {
        id: 4,
        name: 'Legendary Hero',
        description: 'Reach the top rank. Achievement unlocked automatically.',
        icon: '👑',
        rarity: 'legendary',
        state: 'unlocked',
        unlockedAt: new Date('2024-04-05')
    },
    {
        id: 5,
        name: 'Team Player',
        description: 'Play 50 team games. Reward unlocks at completion.',
        icon: '🤝',
        rarity: 'rare',
        state: 'locked',
        progress: 32,
        maxProgress: 50
    },
    {
        id: 6,
        name: 'Speed Demon',
        description: 'Complete a game in under 1 minute.',
        icon: '⚡',
        rarity: 'epic',
        state: 'hidden'
    }
];

export const streakMasterReward = {
    id: 'streak-master-coins',
    name: '100 Coins',
    description: 'Reward for winning 10 games in a row.',
    icon: '🪙',
    type: 'coins',
    amount: 100,
    rarity: 'epic',
    state: 'claimable'
};

export const rewards = [
    {
        id: 'coins-100',
        name: '100 Coins',
        description: 'Currency reward for completing the objective.',
        icon: '🪙',
        type: 'coins',
        amount: 100,
        rarity: 'common',
        state: 'claimable'
    },
    {
        id: 'xp-250',
        name: '250 XP',
        description: 'Experience reward already collected.',
        icon: '✨',
        type: 'xp',
        amount: 250,
        rarity: 'rare',
        state: 'claimed',
        claimedAt: new Date('2024-02-20')
    },
    {
        id: 'rare-sword',
        name: 'Rare Sword',
        description: 'A weapon reward for advanced quests.',
        icon: '⚔️',
        type: 'item',
        amount: 1,
        rarity: 'rare',
        state: 'claimable'
    },
    {
        id: 'legendary-chest',
        name: 'Legendary Chest',
        description: 'Complete the season challenge to unlock.',
        icon: '🎁',
        type: 'chest',
        amount: 1,
        rarity: 'legendary',
        state: 'locked'
    },
    {
        id: 'speed-boost',
        name: 'Speed Boost',
        description: 'Temporary movement speed bonus.',
        icon: '⚡',
        type: 'boost',
        amount: '15 min',
        rarity: 'epic',
        state: 'claimable'
    },
    {
        id: 'hero-skin',
        name: 'Hero Skin',
        description: 'Cosmetic reward already claimed.',
        icon: '🎨',
        type: 'skin',
        amount: 1,
        rarity: 'epic',
        state: 'claimed',
        claimedAt: new Date('2024-04-01')
    }
];

export const emblems = [
    {
        id: 'defender',
        name: 'Defender',
        description: 'Unlocked role emblem.',
        icon: '🛡️',
        rarity: 'common',
        state: 'unlocked',
        shape: 'shield'
    },
    {
        id: 'guardian',
        name: 'Guardian',
        description: 'Claimed protection emblem.',
        icon: '🛡️',
        rarity: 'rare',
        state: 'claimed',
        shape: 'shield'
    },
    {
        id: 'fortress',
        name: 'Fortress',
        description: 'Reward is ready to claim.',
        icon: '🛡️',
        rarity: 'epic',
        state: 'claimable',
        shape: 'shield'
    },
    {
        id: 'immortal',
        name: 'Immortal',
        description: 'Legendary unlocked emblem.',
        icon: '🛡️',
        rarity: 'legendary',
        state: 'unlocked',
        shape: 'shield'
    },
    {
        id: 'wall',
        name: 'Wall',
        description: 'Locked defense emblem.',
        icon: '🛡️',
        rarity: 'rare',
        state: 'locked',
        shape: 'shield'
    },
    {
        id: 'secret-order',
        name: 'Secret Order',
        description: 'Hidden faction emblem.',
        icon: '🛡️',
        rarity: 'epic',
        state: 'hidden',
        shape: 'shield'
    }
];

export const emblemShapes = [
    {
        id: 'shape-shield',
        name: 'Shield',
        description: 'Classic defense emblem shape.',
        icon: '🛡️',
        rarity: 'common',
        state: 'unlocked',
        shape: 'shield'
    },
    {
        id: 'shape-circle',
        name: 'Circle',
        description: 'Good for profile badges and medals.',
        icon: '⭐',
        rarity: 'rare',
        state: 'unlocked',
        shape: 'circle'
    },
    {
        id: 'shape-hex',
        name: 'Hex',
        description: 'Good for factions and classes.',
        icon: '⚔️',
        rarity: 'epic',
        state: 'unlocked',
        shape: 'hex'
    },
    {
        id: 'shape-diamond',
        name: 'Diamond',
        description: 'Good for rare ranks and special emblems.',
        icon: '✨',
        rarity: 'legendary',
        state: 'unlocked',
        shape: 'diamond'
    }
];

export const emblemSelectionOptions = [
    {
        id: 'role-defender',
        name: 'Defender',
        description: 'Tank role emblem. Good for players who protect the team.',
        icon: '🛡️',
        rarity: 'rare',
        state: 'unlocked',
        shape: 'shield'
    },
    {
        id: 'role-mage',
        name: 'Mage',
        description: 'Magic class emblem. Good for spell-based characters.',
        icon: '✨',
        rarity: 'epic',
        state: 'unlocked',
        shape: 'diamond'
    },
    {
        id: 'faction-order',
        name: 'Order',
        description: 'Faction emblem for players aligned with the royal order.',
        icon: '🔰',
        rarity: 'common',
        state: 'unlocked',
        shape: 'circle'
    },
    {
        id: 'rank-champion',
        name: 'Champion',
        description: 'Rank emblem unlocked after winning the seasonal tournament.',
        icon: '⚔️',
        rarity: 'legendary',
        state: 'claimable',
        shape: 'hex'
    }
];

export const revealRewards = [
    {
        id: 'reveal-coins-500',
        name: '500 Coins',
        description: 'Currency reward for completing the quest.',
        icon: '🪙',
        type: 'coins',
        amount: 500,
        rarity: 'common',
        state: 'claimable'
    },
    {
        id: 'reveal-xp-750',
        name: '750 XP',
        description: 'Experience boost for your next level.',
        icon: '✨',
        type: 'xp',
        amount: 750,
        rarity: 'rare',
        state: 'claimable'
    },
    {
        id: 'reveal-sword',
        name: 'Rare Sword',
        description: 'A weapon reward for advanced quests.',
        icon: '⚔️',
        type: 'item',
        amount: 1,
        rarity: 'epic',
        state: 'claimable'
    },
    {
        id: 'reveal-chest',
        name: 'Mystery Chest',
        description: 'A visual chest reward. Rewards are provided by your game logic.',
        icon: '🎁',
        type: 'chest',
        amount: 1,
        rarity: 'legendary',
        state: 'claimable'
    }
];

export const progressExamples = [
    {
        id: 'xp',
        value: 1250,
        max: 2000,
        label: 'XP Progress',
        description: 'Player experience toward the next level.',
        suffix: 'XP',
        tone: 'xp',
        variant: 'line',
        showValue: true,
        showPercent: true,
        animated: true,
        striped: true
    },
    {
        id: 'health',
        value: 75,
        max: 100,
        label: 'Health',
        description: 'Current player health.',
        suffix: 'HP',
        tone: 'health',
        variant: 'compact',
        showValue: true,
        showPercent: false
    },
    {
        id: 'mana',
        value: 42,
        max: 80,
        label: 'Mana',
        description: 'Available spell resource.',
        suffix: 'MP',
        tone: 'mana',
        variant: 'compact',
        showValue: true,
        showPercent: true
    },
    {
        id: 'quest',
        value: 4,
        max: 5,
        label: 'Quest Progress',
        description: 'Collect 5 crystals to complete the quest.',
        suffix: 'crystals',
        tone: 'success',
        variant: 'line',
        showValue: true,
        showPercent: false,
        completedLabel: 'Quest complete'
    },
    {
        id: 'daily',
        value: 3,
        max: 5,
        label: 'Daily Steps',
        description: 'Segmented progress for daily reward steps.',
        tone: 'warning',
        variant: 'segmented',
        segments: 5,
        showValue: true,
        showPercent: false,
        completedLabel: 'Daily reward ready'
    }
];

export const statExamples = [
    {
        id: 'level',
        label: 'Level',
        value: 12,
        icon: '⭐',
        description: 'Current player level.',
        delta: '+2',
        deltaLabel: 'since last week',
        tone: 'xp',
        variant: 'card'
    },
    {
        id: 'power',
        label: 'Power',
        value: 540,
        icon: '⚔️',
        description: 'Combined combat power.',
        delta: '+25',
        deltaLabel: 'gear bonus',
        tone: 'danger',
        variant: 'card'
    },
    {
        id: 'wins',
        label: 'Wins',
        value: 32,
        icon: '🏆',
        description: 'Total ranked wins.',
        delta: '+4',
        deltaLabel: 'this season',
        tone: 'success',
        variant: 'card'
    },
    {
        id: 'coins',
        label: 'Coins',
        value: '1,500',
        icon: '🪙',
        description: 'Available soft currency.',
        delta: '+300',
        deltaLabel: 'quest rewards',
        tone: 'gold',
        variant: 'card'
    },
    {
        id: 'defense',
        label: 'Defense',
        value: 82,
        icon: '🛡️',
        description: 'Damage reduction score.',
        delta: '-3',
        deltaLabel: 'after debuff',
        tone: 'health',
        variant: 'compact'
    },
    {
        id: 'mana',
        label: 'Mana',
        value: 64,
        icon: '🔮',
        description: 'Available magic resource.',
        delta: '+12',
        deltaLabel: 'artifact bonus',
        tone: 'mana',
        variant: 'compact'
    }
];

export const playerCardExamples = [
    {
        id: 'mystic-mage',
        name: 'MysticMage',
        title: 'Arcane damage dealer',
        initials: 'MM',
        level: 12,
        rank: 'Gold',
        score: '1,750 XP',
        status: 'online',
        isCurrentPlayer: true,
        tone: 'xp',
        variant: 'card',
        stats: [
            { label: 'Power', value: 540, icon: '⚔️', tone: 'danger' },
            { label: 'Wins', value: 32, icon: '🏆', tone: 'success' },
            { label: 'Mana', value: 64, icon: '🔮', tone: 'mana' }
        ],
        emblems: [
            { id: 'guardian', name: 'Guardian', icon: '🛡️', rarity: 'rare' },
            { id: 'streak', name: 'Streak Master', icon: '🔥', rarity: 'epic' },
            { id: 'legend', name: 'Legend', icon: '👑', rarity: 'legendary' }
        ],
        progress: {
            value: 1250,
            max: 2000,
            label: 'Next level',
            suffix: 'XP',
            tone: 'xp'
        }
    },
    {
        id: 'dragon-slayer',
        name: 'DragonSlayer',
        title: 'Frontline warrior',
        avatar: 'https://i.pravatar.cc/150?img=3',
        level: 18,
        rank: 'Platinum',
        score: '1,920 XP',
        status: 'busy',
        tone: 'danger',
        variant: 'card',
        stats: [
            { label: 'Power', value: 720, icon: '⚔️', tone: 'danger' },
            { label: 'Defense', value: 88, icon: '🛡️', tone: 'health' },
            { label: 'Wins', value: 41, icon: '🏆', tone: 'success' }
        ],
        emblems: [
            { id: 'dragon', name: 'Dragon Hunter', icon: '🐉', rarity: 'legendary' },
            { id: 'shield', name: 'Defender', icon: '🛡️', rarity: 'rare' }
        ],
        progress: {
            value: 72,
            max: 100,
            label: 'HP',
            suffix: 'HP',
            tone: 'health'
        }
    },
    {
        id: 'shadow-ninja',
        name: 'ShadowNinja',
        title: 'Stealth specialist',
        avatar: 'https://i.pravatar.cc/150?img=2',
        level: 15,
        rank: 'Diamond',
        score: '2,450 XP',
        status: 'away',
        tone: 'warning',
        variant: 'compact',
        stats: [
            { label: 'Speed', value: 94, icon: '⚡', tone: 'stamina' },
            { label: 'Wins', value: 55, icon: '🏆', tone: 'success' }
        ],
        emblems: [
            { id: 'shadow', name: 'Shadow Order', icon: '🌙', rarity: 'epic' }
        ],
        progress: {
            value: 44,
            max: 60,
            label: 'Stamina',
            suffix: 'SP',
            tone: 'stamina'
        }
    }
];

export const questExamples = [
    {
        id: 'daily-crystals',
        title: 'Collect crystals',
        description: 'Collect 5 crystals in the forest zone.',
        icon: '💎',
        category: 'Daily',
        difficulty: 'normal',
        state: 'active',
        progress: {
            value: 4,
            max: 5,
            label: 'Crystals',
            suffix: 'items'
        },
        rewards: [
            { id: 'coins-300', name: 'Coins', icon: '🪙', amount: 300, rarity: 'common', type: 'coins' },
            { id: 'xp-150', name: 'XP', icon: '✨', amount: 150, rarity: 'rare', type: 'xp' }
        ]
    },
    {
        id: 'win-streak',
        title: 'Win streak',
        description: 'Win 3 matches in a row.',
        icon: '🔥',
        category: 'Weekly',
        difficulty: 'epic',
        state: 'claimable',
        progress: {
            value: 3,
            max: 3,
            label: 'Wins',
            suffix: 'matches'
        },
        rewards: [
            { id: 'coins-1000', name: 'Coins', icon: '🪙', amount: 1000, rarity: 'rare', type: 'coins' },
            { id: 'streak-emblem', name: 'Streak emblem', icon: '🔥', amount: 1, rarity: 'epic', type: 'item' }
        ],
        claimLabel: 'Claim quest reward'
    },
    {
        id: 'dragon-hunter',
        title: 'Dragon hunter',
        description: 'Defeat the seasonal dragon boss.',
        icon: '🐉',
        category: 'Season',
        difficulty: 'legendary',
        state: 'locked',
        lockedReason: 'Unlocks after reaching level 20.',
        progress: {
            value: 0,
            max: 1,
            label: 'Boss defeated',
            suffix: 'boss'
        },
        rewards: [
            { id: 'legendary-chest', name: 'Legendary chest', icon: '🎁', amount: 1, rarity: 'legendary', type: 'chest' }
        ]
    },
    {
        id: 'tutorial-complete',
        title: 'Complete tutorial',
        description: 'Finish the starting tutorial.',
        icon: '📘',
        category: 'Story',
        difficulty: 'easy',
        state: 'claimed',
        progress: {
            value: 1,
            max: 1,
            label: 'Tutorial',
            suffix: 'step'
        },
        rewards: [
            { id: 'starter-coins', name: 'Coins', icon: '🪙', amount: 100, rarity: 'common', type: 'coins' }
        ]
    },
    {
        id: 'arena-master',
        title: 'Arena master',
        description: 'Play 10 arena battles this season.',
        icon: '⚔️',
        category: 'Arena',
        difficulty: 'hard',
        state: 'completed',
        progress: {
            value: 10,
            max: 10,
            label: 'Arena battles',
            suffix: 'battles'
        },
        rewards: [
            { id: 'arena-xp', name: 'XP', icon: '✨', amount: 500, rarity: 'rare', type: 'xp' }
        ]
    }
];

export const inventorySlotExamples = [
    {
        slotId: 'weapon-1',
        state: 'filled',
        action: 'equip',
        actionLabel: 'Equip',
        item: {
            id: 'rare-sword',
            name: 'Rare Sword',
            description: 'A balanced sword for advanced quests.',
            icon: '⚔️',
            type: 'weapon',
            rarity: 'rare',
            quantity: 1,
            durability: 82,
            maxDurability: 100,
            level: 12
        }
    },
    {
        slotId: 'armor-1',
        state: 'equipped',
        action: 'unequip',
        actionLabel: 'Unequip',
        item: {
            id: 'guardian-shield',
            name: 'Guardian Shield',
            description: 'Equipped defensive item.',
            icon: '🛡️',
            type: 'armor',
            rarity: 'epic',
            quantity: 1,
            durability: 64,
            maxDurability: 100,
            level: 10
        }
    },
    {
        slotId: 'potion-1',
        state: 'filled',
        action: 'use',
        actionLabel: 'Use',
        item: {
            id: 'health-potion',
            name: 'Health Potion',
            description: 'Restores 50 HP.',
            icon: '🧪',
            type: 'consumable',
            rarity: 'common',
            quantity: 8,
            maxQuantity: 20
        }
    },
    {
        slotId: 'boost-1',
        state: 'cooldown',
        action: 'use',
        actionLabel: 'Use',
        item: {
            id: 'speed-boost',
            name: 'Speed Boost',
            description: 'Temporary movement speed bonus.',
            icon: '⚡',
            type: 'consumable',
            rarity: 'epic',
            quantity: 2,
            cooldownRemaining: 42,
            cooldownTotal: 90
        }
    },
    {
        slotId: 'skin-1',
        state: 'locked',
        action: 'inspect',
        actionLabel: 'Inspect',
        lockedReason: 'Unlocks after reaching Diamond rank.',
        item: {
            id: 'hero-skin',
            name: 'Hero Skin',
            description: 'Cosmetic player skin.',
            icon: '🎨',
            type: 'skin',
            rarity: 'legendary',
            quantity: 1
        }
    },
    {
        slotId: 'material-1',
        state: 'filled',
        action: 'craft',
        actionLabel: 'Craft',
        item: {
            id: 'ancient-fragment',
            name: 'Ancient Fragment',
            description: 'Crafting material for legendary gear.',
            icon: '🔷',
            type: 'material',
            rarity: 'rare',
            quantity: 24,
            maxQuantity: 99
        }
    },
    {
        slotId: 'empty-1',
        state: 'empty',
        action: 'inspect',
        emptyText: 'Empty slot'
    },
    {
        slotId: 'locked-1',
        state: 'locked',
        action: 'inspect',
        emptyText: 'Locked slot',
        lockedReason: 'Unlocks after upgrading inventory capacity.'
    }
];

export const countdownExamples = [
    {
        id: 'daily-reward',
        label: 'Daily reward',
        description: 'Next daily reward becomes available soon.',
        duration: 90,
        tone: 'gold',
        variant: 'card',
        autoStart: true,
        completeLabel: 'Daily reward ready'
    },
    {
        id: 'boost-cooldown',
        label: 'Speed boost cooldown',
        description: 'Temporary speed boost is recharging.',
        duration: 45,
        tone: 'warning',
        variant: 'compact',
        autoStart: true,
        completeLabel: 'Boost ready'
    },
    {
        id: 'event-end',
        label: 'Season event ends',
        description: 'Event countdown based on duration for demo purposes.',
        duration: 172800,
        tone: 'danger',
        variant: 'card',
        autoStart: true,
        completeLabel: 'Event ended'
    }
];
