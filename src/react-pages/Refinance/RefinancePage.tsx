import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState'
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input'
import RelatedTools from '../../components/RelatedTools'
import { calculateRefinance } from '../../utils/calculators'
import { formatCurrency } from '../../utils/formatting'
import analytics from '../../utils/analytics';

export default function RefinancePage() {
  useEffect(() => {
    analytics.trackCalculatorView('refinance');
  }, []);
  const [input, setInput] = useStickyState<{remainingBalance: string | number; currentRate: string | number; newRate: string | number; originalTerm: string | number; yearsElapsed: string | number; newTerm: string | number; refinanceCost: string | number}>(
    'refinance-input',
    {
    remainingBalance: 250000,
    currentRate: 6,
    newRate: 4,
    originalTerm: 30,
    yearsElapsed: 5,
    newTerm: 25,
    refinanceCost: 3000,
    }
  )

  const result = calculateRefinance({
    remainingBalance: Number(input.remainingBalance) || 0,
    currentRate: Number(input.currentRate) || 0,
    newRate: Number(input.newRate) || 0,
    originalTerm: Number(input.originalTerm) || 30,
    yearsElapsed: Number(input.yearsElapsed) || 0,
    newTerm: Number(input.newTerm) || 30,
    refinanceCost: Number(input.refinanceCost) || 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refinance Calculator</h1>
        <p className="text-gray-600">Calculate potential savings from refinancing your loan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Current Loan</h2>
          <div className="space-y-4">
            <Input
              label="Remaining Balance ($)"
              type="number"
              value={input.remainingBalance}
              onChange={(value) => setInput({ ...input, remainingBalance: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10000"
            />
            <Input
              label="Current Interest Rate (%)"
              type="number"
              value={input.currentRate}
              onChange={(value) => setInput({ ...input, currentRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label="Original Loan Term (Years)"
              type="number"
              value={input.originalTerm}
              onChange={(value) => setInput({ ...input, originalTerm: value === '' ? '' : parseInt(value) })}
              min="1"
              step="1"
            />
            <Input
              label="Years Already Paid"
              type="number"
              value={input.yearsElapsed}
              onChange={(value) => setInput({ ...input, yearsElapsed: value === '' ? '' : parseInt(value) })}
              min="0"
              step="1"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 mt-6">Refinance Terms</h2>
          <div className="space-y-4">
            <Input
              label="New Interest Rate (%)"
              type="number"
              value={input.newRate}
              onChange={(value) => setInput({ ...input, newRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label="New Loan Term (Years)"
              type="number"
              value={input.newTerm}
              onChange={(value) => setInput({ ...input, newTerm: value === '' ? '' : parseInt(value) })}
              min="1"
              step="1"
            />
            <Input
              label="Refinance Costs ($)"
              type="number"
              value={input.refinanceCost}
              onChange={(value) => setInput({ ...input, refinanceCost: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-teal-50">
            <h2 className="text-xl font-semibold mb-4 text-teal-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Monthly Payment</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.currentMonthlyPayment)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-teal-200">
                <p className="text-sm text-gray-600">New Monthly Payment</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.newMonthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Savings</p>
                <p className={`text-lg font-semibold ${result.monthlySavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.monthlySavings > 0 ? '+' : ''}{formatCurrency(result.monthlySavings)}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm text-gray-600">Total Savings (Net)</p>
                <p className={`text-xl font-semibold ${result.totalSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.totalSavings > 0 ? '+' : ''}{formatCurrency(result.totalSavings)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Break-Even Point</p>
                <p className="text-lg font-semibold text-gray-900">{result.breakEvenMonths} months</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Refinance Tips</h3>
          <p className="text-sm text-gray-600">
            Check break-even months to ensure you'll stay in the home long enough to benefit
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Typical refinance closing costs range from $2,000 to $5,000 depending on location
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Savings assume you'll hold the loan through the full new term completion
          </p>
        </Card>
      </div><Card>
        <h2 className="text-xl font-semibold mb-3">How this refinance calculator works</h2>
        <p className="text-sm text-gray-700 mb-3">
          The calculator compares your current loan payment to a proposed refinance payment, then estimates total
          net savings after refinance costs over the new term.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Monthly savings = current monthly payment minus new monthly payment</li>
          <li>Total net savings factors in refinance closing costs</li>
          <li>Break-even months estimate when savings recover upfront costs</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-3">Refinance calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What is break-even point?</summary>
            <p className="mt-2">Break-even is the number of months it takes for monthly savings to offset refinance costs.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can refinancing increase total cost?</summary>
            <p className="mt-2">Yes. If you reset into a much longer term or pay high costs, total lifetime interest can still rise.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What rate drop is worth refinancing?</summary>
            <p className="mt-2">There is no single rule; compare monthly savings, break-even timing, and how long you plan to keep the loan.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/down-payment', title: 'Down Payment Calculator', icon: 'trending_down' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
