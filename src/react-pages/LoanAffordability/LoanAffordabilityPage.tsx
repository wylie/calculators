import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateLoanAffordability } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function LoanAffordabilityPage() {
  useEffect(() => {
    analytics.trackCalculatorView('loan-affordability');
  }, []);
  const [input, setInput] = useStickyState<{monthlyIncome: string | number; monthlyDebts: string | number; desiredLoanTerm: string | number; interestRate: string | number}>('loanaffordability-input', {
    monthlyIncome: 5000,
    monthlyDebts: 500,
    desiredLoanTerm: 5,
    interestRate: 6.5,
  });

  const result = calculateLoanAffordability({
    monthlyIncome: Number(input.monthlyIncome) || 0,
    monthlyDebts: Number(input.monthlyDebts) || 0,
    desiredLoanTerm: Number(input.desiredLoanTerm) || 0,
    interestRate: Number(input.interestRate) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Affordability Calculator</h1>
        <p className="text-gray-600">Determine how much loan you can afford based on your income and debts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Monthly Income"
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
            <Input
              label="Desired Loan Term (years)"
              type="number"
              value={input.desiredLoanTerm}
              onChange={(value) => setInput({ ...input, desiredLoanTerm: value === '' ? '' : parseFloat(value) })}
              min="1"
              max="30"
              step="1"
            />
            <Input
              label="Interest Rate (%)"
              type="number"
              value={input.interestRate}
              onChange={(value) => setInput({ ...input, interestRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="20"
              step="0.1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Affordability</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Maximum Loan Amount</p>
                <p className="text-2xl font-bold text-blue-600">${result.maxLoanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Maximum Monthly Payment</p>
                <p className="text-lg font-semibold text-gray-900">${result.maxMonthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Debt-to-Income Ratio</p>
                <p className="text-lg font-semibold text-gray-900">{result.debtToIncomeRatio}%</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Affordability Tips</h3>
          <p className="text-sm text-gray-600">
            Lenders typically allow up to 28% of gross monthly income for housing payments
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Your debt-to-income ratio is one of the most important factors lenders consider
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Pre-approval amounts may differ from actual approval based on credit score and history
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Loan Affordability Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator uses standard lending criteria to determine what loan amount you can afford. It considers your income, existing debts, loan term, and interest rate.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Maximum housing payment is typically 28% of gross income</li>
          <li>Total debt payments shouldn't exceed 43% of gross income</li>
          <li>Uses standard amortization formula for payment calculations</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Loan Affordability FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What is debt-to-income ratio?</summary>
            <p className="mt-2">It's the percentage of your monthly income that goes toward debt payments. Most lenders want to see this under 43%.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I borrow more than this shows?</summary>
            <p className="mt-2">Possibly, but lenders may charge higher interest rates. This calculator uses conservative lending standards.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this include taxes and insurance?</summary>
            <p className="mt-2">This calculator focuses on the loan payment itself. Actual affordability may be lower when including taxes and insurance.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/loan', title: 'Loan Calculator', icon: 'request_quote' },
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/debt-to-income', title: 'Debt-to-Income Ratio', icon: 'account_balance' },
        ]}
      />
    </div>
  );
}
