const pool = require('./db');

async function updateSchema() {
    try {
        console.log('Adding new columns to rooms table...');

        // Add email column
        await pool.query(`
            ALTER TABLE rooms 
            ADD COLUMN IF NOT EXISTS email VARCHAR(255)
        `);
        console.log('Added email column');

        // Add booking_date column
        await pool.query(`
            ALTER TABLE rooms 
            ADD COLUMN IF NOT EXISTS booking_date TIMESTAMP DEFAULT NOW()
        `);
        console.log('Added booking_date column');

        console.log('Schema update complete!');
        process.exit(0);
    } catch (err) {
        console.error('Schema update failed:', err);
        process.exit(1);
    }
}

updateSchema();
