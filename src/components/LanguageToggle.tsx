'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        background: 'rgba(20, 20, 40, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(100, 100, 180, 0.2)',
        borderRadius: '100px',
        padding: '0.4rem',
        zIndex: 1000,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
    };

    const pillBaseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        border: 'none',
        borderRadius: '100px',
        background: 'transparent',
        color: 'rgba(200, 200, 240, 0.7)',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const pillActiveStyle: React.CSSProperties = {
        ...pillBaseStyle,
        background: 'linear-gradient(135deg, #7c5cff 0%, #00d4aa 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(124, 92, 255, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
    };

    const dividerStyle: React.CSSProperties = {
        width: '1px',
        height: '24px',
        background: 'rgba(100, 100, 180, 0.3)',
    };

    return (
        <div style={containerStyle}>
            <button
                style={language === 'th' ? pillActiveStyle : pillBaseStyle}
                onClick={() => setLanguage('th')}
                aria-label="Thai language"
            >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇹🇭</span>
                <span>ไทย</span>
            </button>
            <div style={dividerStyle} />
            <button
                style={language === 'en' ? pillActiveStyle : pillBaseStyle}
                onClick={() => setLanguage('en')}
                aria-label="English language"
            >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇬🇧</span>
                <span>EN</span>
            </button>
        </div>
    );
}
