const pool = require('./db');

async function createHistoryTable() {
    try {
        console.log('Creating bookings_history table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings_history (
                id SERIAL PRIMARY KEY,
                room_id VARCHAR(10),
                guest_name VARCHAR(255),
                phone VARCHAR(50),
                id_card VARCHAR(20),
                check_in VARCHAR(50),
                check_out VARCHAR(50),
                note TEXT,
                actual_checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table bookings_history created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to create table:', err);
        process.exit(1);
    }
}

createHistoryTable();
