import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Rooms.css';

const Rooms = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t, language } = useLanguage();

    const slideImages = [
        '/images/gallery__placeholder.webp',
        '/images/gallery__placeholder1.webp',
        '/images/gallery__placeholder2.webp',
        '/images/gallery__placeholder3.webp'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const amenities = t('roomsPage.amenities');
    const facilities = t('roomsPage.facilities');

    return (
        <div className="rooms-page">
            <Header />

            {/* Hero Banner */}
            <section className="rooms-hero">
                <div className="rooms-hero__overlay"></div>
                <div className="rooms-hero__content">
                    <span className="rooms-hero__subtitle">{t('roomsPage.heroSubtitle')}</span>
                    <h1 className="rooms-hero__title">{t('roomsPage.heroTitle')}</h1>
                    <p className="rooms-hero__description">
                        {t('roomsPage.heroDescription')}
                    </p>
                </div>
            </section>

            <main>
                {/* Room Details Section */}
                <section className="rooms-details section">
                    <div className="container">
                        <div className="rooms-details__wrapper">
                            <div className="rooms-details__intro">
                                <span className="section-subtitle">PJ-Residence</span>
                                <h2 className="section-title">{t('roomsPage.modernStyle')}</h2>
                                <div className="divider divider-left"></div>

                                <p className="rooms-details__text">
                                    {t('roomsPage.roomDescription')}
                                </p>
                            </div>

                            <div className="rooms-details__lists">
                                {/* Amenities */}
                                <h3 className="rooms-details__amenities-title">{t('roomsPage.amenitiesTitle')}</h3>
                                <div className="rooms-details__amenities">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="rooms-details__amenity">
                                            <span className="rooms-details__amenity-text">{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="rooms-details__amenities-title" style={{ marginTop: 'var(--space-3xl)' }}>{t('roomsPage.commonAreaTitle')}</h3>
                                <div className="rooms-facilities__grid">
                                    {facilities.map((facility, index) => (
                                        <div key={index} className="rooms-facilities__card">
                                            <h3 className="rooms-facilities__title">{facility.title}</h3>
                                            <p className="rooms-facilities__description">{facility.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rooms-details__gallery">
                                {/* Main Large Image */}
                                <div className="rooms-details__main-image">
                                    <img
                                        src={slideImages[currentSlide]}
                                        alt={`Room Detail ${currentSlide + 1}`}
                                        className="animate-fade"
                                    />
                                </div>

                                {/* Thumbnails Row */}
                                <div className="rooms-details__thumbnails">
                                    {[1, 2, 3].map((offset) => {
                                        const index = (currentSlide + offset) % slideImages.length;
                                        return (
                                            <div
                                                key={index}
                                                className="rooms-details__thumbnail"
                                                onClick={() => setCurrentSlide(index)}
                                            >
                                                <img
                                                    src={slideImages[index]}
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Room Layout Image */}
                                <h3 className="rooms-details__amenities-title" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>{t('roomsPage.roomLayout')}</h3>
                                <div className="rooms-details__layout-wrapper" style={{ marginBottom: '2rem' }}>
                                    <img
                                        src="/images/room/layout.jpg"
                                        alt={t('roomsPage.roomLayout')}
                                        className="rooms-details__layout-img"
                                        style={{ maxWidth: '70%', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                </section >

                {/* Pricing Section */}
                < section className="rooms-pricing section" >
                    <div className="container">
                        <div className="section-header">
                            <span className="section-subtitle">{t('roomsPage.pricingSubtitle')}</span>
                            <h2 className="section-title">{t('roomsPage.pricingTitle')}</h2>
                            <div className="divider"></div>
                            <p className="section-description">
                                {t('roomsPage.pricingDescription')}
                            </p>
                        </div>

                        <div className="rooms-pricing__cards">
                            {/* Monthly Package */}
                            <div className="pricing-card">
                                <div className="pricing-card__header">
                                    <span className="pricing-card__badge">{t('roomsPage.popular')}</span>
                                    <h3 className="pricing-card__title">{t('roomsPage.monthly')}</h3>
                                    <div className="pricing-card__price">
                                        <span className="pricing-card__amount">4,500</span>
                                        <span className="pricing-card__unit">{t('roomsPage.perMonth')}</span>
                                    </div>
                                </div>
                                <div className="pricing-card__body">
                                    <ul className="pricing-card__features">
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.rent')}</span>
                                            <span className="pricing-card__feature-value"><strong>4,500 THB</strong></span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.deposit')}</span>
                                            <span className="pricing-card__feature-value"><strong>8,000 THB</strong></span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.water')}</span>
                                            <span className="pricing-card__feature-value">18 THB/unit</span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.electricity')}</span>
                                            <span className="pricing-card__feature-value">8 THB/unit</span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.minContract')}</span>
                                            <span className="pricing-card__feature-value">6 {t('roomsPage.months')}</span>
                                        </li>


                                    </ul>
                                    <Link
                                        to="/booking"
                                        className="btn btn-primary pricing-card__btn"
                                        state={{ roomType: 'monthly' }}
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        {t('nav.booking')}
                                    </Link>
                                </div>
                            </div>

                            {/* Daily Package */}
                            <div className="pricing-card pricing-card--secondary">
                                <div className="pricing-card__header">
                                    <h3 className="pricing-card__title">{t('roomsPage.daily')}</h3>
                                    <div className="pricing-card__price">
                                        <span className="pricing-card__amount">850</span>
                                        <span className="pricing-card__unit">{t('roomsPage.perNight')}</span>
                                    </div>
                                </div>
                                <div className="pricing-card__body">
                                    <div style={{ margin: '1rem 0' }}>
                                        <div className="gov-checkbox-wrapper" style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#166534', fontWeight: '600' }}>
                                                {language === 'th' ? 'ข้าราชการ/รัฐวิสาหกิจ (680 บาท/คืน)' : language === 'cn' ? '公务员/国企员工 (680 泰铢/晚)' : 'Gov. Official (680 THB/night)'}
                                                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#15803d' }}>{language === 'th' ? '(*โปรดแสดงบัตร)' : language === 'cn' ? '(*请出示证件)' : '(*Show ID)'}</span>
                                            </div>
                                        </div>
                                        <div className="google-review-wrapper" style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#1e40af', fontWeight: '600' }}>
                                                {language === 'th' ? 'รีวิว Google Map 5 ดาว (680 บาท/คืน)' : language === 'cn' ? '谷歌地图 5 星好评 (680 泰铢/晚)' : 'Google Map 5-Star Review (680 THB/night)'}
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="pricing-card__features">
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.deposit')}</span>
                                            <span className="pricing-card__feature-value">1,000 THB (1 night)</span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.water')}</span>
                                            <span className="pricing-card__feature-value">{t('roomsPage.included')}</span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.electricity')}</span>
                                            <span className="pricing-card__feature-value">{t('roomsPage.included')}</span>
                                        </li>
                                        <li>
                                            <span className="pricing-card__feature-label">{t('roomsPage.minContract')}</span>
                                            <span className="pricing-card__feature-value">-</span>
                                        </li>
                                    </ul>

                                    <Link
                                        to="/booking"
                                        className="btn btn-primary pricing-card__btn"
                                        state={{ roomType: 'daily' }}
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        {t('nav.booking')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="rooms-pricing__note">
                            <p>{t('roomsPage.priceNote')}</p>
                        </div>
                    </div>
                </section >
            </main >

            <Footer />
        </div >
    );
};

export default Rooms;
