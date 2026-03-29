import { useEffect } from 'react';
import useStickyState from '../../utils/useStickyState';
import Card from '../../components/Card';
import SupportSidebar from '../../components/SupportSidebar';
import Input from '../../components/Input';
import RelatedTools from '../../components/RelatedTools';
import { calculateGPA } from '../../utils/calculators';
import type { GradeItem } from '../../types';
import analytics from '../../utils/analytics';

export default function GPAPage() {
  useEffect(() => {
    analytics.trackCalculatorView('gpa');
  }, []);
  const [grades, setGrades] = useStickyState<GradeItem[]>('gpa-grades', [
    { id: '1', name: 'Math', grade: 3.5, weight: 1 },
    { id: '2', name: 'English', grade: 3.8, weight: 1 },
    { id: '3', name: 'Science', grade: 3.2, weight: 1 },
  ]);

  const result = calculateGPA({ grades });

  const handleAddGrade = () => {
    setGrades([
      ...grades,
      { id: Date.now().toString(), name: 'New Class', grade: 3.0, weight: 1 },
    ]);
  };

  const handleRemoveGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const handleUpdateGrade = (id: string, field: 'name' | 'grade' | 'weight', value: string | number) => {
    setGrades(
      grades.map(g =>
        g.id === id
          ? {
              ...g,
              [field]: field === 'name' ? value : parseFloat(value as string) || 0,
            }
          : g
      )
    );
  };

  const handleReset = () => {
    setGrades([
      { id: '1', name: 'Math', grade: 3.5, weight: 1 },
      { id: '2', name: 'English', grade: 3.8, weight: 1 },
      { id: '3', name: 'Science', grade: 3.2, weight: 1 },
    ]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">GPA Calculator</h1>
      <p className="text-slate-600 mb-6">
        Calculate your weighted GPA based on course grades and credit weights.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Grades</h3>
              <button
                onClick={handleAddGrade}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              {grades.map((grade) => (
                <div key={grade.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={grade.name}
                      onChange={(e) => handleUpdateGrade(grade.id, 'name', e.target.value)}
                      placeholder="Class name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Grade
                    </label>
                    <input
                      type="number"
                      value={grade.grade}
                      onChange={(e) => handleUpdateGrade(grade.id, 'grade', e.target.value)}
                      placeholder="4.0"
                      min="0"
                      max="4"
                      step="0.1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Weight
                    </label>
                    <input
                      type="number"
                      value={grade.weight}
                      onChange={(e) => handleUpdateGrade(grade.id, 'weight', e.target.value)}
                      placeholder="1"
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveGrade(grade.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
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
          <Card className="bg-blue-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">GPA</p>
                <p className="text-3xl font-bold text-blue-600">{result.gpa.toFixed(2)}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Letter Grade</p>
                <p className="text-lg font-bold text-slate-900">{result.letterGrade}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-600">Assessment</p>
                <p className="text-sm font-semibold text-slate-900">{result.description}</p>
              </div>
            </div>
          </Card>
          <SupportSidebar />
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2 text-sm">GPA Tips</h3>
          <p className="text-sm text-gray-600">
            Maintain a consistent GPA by focusing on core classes, seeking help early when struggling, and staying organized throughout the semester.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Quick Facts</h3>
          <p className="text-sm text-gray-600">
            Average high school GPA is around 3.0, while average college GPA is lower at 2.7. GPAs above 3.5 are considered excellent.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2 text-sm">Note</h3>
          <p className="text-sm text-gray-600">
            This calculator shows weighted GPA. Adjust weights based on credit hours or importance. Unweighted GPAs treat all courses equally.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How this GPA calculator works</h3>
        <p className="text-sm text-slate-700 mb-3">
          GPA (Grade Point Average) measures academic performance on a 4.0 scale. This calculator uses weighted averaging where each grade is multiplied by its weight before calculating the average.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Weighted Sum = Sum of (Grade × Weight) for all courses</li>
          <li>Total Weight = Sum of weights for all courses</li>
          <li>GPA = Weighted Sum ÷ Total Weight</li>
          <li>Letter grades are based on standard GPA ranges (A: 3.7+, B: 2.7-3.3, C: 1.7-2.3, etc.)</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated: February 2026</p>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">GPA calculator FAQ</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">What's the difference between weighted and unweighted GPA?</summary>
            <p className="mt-2">Unweighted GPA treats all courses equally. Weighted GPA accounts for course difficulty or credit hours, so harder courses contribute more to your final GPA.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">How do I improve my GPA?</summary>
            <p className="mt-2">Focus on getting better grades in upcoming classes. Since GPA is cumulative, your recent grades have more impact than old ones. Perfect future grades will slowly raise your overall GPA.</p>
          </details>
          <details className="rounded border border-slate-200 p-3 bg-white">
            <summary className="font-medium cursor-pointer">Does my GPA matter after college?</summary>
            <p className="mt-2">GPA matters for graduate school admissions, some entry-level jobs, and scholarships. After several years of work experience, GPA becomes less important than your resume and accomplishments.</p>
          </details>
        </div>
      </Card>

      <RelatedTools
        tools={[
          { path: '/percentage', title: 'Percentage Calculator', icon: 'percent' },
          { path: '/debt-to-income', title: 'Debt-to-Income Calculator', icon: 'balance' },
          { path: '/age', title: 'Age Calculator', icon: 'cake' },
        ]}
      />
    </div>
  );
}
