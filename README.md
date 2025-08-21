# 🔥 Habit Streak Tracker

A full-featured MEAN stack application for tracking daily habits with gamification features, beautiful UI, and GitHub-style contribution graphs.

## ✨ Features

### 🎯 Core Functionality
- **Daily Habit Tracking**: Create and manage multiple daily habits
- **Streak Counting**: Track current and longest streaks for each habit
- **Calendar Heatmap**: GitHub-style contribution graph showing daily progress
- **Gamification**: XP system, levels, and achievements

### 🔐 User Management
- **Authentication**: JWT-based user registration and login
- **User Profiles**: View progress, levels, and achievements
- **Personal Dashboard**: Overview of all habits and statistics

### 🎨 Beautiful UI/UX
- **Modern Design**: Glassmorphism effects and smooth animations
- **Responsive Layout**: Works perfectly on all devices
- **Bootstrap Integration**: Professional styling with custom CSS
- **Interactive Elements**: Hover effects and smooth transitions

### 📊 Analytics & Insights
- **Progress Tracking**: Visual progress bars and statistics
- **Habit Categories**: Organize habits by type (Health, Learning, etc.)
- **Completion History**: Track when habits were completed
- **Performance Metrics**: Success rates and streak analytics

## 🛠️ Tech Stack

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Express-validator for input validation
- **CORS**: Cross-origin resource sharing enabled

### Frontend (Angular)
- **Framework**: Angular 17 (Standalone Components)
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: Bootstrap Icons
- **Routing**: Angular Router with lazy loading
- **Forms**: Reactive Forms with validation
- **HTTP**: Angular HttpClient for API calls

### Database
- **MongoDB**: NoSQL database for flexible data storage
- **Schemas**: User, Habit, and HabitCompletion models
- **Relationships**: User-habit associations and completion tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Angular CLI (for frontend development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Habit-Streak
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create config.env file
   cp config.env.example config.env
   # Edit config.env with your MongoDB URI and JWT secret
   
   # Start the server
   npm run dev  # Development mode with auto-restart
   # or
   npm start    # Production mode
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm start
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Update `config.env` with your MongoDB Atlas connection string

### Environment Variables

Create a `backend/config.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/habitstreak
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

## 📱 Usage

### Creating Habits
1. Register/Login to your account
2. Navigate to the Habits page
3. Click "New Habit" to create a habit
4. Choose a name, category, description, and color
5. Save your habit

### Tracking Daily Progress
1. View your habits on the dashboard
2. Click "Mark Complete" for habits you've completed today
3. Watch your streaks build up! 🔥
4. Earn XP and level up with each completion

### Viewing Progress
- **Dashboard**: Overview of all habits and statistics
- **Calendar**: GitHub-style heatmap showing daily completion
- **Profile**: Your level, XP, and achievements

## 🏗️ Project Structure

```
Habit-Streak/
├── backend/                 # Node.js + Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── config.env          # Environment variables
│   └── README.md           # Backend documentation
├── frontend/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/   # Feature modules
│   │   │   │   ├── auth/   # Authentication
│   │   │   │   ├── dashboard/ # Dashboard
│   │   │   │   ├── habits/ # Habit management
│   │   │   │   ├── calendar/ # Calendar heatmap
│   │   │   │   └── profile/ # User profile
│   │   │   ├── services/   # Shared services
│   │   │   ├── guards/     # Route guards
│   │   │   └── app.component.ts # Main app component
│   │   ├── styles.css      # Global styles
│   │   └── main.ts         # Application entry point
│   ├── angular.json        # Angular configuration
│   ├── package.json        # Frontend dependencies
│   └── tsconfig.json       # TypeScript configuration
└── README.md               # This file
```

## 🔌 API Endpoints

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

## 🎮 Gamification System

- **Experience Points**: Earn 10 XP for each habit completion
- **Leveling**: Every 100 XP = 1 level
- **Streak Bonuses**: Level up bonuses for maintaining streaks
- **Achievement Tracking**: Total streaks and completion milestones

## 🎨 Customization

### Colors
- Each habit can have a custom color
- Pre-defined color palette available
- Colors are used in the calendar heatmap

### Categories
- Health & Fitness
- Learning & Growth
- Productivity
- Mindfulness
- Social
- Other

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure MongoDB Atlas for production database
4. Set up proper CORS settings

### Frontend Deployment
1. Build the application: `ng build --prod`
2. Deploy the `dist/` folder to your hosting service
3. Configure routing for SPA (Single Page Application)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Bootstrap**: For the beautiful UI components
- **Angular**: For the powerful frontend framework
- **MongoDB**: For the flexible database solution
- **GitHub**: Inspiration for the contribution graph

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Happy Habit Tracking! 🔥✨**
