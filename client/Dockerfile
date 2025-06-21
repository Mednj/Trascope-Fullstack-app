# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy client and shared code
COPY client/ ./client/
COPY shared/ ./shared/
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./

# Build only the frontend
RUN npm run build:frontend

# Production stage
FROM nginx:alpine

# Copy built files from build stage (Vite outputs to dist/public)
COPY --from=build /app/dist/public /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 