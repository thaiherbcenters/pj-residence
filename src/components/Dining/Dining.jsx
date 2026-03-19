import { Link } from 'react-router-dom';
import './Dining.css';

const Dining = () => {
    const restaurants = [
        {
            id: 1,
            name: 'The Grand Restaurant',
            nameTh: 'ห้องอาหารหลัก',
            cuisine: 'อาหารไทยและนานาชาติ',
            hours: '06:00 - 22:00',
            description: 'สัมผัสประสบการณ์การรับประทานอาหารระดับพรีเมียม ด้วยเมนูอาหารไทยแท้และนานาชาติ'
        },
        {
            id: 2,
            name: 'Riverside Terrace',
            nameTh: 'ริมน้ำ เทอเรส',
            cuisine: 'อาหารซีฟู้ดและบาร์บีคิว',
            hours: '17:00 - 23:00',
            description: 'รับประทานอาหารริมน้ำ พร้อมเมนูซีฟู้ดสดใหม่และบาร์บีคิวพิเศษ'
        },
        {
            id: 3,
            name: 'The Lounge',
            nameTh: 'เดอะ เลานจ์',
            cuisine: 'เครื่องดื่มและของว่าง',
            hours: '10:00 - 24:00',
            description: 'บาร์และเลานจ์สำหรับพักผ่อน ด้วยเครื่องดื่มพรีเมียมและบรรยากาศผ่อนคลาย'
        }
    ];

    return (
        <section className="dining section">
            <div className="container">
                <div className="dining__wrapper">
                    {/* Left Content */}
                    <div className="dining__content">
                        <span className="section-subtitle">ร้านอาหาร</span>
                        <h2 className="section-title">Culinary Excellence</h2>
                        <div className="divider divider-left"></div>
                        <p className="dining__description">
                            สัมผัสประสบการณ์การรับประทานอาหารที่หลากหลาย ตั้งแต่อาหารไทยแท้
                            ไปจนถึงอาหารนานาชาติ ทุกจานปรุงด้วยวัตถุดิบคุณภาพสูง โดยเชฟผู้เชี่ยวชาญ
                        </p>

                        <div className="dining__list">
                            {restaurants.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    className="dining__item"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="dining__item-header">
                                        <h3 className="dining__item-name">{restaurant.name}</h3>
                                        <span className="dining__item-hours">{restaurant.hours}</span>
                                    </div>
                                    <span className="dining__item-name-th">{restaurant.nameTh}</span>
                                    <p className="dining__item-description">{restaurant.description}</p>
                                    <span className="dining__item-cuisine">{restaurant.cuisine}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/dining" className="btn btn-primary">
                            สำรวจร้านอาหาร
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="dining__image">
                        <div className="dining__image-main">
                            <div className="dining__image-placeholder">
                                <span>Fine Dining</span>
                            </div>
                        </div>
                        <div className="dining__image-accent">
                            <div className="dining__image-placeholder dining__image-placeholder--small">
                                <span>Chef</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dining;
