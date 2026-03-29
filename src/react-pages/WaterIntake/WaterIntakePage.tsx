import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateWaterIntake } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface WaterIntakeFormInput {
  weightUnit: 'kg' | 'lbs';
  weightKg: number | '';
  weightLbs: number | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryactive';
}

export default function WaterIntakePage() {
  useEffect(() => {
    analytics.trackCalculatorView('water-intake');
  }, []);
  const [input, setInput] = useStickyState<WaterIntakeFormInput>('waterIntake-input', {
    weightUnit: 'kg',
    weightKg: 75,
    weightLbs: 165,
    activityLevel: 'moderate',
  });

  const normalizedWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.weightLbs) || 0) * 0.45359237
    : Number(input.weightKg) || 0;

  const result = calculateWaterIntake({
    weightKg: normalizedWeightKg,
    activityLevel: input.activityLevel,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Water Intake Calculator</h1>
        <p className="text-gray-600">Calculate your recommended daily water intake based on weight and activity</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as WaterIntakeFormInput['weightUnit'] })}
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
                max="660"
                step="1"
              />
            ) : (
              <Input
                label="Body Weight (kg)"
                type="number"
                value={input.weightKg}
                onChange={(value) => setInput({ ...input, weightKg: value === '' ? '' : parseFloat(value) })}
                min="20"
                max="300"
                step="0.5"
              />
            )}
            {input.weightUnit === 'lbs' && (
              <p className="-mt-2 text-xs text-slate-500">
                Weight in kg: {normalizedWeightKg.toFixed(1)} kg
              </p>
            )}
            <Select
              label="Activity Level"
              value={input.activityLevel}
              onChange={(value) => setInput({ ...input, activityLevel: value as WaterIntakeFormInput['activityLevel'] })}
              options={[
                { value: 'sedentary', label: 'Sedentary (little exercise)' },
                { value: 'light', label: 'Light (exercise 1-3 days/week)' },
                { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
                { value: 'active', label: 'Active (exercise 6-7 days/week)' },
                { value: 'veryactive', label: 'Very Active (daily intense exercise)' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Recommendation</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Daily Water Intake</p>
                <p className="text-2xl font-bold text-blue-600">{result.recommendedLiters.toLocaleString('en-US', { maximumFractionDigits: 1 })} L</p>
                <p className="text-sm text-gray-600">{result.recommendedOunces.toLocaleString('en-US', { maximumFractionDigits: 0 })} oz</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Per Day</p>
                <p className="text-lg font-semibold text-gray-900">{result.cupsPerDay.toLocaleString('en-US', { maximumFractionDigits: 1 })} cups</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">As Bottles (16.9 oz)</p>
                <p className="text-lg font-semibold text-gray-900">{result.bottlesPerDay.toLocaleString('en-US', { maximumFractionDigits: 1 })} bottles</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Hydration Tips</h3>
          <p className="text-sm text-gray-600">
            Drink water throughout the day, not all at once. Thirst is a good indicator
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            About 60% of your body weight is water. Dehydration affects energy and cognition
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Water needs vary by climate, diet, and health. Adjust intake based on thirst and urine color
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Water Intake Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator estimates daily water needs based on body weight and activity level.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Base calculation: 30 ml per kg of body weight</li>
          <li>Activity level increases water needs by 10-20%</li>
          <li>Hot climates and intense exercise require more water</li>
          <li>Individual needs vary; use this as a starting point</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Water Intake FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does water from food count?</summary>
            <p className="mt-2">Yes. About 20% of daily water intake comes from foods like fruits and vegetables.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can you drink too much water?</summary>
            <p className="mt-2">Yes, though it's rare. Water intoxication can occur from drinking excessive amounts without electrolytes.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is all water the same?</summary>
            <p className="mt-2">Plain water is best. Coffee and tea count, but caffeine is a mild diuretic.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tdee', title: 'TDEE Calculator', icon: 'energy_savings_leaf' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'local_dining' },
          { path: '/protein-intake', title: 'Protein Intake', icon: 'fastfood' },
        ]}
      />
    </div>
  );
}
