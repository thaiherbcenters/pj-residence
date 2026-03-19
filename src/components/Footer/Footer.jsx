import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';


const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="container">
                {/* Top Section */}
                <div className="footer__top">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <img src="/images/logo.webp" alt="PJ-Residence" className="footer__logo-img" />
                        </Link>
                        <p className="footer__description">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__links">
                        <h4 className="footer__title">{t('footer.quickLinks')}</h4>
                        <ul className="footer__list">
                            <li><Link to="/">{t('nav.home')}</Link></li>
                            <li><Link to="/rooms">{t('nav.rooms')}</Link></li>
                            <li><Link to="/facilities">{t('nav.facilities')}</Link></li>
                            <li><Link to="/nearby">{t('nav.nearby')}</Link></li>
                            <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
                            <li><Link to="/contact">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer__links">
                        <h4 className="footer__title">{t('footer.services')}</h4>
                        <ul className="footer__list">
                            <li><a href="#">{t('footer.meetingRoom')}</a></li>
                            <li><a href="#">{t('footer.promotions')}</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer__newsletter">
                        <h4 className="footer__title">{t('footer.newsletter')}</h4>
                        <p>{t('footer.newsletterText')}</p>
                        <form className="footer__newsletter-form" onSubmit={async (e) => {
                            e.preventDefault();
                            const email = e.target.elements.email.value;
                            if (!email) return;

                            try {
                                const res = await fetch('/api/newsletter', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email })
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    alert(t('footer.subscribeSuccess') || 'Subscribed successfully!');
                                    e.target.reset();
                                } else {
                                    alert(data.error || 'Subscription failed');
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Error subscribing');
                            }
                        }}>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('footer.emailPlaceholder')}
                                className="footer__newsletter-input"
                                required
                            />
                            <button type="submit" className="btn btn-primary footer__newsletter-btn">
                                {t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer__divider"></div>

                {/* Bottom Section */}
                <div className="footer__bottom">
                    <div className="footer__copyright">
                        <p>© {currentYear} PJ-Residence. All rights reserved.</p>
                    </div>
                    <div className="footer__social">
                        <a href="https://line.me/ti/p/~PJ11-3" className="footer__social-link" aria-label="Line" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03.94 3.87 2.47 5.26V20l4.24-2.33c1.08.3 2.17.33 3.29.33 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/PJResidence38/" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                    </div>
                    <div className="footer__legal">
                        <a href="#">{t('footer.privacy')}</a>
                        <a href="#">{t('footer.terms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

