import { useState } from 'react'
import { Users, Lock, Plus, Settings } from 'lucide-react'

function PrivateGroups() {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Close Friends Support',
      members: 5,
      inviteCode: 'CF2024',
      privacy: 'invite-only',
      created: '2024-01-15'
    }
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '', privacy: 'invite-only' })

  const createGroup = () => {
    const group = {
      id: Date.now(),
      ...newGroup,
      members: 1,
      inviteCode: Math.random().toString(36).substring(7).toUpperCase(),
      created: new Date().toISOString()
    }
    setGroups([...groups, group])
    setShowCreateModal(false)
    setNewGroup({ name: '', description: '', privacy: 'invite-only' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={32} />
          <div>
            <h3 className="text-xl font-bold">Private Groups</h3>
            <p className="opacity-90">Invite-only support circles</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium hover:bg-white/90"
        >
          <Plus size={18} />
          Create Private Group
        </button>
      </div>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-surface rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{group.name}</h4>
                  <p className="text-sm text-text-secondary">{group.members} members</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-primary" />
              <span className="text-sm text-text-secondary capitalize">{group.privacy}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-text-secondary mb-2">Invite Code</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-text-primary">{group.inviteCode}</code>
                <button className="text-sm text-primary hover:underline">Copy</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">Private Group Features</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center gap-2">
            <Lock size={16} className="text-primary" />
            Invite-only access with unique codes
          </li>
          <li className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            Up to 50 members per group
          </li>
          <li className="flex items-center gap-2">
            <Settings size={16} className="text-primary" />
            Full moderation controls
          </li>
        </ul>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Create Private Group</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
              <textarea
                placeholder="Description (optional)"
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                rows={3}
              />
              <select
                value={newGroup.privacy}
                onChange={(e) => setNewGroup({...newGroup, privacy: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl"
              >
                <option value="invite-only">Invite Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={!newGroup.name}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrivateGroups
