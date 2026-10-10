import { useState } from 'react';
import { GitHubContributionGraph } from 'github-contrib-graph/react';
import type { GitHubUser } from 'github-contrib-graph/react';
import 'github-contrib-graph/styles.css';
import './index.css';

const MONTH_NAME_MAP: Record<string, string> = {
  jan: '1月',
  feb: '2月',
  mar: '3月',
  apr: '4月',
  may: '5月',
  jun: '6月',
  jul: '7月',
  aug: '8月',
  sep: '9月',
  oct: '10月',
  nov: '11月',
  dec: '12月',
};

const formatMonthLabel = (name: string) => MONTH_NAME_MAP[name.toLowerCase().slice(0, 3)] ?? name;

const getYearRange = (data: GitHubUser) => {
  const weeks = data.contributionsCollection.contributionCalendar.weeks;
  const first = weeks[0]?.contributionDays[0]?.date;
  const lastWeek = weeks[weeks.length - 1];
  const last = lastWeek?.contributionDays[lastWeek.contributionDays.length - 1]?.date;
  const startYear = first?.slice(0, 4);
  const endYear = last?.slice(0, 4);

  if (!startYear || !endYear) return null;
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`;
};

export default function GitHubActivity() {
  const [yearRange, setYearRange] = useState<string | null>(null);

  return (
    <article className="home-card github-activity" aria-label="GitHub contribution graph">
      <header className="github-activity__head">
        <div className="github-activity__heading">
          <span className="home-card__eyebrow">GITHUB</span>
          <h2 className="github-activity__title">贡献绿墙</h2>
        </div>
        <span className="github-activity__year">{yearRange ?? '—'}</span>
      </header>

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
            cellSize: 17,
            cellGap: 3,
            cellRadius: 3,
            fontFamily: 'var(--font-mono)',
          }}
          showHeader={false}
          showFooter={false}
          showThumbnail={false}
          showMonthLabels
          showWeekdayLabels={false}
          showTooltips={false}
          monthLabelFormatter={(month) => formatMonthLabel(month.name)}
          onDataLoaded={(data) => {
            const range = getYearRange(data);
            if (range) setYearRange(range);
          }}
          loadingFallback={<div className="github-activity__state" />}
          errorFallback={<div className="github-activity__state" />}
        />
      </div>
    </article>
  );
}
