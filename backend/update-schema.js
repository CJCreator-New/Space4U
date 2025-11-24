require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

async function updateSchema() {
    console.log('Updating circles table schema...')

    try {
        // Execute the ALTER TABLE command via RPC or direct query
        // Note: Supabase JS client doesn't support DDL directly, so we'll use the REST API
        const { data, error } = await supabase.rpc('exec_sql', {
            query: `
        ALTER TABLE circles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
        UPDATE circles SET status = 'active' WHERE status IS NULL;
      `
        })

        if (error) {
            console.error('Error updating schema:', error)
            console.log('\nThe Supabase JS client cannot execute DDL commands directly.')
            console.log('Please run the following SQL in your Supabase Dashboard > SQL Editor:')
            console.log('\nALTER TABLE circles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT \'active\';')
            console.log('UPDATE circles SET status = \'active\' WHERE status IS NULL;')
        } else {
            console.log('Schema updated successfully!')
        }
    } catch (err) {
        console.error('Unexpected error:', err)
        console.log('\nPlease run the following SQL in your Supabase Dashboard > SQL Editor:')
        console.log('\nALTER TABLE circles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT \'active\';')
        console.log('UPDATE circles SET status = \'active\' WHERE status IS NULL;')
    }
}

updateSchema()
