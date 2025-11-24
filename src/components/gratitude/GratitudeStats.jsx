import { TrendingUp, Calendar, Heart, Award } from '../../config/icons'

export default function GratitudeStats({ entries = [] }) {
    if (!entries || entries.length === 0) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">Start logging gratitude to see your stats!</p>
            </div>
        )
    }

    const totalEntries = entries.length
    const currentStreak = calculateStreak(entries)
    const longestStreak = calculateLongestStreak(entries)
    const avgItemsPerEntry = entries.reduce((sum, e) => sum + (e.items?.length || 0), 0) / totalEntries

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={24} />
                Your Gratitude Journey
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Heart className="text-pink-500" size={20} />}
                    label="Total Entries"
                    value={totalEntries}
                />
                <StatCard
                    icon={<Calendar className="text-blue-500" size={20} />}
                    label="Current Streak"
                    value={`${currentStreak} days`}
                />
                <StatCard
                    icon={<Award className="text-yellow-500" size={20} />}
                    label="Longest Streak"
                    value={`${longestStreak} days`}
                />
                <StatCard
                    icon={<TrendingUp className="text-green-500" size={20} />}
                    label="Avg Items"
                    value={avgItemsPerEntry.toFixed(1)}
                />
            </div>
        </div>
    )
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
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

function calculateLongestStreak(entries) {
    if (entries.length === 0) return 0

    const sortedDates = entries
        .map(e => new Date(e.date))
        .sort((a, b) => a - b)

    let longest = 1
    let current = 1

    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i])
        currentDate.setHours(0, 0, 0, 0)
        const prevDate = new Date(sortedDates[i - 1])
        prevDate.setHours(0, 0, 0, 0)

        const diff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24))
        if (diff === 1) {
            current++
            longest = Math.max(longest, current)
        } else {
            current = 1
        }
    }

    return longest
}
