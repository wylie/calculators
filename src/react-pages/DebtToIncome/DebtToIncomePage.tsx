import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateDebtToIncomeRatio } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function DebtToIncomePage() {
  useEffect(() => {
    analytics.trackCalculatorView('debt-to-income');
  }, []);
  const [input, setInput] = useStickyState<any>('debtToIncome-input', {
    monthlyIncome: 5000,
    monthlyDebts: 1000,
  });

  const result = calculateDebtToIncomeRatio({
    monthlyIncome: Number(input.monthlyIncome) || 0,
    monthlyDebts: Number(input.monthlyDebts) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debt-to-Income Ratio Calculator</h1>
        <p className="text-gray-600">Determine your debt-to-income ratio and mortgage affordability</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Monthly Income (Gross)"
              type="number"
              value={input.monthlyIncome}
              onChange={(value) => setInput({ ...input, monthlyIncome: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Total Monthly Debts"
              type="number"
              value={input.monthlyDebts}
              onChange={(value) => setInput({ ...input, monthlyDebts: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="50"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Ratio</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Debt-to-Income Ratio</p>
                <p className="text-3xl font-bold text-blue-600">{result.percentValue}%</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-900">{result.statusMessage}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Mortgage Affordability</p>
                <p className="text-lg font-semibold text-green-600">${result.mortgageAffordability.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">DTI Guidelines</h3>
          <p className="text-sm text-gray-600">
            Most lenders prefer debt-to-income ratios below 43% to approve new loans
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Your DTI is a major factor lenders use when evaluating your creditworthiness
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Include all recurring monthly debts: auto loans, credit cards, student loans, and mortgages
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Debt-to-Income Ratio Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward debt payments.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Calculation: (Total Monthly Debts ÷ Gross Monthly Income) × 100</li>
          <li>Below 36%: Good ratio, lenders are more likely to approve loans</li>
          <li>36-43%: Acceptable, but higher risk for lenders</li>
          <li>Above 43%: May face difficulty getting approved for new credit</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Debt-to-Income FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What debts are included in DTI?</summary>
            <p className="mt-2">Include all recurring monthly debt: car payments, credit cards, student loans, mortgage, rent, and any other loans.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How can I improve my DTI?</summary>
            <p className="mt-2">Pay down existing debts, increase your income, or both. Even small debt payments reduce your ratio.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is DTI the only factor in loan approval?</summary>
            <p className="mt-2">No. Lenders also consider credit score, savings, employment history, and down payment size.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/loan', title: 'Loan Calculator', icon: 'request_quote' },
          { path: '/credit-card-payoff', title: 'Credit Card Payoff', icon: 'credit_card' },
        ]}
      />
    </div>
  );
}
