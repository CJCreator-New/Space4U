import React from 'react'

export default function DashboardWidgets() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder for dashboard widgets */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Activity Summary</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your recent activity will appear here.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Goals Progress</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Track your wellness goals here.</p>
            </div>
        </div>
    )
}
