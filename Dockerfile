# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy React app
COPY cyber-shield/ ./cyber-shield/

# Install React dependencies and build
RUN cd cyber-shield && npm install && npm run build

# Copy server file
COPY server.js ./

# Create .env file placeholder
RUN touch .env

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/api/health || exit 1

# Start the application
CMD ["npm", "start"]