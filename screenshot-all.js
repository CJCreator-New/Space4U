const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const routes = [
  { path: '/', name: 'home' },
  { path: '/circles', name: 'circles' },
  { path: '/insights', name: 'insights' },
  { path: '/profile', name: 'profile' },
  { path: '/settings', name: 'settings' },
  { path: '/resources', name: 'resources' },
  { path: '/premium', name: 'premium' },
  { path: '/gratitude', name: 'gratitude' },
  { path: '/habits', name: 'habits' },
  { path: '/emotions', name: 'emotions' },
  { path: '/coping-skills', name: 'coping-skills' },
  { path: '/reminders', name: 'reminders' },
  { path: '/wellness', name: 'wellness' },
  { path: '/tools', name: 'tools' },
  { path: '/advanced-tools', name: 'advanced-tools' },
  { path: '/wellness-plan', name: 'wellness-plan' },
  { path: '/gamification', name: 'gamification' },
  { path: '/social', name: 'social' },
  { path: '/analytics', name: 'analytics' },
  { path: '/professional', name: 'professional' },
  { path: '/technical', name: 'technical' },
  { path: '/premium/features', name: 'premium-features' }
];

const BASE_URL = 'http://localhost:5174';

(async () => {
  console.log('🚀 Starting screenshot capture...\n');

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const desktopDir = path.join(screenshotsDir, 'desktop');
  const mobileDir = path.join(screenshotsDir, 'mobile');

  [screenshotsDir, desktopDir, mobileDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop screenshots
  console.log('📸 Capturing desktop screenshots (1920x1080)...\n');
  await page.setViewport({ width: 1920, height: 1080 });

  for (const route of routes) {
    try {
      const url = `${BASE_URL}${route.path}`;
      console.log(`  → ${route.name}...`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      await page.waitForTimeout(2000); // Wait for animations
      
      const filename = path.join(desktopDir, `${route.name}.png`);
      await page.screenshot({ 
        path: filename, 
        fullPage: true 
      });
      
      console.log(`  ✅ ${route.name}.png`);
    } catch (error) {
      console.log(`  ❌ Failed: ${route.name} - ${error.message}`);
    }
  }

  // Mobile screenshots
  console.log('\n📱 Capturing mobile screenshots (375x812)...\n');
  await page.setViewport({ width: 375, height: 812 });

  for (const route of routes) {
    try {
      const url = `${BASE_URL}${route.path}`;
      console.log(`  → ${route.name}...`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      await page.waitForTimeout(2000);
      
      const filename = path.join(mobileDir, `${route.name}.png`);
      await page.screenshot({ 
        path: filename, 
        fullPage: true 
      });
      
      console.log(`  ✅ ${route.name}.png`);
    } catch (error) {
      console.log(`  ❌ Failed: ${route.name} - ${error.message}`);
    }
  }

  await browser.close();

  console.log('\n🎉 Screenshot capture complete!');
  console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
  console.log(`   Desktop: ${routes.length} screenshots`);
  console.log(`   Mobile: ${routes.length} screenshots`);
  console.log(`   Total: ${routes.length * 2} screenshots\n`);
})();
