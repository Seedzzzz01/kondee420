import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const brand = searchParams.get('brand');
        const search = searchParams.get('search');

        const where: any = {};
        if (status) where.status = status;
        if (brand) where.brand = brand;
        if (search) {
            where.OR = [
                { claimId: { contains: search } },
                { customerFirstName: { contains: search } },
                { customerLastName: { contains: search } },
                { modelName: { contains: search } },
            ];
        }

        const claims = await prisma.claim.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                statusHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        return NextResponse.json(claims);
    } catch (error) {
        console.error('Admin Claims Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch claims' },
            { status: 500 }
        );
    }
}
