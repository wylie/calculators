import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateSavings } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function SavingsPage() {
  useEffect(() => {
    analytics.trackCalculatorView('savings');
  }, []);
  const [input, setInput] = useStickyState<{goalAmount: string | number; currentSavings: string | number; monthlyContribution: string | number; interestRate: string | number}>(
    'savings-input',
    {
      goalAmount: 10000,
      currentSavings: 1000,
      monthlyContribution: 200,
      interestRate: 4,
    }
  );

  const result = calculateSavings({
    goalAmount: Number(input.goalAmount) || 0,
    currentSavings: Number(input.currentSavings) || 0,
    monthlyContribution: Number(input.monthlyContribution) || 0,
    interestRate: Number(input.interestRate) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Calculator</h1>
        <p className="text-gray-600">Calculate how long it will take to reach your savings goal</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Goal</h2>
          <div className="space-y-4">
            <Input
              label="Savings Goal ($)"
              type="number"
              value={input.goalAmount}
              onChange={(value) => setInput({ ...input, goalAmount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Current Savings ($)"
              type="number"
              value={input.currentSavings}
              onChange={(value) => setInput({ ...input, currentSavings: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Monthly Contribution ($)"
              type="number"
              value={input.monthlyContribution}
              onChange={(value) => setInput({ ...input, monthlyContribution: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10"
            />
            <Input
              label="Annual Interest Rate (%)"
              type="number"
              value={input.interestRate}
              onChange={(value) => setInput({ ...input, interestRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-emerald-50">
            <h2 className="text-xl font-semibold mb-4 text-emerald-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-emerald-200">
                <p className="text-sm text-gray-600">Time to Goal</p>
                <p className="text-3xl font-bold text-emerald-600">{result.yearsToGoal} years</p>
                <p className="text-sm text-gray-600 mt-1">({result.monthsToGoal} months)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contributions</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalContributions)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.finalAmount)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Savings Tips</h3>
          <p className="text-sm text-gray-600">
            Increase monthly contributions to reach your goal faster and earn more interest
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            High-yield savings accounts typically offer 4-5% APY as of 2024
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This assumes compound interest paid monthly on the account balance
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this savings calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Calculate how long it takes to reach a savings goal with regular contributions and compound interest.
          The calculator accounts for monthly compounding on your growing balance.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Interest compounds monthly on current balance</li>
          <li>Monthly contributions added after interest calculation</li>
          <li>Time to goal calculated month by month until target reached</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Savings calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if I can't reach my goal?</summary>
            <p className="mt-2">Increase monthly contributions, choose a higher-yield account, or extend your timeline.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Where can I get 4-5% interest?</summary>
            <p className="mt-2">High-yield savings accounts from online banks often offer competitive rates above 4% APY.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does interest accelerate savings?</summary>
            <p className="mt-2">Earned interest grows your balance faster than contributions alone, compounding over time.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/compound-interest', title: 'Compound Interest', icon: 'trending_up' },
          { path: '/investment-growth', title: 'Investment Growth', icon: 'show_chart' },
          { path: '/budget', title: 'Budget Calculator', icon: 'wallet' },
        ]}
      />
    </div>
  );
}
