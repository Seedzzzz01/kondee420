'use client';

import { useState, useEffect, useCallback } from 'react';
import { WarrantyModel } from '@/types/warranty';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductSelectorProps {
    onModelSelect: (model: WarrantyModel | null) => void;
    selectedModel: WarrantyModel | null;
}

export default function ProductSelector({ onModelSelect, selectedModel }: ProductSelectorProps) {
    const { t, language } = useLanguage();
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<WarrantyModel[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedModelKey, setSelectedModelKey] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Fetch brands on mount
    useEffect(() => {
        fetch('/api/brands')
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error('Error fetching brands:', err));
    }, []);

    // Fetch models when brand changes
    useEffect(() => {
        if (!selectedBrand) {
            setModels([]);
            return;
        }
        setLoading(true);
        fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`)
            .then(res => res.json())
            .then(data => {
                setModels(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching models:', err);
                setLoading(false);
            });
    }, [selectedBrand]);

    // Update selected model
    useEffect(() => {
        if (selectedModelKey && models.length > 0) {
            const model = models.find(m => m.modelKey === selectedModelKey);
            onModelSelect(model || null);
        } else {
            onModelSelect(null);
        }
    }, [selectedModelKey, models, onModelSelect]);

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        setSelectedModelKey('');
        onModelSelect(null);
    };

    // Format warranty duration
    const formatWarranty = useCallback((months: number | null) => {
        if (!months) return t.contactAdmin;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (language === 'th') {
            return `${months} ${t.months} (${years} ${t.years} ${remainingMonths} ${t.months})`;
        }
        return `${months} ${t.months} (${years} ${t.years} ${remainingMonths} ${t.months})`;
    }, [language, t]);

    return (
        <div className="space-y-6">
            {/* Brand Selector */}
            <div className="form-group">
                <label htmlFor="brand" className="form-label">
                    <span className="label-icon">🏷️</span>
                    {t.selectBrand}
                </label>
                <select
                    id="brand"
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="form-select"
                >
                    <option value="">{t.selectBrandPlaceholder}</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            {/* Model Selector */}
            <div className="form-group">
                <label htmlFor="model" className="form-label">
                    <span className="label-icon">📦</span>
                    {t.selectModel}
                </label>
                <select
                    id="model"
                    value={selectedModelKey}
                    onChange={(e) => setSelectedModelKey(e.target.value)}
                    className="form-select"
                    disabled={!selectedBrand || loading}
                >
                    <option value="">
                        {loading ? t.loading : !selectedBrand ? t.selectBrandFirst : t.selectModelPlaceholder}
                    </option>
                    {models.map((model) => (
                        <option key={model.modelKey} value={model.modelKey}>{model.modelKey}</option>
                    ))}
                </select>
            </div>

            {/* Warranty Info Display */}
            {selectedModel && (
                <div className="warranty-info-card">
                    <h3 className="warranty-title">
                        <span className="title-icon">📋</span>
                        {t.warrantyInfo}
                    </h3>
                    <div className="warranty-details">
                        <div className="warranty-item">
                            <span className="item-label">{t.warrantyDuration}</span>
                            <span className="item-value highlight">
                                {formatWarranty(selectedModel.warrantyMonths)}
                            </span>
                        </div>
                        <div className="warranty-item">
                            <span className="item-label">{t.warrantyStart}</span>
                            <span className="item-value">
                                {language === 'th'
                                    ? (selectedModel.warrantyStartRuleTh || t.contactAdmin)
                                    : (selectedModel.warrantyStartRuleTh || t.contactAdmin)
                                }
                            </span>
                        </div>
                        {selectedModel.coverageDetailTh && (
                            <div className="warranty-item full-width">
                                <span className="item-label">{t.coverageDetails}</span>
                                <span className="item-value pre-wrap">{selectedModel.coverageDetailTh}</span>
                            </div>
                        )}
                        <div className="warranty-item full-width">
                            <span className="item-label">{t.requiredDocs}</span>
                            <span className="item-value">{selectedModel.requiredDocsTh || t.contactAdmin}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
