import { useLanguage } from '../../context/LanguageContext';
import './NearbyPlaces.css';

const NearbyPlaces = () => {
    const { t, language } = useLanguage();

    const placesData = [
        {
            id: 1,
            icon: '🛍️',
            items: [
                {
                    nameTh: 'ตลาดนัดสนามบินน้ำ', nameEn: 'Sanambin Nam Market', nameCn: 'Sanambin Nam Market',
                    time: { th: '1 นาที', en: '1 Min', cn: '1 分钟' }
                },
                {
                    nameTh: 'เซ็นทรัล นอร์ทวิลล์', nameEn: 'Central Northville', nameCn: 'Central Northville',
                    time: { th: '5 นาที', en: '5 Mins', cn: '5 分钟' }
                },
                {
                    nameTh: 'เอสพลานาด', nameEn: 'Esplanade', nameCn: 'Esplanade',
                    time: { th: '8 นาที', en: '8 Mins', cn: '8 分钟' }
                }
            ]
        },
        {
            id: 2,
            icon: '🚇',
            items: [
                {
                    nameTh: 'รถไฟฟ้าสายสีชมพู', nameEn: 'Pink Line MRT', nameCn: 'Pink Line MRT',
                    time: { th: '5 นาที', en: '5 Mins', cn: '5 分钟' }
                },
                {
                    nameTh: 'รถไฟฟ้าสายสีม่วง', nameEn: 'Purple Line MRT', nameCn: 'Purple Line MRT',
                    time: { th: '11 นาที', en: '11 Mins', cn: '11 分钟' }
                },
                {
                    nameTh: 'ท่าน้ำนนท์', nameEn: 'Nonthaburi Pier', nameCn: 'Nonthaburi Pier',
                    time: { th: '13 นาที', en: '13 Mins', cn: '13 分钟' }
                }
            ]
        },
        {
            id: 3,
            icon: '🏛️',
            items: [
                {
                    nameTh: 'สำนักงานสลากกินแบ่งรัฐบาล', nameEn: 'Gov. Lottery Office', nameCn: 'Gov. Lottery Office',
                    time: { th: '3 นาที', en: '3 Mins', cn: '3 分钟' }
                },
                {
                    nameTh: 'สำนักงาน ป.ป.ช.', nameEn: 'NACC', nameCn: 'NACC',
                    time: { th: '5 นาที', en: '5 Mins', cn: '5 分钟' }
                },
                {
                    nameTh: 'กระทรวงพาณิชย์', nameEn: 'Ministry of Commerce', nameCn: 'Ministry of Commerce',
                    time: { th: '6 นาที', en: '6 Mins', cn: '6 分钟' }
                }
            ]
        },
        {
            id: 4,
            icon: '🏥',
            items: [
                {
                    nameTh: 'สถาบันโรคทรวงอก', nameEn: 'Central Chest Institute', nameCn: 'Central Chest Institute',
                    time: { th: '12 นาที', en: '12 Mins', cn: '12 分钟' }
                },
                {
                    nameTh: 'รพ.พระนั่งเกล้า', nameEn: 'Pranangklao Hospital', nameCn: 'Pranangklao Hospital',
                    time: { th: '14 นาที', en: '14 Mins', cn: '14 分钟' }
                },
                {
                    nameTh: 'กระทรวงสาธารณสุข', nameEn: 'Ministry of Public Health', nameCn: 'Ministry of Public Health',
                    time: { th: '22 นาที', en: '22 Mins', cn: '22 分钟' }
                }
            ]
        }
    ];

    const categories = t('nearbyPlaces.categories');

    const getName = (item) => {
        if (language === 'th') return item.nameTh;
        if (language === 'cn') return item.nameCn;
        return item.nameEn;
    };

    const getTime = (item) => {
        return item.time[language] || item.time.en;
    };

    return (
        <section className="nearby section">
            <div className="nearby__background"></div>
            <div className="container">
                <div className="nearby__content">
                    {/* Section Header */}
                    <div className="nearby__header">
                        <span className="section-subtitle nearby__subtitle">{t('nearbyPlaces.subtitle')}</span>
                        <h2 className="section-title nearby__title">Nearby Places</h2>
                        <div className="divider"></div>
                        <p className="nearby__description">
                            {t('nearbyPlaces.description')}
                        </p>
                    </div>

                    {/* Places Grid */}
                    <div className="nearby__grid">
                        {placesData.map((place, index) => (
                            <div
                                key={place.id}
                                className="nearby__card glass"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="nearby__card-header">
                                    <span className="nearby__card-icon">{categories[index].icon}</span>
                                    <h3 className="nearby__card-category">{categories[index].category}</h3>
                                </div>
                                <ul className="nearby__card-list">
                                    {place.items.map((item, i) => (
                                        <li key={i} className="nearby__card-item">
                                            <span className="nearby__card-name">{getName(item)}</span>
                                            <span className="nearby__card-distance">{getTime(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NearbyPlaces;
