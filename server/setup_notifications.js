const pool = require('./db');

const setupNotificationsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_notifications (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT,
                read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Notifications table created successfully');
        process.exit();
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
};

setupNotificationsTable();
