# Etude - Notion Clone

A full-stack Notion clone built with Node.js, Express.js, React, and TypeScript. This project implements a comprehensive note-taking and collaboration platform with real-time features.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Workspace Management** - Create and manage multiple workspaces
- **Page Creation & Editing** - Rich text editor with block-based content
- **Real-time Collaboration** - Live editing with Socket.IO
- **Comments & Mentions** - Add comments and mention users
- **Search Functionality** - Full-text search across pages and content
- **File Upload** - Support for image and document uploads
- **Sharing & Permissions** - Share pages with different permission levels

### Advanced Features
- **AI Integration** - AI-powered content generation and assistance
- **Notifications** - Real-time notifications for mentions and updates
- **Tags & Organization** - Tag-based content organization
- **Version History** - Track changes and revert to previous versions
- **Offline Support** - Basic offline functionality with sync
- **Responsive Design** - Mobile-friendly interface

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Redis** - Caching and session storage
- **RabbitMQ** - Message queue for background tasks
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling
- **Zustand** - State management
- **React Query** - Data fetching

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nodemon** - Development server

## 📁 Project Structure

```
etude/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── workers/           # Background workers
│   ├── uploads/           # File uploads
│   └── server.js          # Main server file
├── frontend/              # Frontend application
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Next.js pages
│   ├── public/           # Static assets
│   └── styles/           # CSS styles
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- RabbitMQ (optional for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etude
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

4. **Set up environment variables**
   
   Create `.env` files in both `backend/` and `frontend/` directories:
   
   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/etude
   JWT_SECRET=your-jwt-secret
   REDIS_URL=redis://localhost:6379
   RABBITMQ_URL=amqp://localhost:5672
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🐳 Docker Setup

For production deployment, use Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Workspace Endpoints
- `GET /api/workspaces` - Get user workspaces
- `POST /api/workspaces` - Create workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Page Endpoints
- `GET /api/pages` - Get pages
- `POST /api/pages` - Create page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### Block Endpoints
- `GET /api/blocks/:pageId` - Get page blocks
- `POST /api/blocks` - Create block
- `PUT /api/blocks/:id` - Update block
- `DELETE /api/blocks/:id` - Delete block

### Search Endpoints
- `GET /api/search` - Search content

## 🔧 Configuration

### Database Models
- **User** - User accounts and profiles
- **Workspace** - Workspace management
- **Page** - Page content and metadata
- **Block** - Content blocks within pages
- **Comment** - Page comments
- **Notification** - User notifications
- **Tag** - Content tagging

### Real-time Features
- Live page editing
- Real-time comments
- User presence indicators
- Collaborative cursors

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Roadmap

- [ ] Advanced block types (tables, databases)
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Template system
- [ ] Export/import functionality
- [ ] Advanced permissions system
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Performance optimizations

---

**Built with ❤️ by the Etude Team**
