export type Language = 'th' | 'en';

export interface Translations {
    // Header
    headerTitle: string;
    headerSubtitle: string;

    // Step 1: Product Selection
    step1Title: string;
    selectBrand: string;
    selectBrandPlaceholder: string;
    selectModel: string;
    selectModelPlaceholder: string;
    selectBrandFirst: string;
    loading: string;

    // Warranty Info
    warrantyInfo: string;
    warrantyDuration: string;
    warrantyStart: string;
    coverageDetails: string;
    requiredDocs: string;
    months: string;
    years: string;
    contactAdmin: string;

    // Step 2: Customer Info
    step2Title: string;
    customerFirstName: string;
    customerFirstNamePlaceholder: string;
    customerLastName: string;
    customerLastNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    lineId: string;
    lineIdPlaceholder: string;
    serialNumber: string;
    serialNumberPlaceholder: string;
    purchaseDate: string;
    purchaseChannel: string;
    purchaseChannelPlaceholder: string;
    orderNo: string;
    orderNoPlaceholder: string;

    // Purchase channels
    channelStore: string;
    channelWebsite: string;
    channelShopee: string;
    channelLazada: string;
    channelOther: string;

    // Step 3: Issue
    step3Title: string;
    issueDescription: string;
    issueDescriptionPlaceholder: string;
    issueStartDate: string;
    usageType: string;
    usageTypePlaceholder: string;
    usageNormal: string;
    usageDropped: string;
    usageWater: string;
    usageOther: string;
    docsToPrepareMini: string;
    docsNote: string;
    termsAccept: string;

    // Buttons
    next: string;
    back: string;
    submit: string;
    submitting: string;

    // Success
    successTitle: string;
    successMessage: string;
    claimId: string;
    saveClaimIdNote: string;
    submitNewClaim: string;

    // Errors
    errorOccurred: string;
    errorSubmit: string;

    // Admin Dashboard
    adminPanel: string;
    claimsManagement: string;
    warrantyModels: string;
    settings: string;
    backToPortal: string;
    claimsOverview: string;
    claimsOverviewSubtitle: string;
    searchPlaceholder: string;
    allStatuses: string;

    // Table Headers
    tableClaimId: string;
    tableCustomer: string;
    tableModel: string;
    tableDate: string;
    tableStatus: string;
    tableAction: string;
    viewDetails: string;

    // Claim Detail
    submittedOn: string;
    productCustomerInfo: string;
    issueDetails: string;
    statusHistory: string;
    updateStatus: string;
    newStatus: string;
    internalNote: string;
    updateClaimStatus: string;
    dangerZone: string;
    deleteClaimNote: string;
    deleteClaim: string;

    // AI Agent
    aiAgentTitle: string;
    aiSuggestion: string;
    aiRationale: string;
    aiAnalyzing: string;
    aiLowConfidence: string;

    // Statuses (consistent strings)
    statusNEW: string;
    statusNEED_MORE_INFO: string;
    statusAPPROVED: string;
    statusRECEIVED: string;
    statusIN_REPAIR: string;
    statusCOMPLETED: string;
    statusREJECTED: string;
    statusCANCELLED: string;
    noClaimsFound: string;
    searchButton: string;
    by: string;
    internalNotePlaceholder: string;
    claimNotFound: string;
    applySuggestion: string;
    uploadFile: string;
    clickToUpload: string;
    orDragDrop: string;
    fileTooLarge: string;
    uploadedFiles: string;
    fileTypePurchaseProof: string;
    fileTypeSerialPhoto: string;
    fileTypeIssuePhoto: string;
    fileTypeIssueVideo: string;
    fileTypeOther: string;
    totalClaims: string;
    pendingClaims: string;
    activeRepairs: string;
    completedCases: string;
    recentActivity: string;
}

export const translations: Record<Language, Translations> = {
    th: {
        // Header
        headerTitle: '🛡️ ศูนย์รับเคลมสินค้า',
        headerSubtitle: 'กรอกข้อมูลเพื่อส่งคำขอเคลมประกันสินค้าของคุณ',

        // Step 1
        step1Title: '📦 เลือกสินค้าที่ต้องการเคลม',
        selectBrand: 'เลือกแบรนด์',
        selectBrandPlaceholder: '-- เลือกแบรนด์สินค้า --',
        selectModel: 'เลือกรุ่นสินค้า',
        selectModelPlaceholder: '-- เลือกรุ่นสินค้า --',
        selectBrandFirst: '-- กรุณาเลือกแบรนด์ก่อน --',
        loading: 'กำลังโหลด...',

        // Warranty Info
        warrantyInfo: '📋 ข้อมูลประกันสินค้า',
        warrantyDuration: 'ระยะประกัน:',
        warrantyStart: 'เริ่มนับประกัน:',
        coverageDetails: 'รายละเอียดความคุ้มครอง:',
        requiredDocs: 'เอกสารที่ต้องใช้:',
        months: 'เดือน',
        years: 'ปี',
        contactAdmin: 'ดูรายละเอียดกับแอดมิน',

        // Step 2
        step2Title: '👤 ข้อมูลลูกค้าและสินค้า',
        customerFirstName: 'ชื่อ *',
        customerFirstNamePlaceholder: 'กรอกชื่อจริง',
        customerLastName: 'นามสกุล *',
        customerLastNamePlaceholder: 'กรอกนามสกุล',
        phone: 'เบอร์โทรศัพท์ *',
        phonePlaceholder: '0xx-xxx-xxxx',
        email: 'อีเมล',
        emailPlaceholder: 'email@example.com',
        lineId: 'LINE ID',
        lineIdPlaceholder: '@line_id',
        serialNumber: 'Serial Number *',
        serialNumberPlaceholder: 'หมายเลข S/N บนตัวเครื่อง',
        purchaseDate: 'วันที่ซื้อ *',
        purchaseChannel: 'ช่องทางซื้อสินค้า',
        purchaseChannelPlaceholder: '-- เลือก --',
        orderNo: 'เลขออเดอร์/เลขบิล',
        orderNoPlaceholder: 'ถ้ามี',

        // Purchase channels
        channelStore: 'หน้าร้าน',
        channelWebsite: 'เว็บไซต์',
        channelShopee: 'Shopee',
        channelLazada: 'Lazada',
        channelOther: 'อื่นๆ',

        // Step 3
        step3Title: '⚠️ รายละเอียดปัญหา',
        issueDescription: 'อาการ/ปัญหาที่พบ *',
        issueDescriptionPlaceholder: 'อธิบายอาการหรือปัญหาที่พบโดยละเอียด...',
        issueStartDate: 'วันที่เริ่มมีปัญหา',
        usageType: 'ลักษณะการใช้งาน',
        usageTypePlaceholder: '-- เลือก --',
        usageNormal: 'ใช้งานปกติ',
        usageDropped: 'ตกหล่น',
        usageWater: 'โดนน้ำ/ความชื้น',
        usageOther: 'อื่นๆ',
        docsToPrepareMini: '📎 เอกสารที่ต้องเตรียม',
        docsNote: '💡 เจ้าหน้าที่จะติดต่อขอเอกสารเพิ่มเติมหลังจากตรวจสอบข้อมูลเบื้องต้น',
        termsAccept: 'ข้าพเจ้ายืนยันว่าข้อมูลที่กรอกทั้งหมดเป็นความจริง และยอมรับเงื่อนไขการเคลมสินค้า',

        // Buttons
        next: 'ถัดไป →',
        back: '← ย้อนกลับ',
        submit: '✓ ส่งคำขอเคลม',
        submitting: 'กำลังส่ง...',

        // Success
        successTitle: 'ส่งคำขอเคลมสำเร็จ!',
        successMessage: 'เราได้รับข้อมูลของคุณแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับภายใน 1-2 วันทำการ',
        claimId: 'หมายเลขเคลม:',
        saveClaimIdNote: 'กรุณาบันทึกหมายเลขนี้เพื่อใช้ติดตามสถานะการเคลม',
        submitNewClaim: 'ส่งเคลมรายการใหม่',

        // Errors
        errorOccurred: 'เกิดข้อผิดพลาด:',
        errorSubmit: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง',

        // Admin Dashboard
        adminPanel: 'แผงควบคุมแอดมิน',
        claimsManagement: 'จัดการรายการเคลม',
        warrantyModels: 'รุ่นสินค้าและประกัน',
        settings: 'ตั้งค่า',
        backToPortal: 'กลับสู่หน้าพอร์ทัล',
        claimsOverview: 'ภาพรวมการเคลม',
        claimsOverviewSubtitle: 'จัดการและติดตามรายการเคลมสินค้าทั้งหมดของลูกค้า',
        searchPlaceholder: 'ค้นหา ID, ชื่อ, รุ่น...',
        allStatuses: 'ทุกสถานะ',

        // Table Headers
        tableClaimId: 'หมายเลขเคลม',
        tableCustomer: 'ลูกค้า',
        tableModel: 'รุ่นสินค้า',
        tableDate: 'วันที่',
        tableStatus: 'สถานะ',
        tableAction: 'การดำเนินการ',
        viewDetails: 'ดูรายละเอียด',

        // Claim Detail
        submittedOn: 'ส่งเมื่อ',
        productCustomerInfo: '📦 ข้อมูลสินค้าและลูกค้า',
        issueDetails: '🔍 รายละเอียดปัญหา',
        statusHistory: '🕒 ประวัติสถานะ',
        updateStatus: 'อัปเดตสถานะ',
        newStatus: 'สถานะใหม่',
        internalNote: 'บันทึกภายใน',
        updateClaimStatus: 'อัปเดตสถานะการเคลม',
        dangerZone: 'พื้นที่อันตราย',
        deleteClaimNote: 'การลบรายการเคลมเป็นการถาวรและไม่สามารถย้อนกลับได้',
        deleteClaim: 'ลบรายการเคลม',

        // AI Agent
        aiAgentTitle: '🤖 ผู้ช่วย AI (Skill Agent)',
        aiSuggestion: 'คำแนะนำจาก AI:',
        aiRationale: 'เหตุผล:',
        aiAnalyzing: 'กำลังวิเคราะห์โดย AI...',
        aiLowConfidence: 'AI ไม่แน่ใจ กรุณาตรวจสอบด้วยตนเอง',

        // Statuses
        statusNEW: 'รอตรวจสอบ',
        statusNEED_MORE_INFO: 'รอข้อมูลเพิ่มเติม',
        statusAPPROVED: 'อนุมัติแล้ว',
        statusRECEIVED: 'ได้รับสินค้าแล้ว',
        statusIN_REPAIR: 'กำลังซ่อม',
        statusCOMPLETED: 'เสร็จสิ้น',
        statusREJECTED: 'ไม่อนุมัติ',
        statusCANCELLED: 'ยกเลิก',
        noClaimsFound: 'ไม่พบรายการเคลม',
        searchButton: 'ค้นหา',
        by: 'โดย',
        internalNotePlaceholder: 'กรอกบันทึกภายในที่นี่...',
        claimNotFound: 'ไม่พบข้อมูลการเคลม',
        applySuggestion: 'ใช้คำแนะนำนี้',
        uploadFile: 'อัปโหลดไฟล์/รูปภาพ',
        clickToUpload: 'คลิกเพื่อเลือกไฟล์',
        orDragDrop: 'หรือลากไฟล์มาวางที่นี่',
        fileTooLarge: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)',
        uploadedFiles: 'ไฟล์ที่อัปโหลดแล้ว',
        fileTypePurchaseProof: 'หลักฐานการซื้อ',
        fileTypeSerialPhoto: 'รูป S/N',
        fileTypeIssuePhoto: 'รูปอาการ',
        fileTypeIssueVideo: 'วิดีโออาการ',
        fileTypeOther: 'อื่นๆ',
        totalClaims: 'รายการเคลมทั้งหมด',
        pendingClaims: 'รอดำเนินการ',
        activeRepairs: 'กำลังซ่อม',
        completedCases: 'เสร็จสิ้นแล้ว',
        recentActivity: 'กิจกรรมล่าสุด',
    },
    en: {
        // Header
        headerTitle: '🛡️ Product Claim Center',
        headerSubtitle: 'Fill in the details to submit your warranty claim request',

        // Step 1
        step1Title: '📦 Select Product to Claim',
        selectBrand: 'Select Brand',
        selectBrandPlaceholder: '-- Select a brand --',
        selectModel: 'Select Model',
        selectModelPlaceholder: '-- Select a model --',
        selectBrandFirst: '-- Please select a brand first --',
        loading: 'Loading...',

        // Warranty Info
        warrantyInfo: '📋 Warranty Information',
        warrantyDuration: 'Warranty Period:',
        warrantyStart: 'Warranty Starts:',
        coverageDetails: 'Coverage Details:',
        requiredDocs: 'Required Documents:',
        months: 'months',
        years: 'years',
        contactAdmin: 'Contact admin for details',

        // Step 2
        step2Title: '👤 Customer & Product Information',
        customerFirstName: 'First Name *',
        customerFirstNamePlaceholder: 'Enter your first name',
        customerLastName: 'Last Name *',
        customerLastNamePlaceholder: 'Enter your last name',
        phone: 'Phone Number *',
        phonePlaceholder: '+66-xxx-xxx-xxxx',
        email: 'Email',
        emailPlaceholder: 'email@example.com',
        lineId: 'LINE ID',
        lineIdPlaceholder: '@line_id',
        serialNumber: 'Serial Number *',
        serialNumberPlaceholder: 'S/N on the device',
        purchaseDate: 'Purchase Date *',
        purchaseChannel: 'Purchase Channel',
        purchaseChannelPlaceholder: '-- Select --',
        orderNo: 'Order/Invoice No.',
        orderNoPlaceholder: 'If available',

        // Purchase channels
        channelStore: 'Physical Store',
        channelWebsite: 'Website',
        channelShopee: 'Shopee',
        channelLazada: 'Lazada',
        channelOther: 'Other',

        // Step 3
        step3Title: '⚠️ Issue Details',
        issueDescription: 'Issue/Problem Description *',
        issueDescriptionPlaceholder: 'Please describe the issue in detail...',
        issueStartDate: 'When did the issue start?',
        usageType: 'Usage Condition',
        usageTypePlaceholder: '-- Select --',
        usageNormal: 'Normal use',
        usageDropped: 'Physical impact',
        usageWater: 'Water/moisture damage',
        usageOther: 'Other',
        docsToPrepareMini: '📎 Required Documents',
        docsNote: '💡 Our staff will contact you for additional documents after initial review',
        termsAccept: 'I confirm that all information provided is accurate and accept the warranty claim terms',

        // Buttons
        next: 'Next →',
        back: '← Back',
        submit: '✓ Submit Claim',
        submitting: 'Submitting...',

        // Success
        successTitle: 'Claim Submitted Successfully!',
        successMessage: 'We have received your claim. Our team will review and contact you within 1-2 business days.',
        claimId: 'Claim ID:',
        saveClaimIdNote: 'Please save this number to track your claim status',
        submitNewClaim: 'Submit New Claim',

        // Errors
        errorOccurred: 'Error occurred:',
        errorSubmit: 'Failed to submit. Please try again.',

        // Admin Dashboard
        adminPanel: 'Admin Panel',
        claimsManagement: 'Claims Management',
        warrantyModels: 'Warranty Models',
        settings: 'Settings',
        backToPortal: 'Back to Portal',
        claimsOverview: 'Claims Overview',
        claimsOverviewSubtitle: 'Manage and track all customer warranty claims',
        searchPlaceholder: 'Search ID, Name, Model...',
        allStatuses: 'All Statuses',

        // Table Headers
        tableClaimId: 'Claim ID',
        tableCustomer: 'Customer',
        tableModel: 'Model',
        tableDate: 'Date',
        tableStatus: 'Status',
        tableAction: 'Action',
        viewDetails: 'View Details',

        // Claim Detail
        submittedOn: 'Submitted on',
        productCustomerInfo: '📦 Product & Customer Information',
        issueDetails: '🔍 Issue Details',
        statusHistory: '🕒 Status History',
        updateStatus: 'Update Status',
        newStatus: 'New Status',
        internalNote: 'Internal Note',
        updateClaimStatus: 'Update Claim Status',
        dangerZone: 'Danger Zone',
        deleteClaimNote: 'Deleting a claim is permanent and cannot be undone.',
        deleteClaim: 'Delete Claim',

        // AI Agent
        aiAgentTitle: '🤖 AI Skill Agent',
        aiSuggestion: 'AI Suggestion:',
        aiRationale: 'Rationale:',
        aiAnalyzing: 'AI is analyzing...',
        aiLowConfidence: 'AI is unsure, please review manually',

        // Statuses
        statusNEW: 'New',
        statusNEED_MORE_INFO: 'Need Info',
        statusAPPROVED: 'Approved',
        statusRECEIVED: 'Received',
        statusIN_REPAIR: 'In Repair',
        statusCOMPLETED: 'Completed',
        statusREJECTED: 'Rejected',
        statusCANCELLED: 'Cancelled',
        noClaimsFound: 'No claims found',
        searchButton: 'Search',
        by: 'by',
        internalNotePlaceholder: 'Enter internal note here...',
        claimNotFound: 'Claim not found',
        applySuggestion: 'Apply Suggestion',
        uploadFile: 'Upload File/Photo',
        clickToUpload: 'Click to select file',
        orDragDrop: 'or drag and drop here',
        fileTooLarge: 'File is too large (max 10MB)',
        uploadedFiles: 'Uploaded Files',
        fileTypePurchaseProof: 'Purchase Proof',
        fileTypeSerialPhoto: 'Serial Photo',
        fileTypeIssuePhoto: 'Issue Photo',
        fileTypeIssueVideo: 'Issue Video',
        fileTypeOther: 'Other',
        totalClaims: 'Total Claims',
        pendingClaims: 'Pending',
        activeRepairs: 'In Repair',
        completedCases: 'Completed',
        recentActivity: 'Recent Activity',
    },
};
