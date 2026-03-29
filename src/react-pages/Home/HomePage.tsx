import Card from '../../components/Card';

export default function HomePage() {
  const calculators = [
    {
      path: '/mortgage',
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payments, total interest, and amortization summary.',
      icon: 'home',
    },
    {
      path: '/budget',
      title: 'Budget Calculator',
      description: 'Plan your monthly budget with income and expense tracking.',
      icon: 'wallet',
    },
    {
      path: '/interest',
      title: 'Interest Calculator',
      description: 'Calculate simple interest on your principal amount.',
      icon: 'percent',
    },
    {
      path: '/compound-interest',
      title: 'Compound Interest Calculator',
      description: 'Watch your money grow with compound interest over time.',
      icon: 'trending_up',
    },
    {
      path: '/auto-loan',
      title: 'Auto Loan Calculator',
      description: 'Calculate car payment and total interest costs.',
      icon: 'directions_car',
    },
    {
      path: '/credit-card-payoff',
      title: 'Credit Card Payoff',
      description: 'Find how long to pay off credit card debt.',
      icon: 'credit_card',
    },
    {
      path: '/retirement',
      title: 'Retirement Calculator',
      description: 'Plan your retirement and check if you\'re on track.',
      icon: 'savings',
    },
    {
      path: '/investment-growth',
      title: 'Investment Growth',
      description: 'Project your investment growth with regular contributions.',
      icon: 'show_chart',
    },
    {
      path: '/refinance',
      title: 'Refinance Calculator',
      description: 'Calculate savings from refinancing your loan.',
      icon: 'gavel',
    },
    {
      path: '/down-payment',
      title: 'Down Payment Calculator',
      description: 'Calculate down payment and monthly payment estimates.',
      icon: 'attach_money',
    },
    {
      path: '/weather',
      title: 'Weather Converter',
      description: 'Convert temperatures between Celsius and Fahrenheit instantly.',
      icon: 'thermostat',
    },
    {
      path: '/calories',
      title: 'Calorie Calculator',
      description: 'Calculate BMR and daily calorie targets based on your goals.',
      icon: 'nutrition',
    },
    {
      path: '/bike-gear',
      title: 'Bike Gear Calculator',
      description: 'Compute gear inches and speed estimates for your bike setup.',
      icon: 'two_wheeler',
    },
    {
      path: '/net-worth',
      title: 'Net Worth Calculator',
      description: 'Track your assets and liabilities to calculate your net worth.',
      icon: 'account_balance',
    },
    {
      path: '/loan',
      title: 'Loan Calculator',
      description: 'Calculate monthly payments and amortization for any loan.',
      icon: 'request_quote',
    },
    {
      path: '/savings',
      title: 'Savings Calculator',
      description: 'Calculate how your savings will grow over time with regular deposits.',
      icon: 'savings',
    },
    {
      path: '/tax',
      title: 'Tax Calculator',
      description: 'Calculate sales tax, income tax, and after-tax amounts.',
      icon: 'receipt_long',
    },
    {
      path: '/inflation',
      title: 'Inflation Calculator',
      description: 'Calculate the future value of money adjusted for inflation.',
      icon: 'trending_down',
    },
    {
      path: '/salary-hourly',
      title: 'Salary to Hourly',
      description: 'Convert between annual salary and hourly wage rates.',
      icon: 'payments',
    },
    {
      path: '/bmi',
      title: 'BMI Calculator',
      description: 'Calculate your body mass index and health category.',
      icon: 'monitor_weight',
    },
    {
      path: '/age',
      title: 'Age Calculator',
      description: 'Calculate exact age from date of birth to any date.',
      icon: 'cake',
    },
    {
      path: '/tip',
      title: 'Tip Calculator',
      description: 'Calculate tip amount and total bill with split options.',
      icon: 'restaurant',
    },
    {
      path: '/time-duration',
      title: 'Time Duration Calculator',
      description: 'Calculate duration between two times or add/subtract time.',
      icon: 'hourglass_empty',
    },
    {
      path: '/loan-affordability',
      title: 'Loan Affordability',
      description: 'Find out how much loan you can afford based on your income.',
      icon: 'account_balance_wallet',
    },
    {
      path: '/rent-vs-buy',
      title: 'Rent vs Buy',
      description: 'Compare total costs of renting and buying a home.',
      icon: 'home_work',
    },
    {
      path: '/emergency-fund',
      title: 'Emergency Fund',
      description: 'Calculate how much emergency fund you need to save.',
      icon: 'security',
    },
    {
      path: '/debt-to-income',
      title: 'Debt-to-Income Ratio',
      description: 'Check your debt level and financial health.',
      icon: 'trending_up',
    },
    {
      path: '/tdee',
      title: 'TDEE Calculator',
      description: 'Calculate total daily energy expenditure and calorie needs.',
      icon: 'local_fire_department',
    },
    {
      path: '/ideal-weight',
      title: 'Ideal Weight',
      description: 'Find your ideal weight range using multiple formulas.',
      icon: 'scale',
    },
    {
      path: '/water-intake',
      title: 'Water Intake',
      description: 'Calculate daily water intake based on weight and activity.',
      icon: 'water_bottle',
    },
    {
      path: '/protein-intake',
      title: 'Protein Intake',
      description: 'Calculate daily protein needs for fitness goals.',
      icon: 'egg',
    },
    {
      path: '/height-converter',
      title: 'Height Converter',
      description: 'Convert between feet/inches and centimeters.',
      icon: 'height',
    },
    {
      path: '/distance-converter',
      title: 'Distance Converter',
      description: 'Convert miles and kilometers easily.',
      icon: 'straighten',
    },
    {
      path: '/cooking-converter',
      title: 'Cooking Converter',
      description: 'Convert cups, grams, ml, and ounces for recipes.',
      icon: 'local_dining',
    },
    {
      path: '/power-converter',
      title: 'Power Converter',
      description: 'Convert watts and horsepower.',
      icon: 'flash_on',
    },
    {
      path: '/cycling-power-to-weight',
      title: 'Cycling Power-to-Weight',
      description: 'Calculate your cycling power-to-weight ratio.',
      icon: 'two_wheeler',
    },
    {
      path: '/tire-pressure',
      title: 'Tire Pressure',
      description: 'Calculate ideal tire pressure for your bike.',
      icon: 'tire_repair',
    },
    {
      path: '/hiking-pace',
      title: 'Hiking Pace',
      description: 'Estimate hiking duration based on distance and elevation.',
      icon: 'hiking',
    },
    {
      path: '/calories-cycling',
      title: 'Calories Burned Cycling',
      description: 'Calculate calories burned while cycling.',
      icon: 'directions_bike',
    },
    {
      path: '/percentage-increase',
      title: 'Percentage Increase',
      description: 'Calculate percentage increase between two values.',
      icon: 'trending_up',
    },
    {
      path: '/percentage-decrease',
      title: 'Percentage Decrease',
      description: 'Calculate percentage decrease and discounts.',
      icon: 'trending_down',
    },
    {
      path: '/percent-change',
      title: 'Percent Change',
      description: 'Calculate percent change for gains or losses.',
      icon: 'show_chart',
    },
    {
      path: '/roi',
      title: 'ROI Calculator',
      description: 'Calculate return on investment percentage and gain amount.',
      icon: 'trending_up',
    },
    {
      path: '/fuel-efficiency',
      title: 'Fuel Efficiency',
      description: 'Calculate MPG, fuel costs, and trip expenses.',
      icon: 'local_gas_station',
    },
    {
      path: '/discount',
      title: 'Discount Calculator',
      description: 'Calculate discount amounts and final prices.',
      icon: 'local_offer',
    },
    {
      path: '/cost-of-living-calculator',
      title: 'Cost of Living',
      description: 'Track monthly and yearly living expenses by category.',
      icon: 'apartment',
    },
    {
      path: '/gpa',
      title: 'GPA Calculator',
      description: 'Calculate weighted GPA and letter grade.',
      icon: 'grade',
    },
  ];

  const converters = [
    {
      path: '/weather',
      title: 'Temperature Converter',
      description: 'Convert Celsius and Fahrenheit instantly.',
      icon: 'thermostat',
    },
    {
      path: '/weight',
      title: 'Weight Converter',
      description: 'Convert pounds and kilograms.',
      icon: 'fitness_center',
    },
    {
      path: '/length',
      title: 'Length Converter',
      description: 'Convert inches, centimeters, feet, and meters.',
      icon: 'straighten',
    },
    {
      path: '/speed',
      title: 'Speed Converter',
      description: 'Convert mph and km/h.',
      icon: 'speed',
    },
    {
      path: '/volume',
      title: 'Volume Converter',
      description: 'Convert gallons and liters.',
      icon: 'water_drop',
    },
    {
      path: '/area',
      title: 'Area Converter',
      description: 'Convert square feet and square meters.',
      icon: 'crop_square',
    },
    {
      path: '/time',
      title: 'Time Converter',
      description: 'Convert hours and minutes.',
      icon: 'schedule',
    },
    {
      path: '/file-size',
      title: 'File Size Converter',
      description: 'Convert KB, MB, and GB.',
      icon: 'storage',
    },
    {
      path: '/percentage',
      title: 'Percentage Converter',
      description: 'Convert percent and decimal values.',
      icon: 'percent',
    },
    {
      path: '/date-difference',
      title: 'Date Difference',
      description: 'Calculate the difference between dates.',
      icon: 'event',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Simple Calculators</h2>
      <p className="text-slate-600 mb-8">
        A collection of fast, lightweight calculators to help you with everyday calculations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {calculators.slice(0, 2).map((calc) => (
          <a key={calc.path} href={calc.path}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-3xl text-blue-600 flex-shrink-0">
                  {calc.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{calc.title}</h3>
                  <p className="text-sm text-slate-600">{calc.description}</p>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calculators.slice(2).map((calc) => (
          <a key={calc.path} href={calc.path}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-3xl text-blue-600 mb-3">
                  {calc.icon}
                </span>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{calc.title}</h3>
                <p className="text-xs text-slate-600">{calc.description}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Quick Converters</h3>
        <p className="text-slate-600 mb-6">
          Jump straight to unit converters for common everyday tasks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {converters.map((converter) => (
            <a key={converter.path} href={converter.path}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-3xl text-blue-600 flex-shrink-0">
                    {converter.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{converter.title}</h3>
                    <p className="text-xs text-slate-600">{converter.description}</p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
