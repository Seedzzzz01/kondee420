
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const models = await prisma.warrantyModel.findMany({
        take: 5,
        select: {
            brand: true,
            modelKey: true,
            warrantyStartRuleTh: true,
            warrantyStartRuleEn: true,
            requiredDocsTh: true,
            requiredDocsEn: true,
            claimStepsTh: true,
            claimStepsEn: true,
            coverageDetailTh: true,
            coverageDetailEn: true,
            coverageSummaryTh: true,
            coverageSummaryEn: true
        }
    });

    console.log(JSON.stringify(models, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
