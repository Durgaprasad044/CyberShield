# CyberShield - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- VirusTotal API key (optional, for website scanning)

### 2. Prepare Your Repository
```bash
# Make sure all files are committed
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: cybershield (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings? N
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### 4. Environment Variables
After deployment, add these environment variables in Vercel Dashboard:

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `VIRUSTOTAL_API_KEY`: Your VirusTotal API key
   - `NODE_ENV`: production

### 5. Custom Domain (Optional)
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 📁 Project Structure for Vercel

```
CyberShield/
├── api/                    # Serverless API functions
│   ├── detect.ts          # Email spam detection
│   ├── scan.ts            # Website scanning
│   └── package.json       # API dependencies
├── cyber-shield/          # React frontend
│   ├── src/
│   ├── public/
│   ├── build/             # Generated after build
│   └── package.json
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── .gitignore
```

## 🔧 API Endpoints

After deployment, your API will be available at:
- `https://your-app.vercel.app/api/detect` - Email spam detection
- `https://your-app.vercel.app/api/scan` - Website security scanning

## 🛠️ Local Development

```bash
# Install all dependencies
npm run install-all

# Start React development server
cd cyber-shield
npm start

# Test API functions locally (in another terminal)
vercel dev
```

## 📝 Notes

- The ML model has been simplified for Vercel's serverless environment
- API functions have a 30-second timeout limit
- Static files are served from the React build directory
- CORS is configured for cross-origin requests

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are listed in package.json
- Ensure Node.js version compatibility (>=18.0.0)

### API Not Working
- Verify environment variables are set
- Check function logs in Vercel Dashboard
- Ensure API endpoints match your frontend calls

### Frontend Not Loading
- Check that build directory exists after build
- Verify routing configuration in vercel.json

## 🎉 Success!

Your CyberShield app should now be live at `https://your-app.vercel.app`

Test the deployment:
1. Visit the URL
2. Try the email spam detection feature
3. Test website scanning (if API key is configured)