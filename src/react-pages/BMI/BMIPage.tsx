import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateBMI } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function BMIPage() {
  useEffect(() => {
    analytics.trackCalculatorView('bmi');
  }, []);
  const [input, setInput] = useStickyState<{weight: string | number; height: string | number; unit: 'metric' | 'imperial'}>(
    'bmi-input',
    {
      weight: 70,
      height: 170,
      unit: 'metric',
    }
  );

  const result = calculateBMI({
    weight: Number(input.weight) || 0,
    height: Number(input.height) || 0,
    unit: input.unit,
  });

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI Calculator</h1>
        <p className="text-gray-600 dark:text-slate-300">Calculate your Body Mass Index and health category</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Select
              label="Unit System"
              value={input.unit}
              onChange={(value) => setInput({ ...input, unit: value as 'metric' | 'imperial' })}
              options={[
                { value: 'metric', label: 'Metric (kg, cm)' },
                { value: 'imperial', label: 'Imperial (lbs, in)' },
              ]}
            />
            <Input
              label={input.unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
              type="number"
              value={input.weight}
              onChange={(value) => setInput({ ...input, weight: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label={input.unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
              type="number"
              value={input.height}
              onChange={(value) => setInput({ ...input, height: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600 dark:text-slate-300">Your BMI</p>
                <p className={`text-3xl font-bold ${getBMIColor(result.bmi)}`}>{result.bmi}</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-slate-200 mt-1">{result.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-300">Healthy Weight Range</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {result.healthyWeightMin.toFixed(1)} - {result.healthyWeightMax.toFixed(1)} {input.unit === 'metric' ? 'kg' : 'lbs'}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">BMI Tips</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            BMI is a screening tool, not a diagnostic measure of body fatness or health
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            A healthy BMI typically ranges from 18.5 to 24.9 for most adults
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Athletes with high muscle mass may have elevated BMI but low body fat
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this BMI calculator works</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">
          BMI is calculated by dividing weight by height squared. The result places you in a health category
          based on WHO standards for adults.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-slate-300 space-y-1">
          <li>Underweight: BMI below 18.5</li>
          <li>Normal weight: BMI 18.5-24.9</li>
          <li>Overweight: BMI 25-29.9</li>
          <li>Obese: BMI 30 or higher</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">BMI calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-slate-200">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is BMI accurate for everyone?</summary>
            <p className="mt-2">BMI doesn't distinguish muscle from fat, so athletes or very muscular people may have high BMI but be healthy.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's a healthy BMI range?</summary>
            <p className="mt-2">For most adults, a BMI between 18.5 and 24.9 is considered healthy, though individual needs may vary.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I use BMI alone to assess health?</summary>
            <p className="mt-2">No. BMI is one metric. Consider body composition, activity level, and overall health markers with your doctor.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/calories', title: 'Calorie Calculator', icon: 'nutrition' },
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
          { path: '/age', title: 'Age Calculator', icon: 'cake' },
        ]}
      />
    </div>
  );
}
