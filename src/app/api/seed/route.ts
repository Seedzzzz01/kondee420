
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

interface WarrantyModelData {
    model_key: string;
    warranty_months: number | null;
    warranty_start_rule_th: string;
    required_docs_th: string;
    claim_steps_th: string;
    coverage_summary_th: string;
    coverage_detail_th: string;
    exclude_th: string;
    notes_th: string;
}

type WarrantyRulesJSON = Record<string, WarrantyModelData[]>;

export async function GET() {
    try {
        console.log('Start seeding from JSON data...');

        // Read the JSON file from Data folder
        const dataFilePath = path.join(process.cwd(), 'Data', 'warranty_rules.json');

        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({
                error: 'Data file not found',
                path: dataFilePath
            }, { status: 404 });
        }

        // Read and fix the JSON (Python exports NaN which isn't valid JSON)
        let jsonData = fs.readFileSync(dataFilePath, 'utf-8');
        // Replace NaN with null (only when it's a value, not part of a string)
        jsonData = jsonData.replace(/:\s*NaN\b/g, ': null');

        const warrantyRules: WarrantyRulesJSON = JSON.parse(jsonData);

        let totalCreated = 0;
        let totalUpdated = 0;

        // Iterate through each brand
        for (const [brand, models] of Object.entries(warrantyRules)) {
            for (const model of models) {
                // Handle NaN values in warranty_months
                const warrantyMonths = model.warranty_months && !isNaN(model.warranty_months)
                    ? model.warranty_months
                    : null;

                const result = await prisma.warrantyModel.upsert({
                    where: { modelKey: model.model_key },
                    update: {
                        brand: brand,
                        warrantyMonths: warrantyMonths,
                        warrantyStartRuleTh: model.warranty_start_rule_th || '',
                        requiredDocsTh: model.required_docs_th || '',
                        claimStepsTh: model.claim_steps_th || '',
                        coverageSummaryTh: model.coverage_summary_th || null,
                        coverageDetailTh: model.coverage_detail_th || null,
                        excludeTh: model.exclude_th || null,
                        notesTh: model.notes_th || null,
                    },
                    create: {
                        brand: brand,
                        modelKey: model.model_key,
                        warrantyMonths: warrantyMonths,
                        warrantyStartRuleTh: model.warranty_start_rule_th || '',
                        requiredDocsTh: model.required_docs_th || '',
                        claimStepsTh: model.claim_steps_th || '',
                        coverageSummaryTh: model.coverage_summary_th || null,
                        coverageDetailTh: model.coverage_detail_th || null,
                        excludeTh: model.exclude_th || null,
                        notesTh: model.notes_th || null,
                    },
                });

                // Simple way to track: if result.id existed before, it's an update
                if (result) {
                    totalCreated++;
                }
            }
        }

        // Clean up old sample data that's no longer in the JSON
        const validModelKeys = Object.values(warrantyRules).flat().map(m => m.model_key);
        await prisma.warrantyModel.deleteMany({
            where: {
                modelKey: {
                    notIn: validModelKeys,
                },
            },
        });

        console.log(`Seeding finished. Models: ${totalCreated}`);

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully from JSON',
            stats: {
                totalModels: totalCreated,
                brands: Object.keys(warrantyRules).length,
            }
        });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}
