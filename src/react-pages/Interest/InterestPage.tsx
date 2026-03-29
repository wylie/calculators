import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateSimpleInterest } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function InterestPage() {
  useEffect(() => {
    analytics.trackCalculatorView('interest');
  }, []);
  const [input, setInput] = useStickyState<{principal: string | number; rate: string | number; time: string | number}>(
    'interest-input',
    {
    principal: 10000,
    rate: 5,
    time: 2,
    }
  )

  const result = calculateSimpleInterest({
    principal: Number(input.principal) || 0,
    rate: Number(input.rate) || 0,
    time: Number(input.time) || 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interest Calculator</h1>
        <p className="text-gray-600">Calculate simple interest earned on your principal amount</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Input
              label="Principal Amount ($)"
              type="number"
              value={input.principal}
              onChange={(value) => setInput({ ...input, principal: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Annual Interest Rate (%)"
              type="number"
              value={input.rate}
              onChange={(value) => setInput({ ...input, rate: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
            <Input
              label="Time Period (Years)"
              type="number"
              value={input.time}
              onChange={(value) => setInput({ ...input, time: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-green-50">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.interest)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalAmount)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Formula</h2>
        <p className="text-gray-600 mb-2">Simple Interest = Principal × Rate × Time ÷ 100</p>
        <p className="text-sm text-gray-500">
          For example: {formatCurrency(Number(input.principal) || 0)} × {Number(input.rate) || 0}% × {Number(input.time) || 0} years = {formatCurrency(result.interest)} in interest
        </p>
      </Card><RelatedTools
        tools={[
          { path: '/compound-interest', title: 'Compound Interest', icon: 'calculate' },
          { path: '/investment-growth', title: 'Investment Growth', icon: 'trending_up' },
          { path: '/refinance', title: 'Refinance Calculator', icon: 'build' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
        ]}
      />
    </div>
  )
}
