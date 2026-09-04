const express = require('express');

const {
    getAllVouchers,
    getPendingVouchers,
    getVoucherDetails,
    approveVoucher,
    rejectVoucher,
    getDashboard
} = require('../controllers/directorController');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get(
    '/dashboard',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    getDashboard
);

router.get(
    '/vouchers/pending',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    getPendingVouchers
);

router.get(
    '/vouchers/:id',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    getVoucherDetails
);
router.put(
    '/vouchers/:id/approve',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    upload.single('signature'),
    approveVoucher
);

router.put(
    '/vouchers/:id/reject',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    rejectVoucher
);

router.get(
    '/vouchers',
    authenticateToken,
    authorizeRoles('DIRECTOR'),
    getAllVouchers
);


module.exports = router;