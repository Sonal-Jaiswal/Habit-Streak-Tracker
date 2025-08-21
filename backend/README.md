# Habit Streak Tracker - Backend API

A full-featured MEAN stack backend for tracking daily habits with gamification features.

## Features

- 🔐 User authentication with JWT
- 📊 Habit management (CRUD operations)
- 🔥 Streak tracking and calculation
- 🎮 Gamification system (XP, levels, achievements)
- 📅 Daily habit completion tracking
- 📈 Statistics and analytics
- 🎨 Customizable habit colors and categories

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `config.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/habitstreak
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile

### Habits
- `POST /api/habits` - Create new habit
- `GET /api/habits` - Get user's habits
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Habit Completion
- `POST /api/habits/:id/complete` - Mark habit as completed
- `DELETE /api/habits/:id/complete/:date` - Uncomplete habit for date

### Analytics
- `GET /api/habits/:id/stats` - Get habit statistics
- `GET /api/dashboard` - Get user dashboard data

## Data Models

### User
- username, email, password
- level, experience, totalStreaks
- createdAt

### Habit
- userId, name, description, category, color
- dates array with completion data
- currentStreak, longestStreak, totalCompletions
- isActive flag

### HabitCompletion
- userId, habitId, date, completed, notes
- createdAt timestamp

## Gamification System

- **Experience Points**: Earn 10 XP for each habit completion
- **Leveling**: Every 100 XP = 1 level
- **Streak Bonuses**: Level up bonuses for maintaining streaks
- **Achievement Tracking**: Total streaks and completion milestones

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

## Development

The server runs on `http://localhost:3000` by default.

Use `npm run dev` for development with auto-restart on file changes.
