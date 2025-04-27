const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send('No token provided');

  const token = authHeader.split(' ')[1];  // ©‚±‚±I"Bearer token"Œ`Ž®‚ð•ªŠ„‚µ‚Ä‚éI
  if (!token) return res.status(403).send('No token provided');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Verify Error:', err);
      return res.status(401).send('Failed to authenticate token');
    }
    req.userId = decoded.id;
    next();
  });
};
