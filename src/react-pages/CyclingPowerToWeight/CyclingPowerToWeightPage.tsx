import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateCyclingPowerToWeight } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface CyclingPowerToWeightFormInput {
  powerWatts: number | '';
  weightUnit: 'kg' | 'lbs';
  weightKg: number | '';
  weightLbs: number | '';
}

export default function CyclingPowerToWeightPage() {
  useEffect(() => {
    analytics.trackCalculatorView('cycling-power-to-weight');
  }, []);
  const [input, setInput] = useStickyState<CyclingPowerToWeightFormInput>('cyclingPowerToWeight-input', {
    powerWatts: 300,
    weightUnit: 'kg',
    weightKg: 75,
    weightLbs: 165,
  });

  const normalizedWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.weightLbs) || 0) * 0.45359237
    : Number(input.weightKg) || 0;

  const result = calculateCyclingPowerToWeight({
    powerWatts: Number(input.powerWatts) || 0,
    weightKg: normalizedWeightKg,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cycling Power-to-Weight Calculator</h1>
        <p className="text-gray-600">Calculate your power-to-weight ratio and cycling performance level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Power Output (Watts)"
              type="number"
              value={input.powerWatts}
              onChange={(value) => setInput({ ...input, powerWatts: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10"
            />
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as CyclingPowerToWeightFormInput['weightUnit'] })}
              options={[
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'lbs', label: 'Pounds (lbs)' },
              ]}
            />
            {input.weightUnit === 'lbs' ? (
              <Input
                label="Body Weight (lbs)"
                type="number"
                value={input.weightLbs}
                onChange={(value) => setInput({ ...input, weightLbs: value === '' ? '' : parseFloat(value) })}
                min="44"
                step="1"
              />
            ) : (
              <Input
                label="Body Weight (kg)"
                type="number"
                value={input.weightKg}
                onChange={(value) => setInput({ ...input, weightKg: value === '' ? '' : parseFloat(value) })}
                min="20"
                step="0.5"
              />
            )}
            {input.weightUnit === 'lbs' && (
              <p className="-mt-2 text-xs text-slate-500">
                Weight in kg: {normalizedWeightKg.toFixed(1)} kg
              </p>
            )}
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Performance</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Power-to-Weight Ratio</p>
                <p className="text-3xl font-bold text-blue-600">{result.ratio.toFixed(2)} W/kg</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Performance Level</p>
                <p className="text-lg font-semibold text-gray-900">{result.level}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-lg font-semibold text-gray-900">{result.category}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">FTP Tips</h3>
          <p className="text-sm text-gray-600">
            FTP (Functional Threshold Power) is your sustainable power for 60 minutes
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Pro cyclists produce 6+ W/kg. Recreational riders produce 2-3 W/kg
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Measure power with a power meter for accuracy. Estimates are available online
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Power-to-Weight Ratio Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Power-to-weight ratio is your sustained power output divided by body weight.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Calculation: Power (watts) ÷ Body Weight (kg)</li>
          <li>Critical for climbing and sustained efforts</li>
          <li>Professional cyclists: 6+ W/kg</li>
          <li>Advanced amateurs: 4-5 W/kg</li>
          <li>Recreational: 2-3 W/kg</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Power-to-Weight FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I measure power output?</summary>
            <p className="mt-2">Use a power meter on your bike (crank, hub, or pedal-based). Trainer and online calculators can estimate it.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I improve my power-to-weight ratio?</summary>
            <p className="mt-2">Yes! Both increasing power (training) and losing weight help. A 5% weight loss and 5% power gain is significant.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is peak power the same as FTP?</summary>
            <p className="mt-2">No. Peak power is maximum for seconds; FTP is sustainable for 60 minutes. FTP is more useful.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/tire-pressure', title: 'Tire Pressure', icon: 'departure_board' },
          { path: '/calories-cycling', title: 'Calories Cycling', icon: 'local_dining' },
        ]}
      />
    </div>
  );
}
