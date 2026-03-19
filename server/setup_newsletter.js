const pool = require('./db');

const setupNewsletterTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Newsletter table created successfully');
        process.exit();
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
};

setupNewsletterTable();
