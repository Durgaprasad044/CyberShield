# 🚀 CyberShield - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **VirusTotal API Key** - Get from [virustotal.com/gui/my-apikey](https://www.virustotal.com/gui/my-apikey) (optional)

## 🎯 Quick Deployment Steps

### Step 1: Prepare Your Repository

```bash
# Make sure all files are committed and pushed
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Deploy on Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to [render.com](https://render.com)** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `cybershield` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or upgrade as needed)

5. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add: `VIRUSTOTAL_API_KEY` = `your_api_key_here`
   - Add: `NODE_ENV` = `production`

6. **Click "Create Web Service"**

#### Option B: Using render.yaml (Infrastructure as Code)

1. **The `render.yaml` file is already configured in your project**
2. **In Render Dashboard:**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Add your `VIRUSTOTAL_API_KEY` in the environment variables

### Step 3: Configure Environment Variables

After deployment, add these environment variables in Render Dashboard:

1. Go to your service dashboard
2. Click "Environment" tab
3. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets the environment |
| `PORT` | `10000` | Port number (auto-set by Render) |
| `VIRUSTOTAL_API_KEY` | `your_api_key` | For website scanning feature |

### Step 4: Custom Domain (Optional)

1. In your service dashboard → "Settings" → "Custom Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. SSL certificate will be automatically provisioned

## 📁 Project Structure

```
CyberShield/
├── server.js              # Main server file (serves both API and frontend)
├── package.json            # Root dependencies and scripts
├── render.yaml             # Render configuration
├── Dockerfile              # Docker configuration (optional)
├── .env.example            # Environment variables template
├── cyber-shield/           # React frontend
│   ├── src/
│   ├── public/
│   ├── build/              # Generated after build
│   └── package.json
└── RENDER_DEPLOYMENT.md    # This guide
```

## 🔌 API Endpoints

After deployment, your API will be available at:
- `https://your-app.onrender.com/api/detect` - Email spam detection
- `https://your-app.onrender.com/api/scan` - Website security scanning
- `https://your-app.onrender.com/api/health` - Health check

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Install React dependencies and build
npm run build

# Start the server locally
npm start

# For development with auto-reload
npm run dev
```

## 📊 Monitoring & Logs

1. **View Logs**: In Render Dashboard → Your Service → "Logs" tab
2. **Monitor Performance**: "Metrics" tab shows CPU, memory usage
3. **Health Checks**: Automatic health checks at `/api/health`

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check if all dependencies are listed in package.json
npm install
npm run build
```

#### 2. Server Won't Start
- Check that `server.js` exists in the root directory
- Verify the start command: `npm start`
- Check logs for specific error messages

#### 3. API Endpoints Not Working
- Verify environment variables are set correctly
- Check that API routes start with `/api/`
- Test health endpoint: `https://your-app.onrender.com/api/health`

#### 4. Frontend Not Loading
- Ensure React build completed successfully
- Check that `cyber-shield/build` directory exists
- Verify static file serving in `server.js`

#### 5. CORS Issues
- CORS is configured in `server.js`
- Check that frontend and backend are on the same domain

### Debug Commands

```bash
# Check if build directory exists
ls -la cyber-shield/build/

# Test server locally
npm start

# Check environment variables
echo $NODE_ENV
echo $PORT
```

## 🚀 Performance Optimization

### For Production:

1. **Enable Compression**: Already configured in `server.js`
2. **Static File Caching**: Configured for React build files
3. **Health Checks**: Automatic monitoring at `/api/health`
4. **Error Handling**: Comprehensive error handling in API routes

### Scaling Options:

1. **Upgrade Plan**: Move from Free to Starter ($7/month) for:
   - No sleep mode
   - More CPU/RAM
   - Custom domains

2. **Database**: Add PostgreSQL or Redis if needed
3. **CDN**: Use Render's CDN for static assets

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Render service created and deployed
- [ ] Environment variables configured
- [ ] Health check endpoint responding
- [ ] Frontend loads correctly
- [ ] Email scanner works
- [ ] Website scanner works (if API key configured)
- [ ] Custom domain configured (optional)

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: Create an issue in your repository

---

## 🎯 Your App URLs

After deployment:
- **Frontend**: `https://your-app-name.onrender.com`
- **API**: `https://your-app-name.onrender.com/api`
- **Health Check**: `https://your-app-name.onrender.com/api/health`

**🎉 Congratulations! Your CyberShield app is now live on Render!**