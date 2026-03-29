import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState'
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input'
import RelatedTools from '../../components/RelatedTools'
import { calculateRetirement } from '../../utils/calculators'
import { formatCurrency } from '../../utils/formatting'
import analytics from '../../utils/analytics';

export default function RetirementPage() {
  useEffect(() => {
    analytics.trackCalculatorView('retirement');
  }, []);
  const [input, setInput] = useStickyState<{currentAge: string | number; retirementAge: string | number; currentSavings: string | number; annualContribution: string | number; annualExpense: string | number; annualReturn: string | number; inflationRate: string | number}>(
    'retirement-input',
    {
    currentAge: 35,
    retirementAge: 65,
    currentSavings: 100000,
    annualContribution: 10000,
    annualExpense: 50000,
    annualReturn: 7,
    inflationRate: 3,
    }
  )

  const result = calculateRetirement({
    currentAge: Number(input.currentAge) || 30,
    retirementAge: Number(input.retirementAge) || 65,
    currentSavings: Number(input.currentSavings) || 0,
    annualContribution: Number(input.annualContribution) || 0,
    annualExpense: Number(input.annualExpense) || 0,
    annualReturn: Number(input.annualReturn) || 7,
    inflationRate: Number(input.inflationRate) || 3,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Calculator</h1>
        <p className="text-gray-600">Plan your retirement and see if you're on track</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          <div className="space-y-4">
            <Input
              label="Current Age"
              type="number"
              value={input.currentAge}
              onChange={(value) => setInput({ ...input, currentAge: value === '' ? '' : parseInt(value) })}
              min="18"
              max="100"
              step="1"
            />
            <Input
              label="Retirement Age"
              type="number"
              value={input.retirementAge}
              onChange={(value) => setInput({ ...input, retirementAge: value === '' ? '' : parseInt(value) })}
              min="18"
              max="100"
              step="1"
            />
            <Input
              label="Current Savings ($)"
              type="number"
              value={input.currentSavings}
              onChange={(value) => setInput({ ...input, currentSavings: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10000"
            />
            <Input
              label="Annual Contribution ($)"
              type="number"
              value={input.annualContribution}
              onChange={(value) => setInput({ ...input, annualContribution: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="1000"
            />
            <Input
              label="Annual Expenses ($)"
              type="number"
              value={input.annualExpense}
              onChange={(value) => setInput({ ...input, annualExpense: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="1000"
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
              label="Expected Inflation Rate (%)"
              type="number"
              value={input.inflationRate}
              onChange={(value) => setInput({ ...input, inflationRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.5"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className={input.retirementAge > input.currentAge ? 'bg-green-50' : 'bg-red-50'}>
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Years to Retirement</p>
                <p className="text-2xl font-bold text-gray-900">{result.yearsToRetirement}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm text-gray-600">Projected Fund at Retirement</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.projectedRetirementFund)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Income (4% Rule)</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.annualIncomeAtRetirement)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Needed for Expenses</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.neededAtRetirement)}</p>
              </div>
              <div className={`p-3 rounded ${result.onTrack ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className="font-semibold text-gray-900">
                  {result.onTrack ? '✓ On Track!' : '⚠ Not Quite There Yet'}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Retirement Tips</h3>
          <p className="text-sm text-gray-600">
            Start early—compound growth rewards time more than any other factor
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Historical stock market averages around 10% annually over long periods
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator uses the 4% withdrawal rule for sustainable retirement spending
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">About the 4% Rule</h2>
        <p className="text-gray-600 text-sm">
          The 4% rule suggests you can safely withdraw 4% of your retirement savings annually. This estimate uses this rule to determine if your projected fund will support your lifestyle.
        </p>
        <p className="text-xs text-gray-500 mt-3">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this retirement calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          The calculator projects savings growth from current assets and yearly contributions, then adjusts spending goals
          using inflation assumptions to estimate retirement readiness.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Projected fund uses assumed annual return and contribution schedule</li>
          <li>Needed amount estimates retirement expenses in future dollars</li>
          <li>On-track status compares projected fund vs target need</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Retirement calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why does inflation matter so much?</summary>
            <p className="mt-2">Inflation increases future living costs, so retirement income targets must account for reduced purchasing power.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is the 4% rule guaranteed?</summary>
            <p className="mt-2">No. It is a planning rule of thumb, not a guarantee. Real outcomes depend on market returns and spending behavior.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if I am not on track?</summary>
            <p className="mt-2">Common adjustments include increasing contributions, delaying retirement, lowering expected expenses, or revisiting return assumptions.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/investment-growth', title: 'Investment Growth', icon: 'trending_up' },
          { path: '/compound-interest', title: 'Compound Interest', icon: 'calculate' },
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'account_balance' },
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
        ]}
      />
    </div>
  )
}
