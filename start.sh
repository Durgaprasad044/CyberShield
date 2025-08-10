#!/bin/bash

# CyberShield Startup Script for Render

echo "🚀 Starting CyberShield deployment..."

# Check if React build exists
if [ ! -d "cyber-shield/build" ]; then
    echo "📦 React build not found. Building React app..."
    cd cyber-shield
    npm install
    npm run build
    cd ..
    echo "✅ React build completed"
else
    echo "✅ React build found"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
    echo "✅ Server dependencies installed"
else
    echo "✅ Server dependencies found"
fi

# Start the server
echo "🌟 Starting CyberShield server..."
node server.js