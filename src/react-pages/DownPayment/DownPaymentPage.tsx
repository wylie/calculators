import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateDownPayment } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function DownPaymentPage() {
  useEffect(() => {
    analytics.trackCalculatorView('down-payment');
  }, []);
  const [input, setInput] = useStickyState<{price: string | number; percentageDown: string | number; interestRate: string | number; loanTerm: string | number}>(
    'down-payment-input',
    {
    price: 500000,
    percentageDown: 20,
    interestRate: 5,
    loanTerm: 30,
    }
  )

  const result = calculateDownPayment({
    price: Number(input.price) || 0,
    percentageDown: Number(input.percentageDown) || 0,
    interestRate: Number(input.interestRate) || 0,
    loanTerm: Number(input.loanTerm) || 30,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Down Payment Calculator</h1>
        <p className="text-gray-600">Calculate your down payment and estimated monthly payment</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Total Price ($)"
              type="number"
              value={input.price}
              onChange={(value) => setInput({ ...input, price: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10000"
            />
            <Input
              label="Down Payment (%)"
              type="number"
              value={input.percentageDown}
              onChange={(value) => setInput({ ...input, percentageDown: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="100"
              step="0.1"
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
          <Card className="bg-sky-50">
            <h2 className="text-xl font-semibold mb-4 text-sky-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-sky-200">
                <p className="text-sm text-gray-600">Down Payment Required</p>
                <p className="text-2xl font-bold text-sky-600">{formatCurrency(result.downPaymentAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.loanAmount)}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.monthlyPayment)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Down Payment Tips</h3>
          <p className="text-sm text-gray-600">
            Putting down 20% or more helps you avoid PMI (Private Mortgage Insurance)
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            In many areas, you can start with as little as 3-5% down with FHA loans
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator shows P&I only. Factor in taxes, insurance, and HOA fees
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this down payment calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This tool converts your down payment percentage into a dollar amount, then estimates resulting loan size and
          monthly principal-and-interest payment based on interest rate and loan term.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Down payment amount = home price × down payment percent</li>
          <li>Loan amount = home price minus down payment</li>
          <li>Monthly payment estimate includes principal and interest only</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Down payment calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is 20% down required?</summary>
            <p className="mt-2">Not always. Many programs allow lower down payments, but 20% often helps avoid PMI on conventional loans.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this include taxes, insurance, or HOA?</summary>
            <p className="mt-2">No. This monthly estimate focuses on principal and interest. Add other housing costs separately.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What happens if I increase down payment?</summary>
            <p className="mt-2">A larger down payment reduces loan amount, which usually lowers monthly payment and total interest.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/refinance', title: 'Refinance Calculator', icon: 'build' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
