
const LINE_PUSH_API = 'https://api.line.me/v2/bot/message/push';

async function main() {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

    console.log('Verifying LINE credentials in .env...');
    console.log('Group ID:', groupId);

    if (!token || !groupId) {
        console.error('❌ LINE_CHANNEL_ACCESS_TOKEN or LINE_GROUP_ID is missing');
        process.exit(1);
    }

    try {
        const message = `🔔 LINE Verification Test
━━━━━━━━━━━━━
Time: ${new Date().toLocaleString()}
Status: Standalone verification of .env credentials.`;

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
            console.error('❌ LINE Messaging API error:', error);
            process.exit(1);
        }

        console.log('✅ LINE message sent successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to send LINE message:', error.message);
        process.exit(1);
    }
}

main();
