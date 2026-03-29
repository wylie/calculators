import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { convertTemperature } from '../../utils/calculators';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function WeatherPage() {
  useEffect(() => {
    analytics.trackCalculatorView('weather');
  }, []);
  const [value, setValue] = useStickyState('weather-value', '20');
  const [fromUnit, setFromUnit] = useStickyState<'C' | 'F'>('weather-from-unit', 'C');

  const result = convertTemperature({
    value: parseFloat(value) || 0,
    fromUnit,
  });

  const handleReset = () => {
    setValue('20');
    setFromUnit('C');
  };

  const referencePoints = [
    { celsius: 0, fahrenheit: 32, description: 'Water freezes' },
    { celsius: 20, fahrenheit: 68, description: 'Room temperature' },
    { celsius: 30, fahrenheit: 86, description: 'Warm day' },
    { celsius: 37.8, fahrenheit: 100, description: 'Body temperature' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Temperature Converter</h1>
      <p className="text-slate-600 mb-6">
        Quickly convert temperatures between Celsius and Fahrenheit.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Temperature"
                  value={value}
                  onChange={setValue}
                  type="number"
                  step="0.1"
                />
              </div>

              <div>
                <Select
                  label="From Unit"
                  value={fromUnit}
                  onChange={(val) => setFromUnit(val as 'C' | 'F')}
                  options={[
                    { value: 'C', label: 'Celsius (C)' },
                    { value: 'F', label: 'Fahrenheit (F)' },
                  ]}
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Reference Points</h3>

            <div className="space-y-3">
              {referencePoints.map((point, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{point.description}</p>
                    <p className="text-xs text-slate-600">
                      {point.celsius}C = {point.fahrenheit}F
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Result</h3>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Converted Temperature</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {formatNumber(result.converted, 1)}
              </p>
              <p className="text-2xl font-semibold text-slate-900">°{result.toUnit}</p>

              <div className="mt-6 p-3 bg-blue-50 rounded">
                <p className="text-xs text-slate-600">
                  {value}°{fromUnit} = {formatNumber(result.converted, 1)}°{result.toUnit}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this temperature converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This converter switches between Celsius and Fahrenheit using standard formulas and shows quick reference
          temperatures for common real-world points.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Fahrenheit = Celsius × 9/5 + 32</li>
          <li>Celsius = (Fahrenheit − 32) × 5/9</li>
          <li>Decimal input is supported for precise conversion</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Temperature converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I convert Celsius to Fahrenheit?</summary>
            <p className="mt-2">Multiply Celsius by 9/5 and add 32. The tool performs this automatically.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I convert the other way?</summary>
            <p className="mt-2">Yes. Select Fahrenheit as your input unit and the result is shown in Celsius.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
          { path: '/length', title: 'Length Converter', icon: 'straighten' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
