import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Accommodations.css';

const Accommodations = () => {
    const { t } = useLanguage();
    const rooms = t('accommodations.rooms');
    const images = ['/images/gallery__placeholder.webp', '/images/gallery__placeholder1.webp'];

    return (
        <section className="accommodations section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-subtitle">{t('accommodations.subtitle')}</span>
                    <h2 className="section-title">{t('accommodations.title')}</h2>
                    <div className="divider"></div>
                    <p className="section-description">
                        {t('accommodations.description')}
                    </p>
                </div>

                {/* Room Cards */}
                <div className="accommodations__grid">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            className="room-card card"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="room-card__image card-image">
                                <img
                                    src={images[index]}
                                    alt={room.nameEn}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="room-card__overlay">
                                    <Link
                                        to="/rooms"
                                        className="btn btn-outline"
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        {t('accommodations.viewDetails')}
                                    </Link>
                                </div>
                            </div>
                            <div className="room-card__content card-content">
                                <div className="room-card__header">
                                    <div>
                                        <h3 className="room-card__name">{room.name}</h3>
                                        <span className="room-card__name-en">{room.nameEn}</span>
                                    </div>
                                    <div className="room-card__price">
                                        <span className="room-card__price-value">{room.price}</span>
                                        <span className="room-card__price-unit">{t('accommodations.' + room.unit)}</span>
                                    </div>
                                </div>

                                {/* Special Badges for Daily Room */}
                                {room.unit === 'perNight' && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="gov-checkbox-wrapper">
                                            <div className="gov-checkbox-content">
                                                {t('accommodations.govOfficial')}
                                                <span className="gov-checkbox-sub">{t('accommodations.govSub')}</span>
                                            </div>
                                        </div>
                                        <div className="google-review-wrapper">
                                            <div className="google-review-content">
                                                {t('accommodations.googleReview')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <p className="room-card__description">{room.description}</p>
                                <div className="room-card__details">
                                    <div className="room-card__detail">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                        </svg>
                                        <span>{room.size}</span>
                                    </div>
                                    <div className="room-card__detail">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        <span>{room.guests}</span>
                                    </div>
                                    <div className="room-card__detail">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M2 4v16" />
                                            <path d="M22 4v16" />
                                            <path d="M2 8h20" />
                                            <path d="M2 12h20" />
                                        </svg>
                                        <span>{room.bed}</span>
                                    </div>
                                </div>
                                <div className="room-card__features">
                                    {room.features.map((feature, i) => (
                                        <span key={i} className="room-card__feature">{feature}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="accommodations__cta">
                    <Link
                        to="/rooms"
                        className="btn btn-outline-gold"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        {t('accommodations.viewAllRooms')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Accommodations;
