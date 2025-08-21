#!/bin/bash

echo "🔥 Starting Habit Streak Tracker..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't seem to be running."
    echo "   Please start MongoDB or ensure it's running on localhost:27017"
    echo "   You can start it with: sudo systemctl start mongod"
    echo ""
fi

# Start backend
echo "🚀 Starting backend server..."
cd backend
npm install
echo "📦 Backend dependencies installed"

# Check if config.env exists
if [ ! -f "config.env" ]; then
    echo "⚠️  config.env not found. Creating from template..."
    echo "MONGODB_URI=mongodb://localhost:27017/habitstreak" > config.env
    echo "JWT_SECRET=your-super-secret-jwt-key-change-in-production" >> config.env
    echo "PORT=3000" >> config.env
    echo "✅ config.env created. Please update JWT_SECRET for production."
fi

# Start backend in background
npm start &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:3000"

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm install
echo "📦 Frontend dependencies installed"

# Start frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:4200"

echo ""
echo "🎉 Habit Streak Tracker is running!"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
