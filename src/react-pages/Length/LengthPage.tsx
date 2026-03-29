import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function LengthPage() {
  useEffect(() => {
    analytics.trackCalculatorView('length');
  }, []);
  const [shortValue, setShortValue] = useStickyState('length-short-value', '12');
  const [shortUnit, setShortUnit] = useStickyState<'in' | 'cm'>('length-short-unit', 'in');
  const [longValue, setLongValue] = useStickyState('length-long-value', '6');
  const [longUnit, setLongUnit] = useStickyState<'ft' | 'm'>('length-long-unit', 'ft');

  const shortNumeric = parseFloat(shortValue) || 0;
  const shortConverted = shortUnit === 'in' ? shortNumeric * 2.54 : shortNumeric / 2.54;
  const shortToUnit = shortUnit === 'in' ? 'cm' : 'in';

  const longNumeric = parseFloat(longValue) || 0;
  const longConverted = longUnit === 'ft' ? longNumeric * 0.3048 : longNumeric / 0.3048;
  const longToUnit = longUnit === 'ft' ? 'm' : 'ft';

  const handleReset = () => {
    setShortValue('12');
    setShortUnit('in');
    setLongValue('6');
    setLongUnit('ft');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Length Converter</h1>
      <p className="text-slate-600 mb-6">
        Convert inches and centimeters, feet and meters.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Inches / Centimeters"
                value={shortValue}
                onChange={setShortValue}
                type="number"
                step="0.1"
              />
              <Select
                label="From Unit"
                value={shortUnit}
                onChange={(val) => setShortUnit(val as 'in' | 'cm')}
                options={[
                  { value: 'in', label: 'Inches (in)' },
                  { value: 'cm', label: 'Centimeters (cm)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Input
                label="Feet / Meters"
                value={longValue}
                onChange={setLongValue}
                type="number"
                step="0.01"
              />
              <Select
                label="From Unit"
                value={longUnit}
                onChange={(val) => setLongUnit(val as 'ft' | 'm')}
                options={[
                  { value: 'ft', label: 'Feet (ft)' },
                  { value: 'm', label: 'Meters (m)' },
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Short Length</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatNumber(shortConverted, 2)} {shortToUnit}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {shortValue} {shortUnit} = {formatNumber(shortConverted, 2)} {shortToUnit}
                </p>
              </div>

              <div className="text-center border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600 mb-1">Long Length</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatNumber(longConverted, 3)} {longToUnit}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {longValue} {longUnit} = {formatNumber(longConverted, 3)} {longToUnit}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this length converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This page includes two common conversions: inches ↔ centimeters and feet ↔ meters for daily and professional use.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>1 inch = 2.54 centimeters</li>
          <li>1 foot = 0.3048 meters</li>
          <li>Conversions run both directions instantly</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Length converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What unit pairs are supported?</summary>
            <p className="mt-2">Inches/centimeters and feet/meters are both supported.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I use this for construction measurements?</summary>
            <p className="mt-2">Yes, this is useful for quick field checks and unit translation.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/area', title: 'Area Converter', icon: 'square_foot' },
          { path: '/volume', title: 'Volume Converter', icon: 'water_drop' },
        ]}
      />
    </div>
  );
}
