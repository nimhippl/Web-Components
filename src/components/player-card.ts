import { applyTheme } from '../utils/themes.js';
import type {
  PlayerCardClickEventDetail,
  PlayerCardConfig,
  PlayerCardEmblem,
  PlayerCardProgress,
  PlayerCardSize,
  PlayerCardStat,
  PlayerCardStatus,
  PlayerCardTone,
  PlayerCardVariant
} from '../types/index.js';

export class GwcPlayerCard extends HTMLElement {
  private config: PlayerCardConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'player-id',
      'name',
      'title',
      'avatar',
      'initials',
      'level',
      'rank',
      'score',
      'status',
      'current-player',
      'variant',
      'size',
      'tone',
      'interactive',
      'selected',
      'show-stats',
      'show-emblems',
      'show-progress',
      'show-status'
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

  setConfig(config: PlayerCardConfig): void {
    this.config = {
      ...config,
      stats: config.stats ? config.stats.map(stat => ({ ...stat })) : [],
      emblems: config.emblems ? config.emblems.map(emblem => ({ ...emblem })) : [],
      progress: config.progress ? { ...config.progress } : undefined
    };

    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): PlayerCardConfig | null {
    const config = this.getActiveConfig();

    if (!config) return null;

    return {
      ...config,
      stats: config.stats ? config.stats.map(stat => ({ ...stat })) : [],
      emblems: config.emblems ? config.emblems.map(emblem => ({ ...emblem })) : [],
      progress: config.progress ? { ...config.progress } : undefined
    };
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const config = this.getActiveConfig();

    if (!config) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="player-card empty">
          <div class="player-empty-text">No player data</div>
        </div>
      `;
      return;
    }

    const variant = this.getVariant(config.variant);
    const size = this.getSize(config.size);
    const tone = this.getTone(config.tone);
    const status = this.getStatus(config.status);
    const interactive = this.getBooleanAttribute('interactive', config.interactive ?? true);
    const selected = this.getBooleanAttribute('selected', config.selected ?? false);
    const showStats = this.getBooleanAttribute('show-stats', true);
    const showEmblems = this.getBooleanAttribute('show-emblems', true);
    const showProgress = this.getBooleanAttribute('show-progress', true);
    const showStatus = this.getBooleanAttribute('show-status', true);
    const isCurrentPlayer = this.getBooleanAttribute('current-player', config.isCurrentPlayer ?? false);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <button
        class="player-card variant-${variant} size-${size} tone-${tone} status-${status} ${selected ? 'selected' : ''} ${isCurrentPlayer ? 'current-player' : ''}"
        type="button"
        aria-label="${this.escapeHtml(this.getAriaLabel(config))}"
        aria-pressed="${selected}"
        ${interactive ? '' : 'disabled'}
      >
        <div class="player-header">
          ${this.renderAvatar(config, showStatus, status)}

          <div class="player-main">
            <div class="player-name-row">
              <div class="player-name">
                ${this.escapeHtml(config.name)}
              </div>

              ${isCurrentPlayer ? `
                <span class="player-you-badge">YOU</span>
              ` : ''}
            </div>

            ${config.title || config.rank ? `
              <div class="player-title">
                ${this.escapeHtml(config.title || config.rank || '')}
              </div>
            ` : ''}

            <div class="player-meta">
              ${config.level !== undefined ? `
                <span>Level ${this.escapeHtml(String(config.level))}</span>
              ` : ''}

              ${config.rank ? `
                <span>${this.escapeHtml(config.rank)}</span>
              ` : ''}

              ${config.score !== undefined ? `
                <span>${this.escapeHtml(this.formatValue(config.score))}</span>
              ` : ''}
            </div>
          </div>
        </div>

        ${showProgress && config.progress ? this.renderProgress(config.progress) : ''}

        ${showStats && config.stats && config.stats.length > 0 ? this.renderStats(config.stats) : ''}

        ${showEmblems && config.emblems && config.emblems.length > 0 ? this.renderEmblems(config.emblems) : ''}
      </button>
    `;

    this.bindEvents(config, interactive);
  }

  private renderAvatar(config: PlayerCardConfig, showStatus: boolean, status: PlayerCardStatus): string {
    const initials = config.initials || this.getInitials(config.name);

    return `
      <div class="player-avatar">
        ${config.avatar ? `
          <img src="${this.escapeAttribute(config.avatar)}" alt="" loading="lazy">
        ` : `
          <span>${this.escapeHtml(initials)}</span>
        `}

        ${showStatus ? `
           <span
            class="player-status-dot status-${status}"
            title="${this.escapeAttribute(this.getStatusLabel(status))}"
            aria-label="${this.escapeAttribute(this.getStatusLabel(status))}"></span>
        ` : ''}
      </div>
    `;
  }

  private renderProgress(progress: PlayerCardProgress): string {
    const percent = this.getProgressPercent(progress);
    const label = progress.label || 'Progress';
    const suffix = progress.suffix ? ` ${progress.suffix}` : '';

    return `
      <div class="player-progress">
        <div class="player-progress-header">
          <span>${this.escapeHtml(label)}</span>
          <span>${this.escapeHtml(`${this.formatValue(progress.value)} / ${this.formatValue(progress.max)}${suffix}`)}</span>
        </div>

        <div class="player-progress-track">
          <div class="player-progress-fill tone-${progress.tone || 'xp'}" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  private renderStats(stats: PlayerCardStat[]): string {
    return `
      <div class="player-stats">
        ${stats.map(stat => `
          <div class="player-stat tone-${stat.tone || 'neutral'}">
            ${stat.icon ? `<span class="player-stat-icon">${this.escapeHtml(stat.icon)}</span>` : ''}
            <span class="player-stat-content">
              <span class="player-stat-label">${this.escapeHtml(stat.label)}</span>
              <span class="player-stat-value">${this.escapeHtml(this.formatValue(stat.value))}</span>
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderEmblems(emblems: PlayerCardEmblem[]): string {
    return `
      <div class="player-emblems">
        ${emblems.map(emblem => `
          <span
            class="player-emblem rarity-${emblem.rarity || 'common'}"
            title="${this.escapeAttribute(emblem.name)}"
          >
            ${this.escapeHtml(emblem.icon || '◆')}
          </span>
        `).join('')}
      </div>
    `;
  }

  private bindEvents(config: PlayerCardConfig, interactive: boolean): void {
    const card = this.shadow.querySelector<HTMLButtonElement>('.player-card');

    if (!card || !interactive) return;

    card.addEventListener('click', () => {
      const detail: PlayerCardClickEventDetail = {
        config: this.getConfig() || { ...config },
        id: config.id,
        name: config.name
      };

      this.dispatchEvent(new CustomEvent('gwc-player-card-click', {
        detail,
        bubbles: true,
        composed: true
      }));
    });
  }

  private getActiveConfig(): PlayerCardConfig | null {
    if (this.config) {
      return {
        ...this.config,
        stats: this.config.stats ? this.config.stats.map(stat => ({ ...stat })) : [],
        emblems: this.config.emblems ? this.config.emblems.map(emblem => ({ ...emblem })) : [],
        progress: this.config.progress ? { ...this.config.progress } : undefined
      };
    }

    return this.getConfigFromAttributes();
  }

  private getConfigFromAttributes(): PlayerCardConfig | null {
    const name = this.getAttribute('name');

    if (!name) return null;

    return {
      id: this.getAttribute('player-id') || undefined,
      name,
      title: this.getAttribute('title') || undefined,
      avatar: this.getAttribute('avatar') || undefined,
      initials: this.getAttribute('initials') || undefined,
      level: this.getNumberAttribute('level'),
      rank: this.getAttribute('rank') || undefined,
      score: this.getAttribute('score') || undefined,
      status: this.getStatus(this.getAttribute('status') || undefined),
      isCurrentPlayer: this.getBooleanAttribute('current-player', false),
      variant: this.getVariant(this.getAttribute('variant') || undefined),
      size: this.getSize(this.getAttribute('size') || undefined),
      tone: this.getTone(this.getAttribute('tone') || undefined),
      interactive: this.getBooleanAttribute('interactive', true),
      selected: this.getBooleanAttribute('selected', false),
      stats: [],
      emblems: []
    };
  }

  private getProgressPercent(progress: PlayerCardProgress): number {
    if (!Number.isFinite(progress.max) || progress.max <= 0) return 0;

    const percent = (progress.value / progress.max) * 100;

    return Math.min(100, Math.max(0, percent));
  }

  private getNumberAttribute(name: string): number | undefined {
    const value = this.getAttribute(name);

    if (value === null) return undefined;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private getVariant(variant?: string): PlayerCardVariant {
    if (variant === 'compact' || variant === 'profile') {
      return variant;
    }

    return 'card';
  }

  private getSize(size?: string): PlayerCardSize {
    if (size === 'small' || size === 'large') {
      return size;
    }

    return 'medium';
  }

  private getTone(tone?: string): PlayerCardTone {
    if (
      tone === 'xp' ||
      tone === 'success' ||
      tone === 'warning' ||
      tone === 'danger' ||
      tone === 'gold'
    ) {
      return tone;
    }

    return 'neutral';
  }

  private getStatus(status?: string): PlayerCardStatus {
    if (status === 'online' || status === 'busy' || status === 'away') {
      return status;
    }

    return 'offline';
  }

  private getStatusLabel(status: PlayerCardStatus): string {
    const labels: Record<PlayerCardStatus, string> = {
      online: 'Online',
      offline: 'Offline',
      busy: 'Busy',
      away: 'Away'
    };

    return labels[status];
  }

  private getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return '?';

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  private formatValue(value: string | number): string {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return value;
  }

  private getAriaLabel(config: PlayerCardConfig): string {
    return `Player ${config.name}`;
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

if (!customElements.get('gwc-player-card')) {
  customElements.define('gwc-player-card', GwcPlayerCard);
}