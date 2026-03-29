import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function WeightPage() {
  useEffect(() => {
    analytics.trackCalculatorView('weight');
  }, []);
  const [value, setValue] = useStickyState('weight-value', '150');
  const [fromUnit, setFromUnit] = useStickyState<'lb' | 'kg'>('weight-from', 'lb');

  const numericValue = parseFloat(value) || 0;
  const converted = fromUnit === 'lb' ? numericValue * 0.45359237 : numericValue / 0.45359237;
  const toUnit = fromUnit === 'lb' ? 'kg' : 'lb';

  const handleReset = () => {
    setValue('150');
    setFromUnit('lb');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Weight Converter</h1>
      <p className="text-slate-600 mb-6">
        Convert between pounds and kilograms.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight"
                value={value}
                onChange={setValue}
                type="number"
                step="0.1"
              />
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as 'lb' | 'kg')}
                options={[
                  { value: 'lb', label: 'Pounds (lb)' },
                  { value: 'kg', label: 'Kilograms (kg)' },
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
              <p className="text-sm text-slate-600 mb-2">Converted Weight</p>
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
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this weight converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This converter translates between pounds and kilograms using standard metric-imperial conversion constants.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Kilograms = pounds × 0.45359237</li>
          <li>Pounds = kilograms ÷ 0.45359237</li>
          <li>Useful for fitness, nutrition, and shipping estimates</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Weight converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How many kilograms are in one pound?</summary>
            <p className="mt-2">One pound equals 0.45359237 kilograms.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I enter decimal values?</summary>
            <p className="mt-2">Yes. Decimal values are supported for more accurate conversions.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/calories', title: 'Calorie Calculator', icon: 'fastfood' },
          { path: '/length', title: 'Length Converter', icon: 'straighten' },
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
