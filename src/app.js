const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: '*', // まずは全部許可（後でセキュリティ強化するなら、ドメイン指定する）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const messageController = require('./controllers/messageController');
const subscriptionController = require('./controllers/subscriptionController');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Public Routes
app.post('/signup', authController.signup);
app.post('/login', authController.login);

// Protected Routes
app.post('/logout', authMiddleware.verifyToken, authController.logout);
app.post('/send-message', authMiddleware.verifyToken, messageController.sendMessage);
app.get('/dashboard', authMiddleware.verifyToken, messageController.dashboard);

// Subscription Routes
app.post('/subscribe', authMiddleware.verifyToken, subscriptionController.subscribe);
app.post('/unsubscribe', authMiddleware.verifyToken, subscriptionController.unsubscribe);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
