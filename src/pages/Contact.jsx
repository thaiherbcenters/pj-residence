import { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert(t('contact.thankYou'));
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error('Contact error:', error);
            alert('Failed to send message. Please contact us directly.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const highlightsData = t('contactPage.highlights');
    const highlights = Array.isArray(highlightsData) ? highlightsData : [];

    return (
        <div className="contact-page">
            <Header />

            {/* Hero Banner */}
            <section className="contact-hero">
                <div className="contact-hero__overlay"></div>
                <div className="contact-hero__content">
                    <span className="contact-hero__subtitle">{t('contactPage.heroSubtitle')}</span>
                    <h1 className="contact-hero__title">Contact Us</h1>
                    <p className="contact-hero__description">
                        {t('contactPage.heroDescription')}
                    </p>
                </div>
            </section>

            <main>
                {/* About Location */}
                <section className="contact-about section">
                    <div className="container">
                        <div className="contact-about__wrapper">
                            <div className="contact-about__content">
                                <span className="section-subtitle">PJ-Residence</span>
                                <h2 className="section-title">{t('contactPage.locationTitle')}</h2>
                                <div className="divider divider-left"></div>
                                <p className="contact-about__text">
                                    {t('contactPage.locationText1')}
                                </p>
                                <p className="contact-about__text">
                                    {t('contactPage.locationText2')}
                                </p>

                                { /* Highlights section removed as per request */}
                            </div>
                            <div className="contact-about__map">
                                <img src="/images/map.jpg" alt="PJ-Residence Map" />
                                <div className="contact-about__map-placeholder">
                                    <span>📍</span>
                                    <p>PJ-Residence Map</p>
                                </div>
                                {/* Google Map Embed */}
                                <div className="contact-about__google-map">
                                    <iframe
                                        width="100%"
                                        height="300"
                                        style={{ border: 0, marginTop: 'var(--space-lg)' }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src="https://maps.google.com/maps?q=VGJ2%2B29%20Nonthaburi&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Social */}
                <section className="contact-main section">
                    <div className="container">
                        <div className="contact-main__wrapper">
                            {/* Contact Form */}
                            <div className="contact-form-wrapper">
                                <span className="section-subtitle">{t('contactPage.sendMessageSubtitle')}</span>
                                <h2 className="section-title">{t('contactPage.inquiryTitle')}</h2>
                                <div className="divider divider-left"></div>
                                <p className="contact-form__description">
                                    {t('contactPage.formDescription')}
                                </p>

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="contact-form__row">
                                        <div className="contact-form__group">
                                            <label htmlFor="name">{t('contact.name')} *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t('contact.namePlaceholder')}
                                            />
                                        </div>
                                        <div className="contact-form__group">
                                            <label htmlFor="phone">{t('contact.phone')} *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder={t('contact.phonePlaceholder')}
                                            />
                                        </div>
                                    </div>

                                    <div className="contact-form__row">
                                        <div className="contact-form__group">
                                            <label htmlFor="email">{t('contact.email')}</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div className="contact-form__group">
                                            <label htmlFor="subject">{t('contactPage.topic')}</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            >
                                                <option value="">{t('contactPage.selectTopic')}</option>
                                                <option value="booking">{t('contactPage.topics.booking')}</option>
                                                <option value="price">{t('contactPage.topics.price')}</option>
                                                <option value="facilities">{t('contactPage.topics.facilities')}</option>
                                                <option value="other">{t('contactPage.topics.other')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="contact-form__group">
                                        <label htmlFor="message">{t('contact.message')} *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            placeholder={t('contact.messagePlaceholder')}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary contact-form__submit">
                                        {t('contact.submit')}
                                    </button>
                                </form>
                            </div>

                            {/* Contact Info Box */}
                            <div className="contact-box">
                                {/* Address */}
                                <div className="contact-box__section">
                                    <h3 className="contact-box__title">{t('contact.address')}</h3>
                                    <p className="contact-box__text">
                                        2/2 Sanambin Nam Rd., Soi Nonthaburi 38<br />
                                        Tha Sai, Muang, Nonthaburi 11000
                                    </p>
                                </div>

                                <div className="contact-box__section">
                                    <h3 className="contact-box__title">{t('contact.phone')}</h3>
                                    <p className="contact-box__text">
                                        <a href="tel:029687020">02-968-7020</a><br />
                                        <a href="tel:0887883988">088-788-3988</a>
                                    </p>
                                </div>

                                <div className="contact-box__section">
                                    <h3 className="contact-box__title">{t('contact.email')}</h3>
                                    <p className="contact-box__text">
                                        <a href="mailto:pj.residence.soi38@gmail.com">pj.residence.soi38@gmail.com</a>
                                    </p>
                                </div>

                                <div className="contact-box__section">
                                    <h3 className="contact-box__title">{t('contact.workingHours')}</h3>
                                    <p className="contact-box__text">
                                        {t('contact.open24')}<br />
                                        {t('contactPage.checkIn')}<br />
                                        {t('contactPage.checkOut')}
                                    </p>
                                </div>

                                {/* Social Media */}
                                <div className="contact-box__section contact-box__section--social">
                                    <h3 className="contact-box__title">{t('contactPage.socialMedia')}</h3>
                                    <div className="contact-box__social-links">
                                        <a href="https://line.me/ti/p/~PJ11-3" target="_blank" rel="noopener noreferrer" className="contact-box__social-link contact-box__social-link--line">
                                            <svg className="contact-box__social-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                            </svg>
                                            <div>
                                                <strong>Line</strong>
                                                <p>PJ11-3</p>
                                            </div>
                                        </a>
                                        <a href="https://www.facebook.com/PJResidence38/" target="_blank" rel="noopener noreferrer" className="contact-box__social-link contact-box__social-link--facebook">
                                            <svg className="contact-box__social-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            <div>
                                                <strong>Facebook</strong>
                                                <p>PJ-Residence</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
