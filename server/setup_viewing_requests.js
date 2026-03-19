const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createViewingRequestsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS viewing_requests (
                id SERIAL PRIMARY KEY,
                guest_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                email VARCHAR(255),
                room_type VARCHAR(50),
                preferred_date DATE,
                preferred_time TIME,
                status VARCHAR(20) DEFAULT 'pending', -- pending, viewed, cancelled
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Verified 'viewing_requests' table.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        await pool.end();
    }
};

createViewingRequestsTable();
