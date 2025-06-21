# TranscribePro - Docker Setup

This document describes how to run the TranscribePro application using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd TranscribePro
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432

## Services

### Frontend (React)
- **Port**: 80
- **URL**: http://localhost
- **Container**: transcope-frontend
- **Features**: 
  - Serves the React application
  - Proxies API requests to the backend
  - Handles client-side routing

### Backend (Spring Boot)
- **Port**: 8080
- **URL**: http://localhost:8080/api
- **Container**: transcope-backend
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - Database operations
  - CORS configuration

### Database (PostgreSQL)
- **Port**: 5432
- **Container**: transcope-db
- **Database**: transcope
- **Username**: postgres
- **Password**: admin
- **Features**:
  - Persistent data storage
  - Health checks
  - Automatic initialization

## Environment Variables

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRATION`: JWT token expiration time
- `CORS_ALLOWED_ORIGINS`: Allowed CORS origins
- `CORS_ALLOWED_METHODS`: Allowed HTTP methods
- `CORS_ALLOWED_HEADERS`: Allowed HTTP headers
- `CORS_ALLOW_CREDENTIALS`: Allow credentials in CORS

### Database Environment Variables
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Build and start services
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Access containers
```bash
# Backend container
docker exec -it transcope-backend bash

# Frontend container
docker exec -it transcope-frontend sh

# Database container
docker exec -it transcope-db psql -U postgres -d transcope
```

## Development

### Rebuilding a specific service
```bash
docker-compose build backend
docker-compose up backend
```

### Viewing service status
```bash
docker-compose ps
```

### Restarting a service
```bash
docker-compose restart backend
```

## Troubleshooting

### Port conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

### Database connection issues
1. Check if the database container is running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Wait for the database to be ready (health check)

### Frontend not loading
1. Check if the frontend container is running:
   ```bash
   docker-compose ps
   ```

2. Check frontend logs:
   ```bash
   docker-compose logs frontend
   ```

3. Verify nginx configuration

### Backend API issues
1. Check if the backend container is running:
   ```bash
   docker-compose ps
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Verify database connection

## Data Persistence

The PostgreSQL data is persisted in a Docker volume named `postgres_data`. This means your data will survive container restarts.

To completely reset the database:
```bash
docker-compose down -v
docker-compose up
```

## Production Considerations

For production deployment, consider:

1. **Security**:
   - Change default passwords
   - Use environment-specific JWT secrets
   - Configure proper CORS origins
   - Enable HTTPS

2. **Performance**:
   - Use production-grade database
   - Configure proper JVM settings
   - Enable database connection pooling
   - Use CDN for static assets

3. **Monitoring**:
   - Add health checks
   - Configure logging
   - Set up monitoring and alerting

4. **Backup**:
   - Configure database backups
   - Set up volume backups

## Demo Credentials

After the application starts, you can log in with:
- **Email**: merchant@transcope.com
- **Password**: password123 