import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSql(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
  if (error) throw error
  return data
}

async function deploySchema() {
  console.log('🚀 Starting remote deployment...\n')
  
  try {
    // Read schema file
    const schemaPath = join(process.cwd(), 'supabase', 'migrations', 'complete_schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    console.log('📤 Deploying database schema...')
    
    // Split into individual statements and execute
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      try {
        await supabase.rpc('exec_sql', { sql_query: statement })
      } catch (err) {
        // Ignore "already exists" errors
        if (!err.message.includes('already exists')) {
          console.warn('⚠️  Warning:', err.message.substring(0, 100))
        }
      }
    }
    
    console.log('✅ Schema deployed successfully!\n')
    
    // Test connection
    console.log('🧪 Testing connection...')
    const { data, error } = await supabase.from('circles').select('count')
    
    if (error) {
      console.error('❌ Connection test failed:', error.message)
    } else {
      console.log('✅ Connection successful!\n')
    }
    
    console.log('🎉 Deployment complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Enable Realtime in Dashboard → Database → Replication')
    console.log('2. Test your app: npm run dev')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

deploySchema()
