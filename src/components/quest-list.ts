import { applyTheme } from '../utils/themes.js';
import type {
  QuestClickEventDetail,
  QuestClaimEventDetail,
  QuestConfig,
  QuestDifficulty,
  QuestFilterChangeEventDetail,
  QuestListConfig,
  QuestListFilter,
  QuestListVariant,
  QuestProgress,
  QuestReward,
  QuestState
} from '../types/index.js';

export class GwcQuestList extends HTMLElement {
  private quests: QuestConfig[] = [];
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
      'filter',
      'show-filters',
      'show-progress',
      'show-rewards',
      'show-claim-button',
      'claim-label',
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

  setQuests(quests: QuestConfig[]): void {
    this.quests = quests.map(quest => this.cloneQuest(quest));
    this.render();
    this.applyThemeFromAttribute();
  }

  setConfig(config: QuestListConfig): void {
    if (config.title !== undefined) {
      this.setAttribute('title', config.title);
    }

    if (config.subtitle !== undefined) {
      this.setAttribute('subtitle', config.subtitle);
    }

    if (config.variant !== undefined) {
      this.setAttribute('variant', config.variant);
    }

    if (config.filter !== undefined) {
      this.setAttribute('filter', config.filter);
    }

    if (config.showFilters !== undefined) {
      this.setAttribute('show-filters', String(config.showFilters));
    }

    if (config.showProgress !== undefined) {
      this.setAttribute('show-progress', String(config.showProgress));
    }

    if (config.showRewards !== undefined) {
      this.setAttribute('show-rewards', String(config.showRewards));
    }

    if (config.showClaimButton !== undefined) {
      this.setAttribute('show-claim-button', String(config.showClaimButton));
    }

    if (config.claimLabel !== undefined) {
      this.setAttribute('claim-label', config.claimLabel);
    }

    if (config.emptyText !== undefined) {
      this.setAttribute('empty-text', config.emptyText);
    }

    this.quests = config.quests.map(quest => this.cloneQuest(quest));
    this.render();
    this.applyThemeFromAttribute();
  }

  getQuests(): QuestConfig[] {
    return this.quests.map(quest => this.cloneQuest(quest));
  }

  setFilter(filter: QuestListFilter): void {
    this.setAttribute('filter', filter);
  }

  getFilter(): QuestListFilter {
    return this.getFilterFromAttribute();
  }

  private render(): void {
    const styles = ''; // Will be replaced by build script
    const title = this.getAttribute('title') || 'Quests';
    const subtitle = this.getAttribute('subtitle') || '';
    const variant = this.getVariant();
    const filter = this.getFilterFromAttribute();
    const filteredQuests = this.getFilteredQuests(filter);
    const showFilters = this.getBooleanAttribute('show-filters', true);

    this.shadow.innerHTML = `
      <style>${styles}</style>

      <section class="quest-list variant-${variant}">
        <div class="quest-list-header">
          <div>
            <div class="quest-list-title">${this.escapeHtml(title)}</div>

            ${subtitle ? `
              <div class="quest-list-subtitle">${this.escapeHtml(subtitle)}</div>
            ` : ''}
          </div>

          <div class="quest-list-count">
            ${this.escapeHtml(String(filteredQuests.length))} / ${this.escapeHtml(String(this.quests.length))}
          </div>
        </div>

        ${showFilters ? this.renderFilters(filter) : ''}

        ${filteredQuests.length > 0 ? `
          <div class="quest-items">
            ${filteredQuests.map(quest => this.renderQuest(quest)).join('')}
          </div>
        ` : this.renderEmptyState()}
      </section>
    `;

    this.bindEvents();
  }

  private renderFilters(activeFilter: QuestListFilter): string {
    const filters: QuestListFilter[] = [
      'all',
      'active',
      'claimable',
      'completed',
      'claimed',
      'locked'
    ];

    return `
      <div class="quest-filters" role="tablist" aria-label="Quest filters">
        ${filters.map(filter => `
          <button
            class="quest-filter ${filter === activeFilter ? 'active' : ''}"
            type="button"
            data-filter="${filter}"
            role="tab"
            aria-selected="${filter === activeFilter}"
          >
            ${this.escapeHtml(this.getFilterLabel(filter))}
          </button>
        `).join('')}
      </div>
    `;
  }

  private renderQuest(quest: QuestConfig): string {
    const difficulty = this.getDifficulty(quest.difficulty);
    const state = quest.state;
    const progressPercent = quest.progress ? this.getProgressPercent(quest.progress) : 0;
    const showProgress = this.getBooleanAttribute('show-progress', true);
    const showRewards = this.getBooleanAttribute('show-rewards', true);
    const showClaimButton = this.getBooleanAttribute('show-claim-button', true);
    const canClaim = state === 'claimable';
    const isLocked = state === 'locked';

    return `
      <article
        class="quest-item state-${state} difficulty-${difficulty}"
        data-quest-id="${this.escapeAttribute(String(quest.id))}"
      >
        <button
          class="quest-main"
          type="button"
          data-action="quest-click"
          data-quest-id="${this.escapeAttribute(String(quest.id))}"
          aria-label="${this.escapeAttribute(quest.title)}"
        >
          <div class="quest-icon" aria-hidden="true">
            ${this.escapeHtml(this.getQuestIcon(quest))}
          </div>

          <div class="quest-content">
            <div class="quest-title-row">
              <div class="quest-title">${this.escapeHtml(quest.title)}</div>

              <div class="quest-badges">
                ${quest.category ? `
                  <span class="quest-badge category">${this.escapeHtml(quest.category)}</span>
                ` : ''}

                <span class="quest-badge difficulty">${this.escapeHtml(difficulty)}</span>
                <span class="quest-badge state">${this.escapeHtml(this.getStateLabel(state))}</span>
              </div>
            </div>

            ${quest.description ? `
              <div class="quest-description">${this.escapeHtml(quest.description)}</div>
            ` : ''}

            ${isLocked && quest.lockedReason ? `
              <div class="quest-locked-reason">🔒 ${this.escapeHtml(quest.lockedReason)}</div>
            ` : ''}

            ${showProgress && quest.progress ? `
              <div class="quest-progress">
                <div class="quest-progress-header">
                  <span>${this.escapeHtml(quest.progress.label || 'Progress')}</span>
                  <span>${this.escapeHtml(this.getProgressText(quest.progress))}</span>
                </div>

                <div class="quest-progress-track">
                  <div class="quest-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
              </div>
            ` : ''}

            ${showRewards && quest.rewards && quest.rewards.length > 0 ? this.renderRewards(quest.rewards) : ''}
          </div>
        </button>

        ${showClaimButton && canClaim ? `
          <div class="quest-actions">
            <button
              class="quest-claim-button"
              type="button"
              data-action="quest-claim"
              data-quest-id="${this.escapeAttribute(String(quest.id))}"
            >
              ${this.escapeHtml(quest.claimLabel || this.getAttribute('claim-label') || 'Claim reward')}
            </button>
          </div>
        ` : ''}
      </article>
    `;
  }

  private renderRewards(rewards: QuestReward[]): string {
    return `
      <div class="quest-rewards" aria-label="Quest rewards">
        ${rewards.map(reward => `
          <span
            class="quest-reward rarity-${reward.rarity || 'common'}"
            title="${this.escapeAttribute(reward.name)}"
          >
            <span class="quest-reward-icon">${this.escapeHtml(reward.icon || '🎁')}</span>
            <span class="quest-reward-text">
              ${this.escapeHtml(this.getRewardText(reward))}
            </span>
          </span>
        `).join('')}
      </div>
    `;
  }

  private renderEmptyState(): string {
    const emptyText = this.getAttribute('empty-text') || 'No quests found.';

    return `
      <div class="quest-empty">
        <div class="quest-empty-icon">📜</div>
        <div>${this.escapeHtml(emptyText)}</div>
      </div>
    `;
  }

  private bindEvents(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const filter = this.normalizeFilter(button.dataset.filter || 'all');

        this.setFilter(filter);

        const detail: QuestFilterChangeEventDetail = {
          filter
        };

        this.dispatchEvent(new CustomEvent('gwc-quest-filter-change', {
          detail,
          bubbles: true,
          composed: true
        }));
      });
    });

    this.shadow.querySelectorAll<HTMLButtonElement>('[data-action="quest-click"]').forEach(button => {
      button.addEventListener('click', () => {
        const quest = this.findQuest(button.dataset.questId);

        if (!quest) return;

        const detail: QuestClickEventDetail = {
          quest: this.cloneQuest(quest),
          id: quest.id,
          state: quest.state
        };

        this.dispatchEvent(new CustomEvent('gwc-quest-click', {
          detail,
          bubbles: true,
          composed: true
        }));
      });
    });

    this.shadow.querySelectorAll<HTMLButtonElement>('[data-action="quest-claim"]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();

        const quest = this.findQuest(button.dataset.questId);

        if (!quest) return;

        const detail: QuestClaimEventDetail = {
          quest: this.cloneQuest(quest),
          id: quest.id,
          state: quest.state
        };

        this.dispatchEvent(new CustomEvent('gwc-quest-claim', {
          detail,
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  private getFilteredQuests(filter: QuestListFilter): QuestConfig[] {
    if (filter === 'all') {
      return this.quests;
    }

    return this.quests.filter(quest => quest.state === filter);
  }

  private findQuest(id?: string): QuestConfig | undefined {
    if (!id) return undefined;

    return this.quests.find(quest => String(quest.id) === String(id));
  }

  private getQuestIcon(quest: QuestConfig): string {
    if (quest.state === 'locked') return '🔒';
    if (quest.state === 'claimed') return '✅';
    if (quest.state === 'claimable') return '🎁';

    return quest.icon || '📜';
  }

  private getRewardText(reward: QuestReward): string {
    const amount = reward.amount !== undefined ? `${reward.amount} ` : '';

    return `${amount}${reward.name}`;
  }

  private getProgressText(progress: QuestProgress): string {
    const suffix = progress.suffix ? ` ${progress.suffix}` : '';

    return `${this.formatNumber(progress.value)} / ${this.formatNumber(progress.max)}${suffix}`;
  }

  private getProgressPercent(progress: QuestProgress): number {
    if (!Number.isFinite(progress.max) || progress.max <= 0) return 0;

    const percent = (progress.value / progress.max) * 100;

    return Math.min(100, Math.max(0, percent));
  }

  private getFilterLabel(filter: QuestListFilter): string {
    const labels: Record<QuestListFilter, string> = {
      all: 'All',
      active: 'Active',
      completed: 'Completed',
      claimable: 'Claimable',
      claimed: 'Claimed',
      locked: 'Locked'
    };

    return labels[filter];
  }

  private getStateLabel(state: QuestState): string {
    const labels: Record<QuestState, string> = {
      locked: 'Locked',
      active: 'Active',
      completed: 'Completed',
      claimable: 'Ready',
      claimed: 'Claimed'
    };

    return labels[state];
  }

  private getVariant(): QuestListVariant {
    const variant = this.getAttribute('variant');

    if (variant === 'compact' || variant === 'minimal') {
      return variant;
    }

    return 'card';
  }

  private getDifficulty(difficulty?: string): QuestDifficulty {
    if (
      difficulty === 'easy' ||
      difficulty === 'hard' ||
      difficulty === 'epic' ||
      difficulty === 'legendary'
    ) {
      return difficulty;
    }

    return 'normal';
  }

  private getFilterFromAttribute(): QuestListFilter {
    return this.normalizeFilter(this.getAttribute('filter') || 'all');
  }

  private normalizeFilter(filter: string): QuestListFilter {
    if (
      filter === 'active' ||
      filter === 'completed' ||
      filter === 'claimable' ||
      filter === 'claimed' ||
      filter === 'locked'
    ) {
      return filter;
    }

    return 'all';
  }

  private getBooleanAttribute(name: string, defaultValue: boolean): boolean {
    const value = this.getAttribute(name);

    if (value === null) {
      return defaultValue;
    }

    return value !== 'false';
  }

  private cloneQuest(quest: QuestConfig): QuestConfig {
    return {
      ...quest,
      progress: quest.progress ? { ...quest.progress } : undefined,
      rewards: quest.rewards ? quest.rewards.map(reward => ({ ...reward })) : []
    };
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

  private escapeAttribute(text: string): string {
    return this.escapeHtml(text).replace(/"/g, '&quot;');
  }
}

if (!customElements.get('gwc-quest-list')) {
  customElements.define('gwc-quest-list', GwcQuestList);
}