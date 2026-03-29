/**
 * TEMPLATE: Analytics-Enabled Calculator Component
 * 
 * Copy this template and customize for your calculator.
 * Replace CALCULATOR_NAME and field names as needed.
 * 
 * See ANALYTICS_IMPLEMENTATION_GUIDE.md for detailed instructions.
 */

import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import analytics from '../../utils/analytics';

export default function YourCalculatorName() {
  // ========================
  // 1. STATE MANAGEMENT
  // ========================
  
  const [input1, setInput1] = useStickyState('your-calculator-input1', 'default_value');
  const [input2, setInput2] = useStickyState('your-calculator-input2', 'default_value');
  // ... add more state as needed

  // ========================
  // 2. ANALYTICS TRACKING
  // ========================

  // Track page view on mount
  useEffect(() => {
    analytics.trackCalculatorView('your-calculator-name');
  }, []);

  // Track input changes (wrap all input handlers)
  const handleInput1Change = (value: string) => {
    setInput1(value);
    analytics.trackInputChange('your-calculator-name', 'input_1_field_name');
  };

  const handleInput2Change = (value: string) => {
    setInput2(value);
    analytics.trackInputChange('your-calculator-name', 'input_2_field_name');
  };

  // Track results when they change
  useEffect(() => {
    if (result) {
      analytics.trackCalculatorResult('your-calculator-name');
    }
  }, [result]);

  // Track reset
  const handleReset = () => {
    setInput1('default_value');
    setInput2('default_value');
    analytics.trackCalculatorReset('your-calculator-name');
  };

  // ========================
  // 3. CALCULATIONS (no changes)
  // ========================

  const result = performCalculation(input1, input2);

  // ========================
  // 4. JSX (with analytics-wrapped handlers)
  // ========================

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Calculator Title</h1>
      <p className="text-slate-600 mb-6">Brief description of what the calculator does.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inputs</h3>

            <Input
              label="Input 1 Label"
              value={input1}
              onChange={handleInput1Change}
              type="number"
              min="0"
            />

            <Input
              label="Input 2 Label"
              value={input2}
              onChange={handleInput2Change}
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
            {result && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Result Label</p>
                  <p className="text-2xl font-bold text-blue-600">{result.displayValue}</p>
                </div>
              </div>
            )}
          </Card>
          <SupportSidebar />
        </div>
      </div>
    </div>
  );
}

// ========================
// MINIMAL SETUP (copy any of this comment out if not needed)
// ========================

/*
✓ Lines to keep:
  - Import useEffect: Line 9
  - Import analytics: Line 14
  - useEffect for trackCalculatorView: Line 31-33
  - Helper functions with analytics.trackInputChange: Line 35-43
  - useEffect for trackCalculatorResult: Line 45-50
  - handleReset with analytics.trackCalculatorReset: Line 52-57
  - Input onChange handlers changed to wrapped versions: Line 82, 88

✓ Lines to customize:
  - Component name: Line 16
  - useStickyState calls: Line 20-21
  - Calculator name in all analytics calls: 'your-calculator-name'
  - Input field names in analytics: 'input_1_field_name', etc.
  - JSX content: Everything in return statement

✓ For event delegation (simpler):
  Replace all the tracking code with just:

  useEffect(() => {
    analytics.enableEventDelegation('your-calculator-name');
  }, []);

  Then add data attributes to HTML:
  - data-calculator-container on form wrapper
  - data-action="calculate" on calculate button
  - data-action="reset" on reset button
  - data-field-name="field_name" on inputs
*/
