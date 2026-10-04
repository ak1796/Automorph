# AutoMorph AI - Node.js + Express.js + MongoDB Backend

Express REST API service for **AutoMorph AI**, providing authentication, car catalogue queries, and user garage build persistence.

## Tech Stack
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB via Mongoose ODM
* **Auth**: JSON Web Tokens (JWT) & bcryptjs
* **CORS**: Configured for React Vite frontend (`http://localhost:5173`)

## Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js            # Mongoose MongoDB connection
│   ├── models/
│   │   ├── User.js          # User schema & password hashing
│   │   ├── Car.js           # Vehicle specs & catalog schema
│   │   └── Build.js         # Saved garage build schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoint definitions
│   │   ├── carRoutes.js     # Car catalogue routes
│   │   └── buildRoutes.js   # My Garage build routes
│   ├── controllers/
│   │   ├── authController.js# Registration, login, profile logic
│   │   ├── carController.js # Car catalog query handlers
│   │   └── buildController.js# Saved build handlers
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Bearer token protection
│   │   └── errorMiddleware.js# 404 & 500 error handlers
│   └── server.js            # Express app initialization
├── .env                     # Local environment variables
├── .env.example             # Example environment variable template
├── package.json
└── README.md
```

## Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/automorph
JWT_SECRET=automorph_super_secret_jwt_key_2026
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:5001
```

## Starting the Backend

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Available API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/health` | Service health status check | Public |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (JWT) |
| `GET` | `/api/cars` | Fetch full performance car catalogue | Public |
| `GET` | `/api/cars/:id` | Fetch specific car model specs | Public |
| `GET` | `/api/builds` | Fetch saved garage builds | Public / Private |
| `POST` | `/api/builds` | Save new custom vehicle build | Public / Private |
| `DELETE` | `/api/builds/:id` | Remove build from garage | Public / Private |
