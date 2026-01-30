import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CLAIM_STATUSES } from '@/lib/types';

export async function GET() {
    try {
        // 1. Total claims count
        const totalClaims = await prisma.claim.count();

        // 2. Count by status
        const statusCounts = await Promise.all(
            CLAIM_STATUSES.map(async (status) => {
                const count = await prisma.claim.count({ where: { status } });
                return { status, count };
            })
        );

        // 3. Recent claims (last 5)
        const recentClaims = await prisma.claim.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                claimId: true,
                customerFirstName: true,
                customerLastName: true,
                status: true,
                createdAt: true,
            }
        });

        // 4. Weekly trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentActivity = await prisma.claim.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
        });

        return NextResponse.json({
            totalClaims,
            statusCounts,
            recentClaims,
            // Simplified trend for now
            trend: recentActivity.length
        });
    } catch (error: any) {
        console.error('Stats Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch stats',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
