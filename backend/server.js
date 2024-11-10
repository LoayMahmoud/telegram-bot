const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create Telegram Bot
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Endpoint to get user data
app.get('/api/user', async (req, res) => {
  const chatId = req.query.chatId;
  let user = await User.findOne({ chatId });

  if (!user) {
    user = new User({ chatId, name: 'User Name' }); // Replace 'User Name' with actual name if available
    await user.save();
  }

  res.json(user);
});

// Endpoint to increase points
app.post('/api/increase-points', async (req, res) => {
  const { chatId } = req.body;
  const user = await User.findOneAndUpdate(
    { chatId },
    { $inc: { points: 1 } },
    { new: true }
  );

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.json(user);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle /start command from Telegram bot
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name || 'User'; // Get user's first name

  let user = await User.findOne({ chatId });
  if (!user) {
    user = new User({ chatId, name });
    await user.save();
  }

  // Send welcome message and user data including chat ID
  bot.sendMessage(chatId, `Welcome ${name}! Click the circle to increase your points.`);
});