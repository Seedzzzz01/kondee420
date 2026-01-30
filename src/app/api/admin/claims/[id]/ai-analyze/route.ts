import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { lang } = await request.json();
        const claim = await prisma.claim.findUnique({
            where: { id },
            include: {
                attachments: true,
                warrantyModel: true,
            },
        });

        if (!claim) {
            return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
        }

        // AI Analysis Logic (Mocked AI Agent)
        const desc = (claim.issueDescription || '').toLowerCase();
        let suggestion = {
            status: 'APPROVED',
            rationale: lang === 'th'
                ? 'อาการเสียตรงกับข้อมูลความคลาดเคลื่อนจากการผลิตในระดับปกติ'
                : 'Issue seems consistent with normal manufacturing defects or wear.',
            confidence: 'high'
        };

        // Rule-based logic simulating AI reasoning
        if (desc.includes('ตก') || desc.includes('drop') || desc.includes('fall') || desc.includes('ชน') || desc.includes('crash')) {
            suggestion = {
                status: 'REJECTED',
                rationale: lang === 'th'
                    ? 'พบการระบุอาการที่เกิดจากการกระแทกหรืออุบัติเหตุ ซึ่งไม่อยู่ในเงื่อนไขการรับประกันมาตรฐาน'
                    : 'Issue mentions physical impact (drop/crash), which is typically not covered under standard warranty.',
                confidence: 'high'
            };
        } else if (desc.includes('น้ำ') || desc.includes('water') || desc.includes('liquid') || desc.includes('ชื้น') || desc.includes('moist')) {
            suggestion = {
                status: 'REJECTED',
                rationale: lang === 'th'
                    ? 'ตรวจพบความเป็นไปได้ของความเสียหายจากของเหลว จำเป็นต้องตรวจสอบเครื่องจริงเพื่อยืนยัน'
                    : 'Potential liquid damage detected in description. Requires physical inspection to confirm.',
                confidence: 'high'
            };
        } else if (desc.length < 15) {
            suggestion = {
                status: 'NEED_MORE_INFO',
                rationale: lang === 'th'
                    ? 'ข้อมูลรายละเอียดอาการค่อนข้างน้อยเกินไป ไม่สามารถวินิจฉัยสาเหตุที่แน่ชัดได้'
                    : 'Description is too short to determine the cause. Need more details from customer.',
                confidence: 'low'
            };
        } else if (desc.includes('ซ่อม') || desc.includes('repair') || desc.includes('แกะ') || desc.includes('open')) {
            suggestion = {
                status: 'REJECTED',
                rationale: lang === 'th'
                    ? 'มีการระบุถึงการพยายามซ่อมแซมหรือดัดแปลงเอง ซึ่งอาจทำให้ประกันสิ้นสุด'
                    : 'Signs of external repair/tampering mentioned, which may void the warranty.',
                confidence: 'high'
            };
        }

        // Return the analysis
        return NextResponse.json(suggestion);

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze claim' }, { status: 500 });
    }
}
