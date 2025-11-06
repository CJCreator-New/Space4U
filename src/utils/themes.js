// Custom Theme System

export const THEMES = {
  default: {
    id: 'default',
    name: 'Default Blue',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F9FAFB'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#14B8A6',
    background: '#F0F9FF',
    surface: '#E0F2FE'
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#84CC16',
    background: '#F0FDF4',
    surface: '#DCFCE7'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#F59E0B',
    secondary: '#EF4444',
    accent: '#F97316',
    background: '#FFFBEB',
    surface: '#FEF3C7'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Dream',
    primary: '#A78BFA',
    secondary: '#8B5CF6',
    accent: '#C084FC',
    background: '#FAF5FF',
    surface: '#F3E8FF'
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    background: '#FFF1F2',
    surface: '#FFE4E6'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    primary: '#3730A3',
    secondary: '#4F46E5',
    accent: '#6366F1',
    background: '#F5F3FF',
    surface: '#EDE9FE'
  },
  coral: {
    id: 'coral',
    name: 'Coral Reef',
    primary: '#FB7185',
    secondary: '#F43F5E',
    accent: '#FDA4AF',
    background: '#FFF1F2',
    surface: '#FFE4E6'
  }
}

export const getTheme = (themeId = 'default') => {
  return THEMES[themeId] || THEMES.default
}

export const getUserTheme = () => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  return settings.customTheme || 'default'
}

export const setUserTheme = (themeId) => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  settings.customTheme = themeId
  localStorage.setItem('space4u_settings', JSON.stringify(settings))
  applyTheme(themeId)
}

export const applyTheme = (themeId) => {
  const theme = getTheme(themeId)
  const root = document.documentElement
  
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-secondary', theme.secondary)
  root.style.setProperty('--color-accent', theme.accent)
  root.style.setProperty('--color-background', theme.background)
  root.style.setProperty('--color-surface', theme.surface)
}

export const initTheme = () => {
  const themeId = getUserTheme()
  applyTheme(themeId)
}

