const express = require("express");
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const authorizeRoles = require('./middleware/roleMiddleware');
const voucherRoutes = require('./routes/voucherRoutes');
const directorRoutes = require('./routes/directorRoutes');
const accountsRoutes = require('./routes/accountsRoutes');
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/director', directorRoutes);
app.use('/api/accounts', accountsRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'You have access to the protected route',
        user: req.user
    });
});

app.get('/api/employee-test', authenticateToken, authorizeRoles('EMPLOYEE'), (req, res) => {
    res.json({
        message: 'Employee access granted'
    });
});

app.get("/", (req, res) => {
    res.send("Expense Voucher API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});