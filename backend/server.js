
require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/habitstreak';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  totalStreaks: { type: Number, default: 0 }
});

// Habit Schema
const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  color: { type: String, default: '#3B82F6' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  dates: [{
    date: { type: String, required: true }, // ISO date string
    completed: { type: Boolean, default: true },
    streak: { type: Number, default: 0 }
  }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 }
});

// Habit Completion Schema for tracking daily completions
const habitCompletionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true }, // ISO date string
  completed: { type: Boolean, default: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);
const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRegistration = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateHabit = [
  body('name').notEmpty().withMessage('Habit name is required'),
  body('category').optional().isString(),
  body('color').optional().isHexColor().withMessage('Must be a valid hex color')
];

// Routes

// User Registration
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create habit
app.post('/api/habits', authenticateToken, validateHabit, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, color } = req.body;
    const habit = new Habit({
      userId: req.user.userId,
      name,
      description,
      category,
      color: color || '#3B82F6'
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user habits
app.get('/api/habits', authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId, isActive: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get habit by ID
app.get('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update habit
app.put('/api/habits/:id', authenticateToken, validateHabit, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete habit
app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete habit for a specific date
app.post('/api/habits/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { date, notes } = req.body;
    const habitId = req.params.id;
    const userId = req.user.userId;

    // Validate date
    const targetDate = date || new Date().toISOString().slice(0, 10);
    
    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId, isActive: true });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check if already completed for this date
    const existingCompletion = await HabitCompletion.findOne({
      userId,
      habitId,
      date: targetDate
    });

    if (existingCompletion) {
      return res.status(400).json({ message: 'Habit already completed for this date' });
    }

    // Create completion record
    const completion = new HabitCompletion({
      userId,
      habitId,
      date: targetDate,
      notes
    });

    await completion.save();

    // Update habit dates array
    const dateEntry = {
      date: targetDate,
      completed: true,
      streak: 0 // Will be calculated below
    };

    habit.dates.push(dateEntry);
    habit.totalCompletions += 1;

    // Calculate streaks
    await calculateStreaks(habit);

    await habit.save();

    // Award experience points
    await awardExperience(userId, 10);

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Uncomplete habit for a specific date
app.delete('/api/habits/:id/complete/:date', authenticateToken, async (req, res) => {
  try {
    const { id, date } = req.params;
    const userId = req.user.userId;

    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({ _id: id, userId, isActive: true });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Remove completion record
    await HabitCompletion.findOneAndDelete({
      userId,
      habitId: id,
      date
    });

    // Remove from habit dates
    habit.dates = habit.dates.filter(d => d.date !== date);
    habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);

    // Recalculate streaks
    await calculateStreaks(habit);

    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get habit statistics
app.get('/api/habits/:id/stats', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const stats = {
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      totalCompletions: habit.totalCompletions,
      totalDays: habit.dates.length,
      completionRate: habit.dates.length > 0 ? (habit.totalCompletions / habit.dates.length) * 100 : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user dashboard data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user data
    const user = await User.findById(userId);
    
    // Get active habits
    const habits = await Habit.find({ userId, isActive: true });
    
    // Get today's date
    const today = new Date().toISOString().slice(0, 10);
    
    // Get today's completions
    const todayCompletions = await HabitCompletion.find({
      userId,
      date: today
    });

    // Calculate total streaks across all habits
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);

    const dashboard = {
      user: {
        level: user.level,
        experience: user.experience,
        totalStreaks: user.totalStreaks
      },
      habits: habits.length,
      activeStreaks: habits.filter(h => h.currentStreak > 0).length,
      totalStreaks,
      todayCompletions: todayCompletions.length,
      recentHabits: habits.slice(0, 5)
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to calculate streaks
async function calculateStreaks(habit) {
  if (!habit.dates || habit.dates.length === 0) {
    habit.currentStreak = 0;
    habit.longestStreak = 0;
    return;
  }

  // Sort dates in descending order
  const sortedDates = habit.dates
    .map(d => d.date)
    .sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;

    if (nextDate) {
      const diffTime = currentDate - nextDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    } else {
      tempStreak++;
    }
  }

  // Check if we have a current streak
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  
  if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
    currentStreak = tempStreak;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
}

// Helper function to award experience
async function awardExperience(userId, points) {
  const user = await User.findById(userId);
  if (!user) return;

  user.experience += points;
  
  // Level up logic (every 100 XP = 1 level)
  const newLevel = Math.floor(user.experience / 100) + 1;
  if (newLevel > user.level) {
    user.level = newLevel;
    user.totalStreaks += 1; // Bonus for leveling up
  }

  await user.save();
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Habit Streak Backend running on http://localhost:${port}`);
  console.log(`📊 MongoDB connected to ${mongoUri}`);
});
