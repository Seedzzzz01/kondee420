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
            case 'ADDITIONAL_INFO': return '#ffb347';
            case 'APPROVED': return '#00d4aa';
            case 'RECEIVED': return '#7c5cff';
            case 'PROCESSING': return '#7c5cff';
            case 'IN_REPAIR': return '#00d4aa';
            case 'COMPLETED': return '#00d9a5';
            case 'REJECTED': return '#ff6b6b';
            case 'CANCELLED': return '#ff6b6b';
            default: return 'rgba(200, 200, 240, 0.5)';
        }
    };

    return (
        <AdminLayout>
            <header className="admin-header">
                <div className="admin-header-top">
                    <div className="admin-header-text">
                        <h2 className="admin-page-title">{t.claimsOverview}</h2>
                        <p className="admin-page-subtitle">{t.claimsOverviewSubtitle}</p>
                    </div>
                </div>

                <div className="admin-filters">
                    <form onSubmit={handleSearch} className="admin-search-form">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-input admin-search-input"
                        />
                        <button type="submit" className="btn btn-primary admin-search-btn">
                            {t.searchButton}
                        </button>
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select admin-status-select"
                    >
                        <option value="">{t.allStatuses}</option>
                        <option value="NEW">{t.statusNEW}</option>
                        <option value="ADDITIONAL_INFO">{t.statusADDITIONAL_INFO}</option>
                        <option value="APPROVED">{t.statusAPPROVED}</option>
                        <option value="RECEIVED">{t.statusRECEIVED}</option>
                        <option value="IN_REPAIR">{t.statusIN_REPAIR}</option>
                        <option value="PROCESSING">{t.statusPROCESSING}</option>
                        <option value="COMPLETED">{t.statusCOMPLETED}</option>
                        <option value="REJECTED">{t.statusREJECTED}</option>
                        <option value="CANCELLED">{t.statusCANCELLED}</option>
                    </select>
                </div>

                {/* Stats Summary Cards */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card" style={{ borderLeftColor: '#7c5cff' }}>
                        <div className="stat-header">
                            <span className="stat-label">{t.totalClaims}</span>
                            <span className="stat-icon">📋</span>
                        </div>
                        <div className="stat-value">{stats?.totalClaims || 0}</div>
                    </div>

                    <div className="admin-stat-card" style={{ borderLeftColor: '#ffb347' }}>
                        <div className="stat-header">
                            <span className="stat-label">{t.pendingClaims}</span>
                            <span className="stat-icon">⏳</span>
                        </div>
                        <div className="stat-value">
                            {stats?.statusCounts?.find((s: any) => s.status === 'NEW')?.count || 0}
                        </div>
                    </div>

                    <div className="admin-stat-card" style={{ borderLeftColor: '#00d4aa' }}>
                        <div className="stat-header">
                            <span className="stat-label">{t.activeRepairs}</span>
                            <span className="stat-icon">🔧</span>
                        </div>
                        <div className="stat-value">
                            {stats?.statusCounts?.find((s: any) => s.status === 'IN_REPAIR')?.count || 0}
                        </div>
                    </div>

                    <div className="admin-stat-card" style={{ borderLeftColor: '#7c5cff' }}>
                        <div className="stat-header">
                            <span className="stat-label">{t.statusPROCESSING}</span>
                            <span className="stat-icon">🛠️</span>
                        </div>
                        <div className="stat-value">
                            {stats?.statusCounts?.find((s: any) => s.status === 'PROCESSING')?.count || 0}
                        </div>
                    </div>

                    <div className="admin-stat-card" style={{ borderLeftColor: '#00d9a5' }}>
                        <div className="stat-header">
                            <span className="stat-label">{t.completedCases}</span>
                            <span className="stat-icon">✅</span>
                        </div>
                        <div className="stat-value">
                            {stats?.statusCounts?.find((s: any) => s.status === 'COMPLETED')?.count || 0}
                        </div>
                    </div>
                </div>
            </header>

            <div className="admin-section-header">
                <h3 className="admin-section-title">{t.recentActivity}</h3>
            </div>

            {/* Mobile Card View */}
            <div className="admin-claims-mobile">
                {loading ? (
                    <div className="admin-loading">
                        <div className="spinner"></div>
                        <p>{t.loading}</p>
                    </div>
                ) : !Array.isArray(claims) || claims.length === 0 ? (
                    <div className="admin-empty">
                        <div className="empty-icon">🔍</div>
                        <p>{typeof claims === 'object' && (claims as any).error ? (claims as any).error : t.noClaimsFound}</p>
                    </div>
                ) : (
                    claims.map((claim) => (
                        <div key={claim.id} className="admin-claim-card" onClick={() => window.location.href = `/admin/claims/${claim.id}`}>
                            <div className="claim-card-header">
                                <span className="claim-card-id">{claim.claimId}</span>
                                <span
                                    className="claim-card-status"
                                    style={{
                                        background: `${getStatusColor(claim.status)}15`,
                                        color: getStatusColor(claim.status),
                                        borderColor: `${getStatusColor(claim.status)}30`,
                                    }}
                                >
                                    {formatClaimStatus(claim.status, t)}
                                </span>
                            </div>
                            <div className="claim-card-body">
                                <div className="claim-card-customer">
                                    {claim.customerFirstName} {claim.customerLastName}
                                </div>
                                <div className="claim-card-model">{claim.modelName}</div>
                                <div className="claim-card-serial">S/N: {claim.serialNumber}</div>
                            </div>
                            <div className="claim-card-footer">
                                <span className="claim-card-date">
                                    {new Date(claim.createdAt).toLocaleDateString()}
                                </span>
                                <span className="claim-card-arrow">→</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t.tableClaimId}</th>
                            <th>{t.tableCustomer}</th>
                            <th>{t.tableModel}</th>
                            <th>{t.tableDate}</th>
                            <th>{t.tableStatus}</th>
                            <th>{t.tableAction}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="table-loading">
                                    <div className="spinner"></div>
                                    <p>{t.loading}</p>
                                </td>
                            </tr>
                        ) : !Array.isArray(claims) || claims.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="table-empty">
                                    <div className="empty-icon">🔍</div>
                                    <p>{typeof claims === 'object' && (claims as any).error ? (claims as any).error : t.noClaimsFound}</p>
                                </td>
                            </tr>
                        ) : (
                            claims.map((claim) => (
                                <tr key={claim.id} className="table-row-hover">
                                    <td className="td-claim-id">{claim.claimId}</td>
                                    <td>
                                        <div className="td-customer-name">{claim.customerFirstName} {claim.customerLastName}</div>
                                        <div className="td-customer-contact">{claim.customerEmail || claim.phone}</div>
                                    </td>
                                    <td>
                                        <div className="td-model-name">{claim.modelName}</div>
                                        <div className="td-serial">S/N: {claim.serialNumber}</div>
                                    </td>
                                    <td className="td-date">
                                        {new Date(claim.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background: `${getStatusColor(claim.status)}15`,
                                                color: getStatusColor(claim.status),
                                                borderColor: `${getStatusColor(claim.status)}30`,
                                            }}
                                        >
                                            {formatClaimStatus(claim.status, t)}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-view"
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
                .admin-header {
                    margin-bottom: 2rem;
                }

                .admin-header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 1.5rem;
                }

                .admin-page-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.35rem;
                    color: #1a3a4a;
                }

                .admin-page-subtitle {
                    color: #6b8a9a;
                    font-size: 0.9rem;
                }

                .admin-filters {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-bottom: 1.5rem;
                }

                .admin-search-form {
                    display: flex;
                    gap: 0.5rem;
                    flex: 1;
                    min-width: 200px;
                }

                .admin-search-input {
                    flex: 1;
                    max-width: 300px;
                    height: 48px;
                    background: white;
                    border: 1px solid rgba(74, 169, 233, 0.2);
                    border-radius: 12px;
                    color: #1a3a4a;
                    padding: 0 1rem;
                }

                .admin-search-input:focus {
                    border-color: #4AA9E9;
                    box-shadow: 0 0 0 3px rgba(74, 169, 233, 0.1);
                    outline: none;
                }

                .admin-search-btn {
                    padding: 0 1.5rem;
                    min-height: 48px;
                    background: linear-gradient(135deg, #4AA9E9, #5BC0DE);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(74, 169, 233, 0.3);
                }

                .admin-status-select {
                    width: 180px;
                    height: 48px;
                    background: white;
                    border: 1px solid rgba(74, 169, 233, 0.2);
                    border-radius: 12px;
                    color: #1a3a4a;
                    padding: 0 1rem;
                }

                /* Stats Grid - Light UI */
                .admin-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .admin-stat-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid rgba(74, 169, 233, 0.15);
                    padding: 1.25rem;
                    border-left: 4px solid;
                    box-shadow: 0 4px 20px rgba(74, 169, 233, 0.08);
                    transition: transform 0.2s ease;
                }

                .admin-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(74, 169, 233, 0.12);
                }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #6b8a9a;
                    font-weight: 600;
                }

                .stat-icon {
                    font-size: 1.25rem;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1a3a4a;
                }

                /* Section Header */
                .admin-section-header {
                    margin-bottom: 1rem;
                }

                .admin-section-title {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: #1a3a4a;
                }

                /* Mobile Card View */
                .admin-claims-mobile {
                    display: none;
                }

                .admin-claim-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid rgba(74, 169, 233, 0.15);
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(74, 169, 233, 0.05);
                }

                .admin-claim-card:active {
                    transform: scale(0.98);
                    background: #F0F7FF;
                }

                .claim-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .claim-card-id {
                    font-weight: 700;
                    color: #4AA9E9;
                    font-size: 0.9rem;
                }

                .claim-card-status {
                    padding: 0.3rem 0.65rem;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border: 1px solid;
                }

                .claim-card-body {
                    margin-bottom: 0.75rem;
                }

                .claim-card-customer {
                    font-weight: 600;
                    color: #1a3a4a;
                    margin-bottom: 0.25rem;
                }

                .claim-card-model {
                    color: #6b8a9a;
                    font-size: 0.9rem;
                }

                .claim-card-serial {
                    color: #9cb8c8;
                    font-size: 0.75rem;
                }

                .claim-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.75rem;
                    border-top: 1px solid rgba(74, 169, 233, 0.1);
                }

                .claim-card-date {
                    color: #9cb8c8;
                    font-size: 0.8rem;
                }

                .claim-card-arrow {
                    color: #4AA9E9;
                    font-size: 1.25rem;
                }

                .admin-loading,
                .admin-empty {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #6b8a9a;
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                /* Desktop Table View - Light UI */
                .admin-table-wrapper {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid rgba(74, 169, 233, 0.15);
                    box-shadow: 0 4px 20px rgba(74, 169, 233, 0.08);
                    overflow: hidden;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .admin-table thead tr {
                    background: #F0F7FF;
                    border-bottom: 1px solid rgba(74, 169, 233, 0.15);
                }

                .admin-table th {
                    padding: 1.25rem 1.5rem;
                    font-weight: 600;
                    color: #4AA9E9;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .admin-table td {
                    padding: 1.25rem 1.5rem;
                    color: #1a3a4a;
                }

                .table-row-hover {
                    border-bottom: 1px solid rgba(74, 169, 233, 0.1);
                    transition: background 0.2s;
                }

                .table-row-hover:hover {
                    background: #F8FBFF;
                }

                .td-claim-id {
                    font-weight: 700;
                    color: #4AA9E9;
                }

                .td-customer-name {
                    font-weight: 600;
                    color: #1a3a4a;
                }

                .td-customer-contact {
                    font-size: 0.85rem;
                    color: #6b8a9a;
                }

                .td-model-name {
                    font-weight: 500;
                    color: #1a3a4a;
                }

                .td-serial {
                    font-size: 0.75rem;
                    color: #9cb8c8;
                }

                .td-date {
                    color: #6b8a9a;
                }

                .status-badge {
                    padding: 0.4rem 0.85rem;
                    border-radius: 100px;
                    font-size: 0.825rem;
                    font-weight: 600;
                    border: 1px solid;
                    display: inline-block;
                    text-align: center;
                    min-width: 100px;
                }

                .btn-view {
                    padding: 0.5rem 1.25rem;
                    font-size: 0.85rem;
                    min-height: auto;
                    background: white;
                    border: 1px solid rgba(74, 169, 233, 0.3);
                    color: #4AA9E9;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .btn-view:hover {
                    background: #4AA9E9;
                    color: white;
                    border-color: #4AA9E9;
                }

                .table-loading,
                .table-empty {
                    padding: 6rem;
                    text-align: center;
                    color: #6b8a9a;
                }

                /* Mobile Responsive */
                @media (max-width: 1024px) {
                    .admin-stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .admin-page-title {
                        font-size: 1.35rem;
                    }

                    .admin-filters {
                        flex-direction: column;
                    }

                    .admin-search-form {
                        width: 100%;
                    }

                    .admin-search-input {
                        max-width: none;
                    }

                    .admin-status-select {
                        width: 100%;
                    }

                    .admin-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .admin-stat-card:last-child {
                        grid-column: span 2;
                    }

                    /* Show mobile cards, hide table */
                    .admin-claims-mobile {
                        display: block;
                    }

                    .admin-table-wrapper {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .admin-page-title {
                        font-size: 1.15rem;
                    }

                    .admin-page-subtitle {
                        font-size: 0.8rem;
                    }

                    .admin-stats-grid {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }

                    .admin-stat-card:last-child {
                        grid-column: span 1;
                    }

                    .admin-stat-card {
                        padding: 1rem;
                    }

                    .stat-value {
                        font-size: 1.25rem;
                    }

                    .admin-claim-card {
                        padding: 0.875rem;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
