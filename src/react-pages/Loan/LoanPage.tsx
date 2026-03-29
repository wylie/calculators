import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateLoan } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function LoanPage() {
  useEffect(() => {
    analytics.trackCalculatorView('loan');
  }, []);
  const [input, setInput] = useStickyState<{loanAmount: string | number; interestRate: string | number; loanTerm: string | number}>(
    'loan-input',
    {
      loanAmount: 10000,
      interestRate: 6,
      loanTerm: 5,
    }
  );

  const result = calculateLoan({
    loanAmount: Number(input.loanAmount) || 0,
    interestRate: Number(input.interestRate) || 0,
    loanTerm: Number(input.loanTerm) || 1,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-gray-600">Calculate monthly payment and total interest for any loan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
          <div className="space-y-4">
            <Input
              label="Loan Amount ($)"
              type="number"
              value={input.loanAmount}
              onChange={(value) => setInput({ ...input, loanAmount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Interest Rate (% Annual)"
              type="number"
              value={input.interestRate}
              onChange={(value) => setInput({ ...input, interestRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label="Loan Term (Years)"
              type="number"
              value={input.loanTerm}
              onChange={(value) => setInput({ ...input, loanTerm: value === '' ? '' : parseFloat(value) })}
              min="1"
              step="1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(result.monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.totalCost)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Loan Tips</h3>
          <p className="text-sm text-gray-600">
            Shorter loan terms mean higher monthly payments but less total interest
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Personal loan rates typically range from 6% to 36% depending on credit score
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator uses standard amortization formulas for fixed-rate loans
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this loan calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This general-purpose loan calculator computes monthly payment, total interest, and total cost
          for any fixed-rate loan including personal loans, student loans, or business loans.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Monthly payment includes principal and interest</li>
          <li>Total cost = monthly payment × number of months</li>
          <li>Total interest = total cost minus loan amount</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Loan calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What types of loans can I calculate?</summary>
            <p className="mt-2">This works for any fixed-rate loan: personal loans, student loans, business loans, etc.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does loan term affect total interest?</summary>
            <p className="mt-2">Longer terms lower monthly payments but increase total interest paid over the life of the loan.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Are fees included in these calculations?</summary>
            <p className="mt-2">No. Add origination fees, closing costs, or other charges separately to total cost.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
