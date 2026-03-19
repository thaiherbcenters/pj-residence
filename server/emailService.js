const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingConfirmation = async (to, bookingDetails) => {
    const { firstName, lastName, checkIn, checkOut, bookingNumber, totalPayable, guests, rooms, roomType } = bookingDetails;

    // Format dates
    const checkInDate = new Date(checkIn).toLocaleDateString('th-TH');
    const checkOutDate = new Date(checkOut).toLocaleDateString('th-TH');

    const mailOptions = {
        from: `"PJ Residence" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `✅ ยืนยันการจองห้องพัก - ${bookingNumber}`,
        html: `
            <div style="font-family: 'Sarabun', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #c5a880; text-align: center;">ยืนยันการจองห้องพักสำเร็จ</h2>
                <p>เรียน คุณ ${firstName} ${lastName},</p>
                <p>ขอบคุณที่เลือกพักที่ PJ Residence รายละเอียดการจองของคุณมีดังนี้:</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>หมายเลขการจอง:</strong> ${bookingNumber}</p>
                    <p><strong>ประเภทห้อง:</strong> ${roomType === 'daily' ? 'รายวัน' : 'รายเดือน'}</p>
                    <p><strong>จำนวน:</strong> ${rooms} ห้อง (${guests} ท่าน)</p>
                    <p><strong>วันที่เข้าพัก:</strong> ${checkInDate}</p>
                    <p><strong>วันที่ออก:</strong> ${checkOutDate}</p>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <h3 style="color: #333;">ยอดชำระทั้งหมด: ฿${parseFloat(totalPayable || 0).toLocaleString()}</h3>
                </div>

                <p>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่ 088-788-3988</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">PJ Residence - Creating Memories</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendContactFormEmail = async (data) => {
    const { name, email, phone, subject, message } = data;

    const mailOptions = {
        from: `"PJ Residence Website" <${process.env.EMAIL_USER}>`,
        to: 'pj.residence.soi38@gmail.com',
        subject: `📩 ข้อความใหม่จากหน้าเว็บ: ${subject || 'สอบถามข้อมูล'}`,
        html: `
            <div style="font-family: 'Sarabun', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #c5a880; text-align: center;">ข้อความใหม่จากลูกค้า</h2>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>ชื่อ:</strong> ${name}</p>
                    <p><strong>เบอร์โทร:</strong> ${phone}</p>
                    <p><strong>อีเมล:</strong> ${email || '-'}</p>
                    <p><strong>หัวข้อ:</strong> ${subject}</p>
                </div>

                <div style="padding: 15px; border-left: 4px solid #c5a880; background-color: #fff;">
                    <p><strong>ข้อความ:</strong></p>
                    <p style="white-space: pre-line;">${message}</p>
                </div>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">Sent from PJ Residence Website</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact email sent to Admin`);
    } catch (error) {
        console.error('Error sending contact email:', error);
    }
};

module.exports = { sendBookingConfirmation, sendContactFormEmail };
