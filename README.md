# Project & Task Management System

> **MERN Stack Application with Gemini AI Integration**


A full-stack project and task management system with Trello-like Kanban boards, drag-and-drop functionality, and AI-powered features using Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-Atlas-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation--setup)
- [Configuration](#-configuration)
- [Usage](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [DevVoid Submission](#-devvoid-submission)

## ✨ Features

### Core Features
✅ **User Authentication** - Secure JWT-based authentication with refresh tokens
✅ **Project Management** - Create, read, update, and delete projects
✅ **Kanban Board** - Drag-and-drop task management with three columns (To Do, In Progress, Done)
✅ **Task Management** - Full CRUD operations with priority levels (Low, Medium, High) and due dates
✅ **Team Collaboration** - Add team members to projects
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
✅ **Real-time Updates** - Optimistic UI updates for smooth user experience

### AI-Powered Features
🤖 **Gemini AI Integration**:
  - **AI Project Summary** - Get intelligent summaries of project status with task breakdowns and statistics
  - **AI Q&A Assistant** - Ask questions about your project and get context-aware answers
  - **Smart Insights** - AI-generated highlights and recommendations
  - **Task Analytics** - View overdue tasks, priority distribution, and progress metrics

## 🛠 Tech Stack

### Backend
- **Node.js** (v14+) & **Express.js** - Server and RESTful API
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB ODM with schema validation
- **JWT (jsonwebtoken)** - Stateless authentication with access & refresh tokens
- **bcryptjs** - Secure password hashing
- **Google Generative AI** - Gemini 2.5 Flash model for AI features
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Joi** - Request validation
- **dotenv** - Environment variable management

### Frontend
- **React.js** (v18.x) - Modern UI library
- **React Router DOM** - Client-side routing
- **@dnd-kit** - Accessible drag-and-drop for Kanban board
- **Axios** - Promise-based HTTP client with interceptors
- **Context API** - Global state management for authentication
- **Lucide React** - Beautiful icon library
- **CSS3** - Modern responsive styling

### Development Tools
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Prerequisites

Before you begin, ensure you have the following:

- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (v6 or higher) - Comes with Node.js
- ✅ **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- ✅ **Google Gemini API Key** - [Get API Key](https://aistudio.google.com/app/apikey)
- ✅ **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/project-management-DevVoid.git
cd project-management-DevVoid
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Create Environment File
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/project-management?retryWrites=true&w=majority

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRE=7d

# Google Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important Notes:**
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials
- Replace `xxxxx` with your MongoDB cluster ID
- Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- The application uses **Gemini 2.5 Flash** model (`gemini-2.5-flash`)

#### Start the Backend Server
```bash
npm run dev
```

✅ Server will start on **http://localhost:5000**

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Create Environment File
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the React App
```bash
npm start
```

✅ Frontend will open on **http://localhost:3000**

## ⚙️ Configuration

### Getting MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **free cluster** (M0 Sandbox)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add database name: `project-management`

**Example:**
```
mongodb+srv://admin:yourpassword@cluster0.ju2ub4l.mongodb.net/project-management?retryWrites=true&w=majority
```

### Getting Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key
5. Paste it in your `.env` file

**Note:** The application uses the **Gemini 2.5 Flash** model which is:
- ✅ Fast and efficient
- ✅ Supports content generation
- ✅ Free tier available

### Environment Variables Reference

#### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for access tokens | `random-secret-key` |
| `JWT_EXPIRE` | Access token expiry | `1h` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `another-secret-key` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

#### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## 📖 Usage Guide

### 1️⃣ Register/Login
- Navigate to **http://localhost:3000**
- Click **"Register"** to create a new account
- Or **"Login"** with existing credentials
- Uses JWT authentication with automatic token refresh

### 2️⃣ Create a Project
- Click **"+ New Project"** button on the dashboard
- Enter **project name** and **description**
- Click **"Create Project"**
- Project appears in your project list

### 3️⃣ Manage Tasks
- Click on a **project card** to open the Kanban board
- Click **"+ Add Task"** to create a new task
- Fill in:
  - **Title** (required)
  - **Description** (optional)
  - **Priority** (Low/Medium/High)
  - **Due Date** (optional)
- Tasks are created in the **"To Do"** column by default

### 4️⃣ Use Kanban Board
- **Drag and drop** tasks between columns:
  - 📝 **To Do** - New tasks
  - 🔄 **In Progress** - Work in progress
  - ✅ **Done** - Completed tasks
- Task status updates automatically when moved
- Visual indicators for overdue tasks and priorities

### 5️⃣ AI Features

#### AI Project Summary
1. Open a project
2. Click **"✨ Summarize"** button
3. View AI-generated summary with:
   - 📊 **Overview** - Project status summary
   - 📈 **Task Breakdown** - Distribution across columns
   - 🔍 **Statistics** - Total, overdue, high-priority tasks
   - 💡 **Key Highlights** - AI insights and recommendations

#### Ask AI Assistant
1. Open a project
2. Click **"🤖 Ask AI"** button
3. Type your question, such as:
   - "What is the project progress?"
   - "What tasks are overdue?"
   - "Show me high priority tasks"
4. Get AI-powered answers with task context

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login user | ❌ |
| `POST` | `/auth/refresh` | Refresh access token | ❌ |
| `GET` | `/auth/me` | Get current user | ✅ |
| `POST` | `/auth/logout` | Logout user | ✅ |

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/projects` | Get all user projects | ✅ |
| `POST` | `/projects` | Create new project | ✅ |
| `GET` | `/projects/:id` | Get project by ID | ✅ |
| `PUT` | `/projects/:id` | Update project | ✅ |
| `DELETE` | `/projects/:id` | Delete project | ✅ |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tasks/project/:projectId` | Get all tasks for project | ✅ |
| `POST` | `/tasks` | Create new task | ✅ |
| `GET` | `/tasks/:id` | Get task by ID | ✅ |
| `PUT` | `/tasks/:id` | Update task | ✅ |
| `PUT` | `/tasks/:id/status` | Update task status (drag-drop) | ✅ |
| `DELETE` | `/tasks/:id` | Delete task | ✅ |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/ai/summarize/:projectId` | Get AI project summary | ✅ |
| `POST` | `/ai/qa` | Ask AI a question | ✅ |

### Example Requests

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Create Project
```bash
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website with modern UI"
}
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Design homepage mockup",
  "description": "Create Figma design for new homepage",
  "projectId": "507f1f77bcf86cd799439011",
  "priority": "high",
  "dueDate": "2025-10-25"
}
```

## 📁 Project Structure

```
project-management-DevVoid/
│
├── server/                          # Backend Node.js application
│   ├── config/
│   │   └── database.js             # MongoDB connection setup
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── project.controller.js   # Project CRUD operations
│   │   ├── task.controller.js      # Task CRUD operations
│   │   └── ai.controller.js        # AI feature controllers
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── error.middleware.js     # Error handling
│   │   └── validation.middleware.js # Request validation
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Project.js              # Project schema
│   │   └── Task.js                 # Task schema
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── project.routes.js       # Project endpoints
│   │   ├── task.routes.js          # Task endpoints
│   │   └── ai.routes.js            # AI endpoints
│   ├── services/
│   │   └── gemini.service.js       # Gemini AI integration
│   ├── utils/
│   │   └── asyncHandler.js         # Async error wrapper
│   ├── .env                        # Environment variables
│   ├── .gitignore
│   ├── server.js                   # Entry point
│   └── package.json
│
├── client/                          # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js            # Axios instance with interceptors
│   │   │   ├── auth.api.js         # Auth API calls
│   │   │   ├── project.api.js      # Project API calls
│   │   │   ├── task.api.js         # Task API calls
│   │   │   └── ai.api.js           # AI API calls
│   │   ├── components/
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── ProjectCard.js      # Project card component
│   │   │   ├── ProjectList.js      # Project list
│   │   │   ├── TaskCard.js         # Draggable task card
│   │   │   ├── KanbanBoard.js      # Kanban board with DnD
│   │   │   ├── AISummaryModal.js   # AI summary modal
│   │   │   ├── AIQAModal.js        # AI Q&A modal
│   │   │   └── ProtectedRoute.js   # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js      # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Dashboard.js        # Projects dashboard
│   │   │   └── ProjectDetails.js   # Project Kanban view
│   │   ├── utils/
│   │   │   └── dateUtils.js        # Date formatting utilities
│   │   ├── App.js                  # Main app component
│   │   ├── App.css                 # Global styles
│   │   └── index.js                # Entry point
│   ├── .env                        # Environment variables
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└── README.md
```

<!-- 
## 🌐 Deployment

### Backend Deployment (Railway/Render/Heroku)

#### Option 1: Railway
1. Create account at [Railway.app](https://railway.app/)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables from `.env`
5. Railway auto-detects Node.js and deploys

#### Option 2: Render
1. Create account at [Render.com](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Click **"Create Web Service"**

### Frontend Deployment (Vercel/Netlify)

#### Option 1: Vercel
1. Create account at [Vercel.com](https://vercel.com/)
2. Click **"Import Project"**
3. Import from GitHub
4. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable: `REACT_APP_API_URL=<your-backend-url>/api`
6. Deploy

#### Option 2: Netlify
1. Create account at [Netlify.com](https://netlify.com/)
2. Click **"New site from Git"**
3. Choose GitHub repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
5. Add environment variable: `REACT_APP_API_URL`
6. Deploy

-->

## 🔧 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoServerError: bad auth`
- ✅ Check username and password in `MONGODB_URI`
- ✅ Ensure IP address is whitelisted in MongoDB Atlas (use `0.0.0.0/0` for all IPs)
- ✅ Verify database user has read/write permissions

### CORS Errors
**Error:** `Access-Control-Allow-Origin`
- ✅ Verify `CLIENT_URL` in server `.env` matches your frontend URL
- ✅ Ensure both frontend and backend servers are running
- ✅ Check CORS configuration in `server.js`

### Gemini AI Not Working
**Error:** `[404 Not Found] models/... is not found`
- ✅ Verify your `GEMINI_API_KEY` is correct
- ✅ Ensure model name is `gemini-2.5-flash`
- ✅ Check API quota in [Google AI Studio](https://aistudio.google.com/)
- ✅ Verify internet connection

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

### JWT Token Errors
**Error:** `JsonWebTokenError: invalid token`
- ✅ Clear browser localStorage and login again
- ✅ Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- ✅ Check token expiry settings

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

<!-- 
### Test API Endpoints (Postman/Thunder Client)
1. Import Postman collection (if provided)
2. Test all endpoints with sample data
3. Verify responses match expected schema

-->

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with 10 salt rounds
- ✅ **JWT Authentication** - Stateless auth with access & refresh tokens
- ✅ **HTTP Security Headers** - Helmet.js middleware
- ✅ **CORS Protection** - Whitelist specific origins
- ✅ **Input Validation** - Joi schema validation
- ✅ **MongoDB Injection Protection** - Mongoose sanitization
- ✅ **XSS Protection** - Content Security Policy headers

## 📄 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

Created By **Rajesh Sharma**

**GitHub Repository:**
```
https://github.com/rajeshSharma75/project-management-DevVoid
```

<!--  **Live Demo:**
- Frontend: [Your Vercel/Netlify URL]
- Backend: [Your Railway/Render URL]

**OR** -->

**Video Demo:**
- [https://drive.google.com/file/d/1UjDmGxFH7qCz559zjZdwN05CzBoOFh_o/view?usp=sharing]

---

**Built with ❤️ using MERN Stack + Gemini AI**

*Developed by Rajesh sharma*
