
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: claimId } = await params;

    try {
        const claim = await prisma.claim.findUnique({
            where: { claimId },
            select: {
                claimId: true,
                status: true,
                createdAt: true,
                brand: true,
                modelName: true,
                customerFirstName: true,
                customerLastName: true,
                statusHistory: {
                    orderBy: {
                        changedAt: 'desc'
                    },
                    select: {
                        newStatus: true,
                        note: true,
                        changedAt: true
                    }
                }
            }
        });

        if (!claim) {
            return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json(claim);
    } catch (error) {
        console.error('Track API error:', error);
        return NextResponse.json({ error: 'Failed to fetch claim status' }, { status: 500 });
    }
}
