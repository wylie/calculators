import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateDiscount } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function DiscountPage() {
  useEffect(() => {
    analytics.trackCalculatorView('discount');
  }, []);
  const [originalPrice, setOriginalPrice] = useStickyState('discount-original-price', '100');
  const [discountPercent, setDiscountPercent] = useStickyState('discount-percent', '20');

  const result = calculateDiscount({
    originalPrice: parseFloat(originalPrice) || 0,
    discountPercent: parseFloat(discountPercent) || 0,
  });

  const handleReset = () => {
    setOriginalPrice('100');
    setDiscountPercent('20');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Discount Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate discount amounts and final prices to understand your savings on purchases.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Purchase Details</h3>

            <Input
              label="Original Price ($)"
              value={originalPrice}
              onChange={setOriginalPrice}
              type="number"
              min="0"
              step="0.01"
            />

            <Input
              label="Discount (%)"
              value={discountPercent}
              onChange={setDiscountPercent}
              type="number"
              min="0"
              max="100"
              step="0.1"
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Discount Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.discountAmount)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Final Price</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(result.finalPrice)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">You Save</p>
                <p className="text-sm font-semibold text-slate-900">
                  {result.savings}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Discount Tips</h3>
          <p className="text-sm text-gray-600">
            Larger discounts don't always mean better deals. Compare final prices across retailers to ensure you're getting the best value.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Common discount ranges are 10-20% for seasonal sales, 30-50% for clearance events, and up to 70% for holiday promotions.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator shows pre-tax prices. Remember to factor in sales tax for your actual total. Some discounts may not apply to tax.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this discount calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This calculator computes the discount amount and final price by applying a percentage discount to an original price.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Discount Amount = Original Price × (Discount % ÷ 100)</li>
          <li>Final Price = Original Price - Discount Amount</li>
          <li>Savings Percent = (Discount Amount ÷ Original Price) × 100</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Discount calculator FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I calculate stacked discounts?</summary>
            <p className="mt-2">Apply the first discount to get a new price, then apply the second discount to that new price. Don't add them together.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How is discount different from markup?</summary>
            <p className="mt-2">Discount reduces the price from the original amount. Markup increases the cost to create the selling price. They use different base amounts in the calculation.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I buy during big sales?</summary>
            <p className="mt-2">Compare the final discounted price to other retailers and consider if you actually need the item. A discount on something you don't need isn't savings.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/percentage-decrease', title: 'Percentage Decrease Calculator', icon: 'trending_down' },
          { path: '/tax', title: 'Tax Calculator', icon: 'balance' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
