        const pool = require('../config/database');

        exports.saveProfile = async (req, res) => {
        try {
            const { phone, name, email, org_type, gst_no, district_name } = req.body;

            // Validate required fields
            if (!phone || !name || !org_type || !district_name) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: phone, name, org_type, district_name',
            });
            }

            // Validate org_type
        const validOrgTypes = [
        'INDIVIDUAL',
        'PROPRIETORSHIP',
        'PARTNERSHIP',
        'COMPANY',
        'CO_OPERATIVE',
        'JOINT_VENTURE',
        'TRUST',
        'SOCIETY',
        'LLP',
        'PSU_CENTRAL',
        'PSU_STATE',
        'NOT_REGISTERED_IN_INDIA'
        ];
        if (!validOrgTypes.includes(org_type)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid org_type.',
        });
        }

            const connection = await pool.getConnection();
            try {
            // Update buyer profile
            await connection.execute(
                `UPDATE buyers SET name = ?, email = ?, org_type = ?, gst_no = ?, district_name = ?, is_profile_complete = true, updated_at = NOW() WHERE phone = ?`,
                [name.trim(), email ? email.trim() : null, org_type, gst_no ? gst_no.trim() : null, district_name.trim(), phone]
            );

            // Get updated buyer data
            const [buyers] = await connection.execute(
                'SELECT id, phone, name, email, org_type, gst_no, district_name, is_profile_complete FROM buyers WHERE phone = ?',
                [phone]
            );

            if (buyers.length === 0) {
                return res.status(404).json({
                success: false,
                message: 'Buyer not found.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Profile saved successfully',
                data: {
                buyer: buyers[0],
                },
            });
            } finally {
            connection.release();
            }
        } catch (error) {
            console.error('Save Profile Error:', error);
            res.status(500).json({
            success: false,
            message: 'Error saving profile. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            });
        }
        };