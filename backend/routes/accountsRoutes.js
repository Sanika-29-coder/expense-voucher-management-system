const express = require('express');

const {
    getAllVouchers,
     getVoucherDetails,
     getDashboard
} = require('../controllers/accountsController');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
    '/dashboard',
    authenticateToken,
    authorizeRoles('ACCOUNTS'),
    getDashboard
);

router.get(
    '/vouchers/:id',
    authenticateToken,
    authorizeRoles('ACCOUNTS'),
    getVoucherDetails
);

router.get(
    '/vouchers',
    authenticateToken,
    authorizeRoles('ACCOUNTS'),
    getAllVouchers
);

module.exports = router;