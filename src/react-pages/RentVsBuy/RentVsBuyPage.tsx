import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateRentVsBuy } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function RentVsBuyPage() {
  useEffect(() => {
    analytics.trackCalculatorView('rent-vs-buy');
  }, []);
  const [input, setInput] = useStickyState<any>('rentVsBuy-input', {
    homePrice: 350000,
    downPaymentPercent: 20,
    monthlyRent: 1500,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
    maintenancePercent: 1,
    annualRentIncrease: 3,
    homeAppreciationRate: 3,
    years: 10,
  });

  const result = calculateRentVsBuy({
    homePrice: Number(input.homePrice) || 0,
    downPaymentPercent: Number(input.downPaymentPercent) || 0,
    monthlyRent: Number(input.monthlyRent) || 0,
    interestRate: Number(input.interestRate) || 0,
    loanTerm: Number(input.loanTerm) || 0,
    propertyTaxRate: Number(input.propertyTaxRate) || 0,
    homeInsuranceAnnual: Number(input.homeInsuranceAnnual) || 0,
    maintenancePercent: Number(input.maintenancePercent) || 0,
    annualRentIncrease: Number(input.annualRentIncrease) || 0,
    homeAppreciationRate: Number(input.homeAppreciationRate) || 0,
    years: Number(input.years) || 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent vs Buy Calculator</h1>
        <p className="text-gray-600">Compare the financial implications of renting versus buying a home</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Home Price"
              type="number"
              value={input.homePrice}
              onChange={(value) => setInput({ ...input, homePrice: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="10000"
            />
            <Input
              label="Down Payment (%)"
              type="number"
              value={input.downPaymentPercent}
              onChange={(value) => setInput({ ...input, downPaymentPercent: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="100"
              step="1"
            />
            <Input
              label="Interest Rate (%)"
              type="number"
              value={input.interestRate}
              onChange={(value) => setInput({ ...input, interestRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="15"
              step="0.1"
            />
            <Input
              label="Loan Term (years)"
              type="number"
              value={input.loanTerm}
              onChange={(value) => setInput({ ...input, loanTerm: value === '' ? '' : parseFloat(value) })}
              min="1"
              max="40"
              step="1"
            />
            <Input
              label="Monthly Rent"
              type="number"
              value={input.monthlyRent}
              onChange={(value) => setInput({ ...input, monthlyRent: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Property Tax Rate (%)"
              type="number"
              value={input.propertyTaxRate}
              onChange={(value) => setInput({ ...input, propertyTaxRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="5"
              step="0.1"
            />
            <Input
              label="Home Insurance (Annual)"
              type="number"
              value={input.homeInsuranceAnnual}
              onChange={(value) => setInput({ ...input, homeInsuranceAnnual: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="100"
            />
            <Input
              label="Maintenance (%)"
              type="number"
              value={input.maintenancePercent}
              onChange={(value) => setInput({ ...input, maintenancePercent: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="5"
              step="0.1"
            />
            <Input
              label="Annual Rent Increase (%)"
              type="number"
              value={input.annualRentIncrease}
              onChange={(value) => setInput({ ...input, annualRentIncrease: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="10"
              step="0.1"
            />
            <Input
              label="Home Appreciation Rate (%)"
              type="number"
              value={input.homeAppreciationRate}
              onChange={(value) => setInput({ ...input, homeAppreciationRate: value === '' ? '' : parseFloat(value) })}
              min="0"
              max="10"
              step="0.1"
            />
            <Input
              label="Time Period (years)"
              type="number"
              value={input.years}
              onChange={(value) => setInput({ ...input, years: value === '' ? '' : parseFloat(value) })}
              min="1"
              max="50"
              step="1"
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Comparison</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Rent Paid (over {result.rentMonthlyCost})</p>
                <p className="text-2xl font-bold text-blue-600">${result.totalRentPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Buy Cost</p>
                <p className="text-2xl font-bold text-blue-600">${result.totalBuyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Home Equity Built</p>
                <p className="text-2xl font-bold text-green-600">${result.homeEquity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Net Cost Difference</p>
                <p className={`text-2xl font-bold ${result.netCostDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(result.netCostDifference).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Recommendation</p>
                <p className="text-lg font-semibold text-gray-900">{result.recommendation}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Rent vs Buy Tips</h3>
          <p className="text-sm text-gray-600">
            Consider your personal situation, job stability, and long-term plans when deciding to rent or buy
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Building equity through homeownership can provide long-term wealth, but renting offers flexibility
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator assumes consistent market conditions and doesn't account for tax benefits or selling costs
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Rent vs Buy Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator compares the total financial cost of renting versus buying over a selected time period.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Buying costs include mortgage, property tax, insurance, and maintenance</li>
          <li>Renting accounts for annual rent increases over time</li>
          <li>Home equity is calculated based on appreciation and mortgage principal paydown</li>
          <li>Net cost difference shows which option is financially advantageous</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Rent vs Buy FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What costs are included in buying?</summary>
            <p className="mt-2">Mortgage payments, property taxes, homeowners insurance, and maintenance costs. Not included: closing costs and future selling costs.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does home equity factor in?</summary>
            <p className="mt-2">Home equity is built through mortgage principal paydown and home appreciation. This increases your net worth over time.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What if rent prices decrease?</summary>
            <p className="mt-2">This calculator assumes rent increases annually. Adjust the rent increase percentage to 0 for stable rents.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
          { path: '/down-payment', title: 'Down Payment Calculator', icon: 'attach_money' },
          { path: '/refinance', title: 'Refinance Calculator', icon: 'swap_horiz' },
        ]}
      />
    </div>
  );
}
