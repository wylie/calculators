import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateCaloriesCycling } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function CaloriesCyclingPage() {
  useEffect(() => {
    analytics.trackCalculatorView('calories-cycling');
  }, []);
  const [input, setInput] = useStickyState<{
    weightUnit: 'kg' | 'lbs';
    weightKg: string | number;
    weightLbs: string | number;
    duration: string | number;
    intensity: string;
  }>('caloriescycling-input', {
    weightUnit: 'kg',
    weightKg: 75,
    weightLbs: 165,
    duration: 60,
    intensity: 'moderate',
  });

  const normalizedWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.weightLbs) || 0) * 0.45359237
    : Number(input.weightKg) || 0;

  const result = calculateCaloriesCycling({
    weightKg: normalizedWeightKg,
    duration: Number(input.duration) || 0,
    intensity: input.intensity as 'easy' | 'moderate' | 'vigorous' | 'race',
  });

  const calorieMarkers = [100, 250, 500];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calories Burned Cycling Calculator</h1>
        <p className="text-gray-600">Estimate how many calories you burn during a cycling session</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Session</h2>
          <div className="space-y-4">
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as 'kg' | 'lbs' })}
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
                min="0"
                step="1"
              />
            ) : (
              <Input
                label="Body Weight (kg)"
                type="number"
                value={input.weightKg}
                onChange={(value) => setInput({ ...input, weightKg: value === '' ? '' : parseFloat(value) })}
                min="0"
                step="0.5"
              />
            )}
            {input.weightUnit === 'lbs' && (
              <p className="-mt-2 text-xs text-slate-500">
                Weight in kg: {normalizedWeightKg.toFixed(1)} kg
              </p>
            )}
            <Input
              label="Duration (minutes)"
              type="number"
              value={input.duration}
              onChange={(value) => setInput({ ...input, duration: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="5"
            />
            <Select
              label="Intensity"
              value={input.intensity}
              onChange={(value) => setInput({ ...input, intensity: value })}
              options={[
                { value: 'easy', label: 'Easy (10-12 mph)' },
                { value: 'moderate', label: 'Moderate (12-14 mph)' },
                { value: 'vigorous', label: 'Vigorous (14-16 mph)' },
                { value: 'race', label: 'Race Pace (16+ mph)' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Calories Burned</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Calories</p>
                <p className="text-3xl font-bold text-blue-600">{result.caloriesBurned.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">for {Number(input.duration)} minutes</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Minutes to Burn:</p>
                <div className="space-y-1">
                  {calorieMarkers.map(calories => (
                    <div key={calories} className="flex justify-between">
                      <span className="text-sm text-gray-700">{calories} calories:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {result.minutesForBurning[calories] || '∞'} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Cycling Tips</h3>
          <p className="text-sm text-gray-600">
            Higher intensity burns more calories per minute but is harder to sustain. Find a sustainable pace.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Heavy cyclists burn more calories than lighter cyclists at the same intensity level.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Actual calorie burn varies based on terrain, bike type, fitness level, and metabolism.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Calorie Burning Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Cycling burns calories based on intensity, duration, and body weight. Heavier people and higher intensities burn more calories.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Easy cycling (zone 1-2): 6 cal/kg/hour</li>
          <li>Moderate cycling (zone 3): 10 cal/kg/hour</li>
          <li>Vigorous cycling (zone 4): 15 cal/kg/hour</li>
          <li>Race pace (zone 5): 20+ cal/kg/hour</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Cycling Calorie FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How many calories does cycling burn?</summary>
            <p className="mt-2">Depends on weight, intensity, and duration. A 75kg person burns roughly 600-1500 calories per hour depending on intensity.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is this accurate?</summary>
            <p className="mt-2">These are estimates based on average metabolism. Individual burn rates vary. Heart rate monitors give more accurate readings.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I count these calories burned in my diet?</summary>
            <p className="mt-2">It depends on your goals. Some people create a deficit by exercising. Use this as a guide, not a precise measurement.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tdee', title: 'TDEE Calculator', icon: 'local_fire_department' },
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'nutrition' },
        ]}
      />
    </div>
  );
}
