import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import analytics from '../../utils/analytics';

const FRACTION_CHAR_MAP: Record<string, string> = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
};

const parseAmount = (rawValue: string): number => {
  const normalized = rawValue
    .trim()
    .replace(/[¼½¾⅓⅔⅛⅜⅝⅞]/g, (fractionChar) => FRACTION_CHAR_MAP[fractionChar] ?? fractionChar)
    .replace(/\s+/g, ' ');

  if (!normalized) return 0;

  if (/^\d*\.?\d+$/.test(normalized)) {
    const numeric = Number.parseFloat(normalized);
    return Number.isFinite(numeric) ? numeric : Number.NaN;
  }

  const mixedMatch = normalized.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number.parseFloat(mixedMatch[1]);
    const numerator = Number.parseFloat(mixedMatch[2]);
    const denominator = Number.parseFloat(mixedMatch[3]);
    if (denominator === 0) return Number.NaN;
    return whole + numerator / denominator;
  }

  const fractionMatch = normalized.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = Number.parseFloat(fractionMatch[1]);
    const denominator = Number.parseFloat(fractionMatch[2]);
    if (denominator === 0) return Number.NaN;
    return numerator / denominator;
  }

  return Number.NaN;
};

type CookingUnit = 'cups' | 'tbsp' | 'tsp' | 'ml' | 'flOz';

const unitToMl: Record<CookingUnit, number> = {
  cups: 236.588,
  tbsp: 14.7868,
  tsp: 4.92892,
  ml: 1,
  flOz: 29.5735,
};

const formatValue = (value: number): string => {
  if (Math.abs(value) >= 100) return value.toFixed(1);
  if (Math.abs(value) >= 10) return value.toFixed(2);
  return value.toFixed(3).replace(/\.?0+$/, '');
};

const FRIENDLY_FRACTIONS: Array<{ value: number; label: string }> = [
  { value: 1 / 8, label: '1/8' },
  { value: 1 / 6, label: '1/6' },
  { value: 1 / 5, label: '1/5' },
  { value: 1 / 4, label: '1/4' },
  { value: 1 / 3, label: '1/3' },
  { value: 3 / 8, label: '3/8' },
  { value: 2 / 5, label: '2/5' },
  { value: 1 / 2, label: '1/2' },
  { value: 3 / 5, label: '3/5' },
  { value: 5 / 8, label: '5/8' },
  { value: 2 / 3, label: '2/3' },
  { value: 3 / 4, label: '3/4' },
  { value: 4 / 5, label: '4/5' },
  { value: 5 / 6, label: '5/6' },
  { value: 7 / 8, label: '7/8' },
];

const formatKitchenAmount = (value: number): string => {
  const absoluteValue = Math.abs(value);
  if (!Number.isFinite(absoluteValue)) return '0';
  if (absoluteValue === 0) return '0';

  const sign = value < 0 ? '-' : '';
  const whole = Math.floor(absoluteValue);
  const fractional = absoluteValue - whole;

  let closestFraction = FRIENDLY_FRACTIONS[0];
  let smallestDifference = Math.abs(fractional - closestFraction.value);

  for (const fraction of FRIENDLY_FRACTIONS) {
    const difference = Math.abs(fractional - fraction.value);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestFraction = fraction;
    }
  }

  if (fractional < 0.02) {
    return `${sign}${whole}`;
  }

  if (1 - fractional < 0.02) {
    return `${sign}${whole + 1}`;
  }

  if (smallestDifference <= 0.02) {
    if (whole === 0) {
      return `${sign}${closestFraction.label}`;
    }
    return `${sign}${whole} ${closestFraction.label}`;
  }

  return `${sign}${formatValue(absoluteValue)}`;
};

const FRACTION_GLYPH_MAP: Record<string, string> = {
  '1/8': '⅛',
  '1/4': '¼',
  '3/8': '⅜',
  '1/2': '½',
  '5/8': '⅝',
  '3/4': '¾',
  '7/8': '⅞',
  '1/3': '⅓',
  '2/3': '⅔',
};

const prettifyFractionDisplay = (value: string): string => {
  const trimmedValue = value.trim();
  const mixedMatch = trimmedValue.match(/^(-?\d+)\s+(\d+\/\d+)$/);
  if (mixedMatch) {
    const whole = mixedMatch[1];
    const fraction = mixedMatch[2];
    const glyph = FRACTION_GLYPH_MAP[fraction];
    if (glyph) {
      return `${whole}${glyph}`;
    }
    return trimmedValue;
  }

  const glyph = FRACTION_GLYPH_MAP[trimmedValue];
  if (glyph) {
    return glyph;
  }

  return trimmedValue;
};

export default function CookingConverterPage() {
  useEffect(() => {
    analytics.trackCalculatorView('cooking-converter');
  }, []);
  const [value, setValue] = useStickyState('cookingConverter-value', '1');
  const [fromUnit, setFromUnit] = useStickyState<CookingUnit>('cookingConverter-unit', 'cups');
  const [toUnit, setToUnit] = useStickyState<CookingUnit>('cookingConverter-toUnit', 'tbsp');

  const parsedValue = parseAmount(value);
  const hasValueError = value.trim().length > 0 && Number.isNaN(parsedValue);
  const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0;
  const converted = (safeValue * unitToMl[fromUnit]) / unitToMl[toUnit];
  const friendlyInput = prettifyFractionDisplay(formatKitchenAmount(safeValue));
  const friendlyOutput = prettifyFractionDisplay(formatKitchenAmount(converted));

  const unitLabels: Record<string, string> = {
    cups: 'cups',
    tbsp: 'tbsp',
    tsp: 'tsp',
    ml: 'ml',
    flOz: 'fl oz',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cooking Converter</h1>
        <p className="text-gray-600">Convert common kitchen measurements quickly, like cups to tablespoons</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion</h3>
          <div className="space-y-4">
            <Input
              label="Amount"
              value={value}
              onChange={setValue}
              type="text"
              placeholder="e.g. 1/4, 0.5, 2"
              helpText="Supports decimals and fractions (example: 1/4 or 1 1/2)"
              error={hasValueError ? 'Enter a valid number or fraction (for example: 1/4)' : ''}
            />
            <Select
              label="From Unit"
              value={fromUnit}
              onChange={(val) => setFromUnit(val as CookingUnit)}
              options={[
                { value: 'cups', label: 'Cups' },
                { value: 'tbsp', label: 'Tablespoons (tbsp)' },
                { value: 'tsp', label: 'Teaspoons (tsp)' },
                { value: 'ml', label: 'Milliliters (ml)' },
                { value: 'flOz', label: 'Fluid Ounces (fl oz)' },
              ]}
            />
            <Select
              label="To Unit"
              value={toUnit}
              onChange={(val) => setToUnit(val as CookingUnit)}
              options={[
                { value: 'cups', label: 'Cups' },
                { value: 'tbsp', label: 'Tablespoons (tbsp)' },
                { value: 'tsp', label: 'Teaspoons (tsp)' },
                { value: 'ml', label: 'Milliliters (ml)' },
                { value: 'flOz', label: 'Fluid Ounces (fl oz)' },
              ]}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Result</h3>
            <div className="rounded border border-blue-300 bg-white p-4">
              <p className="text-sm text-gray-600 mb-1">You need</p>
              <p className="text-2xl font-bold text-blue-700">
                {friendlyOutput} {unitLabels[toUnit]}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                for {friendlyInput} {unitLabels[fromUnit]}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {friendlyInput} {unitLabels[fromUnit]} = {friendlyOutput} {unitLabels[toUnit]}
              </p>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Cooking Tips</h3>
          <p className="text-sm text-gray-600">
            For quick swaps, remember: 1 cup = 16 tbsp and 1 tbsp = 3 tsp
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Use this when a recipe calls for one unit and your tools are labeled in another
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Cooking Converter Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          Enter an amount, pick the unit you have, then choose the unit your recipe needs.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>1 cup = 237 ml = 8 fl oz</li>
          <li>1 cup = 16 tbsp</li>
          <li>1 tbsp = 3 tsp</li>
          <li>Supports fractions like 1/4 and mixed numbers like 1 1/2</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Cooking Converter FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How many tablespoons are in 1/4 cup?</summary>
            <p className="mt-2">1/4 cup equals 4 tablespoons.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Can I enter fractions?</summary>
            <p className="mt-2">Yes. You can enter values like 1/4, 1/2, and 1 1/2.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does this use volume or weight?</summary>
            <p className="mt-2">This converter is focused on kitchen volume units (cups, tablespoons, teaspoons, milliliters, and fluid ounces).</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
          { path: '/power-converter', title: 'Power Converter', icon: 'flash_on' },
          { path: '/weight', title: 'Weight Converter', icon: 'fitness_center' },
        ]}
      />
    </div>
  );
}
