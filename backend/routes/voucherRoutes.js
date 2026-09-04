const express = require('express');

const {
    createVoucher,
    getMyVouchers,
    getVoucherById,
    updateVoucher,
    deleteVoucher,
    uploadEmployeeSignature,
    submitVoucher,
    getDashboard
} = require('../controllers/voucherController');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
    '/',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    createVoucher
);

router.get(
    '/my',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    getMyVouchers
);

router.get(
    '/dashboard',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    getDashboard
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    getVoucherById
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    updateVoucher
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    deleteVoucher
);

router.post(
    '/:id/signature',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    upload.single('signature'),
    uploadEmployeeSignature
);

router.put(
    '/:id/submit',
    authenticateToken,
    authorizeRoles('EMPLOYEE'),
    submitVoucher
);

module.exports = router;