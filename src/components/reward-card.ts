import { applyTheme } from '../utils/themes.js';
import type { RewardConfig, RewardRarity, RewardState, RewardType } from '../types/index.js';

export class GwcRewardCard extends HTMLElement {
  private config: RewardConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'size',
      'show-description',
      'show-rarity',
      'show-amount',
      'show-state-label',
      'show-claim-button',
      'claim-label',
      'claimable-label',
      'claimed-label',
      'locked-label'
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
  }

  setConfig(config: RewardConfig): void {
    this.config = config;
    this.render();
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script

    if (!this.config) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="reward-card empty" aria-hidden="true">
          <div class="reward-icon">🎁</div>
        </div>
      `;
      return;
    }

    const state = this.config.state;
    const size = this.getSize();
    const rarity = this.config.rarity || 'common';
    const rarityColor = this.getRarityColor(rarity);
    const showDescription = this.getBooleanAttribute('show-description', true);
    const showRarity = this.getBooleanAttribute('show-rarity', true);
    const showAmount = this.getBooleanAttribute('show-amount', true);
    const showStateLabel = this.getBooleanAttribute('show-state-label', true);
    const showClaimButton = this.shouldShowClaimButton(state);
    const icon = this.getDisplayIcon();
    const description = this.getDescription(state);
    const stateLabel = this.getStateLabel(state);
    const dateText = this.getDateText(state);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <div
        class="reward-card state-${state} size-${size}"
        style="--reward-rarity-color: ${rarityColor}"
        role="button"
        tabindex="0"
        aria-label="${this.escapeHtml(this.getAriaLabel())}"
      >
        <div class="reward-main">
          <div class="reward-icon-wrapper">
            <div class="reward-icon">${this.escapeHtml(icon)}</div>
            ${this.renderStateOverlay(state)}
          </div>

          <div class="reward-content">
            <div class="reward-header">
              <div class="reward-name">${this.escapeHtml(this.config.name)}</div>

              ${showAmount && this.config.amount !== undefined
      ? `<div class="reward-amount">${this.escapeHtml(this.formatAmount(this.config.amount))}</div>`
      : ''
    }
            </div>

            ${showDescription && description
      ? `<div class="reward-description">${this.escapeHtml(description)}</div>`
      : ''
    }

            <div class="reward-meta">
              ${showStateLabel ? `<span class="reward-state-label reward-state-label-${state}">${this.escapeHtml(stateLabel)}</span>` : ''}
              ${showRarity ? `<span class="reward-rarity ${rarity}">${this.escapeHtml(rarity)}</span>` : ''}
            </div>

            ${dateText ? `<div class="reward-date">${this.escapeHtml(dateText)}</div>` : ''}
          </div>
        </div>

        ${showClaimButton ? this.renderClaimButton() : ''}
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const card = this.shadow.querySelector<HTMLElement>('.reward-card');
    const claimButton = this.shadow.querySelector<HTMLButtonElement>('.reward-claim-button');

    if (!card || !this.config) return;

    card.addEventListener('click', () => {
      this.emitRewardClick();
    });

    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      this.emitRewardClick();
    });

    if (claimButton) {
      claimButton.addEventListener('click', event => {
        event.stopPropagation();
        this.emitRewardClaim();
      });
    }
  }

  private emitRewardClick(): void {
    if (!this.config) return;

    this.dispatchEvent(new CustomEvent('gwc-reward-click', {
      detail: {
        config: this.config,
        state: this.config.state
      },
      bubbles: true,
      composed: true
    }));
  }

  private emitRewardClaim(): void {
    if (!this.config || this.config.state !== 'claimable') return;

    this.dispatchEvent(new CustomEvent('gwc-reward-claim', {
      detail: {
        config: this.config,
        state: this.config.state
      },
      bubbles: true,
      composed: true
    }));
  }

  private renderStateOverlay(state: RewardState): string {
    if (state === 'locked') {
      return '<div class="reward-state-overlay locked">🔒</div>';
    }

    if (state === 'claimed') {
      return '<div class="reward-state-overlay claimed">✓</div>';
    }

    return '';
  }

  private renderClaimButton(): string {
    const claimLabel = this.getAttribute('claim-label') || 'Claim';

    return `
      <button class="reward-claim-button" type="button">
        ${this.escapeHtml(claimLabel)}
      </button>
    `;
  }

  private shouldShowClaimButton(state: RewardState): boolean {
    if (state !== 'claimable') return false;

    return this.getBooleanAttribute('show-claim-button', true);
  }

  private getDisplayIcon(): string {
    if (!this.config) return '🎁';

    if (this.config.icon) {
      return this.config.icon;
    }

    return this.getFallbackIcon(this.config.type || 'custom');
  }

  private getFallbackIcon(type: RewardType): string {
    const icons: Record<RewardType, string> = {
      coins: '🪙',
      xp: '✨',
      item: '🎒',
      skin: '🎨',
      chest: '🎁',
      boost: '⚡',
      custom: '🎁'
    };

    return icons[type];
  }

  private getDescription(state: RewardState): string {
    if (!this.config) return '';

    if (state === 'locked' && !this.config.description) {
      return 'This reward is not available yet.';
    }

    if (state === 'claimed' && !this.config.description) {
      return 'This reward has already been claimed.';
    }

    return this.config.description || '';
  }

  private getStateLabel(state: RewardState): string {
    if (state === 'claimable') {
      return this.getAttribute('claimable-label') || 'Claimable';
    }

    if (state === 'claimed') {
      return this.getAttribute('claimed-label') || 'Claimed';
    }

    return this.getAttribute('locked-label') || 'Locked';
  }

  private getDateText(state: RewardState): string {
    if (!this.config) return '';

    if (state === 'claimed' && this.config.claimedAt) {
      return `Claimed ${this.formatDate(this.config.claimedAt)}`;
    }

    return '';
  }

  private getRarityColor(rarity: RewardRarity): string {
    const colors: Record<RewardRarity, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };

    return colors[rarity];
  }

  private getSize(): string {
    const size = this.getAttribute('size');

    if (size === 'small' || size === 'large') {
      return size;
    }

    return 'medium';
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private formatAmount(amount: string | number): string {
    if (typeof amount === 'number') {
      return amount.toLocaleString();
    }

    return amount;
  }

  private formatDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString();
  }

  private getAriaLabel(): string {
    if (!this.config) return 'Reward card';

    return `${this.config.name}, ${this.config.state} reward`;
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

if (!customElements.get('gwc-reward-card')) {
  customElements.define('gwc-reward-card', GwcRewardCard);
}
