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
        max_amount
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

    sql += ` ORDER BY v.created_at DESC`;

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
const getDashboard = (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS total_vouchers,

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

            COALESCE(
                SUM(
                    CASE
                        WHEN status = 'APPROVED' THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS total_approved_expense_amount

        FROM vouchers
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch dashboard data'
            });
        }

        const recentSql = `
            SELECT
                v.id,
                v.voucher_number,
                v.expense_title,
                v.amount,
                v.approval_date,
                u.name AS employee_name
            FROM vouchers v
            JOIN users u
                ON v.employee_id = u.id
            WHERE v.status = 'APPROVED'
            ORDER BY v.approval_date DESC
            LIMIT 5
        `;

        db.query(recentSql, (err, recentResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to fetch recent approved vouchers'
                });
            }

            res.json({
                dashboard: results[0],
                recent_approved_vouchers: recentResults
            });
        });
    });
};

module.exports = {
    getAllVouchers,
    getVoucherDetails,
    getDashboard
};