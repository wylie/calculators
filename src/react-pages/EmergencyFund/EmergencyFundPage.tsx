import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateEmergencyFund } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function EmergencyFundPage() {
  useEffect(() => {
    analytics.trackCalculatorView('emergency-fund');
  }, []);
  const [input, setInput] = useStickyState<any>('emergencyFund-input', {
    monthlyExpenses: 3000,
    monthsOfExpenses: 6,
  });

  const result = calculateEmergencyFund({
    monthlyExpenses: Number(input.monthlyExpenses) || 0,
    monthsOfExpenses: Number(input.monthsOfExpenses) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Fund Calculator</h1>
        <p className="text-gray-600">Calculate how much emergency savings you should have set aside</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Monthly Expenses"
              type="number"
              value={input.monthlyExpenses}
              onChange={(value) => setInput({ ...input, monthlyExpenses: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Months of Expenses to Save"
              type="number"
              value={input.monthsOfExpenses}
              onChange={(value) => setInput({ ...input, monthsOfExpenses: value === '' ? '' : parseFloat(value) })}
              min="1"
              max="12"
              step="0.5"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Your Target</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Recommended Emergency Fund</p>
                <p className="text-3xl font-bold text-blue-600">${result.recommendedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-lg font-semibold text-gray-900">${input.monthlyExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Months Covered</p>
                <p className="text-lg font-semibold text-gray-900">{input.monthsOfExpenses} months</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Emergency Fund Tips</h3>
          <p className="text-sm text-gray-600">
            Start with 3 months of expenses and work up to 6-12 months depending on your circumstances
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Studies show only 40% of Americans have enough saved for a $400 emergency without borrowing
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Keep emergency funds in a liquid, easily accessible account like a high-yield savings account
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Emergency Funds Work</h2>
        <p className="text-sm text-gray-600 mb-3">
          An emergency fund is money set aside to cover unexpected expenses and income loss without debt.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Calculation: Monthly Expenses × Months of Expenses = Recommended Amount</li>
          <li>Most financial experts recommend 3-6 months of expenses minimum</li>
          <li>Keep funds accessible but separate from regular spending accounts</li>
          <li>Replenish the fund as soon as you use it</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Emergency Fund FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How much should I actually save?</summary>
            <p className="mt-2">Start with 3 months of expenses. If you have variable income or dependents, aim for 6-12 months.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Where should I keep emergency funds?</summary>
            <p className="mt-2">High-yield savings accounts offer safety, liquidity, and modest returns. Avoid investments or hard-to-access accounts.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I build an emergency fund or pay off debt?</summary>
            <p className="mt-2">Build a small fund ($1,000) first, then pay high-interest debt. Once debt is low, build to 3-6 months.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/savings', title: 'Savings Calculator', icon: 'savings' },
          { path: '/budget', title: 'Budget Calculator', icon: 'account_balance_wallet' },
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'trending_up' },
        ]}
      />
    </div>
  );
}
