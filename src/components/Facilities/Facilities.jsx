import { Link } from 'react-router-dom';
import './Facilities.css';

const Facilities = () => {
    const facilities = [
        {
            id: 1,
            icon: '🏊',
            name: 'สระว่ายน้ำ',
            nameEn: 'Swimming Pool',
            description: 'สระว่ายน้ำกลางแจ้งขนาดใหญ่ พร้อมเก้าอี้อาบแดดและบาร์ริมสระ'
        },
        {
            id: 2,
            icon: '🏋️',
            name: 'ฟิตเนส',
            nameEn: 'Fitness Center',
            description: 'ห้องออกกำลังกายครบครัน พร้อมอุปกรณ์ทันสมัย เปิด 24 ชั่วโมง'
        },
        {
            id: 3,
            icon: '🅿️',
            name: 'ที่จอดรถ',
            nameEn: 'Parking',
            description: 'ที่จอดรถฟรีสำหรับผู้เข้าพัก พร้อมระบบรักษาความปลอดภัย'
        },
        {
            id: 4,
            icon: '📶',
            name: 'WiFi ฟรี',
            nameEn: 'Free WiFi',
            description: 'อินเทอร์เน็ตความเร็วสูงฟรีทั่วทั้งโรงแรม'
        },
        {
            id: 5,
            icon: '🍳',
            name: 'อาหารเช้า',
            nameEn: 'Breakfast',
            description: 'บุฟเฟ่ต์อาหารเช้านานาชาติ ตั้งแต่ 06:00 - 10:00 น.'
        },
        {
            id: 6,
            icon: '🧺',
            name: 'ซักรีด',
            nameEn: 'Laundry Service',
            description: 'บริการซักรีดและซักแห้ง ส่งคืนภายใน 24 ชั่วโมง'
        },
        {
            id: 7,
            icon: '🛎️',
            name: 'Room Service',
            nameEn: 'Room Service',
            description: 'บริการอาหารและเครื่องดื่มถึงห้องพัก 24 ชั่วโมง'
        },
        {
            id: 8,
            icon: '🚗',
            name: 'รถรับส่ง',
            nameEn: 'Airport Transfer',
            description: 'บริการรถรับส่งสนามบิน กรุณาจองล่วงหน้า'
        }
    ];

    return (
        <section className="facilities section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-subtitle">สิ่งอำนวยความสะดวก</span>
                    <h2 className="section-title">Facilities & Services</h2>
                    <div className="divider"></div>
                    <p className="section-description">
                        ครบครันทุกสิ่งอำนวยความสะดวกเพื่อการพักผ่อนที่สมบูรณ์แบบ
                    </p>
                </div>

                {/* Facilities Grid */}
                <div className="facilities__grid">
                    {facilities.map((facility, index) => (
                        <div
                            key={facility.id}
                            className="facility-card"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="facility-card__icon">{facility.icon}</div>
                            <div className="facility-card__content">
                                <h3 className="facility-card__name">{facility.name}</h3>
                                <span className="facility-card__name-en">{facility.nameEn}</span>
                                <p className="facility-card__description">{facility.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Facilities;
