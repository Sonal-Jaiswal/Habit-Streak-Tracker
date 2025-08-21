# 🚀 Deployment Guide for Render

This guide will help you deploy your Habit Streak Tracker application on Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Database**: You can use MongoDB Atlas (free tier available)
3. **GitHub Repository**: Your code should be pushed to GitHub

## 🗄️ Step 1: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/habit-streak`)

### Option B: Render MongoDB Service
1. In Render dashboard, create a new MongoDB service
2. Choose the free plan
3. Note the connection string

## 🔧 Step 2: Deploy Backend API

1. **Create New Web Service**:
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**:
   - **Name**: `habit-streak-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: `https://habit-streak-frontend.onrender.com` (set after frontend deployment)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for build and deployment to complete
   - Note your backend URL (e.g., `https://habit-streak-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend

1. **Create New Static Site**:
   - Go to your Render dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**:
   - **Name**: `habit-streak-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build:prod`
   - **Publish Directory**: `frontend/dist/habit-streak-frontend`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`

4. **Configure Routes** (for SPA routing):
   - Add a rewrite rule: `/*` → `/index.html`

5. **Deploy**:
   - Click "Create Static Site"
   - Wait for build and deployment to complete
   - Note your frontend URL (e.g., `https://habit-streak-frontend.onrender.com`)

## 🔗 Step 4: Update Backend Frontend URL

1. Go back to your backend service in Render
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Redeploy the backend service

## 🌍 Step 5: Test Your Deployment

1. **Test Backend API**:
   - Visit your backend URL + `/` (e.g., `https://habit-streak-backend.onrender.com/`)
   - Should see: `{"message":"Habit Streak Tracker API is running!"}`

2. **Test Frontend**:
   - Visit your frontend URL
   - Should load the Habit Streak Tracker application
   - Test registration and login functionality

## 🔧 Environment Variables Reference

### Backend Variables
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-streak
FRONTEND_URL=https://habit-streak-frontend.onrender.com
```

### Frontend Variables
```bash
NODE_ENV=production
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **MongoDB Connection Issues**:
   - Verify MongoDB connection string
   - Check if MongoDB service is running
   - Ensure network access is allowed

3. **CORS Issues**:
   - Verify FRONTEND_URL is set correctly in backend
   - Check if frontend URL matches exactly

4. **Frontend Routing Issues**:
   - Ensure rewrite rule is set: `/*` → `/index.html`
   - Check if Angular routing is working

### Useful Commands

```bash
# Test backend locally
cd backend
npm install
npm start

# Test frontend locally
cd frontend
npm install
npm run build:prod
npm start

# Check build output
ls frontend/dist/habit-streak-frontend
```

## 📱 Custom Domain (Optional)

1. **Add Custom Domain**:
   - In Render dashboard, go to your service
   - Click "Settings" → "Custom Domains"
   - Add your domain and configure DNS

2. **SSL Certificate**:
   - Render automatically provides SSL certificates
   - No additional configuration needed

## 🔄 Auto-Deployment

- Render automatically deploys when you push to your main branch
- You can disable this in service settings if needed
- Manual deployments are also available

## 💰 Cost Management

- **Free Tier**: Both services are free with limitations
- **Paid Plans**: Available for higher usage and custom domains
- **Monitoring**: Free tier includes basic monitoring

## 📞 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: For application-specific issues

---

🎉 **Congratulations!** Your Habit Streak Tracker is now live on the internet!
