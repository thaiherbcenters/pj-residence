const pool = require('./db');

async function updateSchema() {
    try {
        console.log('Adding id_card column to rooms table...');
        await pool.query(`
            ALTER TABLE rooms 
            ADD COLUMN IF NOT EXISTS id_card VARCHAR(20);
        `);
        console.log('Schema update complete.');
        process.exit(0);
    } catch (err) {
        console.error('Schema update failed:', err);
        process.exit(1);
    }
}

updateSchema();
