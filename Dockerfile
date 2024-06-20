FROM node:18.18.0-alpine

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose the port that PM2 will run on
EXPOSE 3001

# Start the app with PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]
