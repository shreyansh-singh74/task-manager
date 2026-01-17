# Collaborative Task Manager

A full-stack web application for managing team tasks with role-based access control, built with React.js, Node.js, Express, and PostgreSQL.

## 🌟 Features

### Core Features
- **User Authentication**
  - JWT-based signup and login
  - Secure password hashing with bcryptjs
  - Token-based session management
  - Role-based access (user, manager, admin)

- **Task Management**
  - Create, read, update, and delete tasks
  - Assign tasks to team members
  - Track task status (pending, in-progress, completed)
  - Set task priority (low, medium, high)
  - Due date management
  - Activity logging for all task changes

- **Role-Based Access Control (RBAC)**
  - **User Role**: Can view and update status of assigned tasks
  - **Manager Role**: Can create, assign, and edit tasks for users
  - **Admin Role**: Full system access

- **Dashboard**
  - View assigned tasks
  - View created tasks (for managers)
  - Quick status updates
  - Task filtering and sorting

- **UI/UX**
  - Modern, responsive design with Tailwind CSS
  - Dark mode toggle
  - Mobile-friendly interface
  - Real-time validation

- **API Features**
  - RESTful API design
  - Rate limiting (100 requests per 15 minutes)
  - Pagination for task lists
  - Comprehensive error handling
  - Activity logging for audit trails

## 📋 Tech Stack

### Frontend
- **React 19.2** - UI framework
- **React Router v7** - Navigation
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express v5** - Web framework
- **PostgreSQL** - Database (via Neon)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Rate Limit** - API rate limiting
- **TypeScript** - Type safety

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- PostgreSQL database (using Neon serverless PostgreSQL)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your database credentials**
   ```env
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your-secret-key-change-in-production
   PORT=8080
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd simpleapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register a new user
- `POST /api/auth/sign-in` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination)
- `GET /api/tasks/assigned/me` - Get user's assigned tasks
- `GET /api/tasks/created/me` - Get user's created tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (manager/admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (manager/admin only)
- `GET /api/tasks/:id/logs` - Get activity logs for a task

### Health Check
- `GET /health` - API health check

## 🔐 Security Features

1. **JWT Authentication**
   - Tokens expire after 7 days
   - Stored in browser localStorage
   - Included in Authorization header for protected routes

2. **Password Security**
   - Bcryptjs hashing with 10 salt rounds
   - Never stored in plaintext

3. **RBAC**
   - Middleware-based role verification
   - Task-level authorization checks
   - Prevents unauthorized actions

4. **Rate Limiting**
   - 100 requests per 15-minute window per IP
   - Protects against API abuse

5. **Input Validation**
   - Request body validation
   - Type checking with TypeScript
   - Sanitized database queries with Neon SQL client

## 🎨 UI Features

### Dark Mode
- Toggle button in navbar
- Persisted in local storage
- Smooth transitions between modes

### Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop-friendly layouts
- Touch-friendly buttons and inputs

### User Feedback
- Loading states with spinners
- Error messages with styling
- Success confirmations
- Real-time form validation

## 📊 Database Schema

### Users Table
```sql
- id (UUID Primary Key)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- role (VARCHAR: user, manager, admin)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tasks Table
```sql
- id (UUID Primary Key)
- title (VARCHAR)
- description (TEXT)
- status (VARCHAR: pending, in-progress, completed)
- priority (VARCHAR: low, medium, high)
- assigned_to (UUID Foreign Key)
- created_by (UUID Foreign Key)
- due_date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Activity Logs Table
```sql
- id (UUID Primary Key)
- task_id (UUID Foreign Key)
- user_id (UUID Foreign Key)
- action (VARCHAR)
- changes (JSONB)
- created_at (TIMESTAMP)
```

## 🧪 Testing

### Test Users
Create users with different roles to test RBAC:

**Manager User:**
- Can create tasks
- Can assign tasks to other users
- Can view created tasks dashboard
- Has full edit/delete permissions on own tasks

**Regular User:**
- Can view assigned tasks
- Can update task status
- Cannot create tasks
- Cannot modify task details (title, description, etc.)

## 📝 Example API Usage

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:8080/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Design Homepage",
    "description": "Create mockups and design system",
    "priority": "high",
    "due_date": "2025-02-15"
  }'
```

## 🔄 State Management

### Zustand Store Structure

**Auth Store**
- user data
- token
- authentication status
- dark mode preference
- loading and error states

**Task Store**
- all tasks
- assigned tasks
- created tasks
- selected task
- loading and error states

Benefits of Zustand:
- Lightweight and simple API
- No boilerplate required
- Built-in devtools support
- Automatic persistence integration

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── tasks.ts
│   ├── types.ts
│   ├── schema.sql
│   └── index.ts
├── package.json
└── tsconfig.json

simpleapp/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── TaskCard.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CreateTask.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── store.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
├── package.json
└── tsconfig.json
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon dashboard for connection limits
- Ensure network allows outbound PostgreSQL connections

### CORS Errors
- Backend CORS is enabled for localhost
- For production, update CORS origin in backend

### JWT Token Issues
- Verify JWT_SECRET matches between sign-in and token verification
- Check token expiration (7 days)
- Clear localStorage if token issues persist

## 🚦 Future Enhancements

- Real-time updates with WebSockets
- Drag-and-drop task status changes
- Email notifications for task assignments
- Task comments and collaboration
- Team management and permissions
- Advanced filtering and search
- Task attachments
- Recurring tasks
- Task templates
- Team calendar view

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Last Updated:** January 2025
