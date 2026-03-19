import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const Hero = () => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [isCustomGuests, setIsCustomGuests] = useState(false);
    const [isCustomRooms, setIsCustomRooms] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const slides = t('hero.slides');
    const ctaLinks = ['/rooms', '/rooms', '/nearby'];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleSearch = async () => {
        if (!checkInDate || !checkOutDate) {
            alert(t('nav.booking') + ': ' + t('hero.checkIn') + ' / ' + t('hero.checkOut'));
            return;
        }

        try {
            const response = await fetch('/api/rooms');
            if (!response.ok) throw new Error('Failed to fetch rooms');

            const allRooms = await response.json();

            // Check availability logic
            // We need to find at least 'rooms' count of available rooms
            const availableRooms = allRooms.filter(room => {
                if (room.status === 'available') return true;
                if (room.status === 'maintenance') return false;

                // For occupied rooms, check if they check out before our check-in
                if (room.status === 'occupied' && room.check_out) {
                    const roomCheckOut = new Date(room.check_out);
                    const myCheckIn = new Date(checkInDate);
                    // If room frees up before or on the day we check in
                    return roomCheckOut <= myCheckIn;
                }
                return false;
            });

            if (availableRooms.length >= rooms) {
                // Navigate to Daily Booking with state
                navigate('/daily-booking', {
                    state: {
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        guests: guests,
                        rooms: rooms
                    }
                });
            } else {
                alert(`ขออภัย มีห้องว่างเพียง ${availableRooms.length} ห้อง (ต้องการ ${rooms} ห้อง)`);
            }

        } catch (error) {
            console.error('Error searching rooms:', error);
            alert('Error checking availability. Please try again.');
        }
    };

    return (
        <section className="hero">
            {/* Background Slides */}
            <div className="hero__slides">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
                        style={{
                            backgroundImage: index === 0
                                ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/images/hero-${index + 1}.webp')`
                                : `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('/images/hero-${index + 1}.webp')`
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="hero__content">
                <div className="hero__text" key={currentSlide}>
                    <span className="hero__welcome animate-fadeInDown">{slides[currentSlide].title}</span>
                    <h1 className="hero__title animate-fadeInUp delay-100">{slides[currentSlide].subtitle}</h1>
                    <div className="hero__divider animate-scaleIn delay-200"></div>
                    <p className="hero__description animate-fadeInUp delay-300">
                        {slides[currentSlide].description}
                    </p>
                    <div className="hero__buttons animate-fadeInUp delay-400">
                        <Link to={ctaLinks[currentSlide]} className="btn btn-primary">
                            {slides[currentSlide].cta}
                        </Link>
                        <Link to="/booking" className="btn btn-outline">
                            {t('nav.booking')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="hero__indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero__indicator ${index === currentSlide ? 'hero__indicator--active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`${t('hero.goToSlide')} ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Down Indicator */}
            <div className="hero__scroll">
                <span>{t('hero.scrollDown')}</span>
                <div className="hero__scroll-line"></div>
            </div>

            {/* Booking Widget */}
            <div className="hero__booking glass-dark">
                <div className="hero__booking-item">
                    <label>{t('hero.checkIn')}</label>
                    <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="hero__booking-item">
                    <label>{t('hero.checkOut')}</label>
                    <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="hero__booking-item">
                    <label>{t('hero.guests')}</label>
                    {!isCustomGuests ? (
                        <select
                            value={guests}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    setIsCustomGuests(true);
                                    setGuests('');
                                } else {
                                    setGuests(parseInt(e.target.value));
                                }
                            }}
                        >
                            {t('hero.guestOptions').map((option, i) => (
                                <option key={i} value={i + 1}>{option}</option>
                            ))}
                            <option value="custom">{t('contactPage.topics.other') || 'Other'}</option>
                        </select>
                    ) : (
                        <div className="custom-input-group">
                            <input
                                type="number"
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value) || '')}
                                placeholder={t('hero.guests')}
                                min="1"
                                autoFocus
                            />
                            <button
                                className="btn-link"
                                onClick={() => setIsCustomGuests(false)}
                                style={{ marginLeft: '5px', color: 'white' }}
                            >
                                ↩
                            </button>
                        </div>
                    )}
                </div>
                <div className="hero__booking-item">
                    <label>{t('hero.roomLabel')}</label>
                    {!isCustomRooms ? (
                        <select
                            value={rooms}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    setIsCustomRooms(true);
                                    setRooms('');
                                } else {
                                    setRooms(parseInt(e.target.value));
                                }
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} {t('hero.roomLabel')}</option>
                            ))}
                            <option value="custom">{t('contactPage.topics.other') || 'Other'}</option>
                        </select>
                    ) : (
                        <div className="custom-input-group">
                            <input
                                type="number"
                                value={rooms}
                                onChange={(e) => setRooms(parseInt(e.target.value) || '')}
                                placeholder={t('hero.roomLabel')}
                                min="1"
                                autoFocus
                            />
                            <button
                                className="btn-link"
                                onClick={() => setIsCustomRooms(false)}
                                style={{ marginLeft: '5px', color: 'white' }}
                            >
                                ↩
                            </button>
                        </div>
                    )}
                </div>
                <button className="btn btn-primary hero__booking-btn" onClick={handleSearch}>
                    {t('hero.searchRooms')}
                </button>
            </div>
        </section>
    );
};

export default Hero;
