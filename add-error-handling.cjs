const fs = require('fs');
const path = require('path');

const pages = [
  'AdvancedAnalyticsPage.jsx',
  'CircleFeedPage.jsx',
  'CirclesPage.jsx',
  'CopingSkillsPage.jsx',
  'EmotionTrackerPage.jsx',
  'GamificationPage.jsx',
  'GratitudeJournalPage.jsx',
  'HabitTrackerPage.jsx',
  'InsightsPage.jsx',
  'PremiumManagePage.jsx',
  'PremiumPage.jsx',
  'PremiumSuccessPage.jsx',
  'Priority2FeaturesPage.jsx',
  'ProfessionalPage.jsx',
  'ProfilePage.jsx',
  'RemindersPage.jsx',
  'ResourceLibraryPage.jsx',
  'SocialHubPage.jsx',
  'TechnicalFeaturesPage.jsx',
  'TherapeuticToolsPage.jsx',
  'WellnessDashboardPage.jsx',
  'WellnessPlanPage.jsx'
];

const pagesDir = path.join(__dirname, 'src', 'pages');

pages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('SafeComponent')) {
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, "import SafeComponent from '../components/SafeComponent'");
    }
    
    content = lines.join('\n');
    
    const functionMatch = content.match(/function \w+\([^)]*\) \{/);
    if (functionMatch) {
      const returnIndex = content.indexOf('return (', functionMatch.index);
      if (returnIndex > -1) {
        let depth = 0;
        let start = returnIndex + 8;
        let end = start;
        
        for (let i = start; i < content.length; i++) {
          if (content[i] === '(') depth++;
          if (content[i] === ')') {
            if (depth === 0) {
              end = i;
              break;
            }
            depth--;
          }
        }
        
        const returnContent = content.substring(start, end);
        const wrapped = `\n    <SafeComponent>${returnContent}\n    </SafeComponent>\n  `;
        content = content.substring(0, start) + wrapped + content.substring(end);
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${page}`);
  } else {
    console.log(`⏭️  ${page}`);
  }
});

console.log('\n✅ Done!');
