import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateProteinIntake } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface ProteinIntakeFormInput {
  weightUnit: 'kg' | 'lbs';
  weightKg: number | '';
  weightLbs: number | '';
  goal: 'maintain' | 'muscle' | 'loss';
}

export default function ProteinIntakePage() {
  useEffect(() => {
    analytics.trackCalculatorView('protein-intake');
  }, []);
  const [input, setInput] = useStickyState<ProteinIntakeFormInput>('proteinIntake-input', {
    weightUnit: 'kg',
    weightKg: 75,
    weightLbs: 165,
    goal: 'maintain',
  });

  const normalizedWeightKg = input.weightUnit === 'lbs'
    ? (Number(input.weightLbs) || 0) * 0.45359237
    : Number(input.weightKg) || 0;

  const result = calculateProteinIntake({
    weightKg: normalizedWeightKg,
    goal: input.goal,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Protein Intake Calculator</h1>
        <p className="text-gray-600">Calculate your daily protein requirements based on body weight and fitness goals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Select
              label="Weight Unit"
              value={input.weightUnit}
              onChange={(value) => setInput({ ...input, weightUnit: value as ProteinIntakeFormInput['weightUnit'] })}
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
              label="Fitness Goal"
              value={input.goal}
              onChange={(value) => setInput({ ...input, goal: value as ProteinIntakeFormInput['goal'] })}
              options={[
                { value: 'maintain', label: 'Maintain Weight' },
                { value: 'muscle', label: 'Build Muscle' },
                { value: 'loss', label: 'Fat Loss' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Protein Needs</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Grams per Kilogram</p>
                <p className="text-2xl font-bold text-blue-600">{result.gramsPerKg} g/kg</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Daily Protein</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(result.totalGrams)} grams</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Per Meal (4 meals)</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(result.gramsPerMeal)} grams</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Calories from Protein</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(result.caloriesFromProtein)} calories</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Protein Tips</h3>
          <p className="text-sm text-gray-600">
            Spread protein throughout the day. Mix animal and plant sources for complete amino acids
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Protein has 4 calories per gram. Most athletes need 1.2-2g per kg body weight
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            These are recommendations. Individual needs vary based on training intensity and diet type
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Protein Intake Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator determines daily protein needs based on body weight and fitness goals.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Maintain: 1.2 grams per kg body weight</li>
          <li>Build Muscle: 1.6-2.0 grams per kg body weight</li>
          <li>Fat Loss: 1.6-2.2 grams per kg (preserves muscle during deficit)</li>
          <li>Spread intake across 4-6 meals for optimal absorption</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Protein Intake FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Where can I get good protein sources?</summary>
            <p className="mt-2">Chicken, fish, eggs, Greek yogurt, beans, lentils, nuts, and tofu are excellent sources.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is too much protein bad for you?</summary>
            <p className="mt-2">Most studies show that high protein intake is safe for healthy people. Adequate water intake is important.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">When should I eat protein?</summary>
            <p className="mt-2">Post-workout protein is beneficial, but overall daily intake matters most. Consistency is key.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tdee', title: 'TDEE Calculator', icon: 'energy_savings_leaf' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'local_dining' },
          { path: '/water-intake', title: 'Water Intake', icon: 'water_drop' },
        ]}
      />
    </div>
  );
}
