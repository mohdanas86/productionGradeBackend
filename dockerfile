# Use official Node.js image as the base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code to the working directory
COPY . .

# Create temp directory for file uploads
RUN mkdir -p public/temp

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "src/index.js"]