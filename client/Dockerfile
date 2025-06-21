# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files from root directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code from client directory
COPY client/ ./client/

# Copy shared directory if it exists
COPY shared/ ./shared/

# Copy configuration files
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 