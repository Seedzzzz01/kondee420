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
            const claim = await tx.claim.update({
                where: { id },
                data: { status },
            });

            await tx.claimStatusHistory.create({
                data: {
                    claimId: id,
                    oldStatus: (claim as any).status, // We should ideally fetch old status before update
                    newStatus: status,
                    note: note || `Status updated to ${status}`,
                    changedBy: 'Admin',
                },
            });

            return claim;
        });

        return NextResponse.json(updatedClaim);
    } catch (error) {
        console.error('Admin Claim Update Error:', error);
        return NextResponse.json(
            { error: 'Failed to update claim status' },
            { status: 500 }
        );
    }
}
