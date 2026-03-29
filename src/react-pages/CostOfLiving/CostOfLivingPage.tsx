import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateCostOfLiving } from '../../utils/calculators';
import { formatCurrency, formatPercentage } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function CostOfLivingPage() {
  useEffect(() => {
    analytics.trackCalculatorView('cost-of-living');
  }, []);
  const [housing, setHousing] = useStickyState('col-housing', '1500');
  const [food, setFood] = useStickyState('col-food', '600');
  const [transportation, setTransportation] = useStickyState('col-transportation', '300');
  const [utilities, setUtilities] = useStickyState('col-utilities', '200');
  const [healthcare, setHealthcare] = useStickyState('col-healthcare', '250');
  const [entertainment, setEntertainment] = useStickyState('col-entertainment', '200');
  const [other, setOther] = useStickyState('col-other', '150');

  const result = calculateCostOfLiving({
    housing: parseFloat(housing) || 0,
    food: parseFloat(food) || 0,
    transportation: parseFloat(transportation) || 0,
    utilities: parseFloat(utilities) || 0,
    healthcare: parseFloat(healthcare) || 0,
    entertainment: parseFloat(entertainment) || 0,
    other: parseFloat(other) || 0,
  });

  const handleReset = () => {
    setHousing('1500');
    setFood('600');
    setTransportation('300');
    setUtilities('200');
    setHealthcare('250');
    setEntertainment('200');
    setOther('150');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Cost of Living Calculator</h1>
      <p className="text-slate-600 mb-6">
        Estimate your monthly and yearly cost of living across different expense categories.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Expenses</h3>

            <Input
              label="Housing ($)"
              value={housing}
              onChange={setHousing}
              type="number"
              min="0"
            />

            <Input
              label="Food & Groceries ($)"
              value={food}
              onChange={setFood}
              type="number"
              min="0"
            />

            <Input
              label="Transportation ($)"
              value={transportation}
              onChange={setTransportation}
              type="number"
              min="0"
            />

            <Input
              label="Utilities ($)"
              value={utilities}
              onChange={setUtilities}
              type="number"
              min="0"
            />

            <Input
              label="Healthcare ($)"
              value={healthcare}
              onChange={setHealthcare}
              type="number"
              min="0"
            />

            <Input
              label="Entertainment ($)"
              value={entertainment}
              onChange={setEntertainment}
              type="number"
              min="0"
            />

            <Input
              label="Other ($)"
              value={other}
              onChange={setOther}
              type="number"
              min="0"
            />

            <button
              onClick={handleReset}
              className="w-full mt-6 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>
        </div>

        <div>
          <Card className="bg-blue-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Monthly Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.monthlyTotal)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Yearly Total</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(result.yearlyTotal)}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-2 font-semibold">Category</th>
                <th className="text-right py-2 font-semibold">Monthly</th>
                <th className="text-right py-2 font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {result.byCategory.map((cat) => (
                <tr key={cat.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3">{cat.name}</td>
                  <td className="text-right py-3">{formatCurrency(cat.monthly)}</td>
                  <td className="text-right py-3">{formatPercentage(cat.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Budgeting Tips</h3>
          <p className="text-sm text-gray-600">
            Track your spending in each category and look for areas where you can cut costs. Small reductions add up over time.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average US household spends 30-35% on housing, 10-15% on food, and 15-20% on transportation and utilities combined.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Cost of living varies significantly by region, city, and personal circumstances. Compare your costs to others in your area for context.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this cost of living calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This calculator sums your monthly expenses by category and calculates yearly costs. It also shows what percentage of your spending goes to each category.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Monthly Total = Sum of all expense categories</li>
          <li>Yearly Total = Monthly Total × 12</li>
          <li>Category Percentage = (Category Amount ÷ Monthly Total) × 100</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Cost of living FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does cost of living compare between cities?</summary>
            <p className="mt-2">Major metropolitan areas typically have higher costs for housing, transportation, and food. Rural areas may have lower costs but fewer services and job opportunities.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What should I do if my lifestyle exceeds my income?</summary>
            <p className="mt-2">Review each category and identify areas to reduce. Start with entertainment and discretionary spending, then tackle larger categories like housing if needed.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How should I adjust for inflation?</summary>
            <p className="mt-2">Cost of living increases over time due to inflation. Review and update your expenses annually to account for price increases across categories.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/budget', title: 'Budget Calculator', icon: 'account_balance_wallet' },
          { path: '/savings', title: 'Savings Calculator', icon: 'savings' },
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'trending_up' },
        ]}
      />
    </div>
  );
}
