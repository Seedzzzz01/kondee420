
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const brands = await prisma.warrantyModel.findMany({
            select: {
                brand: true,
            },
            distinct: ['brand'],
            orderBy: {
                brand: 'asc',
            },
        });

        return NextResponse.json(brands.map((b: { brand: string }) => b.brand));
    } catch (error: any) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({
            error: 'Failed to fetch brands',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
