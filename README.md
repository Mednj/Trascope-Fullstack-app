# TranscribePro - Merchant Payment Dashboard

Check Demo Below:

https://github.com/user-attachments/assets/9946c8f7-1f2e-497f-812e-473ae5568dea


A full-stack CRUD application built with Spring Boot, React, and PostgreSQL. Features JWT authentication, complete transaction management, and Docker deployment.

## 🚀 Features

- **Authentication** - JWT-based login with role-based access
- **Dashboard** - Real-time statistics and transaction overview
- **Transaction Management** - Complete CRUD operations with filtering
- **Site Management** - Manage merchant locations and addresses
- **POS Device Management** - Track and configure payment devices
- **Responsive UI** - Modern design with Tailwind CSS and shadcn/ui

## 🐳 Quick Start with Docker

1. **Clone and start:**
   ```bash
   git clone <repository-url>
   cd TranscribePro
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:8082
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432

3. **Login with demo credentials:**
   - Email: `merchant@transcope.com`
   - Password: `password123`

## 🏗️ Tech Stack

- **Backend**: Spring Boot 3.2.0, Java 17, PostgreSQL, JWT
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with JPA/Hibernate
- **Deployment**: Docker Compose with Nginx

## 📊 API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/stats/{userId}` - Dashboard statistics
- `GET/POST/PUT/DELETE /api/transactions` - Transaction CRUD
- `GET/POST/PUT/DELETE /api/sites` - Site management
- `GET/POST/PUT/DELETE /api/devices` - Device management

## 🔧 Development

### Local Setup
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend
npm install
npm run dev
```

### Docker Commands
```bash
docker-compose up          # Start all services
docker-compose up -d       # Start in background
docker-compose down        # Stop all services
docker-compose logs        # View logs
```

## 📁 Project Structure

```
TranscribePro/
├── backend/          # Spring Boot API
├── client/           # React frontend
├── shared/           # TypeScript types
├── docker-compose.yml
└── README.md
```

## 🔒 Security Features

- JWT token authentication
- Password encryption with BCrypt
- Input validation and sanitization
- CORS configuration
- Protected API endpoints

## 🎨 UI Features

- Responsive design for all devices
- Modern component library (shadcn/ui)
- Form validation with Zod
- Loading states and error handling
- Toast notifications for user feedback

This application demonstrates modern full-stack development with clean architecture, proper security, and production-ready Docker deployment.
