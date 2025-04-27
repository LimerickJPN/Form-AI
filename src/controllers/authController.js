const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Missing fields');

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) {
            console.error('DB Error:', err);  // š’Ç‰Á‚µ‚½ƒGƒ‰[o—Í
            return res.status(500).send('Error creating user');
        }
        res.status(201).send('User created successfully');
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    });
};

exports.logout = (req, res) => {
    res.send('Logged out successfully (token invalidation should be handled client-side)');
};
