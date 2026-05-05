import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

const todayIso = new Date().toISOString().slice(0, 10);

function parseIsoDateToUtcTimestamp(value: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return NaN;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return NaN;
  }

  return date.getTime();
}

export default function DateDifferencePage() {
  useEffect(() => {
    analytics.trackCalculatorView('date-difference');
  }, []);
  const [startDate, setStartDate] = useStickyState('date-diff-start', todayIso);
  const [endDate, setEndDate] = useStickyState('date-diff-end', todayIso);

  const startTs = parseIsoDateToUtcTimestamp(startDate);
  const endTs = parseIsoDateToUtcTimestamp(endDate);
  const validDates = !isNaN(startTs) && !isNaN(endTs);
  const dayMs = 1000 * 60 * 60 * 24;
  const diffMs = validDates ? Math.abs(endTs - startTs) : 0;
  const days = Math.round(diffMs / dayMs);
  const weeks = days / 7;
  const months = days / 30.44;
  const years = days / 365.2425;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Date Difference Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate the time difference between two dates.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Dates</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-sm text-slate-600">Total Days</p>
                <p className="text-4xl font-bold text-blue-600">{formatNumber(days, 0)}</p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Weeks</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(weeks, 2)}</p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Months (approx)</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(months, 2)}</p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Years (approx)</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(years, 2)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this date difference calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          The tool measures the absolute time gap between two dates and reports the difference in days, weeks,
          approximate months, and approximate years.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Days are based on exact millisecond difference</li>
          <li>Weeks are derived from days ÷ 7</li>
          <li>Months are estimated using average month length</li>
          <li>Years are estimated using 365.2425 days per year</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Date difference FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Are month values exact?</summary>
            <p className="mt-2">Month totals are approximate for quick planning since calendar months have different lengths.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I compare dates in any order?</summary>
            <p className="mt-2">Yes. The calculator uses absolute difference, so start/end order does not affect magnitude.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/time', title: 'Time Converter', icon: 'schedule' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/length', title: 'Length Converter', icon: 'straighten' },
        ]}
      />
    </div>
  );
}
