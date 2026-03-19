import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Get saved language from localStorage or default to 'th'
        const saved = localStorage.getItem('language');
        return saved || 'th';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Translation function
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                // Fallback to Thai if translation not found
                value = translations['th'];
                for (const fallbackKey of keys) {
                    if (value && value[fallbackKey] !== undefined) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }

        return value !== undefined ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
