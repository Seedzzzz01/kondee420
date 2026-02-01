'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { label: t.claimsManagement, path: '/admin', icon: '📋' },
        // Future items:
        // { label: t.warrantyModels, path: '/admin/models', icon: '🏷️' },
        // { label: t.settings, path: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="admin-wrapper">
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <button
                    className="admin-menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="menu-icon">{sidebarOpen ? '✕' : '☰'}</span>
                </button>
                <h1 className="admin-mobile-title">
                    <span className="admin-logo">🛡️</span> {t.adminPanel}
                </h1>
                <div className="admin-mobile-lang">
                    <LanguageToggle />
                </div>
            </header>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h1 className="admin-sidebar-title">
                        <span className="admin-logo">🛡️</span> {t.adminPanel}
                    </h1>
                </div>

                <div className="admin-sidebar-lang">
                    <LanguageToggle />
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link href="/" className="admin-footer-link" onClick={() => setSidebarOpen(false)}>
                        <span>🏠</span> {t.backToPortal}
                    </Link>

                    <button
                        onClick={async () => {
                            await fetch('/api/admin/login', { method: 'DELETE' });
                            window.location.href = '/';
                        }}
                        className="admin-logout-btn"
                    >
                        <span>🚪</span> {t.logout}
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="animated-bg" style={{ pointerEvents: 'none' }} />
                <div className="orb orb-1" />
                <div className="orb-2" />
                <div className="admin-content">
                    {children}
                </div>
            </main>

            <style jsx>{`
                .admin-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #E6F3FF 0%, #F0F7FF 50%, #FFFFFF 100%);
                    color: #1a3a4a;
                }

                /* Mobile Header */
                .admin-mobile-header {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(74, 169, 233, 0.15);
                    z-index: 101;
                    padding: 0 1rem;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 10px rgba(74, 169, 233, 0.05);
                }

                .admin-menu-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border: 1px solid rgba(74, 169, 233, 0.2);
                    color: #4AA9E9;
                    font-size: 1.25rem;
                    cursor: pointer;
                    border-radius: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 5px rgba(74, 169, 233, 0.1);
                }

                .admin-menu-btn:active {
                    background: #f0f7ff;
                    transform: scale(0.95);
                }

                .admin-mobile-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1a3a4a;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .admin-mobile-lang {
                    transform: scale(0.9);
                    transform-origin: right center;
                }

                /* Overlay */
                .admin-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(26, 58, 74, 0.4);
                    backdrop-filter: blur(2px);
                    z-index: 99;
                }

                /* Sidebar */
                .admin-sidebar {
                    width: 280px;
                    height: 100vh;
                    position: fixed;
                    left: 0;
                    top: 0;
                    background: white;
                    border-right: 1px solid rgba(74, 169, 233, 0.15);
                    padding: 2rem 1.5rem;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 4px 0 24px rgba(74, 169, 233, 0.08);
                }

                .admin-sidebar-header {
                    margin-bottom: 2rem;
                }

                .admin-sidebar-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1a3a4a;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .admin-logo {
                    font-size: 1.75rem;
                }

                .admin-sidebar-lang {
                    margin-bottom: 2rem;
                }

                .admin-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    flex: 1;
                }

                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.85rem 1.25rem;
                    border-radius: 14px;
                    text-decoration: none;
                    color: #6b8a9a;
                    background: transparent;
                    border: 1px solid transparent;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .admin-nav-item:hover {
                    color: #4AA9E9;
                    background: #F0F7FF;
                }

                .admin-nav-item.active {
                    color: white;
                    background: linear-gradient(135deg, #4AA9E9, #5BC0DE);
                    border-color: transparent;
                    box-shadow: 0 4px 12px rgba(74, 169, 233, 0.3);
                    font-weight: 600;
                }

                .nav-icon {
                    font-size: 1.25rem;
                }

                .admin-sidebar-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(74, 169, 233, 0.15);
                }

                .admin-footer-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    text-decoration: none;
                    color: #6b8a9a;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .admin-footer-link:hover {
                    color: #4AA9E9;
                    background: #F0F7FF;
                }

                .admin-logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    color: #E94A4A;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .admin-logout-btn:hover {
                    background: #FFF0F0;
                }

                /* Main Content */
                .admin-main {
                    margin-left: 280px;
                    padding: 2.5rem;
                    position: relative;
                    min-height: 100vh;
                }

                .admin-content {
                    position: relative;
                    z-index: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .admin-mobile-header {
                        display: flex;
                    }

                    .admin-overlay {
                        display: block;
                    }

                    .admin-sidebar {
                        transform: translateX(-100%);
                        width: 280px;
                        padding-top: 1.5rem;
                    }

                    .admin-sidebar.open {
                        transform: translateX(0);
                    }

                    .admin-main {
                        margin-left: 0;
                        padding: 1rem;
                        padding-top: calc(60px + 1rem);
                    }
                }

                @media (max-width: 480px) {
                    .admin-sidebar {
                        width: 85%;
                        max-width: 300px;
                    }

                    .admin-main {
                        padding: 0.75rem;
                        padding-top: calc(60px + 0.75rem);
                    }
                }
            `}</style>
        </div>
    );
}
