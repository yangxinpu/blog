import { GitHubContributionGraph } from 'github-contrib-graph/react';
import 'github-contrib-graph/styles.css';
import './index.css';

export default function GitHubActivity() {
  return (
    <article className="home-card github-activity" aria-label="GitHub contribution graph">
      <div className="github-activity__graph">
        <GitHubContributionGraph
          username="yangxinpu"
          theme={{
            bgColor: 'transparent',
            textColor: 'var(--text)',
            inactiveTextColor: 'var(--text-muted)',
            linkHoverColor: 'var(--accent-hover)',
            cellLevel0: 'var(--border-subtle)',
            cellLevel1: 'var(--primary-600)',
            cellLevel2: 'var(--primary-500)',
            cellLevel3: 'var(--primary-400)',
            cellLevel4: 'var(--primary-300)',
            borderColor: 'transparent',
            borderWidth: 0,
            cardPadding: 0,
            cardPaddingBlock: 0,
            cardRadius: 0,
            cellSize: 11,
            cellGap: 3,
            cellRadius: 3,
            fontFamily: 'var(--font-mono)',
          }}
          showHeader={false}
          showFooter={false}
          showThumbnail={false}
          showMonthLabels={false}
          showWeekdayLabels={false}
          showTooltips={false}
          loadingFallback={<div className="github-activity__state" />}
          errorFallback={<div className="github-activity__state" />}
        />
      </div>
    </article>
  );
}
