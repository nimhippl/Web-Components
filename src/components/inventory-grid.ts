import { applyTheme } from '../utils/themes.js';
import { GwcInventorySlot } from './inventory-slot.js';
import type {
  InventoryGridConfig,
  InventoryGridFilter,
  InventoryGridFilterChangeEventDetail,
  InventoryGridSelectionChangeEventDetail,
  InventoryGridSlotActionEventDetail,
  InventoryGridSlotClickEventDetail,
  InventoryGridVariant,
  InventoryItemConfig,
  InventoryItemType,
  InventorySlotActionEventDetail,
  InventorySlotClickEventDetail,
  InventorySlotConfig,
  InventorySlotState
} from '../types/index.js';

export class GwcInventoryGrid extends HTMLElement {
  private slots: InventorySlotConfig[] = [];
  private selectedSlotId: string | number | undefined;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'title',
      'subtitle',
      'capacity',
      'columns',
      'filter',
      'selected-slot-id',
      'variant',
      'show-filters',
      'show-capacity',
      'show-empty-slots',
      'show-actions',
      'show-names',
      'empty-text'
    ];
  }

  connectedCallback(): void {
    this.selectedSlotId = this.getAttribute('selected-slot-id') || undefined;
    this.render();
    this.applyThemeFromAttribute();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'selected-slot-id') {
      this.selectedSlotId = newValue || undefined;
    }

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  setSlots(slots: InventorySlotConfig[]): void {
    this.slots = slots.map(slot => this.cloneSlot(slot));
    this.render();
    this.applyThemeFromAttribute();
  }

  getSlots(): InventorySlotConfig[] {
    return this.slots.map(slot => this.cloneSlot(slot));
  }

  setConfig(config: InventoryGridConfig): void {
    if (config.title !== undefined) {
      this.setAttribute('title', config.title);
    }

    if (config.subtitle !== undefined) {
      this.setAttribute('subtitle', config.subtitle);
    }

    if (config.capacity !== undefined) {
      this.setAttribute('capacity', String(config.capacity));
    }

    if (config.columns !== undefined) {
      this.setAttribute('columns', String(config.columns));
    }

    if (config.filter !== undefined) {
      this.setAttribute('filter', config.filter);
    }

    if (config.selectedSlotId !== undefined) {
      this.selectedSlotId = config.selectedSlotId;
      this.setAttribute('selected-slot-id', String(config.selectedSlotId));
    }

    if (config.variant !== undefined) {
      this.setAttribute('variant', config.variant);
    }

    if (config.showFilters !== undefined) {
      this.setAttribute('show-filters', String(config.showFilters));
    }

    if (config.showCapacity !== undefined) {
      this.setAttribute('show-capacity', String(config.showCapacity));
    }

    if (config.showEmptySlots !== undefined) {
      this.setAttribute('show-empty-slots', String(config.showEmptySlots));
    }

    if (config.showActions !== undefined) {
      this.setAttribute('show-actions', String(config.showActions));
    }

    if (config.showNames !== undefined) {
      this.setAttribute('show-names', String(config.showNames));
    }

    if (config.emptyText !== undefined) {
      this.setAttribute('empty-text', config.emptyText);
    }

    this.slots = config.slots.map(slot => this.cloneSlot(slot));
    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): InventoryGridConfig {
    return {
      title: this.getAttribute('title') || undefined,
      subtitle: this.getAttribute('subtitle') || undefined,
      slots: this.getSlots(),
      capacity: this.getCapacity(),
      columns: this.getColumns(),
      filter: this.getFilter(),
      selectedSlotId: this.selectedSlotId,
      variant: this.getVariant(),
      showFilters: this.getBooleanAttribute('show-filters', true),
      showCapacity: this.getBooleanAttribute('show-capacity', true),
      showEmptySlots: this.getBooleanAttribute('show-empty-slots', true),
      showActions: this.getShowActionsValue(),
      showNames: this.getBooleanAttribute('show-names', true),
      emptyText: this.getAttribute('empty-text') || undefined
    };
  }

  setFilter(filter: InventoryGridFilter): void {
    this.setAttribute('filter', this.normalizeFilter(filter));
  }

  getFilter(): InventoryGridFilter {
    return this.normalizeFilter(this.getAttribute('filter') || 'all');
  }

  selectSlot(slotId?: string | number): void {
    this.selectedSlotId = slotId;

    if (slotId === undefined) {
      this.removeAttribute('selected-slot-id');
    } else {
      this.setAttribute('selected-slot-id', String(slotId));
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  clearSelection(): void {
    this.selectSlot(undefined);
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const title = this.getAttribute('title') || 'Inventory';
    const subtitle = this.getAttribute('subtitle') || '';
    const variant = this.getVariant();
    const filter = this.getFilter();
    const showFilters = this.getBooleanAttribute('show-filters', true);
    const showCapacity = this.getBooleanAttribute('show-capacity', true);
    const capacity = this.getCapacity();
    const used = this.getUsedCount();
    const visibleSlots = this.getVisibleSlots();

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section class="inventory-grid variant-${variant}">
        <div class="inventory-grid-header">
          <div>
            <div class="inventory-grid-title">${this.escapeHtml(title)}</div>

            ${subtitle ? `
              <div class="inventory-grid-subtitle">${this.escapeHtml(subtitle)}</div>
            ` : ''}
          </div>

          ${showCapacity ? `
            <div class="inventory-grid-capacity">
              Capacity ${this.escapeHtml(String(used))}/${this.escapeHtml(String(capacity))}
            </div>
          ` : ''}
        </div>

        ${showFilters ? this.renderFilters(filter) : ''}

        <div
          class="inventory-grid-cells"
          style="--inventory-columns: ${this.getColumns()}"
        ></div>

        ${visibleSlots.length === 0 ? `
          <div class="inventory-grid-empty">
            <div class="inventory-grid-empty-icon">🎒</div>
            <div>No inventory slots found.</div>
          </div>
        ` : ''}
      </section>
    `;

    this.renderSlots();
    this.bindFilterEvents();
  }

  private renderFilters(activeFilter: InventoryGridFilter): string {
    const filters: InventoryGridFilter[] = [
      'all',
      'weapon',
      'armor',
      'consumable',
      'material',
      'currency',
      'skin',
      'quest',
      'equipped',
      'cooldown',
      'locked',
      'empty'
    ];

    return `
      <div class="inventory-grid-filters" role="tablist" aria-label="Inventory filters">
        ${filters.map(filter => `
          <button
            class="inventory-grid-filter ${filter === activeFilter ? 'active' : ''}"
            type="button"
            data-filter="${this.escapeAttribute(filter)}"
            role="tab"
            aria-selected="${filter === activeFilter}"
          >
            ${this.escapeHtml(this.getFilterLabel(filter))}
          </button>
        `).join('')}
      </div>
    `;
  }

  private renderSlots(): void {
    const container = this.shadow.querySelector<HTMLElement>('.inventory-grid-cells');
    const visibleSlots = this.getVisibleSlots();

    if (!container) return;

    container.innerHTML = '';

    visibleSlots.forEach(slotConfig => {
      const slot = document.createElement('gwc-inventory-slot') as GwcInventorySlot;
      const preparedConfig = this.prepareSlotConfig(slotConfig);

      slot.setAttribute('theme', this.getAttribute('theme') || 'default');
      slot.setConfig(preparedConfig);

      slot.addEventListener('gwc-inventory-slot-click', event => {
        event.stopPropagation();

        const customEvent = event as CustomEvent<InventorySlotClickEventDetail>;
        const detail = this.createSlotClickDetail(slotConfig, customEvent.detail);

        this.selectedSlotId = detail.slotId;
        this.render();
        this.applyThemeFromAttribute();

        this.dispatchEvent(new CustomEvent('gwc-inventory-grid-selection-change', {
          detail: this.createSelectionChangeDetail(slotConfig),
          bubbles: true,
          composed: true
        }));

        this.dispatchEvent(new CustomEvent('gwc-inventory-grid-slot-click', {
          detail,
          bubbles: true,
          composed: true
        }));
      });

      slot.addEventListener('gwc-inventory-slot-action', event => {
        event.stopPropagation();

        const customEvent = event as CustomEvent<InventorySlotActionEventDetail>;
        const detail = this.createSlotActionDetail(slotConfig, customEvent.detail);

        this.selectedSlotId = detail.slotId;
        this.render();
        this.applyThemeFromAttribute();

        this.dispatchEvent(new CustomEvent('gwc-inventory-grid-slot-action', {
          detail,
          bubbles: true,
          composed: true
        }));
      });

      container.appendChild(slot);
    });
  }

  private bindFilterEvents(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const filter = this.normalizeFilter(button.dataset.filter || 'all');

        this.setAttribute('filter', filter);

        const detail: InventoryGridFilterChangeEventDetail = {
          filter
        };

        this.dispatchEvent(new CustomEvent('gwc-inventory-grid-filter-change', {
          detail,
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  private prepareSlotConfig(slotConfig: InventorySlotConfig): InventorySlotConfig {
    const selectedSlotId = this.selectedSlotId || this.getAttribute('selected-slot-id') || undefined;
    const slotId = slotConfig.slotId;
    const isSelected = selectedSlotId !== undefined && String(selectedSlotId) === String(slotId);
    const actionsMode = this.getActionsMode();
    const showActions = actionsMode === 'all' || (actionsMode === 'selected' && isSelected);

    return {
      ...this.cloneSlot(slotConfig),
      variant: 'compact',
      selected: isSelected,
      showAction: showActions,
      showName: this.getBooleanAttribute('show-names', false),
      showDurability: false
    };
  }

  private getActionsMode(): 'none' | 'all' | 'selected' {
    const value = this.getAttribute('show-actions');

    if (value === 'selected') {
      return 'selected';
    }

    if (value === 'false') {
      return 'none';
    }

    return 'all';
  }

  private getShowActionsValue(): boolean | 'selected' {
    const mode = this.getActionsMode();

    if (mode === 'selected') {
      return 'selected';
    }

    return mode === 'all';
  }

  private createSlotClickDetail(
    slotConfig: InventorySlotConfig,
    slotDetail: InventorySlotClickEventDetail
  ): InventoryGridSlotClickEventDetail {
    const slot = this.cloneSlot(slotConfig);
    const state = this.getSlotState(slot);

    return {
      slot,
      slotId: slot.slotId,
      item: slot.item ? this.cloneItem(slot.item) : undefined,
      state,
      selectedSlotId: slot.slotId || slotDetail.slotId
    };
  }

  private createSlotActionDetail(
    slotConfig: InventorySlotConfig,
    slotDetail: InventorySlotActionEventDetail
  ): InventoryGridSlotActionEventDetail {
    const slot = this.cloneSlot(slotConfig);
    const state = this.getSlotState(slot);

    return {
      slot,
      slotId: slot.slotId,
      item: slot.item ? this.cloneItem(slot.item) : undefined,
      state,
      action: slotDetail.action,
      selectedSlotId: slot.slotId || slotDetail.slotId
    };
  }

  private createSelectionChangeDetail(slotConfig: InventorySlotConfig): InventoryGridSelectionChangeEventDetail {
    const slot = this.cloneSlot(slotConfig);
    const state = this.getSlotState(slot);

    return {
      slot,
      slotId: slot.slotId,
      item: slot.item ? this.cloneItem(slot.item) : undefined,
      state,
      selectedSlotId: slot.slotId
    };
  }

  private getVisibleSlots(): InventorySlotConfig[] {
    const filter = this.getFilter();
    const slots = this.getRenderableSlots();

    if (filter === 'all') {
      return slots;
    }

    return slots.filter(slot => {
      const state = this.getSlotState(slot);

      if (
        filter === 'empty' ||
        filter === 'filled' ||
        filter === 'equipped' ||
        filter === 'locked' ||
        filter === 'cooldown' ||
        filter === 'disabled'
      ) {
        return state === filter;
      }

      return slot.item?.type === filter;
    });
  }

  private getRenderableSlots(): InventorySlotConfig[] {
    const slots = this.slots.map(slot => this.cloneSlot(slot));
    const capacity = this.getCapacity();
    const showEmptySlots = this.getBooleanAttribute('show-empty-slots', true);

    if (!showEmptySlots || capacity <= slots.length) {
      return slots;
    }

    const emptyText = this.getAttribute('empty-text') || 'Empty slot';

    for (let index = slots.length; index < capacity; index += 1) {
      slots.push({
        slotId: `generated-empty-${index + 1}`,
        state: 'empty',
        action: 'inspect',
        emptyText
      });
    }

    return slots;
  }

  private getUsedCount(): number {
    return this.slots.filter(slot => Boolean(slot.item)).length;
  }

  private getCapacity(): number {
    const value = this.getNumberAttribute('capacity');

    if (value !== undefined) {
      return Math.max(value, this.slots.length);
    }

    return this.slots.length;
  }

  private getColumns(): number {
    const value = this.getNumberAttribute('columns');

    if (value === undefined) return 6;

    return Math.min(12, Math.max(1, Math.round(value)));
  }

  private getSlotState(slot: InventorySlotConfig): InventorySlotState {
    if (
      slot.state === 'filled' ||
      slot.state === 'equipped' ||
      slot.state === 'locked' ||
      slot.state === 'cooldown' ||
      slot.state === 'disabled'
    ) {
      return slot.state;
    }

    return slot.item ? 'filled' : 'empty';
  }

  private normalizeFilter(filter: string): InventoryGridFilter {
    if (
      filter === 'weapon' ||
      filter === 'armor' ||
      filter === 'consumable' ||
      filter === 'currency' ||
      filter === 'material' ||
      filter === 'skin' ||
      filter === 'quest' ||
      filter === 'custom' ||
      filter === 'empty' ||
      filter === 'filled' ||
      filter === 'equipped' ||
      filter === 'locked' ||
      filter === 'cooldown' ||
      filter === 'disabled'
    ) {
      return filter;
    }

    return 'all';
  }

  private getFilterLabel(filter: InventoryGridFilter): string {
    const labels: Record<string, string> = {
      all: 'All',
      weapon: 'Weapons',
      armor: 'Armor',
      consumable: 'Consumables',
      currency: 'Currency',
      material: 'Materials',
      skin: 'Skins',
      quest: 'Quest',
      custom: 'Custom',
      empty: 'Empty',
      filled: 'Filled',
      equipped: 'Equipped',
      locked: 'Locked',
      cooldown: 'Cooldown',
      disabled: 'Disabled'
    };

    return labels[filter] || filter;
  }

  private getVariant(): InventoryGridVariant {
    const variant = this.getAttribute('variant');

    if (variant === 'compact' || variant === 'minimal') {
      return variant;
    }

    return 'board';
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

  private cloneSlot(slot: InventorySlotConfig): InventorySlotConfig {
    return {
      ...slot,
      item: slot.item ? this.cloneItem(slot.item) : undefined
    };
  }

  private cloneItem(item: InventoryItemConfig): InventoryItemConfig {
    return {
      ...item,
      tags: item.tags ? [...item.tags] : undefined
    };
  }

  private applyThemeFromAttribute(): void {
    const theme = this.getAttribute('theme') || 'default';

    applyTheme(this.shadow.host as HTMLElement, theme);

    this.shadow.querySelectorAll('gwc-inventory-slot').forEach(slot => {
      slot.setAttribute('theme', theme);
    });
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

if (!customElements.get('gwc-inventory-grid')) {
  customElements.define('gwc-inventory-grid', GwcInventoryGrid);
}