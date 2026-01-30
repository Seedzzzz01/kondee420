'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { label: t.claimsManagement, path: '/admin', icon: '📋' },
        // Future items:
        // { label: t.warrantyModels, path: '/admin/models', icon: '🏷️' },
        // { label: t.settings, path: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#050510', color: '#f0f0ff' }}>
            <aside style={{
                width: '280px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                background: 'rgba(15, 15, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(100, 100, 180, 0.2)',
                padding: '2rem 1.5rem',
                zIndex: 100,
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #7c5cff 0%, #00d4aa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>🛡️</span> {t.adminPanel}
                    </h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: pathname === item.path ? 'white' : 'rgba(200, 200, 240, 0.7)',
                                background: pathname === item.path ? 'rgba(124, 92, 255, 0.2)' : 'transparent',
                                border: pathname === item.path ? '1px solid rgba(124, 92, 255, 0.3)' : '1px solid transparent',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'rgba(200, 200, 240, 0.5)',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <span>🏠</span> {t.backToPortal}
                    </Link>

                    <button
                        onClick={async () => {
                            await fetch('/api/admin/login', { method: 'DELETE' });
                            window.location.href = '/';
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#ff6b6b',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <span>🚪</span> {t.logout}
                    </button>
                </div>
            </aside>

            <main style={{ marginLeft: '280px', padding: '2.5rem', position: 'relative' }}>
                <div className="animated-bg" style={{ pointerEvents: 'none' }} />
                <div className="orb orb-1" />
                <div className="orb-2" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
