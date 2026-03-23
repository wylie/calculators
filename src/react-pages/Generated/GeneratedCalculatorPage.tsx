import { useEffect, useMemo } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import AdSlot from '../../components/AdSlot';
import RelatedTools from '../../components/RelatedTools';
import analytics from '../../utils/analytics';
import type { GeneratedCalculatorConfig, ResultFormat } from './generatedCalculatorData';
import { generatedCalculators, generatedCalculatorBySlug } from './generatedCalculatorData';
import { formatCurrency } from '../../utils/formatting';

interface GeneratedCalculatorPageProps {
  calculatorSlug: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const formatPercent = (value: number): string => `${value.toFixed(2).replace(/\.00$/, '')}%`;

const formatNumber = (value: number): string => value.toLocaleString(undefined, { maximumFractionDigits: 4 });

const formatValue = (value: number | string, format: ResultFormat): string => {
  if (typeof value === 'string') {
    return value;
  }

  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'integer':
      return Math.round(value).toLocaleString();
    case 'number':
      return formatNumber(value);
    case 'duration':
      return String(value);
    case 'date':
      return String(value);
    case 'text':
      return String(value);
    default:
      return String(value);
  }
};

const getDefaultFieldState = (calculator: GeneratedCalculatorConfig): Record<string, string> => {
  return calculator.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.defaultValue;
    return acc;
  }, {});
};

export default function GeneratedCalculatorPage({ calculatorSlug }: GeneratedCalculatorPageProps) {
  const calculator: GeneratedCalculatorConfig | undefined = generatedCalculatorBySlug[calculatorSlug];

  if (!calculator) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Calculator not found</h1>
        <p className="text-slate-600">This calculator could not be loaded. Please return to the previous page and try again.</p>
      </Card>
    );
  }

  const [inputValues, setInputValues] = useStickyState<Record<string, string>>(
    `generated-calculator-${calculator.slug}`,
    getDefaultFieldState(calculator)
  );

  const safeInputValues = useMemo<Record<string, string>>(() => {
    const defaults = getDefaultFieldState(calculator);

    if (!isRecord(inputValues)) {
      return defaults;
    }

    const merged: Record<string, string> = { ...defaults };
    calculator.fields.forEach((field) => {
      const raw = inputValues[field.key];
      if (typeof raw === 'string') {
        merged[field.key] = raw;
      } else if (typeof raw === 'number' && Number.isFinite(raw)) {
        merged[field.key] = String(raw);
      }
    });

    return merged;
  }, [calculator, inputValues]);

  useEffect(() => {
    analytics.trackCalculatorView(calculator.slug);
  }, [calculator.slug]);

  const output = useMemo(() => {
    try {
      const calculated = calculator.calculate(safeInputValues);
      const safeResults = Array.isArray(calculated?.results) ? calculated.results : [];
      const safeTable = calculated?.table
        ? {
            title: calculated.table.title,
            columns: Array.isArray(calculated.table.columns) ? calculated.table.columns : [],
            rows: Array.isArray(calculated.table.rows) ? calculated.table.rows : [],
          }
        : undefined;

      return {
        results: safeResults,
        table: safeTable,
      };
    } catch {
      analytics.trackError(calculator.slug, 'generated_calculation_error');
      return { results: [] as Array<{ key: string; label: string; value: number | string; format: ResultFormat }> };
    }
  }, [calculator, safeInputValues]);

  useEffect(() => {
    if (output.results.length > 0) {
      analytics.trackCalculatorResult(calculator.slug);
    }
  }, [calculator.slug, output]);

  const handleInputChange = (fieldKey: string, value: string) => {
    setInputValues((previous) => ({
      ...(isRecord(previous) ? previous : getDefaultFieldState(calculator)),
      [fieldKey]: value,
    }));
    analytics.trackInputChange(calculator.slug, fieldKey);
  };

  const handleReset = () => {
    setInputValues(getDefaultFieldState(calculator));
    analytics.trackCalculatorReset(calculator.slug);
  };

  const categoryRelated = generatedCalculators
    .filter((item) => item.category === calculator.category && item.slug !== calculator.slug)
    .slice(0, 2)
    .map((item) => ({ path: `/${item.slug}`, title: item.title, icon: item.icon }));

  const relatedTools = [...calculator.relatedTools, ...categoryRelated].slice(0, 4);
  const contextualCategoryLinks = generatedCalculators
    .filter((item) => item.category === calculator.category && item.slug !== calculator.slug)
    .slice(0, 8)
    .map((item) => ({ path: `/${item.slug}`, title: item.title }));
  const sampleInputs = calculator.fields.slice(0, 6).map((field) => ({
    key: field.key,
    label: field.label,
    value: safeInputValues[field.key] ?? field.defaultValue,
  }));
  const sampleResults = output.results.slice(0, 4);

  return (
    <div className="space-y-6" data-calculator-container>
      <section aria-labelledby="calculator-title">
        <h1 id="calculator-title" className="text-3xl font-bold text-slate-900 mb-2">{calculator.title}</h1>
        <p className="text-slate-600">{calculator.description}</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Calculator inputs and results">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Inputs</h2>
            {calculator.fields.map((field) => {
              if (field.type === 'select' && field.options) {
                return (
                  <Select
                    key={field.key}
                    label={field.label}
                    value={safeInputValues[field.key] ?? field.defaultValue}
                    onChange={(value) => handleInputChange(field.key, value)}
                    options={field.options}
                    helpText={field.helpText}
                  />
                );
              }

              return (
                <Input
                  key={field.key}
                  label={field.label}
                  value={safeInputValues[field.key] ?? field.defaultValue}
                  onChange={(value) => handleInputChange(field.key, value)}
                  type={field.type}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  helpText={field.helpText}
                />
              );
            })}

            <button
              type="button"
              data-action="reset"
              onClick={handleReset}
              className="w-full mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Results</h2>
            <div className="space-y-3">
              {output.results.length > 0 ? output.results.map((result) => (
                <div key={result.key} className="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
                  <p className="text-xs text-slate-600">{result.label}</p>
                  <p className="text-xl font-bold text-blue-600">{formatValue(result.value, result.format)}</p>
                </div>
              )) : <p className="text-sm text-slate-600">Results are temporarily unavailable for this input. Try adjusting values or resetting.</p>}
            </div>
          </Card>
          <AdSlot />
        </div>
      </section>

      {output.table && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{output.table.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse" aria-label={output.table.title}>
              <thead>
                <tr className="border-b border-slate-200">
                  {output.table.columns.map((column) => (
                    <th key={column.key} className="py-2 pr-4 font-semibold text-slate-700">{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {output.table.rows.map((row, index) => (
                  <tr key={`${calculator.slug}-row-${index + 1}`} className="border-b border-slate-100">
                    {output.table?.columns.map((column) => (
                      <td key={`${column.key}-${index + 1}`} className="py-2 pr-4 text-slate-700 whitespace-nowrap">
                        {formatValue(row[column.key], column.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <section className="grid md:grid-cols-3 gap-4" aria-label="Tips and notes">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Tips</h3>
          <p className="text-sm text-slate-600">{calculator.tip}</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Facts</h3>
          <p className="text-sm text-slate-600">{calculator.fact}</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Notes</h3>
          <p className="text-sm text-slate-600">{calculator.note}</p>
        </Card>
      </section>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">How this calculator works</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          {(Array.isArray(calculator.howItWorks) ? calculator.howItWorks : []).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4">
          Last updated: February 2026. See our{' '}
          <a href="/methodology" className="text-blue-700 hover:text-blue-800 underline">methodology</a>{' '}
          and{' '}
          <a href="/editorial-policy" className="text-blue-700 hover:text-blue-800 underline">editorial policy</a>.
        </p>
      </Card>

      {sampleResults.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Worked Example</h2>
          <p className="text-sm text-slate-600 mb-3">
            Example using the current inputs:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 mb-2">Inputs</h3>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {sampleInputs.map((input) => (
                  <li key={input.key}>
                    {input.label}: {input.value}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 mb-2">Outputs</h3>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {sampleResults.map((result) => (
                  <li key={result.key}>
                    {result.label}: {formatValue(result.value, result.format)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Assumptions and Limitations</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>{calculator.note}</li>
          <li>Results are estimates and should be validated for high-stakes decisions.</li>
          <li>Inputs are interpreted using standard units and rounding rules for readability.</li>
        </ul>
      </Card>

      {contextualCategoryLinks.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Explore Related {calculator.category} Calculators</h2>
          <p className="text-sm text-slate-600 mb-3">
            Use these related tools for follow-up calculations and scenario planning:
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {contextualCategoryLinks.map((tool) => (
              <a key={tool.path} href={tool.path} className="text-blue-700 hover:text-blue-800 underline">
                {tool.title}
              </a>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">FAQ</h2>
        <div className="space-y-3 text-sm text-slate-700">
          {(Array.isArray(calculator.faqs) ? calculator.faqs : []).map((faq) => (
            <details key={faq.question} className="rounded border border-slate-200 p-3 bg-white">
              <summary className="font-medium cursor-pointer">{faq.question}</summary>
              <p className="mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Card>

      <AdSlot />

      <RelatedTools tools={relatedTools} />
    </div>
  );
}
