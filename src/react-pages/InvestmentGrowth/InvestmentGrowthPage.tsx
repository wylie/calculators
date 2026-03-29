import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState'
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input'
import RelatedTools from '../../components/RelatedTools'
import { calculateInvestmentGrowth } from '../../utils/calculators'
import { formatCurrency, formatPercentage } from '../../utils/formatting'
import analytics from '../../utils/analytics';

export default function InvestmentGrowthPage() {
  useEffect(() => {
    analytics.trackCalculatorView('investment-growth');
  }, []);
  const [input, setInput] = useStickyState<{initialAmount: string | number; monthlyContribution: string | number; annualReturn: string | number; years: string | number}>(
    'investment-growth-input',
    {
    initialAmount: 10000,
    monthlyContribution: 500,
    annualReturn: 8,
    years: 20,
    }
  )

  const result = calculateInvestmentGrowth({
    initialAmount: Number(input.initialAmount) || 0,
    monthlyContribution: Number(input.monthlyContribution) || 0,
    annualReturn: Number(input.annualReturn) || 0,
    years: Number(input.years) || 1,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Growth Calculator</h1>
        <p className="text-gray-600">Project your investment growth with regular contributions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Initial Investment ($)"
              type="number"
              value={input.initialAmount}
              onChange={(value) => setInput({ ...input, initialAmount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="1000"
            />
            <Input
              label="Monthly Contribution ($)"
              type="number"
              value={input.monthlyContribution}
              onChange={(value) => setInput({ ...input, monthlyContribution: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="50"
            />
            <Input
              label="Expected Annual Return (%)"
              type="number"
              value={input.annualReturn}
              onChange={(value) => setInput({ ...input, annualReturn: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.5"
            />
            <Input
              label="Time Period (Years)"
              type="number"
              value={input.years}
              onChange={(value) => setInput({ ...input, years: value === '' ? '' : parseInt(value) })}
              min="1"
              step="1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-indigo-50">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency((Number(input.initialAmount) || 0) + (Number(input.monthlyContribution) || 0) * 12 * (Number(input.years) || 0))}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-200">
                <p className="text-sm text-gray-600">Final Amount</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(result.finalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Investment Gain</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.gain)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return on Investment</p>
                <p className="text-lg font-semibold text-indigo-600">{formatPercentage(result.roi)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Investment Tips</h3>
          <p className="text-sm text-gray-600">
            Diversify across different asset classes to help manage risk over time
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Historical market averages show 8-10% annual returns over long periods
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Returns vary by year—past performance doesn't guarantee future results
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How It Works</h2>
        <p className="text-gray-600 text-sm">
          This calculator shows the power of compound interest combined with regular monthly contributions. Your money grows not just from returns on your initial investment, but also from returns on your contributions and accumulated gains.
        </p>
        <p className="text-xs text-gray-500 mt-3">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Investment growth FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What is ROI in this calculator?</summary>
            <p className="mt-2">ROI is the percentage gain relative to total invested amount over the selected period.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this account for taxes or fees?</summary>
            <p className="mt-2">No. The estimate is pre-tax and does not include fund expenses or brokerage fees.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can future returns be lower than expected?</summary>
            <p className="mt-2">Yes. Annual returns vary over time, so use conservative assumptions for planning scenarios.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/retirement', title: 'Retirement Calculator', icon: 'celebration' },
          { path: '/compound-interest', title: 'Compound Interest', icon: 'calculate' },
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'account_balance' },
        ]}
      />
    </div>
  )
}
