import React, { useMemo } from 'react'
import { PremiumGate } from './PremiumGate'
import { getFeaturesByCategory } from '../../config/premiumFeatures'
import { BarChart3, AlertTriangle, PieChart, Heart, Users } from '../../config/icons'
import { trackFeatureView } from '../../services/premiumAnalytics'

/**
 * AnalyticsTiles - Data-driven component that renders analytics tiles
 * Conditionally shows premium features based on user.isPremium
 * @param {Object} user - User object with isPremium flag
 * @param {string} category - Category to filter features (default: 'analytics')
 */
export function AnalyticsTiles({ user, category = 'analytics' }) {
  const features = useMemo(() => getFeaturesByCategory(category), [category])

  const getIcon = (iconName) => {
    const icons = {
      BarChart3,
      AlertTriangle,
      PieChart,
      Heart,
      Users
    }
    return icons[iconName] || BarChart3
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map(feature => {
        const IconComponent = getIcon(feature.icon)

        return (
          <div key={feature.key} className="h-full">
            {feature.premium ? (
              <PremiumGate
                user={user}
                featureKey={feature.key}
                benefitText={feature.benefitText}
                className="h-full"
              >
                <AnalyticsTile
                  title={feature.title}
                  description={feature.description}
                  icon={IconComponent}
                  isPremium={true}
                />
              </PremiumGate>
            ) : (
              <AnalyticsTile
                title={feature.title}
                description={feature.description}
                icon={IconComponent}
                isPremium={false}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  // Track premium feature views
  React.useEffect(() => {
    if (user && !user.isPremium) {
      const premiumFeatures = features.filter(f => f.premium)
      premiumFeatures.forEach(feature => {
        trackFeatureView(feature.key, {
          context: 'analytics_dashboard',
          category: 'analytics'
        })
      })
    }
  }, [user, features])
}

/**
 * AnalyticsTile - Individual tile component
 * @param {string} title - Tile title
 * @param {string} description - Tile description
 * @param {React.Component} icon - Icon component
 * @param {boolean} isPremium - Whether this is a premium tile
 */
function AnalyticsTile({ title, description, icon: Icon, isPremium }) {
  return (
    <div className={`
      h-full p-6 rounded-2xl border transition-all duration-200
      ${isPremium
        ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg'
      }
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-xl flex-shrink-0
          ${isPremium
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            : 'bg-primary/10 text-primary'
          }
        `}>
          <Icon size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>

          {isPremium && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
              <Icon size={12} />
              Premium
            </div>
          )}
        </div>
      </div>

      {/* Sample data preview for premium tiles */}
      {isPremium && (
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sample Data</div>
          <div className="space-y-2">
            <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded animate-pulse"></div>
            <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded animate-pulse w-3/4"></div>
            <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsTiles