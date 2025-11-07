// Lazy load prompts from cached JSON
let cachedPrompts = null

const loadPrompts = async () => {
  if (cachedPrompts) return cachedPrompts
  
  try {
    const response = await fetch('/data/prompts.json')
    const data = await response.json()
    cachedPrompts = data.gratitude
    return cachedPrompts
  } catch (error) {
    console.warn('Failed to load prompts, using fallback')
    // Fallback to minimal set
    cachedPrompts = [
      "What made you smile today?",
      "Who are you grateful for and why?",
      "What's a small win you had today?"
    ]
    return cachedPrompts
  }
}

export const prompts = await loadPrompts()

export const getDailyPrompt = async () => {
  const loaded = await loadPrompts()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return loaded[dayOfYear % loaded.length]
}

export const getRandomPrompt = async () => {
  const loaded = await loadPrompts()
  return loaded[Math.floor(Math.random() * loaded.length)]
}
