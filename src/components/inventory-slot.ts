import { applyTheme } from '../utils/themes.js';
import type {
  GwcRarity,
  InventoryItemConfig,
  InventoryItemType,
  InventorySlotAction,
  InventorySlotActionEventDetail,
  InventorySlotClickEventDetail,
  InventorySlotConfig,
  InventorySlotState,
  InventorySlotVariant
} from '../types/index.js';

export class GwcInventorySlot extends HTMLElement {
  private config: InventorySlotConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'slot-id',
      'item-id',
      'name',
      'description',
      'icon',
      'image',
      'type',
      'rarity',
      'quantity',
      'max-quantity',
      'level',
      'durability',
      'max-durability',
      'cooldown-remaining',
      'cooldown-total',
      'state',
      'variant',
      'action',
      'action-label',
      'selected',
      'interactive',
      'show-name',
      'show-quantity',
      'show-rarity',
      'show-durability',
      'show-cooldown',
      'show-action',
      'empty-text',
      'locked-reason'
    ];
  }

  connectedCallback(): void {
    this.render();
    this.applyThemeFromAttribute();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  setConfig(config: InventorySlotConfig): void {
    this.config = this.cloneConfig(config);
    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): InventorySlotConfig {
    return this.cloneConfig(this.getActiveConfig());
  }

  clear(): void {
    this.config = {
      slotId: this.config?.slotId,
      state: 'empty',
      item: undefined
    };

    this.render();
    this.applyThemeFromAttribute();
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const config = this.getActiveConfig();
    const item = config.item;
    const state = this.getState(config);
    const variant = this.getVariant(config.variant);
    const rarity = this.getRarity(item?.rarity);
    const selected = this.getBooleanAttribute('selected', config.selected ?? false);
    const interactive = this.getBooleanAttribute('interactive', config.interactive ?? true);
    const disabled = state === 'disabled';
    const showName = this.getBooleanAttribute('show-name', config.showName ?? true);
    const showQuantity = this.getBooleanAttribute('show-quantity', config.showQuantity ?? true);
    const showRarity = this.getBooleanAttribute('show-rarity', config.showRarity ?? true);
    const showDurability = this.getBooleanAttribute('show-durability', config.showDurability ?? true);
    const showCooldown = this.getBooleanAttribute('show-cooldown', config.showCooldown ?? true);
    const showAction = this.getBooleanAttribute('show-action', config.showAction ?? true);
    const action = this.getAction(config.action);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <article
        class="inventory-slot variant-${variant} state-${state} rarity-${rarity} ${selected ? 'selected' : ''}"
      >
        <button
          class="slot-main"
          type="button"
          data-action="click"
          aria-label="${this.escapeAttribute(this.getAriaLabel(config, state))}"
          aria-pressed="${selected}"
          ${interactive && !disabled ? '' : 'disabled'}
        >
          <div class="slot-visual">
            ${this.renderItemVisual(item, state)}

            ${showRarity && item ? `
              <span class="slot-rarity-dot rarity-${rarity}" aria-hidden="true"></span>
            ` : ''}

            ${showQuantity && this.shouldShowQuantity(item) ? `
              <span class="slot-quantity">
                ${this.escapeHtml(String(item?.quantity))}
              </span>
            ` : ''}

            ${this.renderStateOverlay(state)}

            ${showCooldown && state === 'cooldown' && item ? this.renderCooldown(item) : ''}
          </div>

          ${showName ? `
            <div class="slot-name">
              ${this.escapeHtml(this.getDisplayName(config, state))}
            </div>
          ` : ''}

          ${variant === 'detailed' && item?.description ? `
            <div class="slot-description">
              ${this.escapeHtml(item.description)}
            </div>
          ` : ''}

          ${showDurability && item ? this.renderDurability(item) : ''}

          ${state === 'locked' && config.lockedReason ? `
            <div class="slot-locked-reason">
              ${this.escapeHtml(config.lockedReason)}
            </div>
          ` : ''}
        </button>

        ${showAction && this.shouldRenderAction(config, state, action) ? `
          <button
            class="slot-action-button"
            type="button"
            data-action="slot-action"
            ${this.canRunAction(state, action) ? '' : 'disabled'}
          >
            ${this.escapeHtml(this.getActionLabel(config, action))}
          </button>
        ` : ''}
      </article>
    `;

    this.bindEvents(config);
  }

  private renderItemVisual(item: InventoryItemConfig | undefined, state: InventorySlotState): string {
    if (!item) {
      return `
        <div class="slot-empty-icon" aria-hidden="true">
          ${state === 'locked' ? '🔒' : '+'}
        </div>
      `;
    }

    if (item.image) {
      return `
        <img class="slot-image" src="${this.escapeAttribute(item.image)}" alt="" loading="lazy">
      `;
    }

    return `
      <div class="slot-icon" aria-hidden="true">
        ${this.escapeHtml(item.icon || this.getFallbackIcon(item.type))}
      </div>
    `;
  }

  private renderStateOverlay(state: InventorySlotState): string {
    const overlays: Partial<Record<InventorySlotState, string>> = {
      equipped: '✓',
      locked: '🔒',
      cooldown: '⏳',
      disabled: '×'
    };

    const content = overlays[state];

    if (!content) return '';

    return `
      <span class="slot-state-overlay state-${state}" aria-hidden="true">
        ${this.escapeHtml(content)}
      </span>
    `;
  }

  private renderCooldown(item: InventoryItemConfig): string {
    const remaining = item.cooldownRemaining;
    const total = item.cooldownTotal;

    if (remaining === undefined || total === undefined || total <= 0) return '';

    const percent = Math.min(100, Math.max(0, (remaining / total) * 100));

    return `
      <div class="slot-cooldown" style="--cooldown-percent: ${percent}%">
        <span>${this.escapeHtml(this.formatCooldown(remaining))}</span>
      </div>
    `;
  }

  private renderDurability(item: InventoryItemConfig): string {
    if (item.durability === undefined || item.maxDurability === undefined || item.maxDurability <= 0) {
      return '';
    }

    const percent = Math.min(100, Math.max(0, (item.durability / item.maxDurability) * 100));

    return `
      <div class="slot-durability" aria-label="Durability ${item.durability} of ${item.maxDurability}">
        <div class="slot-durability-fill" style="width: ${percent}%"></div>
      </div>
    `;
  }

  private bindEvents(config: InventorySlotConfig): void {
    const mainButton = this.shadow.querySelector<HTMLButtonElement>('[data-action="click"]');
    const actionButton = this.shadow.querySelector<HTMLButtonElement>('[data-action="slot-action"]');

    mainButton?.addEventListener('click', () => {
      const state = this.getState(config);

      const detail: InventorySlotClickEventDetail = {
        config: this.cloneConfig(config),
        slotId: config.slotId,
        item: config.item ? { ...config.item } : undefined,
        state
      };

      this.dispatchEvent(new CustomEvent('gwc-inventory-slot-click', {
        detail,
        bubbles: true,
        composed: true
      }));
    });

    actionButton?.addEventListener('click', event => {
      event.stopPropagation();

      const state = this.getState(config);
      const action = this.getAction(config.action);

      if (!this.canRunAction(state, action)) return;

      const detail: InventorySlotActionEventDetail = {
        config: this.cloneConfig(config),
        slotId: config.slotId,
        item: config.item ? { ...config.item } : undefined,
        state,
        action
      };

      this.dispatchEvent(new CustomEvent('gwc-inventory-slot-action', {
        detail,
        bubbles: true,
        composed: true
      }));

      if (action === 'equip') {
        this.dispatchEvent(new CustomEvent('gwc-inventory-slot-equip', {
          detail,
          bubbles: true,
          composed: true
        }));
      }

      if (action === 'use') {
        this.dispatchEvent(new CustomEvent('gwc-inventory-slot-use', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
    });
  }

  private getActiveConfig(): InventorySlotConfig {
    if (this.config) {
      return this.cloneConfig(this.config);
    }

    return this.getConfigFromAttributes();
  }

  private getConfigFromAttributes(): InventorySlotConfig {
    const name = this.getAttribute('name');
    const icon = this.getAttribute('icon');
    const image = this.getAttribute('image');
    const itemId = this.getAttribute('item-id');

    const hasItem = Boolean(name || icon || image || itemId);

    const item: InventoryItemConfig | undefined = hasItem ? {
      id: itemId || undefined,
      name: name || 'Item',
      description: this.getAttribute('description') || undefined,
      icon: icon || undefined,
      image: image || undefined,
      type: this.getItemType(this.getAttribute('type') || undefined),
      rarity: this.getRarity(this.getAttribute('rarity') || undefined),
      quantity: this.getNumberAttribute('quantity'),
      maxQuantity: this.getNumberAttribute('max-quantity'),
      level: this.getNumberAttribute('level'),
      durability: this.getNumberAttribute('durability'),
      maxDurability: this.getNumberAttribute('max-durability'),
      cooldownRemaining: this.getNumberAttribute('cooldown-remaining'),
      cooldownTotal: this.getNumberAttribute('cooldown-total')
    } : undefined;

    const explicitState = this.getAttribute('state');

    return {
      slotId: this.getAttribute('slot-id') || undefined,
      item,
      state: this.getStateFromValue(explicitState || (item ? 'filled' : 'empty')),
      variant: this.getVariant(this.getAttribute('variant') || undefined),
      action: this.getAction(this.getAttribute('action') || undefined),
      actionLabel: this.getAttribute('action-label') || undefined,
      selected: this.getBooleanAttribute('selected', false),
      interactive: this.getBooleanAttribute('interactive', true),
      showName: this.getBooleanAttribute('show-name', true),
      showQuantity: this.getBooleanAttribute('show-quantity', true),
      showRarity: this.getBooleanAttribute('show-rarity', true),
      showDurability: this.getBooleanAttribute('show-durability', true),
      showCooldown: this.getBooleanAttribute('show-cooldown', true),
      showAction: this.getBooleanAttribute('show-action', true),
      emptyText: this.getAttribute('empty-text') || undefined,
      lockedReason: this.getAttribute('locked-reason') || undefined
    };
  }

  private shouldShowQuantity(item?: InventoryItemConfig): boolean {
    if (!item || item.quantity === undefined) return false;

    return item.quantity > 1;
  }

  private shouldRenderAction(
    config: InventorySlotConfig,
    state: InventorySlotState,
    action: InventorySlotAction
  ): boolean {
    if (action === 'none') return false;

    if (!config.item && action !== 'inspect') return false;

    if (state === 'empty' && action !== 'inspect') return false;

    return true;
  }

  private canRunAction(state: InventorySlotState, action: InventorySlotAction): boolean {
    if (action === 'none') return false;

    if (state === 'disabled') return false;

    if (state === 'locked' && action !== 'inspect') return false;

    if (state === 'cooldown' && action !== 'inspect') return false;

    return true;
  }

  private getActionLabel(config: InventorySlotConfig, action: InventorySlotAction): string {
    if (config.actionLabel) return config.actionLabel;

    const labels: Record<InventorySlotAction, string> = {
      none: '',
      inspect: 'Inspect',
      equip: 'Equip',
      unequip: 'Unequip',
      use: 'Use',
      sell: 'Sell',
      craft: 'Craft'
    };

    return labels[action];
  }

  private getDisplayName(config: InventorySlotConfig, state: InventorySlotState): string {
    if (config.item) return config.item.name;

    if (state === 'locked') return 'Locked slot';

    return config.emptyText || 'Empty slot';
  }

  private getAriaLabel(config: InventorySlotConfig, state: InventorySlotState): string {
    const name = this.getDisplayName(config, state);

    return `Inventory slot: ${name}`;
  }

  private getState(config: InventorySlotConfig): InventorySlotState {
    return this.getStateFromValue(config.state || (config.item ? 'filled' : 'empty'));
  }

  private getStateFromValue(state?: string): InventorySlotState {
    if (
      state === 'filled' ||
      state === 'equipped' ||
      state === 'locked' ||
      state === 'cooldown' ||
      state === 'disabled'
    ) {
      return state;
    }

    return 'empty';
  }

  private getVariant(variant?: string): InventorySlotVariant {
    if (variant === 'compact' || variant === 'detailed') {
      return variant;
    }

    return 'slot';
  }

  private getAction(action?: string): InventorySlotAction {
    if (
      action === 'inspect' ||
      action === 'equip' ||
      action === 'unequip' ||
      action === 'use' ||
      action === 'sell' ||
      action === 'craft'
    ) {
      return action;
    }

    return 'none';
  }

  private getRarity(rarity?: string): GwcRarity {
    if (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary') {
      return rarity;
    }

    return 'common';
  }

  private getItemType(type?: string): InventoryItemType {
    if (
      type === 'weapon' ||
      type === 'armor' ||
      type === 'consumable' ||
      type === 'currency' ||
      type === 'material' ||
      type === 'skin' ||
      type === 'quest'
    ) {
      return type;
    }

    return 'custom';
  }

  private getFallbackIcon(type?: InventoryItemType): string {
    const icons: Record<InventoryItemType, string> = {
      weapon: '⚔️',
      armor: '🛡️',
      consumable: '🧪',
      currency: '🪙',
      material: '🧱',
      skin: '🎨',
      quest: '📜',
      custom: '🎒'
    };

    return icons[type || 'custom'];
  }

  private getNumberAttribute(name: string): number | undefined {
    const value = this.getAttribute(name);

    if (value === null) return undefined;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    return value !== 'false';
  }

  private formatCooldown(seconds: number): string {
    if (seconds < 60) return `${Math.ceil(seconds)}s`;

    const minutes = Math.floor(seconds / 60);
    const restSeconds = Math.ceil(seconds % 60);

    return `${minutes}:${String(restSeconds).padStart(2, '0')}`;
  }

  private cloneConfig(config: InventorySlotConfig): InventorySlotConfig {
    return {
      ...config,
      item: config.item
        ? {
          ...config.item,
          tags: config.item.tags ? [...config.item.tags] : undefined
        }
        : undefined
    };
  }

  private applyThemeFromAttribute(): void {
    const theme = this.getAttribute('theme') || 'default';
    applyTheme(this.shadow.host as HTMLElement, theme);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private escapeAttribute(text: string): string {
    return this.escapeHtml(text).replace(/"/g, '&quot;');
  }
}

if (!customElements.get('gwc-inventory-slot')) {
  customElements.define('gwc-inventory-slot', GwcInventorySlot);
}