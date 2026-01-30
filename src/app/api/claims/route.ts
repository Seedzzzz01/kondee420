
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { FILE_TYPES } from '@/lib/types';
import { sendLineMessage, formatNewClaimMessage } from '@/lib/line-notify';

// Define the schema for input validation
const claimSchema = z.object({
    customerFirstName: z.string().min(1, 'First name is required'),
    customerLastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    lineId: z.string().optional(),
    brand: z.string().min(1, 'Brand is required'),
    modelKey: z.string().min(1, 'Model is required'),
    serialNumber: z.string().min(1, 'Serial Number is required'),
    purchaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid purchase date',
    }),
    purchaseChannel: z.string().optional(),
    orderNo: z.string().optional(),
    issueDescription: z.string().min(1, 'Issue description is required'),
    issueStartDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: 'Invalid issue start date',
    }),
    issueUsageType: z.string().optional(),
    attachments: z.array(z.object({
        type: z.enum(FILE_TYPES),
        fileUrl: z.string().url(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
    })).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = claimSchema.safeParse(body);
        if (!result.success) {
            console.error('Validation failed details:', JSON.stringify(result.error.flatten(), null, 2));
            return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
        }

        const data = result.data;

        // Verify model exists
        const model = await prisma.warrantyModel.findUnique({
            where: { modelKey: data.modelKey },
        });

        if (!model) {
            return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
        }

        // Generate short human-readable ID
        const claimId = `CLM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create Claim in a transaction to ensure everything is created or nothing is
        const newClaim = await prisma.$transaction(async (tx) => {
            // 1. Create the claim
            const claim = await tx.claim.create({
                data: {
                    claimId: claimId,
                    customerFirstName: data.customerFirstName,
                    customerLastName: data.customerLastName,
                    phone: data.phone,
                    email: data.email || null,
                    lineId: data.lineId || null,
                    brand: data.brand,
                    modelKey: data.modelKey,
                    modelName: model.modelKey.split('_').pop() || model.modelKey, // Fallback if name not in model
                    serialNumber: data.serialNumber,
                    purchaseDate: new Date(data.purchaseDate),
                    purchaseChannel: data.purchaseChannel || null,
                    orderNo: data.orderNo || null,
                    issueDescription: data.issueDescription,
                    issueStartDate: data.issueStartDate ? new Date(data.issueStartDate) : null,
                    issueUsageType: data.issueUsageType || null,
                    status: 'NEW',
                },
            });

            // 2. Create attachments if any
            if (data.attachments && data.attachments.length > 0) {
                await tx.claimAttachment.createMany({
                    data: data.attachments.map((att) => ({
                        claimId: claim.id,
                        type: att.type,
                        fileUrl: att.fileUrl,
                        fileName: att.fileName,
                        fileSize: att.fileSize,
                    })),
                });
            }

            // 3. Create initial status history
            await tx.claimStatusHistory.create({
                data: {
                    claimId: claim.id,
                    oldStatus: 'NEW',
                    newStatus: 'NEW',
                    note: 'Claim created by customer',
                    changedBy: 'System',
                },
            });

            return claim;
        });

        // Send LINE notification (fire-and-forget, don't block response)
        const lineMessage = formatNewClaimMessage({
            claimId: newClaim.claimId,
            customerName: `${data.customerFirstName} ${data.customerLastName}`,
            phone: data.phone,
            brand: data.brand,
            modelName: model.modelKey.split('_').pop() || model.modelKey,
            issueDescription: data.issueDescription,
        });
        sendLineMessage(lineMessage).catch(console.error);

        return NextResponse.json({
            success: true,
            claimId: newClaim.claimId,
            id: newClaim.id
        });

    } catch (error) {
        console.error('Error creating claim:', error);
        return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
    }
}
