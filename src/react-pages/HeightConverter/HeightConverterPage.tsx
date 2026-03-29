import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { convertHeight } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function HeightConverterPage() {
  useEffect(() => {
    analytics.trackCalculatorView('height-converter');
  }, []);
  const [value, setValue] = useStickyState('heightConverter-value', '180');
  const [fromUnit, setFromUnit] = useStickyState<'ft' | 'in' | 'cm'>('heightConverter-unit', 'cm');

  const result = convertHeight({
    value: parseFloat(value) || 0,
    fromUnit,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Height Converter</h1>
        <p className="text-gray-600">Convert heights between feet, inches, and centimeters</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Height"
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
                onChange={(val) => setFromUnit(val as 'ft' | 'in' | 'cm')}
                options={[
                  { value: 'cm', label: 'Centimeters (cm)' },
                  { value: 'ft', label: 'Feet (ft)' },
                  { value: 'in', label: 'Inches (in)' },
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
                <p className="text-sm text-gray-600">Feet & Inches</p>
                <p className="text-2xl font-bold text-blue-600">{Math.floor(result.feet)}&apos; {(result.inches % 12).toFixed(1)}&quot;</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Inches</p>
                <p className="text-lg font-semibold text-gray-900">{result.inches.toFixed(1)}&quot;</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Centimeters</p>
                <p className="text-lg font-semibold text-gray-900">{result.centimeters.toFixed(1)} cm</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Conversion Tips</h3>
          <p className="text-sm text-gray-600">
            1 inch = 2.54 cm. 1 foot = 12 inches = 30.48 cm
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average height varies by country. US average male is 5&apos;9&quot; (175 cm)
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Height can be measured in different ways. Stand straight against a wall for accuracy
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Height Converter Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This converter quickly switches between metric and imperial height measurements.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>1 inch (in) = 2.54 centimeters (cm)</li>
          <li>1 foot (ft) = 12 inches = 30.48 centimeters</li>
          <li>Decimal input is supported for precise conversion</li>
          <li>Results show feet/inches, total inches, and centimeters</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Height Converter FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I measure height accurately?</summary>
            <p className="mt-2">Remove shoes and stand against a wall with heels touching. Use a level to measure to the top of your head.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does height change during the day?</summary>
            <p className="mt-2">Yes. Height decreases slightly throughout the day due to spinal compression. Measure in the morning.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why do I need two measurements?</summary>
            <p className="mt-2">Different countries use different systems. Metric is standard in most of the world; imperial in the US.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/distance-converter', title: 'Distance Converter', icon: 'straighten' },
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
          { path: '/bmi', title: 'BMI Calculator', icon: 'favorite' },
        ]}
      />
    </div>
  );
}
