import { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Gallery.css';

const Gallery = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(null);
    const { t, language } = useLanguage();

    const galleryData = {
        overview: [
            { id: 1, title: { th: 'ด้านหน้าอาคาร', en: 'Building Front', cn: '建筑正面' }, src: '/images/Overview/hero-2.webp' },
            { id: 2, title: { th: 'ล็อบบี้', en: 'Lobby', cn: '大堂' }, src: '/images/Overview/overview_2.webp' },
            { id: 3, title: { th: 'ห้องอาหาร', en: 'Restaurant', cn: '餐厅' }, src: '/images/Overview/1.webp' },
            { id: 4, title: { th: 'Living Room', en: 'Living Room', cn: '休息室' }, src: '/images/Overview/hero-5.webp' },
            { id: 5, title: { th: 'ทางเดินภายใน', en: 'Corridor', cn: '走廊' }, src: '/images/Overview/overview_18.webp' },
            { id: 6, title: { th: 'พื้นที่ส่วนกลาง', en: 'Common Area', cn: '公共区域' }, src: '/images/Overview/overview_4.webp' },
            { id: 7, title: { th: 'ที่จอดรถ', en: 'Parking', cn: '停车场' }, src: '/images/Overview/overview_19.webp' },
            { id: 8, title: { th: 'มุมมองกลางคืน', en: 'Night View', cn: '夜景' }, src: '/images/Overview/overview_8.webp' },
            { id: 9, title: { th: 'มุมพักผ่อน', en: 'Relax Corner', cn: '休息角落' }, src: '/images/Overview/overview_3.webp' },
            { id: 10, title: { th: 'สวน', en: 'Garden', cn: '花园' }, src: '/images/Overview/overview_27.webp' },
            { id: 11, title: { th: 'บรรยากาศยามเย็น', en: 'Evening Vibe', cn: '傍晚氛围' }, src: '/images/Overview/overview_6.webp' },
            { id: 12, title: { th: 'ระเบียงชมวิว', en: 'Scenic Balcony', cn: '观景阳台' }, src: '/images/Overview/overview_11.webp' }
        ],
        rooms: [
            { id: 1, title: { th: 'ห้องพักมาตรฐาน', en: 'Standard Room', cn: '标准客房' }, src: '/images/room/gallery__placeholder.webp' },
            { id: 2, title: { th: 'ห้องนอน', en: 'Bedroom', cn: '卧室' }, src: '/images/room/gallery__placeholder1.webp' },
            { id: 3, title: { th: 'ห้องน้ำ', en: 'Bathroom', cn: '浴室' }, src: '/images/room/gallery__placeholder3.webp' },
            { id: 4, title: { th: 'มุมทำงาน', en: 'Work Desk', cn: '工作台' }, src: '/images/room/room_10.webp' },
            { id: 5, title: { th: 'ตู้เสื้อผ้า', en: 'Wardrobe', cn: '衣柜' }, src: '/images/room/gallery__placeholder2.webp' },
            { id: 6, title: { th: 'ระเบียง', en: 'Balcony', cn: '阳台' }, src: '/images/room/room_4.webp' },
            { id: 7, title: { th: 'ห้องครัว', en: 'Kitchenette', cn: '小厨房' }, src: '/images/room/room_17.webp' },
            { id: 8, title: { th: 'วิวห้องพัก', en: 'Room View', cn: '房间视图' }, src: '/images/room/room_5.webp' },
            { id: 9, title: { th: 'มุมพักผ่อน', en: 'Cozy Corner', cn: '舒适角落' }, src: '/images/room/room_18.webp' },
            { id: 10, title: { th: 'การตกแต่งภายใน', en: 'Interior', cn: '室内装饰' }, src: '/images/room/room_14.webp' },
            { id: 11, title: { th: 'สิ่งอำนวยความสะดวก', en: 'Amenities', cn: '设施' }, src: '/images/room/room_22.webp' },
            { id: 12, title: { th: 'บรรยากาศห้องพัก', en: 'Room Atmosphere', cn: '房间氛围' }, src: '/images/room/room_24.webp' },
        ]
    };

    const getTitle = (item) => {
        return item.title[language] || item.title.en;
    };

    const currentImages = galleryData[activeTab];

    return (
        <div className="gallery-page">
            <Header />

            {/* Hero Banner */}
            <section className="gallery-hero">
                <div className="gallery-hero__overlay"></div>
                <div className="gallery-hero__content">
                    <span className="gallery-hero__subtitle">{t('galleryPage.heroSubtitle')}</span>
                    <h1 className="gallery-hero__title">Gallery</h1>
                    <p className="gallery-hero__description">
                        {t('galleryPage.heroDescription')}
                    </p>
                </div>
            </section>

            <main>
                {/* Gallery Section */}
                <section className="gallery-section section">
                    <div className="container">
                        {/* Tabs */}
                        <div className="gallery-tabs">
                            <button
                                className={`gallery-tab ${activeTab === 'overview' ? 'gallery-tab--active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <span className="gallery-tab__text">🏨 {t('galleryPage.tabs.overview')}</span>
                            </button>
                            <button
                                className={`gallery-tab ${activeTab === 'rooms' ? 'gallery-tab--active' : ''}`}
                                onClick={() => setActiveTab('rooms')}
                            >
                                <span className="gallery-tab__text">🛏️ {t('galleryPage.tabs.rooms')}</span>
                            </button>
                        </div>

                        {/* Gallery Grid */}
                        <div className="gallery-grid">
                            {currentImages.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`gallery-item ${index === 0 ? 'gallery-item--large' : ''}`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <div className="gallery-item__image">
                                        {image.src ? (
                                            <img src={image.src} alt={getTitle(image)} loading="lazy" />
                                        ) : (
                                            <div className="gallery-item__placeholder">
                                                <span>{activeTab === 'overview' ? '🏨' : '🛏️'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Lightbox */}
            {selectedImage && (
                <div className="gallery-lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="gallery-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <div className="gallery-lightbox__image">
                            {selectedImage.src ? (
                                <img src={selectedImage.src} alt={getTitle(selectedImage)} />
                            ) : (
                                <div className="gallery-lightbox__placeholder">
                                    <span>{activeTab === 'overview' ? '🏨' : '🛏️'}</span>
                                </div>
                            )}
                        </div>
                        <div className="gallery-lightbox__info">
                            <h3>{getTitle(selectedImage)}</h3>
                        </div>
                        <button className="gallery-lightbox__close" onClick={() => setSelectedImage(null)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Gallery;
