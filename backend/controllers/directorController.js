const db = require('../config/db');

const getAllVouchers = (req, res) => {

    const {
        voucher_number,
        employee_name,
        department,
        category,
        status,
        start_date,
        end_date,
        min_amount,
        max_amount,
        sort_by,
        sort_order
    } = req.query;

    let sql = `
        SELECT
            v.*,
            u.name AS employee_name,
            u.email AS employee_email
        FROM vouchers v
        JOIN users u
            ON v.employee_id = u.id
        WHERE 1 = 1
    `;

    const values = [];

    if (voucher_number) {
        sql += ` AND v.voucher_number LIKE ?`;
        values.push(`%${voucher_number}%`);
    }

    if (employee_name) {
        sql += ` AND u.name LIKE ?`;
        values.push(`%${employee_name}%`);
    }

    if (department) {
        sql += ` AND v.department_name = ?`;
        values.push(department);
    }

    if (category) {
        sql += ` AND v.expense_category = ?`;
        values.push(category);
    }

    if (status) {
        sql += ` AND v.status = ?`;
        values.push(status);
    }

    if (start_date) {
        sql += ` AND v.expense_date >= ?`;
        values.push(start_date);
    }

    if (end_date) {
        sql += ` AND v.expense_date <= ?`;
        values.push(end_date);
    }

    if (min_amount) {
        sql += ` AND v.amount >= ?`;
        values.push(min_amount);
    }

    if (max_amount) {
        sql += ` AND v.amount <= ?`;
        values.push(max_amount);
    }

    const allowedSortColumns = {
        voucher_number: 'v.voucher_number',
        employee_name: 'u.name',
        department: 'v.department_name',
        category: 'v.expense_category',
        amount: 'v.amount',
        status: 'v.status',
        expense_date: 'v.expense_date',
        created_at: 'v.created_at'
    };

    const sortColumn =
        allowedSortColumns[sort_by] || 'v.created_at';

    const order =
        sort_order && sort_order.toUpperCase() === 'ASC'
            ? 'ASC'
            : 'DESC';

    sql += ` ORDER BY ${sortColumn} ${order}`;

    db.query(sql, values, (err, results) => {

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
const getPendingVouchers = (req, res) => {

    const sql = `
        SELECT
            v.*,
            u.name AS employee_name,
            u.email AS employee_email
        FROM vouchers v
        JOIN users u
            ON v.employee_id = u.id
        WHERE v.status = 'PENDING_APPROVAL'
        ORDER BY v.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch pending vouchers'
            });
        }

        res.json({
            vouchers: results
        });
    });
};

const getVoucherDetails = (req, res) => {

    const voucherId = req.params.id;

    const sql = `
        SELECT
            v.*,
            u.name AS employee_name,
            u.email AS employee_email
        FROM vouchers v
        JOIN users u
            ON v.employee_id = u.id
        WHERE v.id = ?
    `;

    db.query(sql, [voucherId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch voucher details'
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
    });
};

const approveVoucher = (req, res) => {

    const voucherId = req.params.id;

    if (!req.file) {
        return res.status(400).json({
            message: 'Director signature is required'
        });
    }

    const directorSignature = req.file.path;

    const sql = `
        UPDATE vouchers
        SET
            director_signature = ?,
            status = 'APPROVED',
            approval_date = NOW()
        WHERE id = ?
        AND status = 'PENDING_APPROVAL'
    `;

    db.query(
        sql,
        [directorSignature, voucherId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to approve voucher'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'Voucher cannot be approved. It may not be pending approval.'
                });
            }

            res.json({
                message: 'Voucher approved successfully',
                status: 'APPROVED',
                approval_date: new Date(),
                director_signature: directorSignature
            });
        }
    );
};
const rejectVoucher = (req, res) => {

    const voucherId = req.params.id;
    const { rejection_reason } = req.body;

    if (!rejection_reason || rejection_reason.trim() === '') {
        return res.status(400).json({
            message: 'Rejection reason is required'
        });
    }

    const sql = `
        UPDATE vouchers
        SET
            status = 'REJECTED',
            rejection_reason = ?
        WHERE id = ?
        AND status = 'PENDING_APPROVAL'
    `;

    db.query(
        sql,
        [rejection_reason, voucherId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to reject voucher'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'Voucher cannot be rejected. It may not be pending approval.'
                });
            }

            res.json({
                message: 'Voucher rejected successfully',
                status: 'REJECTED',
                rejection_reason: rejection_reason
            });
        }
    );
};

const getDashboard = (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*)
             FROM vouchers
             WHERE status = 'PENDING_APPROVAL') AS pending_approval_count,

            (SELECT COUNT(*)
             FROM vouchers
             WHERE status = 'APPROVED'
             AND DATE(approval_date) = CURDATE()) AS approved_today,

            (SELECT COUNT(*)
             FROM vouchers
             WHERE status = 'REJECTED'
             AND DATE(updated_at) = CURDATE()) AS rejected_today,

            (SELECT COALESCE(SUM(amount), 0)
             FROM vouchers
             WHERE status = 'PENDING_APPROVAL') AS total_pending_amount
    `;

    db.query(sql, (err, summaryResults) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch dashboard data'
            });
        }

        const activitySql = `
            SELECT
                v.id,
                v.voucher_number,
                v.expense_title,
                v.amount,
                v.status,
                v.updated_at,
                u.name AS employee_name
            FROM vouchers v
            JOIN users u
                ON v.employee_id = u.id
            ORDER BY v.updated_at DESC
            LIMIT 5
        `;

        db.query(activitySql, (err, activityResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to fetch recent activity'
                });
            }

            res.json({
                summary: summaryResults[0],
                recent_activity: activityResults
            });
        });
    });
};
module.exports = {
    getAllVouchers,
    getPendingVouchers,
    getVoucherDetails,
    approveVoucher,
    rejectVoucher,
    getDashboard
};