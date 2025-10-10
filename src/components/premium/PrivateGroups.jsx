import { useState } from 'react'
import { Users, Lock, Plus, Copy, Check } from 'lucide-react'

function PrivateGroups() {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Family Support', members: 4, code: 'FAM2024' },
    { id: 2, name: 'College Friends', members: 8, code: 'COLL789' }
  ])
  const [copied, setCopied] = useState(null)

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <Users className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Private Groups</h2>
        <p className="opacity-90">Create invite-only circles for trusted connections</p>
      </div>

      <button className="btn-primary w-full">
        <Plus className="w-5 h-5" />
        Create Private Group
      </button>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <p className="text-sm text-text-secondary">{group.members} members</p>
                </div>
              </div>
            </div>

            <div className="bg-hover p-4 rounded-xl">
              <p className="text-xs text-text-secondary mb-2">Invite Code</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold">{group.code}</code>
                <button
                  onClick={() => copyCode(group.code)}
                  className="btn-secondary text-sm"
                >
                  {copied === group.code ? (
                    <><Check className="w-4 h-4" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-indigo-50">
        <h3 className="font-bold mb-2">Private Group Benefits</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Share with only people you trust</li>
          <li>• Invite-only access with unique codes</li>
          <li>• Perfect for family, close friends, or support groups</li>
          <li>• Full control over who joins</li>
        </ul>
      </div>
    </div>
  )
}

export default PrivateGroups
