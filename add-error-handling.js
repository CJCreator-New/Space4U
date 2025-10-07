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
  
  // Check if SafeComponent is already imported
  if (!content.includes('SafeComponent')) {
    // Add SafeComponent import after other imports
    const importMatch = content.match(/^(import.*\n)+/m);
    if (importMatch) {
      const imports = importMatch[0];
      const newImports = imports + "import SafeComponent from '../components/SafeComponent'\n";
      content = content.replace(imports, newImports);
    }
    
    // Wrap return content in SafeComponent
    const returnMatch = content.match(/return \(([\s\S]*?)\n\)/m);
    if (returnMatch) {
      const returnContent = returnMatch[1];
      const wrapped = `return (\n    <SafeComponent>\n${returnContent}\n    </SafeComponent>\n  )`;
      content = content.replace(returnMatch[0], wrapped);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added error handling to ${page}`);
  } else {
    console.log(`⏭️  ${page} already has SafeComponent`);
  }
});

console.log('\n✅ Done! All pages now have error handling.');
