const fs = require('fs');
const path = require('path');
const { supabase } = require('../supabase');

async function runMigrations() {
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    console.log('Running migrations...');

    for (const file of files) {
        console.log(`Running: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) throw error;
            console.log(`✓ ${file} completed`);
        } catch (error) {
            console.error(`✗ ${file} failed:`, error);
            throw error;
        }
    }

    console.log('All migrations completed successfully');
}

if (require.main === module) {
    runMigrations()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { runMigrations };