# Splitify
## *Given *Objective**

To implement a basic application using the MERN stack with the following features:

1. Admin User Login
2. Agent Creation & Management
3. Uploading and Distributing Lists

Setup steps:
-> Clone the repo from https://github.com/Revermore/CSTech-Assignment and get into root directory "cd CSTech-Assignment"
-> Get into terminal of backend directory "cd backend" and type "npm install" to install backend dependencies
-> Get into terminal of frontend directory "cd ../frontend"  and type "npm install" to install backend dependencies
-> Get into terminal of backend directory "cd ..backend" and type "npm start" to run the backend server
-> Get into terminal of backend directory "cd ../frontend" type "npm run dev" to run the frontend server
-> Open frontend server using "http://localhost:5173/"

🚀 Live: https://cs-tech-assignment-hzj9.vercel.app/

## 🛠️ Tech Stack

- Frontend: React, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB (Atlas)
- Auth: JWT
- Hosting: Vercel (Frontend), Vercel (Backend)

## ✨ Features

- User login/signup (JWT Auth)
- Role-based access: Admin and Agent
- Logic to distribute tasks admong all agents
- Pagination in Agent dashboard and task view in Admin dashboard
- Responsive UI with Bootstrap
- Multiple data models to decrease bloating

## .env file:
PORT = 5000
MONGODB_URI = mongodb+srv://pguruprasad204:DtLYV1l53ESSlqW0@cluster0.lhxosib.mongodb.net/
JWT_SECRET = ASDFZXCQWEPLMOKN

## Where to Improce:
-> Add a loading state
