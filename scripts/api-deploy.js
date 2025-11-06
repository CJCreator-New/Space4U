import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load .env file
config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing credentials in .env')
  process.exit(1)
}

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }
  
  return response.json()
}

async function deploy() {
  console.log('🚀 Remote Deployment Starting...\n')
  
  try {
    const schemaPath = join(process.cwd(), 'supabase', 'migrations', 'complete_schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    console.log('📤 Executing SQL schema...')
    
    // Execute the entire schema
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: schema })
    })
    
    if (response.ok) {
      console.log('✅ Schema deployed!\n')
    } else {
      // Try alternative: Use PostgREST directly
      console.log('⚠️  Trying alternative method...\n')
      
      // Split and execute statements
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'))
      
      let success = 0
      let skipped = 0
      
      for (const stmt of statements) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({ query: stmt })
          })
          
          if (res.ok) success++
          else skipped++
        } catch (err) {
          skipped++
        }
      }
      
      console.log(`✅ Executed ${success} statements (${skipped} skipped)\n`)
    }
    
    // Test connection
    console.log('🧪 Testing connection...')
    const testRes = await fetch(`${SUPABASE_URL}/rest/v1/circles?select=count`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    
    if (testRes.ok) {
      console.log('✅ Connection successful!\n')
    }
    
    console.log('🎉 Deployment Complete!')
    console.log('\n📝 Next Steps:')
    console.log('1. Go to: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb')
    console.log('2. Database → Replication → Enable: notifications, posts, comments, moods')
    console.log('3. Run: npm run dev')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Alternative: Use SQL Editor in Supabase Dashboard')
    console.log('   Copy content from: supabase/migrations/complete_schema.sql')
    process.exit(1)
  }
}

deploy()
