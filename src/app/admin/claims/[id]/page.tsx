'use client';

import React, { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatClaimStatus, formatFileType, CLAIM_STATUSES } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t, language } = useLanguage();
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
                body: JSON.stringify({ lang: language }),
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
        <AdminLayout>
            <header className="claim-header">
                <div className="claim-header-top">
                    <button
                        onClick={() => window.location.href = '/admin'}
                        className="btn btn-secondary claim-back-btn"
                    >
                        ← {t.back}
                    </button>
                    <span
                        className="claim-status-badge"
                        style={{
                            background: `${getStatusColor(claim.status)}15`,
                            color: getStatusColor(claim.status),
                            borderColor: `${getStatusColor(claim.status)}30`,
                        }}
                    >
                        {formatClaimStatus(claim.status, t)}
                    </span>
                </div>
                <h2 className="claim-title">{t.claimId} {claim.claimId}</h2>
                <p className="claim-submitted">{t.submittedOn} {new Date(claim.createdAt).toLocaleString()}</p>
            </header>

            <div className="claim-layout">
                <div className="claim-main space-y-6">
                    {/* Product & Customer Info */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.productCustomerInfo}</h3>
                        <div className="claim-info-grid">
                            <div className="claim-info-item">
                                <span className="item-label">{t.selectBrand}</span>
                                <span className="item-value">{claim.brand}</span>
                            </div>
                            <div className="claim-info-item">
                                <span className="item-label">{t.selectModel}</span>
                                <span className="item-value">{claim.modelName}</span>
                            </div>
                            <div className="claim-info-item">
                                <span className="item-label">{t.customerFirstName} {t.customerLastName}</span>
                                <span className="item-value">{claim.customerFirstName} {claim.customerLastName}</span>
                            </div>
                            <div className="claim-info-item">
                                <span className="item-label">{t.serialNumber}</span>
                                <span className="item-value">{claim.serialNumber}</span>
                            </div>
                            <div className="claim-info-item">
                                <span className="item-label">{t.phone}</span>
                                <span className="item-value">{claim.phone}</span>
                            </div>
                            <div className="claim-info-item">
                                <span className="item-label">{t.email}</span>
                                <span className="item-value">{claim.email || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Issue Details */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.issueDetails}</h3>
                        <div className="claim-info-item full-width">
                            <span className="item-label">{t.issueDescription}</span>
                            <p className="item-value pre-wrap">{claim.issueDescription}</p>
                        </div>

                        {claim.attachments && claim.attachments.length > 0 && (
                            <div className="claim-attachments">
                                <span className="item-label">{t.requiredDocs}</span>
                                <div className="attachments-grid">
                                    {claim.attachments.map((file: any) => (
                                        <a
                                            key={file.id}
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="attachment-card"
                                        >
                                            <span className="attachment-icon">📄</span>
                                            <span className="attachment-type">{formatFileType(file.type, t)}</span>
                                            <span className="attachment-name">{file.fileName}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Warranty Rules */}
                    {claim.warrantyModel && (
                        <section className="glass-card warranty-section">
                            <h3 className="section-title warranty-title">{t.warrantyDetails}</h3>
                            <div className="claim-info-grid">
                                <div className="claim-info-item full-width">
                                    <span className="item-label">{t.warrantyStart}</span>
                                    <span className="item-value">
                                        {language === 'th'
                                            ? claim.warrantyModel.warrantyStartRuleTh
                                            : (claim.warrantyModel.warrantyStartRuleEn || claim.warrantyModel.warrantyStartRuleTh)}
                                    </span>
                                </div>
                                {(claim.warrantyModel.coverageDetailTh || claim.warrantyModel.coverageDetailEn) && (
                                    <div className="claim-info-item full-width">
                                        <span className="item-label">{t.coverageDetails}</span>
                                        <p className="item-value pre-wrap">
                                            {language === 'th'
                                                ? claim.warrantyModel.coverageDetailTh
                                                : (claim.warrantyModel.coverageDetailEn || claim.warrantyModel.coverageDetailTh)}
                                        </p>
                                    </div>
                                )}
                                <div className="claim-info-item full-width">
                                    <span className="item-label">{t.requiredDocs}</span>
                                    <span className="item-value">
                                        {language === 'th'
                                            ? claim.warrantyModel.requiredDocsTh
                                            : (claim.warrantyModel.requiredDocsEn || claim.warrantyModel.requiredDocsTh)}
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Status History */}
                    <section className="glass-card">
                        <h3 className="section-title">{t.statusHistory}</h3>
                        <div className="status-timeline">
                            {(claim.statusHistory || []).map((history: any, index: number) => (
                                <div key={history.id} className="timeline-item">
                                    {index < claim.statusHistory.length - 1 && (
                                        <div className="timeline-line" />
                                    )}
                                    <div className={`timeline-dot ${index === 0 ? 'active' : ''}`} />
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <span className="timeline-status">{formatClaimStatus(history.newStatus, t)}</span>
                                            <span className="timeline-date">{new Date(history.changedAt).toLocaleString()}</span>
                                        </div>
                                        {history.changedBy && (
                                            <span className="timeline-by">
                                                {t.by} {history.changedBy === 'Admin' ? t.adminPanel.split(' ')[0] : history.changedBy}
                                            </span>
                                        )}
                                        {history.note && <p className="timeline-note">{history.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Action Sidebar */}
                <aside className="claim-sidebar">
                    {/* AI Suggestion Agent */}
                    <section className="glass-card ai-section">
                        <div className="ai-header">
                            <h3 className="section-title ai-title">{t.aiAgentTitle}</h3>
                            {aiSuggestion && (
                                <button onClick={handleApplySuggestion} className="ai-apply-btn">
                                    {t.applySuggestion}
                                </button>
                            )}
                        </div>

                        {aiSuggestion ? (
                            <div className="ai-content">
                                <div className="ai-suggestion-row">
                                    <span className="ai-label">{t.aiSuggestion}</span>
                                    <span
                                        className="ai-status"
                                        style={{
                                            color: getStatusColor(aiSuggestion.status),
                                            background: `${getStatusColor(aiSuggestion.status)}20`,
                                        }}
                                    >
                                        {formatClaimStatus(aiSuggestion.status as any, t)}
                                    </span>
                                </div>
                                <div className="ai-rationale-box">
                                    <p className="ai-rationale-label">{t.aiRationale}</p>
                                    <p className="ai-rationale-text">{aiSuggestion.rationale}</p>
                                </div>
                                {aiSuggestion.confidence === 'low' && (
                                    <p className="ai-warning">⚠️ {t.aiLowConfidence}</p>
                                )}
                            </div>
                        ) : (
                            <div className="ai-loading">
                                <div className="spinner small"></div>
                                <p>{t.aiAnalyzing}</p>
                            </div>
                        )}
                    </section>

                    <section className="glass-card">
                        <h3 className="section-title">{t.updateStatus}</h3>

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
                            />
                        </div>

                        <button
                            className="btn btn-primary update-btn"
                            disabled={updating || newStatus === claim.status}
                            onClick={handleUpdateStatus}
                        >
                            {updating ? <div className="spinner" /> : t.updateClaimStatus}
                        </button>
                    </section>

                    <section className="glass-card danger-section">
                        <h3 className="section-title danger-title">{t.dangerZone}</h3>
                        <p className="danger-text">{t.deleteClaimNote}</p>
                        <button className="btn btn-secondary danger-btn">
                            {t.deleteClaim}
                        </button>
                    </section>
                </aside>
            </div>

            <style jsx>{`
                .claim-header {
                    margin-bottom: 1.5rem;
                }

                .claim-header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .claim-back-btn {
                    padding: 0.4rem 0.8rem;
                    min-height: auto;
                    font-size: 0.9rem;
                }

                .claim-status-badge {
                    padding: 0.4rem 1rem;
                    border-radius: 100px;
                    font-weight: 700;
                    border: 1px solid;
                    font-size: 0.85rem;
                }

                .claim-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .claim-submitted {
                    color: rgba(200, 200, 240, 0.6);
                    font-size: 0.85rem;
                }

                .claim-layout {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }

                .claim-main {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .claim-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .claim-info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .claim-info-item.full-width {
                    grid-column: span 2;
                }

                .item-label {
                    font-size: 0.8rem;
                    color: rgba(200, 200, 240, 0.6);
                }

                .item-value {
                    font-size: 0.95rem;
                    color: var(--foreground);
                }

                .item-value.pre-wrap {
                    white-space: pre-wrap;
                    line-height: 1.6;
                }

                .claim-attachments {
                    margin-top: 1.5rem;
                }

                .attachments-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }

                .attachment-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.75rem;
                    border-radius: 8px;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    transition: background 0.2s;
                }

                .attachment-card:active {
                    background: rgba(255, 255, 255, 0.08);
                }

                .attachment-icon {
                    font-size: 1.25rem;
                }

                .attachment-type {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--foreground);
                }

                .attachment-name {
                    font-size: 0.65rem;
                    color: rgba(200, 200, 240, 0.5);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .warranty-section {
                    border-color: rgba(124, 92, 255, 0.3);
                    background: rgba(124, 92, 255, 0.05);
                }

                .warranty-title {
                    color: #7c5cff;
                }

                .status-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .timeline-item {
                    display: flex;
                    gap: 1rem;
                    position: relative;
                    padding-left: 1.5rem;
                }

                .timeline-line {
                    position: absolute;
                    left: 4px;
                    top: 24px;
                    bottom: -24px;
                    width: 2px;
                    background: rgba(100, 100, 180, 0.2);
                }

                .timeline-dot {
                    position: absolute;
                    left: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(100, 100, 180, 0.5);
                    margin-top: 6px;
                    z-index: 1;
                }

                .timeline-dot.active {
                    background: #7c5cff;
                }

                .timeline-content {
                    flex: 1;
                }

                .timeline-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 0.25rem;
                }

                .timeline-status {
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .timeline-date {
                    font-size: 0.75rem;
                    color: rgba(200, 200, 240, 0.5);
                }

                .timeline-by {
                    display: inline-block;
                    font-size: 0.7rem;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(200, 200, 240, 0.6);
                    margin-bottom: 0.25rem;
                }

                .timeline-note {
                    font-size: 0.85rem;
                    color: rgba(200, 200, 240, 0.7);
                    white-space: pre-wrap;
                    margin-top: 0.25rem;
                }

                .claim-sidebar {
                    position: sticky;
                    top: 1rem;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .ai-section {
                    border: 1px solid rgba(0, 212, 170, 0.3);
                    background: rgba(0, 212, 170, 0.05);
                }

                .ai-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .ai-title {
                    font-size: 1rem;
                    color: #00d4aa;
                    margin-bottom: 0;
                }

                .ai-apply-btn {
                    font-size: 0.7rem;
                    padding: 0.3rem 0.6rem;
                    border-radius: 6px;
                    background: rgba(0, 212, 170, 0.15);
                    color: #00d4aa;
                    border: 1px solid rgba(0, 212, 170, 0.3);
                    cursor: pointer;
                    font-weight: 600;
                }

                .ai-content {
                    margin-top: 0.5rem;
                }

                .ai-suggestion-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    flex-wrap: wrap;
                }

                .ai-label {
                    color: rgba(200, 200, 240, 0.6);
                    font-size: 0.85rem;
                }

                .ai-status {
                    font-weight: 700;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }

                .ai-rationale-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.75rem;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .ai-rationale-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: rgba(200, 200, 240, 0.8);
                    margin-bottom: 0.25rem;
                }

                .ai-rationale-text {
                    font-size: 0.8rem;
                    color: rgba(200, 200, 240, 0.6);
                    line-height: 1.4;
                }

                .ai-warning {
                    font-size: 0.75rem;
                    color: #ffb347;
                    margin-top: 0.5rem;
                }

                .ai-loading {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }

                .ai-loading p {
                    font-size: 0.85rem;
                    color: rgba(200, 200, 240, 0.5);
                }

                .spinner.small {
                    width: 16px;
                    height: 16px;
                    border-width: 2px;
                }

                .update-btn {
                    width: 100%;
                }

                .danger-section {
                    background: rgba(255, 107, 107, 0.05);
                    border-color: rgba(255, 107, 107, 0.2);
                }

                .danger-title {
                    font-size: 0.95rem;
                    color: #ff6b6b;
                }

                .danger-text {
                    font-size: 0.8rem;
                    color: rgba(255, 107, 107, 0.7);
                    margin-bottom: 0.75rem;
                }

                .danger-btn {
                    width: 100%;
                    border-color: rgba(255, 107, 107, 0.4);
                    color: #ff6b6b;
                }

                /* Mobile Responsive */
                @media (max-width: 1024px) {
                    .claim-layout {
                        grid-template-columns: 1fr;
                    }

                    .claim-sidebar {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .claim-header {
                        margin-bottom: 1rem;
                    }

                    .claim-title {
                        font-size: 1.25rem;
                    }

                    .claim-info-grid {
                        grid-template-columns: 1fr;
                    }

                    .claim-info-item.full-width {
                        grid-column: span 1;
                    }

                    .attachments-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .claim-title {
                        font-size: 1.1rem;
                    }

                    .claim-status-badge {
                        font-size: 0.75rem;
                        padding: 0.3rem 0.75rem;
                    }

                    .attachments-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
