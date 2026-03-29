import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateTDEE } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface TDEEFormInput {
  age: number | '';
  sex: 'male' | 'female';
  heightUnit: 'metric' | 'imperial';
  heightCm: number | '';
  heightFt: number | '';
  heightIn: number | '';
  weightUnit: 'kg' | 'lbs';
  weightKg: number | '';
  weightLbs: number | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryactive';
}

export default function TDEEPage() {
  useEffect(() => {
    analytics.trackCalculatorView('tdee');
  }, []);
  const [input, setInput] = useStickyState<TDEEFormInput>('tdee-input', {
    age: 30,
    sex: 'male',
    heightUnit: 'metric',
    heightCm: 180,
    heightFt: 5,
    heightIn: 11,
    weightUnit: 'kg',
    weightKg: 80,
    weightLbs: 176,
    activityLevel: 'moderate',
  });

  const normalizedHeightCm = input.heightUnit === 'imperial'
    ? (((Number(input.heightFt) || 0) * 12) + (Number(input.heightIn) || 0)) * 2.54
    : Number(input.heightCm) || 0;

  const normalizedWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.weightLbs) || 0) * 0.45359237
    : Number(input.weightKg) || 0;

  const result = calculateTDEE({
    age: Number(input.age) || 0,
    sex: input.sex,
    heightCm: normalizedHeightCm,
    weightKg: normalizedWeightKg,
    activityLevel: input.activityLevel,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TDEE Calculator</h1>
        <p className="text-gray-600">Calculate your Total Daily Energy Expenditure and daily calorie needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Age (years)"
              type="number"
              value={input.age}
              onChange={(value) => setInput({ ...input, age: value === '' ? '' : parseFloat(value) })}
              min="10"
              max="100"
              step="1"
            />
            <Select
              label="Sex"
              value={input.sex}
              onChange={(value) => setInput({ ...input, sex: value as TDEEFormInput['sex'] })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            <Select
              label="Height Unit"
              value={input.heightUnit}
              onChange={(value) => setInput({ ...input, heightUnit: value as TDEEFormInput['heightUnit'] })}
              options={[
                { value: 'metric', label: 'Centimeters (cm)' },
                { value: 'imperial', label: 'Feet & Inches (ft/in)' },
              ]}
            />
            {input.heightUnit === 'imperial' ? (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Height (ft)"
                  type="number"
                  value={input.heightFt}
                  onChange={(value) => setInput({ ...input, heightFt: value === '' ? '' : parseFloat(value) })}
                  min="3"
                  max="8"
                  step="1"
                />
                <Input
                  label="Height (in)"
                  type="number"
                  value={input.heightIn}
                  onChange={(value) => setInput({ ...input, heightIn: value === '' ? '' : parseFloat(value) })}
                  min="0"
                  max="11"
                  step="1"
                />
              </div>
            ) : (
              <Input
                label="Height (cm)"
                type="number"
                value={input.heightCm}
                onChange={(value) => setInput({ ...input, heightCm: value === '' ? '' : parseFloat(value) })}
                min="100"
                max="250"
                step="1"
              />
            )}
            {input.heightUnit === 'imperial' && (
              <p className="-mt-2 text-xs text-slate-500">
                Height in cm: {normalizedHeightCm.toFixed(1)} cm
              </p>
            )}
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as TDEEFormInput['weightUnit'] })}
              options={[
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'lbs', label: 'Pounds (lbs)' },
              ]}
            />
            {input.weightUnit === 'lbs' ? (
              <Input
                label="Weight (lbs)"
                type="number"
                value={input.weightLbs}
                onChange={(value) => setInput({ ...input, weightLbs: value === '' ? '' : parseFloat(value) })}
                min="44"
                max="660"
                step="1"
              />
            ) : (
              <Input
                label="Weight (kg)"
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
              onChange={(value) => setInput({ ...input, activityLevel: value as TDEEFormInput['activityLevel'] })}
              options={[
                { value: 'sedentary', label: 'Sedentary (little exercise)' },
                { value: 'light', label: 'Light (exercise 1-3 days/week)' },
                { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
                { value: 'active', label: 'Active (exercise 6-7 days/week)' },
                { value: 'veryactive', label: 'Very Active (physical job or training)' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Basal Metabolic Rate (BMR)</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(result.bmr)} calories/day</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Daily Energy Expenditure</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(result.tdee)} calories/day</p>
              </div>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-sm text-gray-600">Cutting Calories (deficit)</p>
                <p className="text-lg font-semibold text-green-600">{Math.round(result.cutCalories)} calories/day</p>
              </div>
              <div className="bg-white p-4 rounded border border-orange-200">
                <p className="text-sm text-gray-600">Bulking Calories (surplus)</p>
                <p className="text-lg font-semibold text-orange-600">{Math.round(result.bulkCalories)} calories/day</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">TDEE Tips</h3>
          <p className="text-sm text-gray-600">
            Use your TDEE as a baseline. Eat less to lose weight, more to gain muscle
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            A 500 calorie daily deficit results in losing about 1 pound per week
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            TDEE varies by individual. Track results and adjust intake based on progress
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How TDEE Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns daily.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>First calculates BMR (Basal Metabolic Rate) using Mifflin-St Jeor formula</li>
          <li>BMR × Activity Factor = TDEE</li>
          <li>Cutting Calories = TDEE - 500 (for fat loss)</li>
          <li>Bulking Calories = TDEE + 300 (for muscle gain)</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">TDEE FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between BMR and TDEE?</summary>
            <p className="mt-2">BMR is calories burned at rest. TDEE includes your activity level and is always higher than BMR.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How accurate is this calculation?</summary>
            <p className="mt-2">It's a reliable estimate, but individual metabolism varies. Adjust based on real-world results over 2-4 weeks.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I eat the same calories every day?</summary>
            <p className="mt-2">Not necessarily. Weekly averages matter more than daily fluctuations. Flexibility helps with adherence.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/calories', title: 'Calorie Calculator', icon: 'local_dining' },
          { path: '/bmi', title: 'BMI Calculator', icon: 'fitness_center' },
          { path: '/ideal-weight', title: 'Ideal Weight Calculator', icon: 'monitor_weight' },
        ]}
      />
    </div>
  );
}
