import { applyTheme } from '../utils/themes.js';
import type { BadgeConfig, BadgeState } from '../types/index.js';

export class GwcBadge extends HTMLElement {
  private config: BadgeConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'size',
      'show-name',
      'show-description',
      'show-rarity',
      'show-progress',
      'show-state-label',
      'claim-label',
      'hidden-label'
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

  setConfig(config: BadgeConfig): void {
    this.config = config;
    this.render();
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script

    if (!this.config) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="badge-container empty" aria-hidden="true">
          <div class="badge-icon">?</div>
        </div>
      `;
      return;
    }

    const state = this.config.state;
    const size = this.getSize();
    const rarity = this.config.rarity || 'common';
    const rarityColor = this.getRarityColor(rarity);
    const showName = this.getBooleanAttribute('show-name', true);
    const showDescription = this.getBooleanAttribute('show-description', false);
    const showRarity = this.getBooleanAttribute('show-rarity', true) && state !== 'hidden';
    const showProgress = this.shouldShowProgress(state);
    const showStateLabel = this.getBooleanAttribute('show-state-label', true);
    const displayName = this.getDisplayName(state);
    const displayDescription = this.getDisplayDescription(state);
    const icon = this.getDisplayIcon(state);
    const dateText = this.getDateText(state);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <div
        class="badge-container state-${state} size-${size}"
        style="--badge-rarity-color: ${rarityColor}"
        role="button"
        tabindex="0"
        aria-label="${this.escapeHtml(this.getAriaLabel(displayName, state))}"
      >
        <div class="badge-icon-wrapper">
          <div class="badge-icon">
            ${this.escapeHtml(icon)}
          </div>
          ${this.renderStateOverlay(state)}
        </div>

        ${showName ? `<div class="badge-name">${this.escapeHtml(displayName)}</div>` : ''}

        ${showDescription && displayDescription
      ? `<div class="badge-description">${this.escapeHtml(displayDescription)}</div>`
      : ''
    }

        ${showStateLabel ? this.renderStateLabel(state) : ''}
        
        ${showProgress ? this.renderProgress() : ''}
        
        ${dateText ? `<div class="badge-date">${this.escapeHtml(dateText)}</div>` : ''}

        ${showRarity ? `<div class="badge-rarity ${rarity}">${this.escapeHtml(rarity)}</div>` : ''}

        ${this.renderAction(state)}
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const container = this.shadow.querySelector<HTMLElement>('.badge-container');
    const claimButton = this.shadow.querySelector<HTMLButtonElement>('.badge-action-button');

    if (!container || !this.config) return;

    container.addEventListener('click', () => {
      this.emitBadgeClick();
    });

    container.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      this.emitBadgeClick();
    });

    if (claimButton) {
      claimButton.addEventListener('click', event => {
        event.stopPropagation();
        this.emitBadgeClaim();
      });
    }
  }

  private emitBadgeClick(): void {
    if (!this.config) return;

    this.dispatchEvent(new CustomEvent('gwc-badge-click', {
      detail: {
        config: this.config,
        state: this.config.state
      },
      bubbles: true,
      composed: true
    }));
  }

  private emitBadgeClaim(): void {
    if (!this.config || this.config.state !== 'claimable') return;

    this.dispatchEvent(new CustomEvent('gwc-badge-claim', {
      detail: {
        config: this.config,
        state: this.config.state
      },
      bubbles: true,
      composed: true
    }));
  }

  private renderStateOverlay(state: BadgeState): string {
    if (state === 'locked') {
      return '<div class="state-overlay locked">🔒</div>';
    }

    if (state === 'hidden') {
      return '<div class="state-overlay hidden">?</div>';
    }

    if (state === 'claimable') {
      return '<div class="state-overlay claimable">!</div>';
    }

    if (state === 'claimed') {
      return '<div class="state-overlay claimed">✓</div>';
    }

    return '';
  }

  private renderStateLabel(state: BadgeState): string {
    const labels: Record<BadgeState, string> = {
      locked: 'Locked',
      unlocked: 'Unlocked',
      claimable: 'Ready to claim',
      claimed: 'Reward claimed',
      hidden: 'Secret'
    };

    return `
    <div class="badge-state-label badge-state-label-${state}">
      ${this.escapeHtml(labels[state])}
    </div>
  `;
  }

  private renderProgress(): string {
    if (!this.config) return '';

    const progress = this.config.progress || 0;
    const maxProgress = this.config.maxProgress || 0;
    const percentage = this.getProgressPercentage();

    return `
      <div class="badge-progress" aria-label="Progress ${progress} of ${maxProgress}">
        <div class="badge-progress-header">
          <span>Progress</span>
          <span>${this.escapeHtml(String(progress))} / ${this.escapeHtml(String(maxProgress))}</span>
        </div>
        <div class="badge-progress-track">
          <div class="badge-progress-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }

  private renderAction(state: BadgeState): string {
    if (state !== 'claimable') return '';

    const claimLabel = this.getAttribute('claim-label') || 'Claim';

    return `
      <button class="badge-action-button" type="button">
        ${this.escapeHtml(claimLabel)}
      </button>
    `;
  }

  private getDisplayName(state: BadgeState): string {
    if (!this.config) return '';

    if (state === 'hidden') {
      return this.getAttribute('hidden-label') || 'Secret badge';
    }

    return this.config.name;
  }

  private getDisplayDescription(state: BadgeState): string {
    if (!this.config) return '';

    if (state === 'hidden') {
      return 'Unlock this badge to reveal its details.';
    }

    return this.config.description || '';
  }

  private getDisplayIcon(state: BadgeState): string {
    if (!this.config) return '?';

    if (state === 'hidden') {
      return '❔';
    }

    return this.config.icon || '🏆';
  }

  private getDateText(state: BadgeState): string {
    if (!this.config) return '';

    if (state === 'unlocked' && this.config.unlockedAt) {
      return `Unlocked ${this.formatDate(this.config.unlockedAt)}`;
    }

    if (state === 'claimed' && this.config.claimedAt) {
      return `Claimed ${this.formatDate(this.config.claimedAt)}`;
    }

    return '';
  }

  private shouldShowProgress(state: BadgeState): boolean {
    if (!this.getBooleanAttribute('show-progress', true)) return false;
    if (state === 'hidden') return false;
    if (state === 'unlocked') return false;
    if (state === 'claimed') return false;

    return this.hasProgress();
  }

  private hasProgress(): boolean {
    if (!this.config) return false;

    return typeof this.config.progress === 'number' && typeof this.config.maxProgress === 'number';
  }

  private getProgressPercentage(): number {
    if (!this.config || !this.config.maxProgress || this.config.maxProgress <= 0) {
      return 0;
    }

    const progress = this.config.progress || 0;
    const percentage = (progress / this.config.maxProgress) * 100;

    return Math.max(0, Math.min(100, percentage));
  }

  private getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };

    return colors[rarity] || colors.common;
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

  private getAriaLabel(name: string, state: BadgeState): string {
    return `${name}, ${state} badge`;
  }

  private formatDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString();
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

if (!customElements.get('gwc-badge')) {
  customElements.define('gwc-badge', GwcBadge);
}