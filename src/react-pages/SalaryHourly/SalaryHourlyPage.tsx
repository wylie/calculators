import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateSalaryHourly } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function SalaryHourlyPage() {
  useEffect(() => {
    analytics.trackCalculatorView('salary-hourly');
  }, []);
  const [input, setInput] = useStickyState<{amount: string | number; type: 'salary' | 'hourly'; hoursPerWeek: string | number; weeksPerYear: string | number}>(
    'salary-hourly-input',
    {
      amount: 50000,
      type: 'salary',
      hoursPerWeek: 40,
      weeksPerYear: 52,
    }
  );

  const result = calculateSalaryHourly({
    amount: Number(input.amount) || 0,
    type: input.type,
    hoursPerWeek: Number(input.hoursPerWeek) || 40,
    weeksPerYear: Number(input.weeksPerYear) || 52,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary / Hourly Converter</h1>
        <p className="text-gray-600">Convert between annual salary and hourly rate</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <div className="space-y-4">
            <Select
              label="Convert From"
              value={input.type}
              onChange={(value) => setInput({ ...input, type: value as 'salary' | 'hourly' })}
              options={[
                { value: 'salary', label: 'Annual Salary' },
                { value: 'hourly', label: 'Hourly Rate' },
              ]}
            />
            <Input
              label={input.type === 'salary' ? 'Annual Salary ($)' : 'Hourly Rate ($)'}
              type="number"
              value={input.amount}
              onChange={(value) => setInput({ ...input, amount: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="0.01"
            />
            <Input
              label="Hours Per Week"
              type="number"
              value={input.hoursPerWeek}
              onChange={(value) => setInput({ ...input, hoursPerWeek: value === '' ? '' : parseFloat(value) })}
              min="1"
              step="0.5"
            />
            <Input
              label="Weeks Per Year"
              type="number"
              value={input.weeksPerYear}
              onChange={(value) => setInput({ ...input, weeksPerYear: value === '' ? '' : parseFloat(value) })}
              min="1"
              max="52"
              step="1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-indigo-50">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900">Results</h2>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-indigo-200">
                <p className="text-sm text-gray-600">Annual Salary</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(result.annualSalary)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-200">
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(result.hourlyRate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Income</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.weeklyIncome)}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Salary Tips</h3>
          <p className="text-sm text-gray-600">
            Standard work year is 2,080 hours (40 hrs/week × 52 weeks)
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Adjust weeks per year for unpaid vacation or time off periods
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            These calculations show gross pay before taxes and deductions
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How this salary/hourly converter works</h2>
        <p className="text-sm text-gray-600 mb-3">
          The converter calculates annual salary and hourly rate based on your work schedule. 
          Adjust hours per week and weeks per year for part-time or contract work.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Annual salary = hourly rate × hours per week × weeks per year</li>
          <li>Hourly rate = annual salary ÷ (hours per week × weeks per year)</li>
          <li>Monthly = annual ÷ 12</li>
          <li>Weekly = annual ÷ weeks per year</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Salary/hourly converter FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How many hours are in a standard work year?</summary>
            <p className="mt-2">2,080 hours (40 hours/week × 52 weeks). For part-time, adjust hours per week accordingly.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I account for unpaid time off?</summary>
            <p className="mt-2">Yes. If you have 2 weeks unpaid vacation, set weeks per year to 50 instead of 52.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Are taxes included in these calculations?</summary>
            <p className="mt-2">No. These show gross amounts before taxes, insurance, or other deductions.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/tax', title: 'Tax Calculator', icon: 'receipt' },
          { path: '/budget', title: 'Budget Calculator', icon: 'wallet' },
          { path: '/savings', title: 'Savings Calculator', icon: 'savings' },
        ]}
      />
    </div>
  );
}
