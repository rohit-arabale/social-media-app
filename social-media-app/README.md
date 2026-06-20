# 🌟 Socially — Full-Stack Social Media App
**Developed by Rohit Arabale**

Socially is a full-stack social media project designed and developed by Rohit Arabale, with a React frontend, Express backend, MongoDB data layer, JWT authentication, image uploads, profiles, posts, likes, and comments.

## Complete Beginner's Guide to Running This Project

---

## 📋 What You'll Need First (Prerequisites)

### 1. Install Node.js
- Go to: https://nodejs.org
- Download the "LTS" version (green button)
- Run the installer — click Next until done
- Verify: open Terminal/Command Prompt and type:
  ```
  node --version   ← should show v18 or higher
  npm --version    ← should show 9 or higher
  ```

### 2. Install MongoDB (Local Database)
**Option A — Local MongoDB (for development):**
- Go to: https://www.mongodb.com/try/download/community
- Download Community Edition for your OS
- Install it
- Start it: `mongod` (on Mac/Linux) or it starts automatically on Windows

**Option B — MongoDB Atlas (Free Cloud Database — Easier!):**
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Paste it in backend/.env as MONGO_URI
7. Replace <password> with your database password

### 3. Install VS Code (Code Editor)
- Go to: https://code.visualstudio.com
- Install recommended extensions:
  - ESLint
  - Prettier
  - MongoDB for VS Code

---

## 📁 Project Structure

```
social-media-app/
│
├── backend/
│   ├── config/
│   │   ├── db.js          ← MongoDB connection
│   │   └── multer.js      ← Image upload config
│   ├── controllers/
│   │   ├── authController.js   ← Login/Register logic
│   │   ├── userController.js   ← Profile logic
│   │   └── postController.js   ← Post/Like/Comment logic
│   ├── middleware/
│   │   └── authMiddleware.js   ← JWT token checker
│   ├── models/
│   │   ├── User.js        ← User database schema
│   │   └── Post.js        ← Post database schema
│   ├── routes/
│   │   ├── authRoutes.js  ← /api/auth endpoints
│   │   ├── userRoutes.js  ← /api/users endpoints
│   │   └── postRoutes.js  ← /api/posts endpoints
│   ├── uploads/           ← Uploaded images go here
│   ├── .env               ← Secret config (don't share!)
│   ├── server.js          ← Main server file
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html     ← The one HTML file React uses
    ├── src/
    │   ├── api/
    │   │   └── axios.js   ← HTTP request setup
    │   ├── components/
    │   │   ├── Navbar.js  ← Top navigation
    │   │   ├── PostCard.js       ← One post display
    │   │   ├── CommentBox.js     ← Comments section
    │   │   └── ProtectedRoute.js ← Auth guard
    │   ├── context/
    │   │   └── AuthContext.js   ← Global auth state
    │   ├── pages/
    │   │   ├── Login.js        ← Login page
    │   │   ├── Register.js     ← Signup page
    │   │   ├── Home.js         ← Feed page
    │   │   ├── CreatePost.js   ← Create post page
    │   │   └── Profile.js      ← User profile page
    │   ├── styles/
    │   │   └── global.css      ← Global CSS
    │   ├── App.js              ← Root component + routing
    │   └── index.js            ← React entry point
    ├── .env
    └── package.json
```

---

## 🚀 Step-by-Step Setup

### Step 1: Open Terminal in the project folder
```
cd social-media-app
```

### Step 2: Setup and run the Backend
```bash
# Go into backend folder
cd backend

# Install all dependencies (reads package.json)
npm install

# Start the backend server (with auto-restart on changes)
npm run dev
```
✅ You should see:
```
🚀 Backend server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

### Step 3: Setup and run the Frontend (open a NEW terminal tab)
```bash
# Go into frontend folder
cd social-media-app/frontend

# Install all dependencies
npm install

# Start the React app
npm start
```
✅ Browser should automatically open http://localhost:3000

---

## 🧪 How to Test the App

1. **Register** → Go to http://localhost:3000/register → Create an account
2. **Login** → Go to http://localhost:3000/login → Sign in
3. **Create Post** → Click "✏️ Post" in navbar → Write text or upload image → Click "Publish"
4. **View Feed** → Click "🏠 Feed" → See all posts
5. **Like** → Click the 🤍 button on any post
6. **Comment** → Click 💬 → Type a comment → Press →
7. **Profile** → Click your username in navbar → See/edit your profile

---

## 🌐 API Endpoints Reference

| Method | URL | Auth Required | Description |
|--------|-----|--------------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/users/:id | ✅ | Get user profile |
| PUT | /api/users/:id | ✅ | Update profile |
| POST | /api/posts/create | ✅ | Create post |
| GET | /api/posts/feed | ✅ | Get all posts |
| PUT | /api/posts/like/:id | ✅ | Like/unlike post |
| POST | /api/posts/comment/:id | ✅ | Add comment |
| DELETE | /api/posts/:id | ✅ | Delete own post |

---

## 🐛 Common Errors & Fixes

| Error | What it means | Fix |
|-------|--------------|-----|
| `ECONNREFUSED` | MongoDB not running | Start MongoDB: run `mongod` |
| `CORS error` | Backend URL mismatch | Make sure backend is on port 5000, frontend on 3000 |
| `401 Unauthorized` | JWT token expired | Log out and log back in |
| `Cannot POST /api/...` | Wrong API URL | Check REACT_APP_API_URL in frontend/.env |
| `Module not found` | Missing npm package | Run `npm install` in the correct folder |
| `Port 5000 already in use` | Something is using that port | Change PORT in backend/.env or kill the process |
| Upload fails | `uploads/` folder missing | Create it: `mkdir backend/uploads` |

---

## ☁️ Deployment Guide

### Deploy Backend to Render (Free)
1. Go to https://render.com → Sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = `production`
6. Click Deploy

### Deploy Frontend to Vercel (Free)
1. Go to https://vercel.com → Sign up
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Set:
   - Root Directory: `frontend`
   - Framework: Create React App
5. Add Environment Variables:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
   - `REACT_APP_BASE_URL` = your Render backend URL
6. Click Deploy

### Setup MongoDB Atlas (Cloud DB)
1. Go to https://www.mongodb.com/atlas → Sign up free
2. Create a cluster (free tier)
3. Create database user (remember username/password)
4. Add IP: 0.0.0.0/0 (allow all — for learning purposes)
5. Click Connect → Drivers → Copy the URI
6. Replace `<password>` with your DB user password
7. Use this as your MONGO_URI

---

## 🎓 What You Learned Building This
- ✅ REST API design with Express.js
- ✅ MongoDB schemas with Mongoose
- ✅ Password hashing with bcryptjs
- ✅ JWT authentication flow
- ✅ File uploads with Multer
- ✅ React state management with Context API
- ✅ Protected routes in React
- ✅ Axios HTTP requests with interceptors
- ✅ Responsive CSS with variables
- ✅ Full-stack app architecture
