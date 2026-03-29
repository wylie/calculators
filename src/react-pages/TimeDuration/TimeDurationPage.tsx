import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Toggle from '../../components/Toggle';
import RelatedTools from '../../components/RelatedTools';
import { calculateTimeDuration } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function TimeDurationPage() {
  useEffect(() => {
    analytics.trackCalculatorView('time-duration');
  }, []);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [includeDate, setIncludeDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const result = calculateTimeDuration({
    startTime,
    endTime,
    includeDate,
    startDate: includeDate ? startDate : undefined,
    endDate: includeDate ? endDate : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Duration Calculator</h1>
        <p className="text-gray-600">Calculate duration between two times</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Times</h2>
          <div className="space-y-4">
            <Toggle
              label="Include Date (Multi-day)"
              value={includeDate}
              onChange={setIncludeDate}
            />
            {includeDate && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            {includeDate && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-teal-50">
            <h2 className="text-xl font-semibold mb-4 text-teal-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-teal-200">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-3xl font-bold text-teal-600">{result.formatted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours</p>
                <p className="text-xl font-semibold text-gray-900">{result.hours}h {result.minutes}m</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-lg font-semibold text-gray-900">{result.totalHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Minutes</p>
                <p className="text-lg font-semibold text-gray-900">{result.totalMinutes}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Duration Tips</h3>
          <p className="text-sm text-gray-600">
            Use multi-day mode to calculate durations spanning multiple days
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            A standard workday is 8 hours, a work week is typically 40 hours
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Single-day mode assumes end time after start, crossing midnight if needed
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this time duration calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Calculate the duration between two times. For same-day calculations, the calculator assumes
          the end time is after the start. Enable "Include Date" for multi-day durations.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Same day: If end time is earlier than start, assumes next day</li>
          <li>Multi-day: Calculates exact duration between dates and times</li>
          <li>Results show hours, minutes, and decimal hours</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Time duration calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if my times cross midnight?</summary>
            <p className="mt-2">In single-day mode, the calculator assumes end time is after start. Enable dates for precise multi-day calculation.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I track work hours with this?</summary>
            <p className="mt-2">Yes! Enter your clock-in and clock-out times to calculate total work hours.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why use decimal hours?</summary>
            <p className="mt-2">Decimal hours (e.g., 7.5 instead of 7:30) makes it easier to calculate pay or billing rates.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/time', title: 'Time Converter', icon: 'schedule' },
          { path: '/date-difference', title: 'Date Difference', icon: 'event' },
          { path: '/age', title: 'Age Calculator', icon: 'cake' },
        ]}
      />
    </div>
  );
}
