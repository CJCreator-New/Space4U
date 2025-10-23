import { motion } from 'framer-motion'
import { Card, CardBody, Stack, IconButton } from '@chakra-ui/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Smile, Heart, BookOpen, Brain, Zap, MoreVertical } from 'lucide-react'

const actions = [
  { id: 'mood', icon: Smile, label: 'Log Mood', color: '#667eea', onClick: null },
  { id: 'gratitude', icon: Heart, label: 'Gratitude', color: '#ec4899', path: '/gratitude' },
  { id: 'journal', icon: BookOpen, label: 'Journal', color: '#3b82f6', path: '/advanced-tools' },
  { id: 'coping', icon: Brain, label: 'Coping Skills', color: '#8b5cf6', path: '/coping-skills' }
]

function QuickActionsCard({ onMoodClick, onNavigate }) {
  return (
    <Card>
      <CardBody p={6}>
        <Stack direction="row" justify="space-between" align="center" mb={4}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Quick Actions</h3>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton
                icon={<MoreVertical size={18} />}
                aria-label="More actions"
                size="sm"
                variant="ghost"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-xl shadow-xl p-2 min-w-[160px] z-50">
                <DropdownMenu.Item className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 cursor-pointer outline-none">
                  Customize
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 cursor-pointer outline-none">
                  Reorder
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Stack>

        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Quick action buttons">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => action.onClick ? onMoodClick() : onNavigate(action.path)}
              className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
              style={{ backgroundColor: `${action.color}15` }}
              aria-label={action.label}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: action.color }}
              >
                <action.icon size={24} color="white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default QuickActionsCard
