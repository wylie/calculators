import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import RelatedTools from '../../components/RelatedTools';
import { calculateAge } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function AgePage() {
  useEffect(() => {
    analytics.trackCalculatorView('age');
  }, []);
  const [birthDate, setBirthDate] = useState<string>('1990-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const result = calculateAge({
    birthDate: new Date(birthDate),
    targetDate: new Date(targetDate),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Calculator</h1>
        <p className="text-gray-600">Calculate exact age and days until next birthday</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Dates</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculate Age On</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-purple-50">
            <h2 className="text-xl font-semibold mb-4 text-purple-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-3xl font-bold text-purple-600">
                  {result.years} years
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {result.months} months, {result.days} days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Days Lived</p>
                <p className="text-xl font-semibold text-gray-900">{result.totalDays.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Until Next Birthday</p>
                <p className="text-lg font-semibold text-gray-900">{result.nextBirthday}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Age Tips</h3>
          <p className="text-sm text-gray-600">
            This calculator accounts for leap years automatically in date calculations
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            The average human lifespan has increased from 67 to 73 years globally since 1990
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Age calculations include exact years, months, and days for precision
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this age calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          The calculator computes the exact difference between your birth date and target date,
          accounting for varying month lengths and leap years.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Years: Complete years that have passed</li>
          <li>Months: Remaining months after years</li>
          <li>Days: Remaining days after months</li>
          <li>Total days: Complete days since birth</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Age calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this account for leap years?</summary>
            <p className="mt-2">Yes. The calculator automatically handles leap years when computing exact age and total days.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I calculate age on a future date?</summary>
            <p className="mt-2">Yes. Set "Calculate Age On" to any future date to see how old you'll be on that date.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why are total days important?</summary>
            <p className="mt-2">Total days lived can be useful for milestone celebrations or scientific age tracking.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/date-difference', title: 'Date Difference', icon: 'event' },
          { path: '/time-duration', title: 'Time Duration', icon: 'schedule' },
          { path: '/bmi', title: 'BMI Calculator', icon: 'monitor_weight' },
        ]}
      />
    </div>
  );
}
