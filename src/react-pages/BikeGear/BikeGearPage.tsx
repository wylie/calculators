import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import RelatedTools from '../../components/RelatedTools';
import { calculateBikeGear, calculateBikeGearCombos } from '../../utils/calculators';
import analytics from '../../utils/analytics';

export default function BikeGearPage() {
  useEffect(() => {
    analytics.trackCalculatorView('bike-gear');
  }, []);
  const [chainring, setChainring] = useStickyState('bike-gear-chainring', '32');
  const [cog, setCog] = useStickyState('bike-gear-cog', '28');
  const [wheelDiameter, setWheelDiameter] = useStickyState('bike-gear-wheel', '29');
  const [cadence, setCadence] = useStickyState('bike-gear-cadence', '80');

  const result = calculateBikeGear({
    chainring: parseFloat(chainring) || 0,
    cog: parseFloat(cog) || 0,
    wheelDiameter: parseFloat(wheelDiameter) || 0,
    cadence: parseFloat(cadence) || 0,
  });

  const presetCombos = calculateBikeGearCombos(parseFloat(wheelDiameter) || 0, parseFloat(cadence) || 0, [
    { chainring: 32, cog: 52 },
    { chainring: 32, cog: 42 },
    { chainring: 32, cog: 28 },
  ]);

  const handleReset = () => {
    setChainring('32');
    setCog('28');
    setWheelDiameter('29');
    setCadence('80');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Bike Gear Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate gear inches and speed estimates for different chainring and cog combinations.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Drivetrain Setup</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Chainring (teeth)"
                value={chainring}
                onChange={setChainring}
                type="number"
                min="20"
                max="60"
              />

              <Input
                label="Cassette Cog (teeth)"
                value={cog}
                onChange={setCog}
                type="number"
                min="10"
                max="60"
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 my-4">Wheel & Cadence</h3>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Wheel Diameter (inches)"
                value={wheelDiameter}
                onChange={setWheelDiameter}
                options={[
                  { value: '26', label: '26 inch (BMX/Trials)' },
                  { value: '27.5', label: '27.5 inch (Modern MTB)' },
                  { value: '29', label: '29 inch (XC MTB)' },
                  { value: '27', label: '27 inch (700c approximate)' },
                ]}
              />

              <Input
                label="Cadence (RPM)"
                value={cadence}
                onChange={setCadence}
                type="number"
                min="60"
                max="150"
              />
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
            >
              Reset
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Preset Combinations</h3>

            <div className="space-y-3">
              {presetCombos.map((combo, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {combo.chainring}T x {combo.cog}T
                    </p>
                    <p className="text-xs text-slate-600">
                      Ratio: {combo.gearRatio.toFixed(2)} | Inches: {combo.gearInches.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{combo.speedMph.toFixed(1)} mph</p>
                    <p className="text-xs text-slate-500">@ {cadence} RPM</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-600">Gear Ratio</p>
                <p className="text-3xl font-bold text-blue-600">{result.gearRatio.toFixed(2)}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-600">Gear Inches</p>
                <p className="text-3xl font-bold text-slate-900">{result.gearInches.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">inches per pedal revolution</p>
              </div>

              <div className="border-t border-slate-200 pt-4 bg-blue-50 p-3 rounded">
                <p className="text-xs text-slate-600">Speed Estimate</p>
                <p className="text-3xl font-bold text-blue-600">{result.speedMph.toFixed(1)}</p>
                <p className="text-xs text-slate-600 mt-1">
                  MPH @ {cadence} RPM cadence
                </p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <RelatedTools
        tools={[
          { path: '/speed', title: 'Speed Converter', icon: 'speed' },
          { path: '/calories', title: 'Calorie Calculator', icon: 'fastfood' },
          { path: '/length', title: 'Length Converter', icon: 'straighten' },
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
        ]}
      />
    </div>
  );
}
