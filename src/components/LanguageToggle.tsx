'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        background: 'white',
        border: '1px solid rgba(74, 169, 233, 0.2)',
        borderRadius: '100px',
        padding: '0.35rem',
        boxShadow: '0 2px 12px rgba(74, 169, 233, 0.15)',
    };

    const pillBaseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 0.85rem',
        border: 'none',
        borderRadius: '100px',
        background: 'transparent',
        color: '#6b8a9a',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const pillActiveStyle: React.CSSProperties = {
        ...pillBaseStyle,
        background: 'linear-gradient(135deg, #4AA9E9 0%, #5BC0DE 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(74, 169, 233, 0.4)',
    };

    const dividerStyle: React.CSSProperties = {
        width: '1px',
        height: '20px',
        background: 'rgba(74, 169, 233, 0.2)',
    };

    return (
        <div style={containerStyle}>
            <button
                style={language === 'th' ? pillActiveStyle : pillBaseStyle}
                onClick={() => setLanguage('th')}
                aria-label="Thai language"
            >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>🇹🇭</span>
                <span>ไทย</span>
            </button>
            <div style={dividerStyle} />
            <button
                style={language === 'en' ? pillActiveStyle : pillBaseStyle}
                onClick={() => setLanguage('en')}
                aria-label="English language"
            >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>🇬🇧</span>
                <span>EN</span>
            </button>
        </div>
    );
}
