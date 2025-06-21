# Transcope - Merchant Payment Dashboard

A modern, responsive React frontend for managing payment transactions for merchants. Built to integrate with a Spring Boot backend API.

## 🚀 Features

- **Authentication System** - Secure JWT-based login
- **Dashboard Overview** - Real-time statistics and recent transactions
- **Transaction Management** - Complete CRUD operations for payment transactions
- **Site Management** - Manage merchant locations and store information
- **POS Device Management** - Track and configure point-of-sale devices
- **Responsive Design** - Modern UI with Tailwind CSS

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system

### Expected Backend (Spring Boot)
The frontend is configured to work with a Spring Boot backend running on `http://localhost:8080/api`

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- Spring Boot backend (see Backend Setup section)

## 🔧 Installation & Setup

### Frontend Setup

1. **Clone and install dependencies:**
npm install

2. **Start the development server:**
npm run dev

#### API Endpoints

The frontend expects these endpoints to be available:

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Dashboard**
- `GET /api/dashboard/stats/{userId}` - Get dashboard statistics

**Transactions**
- `GET /api/transactions/user/{userId}` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

**Sites**
- `GET /api/sites/user/{userId}` - Get user sites
- `POST /api/sites` - Create site
- `PUT /api/sites/{id}` - Update site
- `DELETE /api/sites/{id}` - Delete site

**Devices**
- `GET /api/devices/user/{userId}` - Get user devices
- `POST /api/devices` - Create device
- `PUT /api/devices/{id}` - Update device
- `DELETE /api/devices/{id}` - Delete device

#### CORS Configuration

Add CORS configuration to allow the frontend to communicate with the backend:

```java
@Configuration
@EnableWebSecurity
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8082")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### Application Properties

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/transcope
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

## 🔑 Demo Credentials

For testing the frontend with mock data:
- **Email**: merchant@transcope.com
- **Password**: password123

## 📁 Project Structure

```
transcope/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API calls
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema and types
├── server/                 # Minimal Express server for frontend serving
└── README.md
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 UI Components

The application uses shadcn/ui components with custom styling:

- **Design System**: Custom color palette with primary blue theme
- **Components**: Cards, forms, modals, tables, badges, buttons
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design with Tailwind CSS

## 🔧 Configuration

### API Base URL

The frontend is configured to connect to the Spring Boot backend at:
```
http://localhost:8080/api
```

To change this, update the `SPRING_BOOT_BASE_URL` constant in:
- `client/src/lib/api.ts`
- `client/src/lib/queryClient.ts`

### Environment Variables

The frontend supports the following environment variables:
- `VITE_API_BASE_URL` - Override the default API base URL

## 🚀 Deployment

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

### Backend Deployment

Deploy your Spring Boot application to ensure it's accessible at the configured API base URL.

## 🧪 Testing

The application includes comprehensive form validation and error handling:

- **Form Validation**: Zod schemas for all forms
- **Error Handling**: Toast notifications for user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Empty States**: Informative messages when no data is available

## 📱 Features in Detail

### Authentication
- JWT token-based authentication
- Persistent login with localStorage
- Protected routes with automatic redirects

### Dashboard
- Revenue and transaction statistics
- Recent transactions overview
- Quick navigation to all sections

### Transaction Management
- Create, read, update, delete transactions
- Advanced filtering by status and type
- Search functionality
- Responsive table with detailed information

### Site Management
- Manage multiple merchant locations
- Track devices per site
- Visual cards with site information

### POS Device Management
- Device registration and management
- Real-time status indicators
- Site association for organizational clarity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request