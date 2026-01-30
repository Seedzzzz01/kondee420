
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    if (!brand) {
        return NextResponse.json({ error: 'Brand is required' }, { status: 400 });
    }

    try {
        const models = await prisma.warrantyModel.findMany({
            where: {
                brand: brand,
            },
            orderBy: {
                modelKey: 'asc', // Or whatever name sorting we prefer
            },
        });

        return NextResponse.json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
    }
}
