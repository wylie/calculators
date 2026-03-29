import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { convertPower } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function PowerConverterPage() {
  useEffect(() => {
    analytics.trackCalculatorView('power-converter');
  }, []);
  const [value, setValue] = useStickyState('powerConverter-value', '100');
  const [fromUnit, setFromUnit] = useStickyState<'watts' | 'hp'>('powerConverter-unit', 'watts');

  const result = convertPower({
    value: parseFloat(value) || 0,
    fromUnit,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Power Converter</h1>
        <p className="text-gray-600">Convert power measurements between watts and horsepower</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Power"
                value={value}
                onChange={setValue}
                type="number"
                step="1"
              />
            </div>
            <div>
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as 'watts' | 'hp')}
                options={[
                  { value: 'watts', label: 'Watts (w)' },
                  { value: 'hp', label: 'Horsepower (hp)' },
                ]}
              />
            </div>
          </div>
        </Card>

        <div>
          <Card className="bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Watts</p>
                <p className="text-2xl font-bold text-blue-600">{result.watts.toFixed(2)} W</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Horsepower</p>
                <p className="text-2xl font-bold text-blue-600">{result.horsepower.toFixed(4)} hp</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Power Tips</h3>
          <p className="text-sm text-gray-600">
            1 hp = 746 watts. Used for engines and motors
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            A typical car engine produces 100-200 hp. Human power output is 50-100 watts
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Mechanical horsepower differs slightly from electrical horsepower. This uses mechanical hp (746 W)
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Power Converter Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This converter switches between watts (metric) and horsepower (imperial) power measurements.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>1 horsepower (hp) = 746 watts (W)</li>
          <li>1 watt = 1 joule per second</li>
          <li>Used for engines, motors, and mechanical power</li>
          <li>Electrical power is measured in kilowatts (1000 watts)</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Power Converter FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why is it called horsepower?</summary>
            <p className="mt-2">James Watt defined it as the power needed to lift 550 pounds 1 foot in 1 second, roughly a horse's output.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between watts and kilowatts?</summary>
            <p className="mt-2">1 kilowatt (kW) = 1000 watts. Used for larger scales like home electricity usage and power plants.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How much power does a human produce?</summary>
            <p className="mt-2">Average person produces 50-100 watts at rest. Professional cyclists can produce 400+ watts temporarily.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/cooking-converter', title: 'Cooking Converter', icon: 'restaurant' },
          { path: '/distance-converter', title: 'Distance Converter', icon: 'straighten' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
        ]}
      />
    </div>
  );
}
