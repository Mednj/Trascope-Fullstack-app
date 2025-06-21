# Transcope Backend API

A Spring Boot backend API for the Transcope merchant payment dashboard. This API provides authentication, transaction management, site management, and device management functionality.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Complete CRUD operations for all entities
- **PostgreSQL Database** - Robust data persistence
- **CORS Configuration** - Cross-origin resource sharing for frontend integration
- **Data Validation** - Input validation using Bean Validation
- **Sample Data** - Automatic initialization of demo data

## 🏗️ Architecture

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL with JPA/Hibernate
- **Security**: Spring Security with JWT
- **Validation**: Bean Validation (Jakarta)
- **Build Tool**: Maven

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js (for frontend)

## 🔧 Setup Instructions

### 1. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create a database**:
   ```sql
   CREATE DATABASE transcope;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE transcope TO postgres;
   ```

### 2. Backend Configuration

1. **Clone the repository** (if not already done)
2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Update database configuration** in `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/transcope
       username: your_username
       password: your_password
   ```

4. **Build the project**:
   ```bash
   mvn clean install
   ```

5. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

### 3. Frontend Integration

1. **Start the frontend** (from the project root):
   ```bash
   npm run dev
   ```

2. **Access the application** at `http://localhost:5000`

## 🔐 Authentication

### Demo Credentials

The application automatically creates a demo user on first startup:

- **Email**: `merchant@transcope.com`
- **Password**: `password123`

### JWT Token

After successful login, the API returns a JWT token that must be included in subsequent requests:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats/{userId}` | Get dashboard statistics |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/user/{userId}` | Get user transactions |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/{id}` | Update transaction |
| DELETE | `/transactions/{id}` | Delete transaction |

### Sites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sites/user/{userId}` | Get user sites |
| POST | `/sites` | Create site |
| PUT | `/sites/{id}` | Update site |
| DELETE | `/sites/{id}` | Delete site |

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/devices/user/{userId}` | Get user devices |
| POST | `/devices` | Create device |
| PUT | `/devices/{id}` | Update device |
| DELETE | `/devices/{id}` | Delete device |

## 🗄️ Database Schema

### Users
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `password` (String, Encrypted)
- `email` (String, Unique)
- `merchant_name` (String)
- `industry` (String)
- `role` (String)
- `created_at` (Timestamp)

### Merchant Sites
- `id` (UUID, Primary Key)
- `name` (String)
- `address` (String)
- `user_id` (UUID, Foreign Key)
- `created_at` (Timestamp)

### POS Devices
- `id` (UUID, Primary Key)
- `device_id` (String, Unique)
- `model` (String)
- `site_id` (UUID, Foreign Key)
- `created_at` (Timestamp)

### Transactions
- `id` (UUID, Primary Key)
- `amount` (Decimal)
- `currency` (String)
- `status` (String)
- `type` (String)
- `customer_name` (String)
- `timestamp` (Timestamp)
- `user_id` (UUID, Foreign Key)
- `pos_device_id` (UUID, Foreign Key)

## 🔧 Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package
```

### Running in Production
```bash
java -jar target/transcope-backend-1.0.0.jar
```

## 🚨 Security Notes

1. **JWT Secret**: Change the JWT secret in `application.yml` for production
2. **Database Credentials**: Use environment variables for production
3. **CORS**: Configure allowed origins for production
4. **HTTPS**: Use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify PostgreSQL is running
   - Check database credentials in `application.yml`
   - Ensure database exists

2. **CORS Errors**:
   - Verify frontend is running on `http://localhost:5000`
   - Check CORS configuration in `SecurityConfig.java`

3. **Authentication Errors**:
   - Verify JWT secret is properly configured
   - Check token expiration settings

### Logs

Enable debug logging by adding to `application.yml`:
```yaml
logging:
  level:
    com.transcope: DEBUG
    org.springframework.security: DEBUG
```

## 📝 License

This project is part of the Transcope merchant payment dashboard. 