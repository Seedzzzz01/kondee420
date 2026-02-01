
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRANSLATIONS = {
    // Start Rules
    'เริ่มนับประกันจากวันที่ซื้อสินค้า โดยยึดตามวันที่บนใบเสร็จหรือหลักฐานการชำระเงิน':
        'Warranty starts from the date of purchase, based on the receipt or proof of payment.',

    // Required Docs
    'ใบเสร็จ หรือ สลิปโอนเงิน / รูป S/N (Serial Number) บนตัวเครื่อง':
        'Receipt or payment slip / Photo of S/N (Serial Number) on the device.',

    // Claim Steps
    'หลังจากลงทะเบียนสินค้าแล้ว หากมีปัญหาให้กดเมนู “เคลมสินค้า”\nกรอกข้อมูลอาการและแนบรูป/วิดีโอ (ถ้ามี)\nแอดมินจะติดต่อกลับ และสามารถตรวจสอบสถานะได้ในเมนู “เช็กสถานะ”':
        'After registration, click "Claim" menu if there is an issue. Fill in details and attach media. Admin will contact you back. Track status in "Track" menu.',
};

function translateCoverage(th) {
    if (!th) return th;
    return th
        .replace(/ประกันตัวเครื่อง/g, 'Device Warranty')
        .replace(/ประกันตัวทำความร้อน/g, 'Heater Warranty')
        .replace(/ประกันแบตเตอรี่/g, 'Battery Warranty')
        .replace(/ระยะเวลารับประกัน/g, 'Warranty Period')
        .replace(/ประกันชิ้นส่วนโลหะ/g, 'Metal Parts Warranty')
        .replace(/ประกันฝา/g, 'Cap Warranty')
        .replace(/ประกันแก้ว/g, 'Glass Warranty')
        .replace(/กลุ่มสินค้า/g, 'Category')
        .replace(/๒/g, '2')
        .replace(/๑/g, '1')
        .replace(/ปี/g, 'Years')
        .replace(/เดือน/g, 'Months')
        .replace(/ตลอดชีพ/g, 'Lifetime')
        .replace(/ไม่รวม/g, 'Excluded')
        .replace(/ถอดเปลี่ยนได้/g, 'Replaceable')
        .replace(/ไม่มีประกัน/g, 'No Warranty')
        .replace(/วัน/g, 'Days');
}

async function main() {
    console.log('Starting warranty translation update...');
    const models = await prisma.warrantyModel.findMany();

    for (const model of models) {
        console.log(`Processing ${model.modelKey}...`);

        const update = {
            warrantyStartRuleEn: TRANSLATIONS[model.warrantyStartRuleTh] || model.warrantyStartRuleTh,
            requiredDocsEn: TRANSLATIONS[model.requiredDocsTh] || model.requiredDocsTh,
            claimStepsEn: TRANSLATIONS[model.claimStepsTh] || model.claimStepsTh,
            coverageDetailEn: translateCoverage(model.coverageDetailTh),
            coverageSummaryEn: translateCoverage(model.coverageSummaryTh),
        };

        await prisma.warrantyModel.update({
            where: { id: model.id },
            data: update
        });
    }

    console.log('Update complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
