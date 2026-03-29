import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateFuelEfficiency } from '../../utils/calculators';
import { formatCurrency } from '../../utils/formatting';
import analytics from '../../utils/analytics';

export default function FuelEfficiencyPage() {
  useEffect(() => {
    analytics.trackCalculatorView('fuel-efficiency');
  }, []);
  const [distance, setDistance] = useStickyState('fuel-distance', '300');
  const [distanceUnit, setDistanceUnit] = useStickyState('fuel-distance-unit', 'miles');
  const [fuelUsed, setFuelUsed] = useStickyState('fuel-used', '10');
  const [fuelUnit, setFuelUnit] = useStickyState('fuel-unit', 'gallons');

  const result = calculateFuelEfficiency({
    distance: parseFloat(distance) || 0,
    distanceUnit: distanceUnit as 'miles' | 'km',
    fuelUsed: parseFloat(fuelUsed) || 0,
    fuelUnit: fuelUnit as 'gallons' | 'liters',
  });

  const handleReset = () => {
    setDistance('300');
    setDistanceUnit('miles');
    setFuelUsed('10');
    setFuelUnit('gallons');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Fuel Efficiency Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate your vehicle's fuel efficiency in MPG, KM/L, and cost per distance traveled.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trip Details</h3>

            <Input
              label="Distance"
              value={distance}
              onChange={setDistance}
              type="number"
              min="0"
            />

            <Select
              label="Distance Unit"
              value={distanceUnit}
              onChange={setDistanceUnit}
              options={[
                { value: 'miles', label: 'Miles' },
                { value: 'km', label: 'Kilometers' },
              ]}
            />

            <Input
              label="Fuel Used"
              value={fuelUsed}
              onChange={setFuelUsed}
              type="number"
              min="0"
              step="0.1"
            />

            <Select
              label="Fuel Unit"
              value={fuelUnit}
              onChange={setFuelUnit}
              options={[
                { value: 'gallons', label: 'Gallons' },
                { value: 'liters', label: 'Liters' },
              ]}
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
                <p className="text-xs text-slate-600">MPG</p>
                <p className="text-2xl font-bold text-blue-600">{result.mpg.toFixed(2)}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">KM/L</p>
                <p className="text-xl font-bold text-slate-900">{result.kmpl.toFixed(2)}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Cost per Mile</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(result.costPerMile)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Cost per 100km</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(result.costPer100km)}
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Fuel Efficiency Tips</h3>
          <p className="text-sm text-gray-600">
            Regular maintenance, proper tire pressure, and smooth acceleration can significantly improve your fuel efficiency and save money.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average cars get 25-30 MPG on highways and 15-25 MPG in cities. Hybrid vehicles can achieve 40-55 MPG.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Cost calculations use an average gas price of $3.50/gallon. Actual costs vary by region and fuel prices change regularly.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this fuel efficiency calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          This calculator converts fuel efficiency between different units (MPG and KM/L) and estimates your fuel costs based on distance traveled.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>MPG = Distance (miles) / Fuel Used (gallons)</li>
          <li>KM/L = Distance (km) / Fuel Used (liters)</li>
          <li>Cost per Mile = Average Gas Price / MPG</li>
          <li>Cost per 100km uses converted MPG and average gas price per gallon</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Fuel efficiency FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Why does my actual MPG differ from EPA estimates?</summary>
            <p className="mt-2">Driving habits, traffic conditions, terrain, weather, and vehicle loads all affect fuel efficiency. Highway driving is typically more efficient than city driving.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How can I improve my fuel efficiency?</summary>
            <p className="mt-2">Maintain proper tire pressure, change air filters regularly, reduce weight, accelerate smoothly, and avoid excessive idling. Proper maintenance is key.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Is premium gas more efficient?</summary>
            <p className="mt-2">Premium fuel provides better performance in high-compression engines, but won't improve efficiency in regular engines. Use the fuel grade your manufacturer recommends.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/tire-pressure', title: 'Tire Pressure Calculator', icon: 'tire_repair' },
          { path: '/bike-gear', title: 'Bike Gear Calculator', icon: 'two_wheeler' },
          { path: '/distance-converter', title: 'Distance Converter', icon: 'straighten' },
        ]}
      />
    </div>
  );
}
