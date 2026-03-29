import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState'
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input'
import Select from '../../components/Select'
import RelatedTools from '../../components/RelatedTools'
import { calculateCompoundInterest } from '../../utils/calculators'
import { formatCurrency } from '../../utils/formatting'
import analytics from '../../utils/analytics';

export default function CompoundInterestPage() {
  useEffect(() => {
    analytics.trackCalculatorView('compound-interest');
  }, []);
  const [input, setInput] = useStickyState<{principal: string | number; rate: string | number; time: string | number; compounding: string | number}>(
    'compound-interest-input',
    {
    principal: 10000,
    rate: 5,
    time: 10,
    compounding: 12,
    }
  )

  const result = calculateCompoundInterest({
    principal: Number(input.principal) || 0,
    rate: Number(input.rate) || 0,
    time: Number(input.time) || 0,
    compounding: parseInt(input.compounding as any) || 12,
  })

  const compoundingOptions = [
    { value: 1, label: 'Annually' },
    { value: 2, label: 'Semi-Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compound Interest Calculator</h1>
        <p className="text-gray-600">Watch your money grow with compound interest over time</p>
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
            <Select
              label="Compounding Frequency"
              value={input.compounding.toString()}
              onChange={(value) => setInput({ ...input, compounding: parseInt(value) })}
              options={compoundingOptions.map(opt => ({ ...opt, value: opt.value.toString() }))}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.interest)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Final Amount</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.amount)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Compound Tips</h3>
          <p className="text-sm text-gray-600">
            More frequent compounding (daily vs annually) accelerates growth over time
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Rule of 72: Divide 72 by interest rate to estimate years to double your money
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Inflation can reduce the real purchasing power of returns over long periods
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Formula</h2>
        <p className="text-gray-600 mb-2">A = P(1 + r/n)^(nt)</p>
        <p className="text-sm text-gray-500">
          Where: P = Principal, r = Annual rate, n = Compounding frequency, t = Time in years
        </p>
      </Card><RelatedTools
        tools={[
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
          { path: '/investment-growth', title: 'Investment Growth', icon: 'trending_up' },
          { path: '/retirement', title: 'Retirement Calculator', icon: 'celebration' },
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'account_balance' },
        ]}
      />
    </div>
  )
}
