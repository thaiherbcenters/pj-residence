const pool = require('./db');

const initialRooms = Array.from({ length: 36 }, (_, i) => {
    const floor = Math.floor(i / 9) + 2; // Floor 2, 3, 4, 5
    const roomNum = (i % 9) + 1; // Room 1-9 per floor
    const id = `${floor}0${roomNum}`; // 201-209, 301-309, 401-409, 501-509
    return {
        id,
        status: 'available',
        guest_name: '',
        phone: '',
        check_in: null,
        check_out: null,
        note: ''
    };
});

async function setup() {
    try {
        console.log('Creating rooms table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id VARCHAR(10) PRIMARY KEY,
                status VARCHAR(20) DEFAULT 'available',
                guest_name VARCHAR(255),
                phone VARCHAR(50),
                check_in DATE,
                check_out DATE,
                note TEXT
            );
        `);

        console.log('Checking for existing data...');
        const res = await pool.query('SELECT COUNT(*) FROM rooms');
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log('Seeding initial room data...');
            for (const room of initialRooms) {
                await pool.query(
                    `INSERT INTO rooms (id, status, guest_name, phone, check_in, check_out, note)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [room.id, room.status, room.guest_name, room.phone, room.check_in, room.check_out, room.note]
                );
            }
            console.log(`Inserted ${initialRooms.length} rooms.`);
        } else {
            console.log(`Table already has ${count} rooms. Skipping seed.`);
        }

        console.log('Database setup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setup();
