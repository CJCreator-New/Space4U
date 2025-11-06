import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jzxbovqisripvsxvmkbb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eGJvdnFpc3JpcHZzeHZta2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc4ODksImV4cCI6MjA3NTA3Mzg4OX0.kH6hEyXL4xPPo6Xm8oU0WLsuc3W9VzJtPpVxalRVY1s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n')
  
  // Test 1: Client initialization
  console.log('✅ Supabase client initialized')
  console.log(`   URL: ${supabaseUrl}\n`)
  
  // Test 2: Check user_data table
  console.log('📊 Checking user_data table...')
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table "user_data" not found')
        console.log('   Run: npx supabase db push\n')
      } else {
        console.log('❌ Error:', error.message, '\n')
      }
    } else {
      console.log('✅ Table "user_data" exists\n')
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message, '\n')
  }
  
  // Test 3: Check auth
  console.log('🔐 Checking authentication...')
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log('✅ User authenticated:', session.user.email)
    } else {
      console.log('ℹ️  No active session (this is normal)')
      console.log('   Users will authenticate in the app\n')
    }
  } catch (err) {
    console.log('ℹ️  Auth check skipped\n')
  }
  
  console.log('✅ Backend connection test complete!')
  console.log('\nNext steps:')
  console.log('1. Run migrations: npx supabase db push')
  console.log('2. Enable backend in src/config/features.js')
  console.log('3. Start app: npm run dev')
}

testConnection()
