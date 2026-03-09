export type GeneratedCalculatorCategory = 'income' | 'loans' | 'percentages' | 'health' | 'home' | 'time' | 'outdoors' | 'savings' | 'converters';

export type FieldType = 'number' | 'select' | 'date' | 'datetime-local' | 'time';

export interface CalculatorField {
  key: string;
  label: string;
  type: FieldType;
  defaultValue: string;
  min?: string;
  max?: string;
  step?: string;
  helpText?: string;
  options?: Array<{ value: string; label: string }>;
}

export type ResultFormat = 'currency' | 'percent' | 'number' | 'integer' | 'text' | 'duration' | 'date';

export interface CalculatorResult {
  key: string;
  label: string;
  value: number | string;
  format: ResultFormat;
}

export interface CalculatorTable {
  title: string;
  columns: Array<{ key: string; label: string; format: ResultFormat }>;
  rows: Array<Record<string, number | string>>;
}

export interface CalculatorOutput {
  results: CalculatorResult[];
  table?: CalculatorTable;
}

export interface GeneratedCalculatorConfig {
  slug: string;
  title: string;
  description: string;
  category: GeneratedCalculatorCategory;
  icon: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, string>) => CalculatorOutput;
  howItWorks: string[];
  tip: string;
  fact: string;
  note: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ path: string; title: string; icon: string }>;
}

const parseNumber = (value: string, fallback = 0): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, minValue: number, maxValue: number): number => {
  return Math.max(minValue, Math.min(maxValue, value));
};

const roundTo = (value: number, digits = 2): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const amortizedMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate <= 0) return principal / months;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
};

const calculateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  months: number,
  extraPayment = 0
): { payment: number; totalInterest: number; totalPaid: number; schedule: Array<Record<string, number>> } => {
  const payment = amortizedMonthlyPayment(principal, annualRate, months);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let period = 0;
  const schedule: Array<Record<string, number>> = [];

  while (balance > 0.01 && period < months + 600) {
    period += 1;
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    let principalPaid = payment - interest + extraPayment;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    const monthlyPaid = principalPaid + interest;
    balance -= principalPaid;
    totalInterest += interest;
    totalPaid += monthlyPaid;

    schedule.push({
      month: period,
      payment: roundTo(monthlyPaid),
      principal: roundTo(principalPaid),
      interest: roundTo(interest),
      balance: roundTo(Math.max(balance, 0)),
    });

    if (period > months + 5000) break;
  }

  return {
    payment: roundTo(payment),
    totalInterest: roundTo(totalInterest),
    totalPaid: roundTo(totalPaid),
    schedule,
  };
};

const diffDays = (start: Date, end: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((utcEnd - utcStart) / msPerDay);
};

const parseTimeToMinutes = (timeValue: string): number => {
  const [hours, minutes] = timeValue.split(':').map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
};

const formatDurationMinutes = (minutesInput: number): string => {
  const totalMinutes = Math.max(0, Math.round(minutesInput));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const getIsoWeek = (date: Date): { week: number; year: number } => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: target.getUTCFullYear() };
};

const gcd = (a: number, b: number): number => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

const makeStandardContent = (title: string): Pick<GeneratedCalculatorConfig, 'howItWorks' | 'tip' | 'fact' | 'note' | 'faqs'> => ({
  howItWorks: [
    `${title} uses your inputs and standard math formulas to compute the results instantly.`,
    'Edit any field to see updated values right away and compare scenarios.',
    'Use these estimates for planning, then confirm final numbers with your lender, employer, or provider when needed.',
  ],
  tip: 'Try multiple scenarios to compare outcomes before making decisions.',
  fact: 'Small changes in rates, percentages, or timelines can have a large compounding effect.',
  note: 'Results are educational estimates and may differ from official statements.',
  faqs: [
    {
      question: `How accurate is this ${title.toLowerCase()}?`,
      answer: 'It follows standard formulas and provides practical estimates for quick planning.',
    },
    {
      question: 'Can I use this on mobile?',
      answer: 'Yes. The calculator is optimized for mobile, tablet, and desktop use.',
    },
    {
      question: 'Are my values saved?',
      answer: 'Inputs are stored locally in your browser to improve convenience on return visits.',
    },
  ],
});

const CATEGORY_RELATED: Record<GeneratedCalculatorCategory, Array<{ path: string; title: string; icon: string }>> = {
  income: [
    { path: '/salary-hourly', title: 'Salary / Hourly Converter', icon: 'schedule' },
    { path: '/tax', title: 'Tax Calculator', icon: 'receipt_long' },
    { path: '/budget', title: 'Budget Calculator', icon: 'wallet' },
  ],
  loans: [
    { path: '/loan', title: 'Loan Calculator', icon: 'request_quote' },
    { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
    { path: '/refinance', title: 'Refinance Calculator', icon: 'gavel' },
  ],
  percentages: [
    { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
    { path: '/percent-change', title: 'Percent Change Calculator', icon: 'compare_arrows' },
    { path: '/discount', title: 'Discount Calculator', icon: 'local_offer' },
  ],
  health: [
    { path: '/calories', title: 'Calorie Calculator', icon: 'nutrition' },
    { path: '/bmi', title: 'BMI Calculator', icon: 'monitor_weight' },
    { path: '/tdee', title: 'TDEE Calculator', icon: 'local_fire_department' },
  ],
  home: [
    { path: '/mortgage', title: 'Mortgage Calculator', icon: 'home' },
    { path: '/down-payment', title: 'Down Payment Calculator', icon: 'attach_money' },
    { path: '/rent-vs-buy', title: 'Rent vs Buy Calculator', icon: 'real_estate_agent' },
  ],
  time: [
    { path: '/time', title: 'Time Converter', icon: 'schedule' },
    { path: '/time-duration', title: 'Time Duration Calculator', icon: 'timer' },
    { path: '/date-difference', title: 'Date Difference Calculator', icon: 'event' },
  ],
  outdoors: [
    { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
    { path: '/cycling-power-to-weight', title: 'Cycling Power-to-Weight', icon: 'speed' },
    { path: '/hiking-pace', title: 'Hiking Pace Calculator', icon: 'hiking' },
  ],
  savings: [
    { path: '/compound-interest', title: 'Compound Interest Calculator', icon: 'trending_up' },
    { path: '/investment-growth', title: 'Investment Growth Calculator', icon: 'show_chart' },
    { path: '/retirement', title: 'Retirement Calculator', icon: 'savings' },
  ],
  converters: [
    { path: '/weather', title: 'Temperature Converter', icon: 'thermostat' },
    { path: '/speed', title: 'Speed Converter', icon: 'speed' },
    { path: '/power-converter', title: 'Power Converter', icon: 'bolt' },
  ],
};

const baseGeneratedCalculators: Omit<GeneratedCalculatorConfig, 'relatedTools' | 'howItWorks' | 'tip' | 'fact' | 'note' | 'faqs'>[] = [
  {
    slug: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index (BMI) and see your weight category.',
    category: 'health',
    icon: 'monitor_weight',
    fields: [
      { key: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: '70', min: '1', step: '0.1' },
      { key: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: '175', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const weightKg = parseNumber(values.weightKg);
      const heightCm = parseNumber(values.heightCm);
      const heightM = heightCm / 100;
      const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
      let category = 'Unknown';
      if (bmi > 0) {
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
      }
      return {
        results: [
          { key: 'bmi', label: 'BMI', value: roundTo(bmi, 2), format: 'number' },
          { key: 'category', label: 'Weight Category', value: category, format: 'text' },
        ],
      };
    },
  },
  {
    slug: 'hourly-to-salary',
    title: 'Hourly to Salary Calculator',
    description: 'Convert hourly wage to annual, monthly, and weekly salary estimates.',
    category: 'income',
    icon: 'schedule',
    fields: [
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: '25', min: '0', step: '0.01' },
      { key: 'hoursPerWeek', label: 'Hours Per Week', type: 'number', defaultValue: '40', min: '1', step: '0.5' },
      { key: 'weeksPerYear', label: 'Weeks Per Year', type: 'number', defaultValue: '52', min: '1', max: '52', step: '1' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursPerWeek = parseNumber(values.hoursPerWeek, 40);
      const weeksPerYear = parseNumber(values.weeksPerYear, 52);
      const annualSalary = hourlyRate * hoursPerWeek * weeksPerYear;
      return {
        results: [
          { key: 'annualSalary', label: 'Annual Salary', value: roundTo(annualSalary), format: 'currency' },
          { key: 'monthlyIncome', label: 'Monthly Income', value: roundTo(annualSalary / 12), format: 'currency' },
          { key: 'weeklyIncome', label: 'Weekly Income', value: roundTo(annualSalary / weeksPerYear), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'overtime-pay',
    title: 'Overtime Pay Calculator',
    description: 'Estimate regular pay, overtime pay, and total pay for a pay period.',
    category: 'income',
    icon: 'payments',
    fields: [
      { key: 'hourlyRate', label: 'Base Hourly Rate ($)', type: 'number', defaultValue: '22', min: '0', step: '0.01' },
      { key: 'hoursWorked', label: 'Hours Worked', type: 'number', defaultValue: '46', min: '0', step: '0.25' },
      { key: 'regularHours', label: 'Regular Hours Threshold', type: 'number', defaultValue: '40', min: '0', step: '0.25' },
      { key: 'multiplier', label: 'Overtime Multiplier', type: 'number', defaultValue: '1.5', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursWorked = parseNumber(values.hoursWorked);
      const regularHoursThreshold = parseNumber(values.regularHours, 40);
      const multiplier = parseNumber(values.multiplier, 1.5);
      const regularHours = Math.min(hoursWorked, regularHoursThreshold);
      const overtimeHours = Math.max(0, hoursWorked - regularHoursThreshold);
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * multiplier;
      const totalPay = regularPay + overtimePay;
      const effectiveRate = hoursWorked > 0 ? totalPay / hoursWorked : 0;
      return {
        results: [
          { key: 'regularPay', label: 'Regular Pay', value: roundTo(regularPay), format: 'currency' },
          { key: 'overtimePay', label: 'Overtime Pay', value: roundTo(overtimePay), format: 'currency' },
          { key: 'totalPay', label: 'Total Pay', value: roundTo(totalPay), format: 'currency' },
          { key: 'effectiveRate', label: 'Effective Hourly Rate', value: roundTo(effectiveRate), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'take-home-pay',
    title: 'Take-Home Pay Calculator',
    description: 'Estimate net pay after taxes and deductions for common pay periods.',
    category: 'income',
    icon: 'account_balance_wallet',
    fields: [
      {
        key: 'payPeriod',
        label: 'Pay Period',
        type: 'select',
        defaultValue: 'annual',
        options: [
          { value: 'annual', label: 'Annual' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'biweekly', label: 'Biweekly' },
          { value: 'weekly', label: 'Weekly' },
        ],
      },
      { key: 'grossPay', label: 'Gross Pay ($)', type: 'number', defaultValue: '72000', min: '0', step: '0.01' },
      { key: 'federalTaxRate', label: 'Federal Tax (%)', type: 'number', defaultValue: '12', min: '0', max: '50', step: '0.1' },
      { key: 'stateTaxRate', label: 'State Tax (%)', type: 'number', defaultValue: '5', min: '0', max: '20', step: '0.1' },
      { key: 'ficaRate', label: 'FICA (%)', type: 'number', defaultValue: '7.65', min: '0', max: '20', step: '0.01' },
      { key: 'otherDeductions', label: 'Other Annual Deductions ($)', type: 'number', defaultValue: '3000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const period = values.payPeriod;
      const grossInput = parseNumber(values.grossPay);
      const annualGross =
        period === 'monthly' ? grossInput * 12 : period === 'biweekly' ? grossInput * 26 : period === 'weekly' ? grossInput * 52 : grossInput;
      const rateTotal = parseNumber(values.federalTaxRate) + parseNumber(values.stateTaxRate) + parseNumber(values.ficaRate);
      const taxAmount = annualGross * (rateTotal / 100);
      const deductions = parseNumber(values.otherDeductions);
      const annualNet = Math.max(0, annualGross - taxAmount - deductions);
      const monthlyNet = annualNet / 12;
      const biweeklyNet = annualNet / 26;
      const weeklyNet = annualNet / 52;
      return {
        results: [
          { key: 'annualNet', label: 'Estimated Annual Take-Home', value: roundTo(annualNet), format: 'currency' },
          { key: 'monthlyNet', label: 'Estimated Monthly Take-Home', value: roundTo(monthlyNet), format: 'currency' },
          { key: 'biweeklyNet', label: 'Estimated Biweekly Take-Home', value: roundTo(biweeklyNet), format: 'currency' },
          { key: 'weeklyNet', label: 'Estimated Weekly Take-Home', value: roundTo(weeklyNet), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'after-tax-salary',
    title: 'After-Tax Salary Calculator',
    description: 'Estimate after-tax income from annual salary and effective tax rate.',
    category: 'income',
    icon: 'receipt_long',
    fields: [
      { key: 'salary', label: 'Gross Annual Salary ($)', type: 'number', defaultValue: '85000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', defaultValue: '24', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const salary = parseNumber(values.salary);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const taxes = salary * (taxRate / 100);
      const net = salary - taxes;
      return {
        results: [
          { key: 'netAnnual', label: 'After-Tax Annual Income', value: roundTo(net), format: 'currency' },
          { key: 'netMonthly', label: 'After-Tax Monthly Income', value: roundTo(net / 12), format: 'currency' },
          { key: 'taxes', label: 'Estimated Taxes Paid', value: roundTo(taxes), format: 'currency' },
          { key: 'retention', label: 'Income Kept', value: roundTo(100 - taxRate), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'pay-raise',
    title: 'Pay Raise Calculator',
    description: 'Calculate the value of a raise in annual, monthly, and hourly terms.',
    category: 'income',
    icon: 'trending_up',
    fields: [
      { key: 'currentSalary', label: 'Current Salary ($)', type: 'number', defaultValue: '70000', min: '0', step: '0.01' },
      { key: 'raisePercent', label: 'Raise (%)', type: 'number', defaultValue: '5', min: '0', step: '0.1' },
      { key: 'hoursPerWeek', label: 'Hours Per Week', type: 'number', defaultValue: '40', min: '1', step: '0.5' },
      { key: 'weeksPerYear', label: 'Weeks Per Year', type: 'number', defaultValue: '52', min: '1', max: '52', step: '1' },
    ],
    calculate: (values) => {
      const currentSalary = parseNumber(values.currentSalary);
      const raisePercent = parseNumber(values.raisePercent);
      const hoursPerWeek = parseNumber(values.hoursPerWeek, 40);
      const weeksPerYear = parseNumber(values.weeksPerYear, 52);
      const raiseAmount = currentSalary * (raisePercent / 100);
      const newSalary = currentSalary + raiseAmount;
      const hourlyIncrease = hoursPerWeek * weeksPerYear > 0 ? raiseAmount / (hoursPerWeek * weeksPerYear) : 0;
      return {
        results: [
          { key: 'raiseAmount', label: 'Annual Raise Amount', value: roundTo(raiseAmount), format: 'currency' },
          { key: 'newSalary', label: 'New Annual Salary', value: roundTo(newSalary), format: 'currency' },
          { key: 'monthlyIncrease', label: 'Monthly Increase', value: roundTo(raiseAmount / 12), format: 'currency' },
          { key: 'hourlyIncrease', label: 'Hourly Increase', value: roundTo(hourlyIncrease), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'annual-income',
    title: 'Annual Income Calculator',
    description: 'Estimate annual income from pay rate, schedule, and extra earnings.',
    category: 'income',
    icon: 'calendar_month',
    fields: [
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: '30', min: '0', step: '0.01' },
      { key: 'hoursPerWeek', label: 'Hours Per Week', type: 'number', defaultValue: '40', min: '0', step: '0.5' },
      { key: 'weeksPerYear', label: 'Weeks Per Year', type: 'number', defaultValue: '50', min: '1', max: '52', step: '1' },
      { key: 'bonus', label: 'Annual Bonus ($)', type: 'number', defaultValue: '4000', min: '0', step: '0.01' },
      { key: 'otherIncome', label: 'Other Annual Income ($)', type: 'number', defaultValue: '1200', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursPerWeek = parseNumber(values.hoursPerWeek);
      const weeksPerYear = parseNumber(values.weeksPerYear, 50);
      const baseAnnual = hourlyRate * hoursPerWeek * weeksPerYear;
      const totalAnnual = baseAnnual + parseNumber(values.bonus) + parseNumber(values.otherIncome);
      return {
        results: [
          { key: 'baseAnnual', label: 'Base Annual Income', value: roundTo(baseAnnual), format: 'currency' },
          { key: 'totalAnnual', label: 'Total Annual Income', value: roundTo(totalAnnual), format: 'currency' },
          { key: 'monthlyAverage', label: 'Average Monthly Income', value: roundTo(totalAnnual / 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'biweekly-pay',
    title: 'Biweekly Pay Calculator',
    description: 'Convert salary to biweekly pay and estimate take-home per paycheck.',
    category: 'income',
    icon: 'event_repeat',
    fields: [
      { key: 'annualSalary', label: 'Annual Salary ($)', type: 'number', defaultValue: '78000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Total Tax Rate (%)', type: 'number', defaultValue: '22', min: '0', max: '60', step: '0.1' },
      { key: 'deductions', label: 'Other Deductions Per Check ($)', type: 'number', defaultValue: '75', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const annualSalary = parseNumber(values.annualSalary);
      const grossBiweekly = annualSalary / 26;
      const taxes = grossBiweekly * (parseNumber(values.taxRate) / 100);
      const netBiweekly = Math.max(0, grossBiweekly - taxes - parseNumber(values.deductions));
      return {
        results: [
          { key: 'grossBiweekly', label: 'Gross Biweekly Pay', value: roundTo(grossBiweekly), format: 'currency' },
          { key: 'netBiweekly', label: 'Estimated Net Biweekly Pay', value: roundTo(netBiweekly), format: 'currency' },
          { key: 'monthlyNet', label: 'Estimated Monthly Net Pay', value: roundTo(netBiweekly * 26 / 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'monthly-income',
    title: 'Monthly Income Calculator',
    description: 'Estimate gross and net monthly income from annual earnings.',
    category: 'income',
    icon: 'calendar_view_month',
    fields: [
      { key: 'annualSalary', label: 'Annual Salary ($)', type: 'number', defaultValue: '84000', min: '0', step: '0.01' },
      { key: 'bonus', label: 'Annual Bonus ($)', type: 'number', defaultValue: '6000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', defaultValue: '23', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const annualGross = parseNumber(values.annualSalary) + parseNumber(values.bonus);
      const monthlyGross = annualGross / 12;
      const monthlyNet = monthlyGross * (1 - parseNumber(values.taxRate) / 100);
      return {
        results: [
          { key: 'monthlyGross', label: 'Gross Monthly Income', value: roundTo(monthlyGross), format: 'currency' },
          { key: 'monthlyNet', label: 'Estimated Net Monthly Income', value: roundTo(monthlyNet), format: 'currency' },
          { key: 'annualGross', label: 'Gross Annual Income', value: roundTo(annualGross), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'self-employment-tax',
    title: 'Self-Employment Tax Calculator',
    description: 'Estimate self-employment tax and deductible half for planning.',
    category: 'income',
    icon: 'work',
    fields: [
      { key: 'netEarnings', label: 'Net Self-Employment Earnings ($)', type: 'number', defaultValue: '90000', min: '0', step: '0.01' },
      { key: 'seTaxRate', label: 'Self-Employment Tax Rate (%)', type: 'number', defaultValue: '15.3', min: '0', max: '30', step: '0.01' },
    ],
    calculate: (values) => {
      const netEarnings = parseNumber(values.netEarnings);
      const seTax = netEarnings * (parseNumber(values.seTaxRate, 15.3) / 100);
      const deductibleHalf = seTax / 2;
      return {
        results: [
          { key: 'seTax', label: 'Estimated Self-Employment Tax', value: roundTo(seTax), format: 'currency' },
          { key: 'deductibleHalf', label: 'Deductible Half of SE Tax', value: roundTo(deductibleHalf), format: 'currency' },
          { key: 'effectiveRate', label: 'Effective SE Tax Rate', value: roundTo(parseNumber(values.seTaxRate)), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: '1099-vs-w2',
    title: '1099 vs W2 Calculator',
    description: 'Compare estimated net income between contractor and employee scenarios.',
    category: 'income',
    icon: 'compare',
    fields: [
      { key: 'income', label: 'Annual Gross Income ($)', type: 'number', defaultValue: '100000', min: '0', step: '0.01' },
      { key: 'w2TaxRate', label: 'W2 Effective Tax Rate (%)', type: 'number', defaultValue: '24', min: '0', max: '60', step: '0.1' },
      { key: 'contractorTaxRate', label: '1099 Effective Tax Rate (%)', type: 'number', defaultValue: '31', min: '0', max: '70', step: '0.1' },
      { key: 'benefitsValue', label: 'Employer Benefits Value ($)', type: 'number', defaultValue: '12000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const income = parseNumber(values.income);
      const w2Net = income * (1 - parseNumber(values.w2TaxRate) / 100) + parseNumber(values.benefitsValue);
      const contractorNet = income * (1 - parseNumber(values.contractorTaxRate) / 100);
      const difference = w2Net - contractorNet;
      return {
        results: [
          { key: 'w2Net', label: 'Estimated W2 Net + Benefits', value: roundTo(w2Net), format: 'currency' },
          { key: 'contractorNet', label: 'Estimated 1099 Net', value: roundTo(contractorNet), format: 'currency' },
          { key: 'difference', label: 'W2 Advantage (positive) / 1099 Advantage (negative)', value: roundTo(difference), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'personal-loan',
    title: 'Personal Loan Calculator',
    description: 'Estimate monthly payment, total interest, and total cost for a personal loan.',
    category: 'loans',
    icon: 'request_quote',
    fields: [
      { key: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: '15000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '11.5', min: '0', step: '0.01' },
      { key: 'years', label: 'Term (years)', type: 'number', defaultValue: '5', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const amount = parseNumber(values.amount);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.years, 5) * 12;
      const payment = amortizedMonthlyPayment(amount, apr, months);
      const totalPaid = payment * months;
      return {
        results: [
          { key: 'payment', label: 'Monthly Payment', value: roundTo(payment), format: 'currency' },
          { key: 'totalInterest', label: 'Total Interest', value: roundTo(totalPaid - amount), format: 'currency' },
          { key: 'totalPaid', label: 'Total Paid', value: roundTo(totalPaid), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'student-loan',
    title: 'Student Loan Calculator',
    description: 'Estimate student loan payment timeline with optional extra monthly payment.',
    category: 'loans',
    icon: 'school',
    fields: [
      { key: 'amount', label: 'Loan Balance ($)', type: 'number', defaultValue: '35000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.2', min: '0', step: '0.01' },
      { key: 'years', label: 'Term (years)', type: 'number', defaultValue: '10', min: '1', step: '1' },
      { key: 'extra', label: 'Extra Monthly Payment ($)', type: 'number', defaultValue: '50', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const amount = parseNumber(values.amount);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.years, 10) * 12;
      const extra = parseNumber(values.extra);
      const schedule = calculateAmortizationSchedule(amount, apr, months, extra);
      return {
        results: [
          { key: 'payment', label: 'Base Monthly Payment', value: schedule.payment, format: 'currency' },
          { key: 'monthsToPayoff', label: 'Estimated Months to Payoff', value: schedule.schedule.length, format: 'integer' },
          { key: 'totalInterest', label: 'Total Interest', value: schedule.totalInterest, format: 'currency' },
          { key: 'totalPaid', label: 'Total Paid', value: schedule.totalPaid, format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'debt-snowball',
    title: 'Debt Snowball Calculator',
    description: 'Estimate debt payoff timeline using a snowball-style accelerated payment amount.',
    category: 'loans',
    icon: 'snowing',
    fields: [
      { key: 'totalDebt', label: 'Total Debt ($)', type: 'number', defaultValue: '22000', min: '0', step: '0.01' },
      { key: 'avgApr', label: 'Average APR (%)', type: 'number', defaultValue: '18', min: '0', step: '0.01' },
      { key: 'monthlyPayment', label: 'Monthly Payment Budget ($)', type: 'number', defaultValue: '700', min: '1', step: '0.01' },
    ],
    calculate: (values) => {
      const debt = parseNumber(values.totalDebt);
      const apr = parseNumber(values.avgApr);
      const payment = parseNumber(values.monthlyPayment, 1);
      const monthlyRate = apr / 100 / 12;
      if (debt <= 0 || payment <= debt * monthlyRate) {
        return {
          results: [
            { key: 'months', label: 'Months to Payoff', value: 0, format: 'integer' },
            { key: 'interest', label: 'Estimated Interest Paid', value: 0, format: 'currency' },
            { key: 'warning', label: 'Status', value: 'Payment too low to reduce balance', format: 'text' },
          ],
        };
      }

      let balance = debt;
      let months = 0;
      let interestPaid = 0;
      while (balance > 0.01 && months < 1200) {
        const interest = balance * monthlyRate;
        const principal = Math.max(0, payment - interest);
        balance -= principal;
        interestPaid += interest;
        months += 1;
      }

      return {
        results: [
          { key: 'months', label: 'Estimated Months to Payoff', value: months, format: 'integer' },
          { key: 'interest', label: 'Estimated Interest Paid', value: roundTo(interestPaid), format: 'currency' },
          { key: 'years', label: 'Estimated Years to Payoff', value: roundTo(months / 12), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'debt-avalanche',
    title: 'Debt Avalanche Calculator',
    description: 'Estimate debt payoff timeline prioritizing highest APR balances first.',
    category: 'loans',
    icon: 'landslide',
    fields: [
      { key: 'totalDebt', label: 'Total Debt ($)', type: 'number', defaultValue: '22000', min: '0', step: '0.01' },
      { key: 'avgApr', label: 'Average APR (%)', type: 'number', defaultValue: '18', min: '0', step: '0.01' },
      { key: 'monthlyPayment', label: 'Monthly Payment Budget ($)', type: 'number', defaultValue: '700', min: '1', step: '0.01' },
      { key: 'avalancheSavingsBoost', label: 'Avalanche Efficiency Boost (%)', type: 'number', defaultValue: '4', min: '0', max: '25', step: '0.1' },
    ],
    calculate: (values) => {
      const debt = parseNumber(values.totalDebt);
      const apr = parseNumber(values.avgApr);
      const payment = parseNumber(values.monthlyPayment, 1);
      const boost = parseNumber(values.avalancheSavingsBoost) / 100;
      const effectiveApr = Math.max(0, apr * (1 - boost));
      const monthlyRate = effectiveApr / 100 / 12;

      if (debt <= 0 || payment <= debt * monthlyRate) {
        return {
          results: [
            { key: 'months', label: 'Months to Payoff', value: 0, format: 'integer' },
            { key: 'interest', label: 'Estimated Interest Paid', value: 0, format: 'currency' },
            { key: 'warning', label: 'Status', value: 'Payment too low to reduce balance', format: 'text' },
          ],
        };
      }

      let balance = debt;
      let months = 0;
      let interestPaid = 0;
      while (balance > 0.01 && months < 1200) {
        const interest = balance * monthlyRate;
        const principal = Math.max(0, payment - interest);
        balance -= principal;
        interestPaid += interest;
        months += 1;
      }

      return {
        results: [
          { key: 'months', label: 'Estimated Months to Payoff', value: months, format: 'integer' },
          { key: 'interest', label: 'Estimated Interest Paid', value: roundTo(interestPaid), format: 'currency' },
          { key: 'effectiveApr', label: 'Effective APR Used', value: roundTo(effectiveApr), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'heloc',
    title: 'HELOC Calculator',
    description: 'Estimate payment during interest-only and repayment phases of a HELOC.',
    category: 'loans',
    icon: 'home_work',
    fields: [
      { key: 'creditLine', label: 'Credit Line ($)', type: 'number', defaultValue: '100000', min: '0', step: '0.01' },
      { key: 'balance', label: 'Current Balance ($)', type: 'number', defaultValue: '55000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '8.5', min: '0', step: '0.01' },
      { key: 'interestOnlyYears', label: 'Interest-Only Period (years)', type: 'number', defaultValue: '10', min: '1', step: '1' },
      { key: 'repaymentYears', label: 'Repayment Period (years)', type: 'number', defaultValue: '20', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const creditLine = parseNumber(values.creditLine);
      const balance = Math.min(parseNumber(values.balance), creditLine);
      const apr = parseNumber(values.apr);
      const monthlyRate = apr / 100 / 12;
      const interestOnlyPayment = balance * monthlyRate;
      const repaymentMonths = parseNumber(values.repaymentYears, 20) * 12;
      const repaymentPayment = amortizedMonthlyPayment(balance, apr, repaymentMonths);
      return {
        results: [
          { key: 'utilization', label: 'Credit Line Utilization', value: creditLine > 0 ? roundTo((balance / creditLine) * 100) : 0, format: 'percent' },
          { key: 'interestOnly', label: 'Interest-Only Monthly Payment', value: roundTo(interestOnlyPayment), format: 'currency' },
          { key: 'repayment', label: 'Repayment Monthly Payment', value: roundTo(repaymentPayment), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'amortization-calculator',
    title: 'Amortization Calculator',
    description: 'View full amortization schedule with payment, principal, interest, and balance by month.',
    category: 'loans',
    icon: 'table_chart',
    fields: [
      { key: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: '300000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.5', min: '0', step: '0.01' },
      { key: 'years', label: 'Term (years)', type: 'number', defaultValue: '30', min: '1', step: '1' },
      { key: 'extra', label: 'Extra Monthly Payment ($)', type: 'number', defaultValue: '0', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const amount = parseNumber(values.amount);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.years, 30) * 12;
      const extra = parseNumber(values.extra);
      const scheduleData = calculateAmortizationSchedule(amount, apr, months, extra);

      const rows = scheduleData.schedule.map((row) => ({
        month: row.month,
        payment: row.payment,
        principal: row.principal,
        interest: row.interest,
        balance: row.balance,
      }));

      return {
        results: [
          { key: 'payment', label: 'Base Monthly Payment', value: scheduleData.payment, format: 'currency' },
          { key: 'payoffMonths', label: 'Payoff Length (months)', value: scheduleData.schedule.length, format: 'integer' },
          { key: 'totalInterest', label: 'Total Interest', value: scheduleData.totalInterest, format: 'currency' },
          { key: 'totalPaid', label: 'Total Paid', value: scheduleData.totalPaid, format: 'currency' },
        ],
        table: {
          title: 'Full Amortization Schedule',
          columns: [
            { key: 'month', label: 'Month', format: 'integer' },
            { key: 'payment', label: 'Payment', format: 'currency' },
            { key: 'principal', label: 'Principal', format: 'currency' },
            { key: 'interest', label: 'Interest', format: 'currency' },
            { key: 'balance', label: 'Balance', format: 'currency' },
          ],
          rows,
        },
      };
    },
  },
  {
    slug: 'loan-payment-calculator',
    title: 'Loan Payment Calculator',
    description: 'Estimate monthly loan payment, total interest, and total repayment.',
    category: 'loans',
    icon: 'payments',
    fields: [
      { key: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: '25000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '7.2', min: '0', step: '0.01' },
      { key: 'months', label: 'Term (months)', type: 'number', defaultValue: '60', min: '1', step: '1' },
    ],
    calculate: (values) => {
          // Place function and exports at the end of the file
      const amount = parseNumber(values.amount);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.months, 60);
      const payment = amortizedMonthlyPayment(amount, apr, months);
      const totalPaid = payment * months;
      return {
        results: [
          { key: 'payment', label: 'Monthly Payment', value: roundTo(payment), format: 'currency' },
          { key: 'totalInterest', label: 'Total Interest', value: roundTo(totalPaid - amount), format: 'currency' },
          { key: 'totalPaid', label: 'Total Paid', value: roundTo(totalPaid), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'percentage-of-a-number',
    title: 'Percentage of a Number Calculator',
    description: 'Find a percentage value of any number instantly.',
    category: 'percentages',
    icon: 'percent',
    fields: [
      { key: 'percent', label: 'Percentage (%)', type: 'number', defaultValue: '15', step: '0.01' },
      { key: 'number', label: 'Number', type: 'number', defaultValue: '240', step: '0.01' },
    ],
    calculate: (values) => {
      const percent = parseNumber(values.percent);
      const number = parseNumber(values.number);
      return {
        results: [
          { key: 'result', label: `${percent}% of ${number}`, value: roundTo((percent / 100) * number), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'what-percent-of-x-is-y',
    title: 'What Percent of X is Y Calculator',
    description: 'Calculate what percentage one value is of another value.',
    category: 'percentages',
    icon: 'help',
    fields: [
      { key: 'x', label: 'X (base value)', type: 'number', defaultValue: '500', step: '0.01' },
      { key: 'y', label: 'Y (part value)', type: 'number', defaultValue: '125', step: '0.01' },
    ],
    calculate: (values) => {
      const x = parseNumber(values.x);
      const y = parseNumber(values.y);
      const percent = x !== 0 ? (y / x) * 100 : 0;
      return {
        results: [
          { key: 'percent', label: 'Y as a Percentage of X', value: roundTo(percent), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'fraction-to-percent',
    title: 'Fraction to Percent Calculator',
    description: 'Convert a fraction to a percentage value.',
    category: 'percentages',
    icon: 'function',
    fields: [
      { key: 'numerator', label: 'Numerator', type: 'number', defaultValue: '3', step: '1' },
      { key: 'denominator', label: 'Denominator', type: 'number', defaultValue: '8', step: '1' },
    ],
    calculate: (values) => {
      const numerator = parseNumber(values.numerator);
      const denominator = parseNumber(values.denominator, 1);
      const percent = denominator !== 0 ? (numerator / denominator) * 100 : 0;
      return {
        results: [
          { key: 'percent', label: 'Percent', value: roundTo(percent), format: 'percent' },
          { key: 'decimal', label: 'Decimal Value', value: denominator !== 0 ? roundTo(numerator / denominator, 4) : 0, format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'percent-to-fraction',
    title: 'Percent to Fraction Calculator',
    description: 'Convert percent values into simplified fractions.',
    category: 'percentages',
    icon: 'exposure',
    fields: [
      { key: 'percent', label: 'Percent (%)', type: 'number', defaultValue: '37.5', step: '0.01' },
    ],
    calculate: (values) => {
      const percent = parseNumber(values.percent);
      const scaledNumerator = Math.round(percent * 100);
      const scaledDenominator = 10000;
      const divisor = gcd(scaledNumerator, scaledDenominator);
      const numerator = scaledNumerator / divisor;
      const denominator = scaledDenominator / divisor;
      return {
        results: [
          { key: 'fraction', label: 'Simplified Fraction', value: `${numerator}/${denominator}`, format: 'text' },
          { key: 'decimal', label: 'Decimal', value: roundTo(percent / 100, 4), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'margin-calculator',
    title: 'Margin Calculator',
    description: 'Calculate gross margin and markup from revenue and cost.',
    category: 'percentages',
    icon: 'bar_chart',
    fields: [
      { key: 'revenue', label: 'Revenue / Selling Price ($)', type: 'number', defaultValue: '120', min: '0', step: '0.01' },
      { key: 'cost', label: 'Cost ($)', type: 'number', defaultValue: '72', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const revenue = parseNumber(values.revenue);
      const cost = parseNumber(values.cost);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;
      return {
        results: [
          { key: 'profit', label: 'Gross Profit', value: roundTo(profit), format: 'currency' },
          { key: 'margin', label: 'Gross Margin', value: roundTo(margin), format: 'percent' },
          { key: 'markup', label: 'Markup', value: roundTo(markup), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'markup-calculator',
    title: 'Markup Calculator',
    description: 'Calculate selling price and margin from cost and markup percentage.',
    category: 'percentages',
    icon: 'sell',
    fields: [
      { key: 'cost', label: 'Cost ($)', type: 'number', defaultValue: '50', min: '0', step: '0.01' },
      { key: 'markupPercent', label: 'Markup (%)', type: 'number', defaultValue: '40', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const cost = parseNumber(values.cost);
      const markupPercent = parseNumber(values.markupPercent);
      const sellingPrice = cost * (1 + markupPercent / 100);
      const margin = sellingPrice > 0 ? ((sellingPrice - cost) / sellingPrice) * 100 : 0;
      return {
        results: [
          { key: 'sellingPrice', label: 'Selling Price', value: roundTo(sellingPrice), format: 'currency' },
          { key: 'profit', label: 'Profit', value: roundTo(sellingPrice - cost), format: 'currency' },
          { key: 'margin', label: 'Margin', value: roundTo(margin), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'body-fat',
    title: 'Body Fat Calculator',
    description: 'Estimate body fat percentage using circumference-based formulas.',
    category: 'health',
    icon: 'monitor_weight',
    fields: [
      {
        key: 'sex',
        label: 'Sex',
        type: 'select',
        defaultValue: 'male',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
      { key: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: '175', min: '1', step: '0.1' },
      { key: 'neckCm', label: 'Neck Circumference (cm)', type: 'number', defaultValue: '39', min: '1', step: '0.1' },
      { key: 'waistCm', label: 'Waist Circumference (cm)', type: 'number', defaultValue: '88', min: '1', step: '0.1' },
      { key: 'hipCm', label: 'Hip Circumference (cm, female)', type: 'number', defaultValue: '98', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const sex = values.sex;
      const heightCm = parseNumber(values.heightCm, 1);
      const neckCm = parseNumber(values.neckCm, 1);
      const waistCm = parseNumber(values.waistCm, 1);
      const hipCm = parseNumber(values.hipCm, 1);

      const heightIn = heightCm / 2.54;
      const neckIn = neckCm / 2.54;
      const waistIn = waistCm / 2.54;
      const hipIn = hipCm / 2.54;

      const bodyFat = sex === 'female'
        ? 163.205 * Math.log10(Math.max(waistIn + hipIn - neckIn, 1)) - 97.684 * Math.log10(Math.max(heightIn, 1)) - 78.387
        : 86.01 * Math.log10(Math.max(waistIn - neckIn, 1)) - 70.041 * Math.log10(Math.max(heightIn, 1)) + 36.76;

      const clampedBodyFat = clamp(bodyFat, 2, 70);
      return {
        results: [
          { key: 'bodyFat', label: 'Estimated Body Fat', value: roundTo(clampedBodyFat), format: 'percent' },
          { key: 'leanMassPercent', label: 'Estimated Lean Mass', value: roundTo(100 - clampedBodyFat), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'lean-body-mass',
    title: 'Lean Body Mass Calculator',
    description: 'Calculate lean body mass using weight and body fat percentage.',
    category: 'health',
    icon: 'fitness_center',
    fields: [
      { key: 'weightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: '78', min: '1', step: '0.1' },
      { key: 'bodyFatPercent', label: 'Body Fat (%)', type: 'number', defaultValue: '20', min: '0', max: '70', step: '0.1' },
    ],
    calculate: (values) => {
      const weightKg = parseNumber(values.weightKg);
      const bodyFatPercent = clamp(parseNumber(values.bodyFatPercent), 0, 100);
      const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
      return {
        results: [
          { key: 'leanKg', label: 'Lean Body Mass (kg)', value: roundTo(leanMassKg), format: 'number' },
          { key: 'leanLb', label: 'Lean Body Mass (lb)', value: roundTo(leanMassKg * 2.20462), format: 'number' },
          { key: 'fatMassKg', label: 'Fat Mass (kg)', value: roundTo(weightKg - leanMassKg), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'macro-calculator',
    title: 'Macro Calculator',
    description: 'Estimate daily macros (protein, carbs, fats) from calories and goals.',
    category: 'health',
    icon: 'nutrition',
    fields: [
      { key: 'dailyCalories', label: 'Daily Calories', type: 'number', defaultValue: '2400', min: '0', step: '1' },
      { key: 'bodyWeightLb', label: 'Body Weight (lb)', type: 'number', defaultValue: '170', min: '1', step: '0.1' },
      { key: 'proteinPerLb', label: 'Protein (g per lb)', type: 'number', defaultValue: '0.8', min: '0.2', step: '0.1' },
      { key: 'fatPercentCalories', label: 'Fat (% of calories)', type: 'number', defaultValue: '30', min: '10', max: '60', step: '1' },
    ],
    calculate: (values) => {
      const calories = parseNumber(values.dailyCalories);
      const bodyWeightLb = parseNumber(values.bodyWeightLb);
      const proteinPerLb = parseNumber(values.proteinPerLb);
      const fatPercentCalories = clamp(parseNumber(values.fatPercentCalories), 0, 100);
      const proteinGrams = bodyWeightLb * proteinPerLb;
      const proteinCalories = proteinGrams * 4;
      const fatCalories = calories * (fatPercentCalories / 100);
      const fatGrams = fatCalories / 9;
      const carbCalories = Math.max(0, calories - proteinCalories - fatCalories);
      const carbGrams = carbCalories / 4;
      return {
        results: [
          { key: 'protein', label: 'Protein (g/day)', value: roundTo(proteinGrams), format: 'number' },
          { key: 'fat', label: 'Fat (g/day)', value: roundTo(fatGrams), format: 'number' },
          { key: 'carbs', label: 'Carbs (g/day)', value: roundTo(carbGrams), format: 'number' },
          { key: 'calories', label: 'Total Calories', value: roundTo(calories), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'calories-burned',
    title: 'Calories Burned Calculator',
    description: 'Estimate calories burned from MET value, weight, and workout duration.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [
      { key: 'met', label: 'MET Value', type: 'number', defaultValue: '8', min: '1', step: '0.1' },
      { key: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: '75', min: '1', step: '0.1' },
      { key: 'minutes', label: 'Duration (minutes)', type: 'number', defaultValue: '45', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const met = parseNumber(values.met);
      const weightKg = parseNumber(values.weightKg);
      const minutes = parseNumber(values.minutes);
      const calories = met * weightKg * (minutes / 60);
      return {
        results: [
          { key: 'calories', label: 'Estimated Calories Burned', value: roundTo(calories), format: 'number' },
          { key: 'perHour', label: 'Estimated Calories per Hour', value: roundTo(met * weightKg), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'one-rep-max',
    title: 'One Rep Max Calculator',
    description: 'Estimate one-rep max (1RM) from weight lifted and reps completed.',
    category: 'health',
    icon: 'sports_gymnastics',
    fields: [
      { key: 'weight', label: 'Weight Lifted', type: 'number', defaultValue: '185', min: '1', step: '0.1' },
      { key: 'reps', label: 'Repetitions', type: 'number', defaultValue: '5', min: '1', max: '20', step: '1' },
    ],
    calculate: (values) => {
      const weight = parseNumber(values.weight);
      const reps = clamp(parseNumber(values.reps, 1), 1, 20);
      const oneRepMax = weight * (1 + reps / 30);
      return {
        results: [
          { key: 'oneRepMax', label: 'Estimated 1RM', value: roundTo(oneRepMax), format: 'number' },
          { key: 'ninetyPercent', label: '90% Training Load', value: roundTo(oneRepMax * 0.9), format: 'number' },
          { key: 'eightyPercent', label: '80% Training Load', value: roundTo(oneRepMax * 0.8), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'target-heart-rate',
    title: 'Target Heart Rate Calculator',
    description: 'Calculate target heart rate zone using age, resting HR, and intensity range.',
    category: 'health',
    icon: 'favorite',
    fields: [
      { key: 'age', label: 'Age', type: 'number', defaultValue: '35', min: '1', max: '100', step: '1' },
      { key: 'restingHr', label: 'Resting Heart Rate (bpm)', type: 'number', defaultValue: '62', min: '30', max: '120', step: '1' },
      { key: 'lowIntensity', label: 'Low Intensity (%)', type: 'number', defaultValue: '60', min: '40', max: '95', step: '1' },
      { key: 'highIntensity', label: 'High Intensity (%)', type: 'number', defaultValue: '80', min: '40', max: '95', step: '1' },
    ],
    calculate: (values) => {
      const age = parseNumber(values.age);
      const restingHr = parseNumber(values.restingHr);
      const low = parseNumber(values.lowIntensity) / 100;
      const high = parseNumber(values.highIntensity) / 100;
      const maxHr = 220 - age;
      const reserve = maxHr - restingHr;
      const lowTarget = restingHr + reserve * low;
      const highTarget = restingHr + reserve * high;
      return {
        results: [
          { key: 'maxHr', label: 'Estimated Max Heart Rate', value: roundTo(maxHr), format: 'integer' },
          { key: 'targetLow', label: 'Target Zone Low', value: roundTo(lowTarget), format: 'integer' },
          { key: 'targetHigh', label: 'Target Zone High', value: roundTo(highTarget), format: 'integer' },
        ],
      };
    },
  },
  {
    slug: 'property-tax',
    title: 'Property Tax Calculator',
    description: 'Estimate annual and monthly property taxes from home value and tax rate.',
    category: 'home',
    icon: 'holiday_village',
    fields: [
      { key: 'homeValue', label: 'Home Value ($)', type: 'number', defaultValue: '450000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Property Tax Rate (%)', type: 'number', defaultValue: '1.2', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const homeValue = parseNumber(values.homeValue);
      const taxRate = parseNumber(values.taxRate);
      const annualTax = homeValue * (taxRate / 100);
      return {
        results: [
          { key: 'annualTax', label: 'Estimated Annual Property Tax', value: roundTo(annualTax), format: 'currency' },
          { key: 'monthlyTax', label: 'Estimated Monthly Property Tax', value: roundTo(annualTax / 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'closing-cost',
    title: 'Closing Cost Calculator',
    description: 'Estimate total home closing costs using percentage and fixed-fee assumptions.',
    category: 'home',
    icon: 'real_estate_agent',
    fields: [
      { key: 'homePrice', label: 'Home Price ($)', type: 'number', defaultValue: '400000', min: '0', step: '0.01' },
      { key: 'closingRate', label: 'Closing Costs (%)', type: 'number', defaultValue: '3', min: '0', step: '0.1' },
      { key: 'fixedFees', label: 'Additional Fixed Fees ($)', type: 'number', defaultValue: '1500', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const homePrice = parseNumber(values.homePrice);
      const closingRate = parseNumber(values.closingRate);
      const fixedFees = parseNumber(values.fixedFees);
      const variableCosts = homePrice * (closingRate / 100);
      const totalClosing = variableCosts + fixedFees;
      return {
        results: [
          { key: 'variableCosts', label: 'Percentage-Based Costs', value: roundTo(variableCosts), format: 'currency' },
          { key: 'totalClosing', label: 'Estimated Total Closing Costs', value: roundTo(totalClosing), format: 'currency' },
          { key: 'cashNeeded', label: 'Estimated Cash Needed (incl. closing)', value: roundTo(homePrice + totalClosing), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'pmi',
    title: 'PMI Calculator',
    description: 'Estimate private mortgage insurance based on LTV and annual PMI rate.',
    category: 'home',
    icon: 'shield',
    fields: [
      { key: 'homePrice', label: 'Home Price ($)', type: 'number', defaultValue: '350000', min: '0', step: '0.01' },
      { key: 'downPercent', label: 'Down Payment (%)', type: 'number', defaultValue: '10', min: '0', max: '100', step: '0.1' },
      { key: 'annualPmiRate', label: 'Annual PMI Rate (%)', type: 'number', defaultValue: '0.7', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const homePrice = parseNumber(values.homePrice);
      const downPercent = clamp(parseNumber(values.downPercent), 0, 100);
      const annualPmiRate = parseNumber(values.annualPmiRate);
      const loanAmount = homePrice * (1 - downPercent / 100);
      const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
      const annualPmi = ltv > 80 ? loanAmount * (annualPmiRate / 100) : 0;
      return {
        results: [
          { key: 'ltv', label: 'Loan-to-Value (LTV)', value: roundTo(ltv), format: 'percent' },
          { key: 'annualPmi', label: 'Estimated Annual PMI', value: roundTo(annualPmi), format: 'currency' },
          { key: 'monthlyPmi', label: 'Estimated Monthly PMI', value: roundTo(annualPmi / 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'home-equity',
    title: 'Home Equity Calculator',
    description: 'Estimate home equity and equity percentage from value and mortgage balance.',
    category: 'home',
    icon: 'home',
    fields: [
      { key: 'homeValue', label: 'Current Home Value ($)', type: 'number', defaultValue: '500000', min: '0', step: '0.01' },
      { key: 'loanBalance', label: 'Mortgage Balance ($)', type: 'number', defaultValue: '310000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const homeValue = parseNumber(values.homeValue);
      const loanBalance = parseNumber(values.loanBalance);
      const equity = homeValue - loanBalance;
      const equityPercent = homeValue > 0 ? (equity / homeValue) * 100 : 0;
      return {
        results: [
          { key: 'equity', label: 'Estimated Home Equity', value: roundTo(equity), format: 'currency' },
          { key: 'equityPercent', label: 'Equity Percentage', value: roundTo(equityPercent), format: 'percent' },
          { key: 'ltv', label: 'Loan-to-Value', value: roundTo(100 - equityPercent), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'rent-increase',
    title: 'Rent Increase Calculator',
    description: 'Calculate the impact of rent increases in monthly and annual terms.',
    category: 'home',
    icon: 'apartment',
    fields: [
      { key: 'currentRent', label: 'Current Monthly Rent ($)', type: 'number', defaultValue: '1800', min: '0', step: '0.01' },
      { key: 'increasePercent', label: 'Increase (%)', type: 'number', defaultValue: '6', min: '0', step: '0.1' },
    ],
    calculate: (values) => {
      const currentRent = parseNumber(values.currentRent);
      const increasePercent = parseNumber(values.increasePercent);
      const increaseAmount = currentRent * (increasePercent / 100);
      const newRent = currentRent + increaseAmount;
      return {
        results: [
          { key: 'increaseAmount', label: 'Monthly Increase', value: roundTo(increaseAmount), format: 'currency' },
          { key: 'newRent', label: 'New Monthly Rent', value: roundTo(newRent), format: 'currency' },
          { key: 'annualImpact', label: 'Annual Cost Increase', value: roundTo(increaseAmount * 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'rental-yield',
    title: 'Rental Yield Calculator',
    description: 'Estimate gross and net rental yield for investment property analysis.',
    category: 'home',
    icon: 'home_work',
    fields: [
      { key: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', defaultValue: '2400', min: '0', step: '0.01' },
      { key: 'propertyValue', label: 'Property Value ($)', type: 'number', defaultValue: '420000', min: '0', step: '0.01' },
      { key: 'annualExpenses', label: 'Annual Expenses ($)', type: 'number', defaultValue: '7000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const monthlyRent = parseNumber(values.monthlyRent);
      const propertyValue = parseNumber(values.propertyValue);
      const annualExpenses = parseNumber(values.annualExpenses);
      const annualRent = monthlyRent * 12;
      const grossYield = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0;
      const netYield = propertyValue > 0 ? ((annualRent - annualExpenses) / propertyValue) * 100 : 0;
      return {
        results: [
          { key: 'annualRent', label: 'Annual Rental Income', value: roundTo(annualRent), format: 'currency' },
          { key: 'grossYield', label: 'Gross Yield', value: roundTo(grossYield), format: 'percent' },
          { key: 'netYield', label: 'Net Yield', value: roundTo(netYield), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'work-hours',
    title: 'Work Hours Calculator',
    description: 'Calculate daily and weekly work hours from start/end times and breaks.',
    category: 'time',
    icon: 'work_history',
    fields: [
      { key: 'startTime', label: 'Start Time', type: 'time', defaultValue: '09:00' },
      { key: 'endTime', label: 'End Time', type: 'time', defaultValue: '17:30' },
      { key: 'breakMinutes', label: 'Break (minutes)', type: 'number', defaultValue: '30', min: '0', step: '1' },
      { key: 'daysPerWeek', label: 'Days Per Week', type: 'number', defaultValue: '5', min: '1', max: '7', step: '1' },
    ],
    calculate: (values) => {
      const startMinutes = parseTimeToMinutes(values.startTime);
      const endMinutes = parseTimeToMinutes(values.endTime);
      const rawMinutes = endMinutes >= startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes + endMinutes);
      const netMinutes = Math.max(0, rawMinutes - parseNumber(values.breakMinutes));
      const daysPerWeek = parseNumber(values.daysPerWeek, 5);
      return {
        results: [
          { key: 'dailyHours', label: 'Daily Work Duration', value: formatDurationMinutes(netMinutes), format: 'duration' },
          { key: 'weeklyHours', label: 'Weekly Work Duration', value: formatDurationMinutes(netMinutes * daysPerWeek), format: 'duration' },
          { key: 'weeklyDecimal', label: 'Weekly Hours (decimal)', value: roundTo((netMinutes * daysPerWeek) / 60, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'business-days',
    title: 'Business Days Calculator',
    description: 'Count business days between two dates, excluding weekends.',
    category: 'time',
    icon: 'calendar_today',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date', defaultValue: '2026-01-01' },
      { key: 'endDate', label: 'End Date', type: 'date', defaultValue: '2026-02-25' },
    ],
    calculate: (values) => {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
        return {
          results: [
            { key: 'businessDays', label: 'Business Days', value: 0, format: 'integer' },
            { key: 'calendarDays', label: 'Calendar Days', value: 0, format: 'integer' },
          ],
        };
      }
      const calendarDays = diffDays(start, end) + 1;
      let businessDays = 0;
      for (let i = 0; i < calendarDays; i += 1) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          businessDays += 1;
        }
      }
      return {
        results: [
          { key: 'businessDays', label: 'Business Days', value: businessDays, format: 'integer' },
          { key: 'calendarDays', label: 'Calendar Days', value: calendarDays, format: 'integer' },
        ],
      };
    },
  },
  {
    slug: 'countdown',
    title: 'Countdown Calculator',
    description: 'Calculate remaining time until a target date and time.',
    category: 'time',
    icon: 'timer',
    fields: [
      { key: 'targetDateTime', label: 'Target Date & Time', type: 'datetime-local', defaultValue: '2026-12-31T23:59' },
    ],
    calculate: (values) => {
      const target = new Date(values.targetDateTime);
      if (Number.isNaN(target.getTime())) {
        return {
          results: [
            { key: 'remaining', label: 'Time Remaining', value: 'Invalid target date', format: 'text' },
          ],
        };
      }
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();
      const absDiffMs = Math.abs(diffMs);
      const totalMinutes = Math.floor(absDiffMs / 60000);
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = totalMinutes % 60;
      return {
        results: [
          { key: 'status', label: 'Status', value: diffMs >= 0 ? 'Time remaining' : 'Target has passed', format: 'text' },
          { key: 'remaining', label: 'Days / Hours / Minutes', value: `${days}d ${hours}h ${minutes}m`, format: 'duration' },
          { key: 'targetDate', label: 'Target Date', value: target.toLocaleString(), format: 'date' },
        ],
      };
    },
  },
  {
    slug: 'week-number',
    title: 'Week Number Calculator',
    description: 'Find ISO week number and week year for any date.',
    category: 'time',
    icon: 'view_week',
    fields: [
      { key: 'date', label: 'Date', type: 'date', defaultValue: '2026-02-25' },
    ],
    calculate: (values) => {
      const date = new Date(values.date);
      if (Number.isNaN(date.getTime())) {
        return {
          results: [
            { key: 'week', label: 'ISO Week Number', value: 0, format: 'integer' },
            { key: 'weekYear', label: 'ISO Week Year', value: 0, format: 'integer' },
          ],
        };
      }
      const iso = getIsoWeek(date);
      return {
        results: [
          { key: 'week', label: 'ISO Week Number', value: iso.week, format: 'integer' },
          { key: 'weekYear', label: 'ISO Week Year', value: iso.year, format: 'integer' },
          { key: 'weekday', label: 'Weekday', value: date.toLocaleDateString(undefined, { weekday: 'long' }), format: 'text' },
        ],
      };
    },
  },
  {
    slug: 'time-zone-converter',
    title: 'Time Zone Converter',
    description: 'Convert a date/time between UTC offsets.',
    category: 'time',
    icon: 'public',
    fields: [
      { key: 'dateTime', label: 'Date & Time', type: 'datetime-local', defaultValue: '2026-02-25T12:00' },
      { key: 'fromOffset', label: 'From UTC Offset (hours)', type: 'number', defaultValue: '-5', min: '-12', max: '14', step: '0.5' },
      { key: 'toOffset', label: 'To UTC Offset (hours)', type: 'number', defaultValue: '1', min: '-12', max: '14', step: '0.5' },
    ],
    calculate: (values) => {
      const input = values.dateTime;
      const fromOffset = parseNumber(values.fromOffset);
      const toOffset = parseNumber(values.toOffset);
      const parsedLocal = new Date(input);
      if (Number.isNaN(parsedLocal.getTime())) {
        return {
          results: [
            { key: 'converted', label: 'Converted Date/Time', value: 'Invalid input date/time', format: 'text' },
          ],
        };
      }

      const utcMs = parsedLocal.getTime() - fromOffset * 3600000;
      const converted = new Date(utcMs + toOffset * 3600000);

      return {
        results: [
          { key: 'converted', label: 'Converted Date/Time', value: converted.toLocaleString(), format: 'date' },
          { key: 'offsetShift', label: 'Offset Shift', value: `${roundTo(toOffset - fromOffset)} hours`, format: 'text' },
        ],
      };
    },
  },
  {
    slug: 'climbing-grade-converter',
    title: 'Climbing Grade Converter',
    description: 'Convert selected YDS sport climbing grades to approximate French grades.',
    category: 'outdoors',
    icon: 'landscape',
    fields: [
      {
        key: 'yds',
        label: 'YDS Grade',
        type: 'select',
        defaultValue: '5.10a',
        options: [
          { value: '5.8', label: '5.8' },
          { value: '5.9', label: '5.9' },
          { value: '5.10a', label: '5.10a' },
          { value: '5.10d', label: '5.10d' },
          { value: '5.11b', label: '5.11b' },
          { value: '5.12a', label: '5.12a' },
          { value: '5.12d', label: '5.12d' },
          { value: '5.13b', label: '5.13b' },
        ],
      },
    ],
    calculate: (values) => {
      const map: Record<string, string> = {
        '5.8': '5b',
        '5.9': '5c',
        '5.10a': '6a',
        '5.10d': '6b+',
        '5.11b': '6c',
        '5.12a': '7a+',
        '5.12d': '7c',
        '5.13b': '8a',
      };
      const french = map[values.yds] ?? 'N/A';
      return {
        results: [
          { key: 'yds', label: 'YDS Grade', value: values.yds, format: 'text' },
          { key: 'french', label: 'Approx. French Grade', value: french, format: 'text' },
        ],
      };
    },
  },
  {
    slug: 'trail-elevation-gain',
    title: 'Trail Elevation Gain Calculator',
    description: 'Estimate average grade and climbing rate from trail distance and elevation gain.',
    category: 'outdoors',
    icon: 'terrain',
    fields: [
      { key: 'distanceMiles', label: 'Trail Distance (miles)', type: 'number', defaultValue: '6.5', min: '0', step: '0.1' },
      { key: 'elevationGainFt', label: 'Elevation Gain (ft)', type: 'number', defaultValue: '1800', min: '0', step: '1' },
      { key: 'hours', label: 'Moving Time (hours)', type: 'number', defaultValue: '3.2', min: '0.1', step: '0.1' },
    ],
    calculate: (values) => {
      const distanceMiles = parseNumber(values.distanceMiles);
      const elevationGainFt = parseNumber(values.elevationGainFt);
      const hours = parseNumber(values.hours, 1);
      const horizontalFeet = distanceMiles * 5280;
      const gradePercent = horizontalFeet > 0 ? (elevationGainFt / horizontalFeet) * 100 : 0;
      const verticalSpeed = elevationGainFt / hours;
      return {
        results: [
          { key: 'gradePercent', label: 'Average Grade', value: roundTo(gradePercent), format: 'percent' },
          { key: 'verticalSpeed', label: 'Vertical Speed (ft/hr)', value: roundTo(verticalSpeed), format: 'number' },
          { key: 'gainPerMile', label: 'Elevation Gain per Mile (ft)', value: distanceMiles > 0 ? roundTo(elevationGainFt / distanceMiles) : 0, format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'pace-per-mile',
    title: 'Pace Per Mile Calculator',
    description: 'Calculate running pace per mile and per kilometer from distance and time.',
    category: 'outdoors',
    icon: 'directions_run',
    fields: [
      { key: 'distanceMiles', label: 'Distance (miles)', type: 'number', defaultValue: '5', min: '0.01', step: '0.01' },
      { key: 'hours', label: 'Hours', type: 'number', defaultValue: '0', min: '0', step: '1' },
      { key: 'minutes', label: 'Minutes', type: 'number', defaultValue: '42', min: '0', step: '1' },
      { key: 'seconds', label: 'Seconds', type: 'number', defaultValue: '30', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const distanceMiles = parseNumber(values.distanceMiles, 1);
      const totalMinutes = parseNumber(values.hours) * 60 + parseNumber(values.minutes) + parseNumber(values.seconds) / 60;
      const pacePerMileMinutes = distanceMiles > 0 ? totalMinutes / distanceMiles : 0;
      const distanceKm = distanceMiles * 1.60934;
      const pacePerKmMinutes = distanceKm > 0 ? totalMinutes / distanceKm : 0;
      const mph = totalMinutes > 0 ? distanceMiles / (totalMinutes / 60) : 0;
      return {
        results: [
          { key: 'paceMile', label: 'Pace per Mile', value: formatDurationMinutes(pacePerMileMinutes), format: 'duration' },
          { key: 'paceKm', label: 'Pace per Kilometer', value: formatDurationMinutes(pacePerKmMinutes), format: 'duration' },
          { key: 'speed', label: 'Average Speed (mph)', value: roundTo(mph), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'cycling-ftp',
    title: 'Cycling FTP Calculator',
    description: 'Estimate Functional Threshold Power from a 20-minute power test.',
    category: 'outdoors',
    icon: 'directions_bike',
    fields: [
      { key: 'power20Min', label: '20-Minute Average Power (watts)', type: 'number', defaultValue: '260', min: '1', step: '1' },
      { key: 'weightKg', label: 'Rider Weight (kg)', type: 'number', defaultValue: '72', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const power20Min = parseNumber(values.power20Min);
      const weightKg = parseNumber(values.weightKg, 1);
      const ftp = power20Min * 0.95;
      const wPerKg = ftp / weightKg;
      return {
        results: [
          { key: 'ftp', label: 'Estimated FTP', value: roundTo(ftp), format: 'number' },
          { key: 'wkg', label: 'FTP W/kg', value: roundTo(wPerKg, 2), format: 'number' },
          { key: 'z2Lower', label: 'Endurance Zone Lower (W)', value: roundTo(ftp * 0.56), format: 'number' },
          { key: 'z2Upper', label: 'Endurance Zone Upper (W)', value: roundTo(ftp * 0.75), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'vo2-max',
    title: 'VO2 Max Calculator',
    description: 'Estimate VO2 max using resting and maximum heart rate values.',
    category: 'outdoors',
    icon: 'monitor_heart',
    fields: [
      { key: 'restingHr', label: 'Resting Heart Rate (bpm)', type: 'number', defaultValue: '58', min: '30', max: '120', step: '1' },
      { key: 'maxHr', label: 'Maximum Heart Rate (bpm)', type: 'number', defaultValue: '186', min: '80', max: '230', step: '1' },
    ],
    calculate: (values) => {
      const restingHr = parseNumber(values.restingHr, 60);
      const maxHr = parseNumber(values.maxHr, 180);
      const vo2 = restingHr > 0 ? 15.3 * (maxHr / restingHr) : 0;
      return {
        results: [
          { key: 'vo2', label: 'Estimated VO2 Max (ml/kg/min)', value: roundTo(vo2, 1), format: 'number' },
          { key: 'hrRatio', label: 'Max/Resting HR Ratio', value: roundTo(maxHr / restingHr, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'paycheck-calculator',
    title: 'Paycheck Calculator',
    description: 'Estimate take-home pay per paycheck using taxes and deductions.',
    category: 'income',
    icon: 'payments',
    fields: [
      {
        key: 'payFrequency',
        label: 'Pay Frequency',
        type: 'select',
        defaultValue: 'biweekly',
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Biweekly' },
          { value: 'semimonthly', label: 'Semi-Monthly' },
          { value: 'monthly', label: 'Monthly' },
        ],
      },
      { key: 'grossPerCheck', label: 'Gross Pay Per Check ($)', type: 'number', defaultValue: '2500', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Combined Tax Rate (%)', type: 'number', defaultValue: '24', min: '0', max: '60', step: '0.1' },
      { key: 'deductionsPerCheck', label: 'Other Deductions Per Check ($)', type: 'number', defaultValue: '150', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const grossPerCheck = parseNumber(values.grossPerCheck);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const deductionsPerCheck = parseNumber(values.deductionsPerCheck);
      const checksPerYear = values.payFrequency === 'weekly' ? 52 : values.payFrequency === 'biweekly' ? 26 : values.payFrequency === 'semimonthly' ? 24 : 12;
      const taxPerCheck = grossPerCheck * (taxRate / 100);
      const netPerCheck = Math.max(0, grossPerCheck - taxPerCheck - deductionsPerCheck);
      return {
        results: [
          { key: 'netPerCheck', label: 'Estimated Net Per Check', value: roundTo(netPerCheck), format: 'currency' },
          { key: 'annualNet', label: 'Estimated Annual Net', value: roundTo(netPerCheck * checksPerYear), format: 'currency' },
          { key: 'annualGross', label: 'Annual Gross', value: roundTo(grossPerCheck * checksPerYear), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'gross-to-net-calculator',
    title: 'Gross to Net Calculator',
    description: 'Convert gross income to estimated net income after taxes.',
    category: 'income',
    icon: 'account_balance_wallet',
    fields: [
      { key: 'grossIncome', label: 'Gross Income ($)', type: 'number', defaultValue: '85000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', defaultValue: '25', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const gross = parseNumber(values.grossIncome);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const taxes = gross * (taxRate / 100);
      const net = gross - taxes;
      return {
        results: [
          { key: 'netIncome', label: 'Net Income', value: roundTo(net), format: 'currency' },
          { key: 'taxAmount', label: 'Tax Amount', value: roundTo(taxes), format: 'currency' },
          { key: 'retained', label: 'Income Retained', value: roundTo(100 - taxRate), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'net-to-gross-calculator',
    title: 'Net to Gross Calculator',
    description: 'Estimate required gross income to reach a target net income.',
    category: 'income',
    icon: 'trending_up',
    fields: [
      { key: 'netIncome', label: 'Target Net Income ($)', type: 'number', defaultValue: '60000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', defaultValue: '25', min: '0', max: '80', step: '0.1' },
    ],
    calculate: (values) => {
      const net = parseNumber(values.netIncome);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 99.9);
      const gross = net / (1 - taxRate / 100);
      return {
        results: [
          { key: 'grossIncome', label: 'Required Gross Income', value: roundTo(gross), format: 'currency' },
          { key: 'taxAmount', label: 'Estimated Tax Amount', value: roundTo(Math.max(0, gross - net)), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'weekly-pay-calculator',
    title: 'Weekly Pay Calculator',
    description: 'Calculate weekly pay from hourly rate and weekly hours.',
    category: 'income',
    icon: 'calendar_view_week',
    fields: [
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: '28', min: '0', step: '0.01' },
      { key: 'hoursPerWeek', label: 'Hours Per Week', type: 'number', defaultValue: '40', min: '0', step: '0.25' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursPerWeek = parseNumber(values.hoursPerWeek);
      const weeklyPay = hourlyRate * hoursPerWeek;
      return {
        results: [
          { key: 'weeklyPay', label: 'Weekly Gross Pay', value: roundTo(weeklyPay), format: 'currency' },
          { key: 'annualized', label: 'Annualized (52 weeks)', value: roundTo(weeklyPay * 52), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'daily-pay-calculator',
    title: 'Daily Pay Calculator',
    description: 'Estimate daily pay from hourly rate and hours worked per day.',
    category: 'income',
    icon: 'today',
    fields: [
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: '30', min: '0', step: '0.01' },
      { key: 'hoursPerDay', label: 'Hours Per Day', type: 'number', defaultValue: '8', min: '0', step: '0.25' },
      { key: 'daysPerWeek', label: 'Days Worked Per Week', type: 'number', defaultValue: '5', min: '1', max: '7', step: '1' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursPerDay = parseNumber(values.hoursPerDay);
      const daysPerWeek = parseNumber(values.daysPerWeek, 5);
      const dailyPay = hourlyRate * hoursPerDay;
      return {
        results: [
          { key: 'dailyPay', label: 'Daily Gross Pay', value: roundTo(dailyPay), format: 'currency' },
          { key: 'weeklyPay', label: 'Weekly Gross Pay', value: roundTo(dailyPay * daysPerWeek), format: 'currency' },
          { key: 'annualized', label: 'Annualized (52 weeks)', value: roundTo(dailyPay * daysPerWeek * 52), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'semi-monthly-pay-calculator',
    title: 'Semi-Monthly Pay Calculator',
    description: 'Convert annual salary to estimated semi-monthly paycheck amount.',
    category: 'income',
    icon: 'event_repeat',
    fields: [
      { key: 'annualSalary', label: 'Annual Salary ($)', type: 'number', defaultValue: '78000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', defaultValue: '22', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const annualSalary = parseNumber(values.annualSalary);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const semiMonthlyGross = annualSalary / 24;
      const semiMonthlyNet = semiMonthlyGross * (1 - taxRate / 100);
      return {
        results: [
          { key: 'semiMonthlyGross', label: 'Semi-Monthly Gross', value: roundTo(semiMonthlyGross), format: 'currency' },
          { key: 'semiMonthlyNet', label: 'Semi-Monthly Net (est.)', value: roundTo(semiMonthlyNet), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'commission-calculator',
    title: 'Commission Calculator',
    description: 'Calculate commission earnings from sales and commission rate.',
    category: 'income',
    icon: 'paid',
    fields: [
      { key: 'salesAmount', label: 'Sales Amount ($)', type: 'number', defaultValue: '40000', min: '0', step: '0.01' },
      { key: 'commissionRate', label: 'Commission Rate (%)', type: 'number', defaultValue: '6', min: '0', max: '100', step: '0.1' },
      { key: 'basePay', label: 'Base Pay ($)', type: 'number', defaultValue: '0', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const salesAmount = parseNumber(values.salesAmount);
      const commissionRate = parseNumber(values.commissionRate);
      const basePay = parseNumber(values.basePay);
      const commission = salesAmount * (commissionRate / 100);
      return {
        results: [
          { key: 'commission', label: 'Commission Amount', value: roundTo(commission), format: 'currency' },
          { key: 'totalPay', label: 'Total Pay (Base + Commission)', value: roundTo(basePay + commission), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'bonus-tax-calculator',
    title: 'Bonus Tax Calculator',
    description: 'Estimate after-tax bonus based on your withholding rate.',
    category: 'income',
    icon: 'redeem',
    fields: [
      { key: 'bonusAmount', label: 'Bonus Amount ($)', type: 'number', defaultValue: '5000', min: '0', step: '0.01' },
      { key: 'withholdingRate', label: 'Withholding Rate (%)', type: 'number', defaultValue: '22', min: '0', max: '60', step: '0.1' },
      { key: 'stateRate', label: 'State Tax Rate (%)', type: 'number', defaultValue: '5', min: '0', max: '20', step: '0.1' },
    ],
    calculate: (values) => {
      const bonusAmount = parseNumber(values.bonusAmount);
      const withholdingRate = parseNumber(values.withholdingRate);
      const stateRate = parseNumber(values.stateRate);
      const totalRate = withholdingRate + stateRate;
      const taxes = bonusAmount * (totalRate / 100);
      return {
        results: [
          { key: 'netBonus', label: 'Estimated Net Bonus', value: roundTo(Math.max(0, bonusAmount - taxes)), format: 'currency' },
          { key: 'taxes', label: 'Estimated Taxes Withheld', value: roundTo(taxes), format: 'currency' },
          { key: 'effectiveRate', label: 'Effective Bonus Tax Rate', value: roundTo(totalRate), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'severance-pay-calculator',
    title: 'Severance Pay Calculator',
    description: 'Estimate severance payout based on weekly pay and eligible weeks.',
    category: 'income',
    icon: 'work_history',
    fields: [
      { key: 'weeklyPay', label: 'Weekly Pay ($)', type: 'number', defaultValue: '1800', min: '0', step: '0.01' },
      { key: 'severanceWeeks', label: 'Severance Weeks', type: 'number', defaultValue: '8', min: '0', step: '1' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', defaultValue: '22', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const weeklyPay = parseNumber(values.weeklyPay);
      const severanceWeeks = parseNumber(values.severanceWeeks);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const gross = weeklyPay * severanceWeeks;
      const net = gross * (1 - taxRate / 100);
      return {
        results: [
          { key: 'grossSeverance', label: 'Gross Severance', value: roundTo(gross), format: 'currency' },
          { key: 'netSeverance', label: 'Net Severance (est.)', value: roundTo(net), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'salary-percentage-increase-calculator',
    title: 'Salary Percentage Increase Calculator',
    description: 'Find the percentage increase and dollar change between old and new salary.',
    category: 'income',
    icon: 'moving',
    fields: [
      { key: 'oldSalary', label: 'Old Salary ($)', type: 'number', defaultValue: '70000', min: '0', step: '0.01' },
      { key: 'newSalary', label: 'New Salary ($)', type: 'number', defaultValue: '76000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const oldSalary = parseNumber(values.oldSalary);
      const newSalary = parseNumber(values.newSalary);
      const increase = newSalary - oldSalary;
      const percentIncrease = oldSalary !== 0 ? (increase / oldSalary) * 100 : 0;
      return {
        results: [
          { key: 'increaseAmount', label: 'Salary Change', value: roundTo(increase), format: 'currency' },
          { key: 'percentIncrease', label: 'Percentage Increase', value: roundTo(percentIncrease), format: 'percent' },
          { key: 'newMonthly', label: 'New Monthly Salary', value: roundTo(newSalary / 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'cost-of-living-adjustment-calculator',
    title: 'Cost of Living Adjustment Calculator',
    description: 'Apply a COLA percentage to estimate your adjusted salary.',
    category: 'income',
    icon: 'sync_alt',
    fields: [
      { key: 'currentSalary', label: 'Current Salary ($)', type: 'number', defaultValue: '68000', min: '0', step: '0.01' },
      { key: 'colaPercent', label: 'COLA (%)', type: 'number', defaultValue: '3.2', min: '-20', max: '50', step: '0.1' },
    ],
    calculate: (values) => {
      const currentSalary = parseNumber(values.currentSalary);
      const colaPercent = parseNumber(values.colaPercent);
      const adjustedSalary = currentSalary * (1 + colaPercent / 100);
      return {
        results: [
          { key: 'adjustedSalary', label: 'Adjusted Salary', value: roundTo(adjustedSalary), format: 'currency' },
          { key: 'salaryChange', label: 'Salary Change', value: roundTo(adjustedSalary - currentSalary), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator',
    description: 'Estimate hourly freelance rate from annual income target and billable hours.',
    category: 'income',
    icon: 'contract',
    fields: [
      { key: 'targetIncome', label: 'Target Annual Income ($)', type: 'number', defaultValue: '100000', min: '0', step: '0.01' },
      { key: 'billableHoursPerWeek', label: 'Billable Hours Per Week', type: 'number', defaultValue: '24', min: '1', step: '0.5' },
      { key: 'workingWeeks', label: 'Working Weeks Per Year', type: 'number', defaultValue: '48', min: '1', max: '52', step: '1' },
      { key: 'overheadPercent', label: 'Overhead Buffer (%)', type: 'number', defaultValue: '20', min: '0', max: '100', step: '0.1' },
    ],
    calculate: (values) => {
      const targetIncome = parseNumber(values.targetIncome);
      const billableHoursPerWeek = parseNumber(values.billableHoursPerWeek, 1);
      const workingWeeks = parseNumber(values.workingWeeks, 48);
      const overheadPercent = parseNumber(values.overheadPercent);
      const annualBillableHours = billableHoursPerWeek * workingWeeks;
      const requiredRevenue = targetIncome * (1 + overheadPercent / 100);
      const hourlyRate = annualBillableHours > 0 ? requiredRevenue / annualBillableHours : 0;
      return {
        results: [
          { key: 'hourlyRate', label: 'Suggested Hourly Rate', value: roundTo(hourlyRate), format: 'currency' },
          { key: 'requiredRevenue', label: 'Required Annual Revenue', value: roundTo(requiredRevenue), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'house-affordability-calculator',
    title: 'House Affordability Calculator',
    description: 'Estimate affordable home price from income, debt ratio, and mortgage terms.',
    category: 'home',
    icon: 'house',
    fields: [
      { key: 'annualIncome', label: 'Annual Household Income ($)', type: 'number', defaultValue: '120000', min: '0', step: '0.01' },
      { key: 'housingRatio', label: 'Housing Ratio (%)', type: 'number', defaultValue: '28', min: '10', max: '50', step: '0.1' },
      { key: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: '60000', min: '0', step: '0.01' },
      { key: 'apr', label: 'Mortgage APR (%)', type: 'number', defaultValue: '6.5', min: '0', step: '0.01' },
      { key: 'years', label: 'Loan Term (years)', type: 'number', defaultValue: '30', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const annualIncome = parseNumber(values.annualIncome);
      const housingRatio = parseNumber(values.housingRatio);
      const downPayment = parseNumber(values.downPayment);
      const apr = parseNumber(values.apr);
      const years = parseNumber(values.years, 30);
      const monthlyBudget = (annualIncome / 12) * (housingRatio / 100);
      const months = years * 12;
      const monthlyRate = apr / 100 / 12;
      const loanAmount = monthlyRate > 0
        ? monthlyBudget * ((1 - (1 + monthlyRate) ** -months) / monthlyRate)
        : monthlyBudget * months;
      const homePrice = Math.max(0, loanAmount + downPayment);
      return {
        results: [
          { key: 'affordablePrice', label: 'Estimated Affordable Home Price', value: roundTo(homePrice), format: 'currency' },
          { key: 'loanAmount', label: 'Estimated Loan Amount', value: roundTo(loanAmount), format: 'currency' },
          { key: 'monthlyBudget', label: 'Monthly Housing Budget', value: roundTo(monthlyBudget), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'adjustable-rate-mortgage-calculator',
    title: 'Adjustable Rate Mortgage Calculator',
    description: 'Compare initial ARM payment with payment after rate adjustment.',
    category: 'home',
    icon: 'home_work',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: '350000', min: '0', step: '0.01' },
      { key: 'initialRate', label: 'Initial APR (%)', type: 'number', defaultValue: '5.5', min: '0', step: '0.01' },
      { key: 'adjustedRate', label: 'Adjusted APR (%)', type: 'number', defaultValue: '7.5', min: '0', step: '0.01' },
      { key: 'initialYears', label: 'Initial Fixed Period (years)', type: 'number', defaultValue: '5', min: '1', step: '1' },
      { key: 'totalYears', label: 'Total Term (years)', type: 'number', defaultValue: '30', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const loanAmount = parseNumber(values.loanAmount);
      const initialRate = parseNumber(values.initialRate);
      const adjustedRate = parseNumber(values.adjustedRate);
      const initialYears = parseNumber(values.initialYears, 5);
      const totalYears = parseNumber(values.totalYears, 30);
      const totalMonths = totalYears * 12;
      const initialMonths = initialYears * 12;
      const initialPayment = amortizedMonthlyPayment(loanAmount, initialRate, totalMonths);
      const initialMonthlyRate = initialRate / 100 / 12;
      let remainingBalance = loanAmount;
      for (let month = 0; month < initialMonths; month += 1) {
        const interest = remainingBalance * initialMonthlyRate;
        const principal = Math.max(0, initialPayment - interest);
        remainingBalance = Math.max(0, remainingBalance - principal);
      }
      const remainingMonths = Math.max(1, totalMonths - initialMonths);
      const adjustedPayment = amortizedMonthlyPayment(remainingBalance, adjustedRate, remainingMonths);
      return {
        results: [
          { key: 'initialPayment', label: 'Initial Monthly Payment', value: roundTo(initialPayment), format: 'currency' },
          { key: 'adjustedPayment', label: 'Adjusted Monthly Payment', value: roundTo(adjustedPayment), format: 'currency' },
          { key: 'paymentChange', label: 'Payment Change', value: roundTo(adjustedPayment - initialPayment), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'refinance-break-even-calculator',
    title: 'Refinance Break-Even Calculator',
    description: 'Estimate how many months it takes for refinance savings to cover costs.',
    category: 'loans',
    icon: 'balance',
    fields: [
      { key: 'currentPayment', label: 'Current Monthly Payment ($)', type: 'number', defaultValue: '2450', min: '0', step: '0.01' },
      { key: 'newPayment', label: 'New Monthly Payment ($)', type: 'number', defaultValue: '2180', min: '0', step: '0.01' },
      { key: 'refinanceCosts', label: 'Refinance Costs ($)', type: 'number', defaultValue: '6500', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const currentPayment = parseNumber(values.currentPayment);
      const newPayment = parseNumber(values.newPayment);
      const refinanceCosts = parseNumber(values.refinanceCosts);
      const monthlySavings = currentPayment - newPayment;
      const breakEvenMonths = monthlySavings > 0 ? refinanceCosts / monthlySavings : 0;
      return {
        results: [
          { key: 'monthlySavings', label: 'Monthly Savings', value: roundTo(monthlySavings), format: 'currency' },
          { key: 'breakEvenMonths', label: 'Break-Even Time (months)', value: roundTo(breakEvenMonths, 1), format: 'number' },
          { key: 'breakEvenYears', label: 'Break-Even Time (years)', value: roundTo(breakEvenMonths / 12, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'mortgage-extra-payment-calculator',
    title: 'Mortgage Extra Payment Calculator',
    description: 'See how extra monthly payments can reduce interest and loan term.',
    category: 'home',
    icon: 'savings',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: '320000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.1', min: '0', step: '0.01' },
      { key: 'termMonths', label: 'Term (months)', type: 'number', defaultValue: '360', min: '1', step: '1' },
      { key: 'extraMonthly', label: 'Extra Monthly Payment ($)', type: 'number', defaultValue: '200', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const loanAmount = parseNumber(values.loanAmount);
      const apr = parseNumber(values.apr);
      const termMonths = parseNumber(values.termMonths, 360);
      const extraMonthly = parseNumber(values.extraMonthly);
      const base = calculateAmortizationSchedule(loanAmount, apr, termMonths, 0);
      const accelerated = calculateAmortizationSchedule(loanAmount, apr, termMonths, extraMonthly);
      return {
        results: [
          { key: 'basePayment', label: 'Base Monthly Payment', value: roundTo(base.payment), format: 'currency' },
          { key: 'acceleratedMonths', label: 'Payoff Time with Extra (months)', value: accelerated.schedule.length, format: 'integer' },
          { key: 'monthsSaved', label: 'Months Saved', value: Math.max(0, base.schedule.length - accelerated.schedule.length), format: 'integer' },
          { key: 'interestSaved', label: 'Interest Saved', value: roundTo(base.totalInterest - accelerated.totalInterest), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'mortgage-early-payoff-calculator',
    title: 'Mortgage Early Payoff Calculator',
    description: 'Estimate required monthly payment to pay off a mortgage earlier.',
    category: 'home',
    icon: 'flag',
    fields: [
      { key: 'loanAmount', label: 'Loan Balance ($)', type: 'number', defaultValue: '285000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.25', min: '0', step: '0.01' },
      { key: 'currentMonths', label: 'Current Remaining Months', type: 'number', defaultValue: '300', min: '1', step: '1' },
      { key: 'targetMonths', label: 'Target Payoff Months', type: 'number', defaultValue: '180', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const loanAmount = parseNumber(values.loanAmount);
      const apr = parseNumber(values.apr);
      const currentMonths = parseNumber(values.currentMonths, 300);
      const targetMonths = parseNumber(values.targetMonths, 180);
      const currentPayment = amortizedMonthlyPayment(loanAmount, apr, currentMonths);
      const targetPayment = amortizedMonthlyPayment(loanAmount, apr, Math.max(1, targetMonths));
      return {
        results: [
          { key: 'currentPayment', label: 'Current Required Payment', value: roundTo(currentPayment), format: 'currency' },
          { key: 'targetPayment', label: 'Payment for Target Payoff', value: roundTo(targetPayment), format: 'currency' },
          { key: 'extraNeeded', label: 'Extra Needed Per Month', value: roundTo(Math.max(0, targetPayment - currentPayment)), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'loan-term-calculator',
    title: 'Loan Term Calculator',
    description: 'Estimate loan payoff duration from balance, rate, and monthly payment.',
    category: 'loans',
    icon: 'timer',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: '20000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '8.5', min: '0', step: '0.01' },
      { key: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number', defaultValue: '420', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const loanAmount = parseNumber(values.loanAmount);
      const apr = parseNumber(values.apr);
      const monthlyPayment = parseNumber(values.monthlyPayment);
      const monthlyRate = apr / 100 / 12;
      let months = 0;

      if (monthlyRate > 0 && monthlyPayment > loanAmount * monthlyRate) {
        months = Math.log(monthlyPayment / (monthlyPayment - loanAmount * monthlyRate)) / Math.log(1 + monthlyRate);
      } else if (monthlyRate === 0 && monthlyPayment > 0) {
        months = loanAmount / monthlyPayment;
      }

      const boundedMonths = Number.isFinite(months) ? Math.max(0, months) : 0;
      return {
        results: [
          { key: 'months', label: 'Estimated Payoff Months', value: roundTo(boundedMonths, 1), format: 'number' },
          { key: 'years', label: 'Estimated Payoff Years', value: roundTo(boundedMonths / 12, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator',
    description: 'Calculate simple interest earned over a fixed period.',
    category: 'loans',
    icon: 'calculate',
    fields: [
      { key: 'principal', label: 'Principal ($)', type: 'number', defaultValue: '10000', min: '0', step: '0.01' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '5', min: '0', step: '0.01' },
      { key: 'years', label: 'Time (years)', type: 'number', defaultValue: '4', min: '0', step: '0.1' },
    ],
    calculate: (values) => {
      const principal = parseNumber(values.principal);
      const rate = parseNumber(values.rate);
      const years = parseNumber(values.years);
      const interest = principal * (rate / 100) * years;
      return {
        results: [
          { key: 'interest', label: 'Simple Interest', value: roundTo(interest), format: 'currency' },
          { key: 'total', label: 'Total Amount', value: roundTo(principal + interest), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'compound-daily-interest-calculator',
    title: 'Compound Daily Interest Calculator',
    description: 'Estimate growth with daily compounding interest.',
    category: 'loans',
    icon: 'calendar_month',
    fields: [
      { key: 'principal', label: 'Principal ($)', type: 'number', defaultValue: '12000', min: '0', step: '0.01' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '4.75', min: '0', step: '0.01' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '5', min: '0', step: '0.1' },
    ],
    calculate: (values) => {
      const principal = parseNumber(values.principal);
      const rate = parseNumber(values.rate);
      const years = parseNumber(values.years);
      const amount = principal * (1 + rate / 100 / 365) ** (365 * years);
      return {
        results: [
          { key: 'futureValue', label: 'Future Value', value: roundTo(amount), format: 'currency' },
          { key: 'interestEarned', label: 'Interest Earned', value: roundTo(amount - principal), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'compound-monthly-interest-calculator',
    title: 'Compound Monthly Interest Calculator',
    description: 'Estimate growth with monthly compounding interest.',
    category: 'loans',
    icon: 'date_range',
    fields: [
      { key: 'principal', label: 'Principal ($)', type: 'number', defaultValue: '12000', min: '0', step: '0.01' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '4.75', min: '0', step: '0.01' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '5', min: '0', step: '0.1' },
    ],
    calculate: (values) => {
      const principal = parseNumber(values.principal);
      const rate = parseNumber(values.rate);
      const years = parseNumber(values.years);
      const amount = principal * (1 + rate / 100 / 12) ** (12 * years);
      return {
        results: [
          { key: 'futureValue', label: 'Future Value', value: roundTo(amount), format: 'currency' },
          { key: 'interestEarned', label: 'Interest Earned', value: roundTo(amount - principal), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'debt-consolidation-calculator',
    title: 'Debt Consolidation Calculator',
    description: 'Compare current debt payment estimate to a consolidated loan payment.',
    category: 'loans',
    icon: 'account_balance',
    fields: [
      { key: 'totalDebt', label: 'Total Debt Balance ($)', type: 'number', defaultValue: '28000', min: '0', step: '0.01' },
      { key: 'currentApr', label: 'Current Avg APR (%)', type: 'number', defaultValue: '19', min: '0', step: '0.01' },
      { key: 'newApr', label: 'Consolidation APR (%)', type: 'number', defaultValue: '11', min: '0', step: '0.01' },
      { key: 'termMonths', label: 'Consolidation Term (months)', type: 'number', defaultValue: '60', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const totalDebt = parseNumber(values.totalDebt);
      const currentApr = parseNumber(values.currentApr);
      const newApr = parseNumber(values.newApr);
      const termMonths = parseNumber(values.termMonths, 60);
      const currentPayment = amortizedMonthlyPayment(totalDebt, currentApr, termMonths);
      const consolidatedPayment = amortizedMonthlyPayment(totalDebt, newApr, termMonths);
      return {
        results: [
          { key: 'currentPayment', label: 'Estimated Current Payment', value: roundTo(currentPayment), format: 'currency' },
          { key: 'consolidatedPayment', label: 'Consolidated Payment', value: roundTo(consolidatedPayment), format: 'currency' },
          { key: 'monthlySavings', label: 'Monthly Savings', value: roundTo(currentPayment - consolidatedPayment), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'balance-transfer-calculator',
    title: 'Balance Transfer Calculator',
    description: 'Estimate costs and potential savings from a promotional balance transfer.',
    category: 'loans',
    icon: 'swap_horiz',
    fields: [
      { key: 'balance', label: 'Transferred Balance ($)', type: 'number', defaultValue: '9000', min: '0', step: '0.01' },
      { key: 'currentApr', label: 'Current APR (%)', type: 'number', defaultValue: '22', min: '0', step: '0.01' },
      { key: 'promoApr', label: 'Promo APR (%)', type: 'number', defaultValue: '0', min: '0', step: '0.01' },
      { key: 'promoMonths', label: 'Promo Period (months)', type: 'number', defaultValue: '15', min: '1', step: '1' },
      { key: 'transferFee', label: 'Transfer Fee (%)', type: 'number', defaultValue: '3', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const balance = parseNumber(values.balance);
      const currentApr = parseNumber(values.currentApr);
      const promoApr = parseNumber(values.promoApr);
      const promoMonths = parseNumber(values.promoMonths, 12);
      const transferFee = parseNumber(values.transferFee);
      const monthlyPayment = promoMonths > 0 ? balance / promoMonths : 0;
      const currentSchedule = calculateAmortizationSchedule(balance, currentApr, Math.max(1, promoMonths), 0);
      const promoSchedule = calculateAmortizationSchedule(balance, promoApr, Math.max(1, promoMonths), 0);
      const feeAmount = balance * (transferFee / 100);
      const totalPromoCost = promoSchedule.totalInterest + feeAmount;
      return {
        results: [
          { key: 'suggestedPayment', label: 'Suggested Monthly Payment', value: roundTo(monthlyPayment), format: 'currency' },
          { key: 'promoCost', label: 'Promo Interest + Fee', value: roundTo(totalPromoCost), format: 'currency' },
          { key: 'estimatedSavings', label: 'Estimated Savings', value: roundTo(currentSchedule.totalInterest - totalPromoCost), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'credit-utilization-calculator',
    title: 'Credit Utilization Calculator',
    description: 'Calculate your credit utilization ratio across all revolving accounts.',
    category: 'loans',
    icon: 'credit_score',
    fields: [
      { key: 'totalBalance', label: 'Total Credit Card Balance ($)', type: 'number', defaultValue: '3500', min: '0', step: '0.01' },
      { key: 'totalLimit', label: 'Total Credit Limit ($)', type: 'number', defaultValue: '15000', min: '1', step: '0.01' },
    ],
    calculate: (values) => {
      const totalBalance = parseNumber(values.totalBalance);
      const totalLimit = parseNumber(values.totalLimit, 1);
      const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
      return {
        results: [
          { key: 'utilization', label: 'Credit Utilization', value: roundTo(utilization), format: 'percent' },
          { key: 'available', label: 'Available Credit', value: roundTo(Math.max(0, totalLimit - totalBalance)), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'home-appreciation-calculator',
    title: 'Home Appreciation Calculator',
    description: 'Project future home value based on annual appreciation rate.',
    category: 'home',
    icon: 'real_estate_agent',
    fields: [
      { key: 'currentValue', label: 'Current Home Value ($)', type: 'number', defaultValue: '420000', min: '0', step: '0.01' },
      { key: 'appreciationRate', label: 'Annual Appreciation (%)', type: 'number', defaultValue: '3.5', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '10', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const currentValue = parseNumber(values.currentValue);
      const appreciationRate = parseNumber(values.appreciationRate);
      const years = parseNumber(values.years);
      const futureValue = currentValue * (1 + appreciationRate / 100) ** years;
      return {
        results: [
          { key: 'futureValue', label: 'Projected Home Value', value: roundTo(futureValue), format: 'currency' },
          { key: 'gain', label: 'Estimated Appreciation Gain', value: roundTo(futureValue - currentValue), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'rental-cash-flow-calculator',
    title: 'Rental Cash Flow Calculator',
    description: 'Estimate monthly and annual rental property cash flow.',
    category: 'home',
    icon: 'apartment',
    fields: [
      { key: 'rent', label: 'Monthly Rent ($)', type: 'number', defaultValue: '2400', min: '0', step: '0.01' },
      { key: 'mortgage', label: 'Mortgage Payment ($)', type: 'number', defaultValue: '1450', min: '0', step: '0.01' },
      { key: 'otherExpenses', label: 'Other Monthly Expenses ($)', type: 'number', defaultValue: '450', min: '0', step: '0.01' },
      { key: 'vacancyRate', label: 'Vacancy Rate (%)', type: 'number', defaultValue: '5', min: '0', max: '100', step: '0.1' },
    ],
    calculate: (values) => {
      const rent = parseNumber(values.rent);
      const mortgage = parseNumber(values.mortgage);
      const otherExpenses = parseNumber(values.otherExpenses);
      const vacancyRate = parseNumber(values.vacancyRate);
      const effectiveRent = rent * (1 - vacancyRate / 100);
      const monthlyCashFlow = effectiveRent - mortgage - otherExpenses;
      return {
        results: [
          { key: 'monthlyCashFlow', label: 'Monthly Cash Flow', value: roundTo(monthlyCashFlow), format: 'currency' },
          { key: 'annualCashFlow', label: 'Annual Cash Flow', value: roundTo(monthlyCashFlow * 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'rent-vs-invest-calculator',
    title: 'Rent vs Invest Calculator',
    description: 'Compare investing the monthly housing cost difference over time.',
    category: 'home',
    icon: 'show_chart',
    fields: [
      { key: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', defaultValue: '2200', min: '0', step: '0.01' },
      { key: 'monthlyOwnershipCost', label: 'Monthly Ownership Cost ($)', type: 'number', defaultValue: '2850', min: '0', step: '0.01' },
      { key: 'investmentReturn', label: 'Annual Investment Return (%)', type: 'number', defaultValue: '7', min: '0', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '10', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const monthlyRent = parseNumber(values.monthlyRent);
      const monthlyOwnershipCost = parseNumber(values.monthlyOwnershipCost);
      const investmentReturn = parseNumber(values.investmentReturn);
      const years = parseNumber(values.years);
      const monthlyDifference = Math.max(0, monthlyOwnershipCost - monthlyRent);
      const monthlyRate = investmentReturn / 100 / 12;
      const months = years * 12;
      const futureValue = monthlyRate > 0
        ? monthlyDifference * (((1 + monthlyRate) ** months - 1) / monthlyRate)
        : monthlyDifference * months;
      return {
        results: [
          { key: 'monthlyDifference', label: 'Monthly Amount Available to Invest', value: roundTo(monthlyDifference), format: 'currency' },
          { key: 'futureValue', label: 'Projected Investment Value', value: roundTo(futureValue), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'property-value-estimator',
    title: 'Property Value Estimator',
    description: 'Estimate property value using area and local price per square foot.',
    category: 'home',
    icon: 'straighten',
    fields: [
      { key: 'squareFeet', label: 'Square Feet', type: 'number', defaultValue: '2200', min: '0', step: '1' },
      { key: 'pricePerSqFt', label: 'Price per Sq Ft ($)', type: 'number', defaultValue: '260', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const squareFeet = parseNumber(values.squareFeet);
      const pricePerSqFt = parseNumber(values.pricePerSqFt);
      const estimatedValue = squareFeet * pricePerSqFt;
      return {
        results: [
          { key: 'estimatedValue', label: 'Estimated Property Value', value: roundTo(estimatedValue), format: 'currency' },
          { key: 'pricePerSqFt', label: 'Price per Sq Ft', value: roundTo(pricePerSqFt), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'closing-cost-percentage-calculator',
    title: 'Closing Cost Percentage Calculator',
    description: 'Calculate closing costs as a percentage of purchase price.',
    category: 'home',
    icon: 'percent',
    fields: [
      { key: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', defaultValue: '450000', min: '0', step: '0.01' },
      { key: 'closingCosts', label: 'Closing Costs ($)', type: 'number', defaultValue: '9000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const purchasePrice = parseNumber(values.purchasePrice);
      const closingCosts = parseNumber(values.closingCosts);
      const percentage = purchasePrice > 0 ? (closingCosts / purchasePrice) * 100 : 0;
      return {
        results: [
          { key: 'percentage', label: 'Closing Cost Percentage', value: roundTo(percentage), format: 'percent' },
          { key: 'remaining', label: 'Purchase Price Minus Closing', value: roundTo(purchasePrice - closingCosts), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator',
    description: 'Find break-even units and revenue from fixed and variable costs.',
    category: 'income',
    icon: 'equalizer',
    fields: [
      { key: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', defaultValue: '15000', min: '0', step: '0.01' },
      { key: 'pricePerUnit', label: 'Price per Unit ($)', type: 'number', defaultValue: '35', min: '0', step: '0.01' },
      { key: 'variableCostPerUnit', label: 'Variable Cost per Unit ($)', type: 'number', defaultValue: '18', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const fixedCosts = parseNumber(values.fixedCosts);
      const pricePerUnit = parseNumber(values.pricePerUnit);
      const variableCostPerUnit = parseNumber(values.variableCostPerUnit);
      const contribution = pricePerUnit - variableCostPerUnit;
      const breakEvenUnits = contribution > 0 ? fixedCosts / contribution : 0;
      return {
        results: [
          { key: 'breakEvenUnits', label: 'Break-Even Units', value: roundTo(breakEvenUnits, 1), format: 'number' },
          { key: 'breakEvenRevenue', label: 'Break-Even Revenue', value: roundTo(breakEvenUnits * pricePerUnit), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'profit-margin-calculator',
    title: 'Profit Margin Calculator',
    description: 'Calculate profit amount and margin percentage from revenue and cost.',
    category: 'percentages',
    icon: 'stacked_line_chart',
    fields: [
      { key: 'revenue', label: 'Revenue ($)', type: 'number', defaultValue: '120000', min: '0', step: '0.01' },
      { key: 'cost', label: 'Cost ($)', type: 'number', defaultValue: '86000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const revenue = parseNumber(values.revenue);
      const cost = parseNumber(values.cost);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      return {
        results: [
          { key: 'profit', label: 'Profit', value: roundTo(profit), format: 'currency' },
          { key: 'margin', label: 'Profit Margin', value: roundTo(margin), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'cash-flow-calculator',
    title: 'Cash Flow Calculator',
    description: 'Estimate net cash flow from monthly inflows and outflows.',
    category: 'income',
    icon: 'account_balance_wallet',
    fields: [
      { key: 'cashIn', label: 'Monthly Cash In ($)', type: 'number', defaultValue: '15000', min: '0', step: '0.01' },
      { key: 'cashOut', label: 'Monthly Cash Out ($)', type: 'number', defaultValue: '12100', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const cashIn = parseNumber(values.cashIn);
      const cashOut = parseNumber(values.cashOut);
      const net = cashIn - cashOut;
      return {
        results: [
          { key: 'monthlyNet', label: 'Monthly Net Cash Flow', value: roundTo(net), format: 'currency' },
          { key: 'annualNet', label: 'Annual Net Cash Flow', value: roundTo(net * 12), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator',
    description: 'Calculate total with tax and pre-tax amount from sales tax rate.',
    category: 'percentages',
    icon: 'request_quote',
    fields: [
      { key: 'price', label: 'Price Before Tax ($)', type: 'number', defaultValue: '89.99', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: '8.25', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const price = parseNumber(values.price);
      const taxRate = parseNumber(values.taxRate);
      const taxAmount = price * (taxRate / 100);
      return {
        results: [
          { key: 'taxAmount', label: 'Sales Tax Amount', value: roundTo(taxAmount), format: 'currency' },
          { key: 'totalPrice', label: 'Total Price', value: roundTo(price + taxAmount), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'depreciation-calculator',
    title: 'Depreciation Calculator',
    description: 'Estimate straight-line annual and monthly depreciation.',
    category: 'income',
    icon: 'trending_down',
    fields: [
      { key: 'assetCost', label: 'Asset Cost ($)', type: 'number', defaultValue: '25000', min: '0', step: '0.01' },
      { key: 'salvageValue', label: 'Salvage Value ($)', type: 'number', defaultValue: '5000', min: '0', step: '0.01' },
      { key: 'usefulLifeYears', label: 'Useful Life (years)', type: 'number', defaultValue: '5', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const assetCost = parseNumber(values.assetCost);
      const salvageValue = parseNumber(values.salvageValue);
      const usefulLifeYears = parseNumber(values.usefulLifeYears, 1);
      const depreciableBase = Math.max(0, assetCost - salvageValue);
      const annualDepreciation = usefulLifeYears > 0 ? depreciableBase / usefulLifeYears : 0;
      return {
        results: [
          { key: 'annualDepreciation', label: 'Annual Depreciation', value: roundTo(annualDepreciation), format: 'currency' },
          { key: 'monthlyDepreciation', label: 'Monthly Depreciation', value: roundTo(annualDepreciation / 12), format: 'currency' },
          { key: 'depreciableBase', label: 'Depreciable Base', value: roundTo(depreciableBase), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'inflation-adjusted-return-calculator',
    title: 'Inflation Adjusted Return Calculator',
    description: 'Convert nominal investment return to real (inflation-adjusted) return.',
    category: 'percentages',
    icon: 'price_change',
    fields: [
      { key: 'initialAmount', label: 'Initial Amount ($)', type: 'number', defaultValue: '25000', min: '0', step: '0.01' },
      { key: 'nominalReturn', label: 'Nominal Annual Return (%)', type: 'number', defaultValue: '8', step: '0.1' },
      { key: 'inflationRate', label: 'Inflation Rate (%)', type: 'number', defaultValue: '3', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '10', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const initialAmount = parseNumber(values.initialAmount);
      const nominalReturn = parseNumber(values.nominalReturn);
      const inflationRate = parseNumber(values.inflationRate);
      const years = parseNumber(values.years, 1);
      const nominalFuture = initialAmount * (1 + nominalReturn / 100) ** years;
      const inflationFactor = (1 + inflationRate / 100) ** years;
      const realFuture = inflationFactor > 0 ? nominalFuture / inflationFactor : nominalFuture;
      const realAnnualRate = ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
      return {
        results: [
          { key: 'realFutureValue', label: 'Inflation-Adjusted Future Value', value: roundTo(realFuture), format: 'currency' },
          { key: 'realAnnualRate', label: 'Real Annual Return', value: roundTo(realAnnualRate), format: 'percent' },
          { key: 'purchasingPowerChange', label: 'Real Gain/Loss', value: roundTo(realFuture - initialAmount), format: 'currency' },
        ],
      };
    },
  },
  {
    slug: 'age-in-days-calculator',
    title: 'Age in Days Calculator',
    description: 'Calculate exact age in days from date of birth to today.',
    category: 'time',
    icon: 'calendar_today',
    fields: [
      { key: 'birthDate', label: 'Date of Birth', type: 'date', defaultValue: '1990-01-01' },
      { key: 'asOfDate', label: 'As of Date', type: 'date', defaultValue: '2026-02-25' },
    ],
    calculate: (values) => {
      const birthDate = new Date(values.birthDate);
      const asOfDate = new Date(values.asOfDate);
      const days = diffDays(birthDate, asOfDate);
      return {
        results: [
          { key: 'ageDays', label: 'Age in Days', value: Math.max(0, days), format: 'integer' },
          { key: 'ageYearsApprox', label: 'Approximate Age in Years', value: roundTo(Math.max(0, days) / 365.2425, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'age-in-months-calculator',
    title: 'Age in Months Calculator',
    description: 'Calculate age in complete months between two dates.',
    category: 'time',
    icon: 'date_range',
    fields: [
      { key: 'birthDate', label: 'Date of Birth', type: 'date', defaultValue: '1990-01-01' },
      { key: 'asOfDate', label: 'As of Date', type: 'date', defaultValue: '2026-02-25' },
    ],
    calculate: (values) => {
      const birthDate = new Date(values.birthDate);
      const asOfDate = new Date(values.asOfDate);
      let months = (asOfDate.getFullYear() - birthDate.getFullYear()) * 12 + (asOfDate.getMonth() - birthDate.getMonth());
      if (asOfDate.getDate() < birthDate.getDate()) months -= 1;
      const completeMonths = Math.max(0, months);
      return {
        results: [
          { key: 'ageMonths', label: 'Age in Complete Months', value: completeMonths, format: 'integer' },
          { key: 'ageYears', label: 'Age in Years (approx)', value: roundTo(completeMonths / 12, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'days-until-calculator',
    title: 'Days Until Calculator',
    description: 'Calculate number of days from today (or custom start) until a target date.',
    category: 'time',
    icon: 'event',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date', defaultValue: '2026-02-25' },
      { key: 'targetDate', label: 'Target Date', type: 'date', defaultValue: '2026-12-31' },
    ],
    calculate: (values) => {
      const startDate = new Date(values.startDate);
      const targetDate = new Date(values.targetDate);
      const days = diffDays(startDate, targetDate);
      return {
        results: [
          { key: 'daysUntil', label: 'Days Until Target', value: days, format: 'integer' },
          { key: 'weeksUntil', label: 'Weeks Until Target', value: roundTo(days / 7, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'months-between-dates-calculator',
    title: 'Months Between Dates Calculator',
    description: 'Calculate complete and fractional months between two dates.',
    category: 'time',
    icon: 'calendar_view_month',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date', defaultValue: '2025-01-15' },
      { key: 'endDate', label: 'End Date', type: 'date', defaultValue: '2026-02-25' },
    ],
    calculate: (values) => {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      let completeMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      if (endDate.getDate() < startDate.getDate()) completeMonths -= 1;
      const days = diffDays(startDate, endDate);
      return {
        results: [
          { key: 'completeMonths', label: 'Complete Months', value: Math.max(0, completeMonths), format: 'integer' },
          { key: 'fractionalMonths', label: 'Approximate Months', value: roundTo(days / 30.4375, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'hours-to-days-calculator',
    title: 'Hours to Days Calculator',
    description: 'Convert hours to equivalent days and remaining hours.',
    category: 'time',
    icon: 'schedule',
    fields: [
      { key: 'hours', label: 'Hours', type: 'number', defaultValue: '100', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const hours = parseNumber(values.hours);
      const days = hours / 24;
      const wholeDays = Math.floor(hours / 24);
      const remainingHours = hours - wholeDays * 24;
      return {
        results: [
          { key: 'days', label: 'Days', value: roundTo(days, 4), format: 'number' },
          { key: 'split', label: 'Whole Days + Remaining Hours', value: `${wholeDays} days ${roundTo(remainingHours, 2)} hours`, format: 'text' },
        ],
      };
    },
  },
  {
    slug: 'square-footage-calculator',
    title: 'Square Footage Calculator',
    description: 'Calculate area in square feet from rectangular dimensions.',
    category: 'home',
    icon: 'square_foot',
    fields: [
      { key: 'lengthFeet', label: 'Length (ft)', type: 'number', defaultValue: '24', min: '0', step: '0.01' },
      { key: 'widthFeet', label: 'Width (ft)', type: 'number', defaultValue: '18', min: '0', step: '0.01' },
      { key: 'quantity', label: 'Number of Areas', type: 'number', defaultValue: '1', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const lengthFeet = parseNumber(values.lengthFeet);
      const widthFeet = parseNumber(values.widthFeet);
      const quantity = parseNumber(values.quantity, 1);
      const area = lengthFeet * widthFeet * quantity;
      return {
        results: [
          { key: 'squareFeet', label: 'Total Square Feet', value: roundTo(area), format: 'number' },
          { key: 'squareMeters', label: 'Square Meters', value: roundTo(area * 0.092903, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'cubic-feet-calculator',
    title: 'Cubic Feet Calculator',
    description: 'Calculate volume in cubic feet from length, width, and height.',
    category: 'home',
    icon: 'view_in_ar',
    fields: [
      { key: 'lengthFeet', label: 'Length (ft)', type: 'number', defaultValue: '10', min: '0', step: '0.01' },
      { key: 'widthFeet', label: 'Width (ft)', type: 'number', defaultValue: '8', min: '0', step: '0.01' },
      { key: 'heightFeet', label: 'Height (ft)', type: 'number', defaultValue: '9', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const lengthFeet = parseNumber(values.lengthFeet);
      const widthFeet = parseNumber(values.widthFeet);
      const heightFeet = parseNumber(values.heightFeet);
      const cubicFeet = lengthFeet * widthFeet * heightFeet;
      return {
        results: [
          { key: 'cubicFeet', label: 'Cubic Feet', value: roundTo(cubicFeet), format: 'number' },
          { key: 'cubicMeters', label: 'Cubic Meters', value: roundTo(cubicFeet * 0.0283168, 3), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'percent-error-calculator',
    title: 'Percent Error Calculator',
    description: 'Calculate percent error between measured and true values.',
    category: 'percentages',
    icon: 'rule',
    fields: [
      { key: 'measuredValue', label: 'Measured Value', type: 'number', defaultValue: '97', step: '0.01' },
      { key: 'trueValue', label: 'True Value', type: 'number', defaultValue: '100', step: '0.01' },
    ],
    calculate: (values) => {
      const measuredValue = parseNumber(values.measuredValue);
      const trueValue = parseNumber(values.trueValue);
      const error = trueValue !== 0 ? Math.abs((measuredValue - trueValue) / trueValue) * 100 : 0;
      return {
        results: [
          { key: 'percentError', label: 'Percent Error', value: roundTo(error), format: 'percent' },
          { key: 'difference', label: 'Absolute Difference', value: roundTo(Math.abs(measuredValue - trueValue)), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'percent-difference-calculator',
    title: 'Percent Difference Calculator',
    description: 'Calculate percent difference between two values.',
    category: 'percentages',
    icon: 'compare_arrows',
    fields: [
      { key: 'valueA', label: 'Value A', type: 'number', defaultValue: '42', step: '0.01' },
      { key: 'valueB', label: 'Value B', type: 'number', defaultValue: '50', step: '0.01' },
    ],
    calculate: (values) => {
      const valueA = parseNumber(values.valueA);
      const valueB = parseNumber(values.valueB);
      const average = (Math.abs(valueA) + Math.abs(valueB)) / 2;
      const percentDifference = average > 0 ? (Math.abs(valueA - valueB) / average) * 100 : 0;
      return {
        results: [
          { key: 'percentDifference', label: 'Percent Difference', value: roundTo(percentDifference), format: 'percent' },
          { key: 'difference', label: 'Absolute Difference', value: roundTo(Math.abs(valueA - valueB)), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'margin-vs-markup-calculator',
    title: 'Margin vs Markup Calculator',
    description: 'Compare margin and markup from selling price and cost.',
    category: 'percentages',
    icon: 'insights',
    fields: [
      { key: 'sellingPrice', label: 'Selling Price ($)', type: 'number', defaultValue: '120', min: '0', step: '0.01' },
      { key: 'cost', label: 'Cost ($)', type: 'number', defaultValue: '75', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const sellingPrice = parseNumber(values.sellingPrice);
      const cost = parseNumber(values.cost);
      const profit = sellingPrice - cost;
      const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;
      return {
        results: [
          { key: 'profit', label: 'Profit', value: roundTo(profit), format: 'currency' },
          { key: 'margin', label: 'Margin', value: roundTo(margin), format: 'percent' },
          { key: 'markup', label: 'Markup', value: roundTo(markup), format: 'percent' },
        ],
      };
    },
  },
  {
    slug: 'calorie-deficit-calculator',
    title: 'Calorie Deficit Calculator',
    description: 'Estimate expected weekly weight change from calorie deficit.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [
      { key: 'maintenanceCalories', label: 'Maintenance Calories / Day', type: 'number', defaultValue: '2400', min: '0', step: '1' },
      { key: 'targetCalories', label: 'Target Calories / Day', type: 'number', defaultValue: '1900', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const maintenanceCalories = parseNumber(values.maintenanceCalories);
      const targetCalories = parseNumber(values.targetCalories);
      const dailyDeficit = maintenanceCalories - targetCalories;
      const weeklyDeficit = dailyDeficit * 7;
      const weeklyWeightChangeLb = weeklyDeficit / 3500;
      return {
        results: [
          { key: 'dailyDeficit', label: 'Daily Calorie Deficit', value: roundTo(dailyDeficit), format: 'number' },
          { key: 'weeklyDeficit', label: 'Weekly Calorie Deficit', value: roundTo(weeklyDeficit), format: 'number' },
          { key: 'weeklyWeightChange', label: 'Estimated Weekly Weight Change (lb)', value: roundTo(weeklyWeightChangeLb, 2), format: 'number' },
        ],
      };
    },
  },
  {
    slug: 'pregnancy-due-date-calculator',
    title: 'Pregnancy Due Date Calculator',
    description: 'Estimate due date based on the first day of the last menstrual period.',
    category: 'health',
    icon: 'pregnant_woman',
    fields: [
      { key: 'lmpDate', label: 'Last Menstrual Period (LMP)', type: 'date', defaultValue: '2026-01-01' },
    ],
    calculate: (values) => {
      const lmpDate = new Date(values.lmpDate);
      const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      const today = new Date('2026-02-25');
      const gestationDays = diffDays(lmpDate, today);
      const daysRemaining = diffDays(today, dueDate);
      return {
        results: [
          { key: 'dueDate', label: 'Estimated Due Date', value: dueDate.toLocaleDateString(), format: 'date' },
          { key: 'gestationWeeks', label: 'Gestational Age (weeks)', value: roundTo(Math.max(0, gestationDays) / 7, 1), format: 'number' },
          { key: 'daysRemaining', label: 'Days Until Due Date', value: daysRemaining, format: 'integer' },
        ],
      };
    },
  },
  {
    slug: 'resting-metabolic-rate-calculator',
    title: 'Resting Metabolic Rate Calculator',
    description: 'Estimate resting metabolic rate using the Mifflin-St Jeor equation.',
    category: 'health',
    icon: 'monitor_weight',
    fields: [
      {
        key: 'sex',
        label: 'Sex',
        type: 'select',
        defaultValue: 'male',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
      { key: 'age', label: 'Age (years)', type: 'number', defaultValue: '32', min: '1', step: '1' },
      { key: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: '78', min: '1', step: '0.1' },
      { key: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: '178', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const age = parseNumber(values.age);
      const weightKg = parseNumber(values.weightKg);
      const heightCm = parseNumber(values.heightCm);
      const sexAdj = values.sex === 'male' ? 5 : -161;
      const rmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdj;
      return {
        results: [
          { key: 'rmr', label: 'Estimated RMR (kcal/day)', value: roundTo(rmr), format: 'number' },
          { key: 'weeklyRmr', label: 'Estimated Weekly RMR', value: roundTo(rmr * 7), format: 'number' },
        ],
      };
    },
  },
];

const additionalGeneratedCalculators: Omit<GeneratedCalculatorConfig, 'relatedTools' | 'howItWorks' | 'tip' | 'fact' | 'note' | 'faqs'>[] = [
  {
    slug: 'net-pay-calculator',
    title: 'Net Pay Calculator',
    description: 'Estimate net pay after taxes and pre-tax deductions.',
    category: 'income',
    icon: 'account_balance_wallet',
    fields: [
      { key: 'grossPay', label: 'Gross Pay ($)', type: 'number', defaultValue: '3000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', defaultValue: '24', min: '0', max: '70', step: '0.1' },
      { key: 'preTaxDeductions', label: 'Pre-Tax Deductions ($)', type: 'number', defaultValue: '200', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const grossPay = parseNumber(values.grossPay);
      const preTaxDeductions = parseNumber(values.preTaxDeductions);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const taxable = Math.max(0, grossPay - preTaxDeductions);
      const taxes = taxable * (taxRate / 100);
      return { results: [
        { key: 'taxable', label: 'Taxable Pay', value: roundTo(taxable), format: 'currency' },
        { key: 'taxes', label: 'Estimated Taxes', value: roundTo(taxes), format: 'currency' },
        { key: 'net', label: 'Estimated Net Pay', value: roundTo(taxable - taxes), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'gross-pay-calculator',
    title: 'Gross Pay Calculator',
    description: 'Calculate gross pay from hourly rate and hours worked.',
    category: 'income',
    icon: 'payments',
    fields: [
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: '30', min: '0', step: '0.01' },
      { key: 'hoursWorked', label: 'Hours Worked', type: 'number', defaultValue: '40', min: '0', step: '0.25' },
      { key: 'overtimeMultiplier', label: 'Overtime Multiplier', type: 'number', defaultValue: '1.5', min: '1', step: '0.1' },
      { key: 'regularHours', label: 'Regular Hours Threshold', type: 'number', defaultValue: '40', min: '0', step: '0.25' },
    ],
    calculate: (values) => {
      const hourlyRate = parseNumber(values.hourlyRate);
      const hoursWorked = parseNumber(values.hoursWorked);
      const overtimeMultiplier = parseNumber(values.overtimeMultiplier, 1.5);
      const regularHours = parseNumber(values.regularHours, 40);
      const regular = Math.min(hoursWorked, regularHours);
      const overtime = Math.max(0, hoursWorked - regularHours);
      const gross = regular * hourlyRate + overtime * hourlyRate * overtimeMultiplier;
      return { results: [
        { key: 'regular', label: 'Regular Pay', value: roundTo(regular * hourlyRate), format: 'currency' },
        { key: 'overtime', label: 'Overtime Pay', value: roundTo(overtime * hourlyRate * overtimeMultiplier), format: 'currency' },
        { key: 'gross', label: 'Gross Pay', value: roundTo(gross), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'take-home-pay-after-401k-calculator',
    title: 'Take Home Pay After 401k Calculator',
    description: 'Estimate paycheck take-home after pre-tax 401(k) contributions.',
    category: 'income',
    icon: 'savings',
    fields: [
      { key: 'grossPay', label: 'Gross Pay Per Check ($)', type: 'number', defaultValue: '3500', min: '0', step: '0.01' },
      { key: 'contributionPercent', label: '401(k) Contribution (%)', type: 'number', defaultValue: '8', min: '0', max: '100', step: '0.1' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', defaultValue: '24', min: '0', max: '70', step: '0.1' },
    ],
    calculate: (values) => {
      const grossPay = parseNumber(values.grossPay);
      const contributionPercent = clamp(parseNumber(values.contributionPercent), 0, 100);
      const taxRate = clamp(parseNumber(values.taxRate), 0, 100);
      const contribution = grossPay * (contributionPercent / 100);
      const taxable = Math.max(0, grossPay - contribution);
      const taxes = taxable * (taxRate / 100);
      return { results: [
        { key: 'contribution', label: '401(k) Contribution', value: roundTo(contribution), format: 'currency' },
        { key: 'taxes', label: 'Estimated Taxes', value: roundTo(taxes), format: 'currency' },
        { key: 'takeHome', label: 'Take-Home Pay', value: roundTo(taxable - taxes), format: 'currency' },
      ] };
    },
  },
  {
    slug: '401k-contribution-calculator',
    title: '401k Contribution Calculator',
    description: 'Estimate annual and monthly 401(k) contributions from salary and contribution rate.',
    category: 'savings',
    icon: 'savings',
    fields: [
      { key: 'salary', label: 'Annual Salary ($)', type: 'number', defaultValue: '90000', min: '0', step: '0.01' },
      { key: 'contributionPercent', label: 'Contribution Rate (%)', type: 'number', defaultValue: '10', min: '0', max: '100', step: '0.1' },
    ],
    calculate: (values) => {
      const salary = parseNumber(values.salary);
      const contributionPercent = clamp(parseNumber(values.contributionPercent), 0, 100);
      const annual = salary * contributionPercent / 100;
      return { results: [
        { key: 'annual', label: 'Annual Contribution', value: roundTo(annual), format: 'currency' },
        { key: 'monthly', label: 'Monthly Contribution', value: roundTo(annual / 12), format: 'currency' },
      ] };
    },
  },
  {
    slug: '401k-match-calculator',
    title: '401k Match Calculator',
    description: 'Estimate employer match and total annual retirement contribution.',
    category: 'savings',
    icon: 'handshake',
    fields: [
      { key: 'salary', label: 'Annual Salary ($)', type: 'number', defaultValue: '90000', min: '0', step: '0.01' },
      { key: 'employeeContributionPercent', label: 'Your Contribution (%)', type: 'number', defaultValue: '8', min: '0', max: '100', step: '0.1' },
      { key: 'matchPercent', label: 'Employer Match (%)', type: 'number', defaultValue: '50', min: '0', max: '100', step: '0.1' },
      { key: 'matchUpToPercent', label: 'Match Up To (%)', type: 'number', defaultValue: '6', min: '0', max: '100', step: '0.1' },
    ],
    calculate: (values) => {
      const salary = parseNumber(values.salary);
      const employeePct = clamp(parseNumber(values.employeeContributionPercent), 0, 100);
      const matchPct = clamp(parseNumber(values.matchPercent), 0, 100);
      const matchUpTo = clamp(parseNumber(values.matchUpToPercent), 0, 100);
      const employeeAnnual = salary * employeePct / 100;
      const eligiblePct = Math.min(employeePct, matchUpTo);
      const employerAnnual = salary * eligiblePct / 100 * (matchPct / 100);
      return { results: [
        { key: 'employeeAnnual', label: 'Your Annual Contribution', value: roundTo(employeeAnnual), format: 'currency' },
        { key: 'employerAnnual', label: 'Employer Match', value: roundTo(employerAnnual), format: 'currency' },
        { key: 'totalAnnual', label: 'Total Annual Contribution', value: roundTo(employeeAnnual + employerAnnual), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'roth-vs-traditional-ira-calculator',
    title: 'Roth vs Traditional IRA Calculator',
    description: 'Compare estimated after-tax retirement values between Roth and Traditional IRA.',
    category: 'savings',
    icon: 'compare_arrows',
    fields: [
      { key: 'annualContribution', label: 'Annual Contribution ($)', type: 'number', defaultValue: '7000', min: '0', step: '0.01' },
      { key: 'years', label: 'Years to Grow', type: 'number', defaultValue: '25', min: '1', step: '1' },
      { key: 'annualReturn', label: 'Annual Return (%)', type: 'number', defaultValue: '7', min: '0', step: '0.1' },
      { key: 'retirementTaxRate', label: 'Retirement Tax Rate (%)', type: 'number', defaultValue: '22', min: '0', max: '70', step: '0.1' },
    ],
    calculate: (values) => {
      const contribution = parseNumber(values.annualContribution);
      const years = parseNumber(values.years, 1);
      const annualReturn = parseNumber(values.annualReturn);
      const retirementTaxRate = clamp(parseNumber(values.retirementTaxRate), 0, 100);
      const r = annualReturn / 100;
      const fv = r > 0 ? contribution * (((1 + r) ** years - 1) / r) : contribution * years;
      const traditionalAfterTax = fv * (1 - retirementTaxRate / 100);
      return { results: [
        { key: 'roth', label: 'Roth IRA (After-Tax)', value: roundTo(fv), format: 'currency' },
        { key: 'traditional', label: 'Traditional IRA (After-Tax)', value: roundTo(traditionalAfterTax), format: 'currency' },
        { key: 'difference', label: 'Roth Advantage', value: roundTo(fv - traditionalAfterTax), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'ira-contribution-calculator',
    title: 'IRA Contribution Calculator',
    description: 'Estimate annual and monthly IRA contribution amounts toward your savings goal.',
    category: 'savings',
    icon: 'account_balance',
    fields: [
      { key: 'targetContribution', label: 'Target Annual Contribution ($)', type: 'number', defaultValue: '7000', min: '0', step: '0.01' },
      { key: 'monthsRemaining', label: 'Months Remaining This Year', type: 'number', defaultValue: '12', min: '1', max: '12', step: '1' },
    ],
    calculate: (values) => {
      const target = parseNumber(values.targetContribution);
      const months = Math.max(1, parseNumber(values.monthsRemaining, 12));
      return { results: [
        { key: 'annual', label: 'Annual Target', value: roundTo(target), format: 'currency' },
        { key: 'monthlyNeeded', label: 'Monthly Contribution Needed', value: roundTo(target / months), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'required-minimum-distribution-calculator',
    title: 'Required Minimum Distribution Calculator',
    description: 'Estimate annual RMD using account balance and life expectancy factor.',
    category: 'savings',
    icon: 'event_available',
    fields: [
      { key: 'accountBalance', label: 'Retirement Account Balance ($)', type: 'number', defaultValue: '500000', min: '0', step: '0.01' },
      { key: 'lifeExpectancyFactor', label: 'IRS Distribution Period', type: 'number', defaultValue: '27.4', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const balance = parseNumber(values.accountBalance);
      const factor = Math.max(1, parseNumber(values.lifeExpectancyFactor, 27.4));
      const rmd = balance / factor;
      return { results: [
        { key: 'rmd', label: 'Estimated Annual RMD', value: roundTo(rmd), format: 'currency' },
        { key: 'monthly', label: 'Equivalent Monthly Withdrawal', value: roundTo(rmd / 12), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'future-value-calculator',
    title: 'Future Value Calculator',
    description: 'Calculate future value from present amount, return rate, and time.',
    category: 'savings',
    icon: 'trending_up',
    fields: [
      { key: 'presentValue', label: 'Present Value ($)', type: 'number', defaultValue: '10000', min: '0', step: '0.01' },
      { key: 'annualRate', label: 'Annual Return (%)', type: 'number', defaultValue: '7', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '10', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const pv = parseNumber(values.presentValue);
      const r = parseNumber(values.annualRate) / 100;
      const years = parseNumber(values.years);
      const fv = pv * (1 + r) ** years;
      return { results: [
        { key: 'futureValue', label: 'Future Value', value: roundTo(fv), format: 'currency' },
        { key: 'growth', label: 'Total Growth', value: roundTo(fv - pv), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'present-value-calculator',
    title: 'Present Value Calculator',
    description: 'Calculate present value needed to reach a future amount.',
    category: 'savings',
    icon: 'attach_money',
    fields: [
      { key: 'futureValue', label: 'Future Value ($)', type: 'number', defaultValue: '25000', min: '0', step: '0.01' },
      { key: 'annualRate', label: 'Discount Rate (%)', type: 'number', defaultValue: '6', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '8', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const fv = parseNumber(values.futureValue);
      const r = parseNumber(values.annualRate) / 100;
      const years = parseNumber(values.years);
      const pv = fv / ((1 + r) ** years || 1);
      return { results: [
        { key: 'presentValue', label: 'Present Value', value: roundTo(pv), format: 'currency' },
        { key: 'discount', label: 'Discount Amount', value: roundTo(fv - pv), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'rule-of-72-calculator',
    title: 'Rule of 72 Calculator',
    description: 'Estimate years to double money using the Rule of 72.',
    category: 'savings',
    icon: 'speed',
    fields: [
      { key: 'rate', label: 'Annual Return (%)', type: 'number', defaultValue: '8', min: '0.1', step: '0.1' },
    ],
    calculate: (values) => {
      const rate = Math.max(0.1, parseNumber(values.rate, 8));
      const years = 72 / rate;
      return { results: [
        { key: 'years', label: 'Years to Double (Rule of 72)', value: roundTo(years, 2), format: 'number' },
      ] };
    },
  },
  {
    slug: 'cd-calculator',
    title: 'CD Calculator',
    description: 'Estimate certificate of deposit maturity value and interest earned.',
    category: 'savings',
    icon: 'account_balance',
    fields: [
      { key: 'deposit', label: 'Initial Deposit ($)', type: 'number', defaultValue: '15000', min: '0', step: '0.01' },
      { key: 'apy', label: 'APY (%)', type: 'number', defaultValue: '4.2', min: '0', step: '0.01' },
      { key: 'months', label: 'Term (months)', type: 'number', defaultValue: '24', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const deposit = parseNumber(values.deposit);
      const apy = parseNumber(values.apy) / 100;
      const months = parseNumber(values.months, 12);
      const maturity = deposit * (1 + apy / 12) ** months;
      return { results: [
        { key: 'maturity', label: 'Maturity Value', value: roundTo(maturity), format: 'currency' },
        { key: 'interest', label: 'Interest Earned', value: roundTo(maturity - deposit), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'annuity-calculator',
    title: 'Annuity Calculator',
    description: 'Estimate future value of recurring contributions with compounding.',
    category: 'savings',
    icon: 'payments',
    fields: [
      { key: 'payment', label: 'Periodic Contribution ($)', type: 'number', defaultValue: '400', min: '0', step: '0.01' },
      { key: 'annualRate', label: 'Annual Return (%)', type: 'number', defaultValue: '6.5', min: '0', step: '0.1' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '20', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const payment = parseNumber(values.payment);
      const annualRate = parseNumber(values.annualRate);
      const years = parseNumber(values.years, 1);
      const monthlyRate = annualRate / 100 / 12;
      const periods = years * 12;
      const fv = monthlyRate > 0 ? payment * (((1 + monthlyRate) ** periods - 1) / monthlyRate) : payment * periods;
      return { results: [
        { key: 'futureValue', label: 'Future Value', value: roundTo(fv), format: 'currency' },
        { key: 'contributions', label: 'Total Contributions', value: roundTo(payment * periods), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'capital-gains-tax-calculator',
    title: 'Capital Gains Tax Calculator',
    description: 'Estimate capital gains tax and after-tax proceeds.',
    category: 'savings',
    icon: 'receipt_long',
    fields: [
      { key: 'salePrice', label: 'Sale Price ($)', type: 'number', defaultValue: '30000', min: '0', step: '0.01' },
      { key: 'costBasis', label: 'Cost Basis ($)', type: 'number', defaultValue: '18000', min: '0', step: '0.01' },
      { key: 'taxRate', label: 'Capital Gains Tax Rate (%)', type: 'number', defaultValue: '15', min: '0', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const sale = parseNumber(values.salePrice);
      const basis = parseNumber(values.costBasis);
      const rate = clamp(parseNumber(values.taxRate), 0, 100);
      const gain = Math.max(0, sale - basis);
      const tax = gain * rate / 100;
      return { results: [
        { key: 'gain', label: 'Capital Gain', value: roundTo(gain), format: 'currency' },
        { key: 'tax', label: 'Estimated Tax', value: roundTo(tax), format: 'currency' },
        { key: 'afterTax', label: 'After-Tax Proceeds', value: roundTo(sale - tax), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'dividend-yield-calculator',
    title: 'Dividend Yield Calculator',
    description: 'Calculate dividend yield and annual dividend income.',
    category: 'savings',
    icon: 'show_chart',
    fields: [
      { key: 'annualDividend', label: 'Annual Dividend per Share ($)', type: 'number', defaultValue: '2.4', min: '0', step: '0.01' },
      { key: 'sharePrice', label: 'Share Price ($)', type: 'number', defaultValue: '48', min: '0.01', step: '0.01' },
      { key: 'shares', label: 'Shares Owned', type: 'number', defaultValue: '200', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const annualDividend = parseNumber(values.annualDividend);
      const sharePrice = parseNumber(values.sharePrice, 1);
      const shares = parseNumber(values.shares);
      const yieldPct = sharePrice > 0 ? (annualDividend / sharePrice) * 100 : 0;
      return { results: [
        { key: 'yield', label: 'Dividend Yield', value: roundTo(yieldPct), format: 'percent' },
        { key: 'annualIncome', label: 'Annual Dividend Income', value: roundTo(annualDividend * shares), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'stock-average-cost-calculator',
    title: 'Stock Average Cost Calculator',
    description: 'Compute average cost basis after multiple stock purchases.',
    category: 'savings',
    icon: 'query_stats',
    fields: [
      { key: 'shares1', label: 'Shares (Lot 1)', type: 'number', defaultValue: '100', min: '0', step: '1' },
      { key: 'price1', label: 'Price (Lot 1) ($)', type: 'number', defaultValue: '45', min: '0', step: '0.01' },
      { key: 'shares2', label: 'Shares (Lot 2)', type: 'number', defaultValue: '80', min: '0', step: '1' },
      { key: 'price2', label: 'Price (Lot 2) ($)', type: 'number', defaultValue: '38', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const shares1 = parseNumber(values.shares1);
      const price1 = parseNumber(values.price1);
      const shares2 = parseNumber(values.shares2);
      const price2 = parseNumber(values.price2);
      const totalShares = shares1 + shares2;
      const totalCost = shares1 * price1 + shares2 * price2;
      const average = totalShares > 0 ? totalCost / totalShares : 0;
      return { results: [
        { key: 'totalShares', label: 'Total Shares', value: roundTo(totalShares), format: 'number' },
        { key: 'totalCost', label: 'Total Cost Basis', value: roundTo(totalCost), format: 'currency' },
        { key: 'average', label: 'Average Cost per Share', value: roundTo(average), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'stock-return-calculator',
    title: 'Stock Return Calculator',
    description: 'Calculate stock investment return including dividends.',
    category: 'savings',
    icon: 'trending_up',
    fields: [
      { key: 'buyPrice', label: 'Buy Price ($)', type: 'number', defaultValue: '40', min: '0', step: '0.01' },
      { key: 'sellPrice', label: 'Sell Price ($)', type: 'number', defaultValue: '52', min: '0', step: '0.01' },
      { key: 'shares', label: 'Shares', type: 'number', defaultValue: '150', min: '0', step: '1' },
      { key: 'dividends', label: 'Total Dividends Received ($)', type: 'number', defaultValue: '300', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const buy = parseNumber(values.buyPrice);
      const sell = parseNumber(values.sellPrice);
      const shares = parseNumber(values.shares);
      const dividends = parseNumber(values.dividends);
      const cost = buy * shares;
      const proceeds = sell * shares + dividends;
      const gain = proceeds - cost;
      const pct = cost > 0 ? gain / cost * 100 : 0;
      return { results: [
        { key: 'gain', label: 'Total Gain/Loss', value: roundTo(gain), format: 'currency' },
        { key: 'returnPct', label: 'Total Return', value: roundTo(pct), format: 'percent' },
      ] };
    },
  },
  {
    slug: 'portfolio-return-calculator',
    title: 'Portfolio Return Calculator',
    description: 'Estimate weighted portfolio return from asset allocations and returns.',
    category: 'savings',
    icon: 'donut_large',
    fields: [
      { key: 'weight1', label: 'Asset 1 Weight (%)', type: 'number', defaultValue: '50', min: '0', max: '100', step: '0.1' },
      { key: 'return1', label: 'Asset 1 Return (%)', type: 'number', defaultValue: '8', step: '0.1' },
      { key: 'weight2', label: 'Asset 2 Weight (%)', type: 'number', defaultValue: '30', min: '0', max: '100', step: '0.1' },
      { key: 'return2', label: 'Asset 2 Return (%)', type: 'number', defaultValue: '4', step: '0.1' },
      { key: 'weight3', label: 'Asset 3 Weight (%)', type: 'number', defaultValue: '20', min: '0', max: '100', step: '0.1' },
      { key: 'return3', label: 'Asset 3 Return (%)', type: 'number', defaultValue: '12', step: '0.1' },
    ],
    calculate: (values) => {
      const w1 = parseNumber(values.weight1) / 100;
      const r1 = parseNumber(values.return1);
      const w2 = parseNumber(values.weight2) / 100;
      const r2 = parseNumber(values.return2);
      const w3 = parseNumber(values.weight3) / 100;
      const r3 = parseNumber(values.return3);
      const totalWeight = w1 + w2 + w3;
      const weightedReturn = totalWeight > 0 ? (w1 * r1 + w2 * r2 + w3 * r3) / totalWeight : 0;
      return { results: [
        { key: 'return', label: 'Weighted Portfolio Return', value: roundTo(weightedReturn), format: 'percent' },
        { key: 'weight', label: 'Total Weight', value: roundTo(totalWeight * 100), format: 'percent' },
      ] };
    },
  },
  {
    slug: 'real-rate-of-return-calculator',
    title: 'Real Rate of Return Calculator',
    description: 'Calculate inflation-adjusted real return from nominal return.',
    category: 'savings',
    icon: 'price_change',
    fields: [
      { key: 'nominalRate', label: 'Nominal Return (%)', type: 'number', defaultValue: '8', step: '0.1' },
      { key: 'inflationRate', label: 'Inflation Rate (%)', type: 'number', defaultValue: '3', step: '0.1' },
    ],
    calculate: (values) => {
      const nominal = parseNumber(values.nominalRate) / 100;
      const inflation = parseNumber(values.inflationRate) / 100;
      const real = ((1 + nominal) / (1 + inflation) - 1) * 100;
      return { results: [
        { key: 'real', label: 'Real Return', value: roundTo(real), format: 'percent' },
      ] };
    },
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    description: 'Estimate debt payoff timeline from balance, APR, and monthly payment.',
    category: 'loans',
    icon: 'credit_card',
    fields: [
      { key: 'balance', label: 'Debt Balance ($)', type: 'number', defaultValue: '12000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '18.9', min: '0', step: '0.01' },
      { key: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number', defaultValue: '350', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const balance = parseNumber(values.balance);
      const apr = parseNumber(values.apr);
      const payment = parseNumber(values.monthlyPayment);
      const monthlyRate = apr / 100 / 12;
      let months = 0;
      let current = balance;
      let totalInterest = 0;
      while (current > 0.01 && months < 1200 && payment > 0) {
        const interest = current * monthlyRate;
        const principal = Math.max(0, payment - interest);
        if (principal <= 0) break;
        current -= principal;
        totalInterest += interest;
        months += 1;
      }
      return { results: [
        { key: 'months', label: 'Estimated Payoff Months', value: months, format: 'integer' },
        { key: 'interest', label: 'Estimated Total Interest', value: roundTo(totalInterest), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'mortgage-interest-calculator',
    title: 'Mortgage Interest Calculator',
    description: 'Estimate total mortgage interest and total paid over the loan term.',
    category: 'home',
    icon: 'home',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: '320000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.1', min: '0', step: '0.01' },
      { key: 'years', label: 'Term (years)', type: 'number', defaultValue: '30', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const amount = parseNumber(values.loanAmount);
      const apr = parseNumber(values.apr);
      const years = parseNumber(values.years, 30);
      const months = years * 12;
      const payment = amortizedMonthlyPayment(amount, apr, months);
      const totalPaid = payment * months;
      return { results: [
        { key: 'payment', label: 'Monthly Payment', value: roundTo(payment), format: 'currency' },
        { key: 'interest', label: 'Total Interest', value: roundTo(totalPaid - amount), format: 'currency' },
        { key: 'total', label: 'Total Paid', value: roundTo(totalPaid), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'loan-interest-calculator',
    title: 'Loan Interest Calculator',
    description: 'Estimate loan interest paid over the selected loan term.',
    category: 'loans',
    icon: 'request_quote',
    fields: [
      { key: 'principal', label: 'Principal ($)', type: 'number', defaultValue: '25000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '8.5', min: '0', step: '0.01' },
      { key: 'months', label: 'Term (months)', type: 'number', defaultValue: '60', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const principal = parseNumber(values.principal);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.months, 60);
      const payment = amortizedMonthlyPayment(principal, apr, months);
      const total = payment * months;
      return { results: [
        { key: 'interest', label: 'Total Interest', value: roundTo(total - principal), format: 'currency' },
        { key: 'payment', label: 'Monthly Payment', value: roundTo(payment), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'car-affordability-calculator',
    title: 'Car Affordability Calculator',
    description: 'Estimate affordable car price from budget, down payment, and financing terms.',
    category: 'loans',
    icon: 'directions_car',
    fields: [
      { key: 'monthlyBudget', label: 'Monthly Car Budget ($)', type: 'number', defaultValue: '550', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '7.2', min: '0', step: '0.01' },
      { key: 'termMonths', label: 'Loan Term (months)', type: 'number', defaultValue: '60', min: '1', step: '1' },
      { key: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: '5000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const budget = parseNumber(values.monthlyBudget);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.termMonths, 60);
      const down = parseNumber(values.downPayment);
      const monthlyRate = apr / 100 / 12;
      const loan = monthlyRate > 0 ? budget * ((1 - (1 + monthlyRate) ** -months) / monthlyRate) : budget * months;
      return { results: [
        { key: 'loan', label: 'Estimated Loan Amount', value: roundTo(loan), format: 'currency' },
        { key: 'price', label: 'Estimated Car Price', value: roundTo(loan + down), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'home-affordability-calculator',
    title: 'Home Affordability Calculator',
    description: 'Estimate affordable home purchase price from monthly payment budget.',
    category: 'home',
    icon: 'house',
    fields: [
      { key: 'monthlyBudget', label: 'Monthly Housing Budget ($)', type: 'number', defaultValue: '2800', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '6.4', min: '0', step: '0.01' },
      { key: 'years', label: 'Term (years)', type: 'number', defaultValue: '30', min: '1', step: '1' },
      { key: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: '70000', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const budget = parseNumber(values.monthlyBudget);
      const apr = parseNumber(values.apr);
      const years = parseNumber(values.years, 30);
      const down = parseNumber(values.downPayment);
      const months = years * 12;
      const monthlyRate = apr / 100 / 12;
      const loan = monthlyRate > 0 ? budget * ((1 - (1 + monthlyRate) ** -months) / monthlyRate) : budget * months;
      return { results: [
        { key: 'loan', label: 'Estimated Mortgage Amount', value: roundTo(loan), format: 'currency' },
        { key: 'price', label: 'Estimated Home Price', value: roundTo(loan + down), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'rent-affordability-calculator',
    title: 'Rent Affordability Calculator',
    description: 'Estimate affordable monthly rent using income and target rent ratio.',
    category: 'home',
    icon: 'apartment',
    fields: [
      { key: 'annualIncome', label: 'Annual Income ($)', type: 'number', defaultValue: '96000', min: '0', step: '0.01' },
      { key: 'rentRatio', label: 'Target Rent Ratio (%)', type: 'number', defaultValue: '30', min: '10', max: '60', step: '0.1' },
    ],
    calculate: (values) => {
      const income = parseNumber(values.annualIncome);
      const ratio = clamp(parseNumber(values.rentRatio), 0, 100);
      const monthlyIncome = income / 12;
      const affordableRent = monthlyIncome * ratio / 100;
      return { results: [
        { key: 'monthlyIncome', label: 'Monthly Income', value: roundTo(monthlyIncome), format: 'currency' },
        { key: 'affordableRent', label: 'Affordable Monthly Rent', value: roundTo(affordableRent), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'budget-percentage-calculator',
    title: 'Budget Percentage Calculator',
    description: 'Compare budget categories against income as percentages.',
    category: 'income',
    icon: 'pie_chart',
    fields: [
      { key: 'monthlyIncome', label: 'Monthly Income ($)', type: 'number', defaultValue: '6000', min: '0', step: '0.01' },
      { key: 'housing', label: 'Housing Expense ($)', type: 'number', defaultValue: '1800', min: '0', step: '0.01' },
      { key: 'transportation', label: 'Transportation Expense ($)', type: 'number', defaultValue: '650', min: '0', step: '0.01' },
      { key: 'other', label: 'Other Expenses ($)', type: 'number', defaultValue: '2100', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const income = parseNumber(values.monthlyIncome);
      const housing = parseNumber(values.housing);
      const transportation = parseNumber(values.transportation);
      const other = parseNumber(values.other);
      const total = housing + transportation + other;
      return { results: [
        { key: 'housingPct', label: 'Housing %', value: income > 0 ? roundTo((housing / income) * 100) : 0, format: 'percent' },
        { key: 'transportPct', label: 'Transportation %', value: income > 0 ? roundTo((transportation / income) * 100) : 0, format: 'percent' },
        { key: 'totalPct', label: 'Total Expenses %', value: income > 0 ? roundTo((total / income) * 100) : 0, format: 'percent' },
      ] };
    },
  },
  {
    slug: 'expense-ratio-calculator',
    title: 'Expense Ratio Calculator',
    description: 'Estimate annual fund expense cost from invested balance and expense ratio.',
    category: 'savings',
    icon: 'percent',
    fields: [
      { key: 'balance', label: 'Investment Balance ($)', type: 'number', defaultValue: '85000', min: '0', step: '0.01' },
      { key: 'expenseRatio', label: 'Expense Ratio (%)', type: 'number', defaultValue: '0.45', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const balance = parseNumber(values.balance);
      const ratio = parseNumber(values.expenseRatio);
      const annualCost = balance * ratio / 100;
      return { results: [
        { key: 'annualCost', label: 'Estimated Annual Cost', value: roundTo(annualCost), format: 'currency' },
        { key: 'monthlyCost', label: 'Estimated Monthly Cost', value: roundTo(annualCost / 12), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'compound-annual-growth-rate-calculator',
    title: 'Compound Annual Growth Rate Calculator',
    description: 'Calculate CAGR between beginning and ending values over time.',
    category: 'savings',
    icon: 'timeline',
    fields: [
      { key: 'startValue', label: 'Start Value', type: 'number', defaultValue: '12000', min: '0.01', step: '0.01' },
      { key: 'endValue', label: 'End Value', type: 'number', defaultValue: '22000', min: '0.01', step: '0.01' },
      { key: 'years', label: 'Years', type: 'number', defaultValue: '5', min: '0.01', step: '0.01' },
    ],
    calculate: (values) => {
      const start = parseNumber(values.startValue, 1);
      const end = parseNumber(values.endValue, 1);
      const years = parseNumber(values.years, 1);
      const cagr = (end > 0 && start > 0 && years > 0) ? ((end / start) ** (1 / years) - 1) * 100 : 0;
      return { results: [
        { key: 'cagr', label: 'CAGR', value: roundTo(cagr), format: 'percent' },
      ] };
    },
  },
  {
    slug: 'profit-calculator',
    title: 'Profit Calculator',
    description: 'Calculate total profit from revenue and costs.',
    category: 'income',
    icon: 'bar_chart',
    fields: [
      { key: 'revenue', label: 'Revenue ($)', type: 'number', defaultValue: '18000', min: '0', step: '0.01' },
      { key: 'costs', label: 'Total Costs ($)', type: 'number', defaultValue: '11250', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const revenue = parseNumber(values.revenue);
      const costs = parseNumber(values.costs);
      const profit = revenue - costs;
      const margin = revenue > 0 ? profit / revenue * 100 : 0;
      return { results: [
        { key: 'profit', label: 'Profit', value: roundTo(profit), format: 'currency' },
        { key: 'margin', label: 'Profit Margin', value: roundTo(margin), format: 'percent' },
      ] };
    },
  },
  {
    slug: 'unit-price-calculator',
    title: 'Unit Price Calculator',
    description: 'Calculate price per unit from total price and quantity.',
    category: 'percentages',
    icon: 'price_check',
    fields: [
      { key: 'totalPrice', label: 'Total Price ($)', type: 'number', defaultValue: '24.99', min: '0', step: '0.01' },
      { key: 'quantity', label: 'Quantity', type: 'number', defaultValue: '18', min: '0.0001', step: '0.01' },
    ],
    calculate: (values) => {
      const total = parseNumber(values.totalPrice);
      const qty = parseNumber(values.quantity, 1);
      return { results: [
        { key: 'unitPrice', label: 'Unit Price', value: roundTo(total / qty, 4), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'markup-percentage-calculator',
    title: 'Markup Percentage Calculator',
    description: 'Calculate markup percentage from cost and selling price.',
    category: 'percentages',
    icon: 'sell',
    fields: [
      { key: 'cost', label: 'Cost ($)', type: 'number', defaultValue: '80', min: '0', step: '0.01' },
      { key: 'price', label: 'Selling Price ($)', type: 'number', defaultValue: '120', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const cost = parseNumber(values.cost);
      const price = parseNumber(values.price);
      const markup = cost > 0 ? ((price - cost) / cost) * 100 : 0;
      return { results: [
        { key: 'markup', label: 'Markup Percentage', value: roundTo(markup), format: 'percent' },
        { key: 'profit', label: 'Profit', value: roundTo(price - cost), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'sales-commission-calculator',
    title: 'Sales Commission Calculator',
    description: 'Estimate commission earnings from sales volume and commission rate.',
    category: 'income',
    icon: 'paid',
    fields: [
      { key: 'salesVolume', label: 'Sales Volume ($)', type: 'number', defaultValue: '50000', min: '0', step: '0.01' },
      { key: 'commissionRate', label: 'Commission Rate (%)', type: 'number', defaultValue: '5', min: '0', step: '0.1' },
    ],
    calculate: (values) => {
      const volume = parseNumber(values.salesVolume);
      const rate = parseNumber(values.commissionRate);
      return { results: [
        { key: 'commission', label: 'Commission', value: roundTo(volume * rate / 100), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'business-loan-calculator',
    title: 'Business Loan Calculator',
    description: 'Estimate monthly payment and total loan cost for business financing.',
    category: 'loans',
    icon: 'storefront',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: '85000', min: '0', step: '0.01' },
      { key: 'apr', label: 'APR (%)', type: 'number', defaultValue: '9.5', min: '0', step: '0.01' },
      { key: 'months', label: 'Term (months)', type: 'number', defaultValue: '84', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const amount = parseNumber(values.loanAmount);
      const apr = parseNumber(values.apr);
      const months = parseNumber(values.months, 60);
      const payment = amortizedMonthlyPayment(amount, apr, months);
      return { results: [
        { key: 'payment', label: 'Monthly Payment', value: roundTo(payment), format: 'currency' },
        { key: 'interest', label: 'Total Interest', value: roundTo(payment * months - amount), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'small-business-profit-calculator',
    title: 'Small Business Profit Calculator',
    description: 'Estimate net operating profit from revenue and operating expenses.',
    category: 'income',
    icon: 'store',
    fields: [
      { key: 'monthlyRevenue', label: 'Monthly Revenue ($)', type: 'number', defaultValue: '32000', min: '0', step: '0.01' },
      { key: 'monthlyExpenses', label: 'Monthly Expenses ($)', type: 'number', defaultValue: '24600', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const revenue = parseNumber(values.monthlyRevenue);
      const expenses = parseNumber(values.monthlyExpenses);
      const profit = revenue - expenses;
      return { results: [
        { key: 'monthlyProfit', label: 'Monthly Profit', value: roundTo(profit), format: 'currency' },
        { key: 'annualProfit', label: 'Annual Profit', value: roundTo(profit * 12), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'workdays-between-dates-calculator',
    title: 'Workdays Between Dates Calculator',
    description: 'Count weekdays between two dates (Monday through Friday).',
    category: 'time',
    icon: 'calendar_today',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date', defaultValue: '2026-01-01' },
      { key: 'endDate', label: 'End Date', type: 'date', defaultValue: '2026-03-31' },
    ],
    calculate: (values) => {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      let count = 0;
      const cursor = new Date(start);
      while (cursor <= end) {
        const day = cursor.getDay();
        if (day !== 0 && day !== 6) count += 1;
        cursor.setDate(cursor.getDate() + 1);
      }
      return { results: [
        { key: 'workdays', label: 'Workdays Between Dates', value: Math.max(0, count), format: 'integer' },
      ] };
    },
  },
  {
    slug: 'time-card-calculator',
    title: 'Time Card Calculator',
    description: 'Calculate total worked time from clock-in and clock-out values.',
    category: 'time',
    icon: 'schedule',
    fields: [
      { key: 'clockIn', label: 'Clock In', type: 'time', defaultValue: '09:00' },
      { key: 'clockOut', label: 'Clock Out', type: 'time', defaultValue: '17:30' },
      { key: 'breakMinutes', label: 'Break Minutes', type: 'number', defaultValue: '30', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const inMin = parseTimeToMinutes(values.clockIn);
      const outMin = parseTimeToMinutes(values.clockOut);
      const breakMinutes = parseNumber(values.breakMinutes);
      const raw = outMin >= inMin ? outMin - inMin : outMin + 24 * 60 - inMin;
      const worked = Math.max(0, raw - breakMinutes);
      return { results: [
        { key: 'worked', label: 'Hours Worked', value: formatDurationMinutes(worked), format: 'duration' },
        { key: 'decimal', label: 'Hours Worked (decimal)', value: roundTo(worked / 60, 2), format: 'number' },
      ] };
    },
  },
  {
    slug: 'hours-worked-calculator',
    title: 'Hours Worked Calculator',
    description: 'Calculate total hours worked based on start/end times and break length.',
    category: 'time',
    icon: 'hourglass_top',
    fields: [
      { key: 'start', label: 'Start Time', type: 'time', defaultValue: '08:30' },
      { key: 'end', label: 'End Time', type: 'time', defaultValue: '17:00' },
      { key: 'breakMinutes', label: 'Break Minutes', type: 'number', defaultValue: '45', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const start = parseTimeToMinutes(values.start);
      const end = parseTimeToMinutes(values.end);
      const breakMinutes = parseNumber(values.breakMinutes);
      const raw = end >= start ? end - start : end + 24 * 60 - start;
      const worked = Math.max(0, raw - breakMinutes);
      return { results: [
        { key: 'workedDuration', label: 'Worked Time', value: formatDurationMinutes(worked), format: 'duration' },
        { key: 'workedHours', label: 'Worked Hours (decimal)', value: roundTo(worked / 60, 2), format: 'number' },
      ] };
    },
  },
  {
    slug: 'sleep-calculator',
    title: 'Sleep Calculator',
    description: 'Estimate wake-up or bedtime using common 90-minute sleep cycles.',
    category: 'health',
    icon: 'bedtime',
    fields: [
      { key: 'bedtime', label: 'Bedtime', type: 'time', defaultValue: '22:30' },
      { key: 'cycles', label: 'Sleep Cycles', type: 'number', defaultValue: '6', min: '1', max: '8', step: '1' },
      { key: 'fallAsleepMinutes', label: 'Minutes to Fall Asleep', type: 'number', defaultValue: '15', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const bedtime = parseTimeToMinutes(values.bedtime);
      const cycles = parseNumber(values.cycles, 6);
      const latency = parseNumber(values.fallAsleepMinutes, 15);
      const wakeMinutes = bedtime + latency + cycles * 90;
      const normalized = ((wakeMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
      const wakeTime = `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
      return { results: [
        { key: 'sleepDuration', label: 'Planned Sleep Duration', value: formatDurationMinutes(cycles * 90), format: 'duration' },
        { key: 'wakeTime', label: 'Estimated Wake Time', value: wakeTime, format: 'text' },
      ] };
    },
  },
  {
    slug: 'bmr-calculator',
    title: 'BMR Calculator',
    description: 'Estimate basal metabolic rate using Mifflin-St Jeor equation.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [
      { key: 'sex', label: 'Sex', type: 'select', defaultValue: 'male', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
      { key: 'age', label: 'Age', type: 'number', defaultValue: '34', min: '1', step: '1' },
      { key: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: '76', min: '1', step: '0.1' },
      { key: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: '175', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const sexAdj = values.sex === 'male' ? 5 : -161;
      const age = parseNumber(values.age);
      const weight = parseNumber(values.weightKg);
      const height = parseNumber(values.heightCm);
      const bmr = 10 * weight + 6.25 * height - 5 * age + sexAdj;
      return { results: [
        { key: 'bmr', label: 'Estimated BMR (kcal/day)', value: roundTo(bmr), format: 'number' },
      ] };
    },
  },
  {
    slug: 'heart-rate-zone-calculator',
    title: 'Heart Rate Zone Calculator',
    description: 'Estimate training heart-rate zones using max heart rate.',
    category: 'health',
    icon: 'favorite',
    fields: [
      { key: 'age', label: 'Age', type: 'number', defaultValue: '35', min: '1', step: '1' },
      { key: 'restingHr', label: 'Resting HR (optional)', type: 'number', defaultValue: '60', min: '30', step: '1' },
    ],
    calculate: (values) => {
      const age = parseNumber(values.age);
      const maxHr = 220 - age;
      const resting = parseNumber(values.restingHr);
      const reserve = maxHr - resting;
      return { results: [
        { key: 'maxHr', label: 'Estimated Max HR', value: roundTo(maxHr), format: 'number' },
        { key: 'zone2', label: 'Zone 2 (60–70%)', value: `${Math.round(resting + reserve * 0.6)}-${Math.round(resting + reserve * 0.7)} bpm`, format: 'text' },
        { key: 'zone4', label: 'Zone 4 (80–90%)', value: `${Math.round(resting + reserve * 0.8)}-${Math.round(resting + reserve * 0.9)} bpm`, format: 'text' },
      ] };
    },
  },
  {
    slug: 'steps-to-miles-calculator',
    title: 'Steps to Miles Calculator',
    description: 'Convert step count to approximate miles and kilometers.',
    category: 'health',
    icon: 'directions_walk',
    fields: [
      { key: 'steps', label: 'Steps', type: 'number', defaultValue: '10000', min: '0', step: '1' },
      { key: 'stepsPerMile', label: 'Steps per Mile', type: 'number', defaultValue: '2000', min: '1', step: '1' },
    ],
    calculate: (values) => {
      const steps = parseNumber(values.steps);
      const stepsPerMile = parseNumber(values.stepsPerMile, 2000);
      const miles = stepsPerMile > 0 ? steps / stepsPerMile : 0;
      return { results: [
        { key: 'miles', label: 'Distance (miles)', value: roundTo(miles, 2), format: 'number' },
        { key: 'km', label: 'Distance (km)', value: roundTo(miles * 1.60934, 2), format: 'number' },
      ] };
    },
  },
  {
    slug: 'pace-converter',
    title: 'Pace Converter',
    description: 'Convert running pace between minutes per mile and minutes per kilometer.',
    category: 'converters',
    icon: 'directions_run',
    fields: [
      { key: 'minutesPerMile', label: 'Minutes per Mile', type: 'number', defaultValue: '8.5', min: '0.01', step: '0.01' },
    ],
    calculate: (values) => {
      const minMile = parseNumber(values.minutesPerMile, 8);
      const minKm = minMile / 1.60934;
      return { results: [
        { key: 'mile', label: 'Pace per Mile', value: formatDurationMinutes(minMile), format: 'duration' },
        { key: 'km', label: 'Pace per Kilometer', value: formatDurationMinutes(minKm), format: 'duration' },
      ] };
    },
  },
  {
    slug: 'running-calories-burned-calculator',
    title: 'Running Calories Burned Calculator',
    description: 'Estimate calories burned while running from weight and duration.',
    category: 'health',
    icon: 'directions_run',
    fields: [
      { key: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: '72', min: '1', step: '0.1' },
      { key: 'minutes', label: 'Running Duration (minutes)', type: 'number', defaultValue: '45', min: '1', step: '1' },
      { key: 'met', label: 'MET Value', type: 'number', defaultValue: '9.8', min: '1', step: '0.1' },
    ],
    calculate: (values) => {
      const w = parseNumber(values.weightKg);
      const m = parseNumber(values.minutes);
      const met = parseNumber(values.met, 9.8);
      const calories = met * w * (m / 60);
      return { results: [
        { key: 'calories', label: 'Estimated Calories Burned', value: roundTo(calories), format: 'number' },
      ] };
    },
  },
  {
    slug: 'fuel-cost-calculator',
    title: 'Fuel Cost Calculator',
    description: 'Estimate trip fuel cost from distance, MPG, and fuel price.',
    category: 'converters',
    icon: 'local_gas_station',
    fields: [
      { key: 'distanceMiles', label: 'Trip Distance (miles)', type: 'number', defaultValue: '350', min: '0', step: '0.1' },
      { key: 'mpg', label: 'Vehicle MPG', type: 'number', defaultValue: '28', min: '0.1', step: '0.1' },
      { key: 'fuelPrice', label: 'Fuel Price ($/gallon)', type: 'number', defaultValue: '3.65', min: '0', step: '0.01' },
    ],
    calculate: (values) => {
      const dist = parseNumber(values.distanceMiles);
      const mpg = parseNumber(values.mpg, 1);
      const price = parseNumber(values.fuelPrice);
      const gallons = mpg > 0 ? dist / mpg : 0;
      return { results: [
        { key: 'gallons', label: 'Estimated Gallons Used', value: roundTo(gallons, 2), format: 'number' },
        { key: 'cost', label: 'Estimated Fuel Cost', value: roundTo(gallons * price), format: 'currency' },
      ] };
    },
  },
  {
    slug: 'gas-mileage-calculator',
    title: 'Gas Mileage Calculator',
    description: 'Calculate gas mileage from distance traveled and fuel used.',
    category: 'converters',
    icon: 'speed',
    fields: [
      { key: 'distanceMiles', label: 'Distance (miles)', type: 'number', defaultValue: '420', min: '0', step: '0.1' },
      { key: 'gallons', label: 'Fuel Used (gallons)', type: 'number', defaultValue: '14.5', min: '0.0001', step: '0.01' },
    ],
    calculate: (values) => {
      const miles = parseNumber(values.distanceMiles);
      const gallons = parseNumber(values.gallons, 1);
      const mpg = gallons > 0 ? miles / gallons : 0;
      return { results: [
        { key: 'mpg', label: 'Miles per Gallon', value: roundTo(mpg, 2), format: 'number' },
        { key: 'lPer100km', label: 'L/100 km', value: mpg > 0 ? roundTo(235.214583 / mpg, 2) : 0, format: 'number' },
      ] };
    },
  },
  {
    slug: 'cooking-time-converter',
    title: 'Cooking Time Converter',
    description: 'Convert cooking times between minutes and hours.',
    category: 'converters',
    icon: 'restaurant',
    fields: [
      { key: 'minutes', label: 'Minutes', type: 'number', defaultValue: '95', min: '0', step: '1' },
    ],
    calculate: (values) => {
      const minutes = parseNumber(values.minutes);
      return { results: [
        { key: 'hours', label: 'Hours', value: roundTo(minutes / 60, 2), format: 'number' },
        { key: 'duration', label: 'Hours and Minutes', value: formatDurationMinutes(minutes), format: 'duration' },
      ] };
    },
  },
  {
    slug: 'temperature-feels-like-calculator',
    title: 'Temperature Feels Like Calculator',
    description: 'Estimate apparent temperature using heat index style approximation.',
    category: 'converters',
    icon: 'thermostat',
    fields: [
      { key: 'temperatureF', label: 'Air Temperature (°F)', type: 'number', defaultValue: '92', step: '0.1' },
      { key: 'humidity', label: 'Relative Humidity (%)', type: 'number', defaultValue: '55', min: '0', max: '100', step: '0.1' },
    ],
    calculate: (values) => {
      const t = parseNumber(values.temperatureF);
      const rh = clamp(parseNumber(values.humidity), 0, 100);
      const feelsLike = -42.379 + 2.04901523 * t + 10.14333127 * rh - 0.22475541 * t * rh
        - 0.00683783 * t * t - 0.05481717 * rh * rh + 0.00122874 * t * t * rh
        + 0.00085282 * t * rh * rh - 0.00000199 * t * t * rh * rh;
      return { results: [
        { key: 'feelsLikeF', label: 'Feels Like (°F)', value: roundTo(feelsLike), format: 'number' },
        { key: 'feelsLikeC', label: 'Feels Like (°C)', value: roundTo((feelsLike - 32) * 5 / 9), format: 'number' },
      ] };
    },
  },
  {
    slug: 'voltage-converter',
    title: 'Voltage Converter',
    description: 'Convert voltage between volts, millivolts, and kilovolts.',
    category: 'converters',
    icon: 'bolt',
    fields: [
      { key: 'volts', label: 'Volts (V)', type: 'number', defaultValue: '120', step: '0.01' },
    ],
    calculate: (values) => {
      const volts = parseNumber(values.volts);
      return { results: [
        { key: 'millivolts', label: 'Millivolts (mV)', value: roundTo(volts * 1000), format: 'number' },
        { key: 'kilovolts', label: 'Kilovolts (kV)', value: roundTo(volts / 1000, 6), format: 'number' },
      ] };
    },
  },
  {
    slug: 'density-calculator',
    title: 'Density Calculator',
    description: 'Calculate density from mass and volume.',
    category: 'converters',
    icon: 'science',
    fields: [
      { key: 'massKg', label: 'Mass (kg)', type: 'number', defaultValue: '12', min: '0', step: '0.01' },
      { key: 'volumeM3', label: 'Volume (m³)', type: 'number', defaultValue: '0.008', min: '0.000001', step: '0.000001' },
    ],
    calculate: (values) => {
      const mass = parseNumber(values.massKg);
      const volume = parseNumber(values.volumeM3, 1);
      const density = volume > 0 ? mass / volume : 0;
      return { results: [
        { key: 'density', label: 'Density (kg/m³)', value: roundTo(density, 3), format: 'number' },
      ] };
    },
  },
  {
    slug: 'pressure-converter',
    title: 'Pressure Converter',
    description: 'Convert pressure between psi, bar, and kPa.',
    category: 'converters',
    icon: 'compress',
    fields: [
      { key: 'psi', label: 'Pressure (psi)', type: 'number', defaultValue: '32', step: '0.01' },
    ],
    calculate: (values) => {
      const psi = parseNumber(values.psi);
      return { results: [
        { key: 'bar', label: 'Bar', value: roundTo(psi * 0.0689476, 4), format: 'number' },
        { key: 'kpa', label: 'kPa', value: roundTo(psi * 6.89476, 3), format: 'number' },
      ] };
    },
  },
  // --- AUTO-GENERATED PLACEHOLDER CONFIGS FOR MISSING CALCULATOR PAGES ---
  // All placeholder configs are now merged into baseGeneratedCalculators with valid categories.
  // --- AUTO-GENERATED PLACEHOLDER CONFIGS FOR MISSING CALCULATOR PAGES ---
  {
    slug: 'emergency-fund',
    title: 'Emergency Fund Calculator',
    description: 'Calculate your recommended emergency fund.',
    category: 'savings',
    icon: 'savings',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'file-size',
    title: 'File Size Calculator',
    description: 'Convert and calculate file sizes.',
    category: 'converters',
    icon: 'data_object',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'budgeting',
    title: 'Budgeting Calculator',
    description: 'Plan your monthly budget and expenses.',
    category: 'savings',
    icon: 'payments',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'savings-investment',
    title: 'Savings & Investment Calculator',
    description: 'Estimate savings and investment growth.',
    category: 'savings',
    icon: 'trending_up',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'discount',
    title: 'Discount Calculator',
    description: 'Calculate discounts and sale prices.',
    category: 'percentages',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'age',
    title: 'Age Calculator',
    description: 'Calculate age from birthdate.',
    category: 'health',
    icon: 'calendar_today',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'ideal-weight',
    title: 'Ideal Weight Calculator',
    description: 'Estimate your ideal body weight.',
    category: 'health',
    icon: 'monitor_weight',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'power-converter',
    title: 'Power Converter',
    description: 'Convert power units.',
    category: 'converters',
    icon: 'bolt',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'gpa',
    title: 'GPA Calculator',
    description: 'Calculate your grade point average.',
    category: 'income',
    icon: 'school',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate return on investment.',
    category: 'savings',
    icon: 'trending_up',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'weather',
    title: 'Weather Converter',
    description: 'Convert Celsius and Fahrenheit.',
    category: 'converters',
    icon: 'thermostat',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'area',
    title: 'Area Calculator',
    description: 'Calculate area for shapes and spaces.',
    category: 'converters',
    icon: 'straighten',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'budget',
    title: 'Budget Calculator',
    description: 'Track your monthly budget.',
    category: 'savings',
    icon: 'payments',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest growth.',
    category: 'savings',
    icon: 'date_range',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'volume',
    title: 'Volume Calculator',
    description: 'Calculate volume for objects and spaces.',
    category: 'converters',
    icon: 'view_in_ar',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'cycling-power-to-weight',
    title: 'Cycling Power-to-Weight Calculator',
    description: 'Estimate cycling power-to-weight ratio.',
    category: 'outdoors',
    icon: 'directions_bike',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'interest',
    title: 'Interest Calculator',
    description: 'Calculate simple and compound interest.',
    category: 'savings',
    icon: 'calculate',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'time-duration',
    title: 'Time Duration Calculator',
    description: 'Calculate duration between times.',
    category: 'time',
    icon: 'schedule',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'refinance',
    title: 'Refinance Calculator',
    description: 'Estimate refinance savings and break-even.',
    category: 'loans',
    icon: 'balance',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'water-intake',
    title: 'Water Intake Calculator',
    description: 'Estimate daily water intake needs.',
    category: 'health',
    icon: 'water_drop',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'converters',
    title: 'Converters',
    description: 'Convert units and values.',
    category: 'converters',
    icon: 'swap_horiz',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'inflation',
    title: 'Inflation Calculator',
    description: 'Estimate inflation impact over time.',
    category: 'savings',
    icon: 'price_change',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'hiking-pace',
    title: 'Hiking Pace Calculator',
    description: 'Estimate hiking pace and time.',
    category: 'outdoors',
    icon: 'directions_walk',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Calculator',
    description: 'Accessibility tools and calculators.',
    category: 'converters',
    icon: 'accessibility',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'loans',
    title: 'Loans Calculator',
    description: 'Estimate loan payments and terms.',
    category: 'loans',
    icon: 'request_quote',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'height-converter',
    title: 'Height Converter',
    description: 'Convert height units.',
    category: 'converters',
    icon: 'straighten',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'tire-pressure',
    title: 'Tire Pressure Converter',
    description: 'Convert tire pressure units.',
    category: 'converters',
    icon: 'speed',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'weight',
    title: 'Weight Calculator',
    description: 'Calculate weight and conversions.',
    category: 'health',
    icon: 'monitor_weight',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'terms',
    title: 'Terms Calculator',
    description: 'Calculate terms and durations.',
    category: 'time',
    icon: 'calendar_month',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'percentage-increase',
    title: 'Percentage Increase Calculator',
    description: 'Calculate percentage increase.',
    category: 'percentages',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'calories',
    title: 'Calorie Calculator',
    description: 'Calculate daily calorie needs.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Estimate mortgage payments and terms.',
    category: 'home',
    icon: 'home',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'contact',
    title: 'Contact Calculator',
    description: 'Contact and support tools.',
    category: 'converters',
    icon: 'contact_mail',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: '[calculator]',
    title: 'Calculator',
    description: 'General calculator tool.',
    category: 'converters',
    icon: 'calculate',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'tdee',
    title: 'TDEE Calculator',
    description: 'Estimate total daily energy expenditure.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'cost-of-living-calculator',
    title: 'Cost of Living Calculator',
    description: 'Estimate cost of living in different areas.',
    category: 'savings',
    icon: 'location_city',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'distance-converter',
    title: 'Distance Converter',
    description: 'Convert distance units.',
    category: 'converters',
    icon: 'swap_horiz',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'percentage',
    title: 'Percentage Calculator',
    description: 'Calculate percentages.',
    category: 'percentages',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'auto-loan',
    title: 'Auto Loan Calculator',
    description: 'Estimate auto loan payments.',
    category: 'loans',
    icon: 'directions_car',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'bike-gear',
    title: 'Bike Gear Calculator',
    description: 'Calculate bike gear ratios and speed.',
    category: 'outdoors',
    icon: 'directions_bike',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'calories-cycling',
    title: 'Calories Cycling Calculator',
    description: 'Estimate calories burned cycling.',
    category: 'health',
    icon: 'local_fire_department',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'date-difference',
    title: 'Date Difference Calculator',
    description: 'Calculate difference between dates.',
    category: 'time',
    icon: 'event',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'debt-to-income',
    title: 'Debt-to-Income Calculator',
    description: 'Calculate debt-to-income ratio.',
    category: 'savings',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'down-payment',
    title: 'Down Payment Calculator',
    description: 'Estimate required down payment.',
    category: 'home',
    icon: 'payments',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'health',
    title: 'Health Calculator',
    description: 'Health and wellness tools.',
    category: 'health',
    icon: 'favorite',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'investment-growth',
    title: 'Investment Growth Calculator',
    description: 'Estimate investment growth over time.',
    category: 'savings',
    icon: 'trending_up',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'length',
    title: 'Length Converter',
    description: 'Convert length units.',
    category: 'converters',
    icon: 'straighten',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'loan-affordability',
    title: 'Loan Affordability Calculator',
    description: 'Estimate affordable loan amount.',
    category: 'loans',
    icon: 'request_quote',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'loan',
    title: 'Loan Calculator',
    description: 'General loan calculator.',
    category: 'loans',
    icon: 'request_quote',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'net-worth',
    title: 'Net Worth Calculator',
    description: 'Calculate your net worth.',
    category: 'savings',
    icon: 'account_balance_wallet',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'percent-change',
    title: 'Percent Change Calculator',
    description: 'Calculate percent change between values.',
    category: 'percentages',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'percentage-decrease',
    title: 'Percentage Decrease Calculator',
    description: 'Calculate percentage decrease.',
    category: 'percentages',
    icon: 'percent',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'protein-intake',
    title: 'Protein Intake Calculator',
    description: 'Estimate daily protein needs.',
    category: 'health',
    icon: 'nutrition',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'rent-vs-buy',
    title: 'Rent vs Buy Calculator',
    description: 'Compare renting vs buying a home.',
    category: 'home',
    icon: 'home',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'retirement',
    title: 'Retirement Calculator',
    description: 'Estimate retirement savings and needs.',
    category: 'savings',
    icon: 'event',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'salary-hourly',
    title: 'Salary Hourly Calculator',
    description: 'Convert salary to hourly wage.',
    category: 'income',
    icon: 'schedule',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'savings',
    title: 'Savings Calculator',
    description: 'Estimate savings growth.',
    category: 'savings',
    icon: 'savings',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'speed',
    title: 'Speed Calculator',
    description: 'Calculate speed and conversions.',
    category: 'converters',
    icon: 'speed',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'tax',
    title: 'Tax Calculator',
    description: 'Estimate taxes and deductions.',
    category: 'savings',
    icon: 'request_quote',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'tip',
    title: 'Tip Calculator',
    description: 'Calculate tips and total bill.',
    category: 'savings',
    icon: 'paid',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'time',
    title: 'Time Calculator',
    description: 'General time calculator.',
    category: 'time',
    icon: 'schedule',
    fields: [],
    calculate: () => ({ results: [] }),
  },
  {
    slug: 'privacy',
    title: 'Privacy Tools',
    description: 'Privacy and security tools.',
    category: 'converters',
    icon: 'lock',
    fields: [],
    calculate: () => ({ results: [] }),
  }
]
// --- END AUTO-GENERATED PLACEHOLDER CONFIGS ---
const withContentAndRelated = (config: Omit<GeneratedCalculatorConfig, 'relatedTools' | 'howItWorks' | 'tip' | 'fact' | 'note' | 'faqs'>): GeneratedCalculatorConfig => {
  const defaultContent = makeStandardContent(config.title);
  const related = CATEGORY_RELATED[config.category];
  return {
    ...config,
    ...defaultContent,
    relatedTools: related,
  };
};

const isIndexableSlug = (slug: string) => !slug.includes('[') && !slug.includes(']');

export const generatedCalculators: GeneratedCalculatorConfig[] = [...baseGeneratedCalculators, ...additionalGeneratedCalculators]
  .map(withContentAndRelated)
  .filter((calculator) => isIndexableSlug(calculator.slug));

export const generatedCalculatorBySlug: Record<string, GeneratedCalculatorConfig> = generatedCalculators.reduce<Record<string, GeneratedCalculatorConfig>>((acc, calculator) => {
  acc[calculator.slug] = calculator;
  return acc;
}, {});
