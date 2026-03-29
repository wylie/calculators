import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateIdealWeight } from '../../utils/calculators';
import analytics from '../../utils/analytics';

interface IdealWeightFormInput {
  heightUnit: 'cm' | 'imperial';
  heightCm: number | '';
  heightFt: number | '';
  heightIn: number | '';
  sex: 'male' | 'female';
  formula: 'devine' | 'robinson' | 'miller' | 'bmi';
}

export default function IdealWeightPage() {
  useEffect(() => {
    analytics.trackCalculatorView('ideal-weight');
  }, []);
  const [input, setInput] = useStickyState<IdealWeightFormInput>('idealWeight-input', {
    heightUnit: 'cm',
    heightCm: 175,
    heightFt: 5,
    heightIn: 9,
    sex: 'male',
    formula: 'devine',
  });

  const normalizedHeightCm = input.heightUnit === 'imperial'
    ? (((Number(input.heightFt) || 0) * 12) + (Number(input.heightIn) || 0)) * 2.54
    : Number(input.heightCm) || 0;

  const result = calculateIdealWeight({
    heightCm: normalizedHeightCm,
    sex: input.sex,
    formula: input.formula,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ideal Weight Calculator</h1>
        <p className="text-gray-600">Calculate your ideal weight based on height and formula selection</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Select
              label="Height Unit"
              value={input.heightUnit}
              onChange={(value) => setInput({ ...input, heightUnit: value as IdealWeightFormInput['heightUnit'] })}
              options={[
                { value: 'cm', label: 'Centimeters (cm)' },
                { value: 'imperial', label: 'Feet & Inches (ft/in)' },
              ]}
            />
            {input.heightUnit === 'imperial' ? (
              <>
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
                <p className="text-xs text-slate-500 -mt-2">
                  Height in cm: {normalizedHeightCm.toFixed(1)} cm
                </p>
              </>
            ) : (
              <Input
                label="Height (cm)"
                type="number"
                value={input.heightCm}
                onChange={(value) => setInput({ ...input, heightCm: value === '' ? '' : parseFloat(value) })}
                min="80"
                max="250"
                step="1"
              />
            )}
            <Select
              label="Sex"
              value={input.sex}
              onChange={(value) => setInput({ ...input, sex: value as IdealWeightFormInput['sex'] })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            <Select
              label="Calculation Formula"
              value={input.formula}
              onChange={(value) => setInput({ ...input, formula: value as IdealWeightFormInput['formula'] })}
              options={[
                { value: 'devine', label: 'Devine Formula' },
                { value: 'robinson', label: 'Robinson Formula' },
                { value: 'miller', label: 'Miller Formula' },
                { value: 'bmi', label: 'BMI Method (22.5)' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Ideal Weight</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Ideal Weight</p>
                <p className="text-2xl font-bold text-blue-600">{result.idealWeightLbs.toLocaleString('en-US', { maximumFractionDigits: 1 })} lbs</p>
                <p className="text-sm text-gray-600">{result.idealWeightKg.toLocaleString('en-US', { maximumFractionDigits: 1 })} kg</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Healthy BMI Range</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.bmiRangeLow.toLocaleString('en-US', { maximumFractionDigits: 1 })} - {result.bmiRangeHigh.toLocaleString('en-US', { maximumFractionDigits: 1 })} lbs
                </p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Using Formula</p>
                <p className="text-lg font-semibold text-gray-900">{input.formula.charAt(0).toUpperCase() + input.formula.slice(1)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Weight Tips</h3>
          <p className="text-sm text-gray-600">
            Different formulas may give slightly different results. Aim for the healthy BMI range
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Ideal weight varies by body composition, muscle mass, and bone density
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            These calculations are estimates. Consult a healthcare provider for personalized advice
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Ideal Weight Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator uses multiple formulas to estimate ideal body weight based on height and sex.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Devine: 50 kg + 2.3 kg per inch over 5'</li>
          <li>Robinson: 52 kg + 1.9 kg per inch over 5'</li>
          <li>Miller: 56.2 kg + 1.41 kg per inch over 5'</li>
          <li>BMI Method: Uses BMI of 22.5 as ideal</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Ideal Weight FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Which formula is best?</summary>
            <p className="mt-2">No single formula is best for everyone. The Devine formula is most commonly used in hospitals.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does muscle weight make me heavier?</summary>
            <p className="mt-2">Yes. Muscle is denser than fat. Athletes may weigh more than "ideal" but still be very healthy.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What about body frame size?</summary>
            <p className="mt-2">These formulas don't account for frame size. Larger frames may be heavier at a healthy weight.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/bmi', title: 'BMI Calculator', icon: 'fitness_center' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'local_dining' },
          { path: '/tdee', title: 'TDEE Calculator', icon: 'energy_savings_leaf' },
        ]}
      />
    </div>
  );
}
