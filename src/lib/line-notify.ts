/**
 * LINE Messaging API Service
 * Sends push notifications to LINE when new claims are created
 */

const LINE_PUSH_API = 'https://api.line.me/v2/bot/message/push';

export async function sendLineMessage(message: string): Promise<boolean> {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

    if (!token || !groupId) {
        console.log('LINE Messaging API not configured, skipping notification');
        return false;
    }

    try {
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

        if (!response.ok) {
            const error = await response.text();
            console.error('LINE Messaging API error:', error);
            return false;
        }

        console.log('LINE message sent successfully');
        return true;
    } catch (error) {
        console.error('Failed to send LINE message:', error);
        return false;
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
