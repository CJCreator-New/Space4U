import { Icon as BaseIcon } from './common/IconLibrary'

const toPascalCase = (value) => (
  value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
)

const Icon = ({ name, ...props }) => {
  const resolvedName = typeof name === 'string' && name.length > 0
    ? (/[A-Z]/.test(name) && !name.includes('-') && !name.includes('_') ? name : toPascalCase(name))
    : name
  return <BaseIcon name={resolvedName} {...props} />
}

export default Icon
export { Icon as IconComponent, Icons } from './common/IconLibrary'
