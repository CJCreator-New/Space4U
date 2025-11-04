export const mockResources = {
  breathingExercises: [
    {
      id: 'box-breathing',
      title: 'Box Breathing',
      duration: 4,
      description: 'Calm anxiety with this military technique',
      difficulty: 'Beginner',
      pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      visualization: 'box',
      instructions: 'Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4',
      tags: ['anxiety', 'focus', 'military']
    },
    {
      id: '4-7-8-breathing',
      title: '4-7-8 Breathing',
      duration: 2,
      description: "Dr. Weil's technique for better sleep",
      difficulty: 'Beginner',
      pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
      visualization: 'circle',
      instructions: 'Inhale for 4, hold for 7, exhale for 8',
      tags: ['sleep', 'relaxation', 'dr-weil']
    },
    {
      id: 'calm-breath',
      title: 'Calm Breath',
      duration: 5,
      description: 'Simple deep breathing for instant calm',
      difficulty: 'Easy',
      pattern: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
      visualization: 'wave',
      instructions: 'Breathe in for 5 counts, breathe out for 5 counts',
      tags: ['calm', 'simple', 'beginner']
    }
  ],

  meditations: [
    {
      id: 'morning-calm',
      title: '5-Minute Morning Calm',
      duration: 5,
      difficulty: 'Beginner',
      instructor: 'AI-Generated Voice',
      theme: 'Start your day with intention and peace',
      audioUrl: '/audio/morning-calm.mp3',
      tags: ['morning', 'calm', 'intention']
    },
    {
      id: 'body-scan-sleep',
      title: 'Body Scan for Sleep',
      duration: 10,
      difficulty: 'Intermediate',
      instructor: 'Dr. Sarah Chen',
      theme: 'Progressive relaxation for better sleep',
      audioUrl: '/audio/body-scan-sleep.mp3',
      tags: ['sleep', 'body-scan', 'relaxation']
    },
    {
      id: 'anxiety-release',
      title: 'Anxiety Release',
      duration: 7,
      difficulty: 'Beginner',
      instructor: 'AI-Generated Voice',
      theme: 'Let go of worry and tension',
      audioUrl: '/audio/anxiety-release.mp3',
      tags: ['anxiety', 'release', 'worry']
    }
  ],

  articles: [
    {
      id: 'understanding-anxiety',
      title: 'Understanding Anxiety: What Your Body is Telling You',
      author: 'Dr. Sarah Chen',
      readTime: 5,
      difficulty: 'Beginner',
      summary: 'Learn what anxiety is, why it happens, and how to recognize the signs your body is giving you.',
      content: `# Understanding Anxiety: What Your Body is Telling You

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While everyone experiences anxiety from time to time, understanding what your body is telling you can help you manage it better.

## What Happens in Your Body

When you feel anxious, your body activates its "fight or flight" response. This ancient survival mechanism releases stress hormones like adrenaline and cortisol, preparing your body to either face danger or run away.

### Physical Signs Include:
- Rapid heartbeat
- Sweating
- Trembling or shaking
- Shortness of breath
- Muscle tension
- Stomach upset

## Why Anxiety Happens

Anxiety can be triggered by various factors:
- Stressful life events
- Genetics
- Brain chemistry
- Medical conditions
- Substance use

## When to Seek Help

While occasional anxiety is normal, persistent anxiety that interferes with daily life may indicate an anxiety disorder. Consider speaking with a healthcare professional if anxiety:
- Lasts for weeks or months
- Interferes with work, school, or relationships
- Causes physical symptoms
- Leads to avoidance of situations

Remember, seeking help is a sign of strength, not weakness.`,
      thumbnail: 'gradient-blue',
      tags: ['anxiety', 'education', 'body', 'symptoms'],
      publishedAt: '2024-01-15'
    },
    {
      id: 'science-mood-tracking',
      title: 'The Science of Mood Tracking',
      author: 'space4u Team',
      readTime: 3,
      difficulty: 'Beginner',
      summary: 'Discover the research behind mood tracking and how it can improve your mental health.',
      content: `# The Science of Mood Tracking

Research shows that tracking your mood can significantly improve mental health outcomes. Here's what science tells us about this simple yet powerful practice.

## The Research

Studies have found that people who track their moods experience:
- 23% reduction in anxiety symptoms
- Improved emotional awareness
- Better treatment outcomes
- Increased sense of control

## How It Works

Mood tracking works through several mechanisms:
1. **Increased Awareness**: Regular check-ins help you notice patterns
2. **Emotional Regulation**: Naming emotions helps process them
3. **Pattern Recognition**: Identifying triggers and helpful activities
4. **Progress Tracking**: Seeing improvement over time

## Best Practices

- Track consistently, ideally at the same time each day
- Be honest about your feelings
- Include notes about what influenced your mood
- Review patterns weekly or monthly

The key is consistency, not perfection.`,
      thumbnail: 'gradient-purple',
      tags: ['mood-tracking', 'science', 'research', 'mental-health'],
      publishedAt: '2024-01-10'
    },
    {
      id: 'supporting-someone-crisis',
      title: 'How to Support Someone in Crisis',
      author: 'Dr. Michael Rodriguez',
      readTime: 4,
      difficulty: 'Intermediate',
      summary: 'Learn how to be there for someone experiencing a mental health crisis with compassion and effectiveness.',
      content: `# How to Support Someone in Crisis

When someone you care about is in crisis, knowing how to help can make a significant difference. Here's how to provide effective support.

## Immediate Steps

### 1. Listen Without Judgment
- Give them your full attention
- Avoid trying to "fix" the problem immediately
- Use phrases like "I'm here for you" and "Thank you for telling me"

### 2. Take It Seriously
- Don't dismiss their feelings
- Avoid saying "it could be worse" or "just think positive"
- Trust their experience

### 3. Ask Direct Questions
- "Are you thinking about hurting yourself?"
- "Do you have a plan?"
- "Have you felt this way before?"

## When to Seek Professional Help

Call emergency services (112) if:
- They express intent to harm themselves or others
- They have a specific plan
- They're under the influence of drugs or alcohol
- They're acting erratically or aggressively

## Long-term Support

- Check in regularly
- Help them connect with professional resources
- Encourage healthy activities
- Take care of your own mental health too

Remember: You don't have to be a therapist to be helpful. Sometimes just being present is enough.`,
      thumbnail: 'gradient-green',
      tags: ['crisis', 'support', 'helping', 'emergency'],
      publishedAt: '2024-01-08'
    },
    {
      id: 'healthy-sleep-habits',
      title: 'Building Healthy Sleep Habits',
      author: 'Dr. Lisa Park',
      readTime: 6,
      difficulty: 'Beginner',
      summary: 'Discover evidence-based strategies for improving your sleep quality and establishing a healthy sleep routine.',
      content: `# Building Healthy Sleep Habits

Good sleep is essential for mental health. Poor sleep can worsen anxiety and depression, while good sleep helps regulate emotions and improve resilience.

## The Sleep-Mental Health Connection

Sleep and mental health are closely linked:
- Sleep deprivation increases stress hormones
- Poor sleep affects emotional regulation
- Mental health conditions often disrupt sleep
- Good sleep improves mood and cognitive function

## Creating a Sleep Routine

### 1. Set a Consistent Schedule
- Go to bed and wake up at the same time daily
- Even on weekends, try to stay within 1 hour of your schedule
- Your body thrives on routine

### 2. Create a Bedtime Ritual
- Start winding down 1 hour before bed
- Try reading, gentle stretching, or meditation
- Avoid screens or use blue light filters

### 3. Optimize Your Environment
- Keep your bedroom cool (60-67 °F)
- Make it as dark as possible
- Reduce noise or use white noise
- Invest in comfortable bedding

## What to Avoid

- Caffeine after 2 PM
- Large meals close to bedtime
- Alcohol (it disrupts sleep quality)
- Intense exercise within 3 hours of bed

## When to Seek Help

Consider talking to a healthcare provider if you:
- Regularly take more than 30 minutes to fall asleep
- Wake up frequently during the night
- Feel tired despite adequate sleep time
- Snore loudly or stop breathing during sleep

Quality sleep is an investment in your mental health.`,
      thumbnail: 'gradient-indigo',
      tags: ['sleep', 'habits', 'routine', 'mental-health'],
      publishedAt: '2024-01-05'
    },
    {
      id: 'self-compassion-guide',
      title: 'Self-Compassion: A Beginner\'s Guide',
      author: 'Dr. Emma Thompson',
      readTime: 5,
      difficulty: 'Beginner',
      summary: 'Learn how to treat yourself with the same kindness you would show a good friend.',
      content: `# Self-Compassion: A Beginner's Guide

Self-compassion is treating yourself with the same kindness and understanding you would offer a good friend during difficult times.

## The Three Components

### 1. Self-Kindness
Instead of harsh self-criticism, offer yourself warmth and understanding when you make mistakes or face difficulties.

**Instead of**: "I'm so stupid for making that mistake"
**Try**: "Everyone makes mistakes. This is part of being human"

### 2. Common Humanity
Recognize that suffering and personal failure are part of the shared human experience.

**Instead of**: "I'm the only one who struggles with this"
**Try**: "Many people face similar challenges"

### 3. Mindfulness
Observe your thoughts and feelings without getting caught up in them or pushing them away.

**Instead of**: Ruminating or suppressing emotions
**Try**: "I notice I'm feeling anxious right now"

## Practical Exercises

### The Self-Compassion Break
1. Place your hand on your heart
2. Say: "This is a moment of suffering"
3. Say: "Suffering is part of life"
4. Say: "May I be kind to myself"

### Write Yourself a Letter
Write a compassionate letter to yourself about a difficulty you're facing, as if you were writing to a dear friend.

### Loving-Kindness Meditation
- May I be happy
- May I be healthy
- May I be at peace
- May I live with ease

## The Benefits

Research shows self-compassion:
- Reduces anxiety and depression
- Increases motivation and resilience
- Improves relationships
- Enhances overall well-being

Remember: Self-compassion is not self-pity or self-indulgence. It's about treating yourself with the same care you'd show someone you love.`,
      thumbnail: 'gradient-pink',
      tags: ['self-compassion', 'kindness', 'mindfulness', 'wellbeing'],
      publishedAt: '2024-01-03'
    }
  ],

  crisisResources: [
    {
      id: 'kiran-helpline',
      name: 'KIRAN Mental Health Helpline',
      number: '1800-599-0019',
      type: 'phone',
      hours: '24/7',
      languages: 'English, Hindi, 13 regional languages',
      description: 'Free mental health support'
    },
    {
      id: 'vandrevala-foundation',
      name: 'Vandrevala Foundation',
      number: '1860-2662-345',
      sms: '+91 84229 84528',
      email: 'help@vandrevalafoundation.com',
      type: 'multi',
      hours: '24/7',
      languages: 'English, Hindi',
      description: 'Crisis intervention and emotional support'
    },
    {
      id: 'aasra',
      name: 'AASRA',
      number: '91-22-27546669',
      email: 'aasrahelpline@yahoo.com',
      type: 'multi',
      hours: '24/7',
      languages: 'English, Hindi',
      description: 'Suicide prevention helpline'
    }
  ],

  selfHelpGuides: [
    {
      id: 'panic-attack-guide',
      title: 'Dealing with Panic Attacks',
      description: 'Step-by-step guide for managing panic attacks',
      steps: [
        'Recognize the signs: racing heart, sweating, feeling of doom',
        'Remember: panic attacks are not dangerous and will pass',
        'Use grounding: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        'Practice slow, deep breathing',
        'Stay where you are if safe, don\'t run away',
        'Remind yourself: "This feeling will pass"'
      ]
    },
    {
      id: 'suicidal-thoughts-guide',
      title: 'When You Feel Suicidal',
      description: 'Compassionate, practical advice for dark moments',
      steps: [
        'You are not alone in feeling this way',
        'These feelings can change - they are not permanent',
        'Reach out to someone you trust or a helpline',
        'Remove means of self-harm from your environment',
        'Make a safety plan with specific people to call',
        'Consider going to an emergency room if feelings are intense'
      ]
    },
    {
      id: 'grounding-techniques',
      title: 'Grounding Techniques',
      description: '5-4-3-2-1 method and other grounding exercises',
      steps: [
        '5 things you can see around you',
        '4 things you can touch',
        '3 things you can hear',
        '2 things you can smell',
        '1 thing you can taste',
        'Take slow, deep breaths throughout'
      ]
    }
  ]
}
