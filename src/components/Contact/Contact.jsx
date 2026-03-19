import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
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
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Contact error:', error);
            alert('Failed to send message.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="contact section">
            <div className="container">
                <div className="contact__wrapper">
                    {/* Contact Info */}
                    <div className="contact__info">
                        <span className="section-subtitle">{t('contact.subtitle')}</span>
                        <h2 className="section-title">Get in Touch</h2>
                        <div className="divider divider-left"></div>
                        <p className="contact__description">
                            {t('contact.description')}
                        </p>

                        <div className="contact__details">
                            <div className="contact__detail">
                                <div className="contact__detail-icon">📍</div>
                                <div className="contact__detail-content">
                                    <h4>{t('contact.address')}</h4>
                                    <p>เลขที่ 2/2 ถ.สนามบินน้ำ ซอยนนทบุรี 38<br />ต.ท่าทราย อ.เมือง จ.นนทบุรี 11000</p>
                                </div>
                            </div>

                            <div className="contact__detail">
                                <div className="contact__detail-icon">📞</div>
                                <div className="contact__detail-content">
                                    <h4>{t('contact.phone')}</h4>
                                    <p>02-968-7020</p>
                                    <p>088-788-3988</p>
                                </div>
                            </div>

                            <div className="contact__detail">
                                <div className="contact__detail-icon">✉️</div>
                                <div className="contact__detail-content">
                                    <h4>{t('contact.email')}</h4>
                                    <p>pj.residence.soi38@gmail.com</p>
                                </div>
                            </div>

                            <div className="contact__detail">
                                <div className="contact__detail-icon">🕐</div>
                                <div className="contact__detail-content">
                                    <h4>{t('contact.workingHours')}</h4>
                                    <p>{t('contact.open24')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="contact__social">
                            <a href="https://line.me/ti/p/~PJ11-3" className="contact__social-link" aria-label="Line" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03.94 3.87 2.47 5.26V20l4.24-2.33c1.08.3 2.17.33 3.29.33 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/PJResidence38/" className="contact__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact__form-wrapper">
                        <form className="contact__form" onSubmit={handleSubmit}>
                            <h3 className="contact__form-title">{t('contact.sendMessage')}</h3>

                            <div className="contact__form-group">
                                <label htmlFor="name">{t('contact.name')}</label>
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

                            <div className="contact__form-row">
                                <div className="contact__form-group">
                                    <label htmlFor="email">{t('contact.email')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="contact__form-group">
                                    <label htmlFor="phone">{t('contact.phone')}</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={t('contact.phonePlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className="contact__form-group">
                                <label htmlFor="message">{t('contact.message')}</label>
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

                            <button type="submit" className="btn btn-primary contact__submit">
                                {t('contact.submit')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map */}
                <div className="contact__map">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://maps.google.com/maps?q=VGJ2%2B29%20Nonthaburi&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;
