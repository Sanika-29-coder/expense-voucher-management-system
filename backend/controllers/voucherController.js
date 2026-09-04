const db = require('../config/db');

const createVoucher = (req, res) => {
    const {
        voucher_date,
        expense_date,
        department_name,
        expense_title,
        expense_category,
        expense_description,
        amount
    } = req.body;

    // Required field validation
    if (
        !voucher_date ||
        !expense_date ||
        !department_name ||
        !expense_title ||
        !amount
    ) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    // Amount validation
    if (amount <= 0) {
        return res.status(400).json({
            message: 'Amount must be greater than 0'
        });
    }

    // Generate unique voucher number
    const voucherNumber =
        'VCH-' + Date.now();

    const sql = `
        INSERT INTO vouchers (
            voucher_number,
            voucher_date,
            expense_date,
            department_name,
            expense_title,
            expense_category,
            expense_description,
            amount,
            employee_id,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT')
    `;

    db.query(
        sql,
        [
            voucherNumber,
            voucher_date,
            expense_date,
            department_name,
            expense_title,
            expense_category,
            expense_description,
            amount,
            req.user.id
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to create voucher'
                });
            }

            res.status(201).json({
                message: 'Voucher created successfully',
                voucherId: result.insertId,
                voucherNumber: voucherNumber,
                status: 'DRAFT'
            });
        }
    );
};


const getMyVouchers = (req, res) => {

    const sql = `
        SELECT *
        FROM vouchers
        WHERE employee_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch vouchers'
            });
        }

        res.json({
            vouchers: results
        });
    });
};

const getVoucherById = (req, res) => {

    const voucherId = req.params.id;

    const sql = `
        SELECT
            v.*,
            u.name AS employee_name
        FROM vouchers v
        JOIN users u
            ON v.employee_id = u.id
        WHERE v.id = ?
        AND v.employee_id = ?
    `;

    db.query(
        sql,
        [voucherId, req.user.id],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to fetch voucher'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Voucher not found'
                });
            }

            res.json({
                voucher: results[0]
            });
        }
    );
};

const updateVoucher = (req, res) => {

    const voucherId = req.params.id;

    const {
        voucher_date,
        expense_date,
        department_name,
        expense_title,
        expense_category,
        expense_description,
        amount
    } = req.body;

    const formattedVoucherDate = voucher_date
    ? voucher_date.substring(0, 10)
    : voucher_date;

    if (
        !voucher_date ||
        !expense_date ||
        !department_name ||
        !expense_title ||
        !amount
    ) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            message: 'Amount must be greater than 0'
        });
    }

    const sql = `
        UPDATE vouchers
        SET
            voucher_date = ?,
            expense_date = ?,
            department_name = ?,
            expense_title = ?,
            expense_category = ?,
            expense_description = ?,
            amount = ?
        WHERE id = ?
        AND employee_id = ?
        AND status = 'DRAFT'
    `;

    db.query(
        sql,
        [
            formattedVoucherDate,
            expense_date,
            department_name,
            expense_title,
            expense_category,
            expense_description,
            amount,
            voucherId,
            req.user.id
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to update voucher'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Voucher not found or cannot be edited'
                });
            }

            res.json({
                message: 'Voucher updated successfully'
            });
        }
    );
};

const deleteVoucher = (req, res) => {

    const voucherId = req.params.id;

    const sql = `
        DELETE FROM vouchers
        WHERE id = ?
        AND employee_id = ?
        AND status = 'DRAFT'
    `;

    db.query(
        sql,
        [voucherId, req.user.id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to delete voucher'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Voucher not found or cannot be deleted'
                });
            }

            res.json({
                message: 'Voucher deleted successfully'
            });
        }
    );
};

const uploadEmployeeSignature = (req, res) => {

    const voucherId = req.params.id;

    if (!req.file) {
        return res.status(400).json({
            message: 'Signature image is required'
        });
    }

    const signaturePath = req.file.path;

    const sql = `
        UPDATE vouchers
        SET employee_signature = ?
        WHERE id = ?
        AND employee_id = ?
        AND status = 'DRAFT'
    `;

    db.query(
        sql,
        [signaturePath, voucherId, req.user.id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to upload signature'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Voucher not found or cannot be updated'
                });
            }

            res.json({
                message: 'Employee signature uploaded successfully',
                signature: signaturePath
            });
        }
    );
};

const submitVoucher = (req, res) => {

    const voucherId = req.params.id;

    const sql = `
        UPDATE vouchers
        SET status = 'PENDING_APPROVAL'
        WHERE id = ?
        AND employee_id = ?
        AND status = 'DRAFT'
        AND employee_signature IS NOT NULL
    `;

    db.query(
        sql,
        [voucherId, req.user.id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to submit voucher'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'Voucher cannot be submitted. Make sure it is a Draft and employee signature is uploaded.'
                });
            }

            res.json({
                message: 'Voucher submitted successfully',
                status: 'PENDING_APPROVAL'
            });
        }
    );
};
const getDashboard = (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS total_vouchers,

            SUM(CASE
                WHEN status = 'DRAFT' THEN 1
                ELSE 0
            END) AS draft,

            SUM(CASE
                WHEN status = 'PENDING_APPROVAL' THEN 1
                ELSE 0
            END) AS pending_approval,

            SUM(CASE
                WHEN status = 'APPROVED' THEN 1
                ELSE 0
            END) AS approved,

            SUM(CASE
                WHEN status = 'REJECTED' THEN 1
                ELSE 0
            END) AS rejected,

            COALESCE(SUM(amount), 0) AS total_amount_claimed

        FROM vouchers
        WHERE employee_id = ?
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch dashboard data'
            });
        }

        res.json({
            dashboard: results[0]
        });
    });
};
module.exports = {
    createVoucher,
    getMyVouchers,
    getVoucherById,
    updateVoucher,
    deleteVoucher,
    uploadEmployeeSignature,
    submitVoucher,
    getDashboard
};