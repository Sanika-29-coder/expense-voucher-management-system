const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

async function resetPassword() {
    const password = "Director@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        UPDATE users
        SET password = ?
        WHERE email = ?
    `;

    db.query(sql, [hashedPassword, "director@test.com"], (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.log("Password reset successfully!");
        console.log("Email: director@test.com");
        console.log("Password: Director@123");

        db.end();
    });
}

resetPassword();
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const allowedRoles = ['EMPLOYEE', 'DIRECTOR', 'ACCOUNTS'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({
                            message: 'Email already exists'
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        message: 'Registration failed'
                    });
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    userId: result.insertId
                });
            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Server error'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = results[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};
module.exports = {
    register,
    login
};