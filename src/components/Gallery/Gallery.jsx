import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Gallery.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { t } = useLanguage();

    const images = [
        { id: 1, category: t('gallery.categories.lobby'), title: 'Atmosphere', image: '/images/gallery__placeholder.webp' },
        { id: 2, category: t('gallery.categories.lobby'), title: 'Atmosphere', image: '/images/gallery__placeholder1.webp' },
        { id: 3, category: t('gallery.categories.lobby'), title: 'Atmosphere', image: '/images/gallery__placeholder2.webp' },
        { id: 4, category: t('gallery.categories.lobby'), title: 'Atmosphere', image: '/images/gallery__placeholder3.webp' },
        { id: 5, category: t('gallery.categories.rooms'), title: 'Guest Room', image: '/images/room/room_4.jpg' },
        { id: 6, category: t('gallery.categories.rooms'), title: 'Guest Room', image: '/images/room/room_5.jpg' },
        { id: 7, category: t('gallery.categories.rooms'), title: 'Guest Room', image: '/images/room/room_6.jpg' },
        { id: 8, category: t('gallery.categories.rooms'), title: 'Guest Room', image: '/images/room/room_22.jpg' },
        { id: 9, category: t('gallery.categories.lobby'), title: 'Grand Lobby', image: '/images/grand_lobby.webp' },
        { id: 10, category: t('gallery.categories.lobby'), title: 'Grand Lobby', image: '/images/grand_lobby_1.webp' },
    ];

    return (
        <section className="gallery section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-subtitle">{t('gallery.subtitle')}</span>
                    <h2 className="section-title">Discover Our Beauty</h2>
                    <div className="divider"></div>
                    <p className="section-description">
                        {t('gallery.description')}
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="gallery__grid">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`gallery__item gallery__item--${index + 1}`}
                            onClick={() => setSelectedImage(image)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="gallery__item-image">
                                <img
                                    className="gallery__img"
                                    src={image.image}
                                    alt={image.title}
                                />
                            </div>
                            <div className="gallery__item-overlay">
                                <span className="gallery__item-category">{image.category}</span>
                                <h3 className="gallery__item-title">{image.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="gallery__cta">
                    <Link to="/gallery" className="btn btn-outline-gold">
                        {t('gallery.viewAll')}
                    </Link>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="gallery__lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="gallery__lightbox-content">
                        <div className="gallery__lightbox-image">
                            <img
                                className="gallery__img"
                                src={selectedImage.image}
                                alt={selectedImage.title}
                            />
                        </div>
                        <div className="gallery__lightbox-info">
                            <span className="gallery__lightbox-category">{selectedImage.category}</span>
                            <h3 className="gallery__lightbox-title">{selectedImage.title}</h3>
                        </div>
                        <button className="gallery__lightbox-close">×</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
