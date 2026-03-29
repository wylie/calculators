import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateHikingPace } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function HikingPacePage() {
  useEffect(() => {
    analytics.trackCalculatorView('hiking-pace');
  }, []);
  const [input, setInput] = useStickyState<any>('hikingPace-input', {
    distance: 10,
    elevation: 500,
    unit: 'km',
    fitness: 'intermediate',
  });

  const result = calculateHikingPace({
    distance: Number(input.distance) || 0,
    elevation: Number(input.elevation) || 0,
    unit: input.unit,
    fitness: input.fitness,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hiking Pace Calculator</h1>
        <p className="text-gray-600">Estimate hiking time based on distance, elevation gain, and fitness level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <Input
              label="Distance"
              type="number"
              value={input.distance}
              onChange={(value) => setInput({ ...input, distance: value === '' ? '' : parseFloat(value) })}
              min="0.5"
              step="0.5"
            />
            <Select
              label="Unit"
              value={input.unit}
              onChange={(value) => setInput({ ...input, unit: value })}
              options={[
                { value: 'km', label: 'Kilometers (km)' },
                { value: 'miles', label: 'Miles (mi)' },
              ]}
            />
            <Input
              label="Elevation Gain"
              type="number"
              value={input.elevation}
              onChange={(value) => setInput({ ...input, elevation: value === '' ? '' : parseFloat(value) })}
              min="0"
              step="50"
            />
            <Select
              label="Fitness Level"
              value={input.fitness}
              onChange={(value) => setInput({ ...input, fitness: value })}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>
        </Card>

        <div>
          {/* Results */}
          <Card className="bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Estimated Time</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Hiking Duration</p>
                <p className="text-3xl font-bold text-blue-600">{result.timeFormatted}</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Total Minutes</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(result.timeMinutes)} minutes</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Average Pace</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.paceMph.toFixed(2)} {input.unit === 'km' ? 'km/h' : 'mph'}
                </p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-gray-600">Time per {input.unit === 'km' ? 'km' : 'mi'}</p>
                <p className="text-lg font-semibold text-gray-900">{result.paceMin.toFixed(0)} min</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Hiking Tips</h3>
          <p className="text-sm text-gray-600">
            Elevation gain significantly impacts pace. Plan accordingly and take breaks
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            500m elevation gain = about 1 hour extra time. Rest is important
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            These are estimates. Actual time depends on fitness, trail condition, and weather
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">How Hiking Pace Calculator Works</h2>
        <p className="text-sm text-gray-600 mb-3">
          This calculator estimates hiking time using distance, elevation gain, and fitness level.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Base pace varies by fitness level (slow, moderate, fast)</li>
          <li>Elevation gain adds significant time - roughly 1 hour per 500m</li>
          <li>Descent is faster than ascent but harder on the knees</li>
          <li>Trail conditions (mud, rocks, etc.) affect actual pace</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Hiking Pace FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How does elevation impact hiking time?</summary>
            <p className="mt-2">Elevation gain dramatically increases time. Descents are faster but take longer step-by-step due to impact stress.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Should I include rest breaks in my plan?</summary>
            <p className="mt-2">Yes! Add 10-15 minutes for every 2 hours of hiking for snacks and water. More if climbing steeply.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What affects hiking pace most?</summary>
            <p className="mt-2">Elevation gain is the biggest factor. Weather, altitude, trail condition, and fitness also matter significantly.</p>
          </details>
        </div>
      </Card><RelatedTools
        tools={[
          { path: '/time-duration', title: 'Time Duration', icon: 'schedule' },
          { path: '/distance-converter', title: 'Distance Converter', icon: 'straighten' },
          { path: '/speed', title: 'Speed Calculator', icon: 'speed' },
        ]}
      />
    </div>
  );
}
