import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { formatCurrency, formatPercentage } from '../../utils/formatting';
import analytics from '../../utils/analytics';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export default function BudgetPage() {
  useEffect(() => {
    analytics.trackCalculatorView('budget');
  }, []);
  const [income, setIncome] = useStickyState('budget-income', '5000');
  const [expenses, setExpenses] = useStickyState<ExpenseItem[]>('budget-expenses', [
    { id: '1', name: 'Rent', amount: 1500 },
    { id: '2', name: 'Utilities', amount: 200 },
    { id: '3', name: 'Groceries', amount: 600 },
    { id: '4', name: 'Transportation', amount: 300 },
    { id: '5', name: 'Debt', amount: 200 },
    { id: '6', name: 'Savings', amount: 500 },
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = parseFloat(income) - totalExpenses;
  const savingsCategory = expenses.find(e => e.name === 'Savings');
  const savingsRate = savingsCategory
    ? (savingsCategory.amount / parseFloat(income)) * 100
    : (Math.max(remaining, 0) / parseFloat(income)) * 100;

  const guidance =
    remaining < 0
      ? `You are over budget by ${formatCurrency(Math.abs(remaining))}`
      : `You have ${formatCurrency(remaining)} left this month`;

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), name: 'New Expense', amount: 0 },
    ]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleUpdateExpense = (id: string, field: 'name' | 'amount', value: string | number) => {
    setExpenses(
      expenses.map(e =>
        e.id === id
          ? { ...e, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value }
          : e
      )
    );
  };

  const handleReset = () => {
    setIncome('5000');
    setExpenses([
      { id: '1', name: 'Rent', amount: 1500 },
      { id: '2', name: 'Utilities', amount: 200 },
      { id: '3', name: 'Groceries', amount: 600 },
      { id: '4', name: 'Transportation', amount: 300 },
      { id: '5', name: 'Debt', amount: 200 },
      { id: '6', name: 'Savings', amount: 500 },
    ]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Budget Calculator</h1>
      <p className="text-slate-600 mb-6">
        Plan your monthly budget by tracking income and expenses with real-time calculations.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Income</h3>
            <Input
              label="Net Monthly Income ($)"
              value={income}
              onChange={setIncome}
              type="number"
              min="0"
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Expenses</h3>
              <button
                onClick={handleAddExpense}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex gap-2">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => handleUpdateExpense(expense.id, 'name', e.target.value)}
                    placeholder="Expense name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleUpdateExpense(expense.id, 'amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-24 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Income</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(parseFloat(income))}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Total Expenses</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Remaining</p>
                <p className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Savings Rate</p>
                <p className="text-lg font-bold text-slate-900">{formatPercentage(savingsRate)}</p>
              </div>

              <div className="border-t border-slate-200 pt-3 bg-slate-50 p-3 rounded">
                <p className="text-xs font-medium text-slate-600">{guidance}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Budget Tips</h3>
          <p className="text-sm text-gray-600">
            Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Financial experts recommend maintaining 3-6 months of expenses as emergency fund
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Tracking expenses over time helps reveal spending patterns and areas to optimize
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this budget calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          Add your monthly net income and expense categories, then the calculator totals your spending and shows your
          remaining cash flow and estimated savings rate.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Total expenses are summed across all categories</li>
          <li>Remaining = income minus total expenses</li>
          <li>Savings rate is based on your savings category or positive remaining cash flow</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Budget calculator FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I add custom expense categories?</summary>
            <p className="mt-2">Yes. Use the Add button to create as many expense rows as you need and rename each row.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if my budget is negative?</summary>
            <p className="mt-2">A negative remaining amount means expenses exceed income. Reduce categories or increase income to restore balance.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What savings rate should I target?</summary>
            <p className="mt-2">Many people aim for around 20%, but the right rate depends on debt, emergency savings, and personal goals.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/net-worth', title: 'Net Worth Calculator', icon: 'account_balance' },
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/retirement', title: 'Retirement Calculator', icon: 'celebration' },
        ]}
      />
    </div>
  );
}
