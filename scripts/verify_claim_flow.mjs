const baseUrl = 'http://localhost:3000';

async function main() {
    try {
        console.log('Starting verification...');

        // 1. Fetch Brands
        console.log('Fetching brands...');
        const brandsRes = await fetch(`${baseUrl}/api/brands`);
        if (!brandsRes.ok) throw new Error(`Failed to fetch brands: ${brandsRes.status}`);
        const brands = await brandsRes.json();
        console.log('Brands found:', brands.length);
        if (!Array.isArray(brands) || brands.length === 0) throw new Error('No brands found');
        const brand = typeof brands[0] === 'string' ? brands[0] : brands[0].name;

        // 2. Fetch Models
        console.log(`Fetching models for brand ${brand}...`);
        const modelsRes = await fetch(`${baseUrl}/api/models?brand=${encodeURIComponent(brand)}`);
        if (!modelsRes.ok) throw new Error(`Failed to fetch models: ${modelsRes.status}`);
        const models = await modelsRes.json();
        if (!Array.isArray(models) || models.length === 0) throw new Error('No models found');

        // Assume model has modelKey or key or model_key
        const model = models[0];
        const modelKey = model.modelKey || model.key || model.model_key;
        if (!modelKey) throw new Error('Model has no key field');
        console.log(`Selected model: ${model.modelName || modelKey} (${modelKey})`);

        // 3. Get Initial Stats
        console.log('Fetching initial admin stats...');
        const statsRes1 = await fetch(`${baseUrl}/api/admin/stats`);
        if (!statsRes1.ok) throw new Error('Failed to fetch stats');
        const stats1 = await statsRes1.json();
        const initialCount = stats1.totalClaims || 0;
        console.log(`Initial Total Claims: ${initialCount}`);

        // 4. Submit Claim
        console.log('Submitting new claim...');
        const payload = {
            customerFirstName: 'Test',
            customerLastName: 'Integration',
            phone: '0998887777',
            email: 'test@example.com',
            brand: brand,
            modelKey: modelKey,
            serialNumber: 'TEST-SN-' + Date.now(),
            purchaseDate: new Date().toISOString(),
            issueDescription: 'Integration test issue',
            purchaseChannel: 'Website'
        };

        // Note: ensure api/claims accepts this payload structure
        const submitRes = await fetch(`${baseUrl}/api/claims`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!submitRes.ok) {
            const err = await submitRes.text();
            throw new Error(`Failed to submit claim: ${submitRes.status} - ${err}`);
        }

        const submitData = await submitRes.json();
        const claimId = submitData.claimId;
        if (!claimId) throw new Error('No claimId returned');
        console.log(`Claim submitted! ID: ${claimId}`);

        // 5. Verify Stats Increase
        console.log('Verifying stats update...');
        // Small delay to ensure DB update (though usually immediate)
        await new Promise(r => setTimeout(r, 1000));

        const statsRes2 = await fetch(`${baseUrl}/api/admin/stats`);
        const stats2 = await statsRes2.json();
        const newCount = stats2.totalClaims || 0;
        console.log(`New Total Claims: ${newCount}`);

        if (newCount !== initialCount + 1) {
            throw new Error(`Stats did not update correctly! Expected ${initialCount + 1}, got ${newCount}`);
        }
        console.log('✅ Stats updated correctly');

        // 6. Verify Admin List
        console.log('Verifying admin list...');
        const listRes = await fetch(`${baseUrl}/api/admin/claims`);
        if (!listRes.ok) throw new Error('Failed to fetch admin claims');
        const list = await listRes.json();
        if (!Array.isArray(list)) throw new Error('Admin claims response is not an array');

        const foundInList = list.find(c => c.claimId === claimId);
        if (!foundInList) throw new Error('New claim not found in admin claim list');
        console.log('✅ Claim found in admin list');

        // 7. Verify Status Update (to PROCESSING)
        console.log(`Updating claim ${claimId} to PROCESSING...`);
        const updateRes = await fetch(`${baseUrl}/api/admin/claims/${submitData.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'PROCESSING', note: 'Test processing status' })
        });
        if (!updateRes.ok) {
            const errData = await updateRes.json();
            throw new Error(`Failed to update to PROCESSING: ${updateRes.status} - ${errData.error} (${errData.details || 'no details'})`);
        }
        console.log('✅ Updated to PROCESSING');

        // 8. Verify Tracking with new status
        console.log('Verifying tracking after update...');
        const trackRes = await fetch(`${baseUrl}/api/track/${claimId}`);
        if (!trackRes.ok) throw new Error(`Failed to track claim: ${trackRes.status}`);
        const trackData = await trackRes.json();

        if (trackData.status !== 'PROCESSING') throw new Error(`Unexpected status after update: ${trackData.status}`);
        console.log('✅ Tracking verified after update');

        console.log('🚀 ALL VERIFICATION CHECKS PASSED');

    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error.message);
        process.exit(1);
    }
}

main();
