'use client';

import React, { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatClaimStatus, formatFileType, CLAIM_STATUSES } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t } = useLanguage();
    const [claim, setClaim] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');

    // AI Agent State
    const [aiSuggestion, setAiSuggestion] = useState<{ status: string; rationale: string; confidence: 'high' | 'low' } | null>(null);

    useEffect(() => {
        fetchClaim();
    }, [id]);

    const fetchClaim = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/claims/${id}`);
            const data = await res.json();
            if (data.error) {
                setClaim(null);
                setLoading(false);
                return;
            }
            setClaim(data);
            setNewStatus(data.status);

            // Run AI Analysis via API
            analyzeWithAI();
        } catch (error) {
            console.error('Fetch claim error:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzeWithAI = async () => {
        try {
            const res = await fetch(`/api/admin/claims/${id}/ai-analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang: localStorage.getItem('language') || 'th' }),
            });
            const suggestion = await res.json();
            setAiSuggestion(suggestion);
        } catch (error) {
            console.error('AI Analysis error:', error);
        }
    };

    const handleApplySuggestion = () => {
        if (!aiSuggestion) return;
        setNewStatus(aiSuggestion.status);
        setNote(aiSuggestion.rationale);
    };

    const handleUpdateStatus = async () => {
        if (!newStatus) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/claims/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, note }),
            });
            if (res.ok) {
                await fetchClaim();
                setNote('');
                // alert('Status updated successfully');
            }
        } catch (error) {
            console.error('Update status error:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <AdminLayout><div className="spinner" style={{ margin: '10rem auto' }}></div></AdminLayout>;
    if (!claim) return <AdminLayout><div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(200, 200, 240, 0.5)' }}>{t.claimNotFound}</div></AdminLayout>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return '#7c5cff';
            case 'APPROVED': return '#00d4aa';
            case 'REJECTED': return '#ff6b6b';
            case 'NEED_MORE_INFO': return '#ffb347';
            case 'COMPLETED': return '#00d9a5';
            case 'RECEIVED': return '#7c5cff';
            case 'IN_REPAIR': return '#00d4aa';
            case 'SHIPPED': return '#00d9a5';
            case 'CANCELLED': return '#ff6b6b';
            default: return 'rgba(200, 200, 240, 0.5)';
        }
    };

    return (
        <AdminLayout>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => window.location.href = '/admin'}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', minHeight: 'auto', fontSize: '0.9rem' }}
                        >
                            ← {t.back}
                        </button>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.claimId} {claim.claimId}</h2>
                    </div>
                    <p style={{ color: 'rgba(200, 200, 240, 0.6)' }}>{t.submittedOn} {new Date(claim.createdAt).toLocaleString()}</p>
                </div>

                <div style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '100px',
                    background: `${getStatusColor(claim.status)}15`,
                    color: getStatusColor(claim.status),
                    fontWeight: 700,
                    border: `1px solid ${getStatusColor(claim.status)}30`,
                }}>
                    {formatClaimStatus(claim.status, t)}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="space-y-6">
                    {/* Product & Customer Info */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.productCustomerInfo}</h3>
                        <div className="form-grid">
                            <div className="warranty-item">
                                <span className="item-label">{t.selectBrand}</span>
                                <span className="item-value">{claim.brand}</span>
                            </div>
                            <div className="warranty-item">
                                <span className="item-label">{t.selectModel}</span>
                                <span className="item-value">{claim.modelName}</span>
                            </div>
                            <div className="warranty-item">
                                <span className="item-label">{t.customerFirstName} {t.customerLastName}</span>
                                <span className="item-value">{claim.customerFirstName} {claim.customerLastName}</span>
                            </div>
                            <div className="warranty-item">
                                <span className="item-label">{t.serialNumber}</span>
                                <span className="item-value">{claim.serialNumber}</span>
                            </div>
                            <div className="warranty-item">
                                <span className="item-label">{t.phone} / {t.email}</span>
                                <span className="item-value">{claim.phone}<br />{claim.email || '-'}</span>
                            </div>
                            <div className="warranty-item">
                                <span className="item-label">{t.purchaseChannel} / {t.orderNo}</span>
                                <span className="item-value">{claim.purchaseChannel || '-'}<br />{claim.orderNo || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Issue Details */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.issueDetails}</h3>
                        <div className="warranty-item full-width">
                            <span className="item-label">{t.issueDescription}</span>
                            <p className="item-value pre-wrap" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{claim.issueDescription}</p>
                        </div>

                        {claim.attachments && claim.attachments.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <span className="item-label">{t.requiredDocs}</span>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                                    {claim.attachments.map((file: any) => (
                                        <a
                                            key={file.id}
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-card"
                                            style={{ padding: '1rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatFileType(file.type, t)}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(200,200,240,0.5)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.fileName}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Status History */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.statusHistory}</h3>
                        <div className="space-y-6">
                            {(claim.statusHistory || []).map((history: any, index: number) => (
                                <div key={history.id} style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    position: 'relative',
                                    paddingLeft: '1.5rem',
                                }}>
                                    {/* Timeline line */}
                                    {index < claim.statusHistory.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '4px',
                                            top: '24px',
                                            bottom: '-24px',
                                            width: '2px',
                                            background: 'rgba(100, 100, 180, 0.2)',
                                        }} />
                                    )}
                                    {/* Bullet */}
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: index === 0 ? '#7c5cff' : 'rgba(100, 100, 180, 0.5)',
                                        marginTop: '8px',
                                        zIndex: 1,
                                    }} />

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700 }}>{formatClaimStatus(history.newStatus, t)}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'rgba(200, 200, 240, 0.5)' }}>{new Date(history.changedAt).toLocaleString()}</span>
                                            {history.changedBy && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.1rem 0.4rem',
                                                    borderRadius: '4px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'rgba(200, 200, 240, 0.6)'
                                                }}>
                                                    {t.by} {history.changedBy === 'Admin' ? t.adminPanel.split(' ')[0] : history.changedBy}
                                                </span>
                                            )}
                                        </div>
                                        {history.note && <p style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.7)', whiteSpace: 'pre-wrap' }}>{history.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Action Sidebar */}
                <aside style={{ position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    {/* AI Suggestion Agent */}
                    <section className="glass-card" style={{ marginBottom: '1.5rem', border: '1px solid rgba(0, 212, 170, 0.3)', background: 'rgba(0, 212, 170, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="section-title" style={{ fontSize: '1.1rem', color: '#00d4aa', marginBottom: 0 }}>{t.aiAgentTitle}</h3>
                            {aiSuggestion && (
                                <button
                                    onClick={handleApplySuggestion}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '6px',
                                        background: 'rgba(0, 212, 170, 0.15)',
                                        color: '#00d4aa',
                                        border: '1px solid rgba(0, 212, 170, 0.3)',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {t.applySuggestion}
                                </button>
                            )}
                        </div>

                        {aiSuggestion ? (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'rgba(200, 200, 240, 0.6)', fontSize: '0.9rem' }}>{t.aiSuggestion}</span>
                                    <span style={{
                                        fontWeight: 700,
                                        color: getStatusColor(aiSuggestion.status),
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        background: `${getStatusColor(aiSuggestion.status)}20`,
                                        fontSize: '0.9rem'
                                    }}>
                                        {formatClaimStatus(aiSuggestion.status as any, t)}
                                    </span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(200, 200, 240, 0.8)', marginBottom: '0.25rem' }}>{t.aiRationale}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(200, 200, 240, 0.6)', lineHeight: '1.4' }}>{aiSuggestion.rationale}</p>
                                </div>
                                {aiSuggestion.confidence === 'low' && (
                                    <p style={{ fontSize: '0.75rem', color: '#ffb347', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        ⚠️ {t.aiLowConfidence}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(200, 200, 240, 0.5)' }}>{t.aiAnalyzing}</p>
                            </div>
                        )}
                    </section>

                    <section className="glass-card">
                        <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>{t.updateStatus}</h3>

                        <div className="form-group">
                            <label className="form-label">{t.newStatus}</label>
                            <select
                                className="form-select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {CLAIM_STATUSES.map(s => (
                                    <option key={s} value={s}>{formatClaimStatus(s, t)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.internalNote}</label>
                            <textarea
                                className="form-textarea"
                                placeholder={t.internalNotePlaceholder}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                style={{ minHeight: '100px' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={updating || newStatus === claim.status}
                            onClick={handleUpdateStatus}
                        >
                            {updating ? <div className="spinner" /> : t.updateClaimStatus}
                        </button>
                    </section>

                    <section className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(255, 107, 107, 0.05)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                        <h3 className="section-title" style={{ fontSize: '1rem', color: '#ff6b6b' }}>{t.dangerZone}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 107, 107, 0.7)', marginBottom: '1rem' }}>{t.deleteClaimNote}</p>
                        <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'rgba(255, 107, 107, 0.4)', color: '#ff6b6b' }}>
                            {t.deleteClaim}
                        </button>
                    </section>
                </aside>
            </div>
        </AdminLayout>
    );
}
