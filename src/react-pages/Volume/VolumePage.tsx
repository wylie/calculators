import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function VolumePage() {
  useEffect(() => {
    analytics.trackCalculatorView('volume');
  }, []);
  const [value, setValue] = useStickyState('volume-value', '10');
  const [fromUnit, setFromUnit] = useStickyState<'gal' | 'l'>('volume-from', 'gal');

  const numericValue = parseFloat(value) || 0;
  const converted = fromUnit === 'gal' ? numericValue * 3.785411784 : numericValue / 3.785411784;
  const toUnit = fromUnit === 'gal' ? 'L' : 'gal';

  const handleReset = () => {
    setValue('10');
    setFromUnit('gal');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Volume Converter</h1>
      <p className="text-slate-600 mb-6">
        Convert between gallons and liters.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Volume"
                value={value}
                onChange={setValue}
                type="number"
                step="0.1"
              />
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as 'gal' | 'l')}
                options={[
                  { value: 'gal', label: 'Gallons (US)' },
                  { value: 'l', label: 'Liters (L)' },
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
              <p className="text-sm text-slate-600 mb-2">Converted Volume</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {formatNumber(converted, 2)}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{toUnit}</p>

              <div className="mt-6 p-3 bg-blue-50 rounded">
                <p className="text-xs text-slate-600">
                  {value} {fromUnit === 'gal' ? 'gal' : 'L'} = {formatNumber(converted, 2)} {toUnit}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this volume converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          Converts US gallons and liters for household, fuel, and storage measurements.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Liters = gallons × 3.785411784</li>
          <li>Gallons = liters ÷ 3.785411784</li>
          <li>Calculations use US gallon units</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Volume converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this use US or UK gallons?</summary>
            <p className="mt-2">This tool uses US gallon conversion values.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I use this for recipes?</summary>
            <p className="mt-2">Yes, it is helpful for converting liquid measurements between systems.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/length', title: 'Length Converter', icon: 'straighten' },
          { path: '/area', title: 'Area Converter', icon: 'square_foot' },
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
          { path: '/file-size', title: 'File Size Converter', icon: 'storage' },
        ]}
      />
    </div>
  );
}
