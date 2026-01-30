
// Application-level type definitions for enums (since SQLite doesn't support enums)

export const CLAIM_STATUSES = [
    'NEW',
    'ADDITIONAL_INFO',
    'APPROVED',
    'RECEIVED',
    'IN_REPAIR',
    'PROCESSING',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
] as const;

export type ClaimStatus = typeof CLAIM_STATUSES[number];

export const FILE_TYPES = [
    'PURCHASE_PROOF',
    'SERIAL_PHOTO',
    'ISSUE_PHOTO',
    'ISSUE_VIDEO',
    'OTHER',
] as const;

export type FileType = typeof FILE_TYPES[number];

import { Translations } from './translations';

// Helper to format status for display
export function formatClaimStatus(status: ClaimStatus, t: Translations): string {
    const statusMap: Record<ClaimStatus, string> = {
        NEW: t.statusNEW,
        ADDITIONAL_INFO: t.statusADDITIONAL_INFO,
        APPROVED: t.statusAPPROVED,
        RECEIVED: t.statusRECEIVED,
        PROCESSING: t.statusPROCESSING,
        IN_REPAIR: t.statusIN_REPAIR,
        COMPLETED: t.statusCOMPLETED,
        REJECTED: t.statusREJECTED,
        CANCELLED: t.statusCANCELLED,
    };
    return statusMap[status] || status;
}

export function formatFileType(type: FileType, t: Translations): string {
    const typeMap: Record<FileType, string> = {
        PURCHASE_PROOF: t.fileTypePurchaseProof,
        SERIAL_PHOTO: t.fileTypeSerialPhoto,
        ISSUE_PHOTO: t.fileTypeIssuePhoto,
        ISSUE_VIDEO: t.fileTypeIssueVideo,
        OTHER: t.fileTypeOther,
    };
    return typeMap[type] || type;
}
