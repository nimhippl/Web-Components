import { applyTheme } from '../utils/themes.js';
import type {
  EmblemConfig,
  EmblemRarity,
  EmblemShape,
  EmblemState
} from '../types/index.js';

export class GwcEmblem extends HTMLElement {
  private config: EmblemConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'size',
      'shape',
      'interactive',
      'selected',
      'show-state',
      'show-rarity',
      'label'
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

  setConfig(config: EmblemConfig): void {
    this.config = config;
    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): EmblemConfig | null {
    return this.config ? { ...this.config } : null;
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script

    if (!this.config) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <button class="emblem-container empty size-${this.getSize()} shape-${this.getShape()}" type="button" aria-label="Empty emblem">
          <span class="emblem-icon">
            <span class="emblem-icon-content">?</span>
          </span>
        </button>
      `;
      return;
    }

    const state = this.config.state;
    const rarity = this.config.rarity || 'common';
    const rarityColor = this.getRarityColor(rarity);
    const size = this.getSize();
    const shape = this.getShape();
    const selected = this.getBooleanAttribute('selected', false);
    const interactive = this.getBooleanAttribute('interactive', true);
    const showState = this.getBooleanAttribute('show-state', true);
    const showRarity = this.getBooleanAttribute('show-rarity', true);
    const icon = this.getDisplayIcon(state);
    const label = this.getAriaLabel(state);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <button
        class="emblem-container state-${state} rarity-${rarity} size-${size} shape-${shape} ${selected ? 'selected' : ''}"
        style="--emblem-rarity-color: ${rarityColor}"
        type="button"
        aria-label="${this.escapeHtml(label)}"
        aria-pressed="${selected}"
        ${interactive ? '' : 'disabled'}
      >
        <span class="emblem-icon">
          <span class="emblem-icon-content">${this.escapeHtml(icon)}</span>
        </span>

        ${showState ? this.renderStateOverlay(state) : ''}
        ${showRarity ? this.renderRarityMark(rarity) : ''}
      </button>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const button = this.shadow.querySelector<HTMLButtonElement>('.emblem-container');

    if (!button || !this.config) return;

    const config = this.config;

    const emitClick = (): void => {
      if (!this.getBooleanAttribute('interactive', true)) return;

      this.dispatchEvent(new CustomEvent('gwc-emblem-click', {
        detail: {
          config,
          state: config.state
        },
        bubbles: true,
        composed: true
      }));
    };

    button.addEventListener('click', () => {
      emitClick();
    });

    button.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      emitClick();
    });
  }

  private renderStateOverlay(state: EmblemState): string {
    const overlays: Record<EmblemState, string> = {
      locked: '🔒',
      unlocked: '',
      claimable: '!',
      claimed: '✓',
      hidden: ''
    };

    const content = overlays[state];

    if (!content) return '';

    return `
    <span class="emblem-state-overlay emblem-state-${state}">
      ${this.escapeHtml(content)}
    </span>
  `;
  }

  private renderRarityMark(rarity: EmblemRarity): string {
    return `
    <span
      class="emblem-rarity-mark emblem-rarity-${rarity}"
      aria-hidden="true"
    ></span>
  `;
  }

  private getDisplayIcon(state: EmblemState): string {
    if (!this.config) return '?';

    if (state === 'hidden') {
      return '❔';
    }

    return this.config.icon || '◆';
  }

  private getSize(): string {
    const size = this.getAttribute('size');

    if (size === 'small' || size === 'large') {
      return size;
    }

    return 'medium';
  }

  private getShape(): EmblemShape {
    const shape = this.getAttribute('shape');

    if (
      shape === 'circle' ||
      shape === 'hex' ||
      shape === 'diamond'
    ) {
      return shape;
    }

    return 'shield';
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private getRarityColor(rarity: EmblemRarity): string {
    const colors: Record<EmblemRarity, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };

    return colors[rarity];
  }

  private getAriaLabel(state: EmblemState): string {
    if (!this.config) return 'Empty emblem';

    const label = this.getAttribute('label');

    if (label) {
      return label;
    }

    return `${this.config.name}, ${state} emblem`;
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

if (!customElements.get('gwc-emblem')) {
  customElements.define('gwc-emblem', GwcEmblem);
}