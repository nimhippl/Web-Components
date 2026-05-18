# GWC - Game Web Components

Zero-dependency game UI web components with TypeScript support, customizable themes, and framework-agnostic usage.

GWC is designed for gamification interfaces, browser games, dashboards, quests, rewards, inventories, leaderboards, player profiles, cooldowns, and achievement screens.

## Features

- Zero production dependencies
- TypeScript-ready
- Framework-agnostic Web Components
- Works with Vanilla JS, Vue, React, Angular, Rails views, and plain HTML
- Built-in themes
- Customizable through attributes, config objects, and CSS variables
- Shadow DOM encapsulation
- ESM package output

## Installation

```bash
npm install gwc
```

## Quick Start

```ts
import { GwcLeaderboard, type LeaderboardEntry } from 'gwc';

const leaderboard = document.querySelector('gwc-leaderboard') as GwcLeaderboard | null;

const entries: LeaderboardEntry[] = [
  { id: 1, name: 'Alice', score: 1250 },
  { id: 2, name: 'Bob', score: 980 }
];

leaderboard?.setData(entries);
```

```html
<gwc-leaderboard
  theme="default"
  title="Top Players"
  max-entries="10">
</gwc-leaderboard>
```

## Browser Usage

```html
<script type="module" src="./dist/index.js"></script>

<gwc-leaderboard title="Top Players"></gwc-leaderboard>
```

## Components

### Leaderboard

Ranked player list with scores, avatars, selected player flow, and rank modes.

```html
<gwc-leaderboard
  theme="default"
  title="Top Players"
  max-entries="10">
</gwc-leaderboard>
```

```ts
import { GwcLeaderboard, type LeaderboardEntry } from 'gwc';

const leaderboard = document.querySelector('gwc-leaderboard') as GwcLeaderboard | null;

const entries: LeaderboardEntry[] = [
  {
    id: 1,
    name: 'Alice',
    score: 1250,
    avatar: 'https://example.com/avatar.png'
  },
  {
    id: 2,
    name: 'Bob',
    score: 980
  }
];

leaderboard?.setData(entries);
```

#### Main attributes

- `theme` - theme name
- `title` - leaderboard title
- `max-entries` - maximum entries to display
- `variant` - visual variant
- `rank-mode` - ranking behavior

#### Main events

- `gwc-leaderboard-entry-click`

---

### Badge

Achievement badge with rarity, progress, and reward states.

#### Badge states

- `locked` - achievement is not completed yet
- `unlocked` - achievement is earned, no claim required
- `claimable` - achievement is completed and reward can be claimed
- `claimed` - reward has already been claimed
- `hidden` - secret badge state

```html
<gwc-badge
  theme="default"
  size="medium"
  show-name="true"
  show-description="true"
  show-progress="true"
  show-state-label="true"
  show-rarity="true"
  claim-label="Claim reward">
</gwc-badge>
```

```ts
import { GwcBadge, type BadgeConfig } from 'gwc';

const badge = document.querySelector('gwc-badge') as GwcBadge | null;

const config: BadgeConfig = {
  id: 'streak-master',
  name: 'Streak Master',
  description: 'Win 10 games in a row.',
  icon: '🔥',
  rarity: 'epic',
  state: 'claimable',
  progress: 10,
  maxProgress: 10
};

badge?.setConfig(config);

badge?.addEventListener('gwc-badge-claim', event => {
  const nextConfig: BadgeConfig = {
    ...event.detail.config,
    state: 'claimed',
    claimedAt: new Date()
  };

  badge.setConfig(nextConfig);
});
```

#### Main attributes

- `theme`
- `size`
- `show-name`
- `show-description`
- `show-progress`
- `show-state-label`
- `show-rarity`
- `claim-label`
- `hidden-label`

#### Main events

- `gwc-badge-click`
- `gwc-badge-claim`

---

### Reward Card

Single reward card for coins, XP, items, skins, boosts, and chests.

#### Reward states

- `claimable`
- `claimed`
- `locked`

```html
<gwc-reward-card
  theme="default"
  size="medium"
  show-description="true"
  show-rarity="true"
  show-amount="true"
  show-state-label="true"
  show-claim-button="true"
  claim-label="Claim reward">
</gwc-reward-card>
```

```ts
import { GwcRewardCard, type RewardConfig } from 'gwc';

const rewardCard = document.querySelector('gwc-reward-card') as GwcRewardCard | null;

const config: RewardConfig = {
  id: 'coins-100',
  name: '100 Coins',
  description: 'Currency reward for completing the objective.',
  icon: '🪙',
  type: 'coins',
  amount: 100,
  rarity: 'common',
  state: 'claimable'
};

rewardCard?.setConfig(config);

rewardCard?.addEventListener('gwc-reward-claim', event => {
  const nextConfig: RewardConfig = {
    ...event.detail.config,
    state: 'claimed',
    claimedAt: new Date()
  };

  rewardCard.setConfig(nextConfig);
});
```

#### Main attributes

- `theme`
- `size`
- `show-description`
- `show-rarity`
- `show-amount`
- `show-state-label`
- `show-claim-button`
- `claim-label`
- `claimable-label`
- `claimed-label`
- `locked-label`

#### Main events

- `gwc-reward-click`
- `gwc-reward-claim`

---

### Reward Reveal

Reward reveal flow for quest rewards, daily rewards, chest-style reveal screens, level-up rewards, and battle pass rewards.

```html
<gwc-reward-reveal
  theme="default"
  title="Quest rewards"
  subtitle="Open to reveal your rewards."
  variant="chest"
  mode="sequence"
  show-close="false"
  show-reset="true">
</gwc-reward-reveal>
```

```ts
import { GwcRewardReveal, type RewardConfig } from 'gwc';

const reveal = document.querySelector('gwc-reward-reveal') as GwcRewardReveal | null;

const rewards: RewardConfig[] = [
  {
    id: 'coins-500',
    name: '500 Coins',
    icon: '🪙',
    type: 'coins',
    amount: 500,
    rarity: 'common',
    state: 'claimable'
  },
  {
    id: 'rare-sword',
    name: 'Rare Sword',
    icon: '⚔️',
    type: 'item',
    amount: 1,
    rarity: 'epic',
    state: 'claimable'
  }
];

reveal?.setRewards(rewards);
reveal?.open();

reveal?.addEventListener('gwc-reward-reveal-complete', event => {
  const revealedRewards = event.detail.rewards;
  void revealedRewards;
});
```

#### Main attributes

- `theme`
- `title`
- `subtitle`
- `variant` - `panel`, `cards`, `chest`
- `mode` - `all`, `sequence`
- `show-close`
- `show-reset`
- `open-label`
- `next-label`
- `close-label`
- `reset-label`
- `empty-text`

#### Main methods

- `setRewards(rewards)`
- `setConfig(config)`
- `getRewards()`
- `getState()`
- `open()`
- `revealNext()`
- `reset()`
- `close()`

#### Main events

- `gwc-reward-reveal-open`
- `gwc-reward-reveal-start`
- `gwc-reward-reveal-item`
- `gwc-reward-reveal-complete`
- `gwc-reward-reveal-close`
- `gwc-reward-reveal-reward-click`

---

### Progress Bar

Progress bar for XP, HP, mana, stamina, quests, achievements, segmented progress, and battle pass progress.

```html
<gwc-progress-bar
  theme="default"
  value="75"
  max="100"
  label="Player Health"
  suffix="HP"
  tone="health"
  variant="line"
  show-value="true"
  show-percent="true">
</gwc-progress-bar>
```

```ts
import { GwcProgressBar, type ProgressBarConfig } from 'gwc';

const progress = document.querySelector('gwc-progress-bar') as GwcProgressBar | null;

const config: ProgressBarConfig = {
  value: 7,
  max: 10,
  label: 'Quest Progress',
  suffix: 'wins',
  tone: 'success',
  variant: 'line',
  showValue: true,
  showPercent: true
};

progress?.setConfig(config);
progress?.setProgress(10, 10);
```

#### Main attributes

- `theme`
- `value`
- `max`
- `label`
- `description`
- `suffix`
- `variant` - `line`, `compact`, `segmented`
- `tone` - `xp`, `health`, `mana`, `stamina`, `success`, `warning`, `danger`, `neutral`
- `show-value`
- `show-percent`
- `animated`
- `striped`
- `disabled`
- `completed-label`
- `segments`

#### Main methods

- `setConfig(config)`
- `getConfig()`
- `setValue(value)`
- `setMax(max)`
- `setProgress(value, max)`

#### Main events

- `gwc-progress-change`
- `gwc-progress-complete`

---

### Countdown

Countdown timer for daily reward reset, cooldowns, boosts, crafting, match preparation, and seasonal events.

```html
<gwc-countdown
  theme="default"
  label="Daily chest reset"
  description="Next chest becomes available soon."
  duration="3600"
  tone="gold"
  variant="card"
  auto-start="true"
  complete-label="Chest ready">
</gwc-countdown>
```

```ts
import { GwcCountdown, type CountdownConfig } from 'gwc';

const countdown = document.querySelector('gwc-countdown') as GwcCountdown | null;

const config: CountdownConfig = {
  label: 'Daily reward',
  description: 'Next daily reward becomes available soon.',
  duration: 3600,
  tone: 'gold',
  variant: 'card',
  autoStart: true,
  completeLabel: 'Reward ready'
};

countdown?.setConfig(config);

countdown?.addEventListener('gwc-countdown-complete', event => {
  const state = event.detail.state;
  void state;
});
```

#### Main attributes

- `theme`
- `label`
- `description`
- `end-at`
- `duration`
- `variant` - `card`, `compact`, `minimal`
- `tone` - `neutral`, `xp`, `success`, `warning`, `danger`, `gold`
- `auto-start`
- `show-days`
- `show-labels`
- `show-controls`
- `complete-label`
- `start-label`
- `pause-label`
- `resume-label`
- `reset-label`

#### Main methods

- `setConfig(config)`
- `getConfig()`
- `getState()`
- `getRemainingMs()`
- `start()`
- `pause()`
- `reset()`
- `setDuration(seconds)`
- `setEndAt(endAt)`
- `addTime(seconds)`

#### Main events

- `gwc-countdown-start`
- `gwc-countdown-pause`
- `gwc-countdown-reset`
- `gwc-countdown-tick`
- `gwc-countdown-complete`

---

### Stat Card

Compact stat card for level, power, wins, damage, defense, coins, rank, HP, mana, and XP.

```html
<gwc-stat-card
  theme="default"
  label="Power"
  value="540"
  icon="⚔️"
  delta="+25"
  tone="danger"
  variant="card">
</gwc-stat-card>
```

```ts
import { GwcStatCard, type StatCardConfig } from 'gwc';

const statCard = document.querySelector('gwc-stat-card') as GwcStatCard | null;

const config: StatCardConfig = {
  id: 'power',
  label: 'Power',
  value: 540,
  icon: '⚔️',
  description: 'Combined combat power.',
  delta: '+25',
  deltaLabel: 'gear bonus',
  tone: 'danger',
  variant: 'card'
};

statCard?.setConfig(config);
```

#### Main attributes

- `theme`
- `stat-id`
- `label`
- `value`
- `icon`
- `description`
- `delta`
- `delta-label`
- `tone`
- `variant` - `card`, `compact`, `minimal`
- `size` - `small`, `medium`, `large`
- `interactive`
- `selected`
- `show-description`
- `show-delta`

#### Main events

- `gwc-stat-card-click`

---

### Player Card

Player profile card for lobbies, match results, team lists, leaderboard details, and character selection.

```html
<gwc-player-card
  theme="default"
  name="MysticMage"
  title="Arcane damage dealer"
  level="12"
  rank="Gold"
  status="online">
</gwc-player-card>
```

```ts
import { GwcPlayerCard, type PlayerCardConfig } from 'gwc';

const playerCard = document.querySelector('gwc-player-card') as GwcPlayerCard | null;

const config: PlayerCardConfig = {
  id: 'mystic-mage',
  name: 'MysticMage',
  title: 'Arcane damage dealer',
  initials: 'MM',
  level: 12,
  rank: 'Gold',
  score: '1,750 XP',
  status: 'online',
  isCurrentPlayer: true,
  stats: [
    { label: 'Power', value: 540, icon: '⚔️', tone: 'danger' },
    { label: 'Wins', value: 32, icon: '🏆', tone: 'success' }
  ],
  emblems: [
    { id: 'guardian', name: 'Guardian', icon: '🛡️', rarity: 'rare' }
  ],
  progress: {
    value: 1250,
    max: 2000,
    label: 'Next level',
    suffix: 'XP',
    tone: 'xp'
  }
};

playerCard?.setConfig(config);
```

#### Main attributes

- `theme`
- `player-id`
- `name`
- `title`
- `avatar`
- `initials`
- `level`
- `rank`
- `score`
- `status` - `online`, `offline`, `busy`, `away`
- `current-player`
- `variant` - `card`, `compact`, `profile`
- `size` - `small`, `medium`, `large`
- `tone`
- `interactive`
- `selected`
- `show-stats`
- `show-emblems`
- `show-progress`
- `show-status`

#### Main events

- `gwc-player-card-click`

---

### Quest List

Quest board for daily quests, weekly missions, achievements, battle pass tasks, and reward claim flows.

```html
<gwc-quest-list
  theme="default"
  title="Quest board"
  subtitle="Filter quests, inspect details, and claim ready rewards."
  variant="card"
  filter="all"
  show-filters="true"
  show-progress="true"
  show-rewards="true"
  show-claim-button="true">
</gwc-quest-list>
```

```ts
import { GwcQuestList, type QuestConfig } from 'gwc';

const questList = document.querySelector('gwc-quest-list') as GwcQuestList | null;

const quests: QuestConfig[] = [
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
      {
        id: 'coins-300',
        name: 'Coins',
        icon: '🪙',
        amount: 300,
        rarity: 'common',
        type: 'coins'
      }
    ]
  }
];

questList?.setQuests(quests);
```

#### Main attributes

- `theme`
- `title`
- `subtitle`
- `variant` - `card`, `compact`, `minimal`
- `filter` - `all`, `locked`, `active`, `completed`, `claimable`, `claimed`
- `show-filters`
- `show-progress`
- `show-rewards`
- `show-claim-button`
- `claim-label`
- `empty-text`

#### Main methods

- `setQuests(quests)`
- `setConfig(config)`
- `getQuests()`
- `setFilter(filter)`
- `getFilter()`

#### Main events

- `gwc-quest-click`
- `gwc-quest-claim`
- `gwc-quest-filter-change`

---

### Inventory Slot

Single inventory cell for items, equipment, consumables, materials, skins, quest items, locked slots, and cooldown states.

```html
<gwc-inventory-slot
  theme="default"
  slot-id="weapon-1"
  name="Rare Sword"
  icon="⚔️"
  type="weapon"
  rarity="rare"
  state="filled"
  action="equip"
  quantity="1"
  durability="82"
  max-durability="100">
</gwc-inventory-slot>
```

```ts
import { GwcInventorySlot, type InventorySlotConfig } from 'gwc';

const slot = document.querySelector('gwc-inventory-slot') as GwcInventorySlot | null;

const config: InventorySlotConfig = {
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
    maxDurability: 100
  }
};

slot?.setConfig(config);
```

#### Main attributes

- `theme`
- `slot-id`
- `item-id`
- `name`
- `description`
- `icon`
- `image`
- `type`
- `rarity`
- `quantity`
- `max-quantity`
- `level`
- `durability`
- `max-durability`
- `cooldown-remaining`
- `cooldown-total`
- `state` - `empty`, `filled`, `equipped`, `locked`, `cooldown`, `disabled`
- `variant` - `slot`, `compact`, `detailed`
- `action` - `none`, `inspect`, `equip`, `unequip`, `use`, `sell`, `craft`
- `action-label`
- `selected`
- `interactive`
- `show-name`
- `show-quantity`
- `show-rarity`
- `show-durability`
- `show-cooldown`
- `show-action`
- `empty-text`
- `locked-reason`

#### Main methods

- `setConfig(config)`
- `getConfig()`
- `clear()`

#### Main events

- `gwc-inventory-slot-click`
- `gwc-inventory-slot-action`
- `gwc-inventory-slot-equip`
- `gwc-inventory-slot-use`

---

### Inventory Grid

Inventory board built from inventory slots. Handles layout, capacity, filters, selected item state, empty slots, and event forwarding.

```html
<gwc-inventory-grid
  theme="default"
  title="Inventory"
  subtitle="Items, equipment, consumables and locked slots."
  capacity="24"
  columns="6"
  filter="all"
  variant="board"
  show-filters="true"
  show-capacity="true"
  show-empty-slots="true"
  show-actions="selected"
  show-names="false">
</gwc-inventory-grid>
```

```ts
import { GwcInventoryGrid, type InventorySlotConfig } from 'gwc';

const inventory = document.querySelector('gwc-inventory-grid') as GwcInventoryGrid | null;

const slots: InventorySlotConfig[] = [
  {
    slotId: 'weapon-1',
    state: 'filled',
    action: 'equip',
    item: {
      id: 'rare-sword',
      name: 'Rare Sword',
      icon: '⚔️',
      type: 'weapon',
      rarity: 'rare'
    }
  },
  {
    slotId: 'potion-1',
    state: 'filled',
    action: 'use',
    item: {
      id: 'health-potion',
      name: 'Health Potion',
      icon: '🧪',
      type: 'consumable',
      rarity: 'common',
      quantity: 8
    }
  }
];

inventory?.setConfig({
  title: 'Inventory',
  capacity: 24,
  columns: 6,
  slots,
  showFilters: true,
  showCapacity: true,
  showEmptySlots: true,
  showActions: 'selected',
  showNames: false
});
```

#### Main attributes

- `theme`
- `title`
- `subtitle`
- `capacity`
- `columns`
- `filter`
- `selected-slot-id`
- `variant` - `board`, `compact`, `minimal`
- `show-filters`
- `show-capacity`
- `show-empty-slots`
- `show-actions` - `true`, `false`, `selected`
- `show-names`
- `empty-text`

#### Main methods

- `setSlots(slots)`
- `getSlots()`
- `setConfig(config)`
- `getConfig()`
- `setFilter(filter)`
- `getFilter()`
- `selectSlot(slotId)`
- `clearSelection()`

#### Main events

- `gwc-inventory-grid-slot-click`
- `gwc-inventory-grid-slot-action`
- `gwc-inventory-grid-selection-change`
- `gwc-inventory-grid-filter-change`

---

### Emblem

Compact game emblem for roles, classes, factions, ranks, medals, and profile badges.

```html
<gwc-emblem
  theme="default"
  size="medium"
  shape="shield"
  interactive="true"
  show-state="true">
</gwc-emblem>
```

```ts
import { GwcEmblem, type EmblemConfig } from 'gwc';

const emblem = document.querySelector('gwc-emblem') as GwcEmblem | null;

const config: EmblemConfig = {
  id: 'defender',
  name: 'Defender',
  description: 'Block 100 attacks.',
  icon: '🛡️',
  rarity: 'epic',
  state: 'unlocked'
};

emblem?.setConfig(config);
```

#### Main attributes

- `theme`
- `size` - `small`, `medium`, `large`
- `shape` - `shield`, `circle`, `hex`, `diamond`
- `interactive`
- `selected`
- `show-state`
- `show-rarity`
- `label`

#### Main events

- `gwc-emblem-click`

---

### Tooltip

Lightweight tooltip for buttons, icons, labels, controls, rarity hints, and rank mode explanations.

```html
<gwc-tooltip
  tooltip-title="Rank mode"
  text="Controls how tied scores are displayed."
  position="right">
  <button type="button">i</button>
</gwc-tooltip>
```

```ts
import { GwcTooltip, type TooltipConfig } from 'gwc';

const tooltip = document.querySelector('gwc-tooltip') as GwcTooltip | null;

const config: TooltipConfig = {
  title: 'Rank mode',
  text: 'Controls how tied scores are displayed.',
  position: 'right'
};

tooltip?.setConfig(config);
```

#### Main attributes

- `theme`
- `tooltip-title`
- `text`
- `position` - `top`, `right`, `bottom`, `left`

#### Slots

- default slot - trigger element
- `content` - custom tooltip body

#### Main events

- `gwc-tooltip-toggle`

---

### Inspector Panel

Reusable details panel for selected players, stats, rewards, emblems, quests, inventory slots, and grid selections.

```html
<gwc-inspector-panel
  theme="default"
  variant="dark"
  empty-text="Select an item to see details.">
</gwc-inspector-panel>
```

```ts
import { GwcInspectorPanel, type InspectorPanelConfig } from 'gwc';

const panel = document.querySelector('gwc-inspector-panel') as GwcInspectorPanel | null;

const config: InspectorPanelConfig = {
  title: 'Rare Sword',
  subtitle: 'Selected item',
  description: 'A balanced sword for advanced quests.',
  icon: '⚔️',
  eventName: 'gwc-inventory-grid-slot-click',
  fields: [
    { label: 'State', value: 'filled' },
    { label: 'Rarity', value: 'rare' },
    { label: 'Quantity', value: 1 }
  ]
};

panel?.setConfig(config);
```

#### Main attributes

- `theme`
- `variant` - `dark`, `card`
- `empty-text`
- `title`
- `subtitle`
- `description`
- `icon`
- `image`
- `event-name`

#### Main methods

- `setConfig(config)`
- `getConfig()`
- `clear()`

---

## Themes

Built-in themes:

- `default`
- `dark`
- `neon`
- `forest`
- `sunset`
- `ocean`

Use a theme through an attribute:

```html
<gwc-player-card theme="dark"></gwc-player-card>
<gwc-inventory-grid theme="neon"></gwc-inventory-grid>
```

Use a theme through JavaScript:

```ts
const element = document.querySelector('gwc-player-card');

element?.setAttribute('theme', 'dark');
```

Use theme helpers:

```ts
import { applyTheme, themePresets } from 'gwc';

const element = document.querySelector('gwc-player-card');

if (element) {
  applyTheme(element, themePresets.neon);
}
```

## CSS Variables

All components use the same base CSS variables:

```css
:root {
  --gwc-primary: #6366f1;
  --gwc-secondary: #8b5cf6;
  --gwc-background: #ffffff;
  --gwc-text: #1f2937;
  --gwc-accent: #f59e0b;
  --gwc-border: #e5e7eb;
}
```

Tooltip also supports tooltip-specific variables:

```css
:root {
  --gwc-tooltip-background: #1f2937;
  --gwc-tooltip-text: #f9fafb;
  --gwc-tooltip-muted-text: #e5e7eb;
  --gwc-tooltip-border: rgba(255, 255, 255, 0.08);
  --gwc-tooltip-radius: 10px;
  --gwc-tooltip-width: 280px;
}
```

## TypeScript

GWC exports component classes and related types:

```ts
import {
  GwcLeaderboard,
  GwcBadge,
  GwcRewardCard,
  GwcRewardReveal,
  GwcProgressBar,
  GwcCountdown,
  GwcStatCard,
  GwcPlayerCard,
  GwcQuestList,
  GwcInventorySlot,
  GwcInventoryGrid,
  GwcEmblem,
  GwcTooltip,
  GwcInspectorPanel
} from 'gwc';

import type {
  LeaderboardEntry,
  BadgeConfig,
  RewardConfig,
  ProgressBarConfig,
  CountdownConfig,
  StatCardConfig,
  PlayerCardConfig,
  QuestConfig,
  InventorySlotConfig,
  InventoryGridConfig,
  EmblemConfig,
  TooltipConfig,
  InspectorPanelConfig
} from 'gwc';
```

Custom events are typed through `HTMLElementEventMap` when the package is imported.

```ts
import 'gwc';

const badge = document.querySelector('gwc-badge');

badge?.addEventListener('gwc-badge-claim', event => {
  const config = event.detail.config;
  void config;
});
```

## Development

Install dependencies:

```bash
npm install
```

Run typecheck:

```bash
npm run typecheck
```

Build package:

```bash
npm run build
```

Watch TypeScript:

```bash
npm run dev
```

Run local demo:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/demo.html
```

## Package Check

Before publishing:

```bash
npm run test
npm run build
npm pack --dry-run
```

The npm package should include:

```text
dist/
README.md
LICENSE
package.json
```

## Browser Support

GWC works in modern browsers with support for:

- Custom Elements
- Shadow DOM
- ES Modules
- CSS custom properties

## License

MIT