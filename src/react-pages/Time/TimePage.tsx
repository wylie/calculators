import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function TimePage() {
  useEffect(() => {
    analytics.trackCalculatorView('time');
  }, []);
  const [value, setValue] = useStickyState('time-value', '2');
  const [fromUnit, setFromUnit] = useStickyState<'hours' | 'minutes'>('time-from', 'hours');

  const numericValue = parseFloat(value) || 0;
  const converted = fromUnit === 'hours' ? numericValue * 60 : numericValue / 60;
  const toUnit = fromUnit === 'hours' ? 'minutes' : 'hours';

  const handleReset = () => {
    setValue('2');
    setFromUnit('hours');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Time Converter</h1>
      <p className="text-slate-600 mb-6">
        Convert between hours and minutes.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Time"
                value={value}
                onChange={setValue}
                type="number"
                step="0.1"
              />
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as 'hours' | 'minutes')}
                options={[
                  { value: 'hours', label: 'Hours' },
                  { value: 'minutes', label: 'Minutes' },
                ]}
              />
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Result</h3>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Converted Time</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {formatNumber(converted, 2)}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{toUnit}</p>

              <div className="mt-6 p-3 bg-blue-50 rounded">
                <p className="text-xs text-slate-600">
                  {value} {fromUnit} = {formatNumber(converted, 2)} {toUnit}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this time converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          Converts between hours and minutes for scheduling, work logs, and quick duration checks.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Minutes = hours × 60</li>
          <li>Hours = minutes ÷ 60</li>
          <li>Supports decimal values for partial units</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Time converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How many minutes are in 2.5 hours?</summary>
            <p className="mt-2">2.5 hours equals 150 minutes.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I convert minutes back to hours?</summary>
            <p className="mt-2">Yes. Choose minutes as input and the result is displayed in hours.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/date-difference', title: 'Date Difference', icon: 'date_range' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
          { path: '/file-size', title: 'File Size Converter', icon: 'storage' },
        ]}
      />
    </div>
  );
}
