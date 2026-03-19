const pool = require('./db');

async function reset() {
    try {
        console.log('Deleting all rooms...');
        await pool.query('DELETE FROM rooms');
        console.log('Rooms cleared successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

reset();
