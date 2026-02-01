/**
 * LINE Messaging API Service
 * Sends push notifications to LINE when new claims are created
 */

const LINE_PUSH_API = 'https://api.line.me/v2/bot/message/push';

export async function sendLineMessage(message: string): Promise<{ success: boolean; error?: string }> {
    const timestamp = new Date().toISOString();
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

    console.log(`[${timestamp}] LINE Notification - Checking credentials...`);
    console.log(`[${timestamp}] LINE_CHANNEL_ACCESS_TOKEN: ${token ? `Set (${token.length} chars)` : 'NOT SET'}`);
    console.log(`[${timestamp}] LINE_GROUP_ID: ${groupId ? `Set (${groupId})` : 'NOT SET'}`);

    if (!token || !groupId) {
        const missing = [];
        if (!token) missing.push('LINE_CHANNEL_ACCESS_TOKEN');
        if (!groupId) missing.push('LINE_GROUP_ID');
        const errorMsg = `LINE Messaging API not configured. Missing: ${missing.join(', ')}`;
        console.warn(`[${timestamp}] ${errorMsg}`);
        return { success: false, error: errorMsg };
    }

    try {
        console.log(`[${timestamp}] LINE Notification - Sending to group: ${groupId}`);

        const response = await fetch(LINE_PUSH_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: groupId,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    }
                ],
            }),
        });

        const responseText = await response.text();
        console.log(`[${timestamp}] LINE API Response - Status: ${response.status}, Body: ${responseText}`);

        if (!response.ok) {
            const errorMsg = `LINE API Error ${response.status}: ${responseText}`;
            console.error(`[${timestamp}] ${errorMsg}`);
            return { success: false, error: errorMsg };
        }

        console.log(`[${timestamp}] LINE message sent successfully!`);
        return { success: true };
    } catch (error: any) {
        const errorMsg = `Failed to send LINE message: ${error.message}`;
        console.error(`[${timestamp}] ${errorMsg}`, error);
        return { success: false, error: errorMsg };
    }
}

export function formatNewClaimMessage(claim: {
    claimId: string;
    customerName: string;
    phone: string;
    brand: string;
    modelName: string;
    issueDescription: string;
    adminUrl?: string;
}): string {
    const issuePreview = claim.issueDescription.length > 50
        ? claim.issueDescription.substring(0, 50) + '...'
        : claim.issueDescription;

    let message = `🆕 เคลมใหม่!
━━━━━━━━━━━━━
📋 ID: ${claim.claimId}
👤 ลูกค้า: ${claim.customerName}
📱 โทร: ${claim.phone}
🏷️ สินค้า: ${claim.brand} - ${claim.modelName}
📝 ปัญหา: ${issuePreview}`;

    if (claim.adminUrl) {
        message += `
━━━━━━━━━━━━━
🔗 ${claim.adminUrl}`;
    }

    return message;
}
