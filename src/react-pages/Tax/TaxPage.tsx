import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Toggle from '../../components/Toggle';
import RelatedTools from '../../components/RelatedTools';
import { calculateTax } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function TaxPage() {
  useEffect(() => {
    analytics.trackCalculatorView('tax');
  }, []);
  const [input, setInput] = useStickyState<{amount: string | number; taxRate: string | number; includeTax: boolean}>(
    'tax-input',
    {
      amount: 100,
      taxRate: 8.5,
      includeTax: false,
    }
  );

  const result = calculateTax({
    amount: Number(input.amount) || 0,
    taxRate: Number(input.taxRate) || 0,
    includeTax: input.includeTax,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Calculator</h1>
        <p className="text-gray-600">Calculate tax amount and total with tax</p>
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
              step="0.01"
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={input.taxRate}
              onChange={(value) => setInput({ ...input, taxRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Toggle
              label="Amount Includes Tax"
              value={input.includeTax}
              onChange={(value) => setInput({ ...input, includeTax: value })}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-amber-50">
            <h2 className="text-xl font-semibold mb-4 text-amber-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Amount Before Tax</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.beforeTax)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-amber-200">
                <p className="text-sm text-gray-600">Tax Amount</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(result.taxAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total with Tax</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.afterTax)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Tax Tips</h3>
          <p className="text-sm text-gray-600">
            Toggle "includes tax" when working backwards from a total to find the pre-tax amount
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            US sales tax rates vary by state from 0% to over 10% including local taxes
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator works for sales tax, VAT, GST, and other percentage-based taxes
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this tax calculator works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Calculate tax on any amount or work backwards from a total that includes tax to find
          the pre-tax amount. Useful for sales tax, VAT, GST, or any percentage-based tax.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Forward: Tax = amount × rate, Total = amount + tax</li>
          <li>Reverse: Pre-tax = total ÷ (1 + rate), Tax = total - pre-tax</li>
          <li>Works for any percentage-based tax</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Tax calculator FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between with/without tax included?</summary>
            <p className="mt-2">Without = calculate tax on a pre-tax amount. With = extract the tax from a total that already includes it.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I use this for income tax?</summary>
            <p className="mt-2">This works for simple percentage taxes. Income tax often uses brackets, which need a more complex calculator.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What tax rate should I use?</summary>
            <p className="mt-2">Check your local sales tax rate. In the US, combine state and local rates for the total percentage.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tip', title: 'Tip Calculator', icon: 'payments' },
          { path: '/percentage', title: 'Percentage Converter', icon: 'percent' },
          { path: '/salary-hourly', title: 'Salary/Hourly Converter', icon: 'paid' },
        ]}
      />
    </div>
  );
}
