import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateTip } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function TipPage() {
  useEffect(() => {
    analytics.trackCalculatorView('tip');
  }, []);
  const [input, setInput] = useStickyState<{billAmount: string | number; tipPercentage: string | number; splitCount: string | number}>(
    'tip-input',
    {
      billAmount: 75,
      tipPercentage: 18,
      splitCount: 1,
    }
  );

  const result = calculateTip({
    billAmount: Number(input.billAmount) || 0,
    tipPercentage: Number(input.tipPercentage) || 0,
    splitCount: Number(input.splitCount) || 1,
  });

  const commonTips = [15, 18, 20, 22, 25];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tip Calculator</h1>
        <p className="text-gray-600">Calculate tip amount and split the bill</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Bill Amount ($)"
              type="number"
              value={input.billAmount}
              onChange={(value) => setInput({ ...input, billAmount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.01"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage (%)</label>
              <Input
                label=""
                type="number"
                value={input.tipPercentage}
                onChange={(value) => setInput({ ...input, tipPercentage: value === '' ? '' : parseFloat(value) })}
                min="0"
                step="0.1"
              />
              <div className="flex gap-2 mt-2">
                {commonTips.map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setInput({ ...input, tipPercentage: tip })}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      Number(input.tipPercentage) === tip
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tip}%
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Split Between People"
              type="number"
              value={input.splitCount}
              onChange={(value) => setInput({ ...input, splitCount: value === '' ? '' : parseInt(value) })}
              min="1"
              step="1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-green-50">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tip Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.tipAmount)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-sm text-gray-600">Total Bill</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalAmount)}</p>
              </div>
              {Number(input.splitCount) > 1 && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Per Person (Total)</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.perPersonAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Per Person (Tip Only)</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.perPersonTip)}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Tipping Tips</h3>
          <p className="text-sm text-gray-600">
            Standard tips range from 15-20% for good service, 20%+ for exceptional service
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Tipping customs vary by country—in the US, 18-20% is typical for restaurants
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Some restaurants automatically add gratuity for large parties of 6 or more
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this tip calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Enter your bill amount and tip percentage to calculate the tip. Split the total between
          multiple people if needed.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Tip = bill × percentage</li>
          <li>Total = bill + tip</li>
          <li>Per person = total ÷ number of people</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Tip calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's a standard tip percentage?</summary>
            <p className="mt-2">In the US, 15-20% is typical for table service. 18% is often a safe middle ground.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I tip on pre-tax or post-tax amount?</summary>
            <p className="mt-2">Either is acceptable, though many people tip on the pre-tax amount for simplicity.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">When should I tip more than 20%?</summary>
            <p className="mt-2">Consider 20%+ for exceptional service, difficult orders, or during busy times.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tax', title: 'Tax Calculator', icon: 'receipt' },
          { path: '/percentage', title: 'Percentage Converter', icon: 'percent' },
          { path: '/budget', title: 'Budget Calculator', icon: 'wallet' },
        ]}
      />
    </div>
  );
}
