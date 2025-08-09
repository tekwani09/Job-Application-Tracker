# GitHub Pages Deployment Guide

## Prerequisites
1. GitHub account
2. Git installed locally
3. Node.js and npm installed

## Steps to Deploy

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository
1. Go to GitHub.com
2. Create new repository named "Job-Application-Tracker"
3. Don't initialize with README (since you already have files)

### 3. Connect Local to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/Job-Application-Tracker.git
git branch -M main
git push -u origin main
```

### 4. Deploy to GitHub Pages
```bash
cd frontend
npm run deploy
```

### 5. Configure GitHub Pages
1. Go to your repository on GitHub
2. Click Settings tab
3. Scroll to Pages section
4. Source should be set to "Deploy from a branch"
5. Branch should be "gh-pages"
6. Click Save

### 6. Access Your Site
Your site will be available at:
`https://YOUR_USERNAME.github.io/Job-Application-Tracker`

## Important Notes

### Backend Deployment
- GitHub Pages only hosts static files (frontend)
- Deploy backend separately on Render, Heroku, or Vercel
- Update API URLs in frontend to point to deployed backend

### Environment Variables
- Create `.env` file in frontend for API URLs
- Use different URLs for development and production

### Custom Domain (Optional)
- Add CNAME file to public folder with your domain
- Configure DNS settings with your domain provider

## Troubleshooting

### Common Issues:
1. **404 Error**: Check homepage URL in package.json
2. **Blank Page**: Check browser console for errors
3. **API Errors**: Ensure backend is deployed and accessible
4. **Routing Issues**: Add basename to Router component

### Router Fix for GitHub Pages:
```javascript
<Router basename="/Job-Application-Tracker">
```

## Commands Reference
```bash
# Build project
npm run build

# Deploy to GitHub Pages
npm run deploy

# Start development server
npm start
```