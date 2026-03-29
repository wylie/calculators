import Card from './Card'

interface RelatedTool {
  path: string
  title: string
  icon: string
}

interface RelatedToolsProps {
  tools: RelatedTool[]
}

interface TrackerLink {
  path: string
  title: string
  icon: string
  keywords: string[]
}

const TRACKER_BASE_URL = 'https://simpletrackers.io'

const TRACKERS: TrackerLink[] = [
  { path: '/trackers/finance-tracker', title: 'Finance Tracker', icon: 'attach_money', keywords: ['mortgage', 'loan', 'interest', 'budget', 'tax', 'retirement', 'salary', 'income', 'debt', 'credit', 'payment', 'roi', 'refinance', 'net worth', 'down payment', 'savings', 'investment', 'finance'] },
  { path: '/trackers/health-tracker', title: 'Health Tracker', icon: 'favorite', keywords: ['health', 'bmi', 'calorie', 'protein', 'tdee', 'weight', 'ideal', 'heart', 'body', 'intake', 'nutrition'] },
  { path: '/trackers/workout-tracker', title: 'Workout Tracker', icon: 'fitness_center', keywords: ['workout', 'cycling', 'bike', 'hiking', 'pace', 'vo2', 'fitness', 'rep'] },
  { path: '/trackers/sleep-tracker', title: 'Sleep Tracker', icon: 'bed', keywords: ['sleep', 'time', 'duration'] },
  { path: '/trackers/meal-tracker', title: 'Meal Tracker', icon: 'restaurant', keywords: ['meal', 'calorie', 'protein', 'nutrition', 'diet'] },
  { path: '/trackers/task-tracker', title: 'Task Tracker', icon: 'assignment', keywords: ['time', 'date', 'schedule', 'business days', 'countdown', 'task', 'plan', 'todo'] },
  { path: '/trackers/habit-tracker', title: 'Habit Tracker', icon: 'check_circle', keywords: ['goal', 'track', 'consistency', 'daily', 'habit'] },
  { path: '/trackers/reading-tracker', title: 'Reading Tracker', icon: 'menu_book', keywords: ['read', 'reading', 'book', 'study', 'learning'] },
  { path: '/trackers/movie-watch-tracker', title: 'Movie Watch Tracker', icon: 'movie', keywords: ['movie', 'watch', 'film', 'shows', 'series'] },
  { path: '/trackers/video-game-tracker', title: 'Video Game Tracker', icon: 'sports_esports', keywords: ['game', 'gaming', 'video game', 'play', 'esports'] },
  { path: '/trackers/garden-harvest-tracker', title: 'Garden Harvest Tracker', icon: 'eco', keywords: ['garden', 'harvest', 'plant', 'grow', 'outdoor'] },
  { path: '/trackers/custom-tracker', title: 'Custom Tracker', icon: 'track_changes', keywords: ['custom'] },
]

const scoreTracker = (text: string, tracker: TrackerLink): number => {
  return tracker.keywords.reduce((score, keyword) => {
    return text.includes(keyword) ? score + 1 : score
  }, 0)
}

const getRelatedTrackers = (tools: RelatedTool[]): Array<{ href: string; title: string; icon: string }> => {
  const contextText = tools
    .map((tool) => `${tool.title} ${tool.path}`)
    .join(' ')
    .toLowerCase()

  const ranked = TRACKERS
    .map((tracker) => ({ tracker, score: scoreTracker(contextText, tracker) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.tracker.title.localeCompare(b.tracker.title))

  const selected = ranked.slice(0, 3).map((item) => item.tracker)

  // Always include a flexible fallback option.
  if (!selected.some((tracker) => tracker.path === '/trackers/custom-tracker')) {
    selected.push(TRACKERS.find((tracker) => tracker.path === '/trackers/custom-tracker')!)
  }

  return selected.slice(0, 4).map((tracker) => ({
    href: `${TRACKER_BASE_URL}${tracker.path}`,
    title: tracker.title,
    icon: tracker.icon,
  }))
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null

  const relatedTrackers = getRelatedTrackers(tools)

  return (
    <section className="mt-8 pt-8 border-t border-slate-200" aria-label="Related calculators and converters">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Related Calculators</h2>
      <p className="text-sm text-slate-600 mb-4">
        Explore more calculators and converters for related scenarios.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.path}
            href={tool.path}
            title={`Open ${tool.title}`}
            className="hover:opacity-75 transition-opacity"
          >
            <Card className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="material-symbols-outlined text-blue-600"
                  style={{ fontSize: '22px', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  {tool.icon}
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate">{tool.title}</span>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {relatedTrackers.length > 0 && (
        <>
          <h3 className="text-3xl font-bold text-slate-900 mt-10 mb-4">Related Trackers</h3>
          <p className="text-sm text-slate-600 mb-4">
            Keep your progress organized with matching trackers on SimpleTrackers.io.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTrackers.map((tracker) => (
              <a
                key={tracker.href}
                href={tracker.href}
                title={`Open ${tracker.title} on SimpleTrackers.io`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
              >
                <Card className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="material-symbols-outlined text-blue-600"
                      style={{ fontSize: '22px', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                    >
                      {tracker.icon}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">{tracker.title}</span>
                  </div>
                  <span
                    className="material-symbols-outlined text-slate-500"
                    aria-hidden="true"
                    style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    open_in_new
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
