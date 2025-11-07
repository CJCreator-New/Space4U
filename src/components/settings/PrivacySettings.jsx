import { Shield, Eye, Trash2, Download, Upload } from 'lucide-react'

function PrivacySettings({
  settings,
  updateSetting,
  isSettingModified,
  setShowExportModal,
  setShowDeleteModal,
  setShowAutoDeleteModal
}) {
  return (
    <div className="border-t border-gray-100">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium">Always post anonymously</h3>
              <p className="text-sm text-gray-600">Your identity is hidden in all interactions</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.anonymous}
            onChange={(e) => updateSetting('privacy', 'anonymous', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-medium">Allow analytics</h3>
              <p className="text-sm text-gray-600">Helps us improve the app. Never includes personal data.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.analytics}
            onChange={(e) => updateSetting('privacy', 'analytics', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-medium">Auto-delete old data</h3>
              <p className="text-sm text-gray-600">
                Automatically delete moods older than {settings.privacy.autoDelete === 'never' ? 'never' : settings.privacy.autoDelete}
              </p>
            </div>
          </div>
          <select
            value={settings.privacy.autoDelete}
            onChange={(e) => {
              if (e.target.value !== 'never') {
                setShowAutoDeleteModal(true)
              }
              updateSetting('privacy', 'autoDelete', e.target.value)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="never">Never</option>
            <option value="30 days">30 days</option>
            <option value="90 days">90 days</option>
            <option value="1 year">1 year</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-medium">Export & Import</h3>
              <p className="text-sm text-gray-600">Backup or restore your data</p>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Manage Data
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-medium">Delete account</h3>
              <p className="text-sm text-gray-600">Permanently delete your account and data</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings