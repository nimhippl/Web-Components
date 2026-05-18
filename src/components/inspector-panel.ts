import { applyTheme } from '../utils/themes.js';
import type {
  InspectorPanelConfig,
  InspectorPanelField,
  InspectorPanelVariant,
  InspectorPanelValue
} from '../types/index.js';

export class GwcInspectorPanel extends HTMLElement {
  private config: InspectorPanelConfig | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'variant',
      'empty-text',
      'title',
      'subtitle',
      'description',
      'icon',
      'image',
      'event-name'
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

  setConfig(config: InspectorPanelConfig): void {
    this.config = {
      ...config,
      fields: config.fields ? config.fields.map(field => ({ ...field })) : []
    };

    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): InspectorPanelConfig | null {
    if (!this.config) return null;

    return {
      ...this.config,
      fields: this.config.fields ? this.config.fields.map(field => ({ ...field })) : []
    };
  }

  clear(): void {
    this.config = null;
    this.render();
    this.applyThemeFromAttribute();
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const config = this.config || this.getConfigFromAttributes();
    const variant = this.getVariant();

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section class="inspector-panel variant-${variant}">
        ${config ? this.renderConfig(config) : this.renderEmptyState()}
      </section>
    `;
  }

  private renderConfig(config: InspectorPanelConfig): string {
    const fields = config.fields || [];

    return `
      <div class="inspector-card">
        <div class="inspector-header">
          ${config.image || config.icon ? `
          <div class="inspector-icon" aria-hidden="true">
            ${config.image ? `
              <img src="${this.escapeAttribute(config.image)}" alt="">
            ` : this.escapeHtml(config.icon || '')}
          </div>
        ` : ''}

          <div class="inspector-title-group">
            <div class="inspector-title">
              ${this.escapeHtml(config.title)}
            </div>

            ${config.subtitle ? `
              <div class="inspector-subtitle">
                ${this.escapeHtml(config.subtitle)}
              </div>
            ` : ''}
          </div>
        </div>

        ${config.description ? `
          <div class="inspector-description">
            ${this.escapeHtml(config.description)}
          </div>
        ` : ''}

        ${fields.length > 0 ? `
          <div class="inspector-fields">
            ${fields.map(field => this.renderField(field)).join('')}
          </div>
        ` : ''}

        ${config.eventName ? `
          <div class="inspector-event">
            Event: <code>${this.escapeHtml(config.eventName)}</code>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderField(field: InspectorPanelField): string {
    return `
      <div class="inspector-row">
        <span class="inspector-row-label">
          ${this.escapeHtml(field.label)}
        </span>

        <span class="inspector-row-value">
          ${this.escapeHtml(this.formatValue(field.value))}
        </span>
      </div>
    `;
  }

  private renderEmptyState(): string {
    const emptyText = this.getAttribute('empty-text') || 'Select an item to see details.';

    return `
      <div class="inspector-empty">
        ${this.escapeHtml(emptyText)}
      </div>
    `;
  }

  private getConfigFromAttributes(): InspectorPanelConfig | null {
    const title = this.getAttribute('title');

    if (!title) return null;

    return {
      title,
      subtitle: this.getAttribute('subtitle') || undefined,
      description: this.getAttribute('description') || undefined,
      icon: this.getAttribute('icon') || undefined,
      image: this.getAttribute('image') || undefined,
      eventName: this.getAttribute('event-name') || undefined,
      fields: []
    };
  }

  private getVariant(): InspectorPanelVariant {
    const variant = this.getAttribute('variant');

    if (variant === 'card') {
      return 'card';
    }

    return 'dark';
  }

  private formatValue(value: InspectorPanelValue): string {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    return String(value);
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

if (!customElements.get('gwc-inspector-panel')) {
  customElements.define('gwc-inspector-panel', GwcInspectorPanel);
}