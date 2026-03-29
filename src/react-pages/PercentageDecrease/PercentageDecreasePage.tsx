import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculatePercentageDecrease } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function PercentageDecreasePage() {
  useEffect(() => {
    analytics.trackCalculatorView('percentage-decrease');
  }, []);
  const [input, setInput] = useStickyState<{originalValue: string | number; newValue: string | number}>('percentagedecrease-input', {
    originalValue: 100,
    newValue: 75,
  });

  const result = calculatePercentageDecrease({
    originalValue: Number(input.originalValue) || 0,
    newValue: Number(input.newValue) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Percentage Decrease Calculator</h1>
        <p className="text-gray-600">Calculate the percentage decrease between two values, including discounts</p>
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
          <Card className="bg-red-50">
            <h2 className="text-xl font-semibold mb-4 text-red-900">Result</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-red-200">
                <p className="text-sm text-gray-600">Percentage Decrease</p>
                <p className="text-3xl font-bold text-red-600">{result.percentDecrease.toFixed(2)}%</p>
              </div>
              <div className="bg-white p-4 rounded border border-red-200">
                <p className="text-sm text-gray-600">Absolute Decrease</p>
                <p className="text-xl font-semibold text-gray-900">{result.decrease.toFixed(2)}</p>
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
            Formula: ((Original Value - New Value) / Original Value) × 100
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Perfect for calculating discounts, price drops, and weight loss percentages.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Example</h3>
          <p className="text-sm text-gray-600">
            From $100 to $80 = 20% decrease. From $100 to $75 = 25% decrease.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Understanding Percentage Decrease</h2>
        <p className="text-sm text-gray-600 mb-3">
          Percentage decrease shows how much a value has fallen relative to its original amount.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Shows proportional decline, not absolute difference</li>
          <li>Useful for sales discounts and reductions</li>
          <li>Always expressed as a positive percentage</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Percentage Decrease FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I calculate a discount?</summary>
            <p className="mt-2">A discount percentage is a percentage decrease. Use this calculator to find what percent off an item is.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is this used for weight loss?</summary>
            <p className="mt-2">Yes! If you weighed 200 lbs and now weigh 180 lbs, that's a 10% decrease in weight.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if the new value is higher?</summary>
            <p className="mt-2">If the new value is higher than original, use the Percentage Increase calculator instead.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/percentage-increase', title: 'Percentage Increase', icon: 'trending_up' },
          { path: '/percent-change', title: 'Percent Change', icon: 'show_chart' },
          { path: '/tax', title: 'Tax Calculator', icon: 'receipt_long' },
        ]}
      />
    </div>
  );
}
