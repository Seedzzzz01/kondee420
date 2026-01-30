// Warranty Model type from database
export interface WarrantyModel {
    id: number;
    brand: string;
    modelKey: string;
    warrantyMonths: number | null;
    warrantyStartRuleTh: string | null;
    requiredDocsTh: string | null;
    claimStepsTh: string | null;
    coverageSummaryTh: string | null;
    coverageDetailTh: string | null;
    excludeTh: string | null;
    notesTh: string | null;
}

// Claim form data
export interface ClaimFormData {
    // Customer info
    customerFirstName: string;
    customerLastName: string;
    phone: string;
    email: string;
    lineId: string;

    // Product info
    brand: string;
    modelKey: string;
    serialNumber: string;
    purchaseDate: string;
    purchaseChannel: string;
    orderNo: string;

    // Issue info
    issueDescription: string;
    issueStartDate: string;
    issueUsageType: string;

    // Terms
    acceptedTerms: boolean;

    // Attachments
    attachments?: {
        fileUrl: string;
        fileName: string;
        fileSize: number;
        type: string;
    }[];
}

// Initial form data
export const initialClaimFormData: ClaimFormData = {
    customerFirstName: '',
    customerLastName: '',
    phone: '',
    email: '',
    lineId: '',
    brand: '',
    modelKey: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseChannel: '',
    orderNo: '',
    issueDescription: '',
    issueStartDate: '',
    issueUsageType: '',
    acceptedTerms: false,
    attachments: [],
};

// Helper for human-readable ID
export function generateClaimId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'CLM-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
