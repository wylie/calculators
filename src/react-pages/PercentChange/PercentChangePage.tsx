import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculatePercentChange } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function PercentChangePage() {
  useEffect(() => {
    analytics.trackCalculatorView('percent-change');
  }, []);
  const [input, setInput] = useStickyState<{startValue: string | number; endValue: string | number}>('percentchange-input', {
    startValue: 100,
    endValue: 120,
  });

  const result = calculatePercentChange({
    startValue: Number(input.startValue) || 0,
    endValue: Number(input.endValue) || 0,
  });

  const textColor = result.isIncrease ? 'text-green-600' : 'text-red-600';
  const bgColor = result.isIncrease ? 'bg-green-50' : 'bg-red-50';
  const borderColor = result.isIncrease ? 'border-green-200' : 'border-red-200';
  const textBg = result.isIncrease ? 'text-green-900' : 'text-red-900';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Percent Change Calculator</h1>
        <p className="text-gray-600">Calculate the percentage change between two values, including gains and losses</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Values</h2>
          <div className="space-y-4">
            <Input
              label="Start Value"
              type="number"
              value={input.startValue}
              onChange={(value) => setInput({ ...input, startValue: value === '' ? '' : parseFloat(value) })}
              step="0.01"
            />
            <Input
              label="End Value"
              type="number"
              value={input.endValue}
              onChange={(value) => setInput({ ...input, endValue: value === '' ? '' : parseFloat(value) })}
              step="0.01"
            />
          </div>
        </Card>

        <div>
          <Card className={bgColor}>
            <h2 className={`text-xl font-semibold mb-4 ${textBg}`}>Result</h2>
            <div className="space-y-3">
              <div className={`bg-white p-4 rounded border ${borderColor}`}>
                <p className="text-sm text-gray-600">Percent Change</p>
                <p className={`text-3xl font-bold ${textColor}`}>
                  {result.isIncrease ? '+' : '-'}{result.percentChange.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">{result.isIncrease ? 'Increase' : 'Decrease'}</p>
              </div>
              <div className={`bg-white p-4 rounded border ${borderColor}`}>
                <p className="text-sm text-gray-600">Absolute Change</p>
                <p className={`text-xl font-semibold ${textColor}`}>
                  {result.isIncrease ? '+' : '-'}{result.change.toFixed(2)}
                </p>
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
            Formula: ((End Value - Start Value) / Start Value) × 100. Result can be positive or negative.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Shows both direction (up/down) and magnitude of change, unlike other percentage calculators.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Example</h3>
          <p className="text-sm text-gray-600">
            Stock $100 to $120 = +20%. Stock $100 to $80 = -20%. Works for any metric.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Understanding Percent Change</h2>
        <p className="text-sm text-gray-600 mb-3">
          Percent change shows the magnitude and direction of change from a starting value to an ending value.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Positive percentages = increase/gain</li>
          <li>Negative percentages = decrease/loss</li>
          <li>Works for any measurable metric</li>
          <li>More versatile than increase/decrease calculators</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Percent Change FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between increase and percent change?</summary>
            <p className="mt-2">Increase only shows positive changes. Percent change works for both increases and decreases, showing direction.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I use this for stock prices?</summary>
            <p className="mt-2">Yes! This is perfect for calculating stock price changes, cryptocurrency moves, and other financial metrics.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does order matter?</summary>
            <p className="mt-2">Yes! Start value first, end value second. Reversing them will flip the sign of the result.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/percentage-increase', title: 'Percentage Increase', icon: 'trending_up' },
          { path: '/percentage-decrease', title: 'Percentage Decrease', icon: 'trending_down' },
          { path: '/inflation', title: 'Inflation Calculator', icon: 'trending_down' },
        ]}
      />
    </div>
  );
}
