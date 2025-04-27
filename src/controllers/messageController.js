const db = require('../db');

exports.sendMessage = (req, res) => {
    const { recipient, message_body } = req.body;
    const userId = req.userId;

    if (!recipient || !message_body) return res.status(400).send('Missing fields');

    db.query('INSERT INTO messages (user_id, recipient, message_body) VALUES (?, ?, ?)', 
        [userId, recipient, message_body], (err, results) => {
            if (err) return res.status(500).send('Error sending message');
            res.status(201).send('Message sent successfully');
        }
    );
};

exports.dashboard = (req, res) => {
    const userId = req.userId;

    db.query('SELECT COUNT(*) as messageCount FROM messages WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Error fetching dashboard data');

        res.json({
            messagesSent: results[0].messageCount
        });
    });
};
