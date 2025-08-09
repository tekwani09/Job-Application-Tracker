# Backend Deployment Guide - Render.com

## Quick Setup (5 minutes)

### 1. Prepare Backend for Deployment
```bash
cd backend
npm init -y  # if package.json doesn't exist
```

### 2. Update package.json
Add these scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. Create Render Account
1. Go to render.com
2. Sign up with GitHub account
3. Connect your GitHub repository

### 4. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: job-tracker-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free

### 5. Add Environment Variables
In Render dashboard, add:
```
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=10000
NODE_ENV=production
```

### 6. Get Your Backend URL
After deployment: `https://job-tracker-backend.onrender.com`

## MongoDB Atlas Setup (Free)

### 1. Create MongoDB Atlas Account
1. Go to mongodb.com/atlas
2. Sign up for free
3. Create new cluster (free tier)

### 2. Setup Database Access
1. Database Access → Add New User
2. Create username/password
3. Network Access → Add IP (0.0.0.0/0 for all)

### 3. Get Connection String
1. Clusters → Connect
2. Connect your application
3. Copy connection string
4. Replace `<password>` with your password

## Update Frontend API URLs

### 1. Create Environment File
```bash
# frontend/.env
REACT_APP_API_URL=https://job-tracker-backend.onrender.com
```

### 2. Update API Service
```javascript
// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});
```

### 3. Rebuild and Redeploy Frontend
```bash
cd frontend
npm run build
npm run deploy
```

## Alternative: Railway.app (Also Free)

### 1. Go to railway.app
2. Connect GitHub repo
3. Select backend folder
4. Add environment variables
5. Deploy automatically

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Add frontend URL to CORS whitelist
2. **Database Connection**: Check MongoDB Atlas IP whitelist
3. **Environment Variables**: Ensure all variables are set
4. **Port Issues**: Use process.env.PORT in server.js

### CORS Fix:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://yourusername.github.io', 'http://localhost:3000'],
  credentials: true
}));
```

## Your Live URLs:
- **Frontend**: https://yourusername.github.io/Job-Application-Tracker
- **Backend**: https://job-tracker-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)