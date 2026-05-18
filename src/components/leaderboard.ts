import { applyTheme } from '../utils/themes.js';
import type {
  LeaderboardEntry,
  LeaderboardEntryDetail,
  LeaderboardRankMode,
  LeaderboardVariant
} from '../types/index.js';

export class GwcLeaderboard extends HTMLElement {
  private rawData: LeaderboardEntry[] = [];
  private visibleData: LeaderboardEntry[] = [];
  private selectedEntryId: string | number | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return [
      'theme',
      'title',
      'max-entries',
      'empty-text',
      'score-suffix',
      'score-label',
      'variant',
      'rank-mode',
      'expand-on-click',
      'details-title'
    ];
  }

  connectedCallback(): void {
    this.updateVisibleData();
    this.render();
    this.applyThemeFromAttribute();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'theme') {
      this.applyThemeFromAttribute();
      return;
    }

    this.updateVisibleData();
    this.render();
  }

  setData(entries: LeaderboardEntry[]): void {
    this.rawData = [...entries];
    this.updateVisibleData();
    this.render();
  }

  private updateVisibleData(): void {
    const sortedEntries = this.getSortedEntries();
    const rankedEntries = this.applyRanks(sortedEntries);
    const maxEntries = this.getMaxEntries();

    this.visibleData = rankedEntries.slice(0, maxEntries);

    if (
      this.selectedEntryId !== null &&
      !this.visibleData.some(entry => entry.id === this.selectedEntryId)
    ) {
      this.selectedEntryId = null;
    }
  }

  private getSortedEntries(): LeaderboardEntry[] {
    return [...this.rawData].sort((a, b) => {
      const scoreDifference = b.score - a.score;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      const previousRankA = a.previousRank ?? Number.MAX_SAFE_INTEGER;
      const previousRankB = b.previousRank ?? Number.MAX_SAFE_INTEGER;
      const previousRankDifference = previousRankA - previousRankB;

      if (previousRankDifference !== 0) {
        return previousRankDifference;
      }

      const nameDifference = a.name.localeCompare(b.name);

      if (nameDifference !== 0) {
        return nameDifference;
      }

      return String(a.id).localeCompare(String(b.id));
    });
  }

  private applyRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    const rankMode = this.getRankMode();
    let previousScore: number | null = null;
    let previousRank = 0;
    let denseRank = 0;

    return entries.map((entry, index) => {
      let rank = index + 1;

      if (rankMode === 'competition') {
        if (previousScore === null || entry.score !== previousScore) {
          previousRank = index + 1;
        }

        rank = previousRank;
      }

      if (rankMode === 'dense') {
        if (previousScore === null || entry.score !== previousScore) {
          denseRank += 1;
        }

        rank = denseRank;
      }

      previousScore = entry.score;

      return {
        ...entry,
        rank
      };
    });
  }

  private getMaxEntries(): number {
    const maxEntries = Number.parseInt(this.getAttribute('max-entries') || '', 10);

    if (Number.isFinite(maxEntries) && maxEntries > 0) {
      return maxEntries;
    }

    return this.rawData.length;
  }

  private getRankMode(): LeaderboardRankMode {
    const rankMode = this.getAttribute('rank-mode');

    if (rankMode === 'competition' || rankMode === 'dense') {
      return rankMode;
    }

    return 'ordinal';
  }

  private getVariant(): LeaderboardVariant {
    const variant = this.getAttribute('variant');

    if (variant === 'compact' || variant === 'minimal') {
      return variant;
    }

    return 'card';
  }

  private shouldExpandOnClick(): boolean {
    return this.getBooleanAttribute('expand-on-click');
  }

  private getBooleanAttribute(name: string): boolean {
    const value = this.getAttribute(name);

    return value !== null && value !== 'false';
  }

  private isSelectedEntry(entry: LeaderboardEntry): boolean {
    return this.selectedEntryId === entry.id;
  }

  private applyThemeFromAttribute(): void {
    const theme = this.getAttribute('theme') || 'default';
    applyTheme(this.shadow.host as HTMLElement, theme);
  }

  private render(): void {
    const title = this.getAttribute('title') || 'Leaderboard';
    const emptyText = this.getAttribute('empty-text') || 'No entries yet';
    const variant = this.getVariant();
    const shouldShowHeader = variant !== 'minimal';
    const styles = ''; // Will be replaced by build script

    this.shadow.innerHTML = `
    <style>${styles}</style>
    <div class="leaderboard-container variant-${variant}">
      ${shouldShowHeader
      ? `
          <div class="leaderboard-header">
            <h2 class="leaderboard-title">${this.escapeHtml(title)}</h2>
          </div>
        `
      : ''
    }
      <div class="leaderboard-list">
        ${this.visibleData.length === 0
      ? `<div class="empty-state">${this.escapeHtml(emptyText)}</div>`
      : this.visibleData.map((entry, index) => this.renderEntry(entry, index)).join('')
    }
      </div>
    </div>
  `;

    this.bindEntryEvents();
  }

  private renderEntry(entry: LeaderboardEntry, index: number): string {
    const rank = entry.rank || index + 1;
    const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    const currentPlayerClass = entry.isCurrentPlayer ? 'current-player' : '';
    const variant = this.getVariant();
    const shouldShowRankChange = variant !== 'minimal';
    const shouldShowDetails = this.shouldExpandOnClick() && this.isSelectedEntry(entry);
    const detailsId = `leaderboard-entry-details-${index}`;

    return `
    <div class="leaderboard-entry-wrapper ${shouldShowDetails ? 'expanded' : ''}">
      <button
        class="leaderboard-entry ${rankClass} ${currentPlayerClass}"
        type="button"
        data-entry-index="${index}"
        aria-expanded="${shouldShowDetails}"
        ${shouldShowDetails ? `aria-controls="${detailsId}"` : ''}
      >
        <span class="entry-rank">
          ${medal || `<span class="rank-number">${rank}</span>`}
        </span>
        ${this.renderAvatar(entry)}
        <span class="entry-info">
          <span class="entry-name">${this.escapeHtml(entry.name)}</span>
          ${entry.isCurrentPlayer ? '<span class="current-player-label">You</span>' : ''}
        </span>
        ${shouldShowRankChange ? this.renderRankChange(entry) : ''}
        <span class="entry-score" aria-label="${this.getScoreAriaLabel(entry.score)}">
          ${this.formatScore(entry.score)}
        </span>
      </button>

      ${shouldShowDetails ? this.renderEntryDetails(entry, detailsId) : ''}
    </div>
  `;
  }

  private renderEntryDetails(entry: LeaderboardEntry, detailsId: string): string {
    const title = this.getAttribute('details-title') || 'Player details';
    const details = entry.details && entry.details.length > 0
      ? entry.details
      : this.getDefaultEntryDetails(entry);

    return `
    <div class="entry-details" id="${detailsId}">
      <div class="entry-details-title">${this.escapeHtml(title)}</div>
      <div class="entry-details-grid">
        ${details.map(detail => this.renderEntryDetail(detail)).join('')}
      </div>
    </div>
  `;
  }

  private renderEntryDetail(detail: LeaderboardEntryDetail): string {
    return `
    <div class="entry-detail">
      <span class="entry-detail-label">${this.escapeHtml(detail.label)}</span>
      <span class="entry-detail-value">${this.escapeHtml(this.formatDetailValue(detail.value))}</span>
    </div>
  `;
  }

  private getDefaultEntryDetails(entry: LeaderboardEntry): LeaderboardEntryDetail[] {
    return [
      {
        label: 'Rank',
        value: entry.rank ? `#${entry.rank}` : '—'
      },
      {
        label: 'Score',
        value: this.formatScore(entry.score)
      },
      {
        label: 'Previous rank',
        value: entry.previousRank ? `#${entry.previousRank}` : '—'
      },
      {
        label: 'Current player',
        value: entry.isCurrentPlayer ? 'Yes' : 'No'
      }
    ];
  }

  private formatDetailValue(value: LeaderboardEntryDetail['value']): string {
    if (value === null) return '—';

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  }

  private renderAvatar(entry: LeaderboardEntry): string {
    if (entry.avatar) {
      return `
      <img
        class="entry-avatar"
        src="${this.escapeHtml(entry.avatar)}"
        alt="${this.escapeHtml(entry.name)}"
        width="48"
        height="48"
        loading="lazy"
        decoding="async"
      />
    `;
    }

    return `<span class="entry-avatar entry-avatar-fallback" aria-hidden="true">${this.getInitials(entry.name)}</span>`;
  }

  private renderRankChange(entry: LeaderboardEntry): string {
    if (!entry.previousRank || !entry.rank) return '';

    const difference = entry.previousRank - entry.rank;

    if (difference > 0) {
      return `<span class="entry-rank-change up" title="Moved up ${difference} place${difference === 1 ? '' : 's'}">▲ ${difference}</span>`;
    }

    if (difference < 0) {
      const downBy = Math.abs(difference);
      return `<span class="entry-rank-change down" title="Moved down ${downBy} place${downBy === 1 ? '' : 's'}">▼ ${downBy}</span>`;
    }

    return '<span class="entry-rank-change same" title="No rank change">—</span>';
  }

  private bindEntryEvents(): void {
    const entryButtons = this.shadow.querySelectorAll<HTMLButtonElement>('.leaderboard-entry');

    entryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = Number.parseInt(button.dataset.entryIndex || '', 10);
        const entry = this.visibleData[index];

        if (!entry) return;

        let selected = this.isSelectedEntry(entry);

        if (this.shouldExpandOnClick()) {
          selected = !selected;
          this.selectedEntryId = selected ? entry.id : null;
          this.updateExpandedEntry();
        }

        this.dispatchEvent(new CustomEvent('gwc-entry-click', {
          detail: {
            entry,
            index,
            selected
          },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  private updateExpandedEntry(): void {
    const wrappers = this.shadow.querySelectorAll<HTMLElement>('.leaderboard-entry-wrapper');

    wrappers.forEach((wrapper, index) => {
      const entry = this.visibleData[index];
      const button = wrapper.querySelector<HTMLButtonElement>('.leaderboard-entry');
      const currentDetails = wrapper.querySelector<HTMLElement>('.entry-details');

      if (!entry || !button) return;

      const shouldShowDetails = this.shouldExpandOnClick() && this.isSelectedEntry(entry);
      const detailsId = `leaderboard-entry-details-${index}`;

      wrapper.classList.toggle('expanded', shouldShowDetails);
      button.setAttribute('aria-expanded', String(shouldShowDetails));

      if (shouldShowDetails) {
        button.setAttribute('aria-controls', detailsId);
      } else {
        button.removeAttribute('aria-controls');
      }

      if (currentDetails) {
        currentDetails.remove();
      }

      if (shouldShowDetails) {
        button.insertAdjacentHTML('afterend', this.renderEntryDetails(entry, detailsId));
      }
    });
  }

  private formatScore(score: number): string {
    const scoreSuffix = this.getAttribute('score-suffix') || '';
    const formattedScore = score.toLocaleString();

    return scoreSuffix ? `${formattedScore} ${this.escapeHtml(scoreSuffix)}` : formattedScore;
  }

  private getScoreAriaLabel(score: number): string {
    const scoreLabel = this.getAttribute('score-label') || 'Score';
    return `${scoreLabel}: ${score.toLocaleString()}`;
  }

  private getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Register the custom element
if (!customElements.get('gwc-leaderboard')) {
  customElements.define('gwc-leaderboard', GwcLeaderboard);
}