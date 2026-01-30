'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatClaimStatus } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [claims, setClaims] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchClaims();
        fetchStats();
    }, [statusFilter]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            let url = '/api/admin/claims';
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);

            const res = await fetch(`${url}?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setClaims(data);
            } else {
                console.error('Claims data is not an array:', data);
                setClaims([]);
            }
        } catch (error) {
            console.error('Fetch claims error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchClaims();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return '#7c5cff';
            case 'NEED_MORE_INFO': return '#ffb347';
            case 'APPROVED': return '#00d4aa';
            case 'RECEIVED': return '#7c5cff';
            case 'IN_REPAIR': return '#00d4aa';
            case 'COMPLETED': return '#00d9a5';
            case 'REJECTED': return '#ff6b6b';
            case 'CANCELLED': return '#ff6b6b';
            default: return 'rgba(200, 200, 240, 0.5)';
        }
    };

    return (
        <AdminLayout>
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.claimsOverview}</h2>
                        <p style={{ color: 'rgba(200, 200, 240, 0.6)' }}>{t.claimsOverviewSubtitle}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-input"
                                style={{ width: '300px', height: '48px' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', minHeight: '48px' }}>
                                {t.searchButton}
                            </button>
                        </form>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-select"
                            style={{ width: '180px', height: '48px' }}
                        >
                            <option value="">{t.allStatuses}</option>
                            <option value="NEW">{t.statusNEW}</option>
                            <option value="NEED_MORE_INFO">{t.statusNEED_MORE_INFO}</option>
                            <option value="APPROVED">{t.statusAPPROVED}</option>
                            <option value="RECEIVED">{t.statusRECEIVED}</option>
                            <option value="IN_REPAIR">{t.statusIN_REPAIR}</option>
                            <option value="COMPLETED">{t.statusCOMPLETED}</option>
                            <option value="REJECTED">{t.statusREJECTED}</option>
                            <option value="CANCELLED">{t.statusCANCELLED}</option>
                        </select>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c5cff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.6)' }}>{t.totalClaims}</span>
                            <span style={{ fontSize: '1.5rem' }}>📋</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats?.totalClaims || 0}</div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ffb347' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.6)' }}>{t.pendingClaims}</span>
                            <span style={{ fontSize: '1.5rem' }}>⏳</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {stats?.statusCounts?.find((s: any) => s.status === 'NEW')?.count || 0}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #00d4aa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.6)' }}>{t.activeRepairs}</span>
                            <span style={{ fontSize: '1.5rem' }}>🔧</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {stats?.statusCounts?.find((s: any) => s.status === 'IN_REPAIR')?.count || 0}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #00d9a5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.6)' }}>{t.completedCases}</span>
                            <span style={{ fontSize: '1.5rem' }}>✅</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {stats?.statusCounts?.find((s: any) => s.status === 'COMPLETED')?.count || 0}
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.9)' }}>{t.recentActivity}</h3>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(100, 100, 180, 0.2)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(40, 40, 80, 0.6)', borderBottom: '1px solid rgba(100, 100, 180, 0.2)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableClaimId}</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableCustomer}</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableModel}</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableDate}</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableStatus}</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tableAction}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '6rem', textAlign: 'center' }}>
                                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                                    <p style={{ marginTop: '1rem', color: 'rgba(200, 200, 240, 0.5)' }}>{t.loading}</p>
                                </td>
                            </tr>
                        ) : !Array.isArray(claims) || claims.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '6rem', textAlign: 'center', color: 'rgba(200, 200, 240, 0.5)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🔍</div>
                                    {typeof claims === 'object' && (claims as any).error ? (claims as any).error : t.noClaimsFound}
                                </td>
                            </tr>
                        ) : (
                            claims.map((claim) => (
                                <tr key={claim.id} style={{ borderBottom: '1px solid rgba(100, 100, 180, 0.1)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#00d4aa' }}>{claim.claimId}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{claim.customerFirstName} {claim.customerLastName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgba(200, 200, 240, 0.6)' }}>{claim.customerEmail || claim.phone}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>{claim.modelName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(200, 200, 240, 0.5)' }}>S/N: {claim.serialNumber}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'rgba(200, 200, 240, 0.7)' }}>
                                        {new Date(claim.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '100px',
                                            fontSize: '0.825rem',
                                            fontWeight: 600,
                                            background: `${getStatusColor(claim.status)}15`,
                                            color: getStatusColor(claim.status),
                                            border: `1px solid ${getStatusColor(claim.status)}30`,
                                            display: 'inline-block',
                                            textAlign: 'center',
                                            minWidth: '100px'
                                        }}>
                                            {formatClaimStatus(claim.status, t)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{
                                                padding: '0.5rem 1.25rem',
                                                fontSize: '0.85rem',
                                                minHeight: 'auto',
                                                background: 'rgba(100, 100, 180, 0.1)',
                                                border: '1px solid rgba(100, 100, 180, 0.2)'
                                            }}
                                            onClick={() => window.location.href = `/admin/claims/${claim.id}`}
                                        >
                                            {t.viewDetails}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .table-row-hover:hover {
                    background: rgba(255, 255, 255, 0.04);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </AdminLayout>
    );
}
