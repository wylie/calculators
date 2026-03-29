import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateInflation } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function InflationPage() {
  useEffect(() => {
    analytics.trackCalculatorView('inflation');
  }, []);
  const [input, setInput] = useStickyState<{amount: string | number; startYear: string | number; endYear: string | number; inflationRate: string | number}>(
    'inflation-input',
    {
      amount: 100,
      startYear: 2020,
      endYear: 2025,
      inflationRate: 3,
    }
  );

  const result = calculateInflation({
    amount: Number(input.amount) || 0,
    startYear: Number(input.startYear) || 2020,
    endYear: Number(input.endYear) || 2025,
    inflationRate: Number(input.inflationRate) || 3,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inflation Calculator</h1>
        <p className="text-gray-600">Calculate how inflation affects purchasing power over time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Amount ($)"
              type="number"
              value={input.amount}
              onChange={(value) => setInput({ ...input, amount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="1"
            />
            <Input
              label="Start Year"
              type="number"
              value={input.startYear}
              onChange={(value) => setInput({ ...input, startYear: value === '' ? '' : parseInt(value) })}
              min="1900"
              max="2100"
              step="1"
            />
            <Input
              label="End Year"
              type="number"
              value={input.endYear}
              onChange={(value) => setInput({ ...input, endYear: value === '' ? '' : parseInt(value) })}
              min="1900"
              max="2100"
              step="1"
            />
            <Input
              label="Annual Inflation Rate (%)"
              type="number"
              value={input.inflationRate}
              onChange={(value) => setInput({ ...input, inflationRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-orange-50">
            <h2 className="text-xl font-semibold mb-4 text-orange-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-orange-200">
                <p className="text-sm text-gray-600">Future Value</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(result.futureValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Inflation</p>
                <p className="text-xl font-semibold text-gray-900">{result.totalInflation.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Years</p>
                <p className="text-lg font-semibold text-gray-900">{result.years}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Purchasing Power Change</p>
                <p className="text-lg font-semibold text-gray-900">{result.purchasingPowerChange.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Inflation Tips</h3>
          <p className="text-sm text-gray-600">
            US inflation has averaged around 3% annually over the past century
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            At 3% inflation, prices double approximately every 24 years
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Actual inflation varies by category—housing and healthcare often exceed averages
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this inflation calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Calculate how inflation erodes purchasing power over time using compound annual inflation rates.
          Future value shows what you'd need to buy the same goods/services in the future.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Future value = amount × (1 + rate)^years</li>
          <li>Purchasing power change shows percentage decrease in buying power</li>
          <li>Uses compound inflation (inflation on inflation)</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Inflation calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What inflation rate should I use?</summary>
            <p className="mt-2">Historical US average is ~3%. Use 2-3% for conservative estimates, or check current CPI rates for recent trends.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does inflation affect savings?</summary>
            <p className="mt-2">If your savings earn less than inflation, you lose purchasing power even as the balance grows.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is inflation the same for everything?</summary>
            <p className="mt-2">No. Housing, healthcare, and education often inflate faster than general CPI averages.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/compound-interest', title: 'Compound Interest', icon: 'trending_up' },
          { path: '/retirement', title: 'Retirement Calculator', icon: 'savings' },
          { path: '/savings', title: 'Savings Calculator', icon: 'account_balance' },
        ]}
      />
    </div>
  );
}
