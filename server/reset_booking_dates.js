const pool = require('./db');

async function resetBookingDates() {
    try {
        console.log('Resetting booking_date for all rooms...');

        // Reset booking_date to NULL for all rooms
        await pool.query(`
            UPDATE rooms SET booking_date = NULL
        `);

        console.log('All booking_date values reset to NULL');
        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error('Reset failed:', err);
        process.exit(1);
    }
}

resetBookingDates();
