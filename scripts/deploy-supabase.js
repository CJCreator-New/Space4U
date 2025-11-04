#!/usr/bin/env node

/**
 * Supabase Deployment Script
 * Automates the deployment process to Supabase
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8' })
    if (!silent) log(output, 'blue')
    return output
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    throw error
  }
}

async function checkPrerequisites() {
  log('\n📋 Checking prerequisites...', 'blue')
  
  // Check if .env exists
  if (!existsSync('.env')) {
    log('❌ .env file not found. Copy .env.example to .env and fill in your credentials.', 'red')
    process.exit(1)
  }
  
  // Check if Supabase CLI is installed
  try {
    exec('supabase --version', true)
    log('✅ Supabase CLI installed', 'green')
  } catch {
    log('❌ Supabase CLI not installed. Run: npm install -g supabase', 'red')
    process.exit(1)
  }
  
  // Check if logged in
  try {
    exec('supabase projects list', true)
    log('✅ Logged in to Supabase', 'green')
  } catch {
    log('⚠️  Not logged in. Running supabase login...', 'yellow')
    exec('supabase login')
  }
}

async function linkProject() {
  log('\n🔗 Linking to Supabase project...', 'blue')
  
  const projectRef = process.env.VITE_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  
  if (!projectRef) {
    log('❌ Could not extract project reference from VITE_SUPABASE_URL', 'red')
    log('Please ensure your .env has: VITE_SUPABASE_URL=https://your-project.supabase.co', 'yellow')
    process.exit(1)
  }
  
  try {
    exec(`supabase link --project-ref ${projectRef}`)
    log('✅ Project linked successfully', 'green')
  } catch (error) {
    log('⚠️  Project already linked or error occurred', 'yellow')
  }
}

async function pushMigrations() {
  log('\n📤 Pushing database migrations...', 'blue')
  
  try {
    exec('supabase db push')
    log('✅ Migrations pushed successfully', 'green')
  } catch (error) {
    log('❌ Failed to push migrations', 'red')
    log('You can manually run the SQL files in Supabase Dashboard → SQL Editor', 'yellow')
  }
}

async function enableRealtime() {
  log('\n⚡ Enabling Realtime...', 'blue')
  log('Please manually enable Realtime in Supabase Dashboard:', 'yellow')
  log('  1. Go to Database → Replication', 'yellow')
  log('  2. Enable for: notifications, posts, comments, moods', 'yellow')
}

async function testConnection() {
  log('\n🧪 Testing connection...', 'blue')
  
  const testScript = `
    import { createClient } from '@supabase/supabase-js'
    
    const supabase = createClient(
      '${process.env.VITE_SUPABASE_URL}',
      '${process.env.VITE_SUPABASE_ANON_KEY}'
    )
    
    const { data, error } = await supabase.from('circles').select('count')
    
    if (error) {
      console.error('Connection failed:', error.message)
      process.exit(1)
    } else {
      console.log('Connection successful!')
    }
  `
  
  try {
    exec(`node -e "${testScript.replace(/\n/g, ' ')}"`)
    log('✅ Connection test passed', 'green')
  } catch {
    log('⚠️  Connection test failed. Check your credentials in .env', 'yellow')
  }
}

async function showNextSteps() {
  log('\n🎉 Deployment Complete!', 'green')
  log('\n📝 Next Steps:', 'blue')
  log('  1. Enable Realtime in Supabase Dashboard', 'yellow')
  log('  2. Configure authentication providers', 'yellow')
  log('  3. Set up storage buckets for avatars', 'yellow')
  log('  4. Test your app: npm run dev', 'yellow')
  log('\n📚 Documentation:', 'blue')
  log('  - Supabase Dashboard: https://supabase.com/dashboard', 'yellow')
  log('  - Deployment Guide: ./SUPABASE_DEPLOYMENT_GUIDE.md', 'yellow')
}

async function main() {
  log('🚀 Space4U Supabase Deployment', 'green')
  log('================================\n', 'green')
  
  try {
    await checkPrerequisites()
    await linkProject()
    await pushMigrations()
    await enableRealtime()
    await testConnection()
    await showNextSteps()
  } catch (error) {
    log('\n❌ Deployment failed', 'red')
    log('Check the error messages above and try again', 'yellow')
    process.exit(1)
  }
}

main()
