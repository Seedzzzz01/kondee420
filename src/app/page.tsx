'use client';

import { useState, useCallback } from 'react';
import ProductSelector from '@/components/ProductSelector';
import LanguageToggle from '@/components/LanguageToggle';
import { WarrantyModel, ClaimFormData, initialClaimFormData } from '@/types/warranty';
import { useLanguage } from '@/contexts/LanguageContext';
import FileUpload from '@/components/FileUpload';

export default function ClaimPage() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<WarrantyModel | null>(null);
  const [formData, setFormData] = useState<ClaimFormData>(initialClaimFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; claimId?: string } | null>(null);

  const handleFileUpload = (fileInfo: any) => {
    setFormData((prev: ClaimFormData) => ({
      ...prev,
      attachments: [...(prev.attachments || []), fileInfo]
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev: ClaimFormData) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
  };

  const handleModelSelect = useCallback((model: WarrantyModel | null) => {
    setSelectedModel(model);
    if (model) {
      setFormData(prev => ({
        ...prev,
        brand: model.brand,
        modelKey: model.modelKey,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const canProceedStep1 = selectedModel !== null;
  const canProceedStep2 = formData.customerFirstName && formData.customerLastName && formData.phone && formData.serialNumber && formData.purchaseDate;
  const canProceedStep3 = formData.issueDescription && formData.acceptedTerms;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!canProceedStep3) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, claimId: result.claimId });
        setStep(4);
      } else {
        alert(`${t.errorOccurred} ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(t.errorSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="animated-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <LanguageToggle />
      <div className="container">
        <header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="header-title">{t.headerTitle}</h1>
              <p className="header-subtitle">{t.headerSubtitle}</p>
            </div>
            <button
              onClick={() => window.location.href = '/track'}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', minHeight: 'auto', fontSize: '0.85rem' }}
            >
              🔍 {t.trackStatus || 'Track Status'}
            </button>
          </div>
        </header>

        {step < 4 && (
          <div className="step-indicator">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`step-dot ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
              />
            ))}
          </div>
        )}

        <main className="glass-card">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="section-title">{t.step1Title}</h2>
              <ProductSelector
                onModelSelect={handleModelSelect}
                selectedModel={selectedModel}
              />
              <div className="btn-group">
                <button
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!canProceedStep1}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Customer & Product Info */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="section-title">{t.step2Title}</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    {t.customerFirstName}
                  </label>
                  <input
                    type="text"
                    name="customerFirstName"
                    value={formData.customerFirstName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.customerFirstNamePlaceholder}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    {t.customerLastName}
                  </label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.customerLastNamePlaceholder}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📱</span>
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.phonePlaceholder}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📧</span>
                    {t.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">💬</span>
                    {t.lineId}
                  </label>
                  <input
                    type="text"
                    name="lineId"
                    value={formData.lineId}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.lineIdPlaceholder}
                  />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔢</span>
                    {t.serialNumber}
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.serialNumberPlaceholder}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📅</span>
                    {t.purchaseDate}
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🏪</span>
                    {t.purchaseChannel}
                  </label>
                  <select
                    name="purchaseChannel"
                    value={formData.purchaseChannel}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">{t.purchaseChannelPlaceholder}</option>
                    <option value="store">{t.channelStore}</option>
                    <option value="website">{t.channelWebsite}</option>
                    <option value="shopee">{t.channelShopee}</option>
                    <option value="lazada">{t.channelLazada}</option>
                    <option value="other">{t.channelOther}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🧾</span>
                    {t.orderNo}
                  </label>
                  <input
                    type="text"
                    name="orderNo"
                    value={formData.orderNo}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t.orderNoPlaceholder}
                  />
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary" onClick={prevStep}>
                  {t.back}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!canProceedStep2}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Details */}
          {step === 3 && (
            <div className="step-content">
              <h2 className="section-title">{t.step3Title}</h2>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📝</span>
                  {t.issueDescription}
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder={t.issueDescriptionPlaceholder}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📅</span>
                    {t.issueStartDate}
                  </label>
                  <input
                    type="date"
                    name="issueStartDate"
                    value={formData.issueStartDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📋</span>
                    {t.usageType}
                  </label>
                  <select
                    name="issueUsageType"
                    value={formData.issueUsageType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">{t.usageTypePlaceholder}</option>
                    <option value="normal">{t.usageNormal}</option>
                    <option value="dropped">{t.usageDropped}</option>
                    <option value="water">{t.usageWater}</option>
                    <option value="other">{t.usageOther}</option>
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">
                  <span className="label-icon">📁</span>
                  {t.uploadFile}
                </label>
                <FileUpload onUploadSuccess={handleFileUpload} />

                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="uploaded-files-list" style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(200, 200, 240, 0.6)', marginBottom: '0.5rem' }}>{t.uploadedFiles}:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(formData.attachments || []).map((file: any, index: number) => (
                        <div key={index} className="uploaded-file-item" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.fileName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'rgba(200, 200, 240, 0.5)' }}>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff6b6b',
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Required docs reminder */}
              {selectedModel?.requiredDocsTh && (
                <div className="warranty-info-card" style={{ marginTop: '1.5rem' }}>
                  <h3 className="warranty-title">
                    <span className="title-icon">📎</span>
                    {t.docsToPrepareMini}
                  </h3>
                  <p style={{ color: 'var(--foreground-muted)', whiteSpace: 'pre-wrap' }}>
                    {selectedModel.requiredDocsTh}
                  </p>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--warning)' }}>
                    {t.docsNote}
                  </p>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-label">
                    {t.termsAccept}
                  </span>
                </label>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary" onClick={prevStep}>
                  {t.back}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!canProceedStep3 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && submitResult?.success && (
            <div className="success-page">
              <div className="success-icon">✅</div>
              <h2 className="success-title">{t.successTitle}</h2>
              <p className="success-message">{t.successMessage}</p>
              <div className="claim-id-badge">
                {t.claimId} #{submitResult.claimId}
              </div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                {t.saveClaimIdNote}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setStep(1);
                  setFormData(initialClaimFormData);
                  setSelectedModel(null);
                  setSubmitResult(null);
                }}
                style={{ marginTop: '2rem' }}
              >
                {t.submitNewClaim}
              </button>
            </div>
          )}
        </main>

        <footer style={{
          marginTop: '4rem',
          padding: '2rem 0',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          color: 'rgba(200, 200, 240, 0.4)',
          fontSize: '0.85rem'
        }}>
          <p>© 2026 Kondee420 Claim Portal</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a
              href="/admin"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#7c5cff')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              Admin Portal
            </a>
            <a
              href="/track"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#00d4aa')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              Track Claim
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
