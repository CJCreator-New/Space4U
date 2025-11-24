require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

async function checkSchema() {
    console.log('Checking circles table schema...')

    // Try to select status column
    const { data, error } = await supabase
        .from('circles')
        .select('status')
        .limit(1)

    if (error) {
        console.error('Error selecting status:', error)
        if (error.code === '42703') {
            console.log('CONFIRMED: status column is missing')
        }
    } else {
        console.log('Status column exists!')
    }
}

checkSchema()
