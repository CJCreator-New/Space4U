const fs = require('fs');
const path = require('path');

const rootEnvPath = path.join(__dirname, '..', '.env');
const backendEnvPath = path.join(__dirname, '.env');

try {
    const rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');

    const supabaseUrlMatch = rootEnvContent.match(/VITE_SUPABASE_URL=(.*)/);
    const supabaseKeyMatch = rootEnvContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

    if (supabaseUrlMatch && supabaseKeyMatch) {
        const supabaseUrl = supabaseUrlMatch[1].trim();
        const supabaseKey = supabaseKeyMatch[1].trim();

        const backendEnvContent = `SUPABASE_URL=${supabaseUrl}\nSUPABASE_SERVICE_KEY=${supabaseKey}\nPORT=3000`;

        fs.writeFileSync(backendEnvPath, backendEnvContent);
        console.log('Successfully synced .env to backend/.env');
    } else {
        console.error('Could not find Supabase credentials in root .env');
    }
} catch (error) {
    console.error('Error syncing .env:', error);
}
