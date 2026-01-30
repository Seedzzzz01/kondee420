import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ClaimStatus } from '@/lib/types';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const claim = await prisma.claim.findUnique({
            where: { id },
            include: {
                attachments: true,
                statusHistory: {
                    orderBy: { changedAt: 'desc' },
                },
            },
        });

        if (!claim) {
            return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json(claim);
    } catch (error) {
        console.error('Admin Claim Detail Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch claim detail' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, note } = body as { status: ClaimStatus; note?: string };

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedClaim = await prisma.$transaction(async (tx) => {
            // Get current status before update
            const currentClaim = await tx.claim.findUnique({
                where: { id },
                select: { status: true }
            });

            if (!currentClaim) {
                throw new Error('Claim not found');
            }

            const updated = await tx.claim.update({
                where: { id },
                data: { status },
            });

            await tx.claimStatusHistory.create({
                data: {
                    claimId: id,
                    oldStatus: currentClaim.status,
                    newStatus: status,
                    note: note || `Status updated to ${status}`,
                    changedBy: 'Admin',
                },
            });

            return updated;
        });

        return NextResponse.json(updatedClaim);
    } catch (error: any) {
        console.error('Admin Claim Update Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to update claim status',
                details: error.message || String(error)
            },
            { status: 500 }
        );
    }
}
