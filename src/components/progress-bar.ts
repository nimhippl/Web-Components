import { applyTheme } from '../utils/themes.js';
import type {
  ProgressBarConfig,
  ProgressBarTone,
  ProgressBarVariant
} from '../types/index.js';

export class GwcProgressBar extends HTMLElement {
  private config: ProgressBarConfig = {
    value: 0,
    max: 100,
    variant: 'line',
    tone: 'xp',
    showValue: true,
    showPercent: false,
    animated: true,
    striped: false,
    disabled: false,
    completedLabel: 'Completed',
    segments: 5
  };

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'value',
      'max',
      'label',
      'description',
      'suffix',
      'variant',
      'tone',
      'show-value',
      'show-percent',
      'animated',
      'striped',
      'disabled',
      'completed-label',
      'segments'
    ];
  }

  connectedCallback(): void {
    this.syncConfigFromAttributes();
    this.render();
    this.applyThemeFromAttribute();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.syncConfigFromAttributes();
    this.render();
    this.applyThemeFromAttribute();
  }

  setConfig(config: ProgressBarConfig): void {
    this.config = {
      ...this.config,
      ...config,
      value: this.normalizeValue(config.value),
      max: this.normalizeMax(config.max),
      variant: this.normalizeVariant(config.variant),
      tone: this.normalizeTone(config.tone),
      showValue: config.showValue ?? this.config.showValue,
      showPercent: config.showPercent ?? this.config.showPercent,
      animated: config.animated ?? this.config.animated,
      striped: config.striped ?? this.config.striped,
      disabled: config.disabled ?? this.config.disabled,
      completedLabel: config.completedLabel ?? this.config.completedLabel,
      segments: this.normalizeSegments(config.segments)
    };

    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): ProgressBarConfig {
    return { ...this.config };
  }

  setValue(value: number): void {
    this.updateProgress(value, this.config.max, true);
  }

  setMax(max: number): void {
    this.updateProgress(this.config.value, max, true);
  }

  setProgress(value: number, max: number): void {
    this.updateProgress(value, max, true);
  }

  private updateProgress(value: number, max: number, emitEvents: boolean): void {
    const wasComplete = this.isComplete();

    this.config = {
      ...this.config,
      value: this.normalizeValue(value),
      max: this.normalizeMax(max)
    };

    const isComplete = this.isComplete();

    this.render();
    this.applyThemeFromAttribute();

    if (!emitEvents) return;

    this.dispatchEvent(new CustomEvent('gwc-progress-change', {
      detail: this.getEventDetail(),
      bubbles: true,
      composed: true
    }));

    if (!wasComplete && isComplete) {
      this.dispatchEvent(new CustomEvent('gwc-progress-complete', {
        detail: {
          ...this.getEventDetail(),
          complete: true
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const percent = this.getPercent();
    const complete = this.isComplete();
    const variant = this.config.variant || 'line';
    const tone = this.config.tone || 'xp';
    const classes = [
      'progress-bar',
      `variant-${variant}`,
      `tone-${tone}`,
      complete ? 'is-complete' : '',
      this.config.disabled ? 'is-disabled' : '',
      this.config.animated ? 'is-animated' : '',
      this.config.striped ? 'is-striped' : ''
    ].filter(Boolean).join(' ');

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section
        class="${classes}"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.escapeHtml(String(this.config.max))}"
        aria-valuenow="${this.escapeHtml(String(this.getDisplayValue()))}"
        aria-label="${this.escapeHtml(this.getAriaLabel())}"
      >
        ${this.renderHeader(percent)}

        ${this.config.description ? `
          <div class="progress-description">
            ${this.escapeHtml(this.config.description)}
          </div>
        ` : ''}

        ${variant === 'segmented'
      ? this.renderSegmentedProgress(percent)
      : this.renderLineProgress(percent)
    }

        ${complete && this.config.completedLabel ? `
          <div class="progress-completed">
            ✓ ${this.escapeHtml(this.config.completedLabel)}
          </div>
        ` : ''}
      </section>
    `;
  }

  private renderHeader(percent: number): string {
    const label = this.config.label || '';
    const meta = this.getMetaText(percent);

    if (!label && !meta) return '';

    return `
      <div class="progress-header">
        ${label ? `
          <div class="progress-label">
            ${this.escapeHtml(label)}
          </div>
        ` : ''}

        ${meta ? `
          <div class="progress-meta">
            ${this.escapeHtml(meta)}
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderLineProgress(percent: number): string {
    return `
      <div class="progress-track">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
    `;
  }

  private renderSegmentedProgress(percent: number): string {
    const segments = this.config.segments || 5;
    const filledSegments = Math.round((percent / 100) * segments);

    const html = Array.from({ length: segments }, (_, index) => {
      const filledClass = index < filledSegments ? 'is-filled' : '';

      return `<span class="progress-segment ${filledClass}"></span>`;
    }).join('');

    return `
  <div class="progress-segments" style="--segment-count: ${segments}" aria-hidden="true">
    ${html}
  </div>
  `;}

  private getMetaText(percent: number): string {
    const parts: string[] = [];

    if (this.config.showValue) {
      parts.push(this.getValueText());
    }

    if (this.config.showPercent) {
      parts.push(`${Math.round(percent)}%`);
    }

    return parts.join(' · ');
  }

  private getValueText(): string {
    const suffix = this.config.suffix ? ` ${this.config.suffix}` : '';

    return `${this.formatNumber(this.config.value)} / ${this.formatNumber(this.config.max)}${suffix}`;
  }

  private getEventDetail() {
    const percent = this.getPercent();

    return {
      value: this.config.value,
      max: this.config.max,
      percent,
      complete: this.isComplete(),
      config: this.getConfig()
    };
  }

  private getPercent(): number {
    if (this.config.max <= 0) return 0;

    const percent = (this.config.value / this.config.max) * 100;

    return Math.min(100, Math.max(0, percent));
  }

  private getDisplayValue(): number {
    return Math.min(this.config.value, this.config.max);
  }

  private isComplete(): boolean {
    return this.config.value >= this.config.max;
  }

  private getAriaLabel(): string {
    if (this.config.label) {
      return this.config.label;
    }

    return 'Progress';
  }

  private syncConfigFromAttributes(): void {
    this.config = {
      ...this.config,
      value: this.getNumberAttribute('value', this.config.value),
      max: this.getNumberAttribute('max', this.config.max),
      label: this.getOptionalAttribute('label', this.config.label),
      description: this.getOptionalAttribute('description', this.config.description),
      suffix: this.getOptionalAttribute('suffix', this.config.suffix),
      variant: this.normalizeVariant(this.getAttribute('variant') || this.config.variant),
      tone: this.normalizeTone(this.getAttribute('tone') || this.config.tone),
      showValue: this.getBooleanAttribute('show-value', this.config.showValue ?? true),
      showPercent: this.getBooleanAttribute('show-percent', this.config.showPercent ?? false),
      animated: this.getBooleanAttribute('animated', this.config.animated ?? true),
      striped: this.getBooleanAttribute('striped', this.config.striped ?? false),
      disabled: this.getBooleanAttribute('disabled', this.config.disabled ?? false),
      completedLabel: this.getOptionalAttribute('completed-label', this.config.completedLabel),
      segments: this.getNumberAttribute('segments', this.config.segments || 5)
    };

    this.config.value = this.normalizeValue(this.config.value);
    this.config.max = this.normalizeMax(this.config.max);
    this.config.segments = this.normalizeSegments(this.config.segments);
  }

  private getNumberAttribute(name: string, defaultValue: number): number {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) return defaultValue;

    return parsed;
  }

  private getOptionalAttribute(name: string, defaultValue?: string): string | undefined {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    return value;
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    return value !== 'false';
  }

  private normalizeValue(value: number): number {
    if (!Number.isFinite(value)) return 0;

    return Math.max(0, value);
  }

  private normalizeMax(max: number): number {
    if (!Number.isFinite(max) || max <= 0) return 100;

    return max;
  }

  private normalizeSegments(segments?: number): number {
    if (!segments || !Number.isFinite(segments)) return 5;

    return Math.min(50, Math.max(1, Math.round(segments)));
  }

  private normalizeVariant(variant?: string): ProgressBarVariant {
    if (variant === 'compact' || variant === 'segmented') {
      return variant;
    }

    return 'line';
  }

  private normalizeTone(tone?: string): ProgressBarTone {
    if (
      tone === 'health' ||
      tone === 'mana' ||
      tone === 'stamina' ||
      tone === 'success' ||
      tone === 'warning' ||
      tone === 'danger' ||
      tone === 'neutral'
    ) {
      return tone;
    }

    return 'xp';
  }

  private formatNumber(value: number): string {
    return value.toLocaleString();
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

if (!customElements.get('gwc-progress-bar')) {
  customElements.define('gwc-progress-bar', GwcProgressBar);
}