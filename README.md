# 🎓 LearnHub — Full-Stack LMS (MERN Stack)

A production-ready **Learning Management System** built with the MERN stack featuring YouTube video integration, JWT authentication, progress tracking, and a dark-mode UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Styling | TailwindCSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Video | YouTube iframe API |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
lms-project/
├── client/               # React Frontend (Vite)
│   └── src/
│       ├── api/          # Axios API helpers
│       ├── components/   # Navbar, CourseCard, VideoPlayer, Sidebar, ProgressBar
│       ├── context/      # AuthContext (JWT state)
│       └── pages/        # Home, Courses, CourseDetails, LearningPage, Dashboard, Login, Signup
│
├── server/               # Node.js + Express Backend
│   ├── config/           # MongoDB connection
│   ├── controllers/      # authController, courseController, lessonController, progressController
│   ├── middleware/        # JWT auth + role guard
│   ├── models/           # User, Course, Lesson, Progress
│   ├── routes/           # authRoutes, courseRoutes, lessonRoutes, progressRoutes
│   ├── seed.js           # Sample data seeder
│   └── server.js         # Express entry point
│
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lmsdb
JWT_SECRET=lms_super_secret_jwt_key_2024
CLIENT_URL=http://localhost:5173
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd lms-project
```

### 2. Setup the Backend
```bash
cd server
npm install
# Update server/.env with your MongoDB URI
npm run dev       # starts backend on port 5000
```

### 3. Seed the Database (optional but recommended)
```bash
cd server
npm run seed
```
This creates 4 courses, 16 lessons, and 3 test users.

### 4. Setup the Frontend
```bash
cd client
npm install
npm run dev       # starts frontend on port 5173
```

---

## 👤 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Student | student@lms.com | test1234 |
| Instructor | instructor@lms.com | test1234 |
| Admin | admin@lms.com | test1234 |

---

## 🌐 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/courses` | Get all courses (with search/filter) |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create course (instructor+) |
| PUT | `/api/courses/:id` | Update course (instructor+) |
| DELETE | `/api/courses/:id` | Delete course (instructor+) |
| POST | `/api/courses/:id/enroll` | Enroll in a course |

### Lessons
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/lessons/:courseId` | Get lessons for a course |
| POST | `/api/lessons` | Create lesson (instructor+) |

### Progress
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/progress/update` | Mark lesson as complete |
| GET | `/api/progress/:userId` | Get user's progress |
| GET | `/api/progress/course/:courseId` | Get progress for a course |

---

## ✨ Features

- 🔐 JWT Authentication with role-based access (student / instructor / admin)
- 📹 YouTube iframe video integration (no local storage)
- 📊 Real-time progress tracking with percentage calculation
- ▶️ Resume last-watched lesson
- 🔍 Course search + category + level filters
- 🎨 Modern dark-mode UI with TailwindCSS
- 📱 Fully responsive (mobile + desktop)
- 🎓 Instructor course creation wizard (2-step form)
- 📋 Student dashboard with enrolled courses

---

## 📺 YouTube Videos Used

| Video ID | URL |
|----------|-----|
| K5KVEU3aaeQ | https://youtu.be/K5KVEU3aaeQ |
| hlGoQC332VM | https://youtu.be/hlGoQC332VM |
| D1eL1EnxXXQ | https://youtu.be/D1eL1EnxXXQ |
| SyVMma1IkXM | https://youtu.be/SyVMma1IkXM |

---

## 🏗️ Production Build

```bash
# Frontend
cd client
npm run build

# Backend — set NODE_ENV=production and use a process manager like pm2
cd server
npm start
```

---

Made with ❤️ using the MERN Stack
