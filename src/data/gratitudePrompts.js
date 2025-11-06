export const prompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's a small win you had today?",
  "What's something beautiful you noticed?",
  "What challenge helped you grow?",
  "Who showed you kindness today?",
  "What's a comfort you're thankful for?",
  "What made you laugh recently?",
  "What's a skill you're grateful to have?",
  "What's something you're looking forward to?",
  "What's a lesson you learned today?",
  "What's a memory that makes you happy?",
  "What's something about your body you appreciate?",
  "What's a place that brings you peace?",
  "What's a food you enjoyed today?",
  "What's something you accomplished this week?",
  "Who inspires you and why?",
  "What's a problem you solved recently?",
  "What's something you have that others might not?",
  "What's a relationship you cherish?",
  "What's something you learned recently?",
  "What's a part of your routine you enjoy?",
  "What's something that made today easier?",
  "What's a quality you like about yourself?",
  "What's something you're proud of?",
  "What's a song that lifts your mood?",
  "What's a book or show you're grateful for?",
  "What's something in nature you appreciate?",
  "What's a technology that helps you?",
  "What's a tradition you value?",
  "What's something you created?",
  "What's a conversation you enjoyed?",
  "What's something that surprised you today?",
  "What's a freedom you have?",
  "What's something you can do now that you couldn't before?",
  "What's a mistake that taught you something?",
  "What's something you're getting better at?",
  "What's a way someone supported you?",
  "What's something that makes your life easier?",
  "What's a choice you're glad you made?",
  "What's something you have access to?",
  "What's a moment of peace you had today?",
  "What's something you're learning to accept?",
  "What's a strength you discovered in yourself?",
  "What's something you're healing from?",
  "What's a boundary you set that helped you?",
  "What's something you forgave yourself for?",
  "What's a way you took care of yourself today?",
  "What's something you're becoming?",
  "What's a hope you're holding onto?"
]

export const getDailyPrompt = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return prompts[dayOfYear % prompts.length]
}

export const getRandomPrompt = () => {
  return prompts[Math.floor(Math.random() * prompts.length)]
}
