// 必要なモジュールを読み込む
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ルーティング用のコントローラーを読み込む
const authController = require('./controllers/authController');
const messageController = require('./controllers/messageController');
const subscriptionController = require('./controllers/subscriptionController');
const authMiddleware = require('./middlewares/authMiddleware');

// 環境変数読み込み
dotenv.config();

// expressアプリ作成
const app = express();

// CORS設定
const corsOptions = {
  origin: '*', // 全部許可（あとでドメイン限定できる）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// JSONボディパーサー
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

// サーバー起動
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
