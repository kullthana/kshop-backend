const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { generateToken } = require('./jwtUtils');

const router = express.Router();

// User registration
router.post('/register', (req, res) => {
    const { username, password, email, first_name, last_name } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });
        const query = `INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [username, hashedPassword, email, first_name, last_name], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error registering user' });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        
        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.status(401).json({ message: 'Invalid credentials' });

            const token = generateToken(user);
            res.json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;
