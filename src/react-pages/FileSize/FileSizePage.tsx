import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

const sizeUnits = ['KB', 'MB', 'GB'] as const;

type SizeUnit = typeof sizeUnits[number];

const unitFactor: Record<SizeUnit, number> = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export default function FileSizePage() {
  useEffect(() => {
    analytics.trackCalculatorView('file-size');
  }, []);
  const [value, setValue] = useStickyState('file-size-value', '50');
  const [fromUnit, setFromUnit] = useStickyState<SizeUnit>('file-size-from', 'MB');
  const [toUnit, setToUnit] = useStickyState<SizeUnit>('file-size-to', 'GB');

  const numericValue = parseFloat(value) || 0;
  const bytes = numericValue * unitFactor[fromUnit];
  const converted = bytes / unitFactor[toUnit];

  const handleReset = () => {
    setValue('50');
    setFromUnit('MB');
    setToUnit('GB');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">File Size Converter</h1>
      <p className="text-slate-600 mb-6">
        Convert file sizes between KB, MB, and GB.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Size"
                value={value}
                onChange={setValue}
                type="number"
                step="0.1"
              />
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as SizeUnit)}
                options={sizeUnits.map(unit => ({ value: unit, label: unit }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div />
              <Select
                label="To Unit"
                value={toUnit}
                onChange={(val) => setToUnit(val as SizeUnit)}
                options={sizeUnits.map(unit => ({ value: unit, label: unit }))}
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
              <p className="text-sm text-slate-600 mb-2">Converted Size</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {formatNumber(converted, 3)}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{toUnit}</p>

              <div className="mt-6 p-3 bg-blue-50 rounded">
                <p className="text-xs text-slate-600">
                  {value} {fromUnit} = {formatNumber(converted, 3)} {toUnit}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this file size converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This tool converts between KB, MB, and GB using binary-size factors (1024 based) common in computing contexts.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>1 MB = 1024 KB</li>
          <li>1 GB = 1024 MB</li>
          <li>Great for storage planning and transfer estimates</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">File size converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this use binary or decimal units?</summary>
            <p className="mt-2">This converter uses binary factors (1024), which is common for file size calculations.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I convert in both directions?</summary>
            <p className="mt-2">Yes. Select source and target units to convert either way.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/volume', title: 'Volume Converter', icon: 'water_drop' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
          { path: '/time', title: 'Time Converter', icon: 'schedule' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
        ]}
      />
    </div>
  );
}
