import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateTirePressure } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface TirePressureFormInput {
  weightUnit: 'kg' | 'lbs';
  riderWeightKg: number | '';
  riderWeightLbs: number | '';
  bikeWeightKg: number | '';
  bikeWeightLbs: number | '';
  tireWidth: number | '';
  rimDiameter: number | '';
  riderPosition: 'road' | 'gravel' | 'mtb';
}

export default function TirePressurePage() {
  useEffect(() => {
    analytics.trackCalculatorView('tire-pressure');
  }, []);
  const [input, setInput] = useStickyState<TirePressureFormInput>('tirePressure-input', {
    weightUnit: 'kg',
    riderWeightKg: 75,
    riderWeightLbs: 165,
    bikeWeightKg: 8,
    bikeWeightLbs: 17.6,
    tireWidth: 28,
    rimDiameter: 700,
    riderPosition: 'road',
  });

  const normalizedRiderWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.riderWeightLbs) || 0) * 0.45359237
    : Number(input.riderWeightKg) || 0;

  const normalizedBikeWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.bikeWeightLbs) || 0) * 0.45359237
    : Number(input.bikeWeightKg) || 0;

  const result = calculateTirePressure({
    riderWeightKg: normalizedRiderWeightKg,
    bikeWeightKg: normalizedBikeWeightKg,
    tireWidth: Number(input.tireWidth) || 0,
    rimDiameter: Number(input.rimDiameter) || 0,
    riderPosition: input.riderPosition,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tire Pressure Calculator</h1>
        <p className="text-gray-600">Calculate optimal tire pressure based on your weight and riding style</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as TirePressureFormInput['weightUnit'] })}
              options={[
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'lbs', label: 'Pounds (lbs)' },
              ]}
            />
            {input.weightUnit === 'lbs' ? (
              <>
                <Input
                  label="Rider Weight (lbs)"
                  type="number"
                  value={input.riderWeightLbs}
                  onChange={(value) => setInput({ ...input, riderWeightLbs: value === '' ? '' : parseFloat(value) })}
                  min="66"
                  max="330"
                  step="1"
                />
                <Input
                  label="Bike Weight (lbs)"
                  type="number"
                  value={input.bikeWeightLbs}
                  onChange={(value) => setInput({ ...input, bikeWeightLbs: value === '' ? '' : parseFloat(value) })}
                  min="9"
                  max="44"
                  step="0.5"
                />
                <p className="-mt-2 text-xs text-slate-500">
                  Rider in kg: {normalizedRiderWeightKg.toFixed(1)} kg • Bike in kg: {normalizedBikeWeightKg.toFixed(1)} kg
                </p>
              </>
            ) : (
              <>
                <Input
                  label="Rider Weight (kg)"
                  type="number"
                  value={input.riderWeightKg}
                  onChange={(value) => setInput({ ...input, riderWeightKg: value === '' ? '' : parseFloat(value) })}
                  min="30"
                  max="150"
                  step="0.5"
                />
                <Input
                  label="Bike Weight (kg)"
                  type="number"
                  value={input.bikeWeightKg}
                  onChange={(value) => setInput({ ...input, bikeWeightKg: value === '' ? '' : parseFloat(value) })}
                  min="4"
                  max="20"
                  step="0.1"
                />
              </>
            )}
            <Input
              label="Tire Width (mm)"
              type="number"
              value={input.tireWidth}
              onChange={(value) => setInput({ ...input, tireWidth: value === '' ? '' : parseFloat(value) })}
              min="20"
              max="60"
              step="1"
            />
            <Input
              label="Rim Diameter (mm)"
              type="number"
              value={input.rimDiameter}
              onChange={(value) => setInput({ ...input, rimDiameter: value === '' ? '' : parseFloat(value) })}
              min="600"
              max="800"
              step="5"
            />
            <Select
              label="Riding Style"
              value={input.riderPosition}
              onChange={(value) => setInput({ ...input, riderPosition: value as TirePressureFormInput['riderPosition'] })}
              options={[
                { value: 'road', label: 'Road (drop bars)' },
                { value: 'gravel', label: 'Gravel/Mixed' },
                { value: 'mtb', label: 'Mountain Bike' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Recommended Pressure</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Recommended Pressure</p>
                <p className="text-3xl font-bold text-blue-600">{result.recommendedPsi.toFixed(1)} psi</p>
                <p className="text-sm text-gray-600">{result.recommendedBar.toFixed(2)} bar</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Safe Range</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.minPsi.toFixed(1)} - {result.maxPsi.toFixed(1)} psi
                </p>
              </div>
              <div className="bg-white p-4 rounded border border-orange-200">
                <p className="text-sm text-gray-600">Note</p>
                <p className="text-sm text-gray-700">Start at recommended and adjust based on feel and conditions</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Pressure Tips</h3>
          <p className="text-sm text-gray-600">
            Check tire pressure before each ride. Higher for speed, lower for comfort
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            1-2 psi increase for every 10°C temperature drop
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Tire sidewalls show max pressure. Actual optimal is often 10-20% lower
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Tire Pressure Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator estimates optimal tire pressure based on total system weight and tire dimensions.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Total weight = rider + bike weight</li>
          <li>Tire size affects pressure distribution</li>
          <li>Road bikes: higher pressure for less rolling resistance</li>
          <li>Gravel/MTB: lower pressure for better traction and comfort</li>
          <li>Pressure affects rolling resistance, comfort, and grip</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Tire Pressure FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does temperature affect tire pressure?</summary>
            <p className="mt-2">Yes. Pressure increases in warm weather, decreases in cold. About 1 psi per 10°C change.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I inflate to the sidewall maximum?</summary>
            <p className="mt-2">No. The sidewall shows the maximum safe pressure, not optimal. Use recommended pressure for your weight/style.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between psi and bar?</summary>
            <p className="mt-2">1 bar = 14.5 psi. Bar is metric; psi is imperial. Most pumps show both.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/cycling-power-to-weight', title: 'Power-to-Weight', icon: 'electric_bolt' },
          { path: '/calories-cycling', title: 'Calories Cycling', icon: 'local_dining' },
        ]}
      />
    </div>
  );
}
