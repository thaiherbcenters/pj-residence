import { useLanguage } from '../../context/LanguageContext';
import './AboutUs.css';

const AboutUs = () => {
    const { t } = useLanguage();
    const features = t('about.features');

    return (
        <section className="about section">
            <div className="container">
                <div className="about__wrapper">
                    {/* Image Side */}
                    <div className="about__image">
                        <div className="about__image-main">
                            <img
                                src="/images/hero-4.webp"
                                alt="PJ-Residence Atmosphere"
                                className="about__image-photo"
                            />
                        </div>
                        <div className="about__image-accent">
                            <img
                                src="/images/hero-5.webp"
                                alt="Hotel Detail"
                                className="about__image-photo"
                            />
                        </div>
                        <div className="about__image-badge">
                            <span className="about__badge-number">5</span>
                            <span className="about__badge-text">{t('about.star')}</span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="about__content">
                        <span className="section-subtitle">{t('about.subtitle')}</span>
                        <h2 className="section-title">PJ-Residence</h2>
                        <div className="divider divider-left"></div>

                        <p className="about__description">
                            {t('about.description1')}
                        </p>

                        <p className="about__description">
                            {t('about.description2')}
                        </p>

                        <div className="about__features">
                            {features.map((feature, index) => (
                                <div key={index} className="about__feature">
                                    <span className="about__feature-text">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
