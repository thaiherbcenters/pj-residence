import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FloatingSocial.css';

const FloatingSocial = () => {
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Function to check scroll position
        const handleScroll = () => {
            // Hide on admin pages
            if (location.pathname.startsWith('/admin')) {
                setIsVisible(false);
                return;
            }

            if (location.pathname === '/') {
                if (window.scrollY > 500) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(true);
            }
        };

        // Initial check
        handleScroll();

        // Add event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <div className={`floating-social ${!isVisible ? 'floating-social--hidden' : ''}`}>
            <a
                href="https://line.me/ti/p/~PJ11-3"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-social__link floating-social__link--line"
                aria-label="Contact via Line"
            >
                <div className="floating-social__icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                </div>
                <span className="floating-social__text">Add Line</span>
            </a>

            <a
                href="https://www.facebook.com/PJResidence38/"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-social__link floating-social__link--facebook"
                aria-label="Follow on Facebook"
            >
                <div className="floating-social__icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </div>
                <span className="floating-social__text">Facebook</span>
            </a>
        </div>
    );
};

export default FloatingSocial;
