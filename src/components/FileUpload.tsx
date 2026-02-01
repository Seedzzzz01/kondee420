import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadProps {
    onUploadSuccess: (fileInfo: { fileUrl: string; fileName: string; fileSize: number; type: string }) => void;
    label?: string;
    acceptedTypes?: string;
}

export default function FileUpload({ onUploadSuccess, label, acceptedTypes = "image/*,video/*,.pdf" }: FileUploadProps) {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError(t.errorOccurred + ' File too large (max 10MB)');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                onUploadSuccess({
                    fileUrl: data.fileUrl,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    type: file.type.startsWith('image/') ? 'ISSUE_PHOTO' : file.type.startsWith('video/') ? 'ISSUE_VIDEO' : 'OTHER'
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload-container">
            {label && <label className="form-label">{label}</label>}
            <div
                className={`file-drop-zone ${uploading ? 'uploading' : ''}`}
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className="spinner-container">
                        <div className="spinner" />
                        <span>{t.submitting}</span>
                    </div>
                ) : (
                    <div className="drop-zone-content">
                        <span className="upload-icon">📁</span>
                        <div className="upload-text">
                            <span className="primary-text">{t.clickToUpload}</span>
                            <span className="secondary-text">{t.orDragDrop}</span>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={acceptedTypes}
                    style={{ display: 'none' }}
                />
            </div>
            {error && <p className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}

            <style jsx>{`
                .file-drop-zone {
                    border: 2px dashed rgba(100, 100, 180, 0.3);
                    border-radius: 14px;
                    padding: 1.75rem 1.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.02);
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    -webkit-tap-highlight-color: transparent;
                }
                .file-drop-zone:hover,
                .file-drop-zone:active {
                    border-color: #7c5cff;
                    background: rgba(124, 92, 255, 0.05);
                }
                .file-drop-zone.uploading {
                    cursor: wait;
                    opacity: 0.7;
                }
                .drop-zone-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }
                .upload-icon {
                    font-size: 2.5rem;
                }
                .upload-text {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .primary-text {
                    font-weight: 600;
                    color: #7c5cff;
                    font-size: 1rem;
                }
                .secondary-text {
                    font-size: 0.85rem;
                    color: rgba(200, 200, 240, 0.6);
                }
                .spinner-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                @media (max-width: 640px) {
                    .file-drop-zone {
                        padding: 1.5rem 1rem;
                        min-height: 100px;
                        border-radius: 12px;
                    }
                    .upload-icon {
                        font-size: 2rem;
                    }
                    .primary-text {
                        font-size: 0.95rem;
                    }
                    .secondary-text {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </div>
    );
}
