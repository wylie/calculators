import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateMortgage } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function MortgagePage() {
  const [homePrice, setHomePrice] = useStickyState('mortgage-home-price', '300000');
  const [downPayment, setDownPayment] = useStickyState('mortgage-down-payment', '60000');
  const [downPaymentIsDollar, setDownPaymentIsDollar] = useStickyState('mortgage-down-payment-dollar', true);
  const [loanTerm, setLoanTerm] = useStickyState('mortgage-loan-term', '30');
  const [interestRate, setInterestRate] = useStickyState('mortgage-interest-rate', '6.5');
  const [propertyTax, setPropertyTax] = useStickyState('mortgage-property-tax', '3600');
  const [homeInsurance, setHomeInsurance] = useStickyState('mortgage-home-insurance', '1200');
  const [pmi, setPmi] = useStickyState('mortgage-pmi', '0');

  const result = calculateMortgage({
    homePrice: parseFloat(homePrice) || 0,
    downPayment: parseFloat(downPayment) || 0,
    downPaymentType: downPaymentIsDollar ? 'dollar' : 'percent',
    loanTerm: parseFloat(loanTerm) || 0,
    interestRate: parseFloat(interestRate) || 0,
    propertyTax: parseFloat(propertyTax) || 0,
    homeInsurance: parseFloat(homeInsurance) || 0,
    pmi: parseFloat(pmi) || 0,
  });

  // Track calculator view on mount
  useEffect(() => {
    analytics.trackCalculatorView('mortgage');
  }, []);

  // Track when results are displayed (after calculation)
  useEffect(() => {
    if (result.monthlyTotal > 0) {
      analytics.trackCalculatorResult('mortgage');
    }
  }, [result]);

  const handleHomePriceChange = (value: string) => {
    setHomePrice(value);
    analytics.trackInputChange('mortgage', 'home_price');
  };

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    analytics.trackInputChange('mortgage', 'down_payment');
  };

  const handleLoanTermChange = (value: string) => {
    setLoanTerm(value);
    analytics.trackInputChange('mortgage', 'loan_term');
  };

  const handleInterestRateChange = (value: string) => {
    setInterestRate(value);
    analytics.trackInputChange('mortgage', 'interest_rate');
  };

  const handlePropertyTaxChange = (value: string) => {
    setPropertyTax(value);
    analytics.trackInputChange('mortgage', 'property_tax');
  };

  const handleHomeInsuranceChange = (value: string) => {
    setHomeInsurance(value);
    analytics.trackInputChange('mortgage', 'home_insurance');
  };

  const handlePmiChange = (value: string) => {
    setPmi(value);
    analytics.trackInputChange('mortgage', 'pmi');
  };

  const handleReset = () => {
    setHomePrice('300000');
    setDownPayment('60000');
    setDownPaymentIsDollar(true);
    setLoanTerm('30');
    setInterestRate('6.5');
    setPropertyTax('3600');
    setHomeInsurance('1200');
    setPmi('0');
    analytics.trackCalculatorReset('mortgage');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Mortgage Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate your monthly mortgage payment and see the total interest paid over the life of the loan.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Loan Details</h3>

            <Input
              label="Home Price ($)"
              value={homePrice}
              onChange={handleHomePriceChange}
              type="number"
              min="0"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Down Payment
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  min="0"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setDownPaymentIsDollar(!downPaymentIsDollar)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-300"
                >
                  {downPaymentIsDollar ? '$' : '%'}
                </button>
              </div>
            </div>

            <Select
              label="Loan Term (years)"
              value={loanTerm}
              onChange={handleLoanTermChange}
              options={[
                { value: '15', label: '15 years' },
                { value: '20', label: '20 years' },
                { value: '30', label: '30 years' },
              ]}
            />

            <Input
              label="Interest Rate (APR %)"
              value={interestRate}
              onChange={handleInterestRateChange}
              type="number"
              min="0"
              step="0.1"
            />

            <h3 className="text-lg font-semibold text-slate-900 my-4">Optional Costs</h3>

            <Input
              label="Annual Property Tax ($)"
              value={propertyTax}
              onChange={handlePropertyTaxChange}
              type="number"
              min="0"
            />

            <Input
              label="Annual Home Insurance ($)"
              value={homeInsurance}
              onChange={handleHomeInsuranceChange}
              type="number"
              min="0"
            />

            <Input
              label="Monthly PMI ($)"
              value={pmi}
              onChange={handlePmiChange}
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
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Monthly P&I</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.monthlyPI)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Monthly Total</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(result.monthlyTotal)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Loan Amount</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(result.loanAmount)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Total Interest</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">First Month</p>
                <p className="text-xs text-slate-700">
                  Interest: {formatCurrency(result.firstMonthInterest)}
                </p>
                <p className="text-xs text-slate-700">
                  Principal: {formatCurrency(result.firstMonthPrincipal)}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Mortgage Tip</h3>
          <p className="text-sm text-gray-600">
            Putting down 20% or more helps you avoid PMI (Private Mortgage Insurance)
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average mortgages run 30 years at 6-8% APR depending on market conditions
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator shows P&I only. Add property taxes, insurance, and HOA fees
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this mortgage calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This tool uses a standard amortization approach to estimate monthly principal and interest. It then adds
          optional monthly costs for property tax, home insurance, and PMI to show your total estimated monthly payment.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Loan amount = home price minus down payment</li>
          <li>Monthly P&amp;I is based on APR and loan term</li>
          <li>Monthly total includes optional tax, insurance, and PMI</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Mortgage calculator FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How is monthly mortgage payment calculated?</summary>
            <p className="mt-2">Monthly principal and interest are calculated using the loan amount, APR, and term. Optional costs are added after that.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this include taxes and insurance?</summary>
            <p className="mt-2">Yes. Enter annual property tax and insurance to include them as monthly amounts in the total estimate.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I use percent or dollar down payment?</summary>
            <p className="mt-2">Yes. Use the toggle beside the down-payment input to switch between $ and % modes.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/refinance', title: 'Refinance Calculator', icon: 'build' },
          { path: '/down-payment', title: 'Down Payment Calculator', icon: 'trending_down' },
          { path: '/auto-loan', title: 'Auto Loan Calculator', icon: 'directions_car' },
          { path: '/credit-card-payoff', title: 'Credit Card Payoff', icon: 'credit_card' },
        ]}
      />
    </div>
  );
}
