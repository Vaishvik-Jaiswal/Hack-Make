exports.getExportReadiness = async (req, res) => {
    const sellerId = req.params.id;
    try {
        const product = await db.query('SELECT certifications, packaging_type FROM products WHERE vendor_id = ? ORDER BY created_at DESC LIMIT 1', [sellerId]);
        if (!product.length) return res.status(404).json({ message: 'No products found for this seller.' });

        const { certifications, packaging_type } = product[0];
        let score = 0;
        const suggestions = [];

        // Scoring Logic
        const certs = certifications.split(',');
        if (certs.includes('GI Tag')) score += 20;
        if (certs.includes('ZED')) score += 20;
        if (certs.includes('FSSAI')) score += 10;

        // Packaging Logic
        switch (packaging_type) {
            case 'Retail Ready': score += 50; break;
            case 'Vacuum Sealed': score += 35; break;
            case 'Sealed Food-Grade': score += 25; break;
            case 'Basic Packed': score += 10; break;
            case 'Loose': score += 0; break;
        }

        // Suggestions Logic
        if (!certs.includes('GI Tag')) suggestions.push('Apply for GI Tag to protect your regional brand.');
        if (!certs.includes('ZED')) suggestions.push('Consider obtaining ZED certification for quality assurance.');
        if (!certs.includes('FSSAI')) suggestions.push('Get FSSAI certification for food safety compliance.');
        if (packaging_type !== 'Retail Ready') suggestions.push('Upgrade to Retail Ready packaging for better marketability.');

        return res.json({ score, suggestions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};