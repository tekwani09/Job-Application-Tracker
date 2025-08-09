# 💼 Job Application Tracker (MERN Stack)

A full-stack **Job Application Tracker** web app built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It enables users to register, log in, and manage their job applications efficiently — all with a secure, responsive, and user-friendly interface.

---

## 🚀 Project Overview

This project helps users organize and track the status of their job applications with features like adding jobs, updating status, editing details, and filtering applications.

It is built with a **React frontend**, **Node.js/Express backend**, and **MongoDB** for data storage. JWT is used for user authentication and secure route access.

---

## ✨ Features

* User Registration and Login (JWT authentication)
* Add, Edit, Delete, and View job applications
* Filter by job status (Pending, Interview, Declined)
* Sort jobs by latest or oldest
* Search jobs by title or company
* Protected API routes
* Responsive frontend interface
* Fully functional full-stack architecture

---

## 🛠 Tech Stack

### Frontend:

* React.js
* React Router DOM
* Axios
* CSS 

### Backend:

* Node.js
* Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT)
* bcrypt.js
* dotenv
* cors

---

## 📁 Project Structure

### Backend:

* `controllers/` – Handles business logic (auth & job operations)
* `routes/` – Defines API endpoints for authentication and jobs
* `models/` – Mongoose schemas for User and Job
* `middleware/` – Auth middleware for route protection
* `server.js` – Entry point to the backend application

### Frontend:

* `pages/` – React components for Login, Register, Dashboard, AddJob, EditJob
* `components/` – Reusable UI components like JobCard
* `App.js` – Main app component with routes
* `index.js` – React entry point

---

## 🔧 Installation & Setup

### Prerequisites:

* Node.js and npm installed
* MongoDB Atlas or local MongoDB server

### Backend Setup:

1. Navigate to the `backend` folder
2. Run `npm install` to install dependencies
3. Create a `.env` file and add:

   * `PORT=8080`
   * `MONGO_URL=your_mongodb_connection_string`
   * `JWT_SECRET=your_secret_key`
4. Start the server with `npm start`

### Frontend Setup:

1. Navigate to the `frontend` folder
2. Run `npm install` to install dependencies
3. Start the React app with `npm start`

---

#🌍 Deployment

The app is deployed using Render : https://job-frontend-vercel.onrender.com


