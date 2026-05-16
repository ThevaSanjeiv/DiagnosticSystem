import { renderHeroCard, renderFeatureCards, renderStatsSection, renderActivitySection, renderQuickActions } from '../components/cards.js';

export function renderDashboardPage(data) {
  return `
    <div class="mx-auto flex max-w-7xl flex-col gap-8">
      ${renderHeroCard(data.welcome)}
      ${renderFeatureCards()}
      ${renderStatsSection(data.stats)}
      ${renderActivitySection(data.recentActivity)}
      ${renderQuickActions()}
    </div>
  `;
}
