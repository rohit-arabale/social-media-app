Please open the folder of socialmediaapp

# Social Media App

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) social media application that allows users to create accounts, share posts, upload images, interact with content, and manage personal profiles.

## Features

### Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes

### User Features

* Create and Manage Profile
* Upload Profile Images
* View Other User Profiles
* Update Account Information

### Posts & Content

* Create Posts
* Upload Images
* View Posts Feed
* Like Posts
* Comment on Posts
* Delete Own Posts

### Responsive UI

* Modern React Frontend
* Responsive Design
* Dynamic Routing
* Real-time User Experience

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcryptjs
* Multer

---

## Project Structure

```bash
social-media-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start backend server:

```bash
npm start
```

or

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application will run at:

```text
http://localhost:3000
```

---

## API Features

### Authentication

* Register User
* Login User
* Verify JWT Token

### User Management

* Get User Profile
* Update User Profile

### Posts

* Create Post
* Fetch Posts
* Like Posts
* Comment on Posts
* Delete Posts

---

## Screenshots

### Login Page

![Login](screenshots/login.png)

### Home Feed

![Feed](screenshots/feed.png)

### User Profile

![Profile](screenshots/profile.png)

---

## Future Improvements

* Follow / Unfollow Users
* Real-Time Chat
* Notifications
* Dark Mode
* Stories Feature
* Infinite Scrolling
* WebSocket Integration
* Cloud Storage for Images

---

## Learning Outcomes

This project demonstrates:

* Full-Stack Web Development
* REST API Development
* Authentication & Authorization
* MongoDB Database Design
* React State Management
* File Upload Handling
* Backend Architecture
* Frontend Routing

---

## Author

Soham

GitHub: https://github.com/yourusername

---

## License

This project is created for educational and portfolio purposes.
