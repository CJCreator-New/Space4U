import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardBody, Stack, Collapse, useDisclosure } from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

function FeatureGroupCard({ title, icon: Icon, items, defaultOpen = false }) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultOpen })

  return (
    <Card>
      <CardBody p={0}>
        <button
          onClick={onToggle}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          aria-expanded={isOpen}
          aria-controls={`group-${title}`}
        >
          <Stack direction="row" align="center" spacing={3}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
              <Icon size={20} color="white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </Stack>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} className="text-gray-500" />
          </motion.div>
        </button>

        <Collapse in={isOpen}>
          <div id={`group-${title}`} className="p-4 pt-0">
            <div className="grid gap-3 md:grid-cols-3">
              {items.map((item, index) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Stack spacing={2}>
                      <span className="text-2xl">{item.icon}</span>
                      <h4 className="font-semibold text-sm text-gray-800">{item.label}</h4>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </Stack>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </Collapse>
      </CardBody>
    </Card>
  )
}

export default FeatureGroupCard
