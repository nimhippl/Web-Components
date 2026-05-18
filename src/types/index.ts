export type LeaderboardVariant = 'card' | 'compact' | 'minimal';
export type LeaderboardRankMode = 'ordinal' | 'competition' | 'dense';
export type GwcRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type LeaderboardEntryDetailValue = string | number | boolean | null;

export interface LeaderboardEntryDetail {
  label: string;
  value: LeaderboardEntryDetailValue;
}

export interface LeaderboardEntry {
  id: string | number;
  name: string;
  score: number;
  avatar?: string;
  rank?: number;
  previousRank?: number;
  isCurrentPlayer?: boolean;
  details?: LeaderboardEntryDetail[];
}

export type BadgeRarity = GwcRarity;
export type BadgeState = 'locked' | 'unlocked' | 'claimable' | 'claimed' | 'hidden';

export interface BadgeConfig {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  rarity?: BadgeRarity;
  state: BadgeState;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date | string;
  claimedAt?: Date | string;
}

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export type RewardType = 'coins' | 'xp' | 'item' | 'skin' | 'chest' | 'boost' | 'custom';
export type RewardRarity = GwcRarity;
export type RewardState = 'claimable' | 'claimed' | 'locked';

export interface RewardConfig {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  type?: RewardType;
  amount?: string | number;
  rarity?: RewardRarity;
  state: RewardState;
  claimedAt?: Date | string;
}

export interface TooltipConfig {
  title?: string;
  text?: string;
  position?: TooltipPosition;
}

export type EmblemRarity = GwcRarity;
export type EmblemState = 'locked' | 'unlocked' | 'claimable' | 'claimed' | 'hidden';
export type EmblemShape = 'shield' | 'circle' | 'hex' | 'diamond';

export interface EmblemConfig {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  rarity?: EmblemRarity;
  state: EmblemState;
}

export type RewardRevealVariant = 'panel' | 'cards' | 'chest';
export type RewardRevealMode = 'all' | 'sequence';
export type RewardRevealState = 'idle' | 'revealing' | 'revealed' | 'closed';

export interface RewardRevealConfig {
  title?: string;
  subtitle?: string;
  rewards: RewardConfig[];
  variant?: RewardRevealVariant;
  mode?: RewardRevealMode;
}

export type InspectorPanelValue = string | number | boolean;

export type InspectorPanelVariant = 'dark' | 'card';

export interface InspectorPanelField {
  label: string;
  value: InspectorPanelValue;
}

export interface InspectorPanelConfig {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  image?: string;
  eventName?: string;
  fields?: InspectorPanelField[];
}

export type ProgressBarVariant = 'line' | 'compact' | 'segmented';

export type ProgressBarTone =
  | 'xp'
  | 'health'
  | 'mana'
  | 'stamina'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export interface ProgressBarConfig {
  value: number;
  max: number;
  label?: string;
  description?: string;
  suffix?: string;
  variant?: ProgressBarVariant;
  tone?: ProgressBarTone;
  showValue?: boolean;
  showPercent?: boolean;
  animated?: boolean;
  striped?: boolean;
  disabled?: boolean;
  completedLabel?: string;
  segments?: number;
}

export type StatCardValue = string | number;

export type StatCardVariant = 'card' | 'compact' | 'minimal';

export type StatCardSize = 'small' | 'medium' | 'large';

export type StatCardTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'xp'
  | 'health'
  | 'mana'
  | 'stamina'
  | 'gold';

export interface StatCardConfig {
  id?: string | number;
  label: string;
  value: StatCardValue;
  icon?: string;
  description?: string;
  delta?: StatCardValue;
  deltaLabel?: string;
  tone?: StatCardTone;
  variant?: StatCardVariant;
  size?: StatCardSize;
  interactive?: boolean;
  selected?: boolean;
}

export type PlayerCardStatus = 'online' | 'offline' | 'busy' | 'away';

export type PlayerCardVariant = 'card' | 'compact' | 'profile';

export type PlayerCardSize = 'small' | 'medium' | 'large';

export type PlayerCardTone =
  | 'neutral'
  | 'xp'
  | 'success'
  | 'warning'
  | 'danger'
  | 'gold';

export interface PlayerCardStat {
  label: string;
  value: string | number;
  icon?: string;
  tone?: StatCardTone;
}

export interface PlayerCardEmblem {
  id?: string | number;
  name: string;
  icon?: string;
  rarity?: GwcRarity;
}

export interface PlayerCardProgress {
  value: number;
  max: number;
  label?: string;
  suffix?: string;
  tone?: ProgressBarTone;
}

export interface PlayerCardConfig {
  id?: string | number;
  name: string;
  title?: string;
  avatar?: string;
  initials?: string;
  level?: number;
  rank?: string;
  score?: string | number;
  status?: PlayerCardStatus;
  isCurrentPlayer?: boolean;
  stats?: PlayerCardStat[];
  emblems?: PlayerCardEmblem[];
  progress?: PlayerCardProgress;
  variant?: PlayerCardVariant;
  size?: PlayerCardSize;
  tone?: PlayerCardTone;
  interactive?: boolean;
  selected?: boolean;
}

export type QuestState = 'locked' | 'active' | 'completed' | 'claimable' | 'claimed';

export type QuestDifficulty = 'easy' | 'normal' | 'hard' | 'epic' | 'legendary';

export type QuestListVariant = 'card' | 'compact' | 'minimal';

export type QuestListFilter = 'all' | QuestState;

export interface QuestProgress {
  value: number;
  max: number;
  label?: string;
  suffix?: string;
}

export interface QuestReward {
  id?: string | number;
  name: string;
  icon?: string;
  amount?: string | number;
  rarity?: GwcRarity;
  type?: RewardType;
}

export interface QuestConfig {
  id: string | number;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  difficulty?: QuestDifficulty;
  state: QuestState;
  progress?: QuestProgress;
  rewards?: QuestReward[];
  tag?: string;
  lockedReason?: string;
  claimLabel?: string;
}

export interface QuestListConfig {
  title?: string;
  subtitle?: string;
  quests: QuestConfig[];
  variant?: QuestListVariant;
  filter?: QuestListFilter;
  showFilters?: boolean;
  showProgress?: boolean;
  showRewards?: boolean;
  showClaimButton?: boolean;
  claimLabel?: string;
  emptyText?: string;
}

export type InventoryItemType =
  | 'weapon'
  | 'armor'
  | 'consumable'
  | 'currency'
  | 'material'
  | 'skin'
  | 'quest'
  | 'custom';

export type InventorySlotState =
  | 'empty'
  | 'filled'
  | 'equipped'
  | 'locked'
  | 'cooldown'
  | 'disabled';

export type InventorySlotVariant = 'slot' | 'compact' | 'detailed';

export type InventorySlotAction =
  | 'none'
  | 'inspect'
  | 'equip'
  | 'unequip'
  | 'use'
  | 'sell'
  | 'craft';

export interface InventoryItemConfig {
  id?: string | number;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  type?: InventoryItemType;
  rarity?: GwcRarity;
  quantity?: number;
  maxQuantity?: number;
  level?: number;
  durability?: number;
  maxDurability?: number;
  cooldownRemaining?: number;
  cooldownTotal?: number;
  tags?: string[];
}

export interface InventorySlotConfig {
  slotId?: string | number;
  item?: InventoryItemConfig;
  state?: InventorySlotState;
  variant?: InventorySlotVariant;
  action?: InventorySlotAction;
  actionLabel?: string;
  selected?: boolean;
  interactive?: boolean;
  showName?: boolean;
  showQuantity?: boolean;
  showRarity?: boolean;
  showDurability?: boolean;
  showCooldown?: boolean;
  showAction?: boolean;
  emptyText?: string;
  lockedReason?: string;
}

export type InventoryGridVariant = 'board' | 'compact' | 'minimal';

export type InventoryGridFilter =
  | 'all'
  | InventoryItemType
  | InventorySlotState;

export type InventoryGridActionsMode = boolean | 'selected';

export interface InventoryGridConfig {
  title?: string;
  subtitle?: string;
  slots: InventorySlotConfig[];
  capacity?: number;
  columns?: number;
  filter?: InventoryGridFilter;
  selectedSlotId?: string | number;
  variant?: InventoryGridVariant;
  showFilters?: boolean;
  showCapacity?: boolean;
  showEmptySlots?: boolean;
  showActions?: InventoryGridActionsMode;
  showNames?: boolean;
  emptyText?: string;
}

export type CountdownState = 'idle' | 'running' | 'paused' | 'complete';

export type CountdownVariant = 'card' | 'compact' | 'minimal';

export type CountdownTone =
  | 'neutral'
  | 'xp'
  | 'success'
  | 'warning'
  | 'danger'
  | 'gold';

export interface CountdownTimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownConfig {
  label?: string;
  description?: string;
  endAt?: string | number | Date;
  duration?: number;
  variant?: CountdownVariant;
  tone?: CountdownTone;
  autoStart?: boolean;
  showDays?: boolean;
  showLabels?: boolean;
  showControls?: boolean;
  completeLabel?: string;
  startLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  resetLabel?: string;
}

export interface CountdownEventDetail {
  state: CountdownState;
  remainingMs: number;
  totalMs: number;
  percent: number;
  parts: CountdownTimeParts;
  config: CountdownConfig;
}

export interface CountdownCompleteEventDetail extends CountdownEventDetail {
  state: 'complete';
  remainingMs: 0;
}

export interface InventoryGridSlotClickEventDetail {
  slot: InventorySlotConfig;
  slotId?: string | number;
  item?: InventoryItemConfig;
  state: InventorySlotState;
  selectedSlotId?: string | number;
}

export interface InventoryGridSlotActionEventDetail {
  slot: InventorySlotConfig;
  slotId?: string | number;
  item?: InventoryItemConfig;
  state: InventorySlotState;
  action: InventorySlotAction;
  selectedSlotId?: string | number;
}

export interface InventoryGridSelectionChangeEventDetail {
  slot?: InventorySlotConfig;
  slotId?: string | number;
  item?: InventoryItemConfig;
  state?: InventorySlotState;
  selectedSlotId?: string | number;
}

export interface InventoryGridFilterChangeEventDetail {
  filter: InventoryGridFilter;
}

export interface InventorySlotClickEventDetail {
  config: InventorySlotConfig;
  slotId?: string | number;
  item?: InventoryItemConfig;
  state: InventorySlotState;
}

export interface InventorySlotActionEventDetail {
  config: InventorySlotConfig;
  slotId?: string | number;
  item?: InventoryItemConfig;
  state: InventorySlotState;
  action: InventorySlotAction;
}

export interface InventorySlotEquipEventDetail extends InventorySlotActionEventDetail {
  action: 'equip';
}

export interface InventorySlotUseEventDetail extends InventorySlotActionEventDetail {
  action: 'use';
}

export interface QuestClickEventDetail {
  quest: QuestConfig;
  id: string | number;
  state: QuestState;
}

export interface QuestClaimEventDetail {
  quest: QuestConfig;
  id: string | number;
  state: QuestState;
}

export interface QuestFilterChangeEventDetail {
  filter: QuestListFilter;
}

export interface PlayerCardClickEventDetail {
  config: PlayerCardConfig;
  id?: string | number;
  name: string;
}

export interface StatCardClickEventDetail {
  config: StatCardConfig;
  id?: string | number;
  label: string;
  value: StatCardValue;
}

export interface ProgressChangeEventDetail {
  value: number;
  max: number;
  percent: number;
  complete: boolean;
  config: ProgressBarConfig;
}

export interface ProgressCompleteEventDetail {
  value: number;
  max: number;
  percent: number;
  complete: true;
  config: ProgressBarConfig;
}

export interface RewardRevealOpenEventDetail {
  rewards: RewardConfig[];
  state: RewardRevealState;
}

export interface RewardRevealItemEventDetail {
  reward: RewardConfig;
  index: number;
  rewards: RewardConfig[];
  state: RewardRevealState;
}

export interface RewardRevealCompleteEventDetail {
  rewards: RewardConfig[];
  state: RewardRevealState;
}

export interface RewardRevealCloseEventDetail {
  rewards: RewardConfig[];
  state: RewardRevealState;
}

export interface RewardRevealRewardClickEventDetail {
  reward: RewardConfig;
  index: number;
  state: RewardRevealState;
}

export interface LeaderboardEntryClickEventDetail {
  entry: LeaderboardEntry;
  index: number;
  selected: boolean;
}

export interface BadgeClickEventDetail {
  config: BadgeConfig;
  state: BadgeState;
}

export interface BadgeClaimEventDetail {
  config: BadgeConfig;
  state: BadgeState;
}

export interface RewardClickEventDetail {
  config: RewardConfig;
  state: RewardState;
}

export interface RewardClaimEventDetail {
  config: RewardConfig;
  state: RewardState;
}

export interface EmblemClickEventDetail {
  config: EmblemConfig;
  state: EmblemState;
}

export interface TooltipToggleEventDetail {
  open: boolean;
}

