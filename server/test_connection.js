const pool = require('./db');

async function test() {
    try {
        console.log('Testing connection...');
        const res = await pool.query('SELECT NOW() as time');
        console.log('Connection successful!');
        console.log('Server Time:', res.rows[0].time);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

test();
