import { Icon as BaseIcon } from './common/IconLibrary'

const toPascalCase = (value) => (
  value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
)

const resolveIconName = (name, library) => {
  if (typeof name !== 'string' || name.length === 0) {
    return name
  }

  const hasInlineUppercase = /[A-Z]/.test(name) && !name.includes('-') && !name.includes('_')
  let resolved = hasInlineUppercase ? name : toPascalCase(name)

  if ((library === 'hero-solid' || library === 'hero-outline') && !resolved.endsWith('Icon')) {
    resolved = `${resolved}Icon`
  }

  return resolved
}

const Icon = ({ name, library = 'lucide', ...props }) => {
  const resolvedName = resolveIconName(name, library)
  return <BaseIcon name={resolvedName} library={library} {...props} />
}

export default Icon
export { Icon as IconComponent } from './common/IconLibrary'
export { Icons } from './common/IconLibrary'
