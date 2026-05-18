import { applyTheme } from '../utils/themes.js';
import type { TooltipPosition } from '../types/index.js';

export class GwcTooltip extends HTMLElement {
  private shadow: ShadowRoot;
  private isOpen = false;
  private handleDocumentClick: (event: MouseEvent) => void;
  private handleKeydown: (event: KeyboardEvent) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.handleDocumentClick = (event: MouseEvent) => {
      if (!this.contains(event.target as Node)) {
        this.setOpen(false);
      }
    };

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.setOpen(false);
      }
    };
  }

  static get observedAttributes(): string[] {
    return ['theme', 'tooltip-title', 'text', 'position'];
  }

  connectedCallback(): void {
    this.render();
    this.applyThemeFromAttribute();
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.render();
  }

  setConfig(config: { title?: string; text?: string; position?: TooltipPosition }): void {
    if (config.title !== undefined) {
      this.setAttribute('tooltip-title', config.title);
    }

    if (config.text !== undefined) {
      this.setAttribute('text', config.text);
    }

    if (config.position !== undefined) {
      this.setAttribute('position', config.position);
    }
  }

  private render(): void {
    const title = this.getAttribute('tooltip-title') || '';
    const text = this.getAttribute('text') || '';
    const position = this.getPosition();
    const styles = ''; // Will be replaced by build script

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <span class="tooltip-wrapper position-${position}">
        <span class="tooltip-trigger" tabindex="0" aria-describedby="tooltip-content">
          <slot>
            <button class="default-trigger" type="button" aria-label="Show tooltip">i</button>
          </slot>
        </span>

        <span class="tooltip-content" id="tooltip-content" role="tooltip">
          ${title ? `<span class="tooltip-title">${this.escapeHtml(title)}</span>` : ''}
          ${text ? `<span class="tooltip-text">${this.escapeHtml(text)}</span>` : '<slot name="content"></slot>'}
        </span>
      </span>
    `;

    this.bindEvents();
    this.syncOpenState();
  }

  private bindEvents(): void {
    const trigger = this.shadow.querySelector<HTMLElement>('.tooltip-trigger');

    if (!trigger) return;

    trigger.addEventListener('click', event => {
      event.stopPropagation();
      this.setOpen(!this.isOpen);
    });

    trigger.addEventListener('mouseenter', () => {
      this.setOpen(true);
    });

    trigger.addEventListener('mouseleave', () => {
      this.setOpen(false);
    });

    trigger.addEventListener('focusin', () => {
      this.setOpen(true);
    });

    trigger.addEventListener('focusout', () => {
      this.setOpen(false);
    });
  }

  private setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.syncOpenState();

    this.dispatchEvent(new CustomEvent('gwc-tooltip-toggle', {
      detail: { open: this.isOpen },
      bubbles: true,
      composed: true
    }));
  }

  private syncOpenState(): void {
    const wrapper = this.shadow.querySelector<HTMLElement>('.tooltip-wrapper');

    if (!wrapper) return;

    wrapper.classList.toggle('is-open', this.isOpen);
  }

  private getPosition(): TooltipPosition {
    const position = this.getAttribute('position');

    if (
      position === 'top' ||
      position === 'right' ||
      position === 'bottom' ||
      position === 'left'
    ) {
      return position;
    }

    return 'top';
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

if (!customElements.get('gwc-tooltip')) {
  customElements.define('gwc-tooltip', GwcTooltip);
}