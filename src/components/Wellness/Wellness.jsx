import { Link } from 'react-router-dom';
import './Wellness.css';

const Wellness = () => {
    const services = [
        {
            id: 1,
            icon: '🧖‍♀️',
            name: 'Thai Massage',
            nameTh: 'นวดแผนไทย',
            description: 'นวดแผนไทยโบราณ ผ่อนคลายกล้ามเนื้อ กระตุ้นการไหลเวียนโลหิต',
            duration: '60-90 นาที'
        },
        {
            id: 2,
            icon: '💆',
            name: 'Aromatherapy',
            nameTh: 'อโรมาเทอราพี',
            description: 'ทรีทเมนต์ด้วยน้ำมันหอมระเหย ผ่อนคลายทั้งกายและใจ',
            duration: '90 นาที'
        },
        {
            id: 3,
            icon: '🌿',
            name: 'Herbal Spa',
            nameTh: 'สปาสมุนไพร',
            description: 'การบำบัดด้วยสมุนไพรไทยแท้ บำรุงผิวพรรณให้เปล่งปลั่ง',
            duration: '120 นาที'
        },
        {
            id: 4,
            icon: '🛁',
            name: 'Jacuzzi & Sauna',
            nameTh: 'จากุซซี่และซาวน่า',
            description: 'ห้องจากุซซี่และซาวน่าส่วนตัว ผ่อนคลายกล้ามเนื้อ',
            duration: 'ไม่จำกัดเวลา'
        }
    ];

    return (
        <section className="wellness section">
            <div className="wellness__background"></div>
            <div className="container">
                <div className="wellness__content">
                    {/* Section Header */}
                    <div className="wellness__header">
                        <span className="section-subtitle wellness__subtitle">สปาและสุขภาพ</span>
                        <h2 className="section-title wellness__title">Wellness Retreat</h2>
                        <div className="divider"></div>
                        <p className="wellness__description">
                            เติมเต็มร่างกายและจิตใจด้วยทรีทเมนต์สปาระดับพรีเมียม
                            ท่ามกลางบรรยากาศที่สงบและผ่อนคลาย
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="wellness__grid">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="wellness__card glass"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="wellness__card-icon">{service.icon}</div>
                                <h3 className="wellness__card-name">{service.name}</h3>
                                <span className="wellness__card-name-th">{service.nameTh}</span>
                                <p className="wellness__card-description">{service.description}</p>
                                <span className="wellness__card-duration">{service.duration}</span>
                            </div>
                        ))}
                    </div>

                    <Link to="/wellness" className="btn btn-outline wellness__btn">
                        สำรวจสปาทั้งหมด
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Wellness;
