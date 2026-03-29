import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { formatNumber } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function PercentagePage() {
  useEffect(() => {
    analytics.trackCalculatorView('percentage');
  }, []);
  const [baseValue, setBaseValue] = useStickyState('percent-base', '200');
  const [percent, setPercent] = useStickyState('percent-value', '15');
  const [decimal, setDecimal] = useStickyState('percent-decimal', '0.15');

  const numericBase = parseFloat(baseValue) || 0;
  const numericPercent = parseFloat(percent) || 0;
  const numericDecimal = parseFloat(decimal) || 0;

  const percentOf = (numericBase * numericPercent) / 100;
  const percentToDecimal = numericPercent / 100;
  const decimalToPercent = numericDecimal * 100;

  const handleReset = () => {
    setBaseValue('200');
    setPercent('15');
    setDecimal('0.15');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Percentage Converter</h1>
      <p className="text-slate-600 mb-6">
        Calculate percentage of a number and convert between percent and decimal.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inputs</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Value"
                value={baseValue}
                onChange={setBaseValue}
                type="number"
                step="0.01"
              />
              <Input
                label="Percent (%)"
                value={percent}
                onChange={setPercent}
                type="number"
                step="0.01"
              />
            </div>

            <div className="mt-6">
              <Input
                label="Decimal (for percent conversion)"
                value={decimal}
                onChange={setDecimal}
                type="number"
                step="0.001"
              />
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
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600">Percent of Value</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(percentOf, 2)}</p>
              </div>
              <div className="text-center border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Percent to Decimal</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(percentToDecimal, 4)}</p>
              </div>
              <div className="text-center border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Decimal to Percent</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(decimalToPercent, 2)}%</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div><Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this percentage converter works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This tool handles three related tasks: finding a percentage of a value, converting percent to decimal,
          and converting decimal to percent.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Percent of value = base × percent ÷ 100</li>
          <li>Percent to decimal = percent ÷ 100</li>
          <li>Decimal to percent = decimal × 100</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Percentage converter FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I find 15% of 200?</summary>
            <p className="mt-2">Multiply 200 by 15 and divide by 100, giving 30.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What is 0.15 as a percent?</summary>
            <p className="mt-2">Multiply by 100, so 0.15 equals 15%.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/interest', title: 'Interest Calculator', icon: 'percent' },
          { path: '/compound-interest', title: 'Compound Interest', icon: 'trending_up' },
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'fastfood' },
        ]}
      />
    </div>
  );
}
