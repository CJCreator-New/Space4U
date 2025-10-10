// Research citations for wellness tools

export const researchCitations = {
  gratitude: [
    {
      authors: "Emmons & McCullough",
      year: 2003,
      finding: "Gratitude increases well-being by 25%",
      evidenceLevel: "strong"
    },
    {
      authors: "Seligman et al.",
      year: 2005,
      finding: "Three good things exercise reduces depression",
      evidenceLevel: "strong"
    },
    {
      authors: "Wood et al.",
      year: 2010,
      finding: "Gratitude improves sleep quality",
      evidenceLevel: "moderate"
    }
  ],
  
  habits: [
    {
      authors: "Lally et al.",
      year: 2010,
      finding: "Habits form in 18-254 days (avg 66 days)",
      evidenceLevel: "strong"
    },
    {
      authors: "Clear",
      year: 2018,
      finding: "Habit stacking increases success by 2x",
      evidenceLevel: "moderate"
    },
    {
      authors: "Gollwitzer",
      year: 1999,
      finding: "Implementation intentions improve goal achievement",
      evidenceLevel: "strong"
    }
  ],
  
  emotions: [
    {
      authors: "Barrett",
      year: 2017,
      finding: "Emotional granularity improves regulation",
      evidenceLevel: "strong"
    },
    {
      authors: "Lieberman et al.",
      year: 2007,
      finding: "Affect labeling reduces amygdala response",
      evidenceLevel: "strong"
    },
    {
      authors: "Kashdan et al.",
      year: 2015,
      finding: "Emotion differentiation predicts better outcomes",
      evidenceLevel: "moderate"
    }
  ],
  
  coping: [
    {
      authors: "Folkman & Lazarus",
      year: 1988,
      finding: "Problem vs emotion-focused coping effectiveness",
      evidenceLevel: "strong"
    },
    {
      authors: "Aldao et al.",
      year: 2010,
      finding: "Adaptive vs maladaptive strategies identified",
      evidenceLevel: "strong"
    }
  ],
  
  cbt: [
    {
      authors: "Beck",
      year: 1979,
      finding: "Cognitive model of depression",
      evidenceLevel: "strong"
    },
    {
      authors: "Butler et al.",
      year: 2006,
      finding: "CBT effective for anxiety/depression",
      evidenceLevel: "strong"
    },
    {
      authors: "Hofmann et al.",
      year: 2012,
      finding: "Meta-analysis shows large effect sizes",
      evidenceLevel: "strong"
    }
  ],
  
  dbt: [
    {
      authors: "Linehan",
      year: 1993,
      finding: "DBT for emotion regulation",
      evidenceLevel: "strong"
    },
    {
      authors: "Panos et al.",
      year: 2014,
      finding: "DBT reduces self-harm by 50%",
      evidenceLevel: "strong"
    }
  ],
  
  mindfulness: [
    {
      authors: "Kabat-Zinn",
      year: 1990,
      finding: "MBSR reduces stress",
      evidenceLevel: "strong"
    },
    {
      authors: "Khoury et al.",
      year: 2013,
      finding: "Mindfulness effective for anxiety/depression",
      evidenceLevel: "strong"
    },
    {
      authors: "Goyal et al.",
      year: 2014,
      finding: "Moderate evidence for mental health",
      evidenceLevel: "moderate"
    }
  ],
  
  wellness: [
    {
      authors: "Ryff",
      year: 1989,
      finding: "Psychological well-being dimensions",
      evidenceLevel: "strong"
    },
    {
      authors: "Diener et al.",
      year: 2010,
      finding: "Subjective well-being measurement",
      evidenceLevel: "strong"
    }
  ],
  
  medication: [
    {
      authors: "Osterberg & Blaschke",
      year: 2005,
      finding: "Medication adherence ~50%",
      evidenceLevel: "strong"
    },
    {
      authors: "DiMatteo et al.",
      year: 2002,
      finding: "Adherence improves outcomes by 26%",
      evidenceLevel: "strong"
    }
  ],
  
  sleep: [
    {
      authors: "Walker",
      year: 2017,
      finding: "Sleep essential for mental health",
      evidenceLevel: "strong"
    },
    {
      authors: "Irish et al.",
      year: 2015,
      finding: "Sleep hygiene improves sleep quality",
      evidenceLevel: "strong"
    },
    {
      authors: "Baglioni et al.",
      year: 2011,
      finding: "Insomnia predicts depression",
      evidenceLevel: "strong"
    }
  ]
}

export const wellnessToolsInfo = {
  gratitude: {
    optimalPractice: "Write 3-5 entries per session in the evening for better sleep quality",
    benefits: ["Increases positive emotions", "Reduces stress", "Improves sleep", "Strengthens relationships"]
  },
  habits: {
    optimalPractice: "Start small, be consistent, and use habit stacking for better success",
    timeline: "Average of 66 days to form a new habit (range: 18-254 days)"
  },
  emotions: {
    optimalPractice: "Name specific emotions to improve regulation and reduce reactivity",
    benefits: ["Better emotion regulation", "Reduced reactivity", "Improved mental health", "Enhanced self-awareness"]
  },
  sleep: {
    optimalPractice: "Maintain consistent sleep schedule, avoid screens 1 hour before bed",
    benefits: ["Improved mood", "Better cognitive function", "Reduced anxiety", "Enhanced well-being"]
  }
}

export const evidenceLevels = {
  strong: {
    label: "Strong Evidence",
    description: "Multiple RCTs, meta-analyses, systematic reviews",
    color: "green"
  },
  moderate: {
    label: "Moderate Evidence",
    description: "Some RCTs, consistent observational studies",
    color: "blue"
  },
  emerging: {
    label: "Emerging Evidence",
    description: "Limited studies, preliminary evidence",
    color: "yellow"
  },
  theoretical: {
    label: "Theoretical",
    description: "Based on theory, expert consensus",
    color: "gray"
  }
}
