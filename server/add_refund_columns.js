const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function addColumns() {
    try {
        console.log('Connecting to database...');

        // Add columns one by one
        try {
            await pool.query(`ALTER TABLE rooms ADD COLUMN refund_bank_name VARCHAR(100)`);
            console.log('✓ Added refund_bank_name column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('refund_bank_name already exists');
            } else {
                console.log('refund_bank_name error:', e.message);
            }
        }

        try {
            await pool.query(`ALTER TABLE rooms ADD COLUMN refund_account_number VARCHAR(50)`);
            console.log('✓ Added refund_account_number column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('refund_account_number already exists');
            } else {
                console.log('refund_account_number error:', e.message);
            }
        }

        try {
            await pool.query(`ALTER TABLE rooms ADD COLUMN refund_account_name VARCHAR(200)`);
            console.log('✓ Added refund_account_name column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('refund_account_name already exists');
            } else {
                console.log('refund_account_name error:', e.message);
            }
        }

        // Check columns
        const result = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'rooms' ORDER BY ordinal_position`);
        console.log('\n✓ All columns in rooms table:', result.rows.map(r => r.column_name).join(', '));

    } catch (error) {
        console.log('Connection Error:', error.message);
    } finally {
        pool.end();
    }
}

addColumns();
