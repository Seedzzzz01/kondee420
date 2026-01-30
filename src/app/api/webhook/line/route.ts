import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('LINE Webhook received:', JSON.stringify(body, null, 2));

        const events = body.events || [];
        for (const event of events) {
            const source = event.source;
            if (source.type === 'group') {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🎯 FOUND GROUP ID:', source.groupId);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            } else if (source.type === 'user') {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('👤 FOUND USER ID:', source.userId);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
