import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { convertDistance } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function DistanceConverterPage() {
  useEffect(() => {
    analytics.trackCalculatorView('distance-converter');
  }, []);
  const [value, setValue] = useStickyState('distanceConverter-value', '10');
  const [fromUnit, setFromUnit] = useStickyState<'miles' | 'km'>('distanceConverter-unit', 'km');

  const result = convertDistance({
    value: parseFloat(value) || 0,
    fromUnit,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Distance Converter</h1>
        <p className="text-gray-600">Convert distances between miles and kilometers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Distance"
                value={value}
                onChange={setValue}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <Select
                label="From Unit"
                value={fromUnit}
                onChange={(val) => setFromUnit(val as 'miles' | 'km')}
                options={[
                  { value: 'km', label: 'Kilometers (km)' },
                  { value: 'miles', label: 'Miles (mi)' },
                ]}
              />
            </div>
          </div>
        </Card>

        <div>
          <Card className="bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Miles</p>
                <p className="text-2xl font-bold text-blue-600">{result.miles.toFixed(2)} mi</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Kilometers</p>
                <p className="text-2xl font-bold text-blue-600">{result.kilometers.toFixed(2)} km</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Distance Tips</h3>
          <p className="text-sm text-gray-600">
            1 mile = 1.609 kilometers. Most of the world uses kilometers
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            A marathon is 42.195 km or 26.2 miles. A 5K is 3.107 miles
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            Use this for road distances, running routes, and travel planning
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Distance Converter Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This converter switches between metric (kilometers) and imperial (miles) distance measurements.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>1 mile (mi) = 1.609344 kilometers (km)</li>
          <li>1 kilometer = 0.621371 miles</li>
          <li>Decimal input is supported for precise conversion</li>
          <li>Common for running, driving, and travel distances</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Distance Converter FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Which countries use miles?</summary>
            <p className="mt-2">Primarily the US, UK, and some Commonwealth countries. Most of the world uses kilometers.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How fast is 100 km/h in mph?</summary>
            <p className="mt-2">100 km/h = 62.14 mph. A quick rule: multiply km/h by 0.6 for approximate mph.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What about nautical miles?</summary>
            <p className="mt-2">Nautical miles (1.852 km) are used for sea and air travel. This tool covers land distances.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/height-converter', title: 'Height Converter', icon: 'straighten' },
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/length', title: 'Length Converter', icon: 'measure' },
        ]}
      />
    </div>
  );
}
