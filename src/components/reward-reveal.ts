import { applyTheme } from '../utils/themes.js';
import type {
  RewardConfig,
  RewardRevealMode,
  RewardRevealState,
  RewardRevealVariant
} from '../types/index.js';

export class GwcRewardReveal extends HTMLElement {
  private rewards: RewardConfig[] = [];
  private revealState: RewardRevealState = 'idle';
  private currentIndex = -1;
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
      'variant',
      'mode',
      'show-close',
      'show-reset',
      'open-label',
      'next-label',
      'close-label',
      'reset-label',
      'empty-text'
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

  setRewards(rewards: RewardConfig[]): void {
    this.rewards = [...rewards];
    this.revealState = 'idle';
    this.currentIndex = -1;
    this.render();
    this.applyThemeFromAttribute();
  }

  setConfig(config: {
    title?: string;
    subtitle?: string;
    rewards?: RewardConfig[];
    variant?: RewardRevealVariant;
    mode?: RewardRevealMode;
  }): void {
    if (config.title !== undefined) {
      this.setAttribute('title', config.title);
    }

    if (config.subtitle !== undefined) {
      this.setAttribute('subtitle', config.subtitle);
    }

    if (config.variant !== undefined) {
      this.setAttribute('variant', config.variant);
    }

    if (config.mode !== undefined) {
      this.setAttribute('mode', config.mode);
    }

    if (config.rewards !== undefined) {
      this.setRewards(config.rewards);
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  getRewards(): RewardConfig[] {
    return this.rewards.map(reward => ({ ...reward }));
  }

  getState(): RewardRevealState {
    return this.revealState;
  }

  open(): void {
    if (this.rewards.length === 0) {
      this.render();
      return;
    }

    const mode = this.getMode();

    this.revealState = 'revealing';
    this.currentIndex = mode === 'sequence' ? 0 : this.rewards.length - 1;

    if (mode === 'all') {
      this.revealState = 'revealed';
    }

    this.render();
    this.applyThemeFromAttribute();

    this.dispatchEvent(new CustomEvent('gwc-reward-reveal-open', {
      detail: {
        rewards: this.getRewards(),
        state: this.revealState
      },
      bubbles: true,
      composed: true
    }));

    this.dispatchEvent(new CustomEvent('gwc-reward-reveal-start', {
      detail: {
        rewards: this.getRewards(),
        state: this.revealState
      },
      bubbles: true,
      composed: true
    }));

    if (mode === 'sequence') {
      this.emitCurrentItem();

      if (this.rewards.length === 1) {
        this.markComplete();
      }

      return;
    }

    this.markComplete();
  }

  revealNext(): void {
    if (this.rewards.length === 0) return;

    if (this.revealState === 'idle' || this.revealState === 'closed') {
      this.open();
      return;
    }

    if (this.currentIndex >= this.rewards.length - 1) {
      this.markComplete();
      return;
    }

    this.currentIndex += 1;
    this.emitCurrentItem();

    if (this.currentIndex >= this.rewards.length - 1) {
      this.markComplete();
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  reset(): void {
    this.revealState = 'idle';
    this.currentIndex = -1;
    this.render();
    this.applyThemeFromAttribute();
  }

  close(): void {
    this.revealState = 'closed';
    this.render();
    this.applyThemeFromAttribute();

    this.dispatchEvent(new CustomEvent('gwc-reward-reveal-close', {
      detail: {
        rewards: this.getRewards(),
        state: this.revealState
      },
      bubbles: true,
      composed: true
    }));
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const title = this.getAttribute('title') || 'Rewards unlocked';
    const subtitle = this.getAttribute('subtitle') || 'Open to reveal your rewards.';
    const variant = this.getVariant();
    const mode = this.getMode();
    const visibleRewards = this.getVisibleRewards();
    const isEmpty = this.rewards.length === 0;

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section
        class="reward-reveal variant-${variant} state-${this.revealState} mode-${mode}"
        aria-live="polite"
      >
        <div class="reward-reveal-header">
          <div>
            <div class="reward-reveal-title">${this.escapeHtml(title)}</div>
            <div class="reward-reveal-subtitle">${this.escapeHtml(subtitle)}</div>
          </div>

          ${this.shouldShowClose() ? `
            <button class="reward-reveal-icon-button" type="button" data-action="close" aria-label="Close reward reveal">
              ×
            </button>
          ` : ''}
        </div>

        ${isEmpty ? this.renderEmptyState() : this.renderBody(visibleRewards)}

        ${this.renderActions()}
      </section>
    `;

    this.bindEvents();
  }

  private renderEmptyState(): string {
    const emptyText = this.getAttribute('empty-text') || 'No rewards to reveal.';

    return `
      <div class="reward-reveal-empty">
        <div class="reward-reveal-chest">🎁</div>
        <div>${this.escapeHtml(emptyText)}</div>
      </div>
    `;
  }

  private renderBody(visibleRewards: RewardConfig[]): string {
    if (this.revealState === 'idle' || this.revealState === 'closed') {
      return `
        <div class="reward-reveal-start">
          <div class="reward-reveal-chest" aria-hidden="true">🎁</div>
          <div class="reward-reveal-count">
            ${this.escapeHtml(String(this.rewards.length))} reward${this.rewards.length === 1 ? '' : 's'} ready
          </div>
        </div>
      `;
    }

    return `
      <div class="reward-reveal-grid">
        ${visibleRewards.map((reward, index) => this.renderRewardItem(reward, index)).join('')}
      </div>
    `;
  }

  private renderRewardItem(reward: RewardConfig, index: number): string {
    const rarity = reward.rarity || 'common';
    const state = reward.state || 'claimable';
    const icon = reward.icon || this.getFallbackIcon(reward.type || 'custom');
    const amount = reward.amount !== undefined ? this.formatAmount(reward.amount) : '';
    const description = reward.description || '';

    return `
      <button
        class="reward-reveal-item rarity-${rarity} reward-state-${state}"
        type="button"
        data-reward-index="${index}"
        aria-label="${this.escapeHtml(reward.name)}"
      >
        <span class="reward-reveal-item-icon">${this.escapeHtml(icon)}</span>

        <span class="reward-reveal-item-content">
          <span class="reward-reveal-item-name">${this.escapeHtml(reward.name)}</span>

          ${description ? `
            <span class="reward-reveal-item-description">${this.escapeHtml(description)}</span>
          ` : ''}

          <span class="reward-reveal-item-meta">
            ${amount ? `<span>${this.escapeHtml(amount)}</span>` : ''}
            <span>${this.escapeHtml(rarity)}</span>
          </span>
        </span>
      </button>
    `;
  }

  private renderActions(): string {
    if (this.rewards.length === 0) return '';

    const openLabel = this.getAttribute('open-label') || 'Open rewards';
    const nextLabel = this.getAttribute('next-label') || 'Reveal next';
    const closeLabel = this.getAttribute('close-label') || 'Close';
    const resetLabel = this.getAttribute('reset-label') || 'Reset';

    if (this.revealState === 'idle' || this.revealState === 'closed') {
      return `
        <div class="reward-reveal-actions">
          <button class="reward-reveal-button primary" type="button" data-action="open">
            ${this.escapeHtml(openLabel)}
          </button>
        </div>
      `;
    }

    if (this.getMode() === 'sequence' && this.revealState === 'revealing') {
      return `
        <div class="reward-reveal-actions">
          <button class="reward-reveal-button primary" type="button" data-action="next">
            ${this.escapeHtml(nextLabel)}
          </button>
        </div>
      `;
    }

    return `
      <div class="reward-reveal-actions">
        ${this.getBooleanAttribute('show-reset', true) ? `
          <button class="reward-reveal-button secondary" type="button" data-action="reset">
            ${this.escapeHtml(resetLabel)}
          </button>
        ` : ''}

        ${this.shouldShowClose() ? `
          <button class="reward-reveal-button primary" type="button" data-action="close">
            ${this.escapeHtml(closeLabel)}
          </button>
        ` : ''}
      </div>
    `;
  }

  private bindEvents(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;

        if (action === 'open') {
          this.open();
          return;
        }

        if (action === 'next') {
          this.revealNext();
          return;
        }

        if (action === 'reset') {
          this.reset();
          return;
        }

        if (action === 'close') {
          this.close();
        }
      });
    });

    this.shadow.querySelectorAll<HTMLButtonElement>('[data-reward-index]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number.parseInt(button.dataset.rewardIndex || '', 10);
        const reward = this.getVisibleRewards()[index];

        if (!reward) return;

        this.dispatchEvent(new CustomEvent('gwc-reward-reveal-reward-click', {
          detail: {
            reward,
            index,
            state: this.revealState
          },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  private getVisibleRewards(): RewardConfig[] {
    if (this.revealState === 'idle' || this.revealState === 'closed') {
      return [];
    }

    if (this.getMode() === 'all') {
      return this.rewards;
    }

    return this.rewards.slice(0, this.currentIndex + 1);
  }

  private emitCurrentItem(): void {
    const reward = this.rewards[this.currentIndex];

    if (!reward) return;

    this.dispatchEvent(new CustomEvent('gwc-reward-reveal-item', {
      detail: {
        reward: { ...reward },
        index: this.currentIndex,
        rewards: this.getRewards(),
        state: this.revealState
      },
      bubbles: true,
      composed: true
    }));
  }

  private markComplete(): void {
    this.revealState = 'revealed';
    this.render();
    this.applyThemeFromAttribute();

    this.dispatchEvent(new CustomEvent('gwc-reward-reveal-complete', {
      detail: {
        rewards: this.getRewards(),
        state: this.revealState
      },
      bubbles: true,
      composed: true
    }));
  }

  private getVariant(): RewardRevealVariant {
    const variant = this.getAttribute('variant');

    if (variant === 'cards' || variant === 'chest') {
      return variant;
    }

    return 'panel';
  }

  private getMode(): RewardRevealMode {
    const mode = this.getAttribute('mode');

    if (mode === 'sequence') {
      return mode;
    }

    return 'all';
  }

  private shouldShowClose(): boolean {
    return this.getBooleanAttribute('show-close', true);
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private getFallbackIcon(type: string): string {
    const icons: Record<string, string> = {
      coins: '🪙',
      xp: '✨',
      item: '🎒',
      skin: '🎨',
      chest: '🎁',
      boost: '⚡',
      custom: '🎁'
    };

    return icons[type] || icons.custom;
  }

  private formatAmount(amount: string | number): string {
    if (typeof amount === 'number') {
      return amount.toLocaleString();
    }

    return amount;
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
}

if (!customElements.get('gwc-reward-reveal')) {
  customElements.define('gwc-reward-reveal', GwcRewardReveal);
}