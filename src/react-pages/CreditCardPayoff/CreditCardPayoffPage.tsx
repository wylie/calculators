import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState'
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input'
import RelatedTools from '../../components/RelatedTools'
import { calculateCreditCardPayoff } from '../../utils/calculators'
import { formatCurrency } from '../../utils/formatting'
import analytics from '../../utils/analytics';

export default function CreditCardPayoffPage() {
  useEffect(() => {
    analytics.trackCalculatorView('credit-card-payoff');
  }, []);
  const [input, setInput] = useStickyState<{balance: string | number; aprRate: string | number; monthlyPayment: string | number}>(
    'credit-card-payoff-input',
    {
    balance: 5000,
    aprRate: 18,
    monthlyPayment: 200,
    }
  )

  const result = calculateCreditCardPayoff({
    balance: Number(input.balance) || 0,
    aprRate: Number(input.aprRate) || 0,
    monthlyPayment: Number(input.monthlyPayment) || 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Card Payoff Calculator</h1>
        <p className="text-gray-600">Find out how long it will take to pay off your credit card debt</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Current Balance ($)"
              type="number"
              value={input.balance}
              onChange={(value) => setInput({ ...input, balance: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="APR Interest Rate (%)"
              type="number"
              value={input.aprRate}
              onChange={(value) => setInput({ ...input, aprRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label="Monthly Payment ($)"
              type="number"
              value={input.monthlyPayment}
              onChange={(value) => setInput({ ...input, monthlyPayment: value === '' ? '' : parseFloat(value) })}
              min="1"
              step="10"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-orange-50">
            <h2 className="text-xl font-semibold mb-4 text-orange-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Time to Pay Off</p>
                <p className="text-2xl font-bold text-orange-600">
                  {result.yearsToPayoff.toFixed(1)} years
                </p>
                <p className="text-xs text-gray-500">({result.monthsToPayoff} months)</p>
              </div>
              <div className="bg-white p-3 rounded border border-orange-200">
                <p className="text-sm text-gray-600">Total Interest Paid</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.totalPaid)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Payoff Tips</h3>
          <p className="text-sm text-gray-600">
            Pay more than the minimum to significantly reduce total interest costs
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average credit card APR ranges from 18-24% depending on credit score
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This shows payoff timeline assuming fixed monthly payment amounts
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this credit card payoff calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This tool estimates payoff timeline based on your current balance, APR, and monthly payment amount.
          It also estimates total interest paid before the balance reaches zero.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Higher APR generally increases total interest cost</li>
          <li>Higher monthly payment reduces payoff time</li>
          <li>Longer payoff periods typically mean more interest paid</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Credit card payoff FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why is my payoff time so long?</summary>
            <p className="mt-2">If APR is high and payment is close to minimum, a larger share goes to interest and principal decreases slowly.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What helps reduce total interest?</summary>
            <p className="mt-2">Increase monthly payments, avoid new charges, and consider lower-rate options where appropriate.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is this an exact lender payoff quote?</summary>
            <p className="mt-2">No. It is an estimate for planning. Actual payoff timing can vary by issuer fees and statement timing.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/retirement', title: 'Retirement Calculator', icon: 'celebration' },
          { path: '/investment-growth', title: 'Investment Growth', icon: 'trending_up' },
        ]}
      />
    </div>
  );
}
