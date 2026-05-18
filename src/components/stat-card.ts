import { applyTheme } from '../utils/themes.js';
import type {
  StatCardClickEventDetail,
  StatCardConfig,
  StatCardSize,
  StatCardTone,
  StatCardValue,
  StatCardVariant
} from '../types/index.js';

export class GwcStatCard extends HTMLElement {
  private config: StatCardConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'stat-id',
      'label',
      'value',
      'icon',
      'description',
      'delta',
      'delta-label',
      'tone',
      'variant',
      'size',
      'interactive',
      'selected',
      'show-description',
      'show-delta'
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

  setConfig(config: StatCardConfig): void {
    this.config = { ...config };
    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): StatCardConfig | null {
    const config = this.getActiveConfig();

    return config ? { ...config } : null;
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const config = this.getActiveConfig();

    if (!config) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="stat-card empty">
          <div class="stat-empty-text">No stat data</div>
        </div>
      `;
      return;
    }

    const variant = this.getVariant(config.variant);
    const tone = this.getTone(config.tone);
    const size = this.getSize(config.size);
    const interactive = this.getBooleanAttribute('interactive', config.interactive ?? true);
    const selected = this.getBooleanAttribute('selected', config.selected ?? false);
    const showDescription = this.getBooleanAttribute('show-description', true);
    const showDelta = this.getBooleanAttribute('show-delta', true);
    const hasDelta = config.delta !== undefined && config.delta !== null && String(config.delta) !== '';
    const deltaClass = hasDelta ? this.getDeltaClass(config.delta as StatCardValue) : '';

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <button
        class="stat-card variant-${variant} tone-${tone} size-${size} ${selected ? 'selected' : ''}"
        type="button"
        aria-label="${this.escapeHtml(this.getAriaLabel(config))}"
        aria-pressed="${selected}"
        ${interactive ? '' : 'disabled'}
      >
        <div class="stat-card-main">
          ${config.icon ? `
            <div class="stat-icon" aria-hidden="true">
              ${this.escapeHtml(config.icon)}
            </div>
          ` : ''}

          <div class="stat-content">
            <div class="stat-label">
              ${this.escapeHtml(config.label)}
            </div>

            <div class="stat-value-row">
              <div class="stat-value">
                ${this.escapeHtml(this.formatValue(config.value))}
              </div>

              ${showDelta && hasDelta ? `
                <div class="stat-delta ${deltaClass}">
                  ${this.escapeHtml(this.formatValue(config.delta as StatCardValue))}
                </div>
              ` : ''}
            </div>

            ${showDescription && config.description ? `
              <div class="stat-description">
                ${this.escapeHtml(config.description)}
              </div>
            ` : ''}

            ${showDelta && hasDelta && config.deltaLabel ? `
              <div class="stat-delta-label">
                ${this.escapeHtml(config.deltaLabel)}
              </div>
            ` : ''}
          </div>
        </div>
      </button>
    `;

    this.bindEvents(config, interactive);
  }

  private bindEvents(config: StatCardConfig, interactive: boolean): void {
    const card = this.shadow.querySelector<HTMLButtonElement>('.stat-card');

    if (!card || !interactive) return;

    card.addEventListener('click', () => {
      const detail: StatCardClickEventDetail = {
        config: { ...config },
        id: config.id,
        label: config.label,
        value: config.value
      };

      this.dispatchEvent(new CustomEvent('gwc-stat-card-click', {
        detail,
        bubbles: true,
        composed: true
      }));
    });
  }

  private getActiveConfig(): StatCardConfig | null {
    if (this.config) {
      return { ...this.config };
    }

    return this.getConfigFromAttributes();
  }

  private getConfigFromAttributes(): StatCardConfig | null {
    const label = this.getAttribute('label');
    const value = this.getAttribute('value');

    if (label === null && value === null) {
      return null;
    }

    return {
      id: this.getAttribute('stat-id') || undefined,
      label: label || 'Stat',
      value: value ?? '',
      icon: this.getAttribute('icon') || undefined,
      description: this.getAttribute('description') || undefined,
      delta: this.getAttribute('delta') || undefined,
      deltaLabel: this.getAttribute('delta-label') || undefined,
      tone: this.getTone(this.getAttribute('tone') || undefined),
      variant: this.getVariant(this.getAttribute('variant') || undefined),
      size: this.getSize(this.getAttribute('size') || undefined),
      interactive: this.getBooleanAttribute('interactive', true),
      selected: this.getBooleanAttribute('selected', false)
    };
  }

  private getVariant(variant?: string): StatCardVariant {
    if (variant === 'compact' || variant === 'minimal') {
      return variant;
    }

    return 'card';
  }

  private getSize(size?: string): StatCardSize {
    if (size === 'small' || size === 'large') {
      return size;
    }

    return 'medium';
  }

  private getTone(tone?: string): StatCardTone {
    if (
      tone === 'success' ||
      tone === 'warning' ||
      tone === 'danger' ||
      tone === 'xp' ||
      tone === 'health' ||
      tone === 'mana' ||
      tone === 'stamina' ||
      tone === 'gold'
    ) {
      return tone;
    }

    return 'neutral';
  }

  private getDeltaClass(delta: StatCardValue): string {
    const value = String(delta).trim();

    if (value.startsWith('-')) {
      return 'negative';
    }

    if (value.startsWith('+')) {
      return 'positive';
    }

    return 'neutral';
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private formatValue(value: StatCardValue): string {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return value;
  }

  private getAriaLabel(config: StatCardConfig): string {
    return `${config.label}: ${this.formatValue(config.value)}`;
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

if (!customElements.get('gwc-stat-card')) {
  customElements.define('gwc-stat-card', GwcStatCard);
}