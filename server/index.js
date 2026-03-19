const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { sendLineMessage } = require('./lineService');
const { sendBookingConfirmation, sendContactFormEmail } = require('./emailService');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

// Cloudinary Config
cloudinary.config({
    cloud_name: 'dyh4hqabj',
    api_key: '443493686134859',
    api_secret: 'VSkU1XCpjVFr20XvUHD-29ohcQo'
});

// Multer Config (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms ORDER BY id');
        // Map database columns to frontend camelCase if needed, but keeping snake_case in DB
        // Let's transform for frontend consistency or adapt frontend to use snake_case
        // Adapting frontend to use api data structure is better
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get room availability stats
app.get('/api/rooms/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'available') as available,
                COUNT(*) FILTER (WHERE status = 'booked') as booked,
                COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
                COUNT(*) FILTER (WHERE status = 'monthly') as monthly,
                COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance,
                COUNT(*) as total
            FROM rooms
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update room
app.put('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { status, guest_name, phone, id_card, email, check_in, check_out, booking_date, note } = req.body;

    try {
        // Check if we are performing a check-out (status changing to available)
        if (status === 'available') {
            const currentRoom = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
            if (currentRoom.rows.length > 0) {
                const roomData = currentRoom.rows[0];
                if (roomData.status === 'occupied' || roomData.status === 'monthly') {
                    // Archive to history
                    await pool.query(
                        `INSERT INTO bookings_history (room_id, guest_name, phone, id_card, check_in, check_out, note)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [roomData.id, roomData.guest_name, roomData.phone, roomData.id_card, roomData.check_in, roomData.check_out, roomData.note]
                    );
                }
            }
        }

        const result = await pool.query(
            `UPDATE rooms 
             SET status = $1, guest_name = $2, phone = $3, id_card = $4, email = $5, check_in = $6, check_out = $7, booking_date = $8, note = $9
             WHERE id = $10 RETURNING *`,
            [status, guest_name, phone, id_card, email || null, check_in, check_out, booking_date || null, note, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH');
};

// Notification Endpoint
app.post('/api/notify', upload.single('paymentSlip'), async (req, res) => {
    const { roomType, firstName, lastName, phone, email, checkIn, checkOut, bookingType, note, guests, rooms, idNumber, refundBankName, refundAccountNumber, refundAccountName } = req.body;

    try {
        let imageUrl = null;
        if (req.file) {
            // Upload to Cloudinary
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const uploadRes = await cloudinary.uploader.upload(dataURI, {
                folder: 'pj-residence/payment-slips'
            });
            imageUrl = uploadRes.secure_url;
        }

        let message = '';
        let assignedRooms = [];
        const roomCount = parseInt(rooms) || 1;
        const bookingDate = new Date().toISOString();

        if (bookingType === 'viewing') {
            message = `🔔 มีการนัดดูห้อง! (อนุมัตินัดดูห้อง)\n\n🏠 ประเภท: รายเดือน (นัดดูห้อง)\n👤 ชื่อ: ${firstName} ${lastName}\n📞 โทร: ${phone}\n📧 อีเมล: ${email || '-'}\n📅 วันที่ต้องการเข้าชม: ${formatDate(checkIn)}\n📝 หมายเหตุ: ${note || '-'}`;
        } else {
            // Auto Room Assignment for bookings
            const availableRooms = await pool.query(
                "SELECT id FROM rooms WHERE status = 'available' ORDER BY RANDOM() LIMIT $1",
                [roomCount]
            );

            if (availableRooms.rows.length >= roomCount) {
                // Assign rooms to guest - set as 'booked' (reserved, not checked-in yet)
                for (const room of availableRooms.rows) {
                    await pool.query(
                        `UPDATE rooms SET 
                            status = 'booked',
                            guest_name = $1,
                            phone = $2,
                            id_card = $3,
                            email = $4,
                            check_in = $5,
                            check_out = $6,
                            booking_date = $7,
                            note = $8,
                            refund_bank_name = $9,
                            refund_account_number = $10,
                            refund_account_name = $11
                        WHERE id = $12`,
                        [
                            `${firstName} ${lastName}`,
                            phone,
                            idNumber || '',
                            email || '',
                            checkIn,
                            checkOut,
                            bookingDate,
                            note || '',
                            refundBankName || '',
                            refundAccountNumber || '',
                            refundAccountName || '',
                            room.id
                        ]
                    );
                    assignedRooms.push(room.id);
                }

                message = `🔔 มีการจองใหม่! (ติดจอง)\n\n🏠 ประเภท: รายวัน\n🚪 ห้องที่จัดให้: ${assignedRooms.join(', ')}\nจำนวนคน: ${guests}\nจำนวนห้อง: ${rooms}\n👤 ชื่อ: ${firstName} ${lastName}\n📞 โทร: ${phone}\n📧 อีเมล: ${email || '-'}\n🆔 เลขบัตรประชาชน: ${idNumber || '-'}\n📅 วันที่จอง: ${formatDate(bookingDate)}\n📅 เข้าพัก: ${formatDate(checkIn)}\n🏁 ออก: ${formatDate(checkOut)}\n📝 หมายเหตุ: ${note || '-'}`;
            } else {
                // Rooms not available - notify admin to contact back
                const availableCount = availableRooms.rows.length;
                message = `⚠️ ห้องไม่เพียงพอ! ต้องการ ${roomCount} ห้อง แต่ว่างเพียง ${availableCount} ห้อง\n\n🔔 กรุณาติดต่อลูกค้ากลับ:\n👤 ชื่อ: ${firstName} ${lastName}\n📞 โทร: ${phone}\n📧 อีเมล: ${email || '-'}\n🆔 เลขบัตรประชาชน: ${idNumber || '-'}\n📅 ต้องการเข้าพัก: ${formatDate(checkIn)}\n🏁 ออก: ${formatDate(checkOut)}\n📝 หมายเหตุ: ${note || '-'}`;

                // Create urgent admin notification
                await pool.query(
                    'INSERT INTO admin_notifications (type, title, message) VALUES ($1, $2, $3)',
                    ['urgent', '⚠️ ห้องไม่พอ - ติดต่อลูกค้ากลับ', message]
                );

                await sendLineMessage(message, imageUrl);
                return res.json({
                    success: false,
                    message: 'ห้องว่างไม่เพียงพอ ทางเราจะติดต่อกลับโดยเร็ว',
                    availableRooms: availableCount,
                    requestedRooms: roomCount
                });
            }

            // Send Email to Customer
            if (email) {
                sendBookingConfirmation(email, { ...req.body, assignedRooms }).catch(err => console.error('Email failed:', err));
            }
        }

        // Create Admin Notification
        const notifTitle = bookingType === 'viewing' ? 'อนุมัตินัดดูห้อง (รายเดือน)' : `จองห้องพักใหม่ - ห้อง ${assignedRooms.join(', ')}`;
        const notifType = bookingType === 'viewing' ? 'viewing' : 'booking';

        await pool.query(
            'INSERT INTO admin_notifications (type, title, message) VALUES ($1, $2, $3)',
            [notifType, notifTitle, message]
        );

        await sendLineMessage(message, imageUrl);
        res.json({
            success: true,
            message: 'Booking confirmed',
            assignedRooms: assignedRooms
        });
    } catch (err) {
        console.error('Notify Error:', err);
        res.status(500).json({ error: 'Failed to notify' });
    }
});

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        // Fire and forget email
        sendContactFormEmail(req.body).catch(err => console.error('Contact Email failed:', err));
        res.json({ success: true, message: 'Message sent' });
    } catch (err) {
        console.error('Contact Error:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Newsletter Subscription Endpoint
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    try {
        await pool.query('INSERT INTO newsletter_subscribers (email) VALUES ($1)', [email]);
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Email already subscribed' });
        } else {
            console.error('Newsletter Error:', err);
            res.status(500).json({ error: 'Failed to subscribe' });
        }
    }
});

// Admin Notifications API
app.get('/api/admin/notifications', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM admin_notifications ORDER BY read ASC, created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/notifications/:id/read', async (req, res) => {
    try {
        await pool.query('UPDATE admin_notifications SET read = TRUE WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Clear all notifications
app.delete('/api/admin/notifications/clear', async (req, res) => {
    try {
        await pool.query('DELETE FROM admin_notifications');
        res.json({ success: true, message: 'All notifications cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Test DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
