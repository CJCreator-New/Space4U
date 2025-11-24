import { Target, Trophy, Flame, CheckCircle } from '../../config/icons'

export default function GratitudeChallenges({ entries = [] }) {
    const challenges = [
        {
            id: 1,
            title: "7-Day Streak",
            description: "Log gratitude for 7 consecutive days",
            target: 7,
            icon: <Flame className="text-orange-500" size={24} />,
            progress: calculateStreak(entries),
        },
        {
            id: 2,
            title: "30 Entries",
            description: "Reach 30 total gratitude entries",
            target: 30,
            icon: <Trophy className="text-yellow-500" size={24} />,
            progress: entries.length,
        },
        {
            id: 3,
            title: "Category Master",
            description: "Use at least 5 different categories",
            target: 5,
            icon: <Target className="text-blue-500" size={24} />,
            progress: calculateUniqueCategories(entries),
        },
    ]

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-600" size={24} />
                Gratitude Challenges
            </h3>

            <div className="space-y-4">
                {challenges.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </div>
    )
}

function ChallengeCard({ challenge }) {
    const { title, description, target, icon, progress } = challenge
    const percentage = Math.min((progress / target) * 100, 100)
    const isComplete = progress >= target

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                </div>
                {isComplete && (
                    <CheckCircle className="text-green-500" size={24} />
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {progress} / {target}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

function calculateStreak(entries) {
    if (entries.length === 0) return 0

    const sortedDates = entries
        .map(e => new Date(e.date))
        .sort((a, b) => b - a)

    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let lastDate = sortedDates[0]
    lastDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    if (daysDiff > 1) return 0

    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i])
        currentDate.setHours(0, 0, 0, 0)
        lastDate = new Date(sortedDates[i - 1])
        lastDate.setHours(0, 0, 0, 0)

        const diff = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24))
        if (diff === 1) {
            streak++
        } else {
            break
        }
    }

    return streak
}

function calculateUniqueCategories(entries) {
    const categories = new Set()
    entries.forEach(entry => {
        if (entry.categories && Array.isArray(entry.categories)) {
            entry.categories.forEach(cat => categories.add(cat))
        }
    })
    return categories.size
}
