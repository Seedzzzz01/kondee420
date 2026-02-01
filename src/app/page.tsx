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
        let errorMessage = result.error || 'Unknown error';
        if (result.details && result.details.fieldErrors) {
          const detailedErrors = Object.entries(result.details.fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('\n');
          errorMessage += `\n\nDetails:\n${detailedErrors}`;
        }
        alert(`${t.errorOccurred} ${errorMessage}`);
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
      <div className="soft-bg" />

      {/* Clean Header */}
      <header className="app-header">
        <button className="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <LanguageToggle />
        <button className="icon-btn profile-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </header>

      <div className="container">
        {/* Big Title */}
        <div className="page-title">
          <h1>{t.headerTitle}</h1>
          {step < 4 && <p className="subtitle">{t.headerSubtitle}</p>}
        </div>

        {/* Step Tabs - Horizontal Style */}
        {step < 4 && (
          <div className="step-tabs">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                className={`step-tab ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                onClick={() => s < step && setStep(s)}
                disabled={s > step}
              >
                <span className="step-num">{s < step ? '✓' : s}</span>
                <span className="step-label">
                  {s === 1 ? t.step1Short || 'สินค้า' : s === 2 ? t.step2Short || 'ข้อมูล' : t.step3Short || 'รายละเอียด'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Card */}
        <main className="content-card">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="section-title">{t.step1Title}</h2>
              <ProductSelector
                onModelSelect={handleModelSelect}
                selectedModel={selectedModel}
              />
            </div>
          )}

          {/* Step 2: Customer & Product Info */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="section-title">{t.step2Title}</h2>

              <div className="form-section">
                <h3 className="form-section-title">ข้อมูลลูกค้า</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>{t.customerFirstName}</label>
                    <input
                      type="text"
                      name="customerFirstName"
                      value={formData.customerFirstName}
                      onChange={handleInputChange}
                      placeholder={t.customerFirstNamePlaceholder}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>{t.customerLastName}</label>
                    <input
                      type="text"
                      name="customerLastName"
                      value={formData.customerLastName}
                      onChange={handleInputChange}
                      placeholder={t.customerLastNamePlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>{t.phone}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t.phonePlaceholder}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>{t.email}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>{t.lineId}</label>
                  <input
                    type="text"
                    name="lineId"
                    value={formData.lineId}
                    onChange={handleInputChange}
                    placeholder={t.lineIdPlaceholder}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">ข้อมูลสินค้า</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>{t.serialNumber}</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      placeholder={t.serialNumberPlaceholder}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>{t.purchaseDate}</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>{t.purchaseChannel}</label>
                    <select
                      name="purchaseChannel"
                      value={formData.purchaseChannel}
                      onChange={handleInputChange}
                    >
                      <option value="">{t.purchaseChannelPlaceholder}</option>
                      <option value="store">{t.channelStore}</option>
                      <option value="website">{t.channelWebsite}</option>
                      <option value="shopee">{t.channelShopee}</option>
                      <option value="lazada">{t.channelLazada}</option>
                      <option value="other">{t.channelOther}</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{t.orderNo}</label>
                    <input
                      type="text"
                      name="orderNo"
                      value={formData.orderNo}
                      onChange={handleInputChange}
                      placeholder={t.orderNoPlaceholder}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Issue Details */}
          {step === 3 && (
            <div className="step-content">
              <h2 className="section-title">{t.step3Title}</h2>

              <div className="input-group full-width">
                <label>{t.issueDescription}</label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  placeholder={t.issueDescriptionPlaceholder}
                  rows={4}
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>{t.issueStartDate}</label>
                  <input
                    type="date"
                    name="issueStartDate"
                    value={formData.issueStartDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>{t.usageType}</label>
                  <select
                    name="issueUsageType"
                    value={formData.issueUsageType}
                    onChange={handleInputChange}
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
              <div className="input-group full-width">
                <label>{t.uploadFile}</label>
                <FileUpload onUploadSuccess={handleFileUpload} />

                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="file-list">
                    {(formData.attachments || []).map((file: any, index: number) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          <span className="file-icon">📄</span>
                          <div>
                            <span className="file-name">{file.fileName}</span>
                            <span className="file-size">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        <button className="remove-btn" onClick={() => removeFile(index)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleInputChange}
                />
                <span>{t.termsAccept}</span>
              </label>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && submitResult?.success && (
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>{t.successTitle}</h2>
              <p className="success-message">{t.successMessage}</p>
              <div className="claim-badge">
                {t.claimId} #{submitResult.claimId}
              </div>
              <p className="note">{t.saveClaimIdNote}</p>
            </div>
          )}
        </main>

        {/* Action Buttons */}
        <div className="action-buttons">
          {step > 1 && step < 4 && (
            <button className="btn-outline" onClick={prevStep}>
              {t.back}
            </button>
          )}
          {step === 1 && (
            <button className="btn-primary" onClick={nextStep} disabled={!canProceedStep1}>
              {t.next} →
            </button>
          )}
          {step === 2 && (
            <button className="btn-primary" onClick={nextStep} disabled={!canProceedStep2}>
              {t.next} →
            </button>
          )}
          {step === 3 && (
            <button className="btn-primary" onClick={handleSubmit} disabled={!canProceedStep3 || isSubmitting}>
              {isSubmitting ? t.submitting : t.submit}
            </button>
          )}
          {step === 4 && (
            <button
              className="btn-primary"
              onClick={() => {
                setStep(1);
                setFormData(initialClaimFormData);
                setSelectedModel(null);
                setSubmitResult(null);
              }}
            >
              {t.submitNewClaim}
            </button>
          )}
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <a href="/track" className="quick-link">
            <span className="link-icon">🔍</span>
            <span>{t.trackStatus || 'ติดตามสถานะ'}</span>
          </a>
          <a href="/admin" className="quick-link">
            <span className="link-icon">⚙️</span>
            <span>Admin</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Soft Background */
        .soft-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(135deg, #E8F4FC 0%, #D0E8F5 50%, #E0F0FA 100%);
        }

        /* App Header */
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          padding-top: calc(1rem + env(safe-area-inset-top, 0px));
          z-index: 100;
          background: transparent;
        }

        .icon-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: none;
          border-radius: 12px;
          color: #4AA9E9;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(74, 169, 233, 0.15);
        }

        .profile-btn {
          background: #4AA9E9;
          color: white;
        }

        /* Container */
        .container {
          max-width: 500px;
          margin: 0 auto;
          padding: 5rem 1.25rem 2rem;
          padding-bottom: calc(10rem + env(safe-area-inset-bottom, 0px));
          min-height: 100vh;
        }

        /* Page Title */
        .page-title {
          margin-bottom: 1.5rem;
        }

        .page-title h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a3a4a;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          font-size: 0.9rem;
          color: #6b8a9a;
        }

        /* Step Tabs */
        .step-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(74, 169, 233, 0.1);
        }

        .step-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.75rem 0.5rem;
          border: none;
          border-radius: 12px;
          background: transparent;
          font-size: 0.8rem;
          color: #6b8a9a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .step-tab.active {
          background: linear-gradient(135deg, #4AA9E9, #5BC0DE);
          color: white;
          box-shadow: 0 2px 8px rgba(74, 169, 233, 0.3);
        }

        .step-tab.completed {
          color: #4AA9E9;
        }

        .step-num {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .step-label {
          font-weight: 500;
        }

        /* Content Card */
        .content-card {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 24px rgba(74, 169, 233, 0.12);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a3a4a;
          margin-bottom: 1.25rem;
        }

        /* Form Sections */
        .form-section {
          margin-bottom: 1.5rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4AA9E9;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(74, 169, 233, 0.15);
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        @media (max-width: 480px) {
          .input-row {
            grid-template-columns: 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .input-group.full-width {
          grid-column: 1 / -1;
        }

        .input-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #6b8a9a;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #E8F4FC;
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-size: 15px;
          color: #1a3a4a;
          transition: all 0.2s ease;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          outline: none;
          border-color: #4AA9E9;
          background: white;
          box-shadow: 0 0 0 3px rgba(74, 169, 233, 0.15);
        }

        .input-group input::placeholder,
        .input-group textarea::placeholder {
          color: #9cb8c8;
        }

        .input-group select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%234AA9E9' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.875rem center;
          padding-right: 2.5rem;
        }

        .input-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* File Upload */
        .file-list {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #E8F4FC;
          border-radius: 10px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .file-icon {
          font-size: 1.2rem;
        }

        .file-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #1a3a4a;
          display: block;
        }

        .file-size {
          font-size: 0.75rem;
          color: #9cb8c8;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #E94A4A;
          cursor: pointer;
          padding: 0.25rem;
          font-size: 1rem;
        }

        /* Checkbox */
        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #E8F4FC;
          border-radius: 12px;
          margin-top: 1rem;
          cursor: pointer;
        }

        .checkbox-row input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #4AA9E9;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-row span {
          font-size: 0.9rem;
          color: #6b8a9a;
          line-height: 1.5;
        }

        /* Success Content */
        .success-content {
          text-align: center;
          padding: 2rem 0;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-content h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          color: #1a3a4a;
          margin-bottom: 0.5rem;
        }

        .success-message {
          color: #6b8a9a;
          margin-bottom: 1.5rem;
        }

        .claim-badge {
          display: inline-block;
          padding: 0.875rem 1.5rem;
          background: white;
          border: 2px solid #4AA9E9;
          border-radius: 100px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #4AA9E9;
          margin-bottom: 1rem;
        }

        .note {
          font-size: 0.85rem;
          color: #9cb8c8;
        }

        /* Action Buttons */
        .action-buttons {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
          background: white;
          box-shadow: 0 -4px 20px rgba(74, 169, 233, 0.1);
          z-index: 100;
        }

        .btn-primary {
          flex: 1;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #4AA9E9, #5BC0DE);
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(74, 169, 233, 0.3);
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(74, 169, 233, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-outline {
          padding: 1rem 1.5rem;
          background: white;
          border: 1.5px solid rgba(74, 169, 233, 0.3);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 500;
          color: #6b8a9a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          border-color: #4AA9E9;
          color: #4AA9E9;
        }

        /* Quick Links */
        .quick-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
          padding-bottom: 1rem;
        }

        .quick-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: 100px;
          font-size: 0.85rem;
          color: #6b8a9a;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(74, 169, 233, 0.1);
          transition: all 0.2s ease;
        }

        .quick-link:hover {
          color: #4AA9E9;
          box-shadow: 0 4px 16px rgba(74, 169, 233, 0.2);
        }

        .link-icon {
          font-size: 1rem;
        }
      `}</style>
    </>
  );
}
