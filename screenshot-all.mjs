import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log('⚠️  Make sure you are logged in to the app in your browser first!\n');
  console.log('📋 Instructions:');
  console.log('   1. Open http://localhost:5174 in Chrome');
  console.log('   2. Login to the app');
  console.log('   3. Open DevTools (F12)');
  console.log('   4. Go to Application > Local Storage');
  console.log('   5. Copy the auth token\n');
  console.log('⏳ Waiting 10 seconds for you to prepare...\n');
  
  await new Promise(resolve => setTimeout(resolve, 10000));

  const screenshotsDir = path.join(__dirname, 'screenshots');
  const desktopDir = path.join(screenshotsDir, 'desktop');
  const mobileDir = path.join(screenshotsDir, 'mobile');

  [screenshotsDir, desktopDir, mobileDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });

  const page = await browser.newPage();

  // Go to home and wait for manual login
  console.log('🔐 Opening browser for authentication...');
  console.log('   Please login manually in the browser window that opened');
  console.log('   Press Enter in this terminal when you are logged in and on the home page\n');
  
  await page.goto(BASE_URL);
  
  // Wait for user input
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });

  console.log('\n📸 Starting screenshot capture...\n');
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
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
