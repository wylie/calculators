import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculatePercentageIncrease } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function PercentageIncreasePage() {
  useEffect(() => {
    analytics.trackCalculatorView('percentage-increase');
  }, []);
  const [input, setInput] = useStickyState<{originalValue: string | number; newValue: string | number}>('percentageincrease-input', {
    originalValue: 100,
    newValue: 125,
  });

  const result = calculatePercentageIncrease({
    originalValue: Number(input.originalValue) || 0,
    newValue: Number(input.newValue) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Percentage Increase Calculator</h1>
        <p className="text-gray-600">Calculate the percentage increase between two values</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Values</h2>
          <div className="space-y-4">
            <Input
              label="Original Value"
              type="number"
              value={input.originalValue}
              onChange={(value) => setInput({ ...input, originalValue: value === '' ? '' : parseFloat(value) })}
              step="0.01"
            />
            <Input
              label="New Value"
              type="number"
              value={input.newValue}
              onChange={(value) => setInput({ ...input, newValue: value === '' ? '' : parseFloat(value) })}
              step="0.01"
            />
          </div>
        </Card>

        <div>
          <Card className="bg-green-50">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Result</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-sm text-gray-600">Percentage Increase</p>
                <p className="text-3xl font-bold text-green-600">{result.percentIncrease.toFixed(2)}%</p>
              </div>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-sm text-gray-600">Absolute Increase</p>
                <p className="text-xl font-semibold text-gray-900">{result.increase.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">How It Works</h3>
          <p className="text-sm text-gray-600">
            Formula: ((New Value - Original Value) / Original Value) × 100
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Percentage increase can't be negative. If the value decreased, use percentage decrease calculator.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Example</h3>
          <p className="text-sm text-gray-600">
            From $100 to $120 = 20% increase. From $100 to $125 = 25% increase.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Understanding Percentage Increase</h2>
        <p className="text-sm text-gray-600 mb-3">
          Percentage increase shows how much a value has grown relative to its original amount.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Shows proportional growth, not absolute difference</li>
          <li>Useful for comparing growth rates</li>
          <li>Always expressed as a positive percentage</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Percentage Increase FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I calculate percentage increase?</summary>
            <p className="mt-2">Subtract the original value from the new value, divide by the original value, then multiply by 100.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if my value decreased?</summary>
            <p className="mt-2">Use the Percentage Decrease calculator instead for values that went down.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can percentage increase be over 100%?</summary>
            <p className="mt-2">Yes! If you go from $1 to $3, that's a 200% increase. From $1 to $100 is 9900% increase.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/percentage-decrease', title: 'Percentage Decrease', icon: 'trending_down' },
          { path: '/percent-change', title: 'Percent Change', icon: 'show_chart' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
