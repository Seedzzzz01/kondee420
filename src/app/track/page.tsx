'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { formatClaimStatus } from '@/lib/types';
import Link from 'next/link';

export default function TrackPage() {
    const { t } = useLanguage();
    const [claimId, setClaimId] = useState('');
    const [loading, setLoading] = useState(false);
    const [claim, setClaim] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!claimId.trim()) return;

        setLoading(true);
        setError('');
        setClaim(null);

        try {
            const res = await fetch(`/api/track/${claimId.toUpperCase()}`);
            const data = await res.json();

            if (res.ok) {
                setClaim(data);
            } else {
                setError(data.error || 'Claim not found');
            }
        } catch (err) {
            console.error('Track error:', err);
            setError('Failed to fetch status');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return '#7c5cff';
            case 'APPROVED': return '#00d4aa';
            case 'REJECTED': return '#ff6b6b';
            case 'ADDITIONAL_INFO': return '#ffb347';
            case 'PROCESSING': return '#7c5cff';
            case 'COMPLETED': return '#00d9a5';
            case 'RECEIVED': return '#7c5cff';
            case 'IN_REPAIR': return '#00d4aa';
            case 'SHIPPED': return '#00d9a5';
            case 'CANCELLED': return '#ff6b6b';
            default: return 'rgba(200, 200, 240, 0.5)';
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0a0a1a] text-white py-12 px-4">
            <div className="animated-bg" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <LanguageToggle />

            <div className="container relative z-10">
                <header className="header text-center mb-12">
                    <h1 className="header-title text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                        {t.trackStatus}
                    </h1>
                    <p className="header-subtitle text-lg text-blue-200/60 max-w-2xl mx-auto">
                        {t.enterClaimId}
                    </p>
                </header>

                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <form
                        onSubmit={handleSearch}
                        className="glass-card mb-8 p-6 transform transition-all hover:scale-[1.01]"
                        style={{ border: '1px solid rgba(124, 92, 255, 0.2)' }}
                    >
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={claimId}
                                    onChange={(e) => setClaimId(e.target.value)}
                                    placeholder="CLM-XXXXXX"
                                    className="form-input w-full"
                                    style={{
                                        textTransform: 'uppercase',
                                        fontSize: '1.1rem',
                                        letterSpacing: '0.05em'
                                    }}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                    🔍
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    padding: '0 2.5rem',
                                    boxShadow: '0 8px 20px -6px rgba(124, 92, 255, 0.4)'
                                }}
                            >
                                {loading ? <div className="spinner" /> : t.search}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}
                    </form>

                    {claim && (
                        <div className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2.5rem',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                paddingBottom: '2rem'
                            }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                                        {claim.brand} {claim.modelName}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <p style={{ color: 'rgba(200, 200, 240, 0.4)', fontSize: '0.9rem' }}>
                                            ID: <span style={{ color: '#7c5cff', fontWeight: 600 }}>{claim.claimId}</span>
                                        </p>
                                        <p style={{ color: 'rgba(200, 200, 240, 0.4)', fontSize: '0.9rem' }}>
                                            {new Date(claim.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '100px',
                                    background: `${getStatusColor(claim.status)}15`,
                                    color: getStatusColor(claim.status),
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    border: `1px solid ${getStatusColor(claim.status)}40`,
                                    boxShadow: `0 0 15px ${getStatusColor(claim.status)}15`,
                                    textTransform: 'uppercase'
                                }}>
                                    {formatClaimStatus(claim.status, t)}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                    {t.statusTimeline}
                                </h3>

                                <div className="space-y-0 relative">
                                    {(claim.statusHistory || []).map((history: any, index: number) => (
                                        <div key={index} className="flex gap-6 relative pb-10 group">
                                            {/* Timeline line */}
                                            {index < claim.statusHistory.length - 1 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '9px',
                                                    top: '24px',
                                                    bottom: 0,
                                                    width: '2px',
                                                    background: 'linear-gradient(to bottom, rgba(124, 92, 255, 0.3), rgba(124, 92, 255, 0.05))',
                                                }} />
                                            )}

                                            {/* Bullet */}
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: index === 0 ? getStatusColor(history.newStatus) : 'rgba(40, 40, 80, 0.8)',
                                                border: `4px solid ${index === 0 ? '#fff' : 'rgba(100, 100, 180, 0.3)'}`,
                                                marginTop: '4px',
                                                zIndex: 1,
                                                boxShadow: index === 0 ? `0 0 20px ${getStatusColor(history.newStatus)}60` : 'none',
                                                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }} className="group-hover:scale-125" />

                                            <div style={{
                                                flex: 1,
                                                background: index === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                                                padding: index === 0 ? '1.25rem' : '0 0.5rem',
                                                borderRadius: '16px',
                                                border: index === 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        fontSize: index === 0 ? '1.1rem' : '1rem',
                                                        color: index === 0 ? '#fff' : 'rgba(255, 255, 255, 0.7)'
                                                    }}>
                                                        {formatClaimStatus(history.newStatus, t)}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(200, 200, 240, 0.4)' }}>
                                                        {new Date(history.changedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {history.note && (
                                                    <p style={{
                                                        fontSize: '0.95rem',
                                                        color: 'rgba(200, 200, 240, 0.6)',
                                                        whiteSpace: 'pre-wrap',
                                                        lineHeight: 1.6
                                                    }}>
                                                        {history.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer style={{ marginTop: '5rem', padding: '2rem 0', textAlign: 'center' }}>
                    <Link href="/">
                        <button
                            className="btn btn-secondary"
                            style={{
                                minHeight: 'auto',
                                padding: '0.8rem 2rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(5px)',
                                fontSize: '0.95rem',
                                fontWeight: 600
                            }}
                        >
                            🏠 {t.backToPortal || 'Back to Home'}
                        </button>
                    </Link>
                </footer>
            </div>
        </main>
    );
}
