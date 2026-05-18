import { GwcLeaderboard } from './components/leaderboard.js';
import { GwcBadge } from './components/badge.js';
import { GwcRewardCard } from './components/reward-card.js';
import { GwcEmblem } from './components/emblem.js';
import { GwcTooltip } from './components/tooltip.js';
import { GwcRewardReveal } from './components/reward-reveal.js';
import { GwcInspectorPanel } from './components/inspector-panel.js';
import { GwcProgressBar } from './components/progress-bar.js';
import { GwcStatCard } from './components/stat-card.js';
import { GwcPlayerCard } from './components/player-card.js';
import { GwcQuestList } from './components/quest-list.js';
import { GwcInventorySlot } from './components/inventory-slot.js';
import { GwcInventoryGrid } from './components/inventory-grid.js';
import { GwcCountdown } from './components/countdown.js';

import type {
  BadgeClickEventDetail,
  BadgeClaimEventDetail,
  CountdownCompleteEventDetail,
  CountdownEventDetail,
  EmblemClickEventDetail,
  InventoryGridFilterChangeEventDetail,
  InventoryGridSelectionChangeEventDetail,
  InventoryGridSlotActionEventDetail,
  InventoryGridSlotClickEventDetail,
  InventorySlotActionEventDetail,
  InventorySlotClickEventDetail,
  InventorySlotEquipEventDetail,
  InventorySlotUseEventDetail,
  LeaderboardEntryClickEventDetail,
  PlayerCardClickEventDetail,
  ProgressChangeEventDetail,
  ProgressCompleteEventDetail,
  QuestClickEventDetail,
  QuestClaimEventDetail,
  QuestFilterChangeEventDetail,
  RewardClaimEventDetail,
  RewardClickEventDetail,
  RewardRevealCloseEventDetail,
  RewardRevealCompleteEventDetail,
  RewardRevealItemEventDetail,
  RewardRevealOpenEventDetail,
  RewardRevealRewardClickEventDetail,
  StatCardClickEventDetail,
  TooltipToggleEventDetail
} from './types/index.js';

export { GwcLeaderboard } from './components/leaderboard.js';
export { GwcBadge } from './components/badge.js';
export { GwcRewardCard } from './components/reward-card.js';
export { GwcEmblem } from './components/emblem.js';
export { GwcTooltip } from './components/tooltip.js';
export { GwcRewardReveal } from './components/reward-reveal.js';
export { GwcInspectorPanel } from './components/inspector-panel.js';
export { GwcProgressBar } from './components/progress-bar.js';
export { GwcStatCard } from './components/stat-card.js';
export { GwcPlayerCard } from './components/player-card.js';
export { GwcQuestList } from './components/quest-list.js';
export { GwcInventorySlot } from './components/inventory-slot.js';
export { GwcInventoryGrid } from './components/inventory-grid.js';
export { GwcCountdown } from './components/countdown.js';

export type {
  LeaderboardEntry,
  LeaderboardEntryDetail,
  LeaderboardEntryDetailValue,
  LeaderboardVariant,
  LeaderboardRankMode,
  LeaderboardEntryClickEventDetail,

  GwcRarity,

  BadgeConfig,
  BadgeRarity,
  BadgeState,
  BadgeClickEventDetail,
  BadgeClaimEventDetail,

  RewardConfig,
  RewardType,
  RewardRarity,
  RewardState,
  RewardClickEventDetail,
  RewardClaimEventDetail,

  EmblemConfig,
  EmblemRarity,
  EmblemState,
  EmblemShape,
  EmblemClickEventDetail,

  TooltipConfig,
  TooltipPosition,
  TooltipToggleEventDetail,

  RewardRevealConfig,
  RewardRevealVariant,
  RewardRevealMode,
  RewardRevealState,
  RewardRevealOpenEventDetail,
  RewardRevealItemEventDetail,
  RewardRevealCompleteEventDetail,
  RewardRevealCloseEventDetail,
  RewardRevealRewardClickEventDetail,

  InspectorPanelConfig,
  InspectorPanelField,
  InspectorPanelValue,
  InspectorPanelVariant,

  ProgressBarConfig,
  ProgressBarTone,
  ProgressBarVariant,
  ProgressChangeEventDetail,
  ProgressCompleteEventDetail,

  StatCardConfig,
  StatCardClickEventDetail,
  StatCardSize,
  StatCardTone,
  StatCardValue,
  StatCardVariant,

  PlayerCardConfig,
  PlayerCardClickEventDetail,
  PlayerCardEmblem,
  PlayerCardProgress,
  PlayerCardSize,
  PlayerCardStat,
  PlayerCardStatus,
  PlayerCardTone,
  PlayerCardVariant,

  QuestConfig,
  QuestClickEventDetail,
  QuestClaimEventDetail,
  QuestDifficulty,
  QuestFilterChangeEventDetail,
  QuestListConfig,
  QuestListFilter,
  QuestListVariant,
  QuestProgress,
  QuestReward,
  QuestState,

  InventoryItemConfig,
  InventoryItemType,
  InventorySlotAction,
  InventorySlotActionEventDetail,
  InventorySlotClickEventDetail,
  InventorySlotConfig,
  InventorySlotEquipEventDetail,
  InventorySlotState,
  InventorySlotUseEventDetail,
  InventorySlotVariant,

  InventoryGridActionsMode,
  InventoryGridConfig,
  InventoryGridFilter,
  InventoryGridFilterChangeEventDetail,
  InventoryGridSelectionChangeEventDetail,
  InventoryGridSlotActionEventDetail,
  InventoryGridSlotClickEventDetail,
  InventoryGridVariant,

  CountdownCompleteEventDetail,
  CountdownConfig,
  CountdownEventDetail,
  CountdownState,
  CountdownTimeParts,
  CountdownTone,
  CountdownVariant,
} from './types/index.js';

export type { ThemePreset } from './utils/themes.js';
export { applyTheme, themePresets } from './utils/themes.js';

declare global {
  interface HTMLElementTagNameMap {
    'gwc-leaderboard': GwcLeaderboard;
    'gwc-badge': GwcBadge;
    'gwc-reward-card': GwcRewardCard;
    'gwc-emblem': GwcEmblem;
    'gwc-tooltip': GwcTooltip;
    'gwc-reward-reveal': GwcRewardReveal;
    'gwc-inspector-panel': GwcInspectorPanel;
    'gwc-progress-bar': GwcProgressBar;
    'gwc-stat-card': GwcStatCard;
    'gwc-player-card': GwcPlayerCard;
    'gwc-quest-list': GwcQuestList;
    'gwc-inventory-slot': GwcInventorySlot;
    'gwc-inventory-grid': GwcInventoryGrid;
    'gwc-countdown': GwcCountdown;
  }

  interface HTMLElementEventMap {
    'gwc-leaderboard-entry-click': CustomEvent<LeaderboardEntryClickEventDetail>;

    'gwc-badge-click': CustomEvent<BadgeClickEventDetail>;
    'gwc-badge-claim': CustomEvent<BadgeClaimEventDetail>;

    'gwc-reward-click': CustomEvent<RewardClickEventDetail>;
    'gwc-reward-claim': CustomEvent<RewardClaimEventDetail>;

    'gwc-emblem-click': CustomEvent<EmblemClickEventDetail>;

    'gwc-tooltip-toggle': CustomEvent<TooltipToggleEventDetail>;

    'gwc-reward-reveal-open': CustomEvent<RewardRevealOpenEventDetail>;
    'gwc-reward-reveal-item': CustomEvent<RewardRevealItemEventDetail>;
    'gwc-reward-reveal-complete': CustomEvent<RewardRevealCompleteEventDetail>;
    'gwc-reward-reveal-close': CustomEvent<RewardRevealCloseEventDetail>;
    'gwc-reward-reveal-reward-click': CustomEvent<RewardRevealRewardClickEventDetail>;

    'gwc-progress-change': CustomEvent<ProgressChangeEventDetail>;
    'gwc-progress-complete': CustomEvent<ProgressCompleteEventDetail>;

    'gwc-stat-card-click': CustomEvent<StatCardClickEventDetail>;
    'gwc-player-card-click': CustomEvent<PlayerCardClickEventDetail>;

    'gwc-quest-click': CustomEvent<QuestClickEventDetail>;
    'gwc-quest-claim': CustomEvent<QuestClaimEventDetail>;
    'gwc-quest-filter-change': CustomEvent<QuestFilterChangeEventDetail>;

    'gwc-inventory-slot-click': CustomEvent<InventorySlotClickEventDetail>;
    'gwc-inventory-slot-action': CustomEvent<InventorySlotActionEventDetail>;
    'gwc-inventory-slot-equip': CustomEvent<InventorySlotEquipEventDetail>;
    'gwc-inventory-slot-use': CustomEvent<InventorySlotUseEventDetail>;

    'gwc-inventory-grid-slot-click': CustomEvent<InventoryGridSlotClickEventDetail>;
    'gwc-inventory-grid-slot-action': CustomEvent<InventoryGridSlotActionEventDetail>;
    'gwc-inventory-grid-selection-change': CustomEvent<InventoryGridSelectionChangeEventDetail>;
    'gwc-inventory-grid-filter-change': CustomEvent<InventoryGridFilterChangeEventDetail>;

    'gwc-countdown-start': CustomEvent<CountdownEventDetail>;
    'gwc-countdown-pause': CustomEvent<CountdownEventDetail>;
    'gwc-countdown-reset': CustomEvent<CountdownEventDetail>;
    'gwc-countdown-tick': CustomEvent<CountdownEventDetail>;
    'gwc-countdown-complete': CustomEvent<CountdownCompleteEventDetail>;
  }
}