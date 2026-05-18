import { applyTheme } from '../utils/themes.js';
import type {
  CountdownConfig,
  CountdownEventDetail,
  CountdownState,
  CountdownTimeParts,
  CountdownTone,
  CountdownVariant
} from '../types/index.js';

export class GwcCountdown extends HTMLElement {
  private config: CountdownConfig = {
    label: 'Countdown',
    description: '',
    duration: 60,
    variant: 'card',
    tone: 'xp',
    autoStart: false,
    showDays: true,
    showLabels: true,
    showControls: true,
    completeLabel: 'Ready',
    startLabel: 'Start',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    resetLabel: 'Reset'
  };

  private state: CountdownState = 'idle';
  private endTimeMs: number | null = null;
  private initialDurationMs = 60000;
  private pausedRemainingMs: number | null = null;
  private timerId: number | undefined;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'label',
      'description',
      'end-at',
      'duration',
      'variant',
      'tone',
      'auto-start',
      'show-days',
      'show-labels',
      'show-controls',
      'complete-label',
      'start-label',
      'pause-label',
      'resume-label',
      'reset-label'
    ];
  }

  connectedCallback(): void {
    this.syncConfigFromAttributes();
    this.setupTargetTime();

    if (this.config.autoStart) {
      this.start(false);
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  disconnectedCallback(): void {
    this.clearTimer();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.clearTimer();
    this.syncConfigFromAttributes();
    this.setupTargetTime();
    this.state = 'idle';
    this.pausedRemainingMs = null;

    if (this.config.autoStart && this.isConnected) {
      this.start(false);
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  setConfig(config: CountdownConfig): void {
    this.clearTimer();

    this.config = {
      ...this.config,
      ...config,
      variant: this.getVariant(config.variant),
      tone: this.getTone(config.tone),
      autoStart: config.autoStart ?? this.config.autoStart,
      showDays: config.showDays ?? this.config.showDays,
      showLabels: config.showLabels ?? this.config.showLabels,
      showControls: config.showControls ?? this.config.showControls
    };

    this.setupTargetTime();
    this.state = 'idle';
    this.pausedRemainingMs = null;

    if (this.config.autoStart) {
      this.start(false);
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
  }

  getConfig(): CountdownConfig {
    return { ...this.config };
  }

  getState(): CountdownState {
    return this.state;
  }

  getRemainingMs(): number {
    if (this.state === 'paused' && this.pausedRemainingMs !== null) {
      return this.pausedRemainingMs;
    }

    if (this.endTimeMs === null) return 0;

    return Math.max(0, this.endTimeMs - Date.now());
  }

  start(emitEvent = true): void {
    if (this.state === 'running') return;

    if (this.state === 'paused' && this.pausedRemainingMs !== null) {
      this.endTimeMs = Date.now() + this.pausedRemainingMs;
    }

    if (this.endTimeMs === null || this.getRemainingMs() <= 0) {
      this.setupTargetTime();
    }

    if (this.getRemainingMs() <= 0) {
      this.complete();
      return;
    }

    this.state = 'running';
    this.pausedRemainingMs = null;
    this.startTimer();
    this.render();
    this.applyThemeFromAttribute();

    if (emitEvent) {
      this.dispatchCountdownEvent('gwc-countdown-start');
    }
  }

  pause(): void {
    if (this.state !== 'running') return;

    this.pausedRemainingMs = this.getRemainingMs();
    this.state = 'paused';
    this.clearTimer();
    this.render();
    this.applyThemeFromAttribute();

    this.dispatchCountdownEvent('gwc-countdown-pause');
  }

  reset(): void {
    this.clearTimer();
    this.setupTargetTime();
    this.state = 'idle';
    this.pausedRemainingMs = null;
    this.render();
    this.applyThemeFromAttribute();

    this.dispatchCountdownEvent('gwc-countdown-reset');
  }

  setDuration(seconds: number): void {
    this.config = {
      ...this.config,
      duration: seconds,
      endAt: undefined
    };

    this.reset();
  }

  setEndAt(endAt: string | number | Date): void {
    this.config = {
      ...this.config,
      endAt,
      duration: undefined
    };

    this.reset();
  }

  addTime(seconds: number): void {
    const addMs = Math.max(0, seconds * 1000);
    const remaining = this.getRemainingMs();

    this.endTimeMs = Date.now() + remaining + addMs;

    if (this.state === 'complete') {
      this.state = 'running';
      this.startTimer();
    }

    this.render();
    this.applyThemeFromAttribute();

    this.dispatchCountdownEvent('gwc-countdown-tick');
  }

  private startTimer(): void {
    this.clearTimer();

    this.timerId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerId !== undefined) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private tick(): void {
    if (this.getRemainingMs() <= 0) {
      this.complete();
      return;
    }

    this.render();
    this.applyThemeFromAttribute();
    this.dispatchCountdownEvent('gwc-countdown-tick');
  }

  private complete(): void {
    this.clearTimer();
    this.state = 'complete';
    this.pausedRemainingMs = null;

    if (this.endTimeMs !== null) {
      this.endTimeMs = Date.now();
    }

    this.render();
    this.applyThemeFromAttribute();

    this.dispatchEvent(new CustomEvent('gwc-countdown-complete', {
      detail: {
        ...this.getEventDetail(),
        state: 'complete',
        remainingMs: 0
      },
      bubbles: true,
      composed: true
    }));
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const variant = this.getVariant(this.config.variant);
    const tone = this.getTone(this.config.tone);
    const remainingMs = this.getRemainingMs();
    const parts = this.getTimeParts(remainingMs);
    const percent = this.getPercent();
    const isComplete = this.state === 'complete';

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section class="countdown variant-${variant} tone-${tone} state-${this.state}">
        <div class="countdown-header">
          <div>
            ${this.config.label ? `
              <div class="countdown-label">
                ${this.escapeHtml(this.config.label)}
              </div>
            ` : ''}

            ${this.config.description ? `
              <div class="countdown-description">
                ${this.escapeHtml(this.config.description)}
              </div>
            ` : ''}
          </div>

          <div class="countdown-state">
            ${this.escapeHtml(this.getStateLabel())}
          </div>
        </div>

        <div class="countdown-time" aria-live="polite">
          ${this.renderTimeUnit('days', parts.days)}
          ${this.renderTimeUnit('hours', parts.hours)}
          ${this.renderTimeUnit('minutes', parts.minutes)}
          ${this.renderTimeUnit('seconds', parts.seconds)}
        </div>

        <div class="countdown-progress" aria-hidden="true">
          <div class="countdown-progress-fill" style="width: ${percent}%"></div>
        </div>

        ${isComplete && this.config.completeLabel ? `
          <div class="countdown-complete">
            ✓ ${this.escapeHtml(this.config.completeLabel)}
          </div>
        ` : ''}

        ${this.config.showControls ? this.renderControls() : ''}
      </section>
    `;

    this.bindEvents();
  }

  private renderTimeUnit(unit: keyof CountdownTimeParts, value: number): string {
    if (unit === 'days' && !this.config.showDays && value === 0) {
      return '';
    }

    return `
      <div class="countdown-unit">
        <div class="countdown-value">
          ${this.escapeHtml(String(value).padStart(2, '0'))}
        </div>

        ${this.config.showLabels ? `
          <div class="countdown-unit-label">
            ${this.escapeHtml(this.getUnitLabel(unit))}
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderControls(): string {
    if (this.state === 'complete') {
      return `
        <div class="countdown-controls">
          <button class="countdown-button secondary" type="button" data-action="reset">
            ${this.escapeHtml(this.config.resetLabel || 'Reset')}
          </button>
        </div>
      `;
    }

    if (this.state === 'running') {
      return `
        <div class="countdown-controls">
          <button class="countdown-button secondary" type="button" data-action="pause">
            ${this.escapeHtml(this.config.pauseLabel || 'Pause')}
          </button>

          <button class="countdown-button ghost" type="button" data-action="reset">
            ${this.escapeHtml(this.config.resetLabel || 'Reset')}
          </button>
        </div>
      `;
    }

    return `
      <div class="countdown-controls">
        <button class="countdown-button primary" type="button" data-action="start">
          ${this.escapeHtml(this.state === 'paused'
      ? this.config.resumeLabel || 'Resume'
      : this.config.startLabel || 'Start'
    )}
        </button>

        <button class="countdown-button ghost" type="button" data-action="reset">
          ${this.escapeHtml(this.config.resetLabel || 'Reset')}
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;

        if (action === 'start') {
          this.start();
          return;
        }

        if (action === 'pause') {
          this.pause();
          return;
        }

        if (action === 'reset') {
          this.reset();
        }
      });
    });
  }

  private setupTargetTime(): void {
    const endAtMs = this.getEndAtMs(this.config.endAt);
    const durationMs = this.getDurationMs(this.config.duration);

    if (endAtMs !== null) {
      this.endTimeMs = endAtMs;
      this.initialDurationMs = Math.max(1, endAtMs - Date.now());
      return;
    }

    this.initialDurationMs = durationMs;
    this.endTimeMs = Date.now() + durationMs;
  }

  private getEndAtMs(value?: string | number | Date): number | null {
    if (value === undefined || value === null || value === '') return null;

    if (value instanceof Date) {
      const time = value.getTime();
      return Number.isFinite(time) ? time : null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const parsed = Date.parse(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  private getDurationMs(duration?: number): number {
    if (!duration || !Number.isFinite(duration) || duration <= 0) {
      return 60000;
    }

    return duration * 1000;
  }

  private getTimeParts(ms: number): CountdownTimeParts {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  private getPercent(): number {
    if (this.initialDurationMs <= 0) return 0;

    const remaining = this.getRemainingMs();
    const elapsed = this.initialDurationMs - remaining;
    const percent = (elapsed / this.initialDurationMs) * 100;

    return Math.min(100, Math.max(0, percent));
  }

  private getEventDetail(): CountdownEventDetail {
    const remainingMs = this.getRemainingMs();

    return {
      state: this.state,
      remainingMs,
      totalMs: this.initialDurationMs,
      percent: this.getPercent(),
      parts: this.getTimeParts(remainingMs),
      config: this.getConfig()
    };
  }

  private dispatchCountdownEvent(name: string): void {
    this.dispatchEvent(new CustomEvent(name, {
      detail: this.getEventDetail(),
      bubbles: true,
      composed: true
    }));
  }

  private syncConfigFromAttributes(): void {
    this.config = {
      ...this.config,
      label: this.getOptionalAttribute('label', this.config.label),
      description: this.getOptionalAttribute('description', this.config.description),
      endAt: this.getOptionalAttribute('end-at', undefined),
      duration: this.getNumberAttribute('duration', this.config.duration || 60),
      variant: this.getVariant(this.getAttribute('variant') || this.config.variant),
      tone: this.getTone(this.getAttribute('tone') || this.config.tone),
      autoStart: this.getBooleanAttribute('auto-start', this.config.autoStart ?? false),
      showDays: this.getBooleanAttribute('show-days', this.config.showDays ?? true),
      showLabels: this.getBooleanAttribute('show-labels', this.config.showLabels ?? true),
      showControls: this.getBooleanAttribute('show-controls', this.config.showControls ?? true),
      completeLabel: this.getOptionalAttribute('complete-label', this.config.completeLabel),
      startLabel: this.getOptionalAttribute('start-label', this.config.startLabel),
      pauseLabel: this.getOptionalAttribute('pause-label', this.config.pauseLabel),
      resumeLabel: this.getOptionalAttribute('resume-label', this.config.resumeLabel),
      resetLabel: this.getOptionalAttribute('reset-label', this.config.resetLabel)
    };
  }

  private getOptionalAttribute(name: string, defaultValue?: string): string | undefined {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    return value;
  }

  private getNumberAttribute(name: string, defaultValue: number): number {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) return defaultValue;

    return parsed;
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) return defaultValue;

    return value !== 'false';
  }

  private getVariant(variant?: string): CountdownVariant {
    if (variant === 'compact' || variant === 'minimal') {
      return variant;
    }

    return 'card';
  }

  private getTone(tone?: string): CountdownTone {
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

  private getStateLabel(): string {
    const labels: Record<CountdownState, string> = {
      idle: 'Ready',
      running: 'Running',
      paused: 'Paused',
      complete: 'Complete'
    };

    return labels[this.state];
  }

  private getUnitLabel(unit: keyof CountdownTimeParts): string {
    const labels: Record<keyof CountdownTimeParts, string> = {
      days: 'days',
      hours: 'hrs',
      minutes: 'min',
      seconds: 'sec'
    };

    return labels[unit];
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

if (!customElements.get('gwc-countdown')) {
  customElements.define('gwc-countdown', GwcCountdown);
}