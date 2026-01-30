# 📚 Library Management System (LMS)

A **web-based Library Management System** built with a **Node.js RESTful backend** and a **modern frontend**.
This system manages **books, users, borrowing, returning, fines, and roles** following real-world library rules.

---

## 🎯 Project Purpose

This project was built to:

* Apply backend engineering fundamentals
* Model real-world library workflows
* Enforce business rules securely
* Provide a complete API-ready system usable by a frontend

---

## 🧩 System Overview

### 👥 User Roles

* **Admin**

  * Manage librarians
  * Assign roles & user status
* **Librarian**

  * Manage books & categories
  * Process borrowing & returning
* **Member (Student)**

  * View books
  * Borrow & return books (via librarian)

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT (Access + Refresh tokens)
* bcrypt
* CORS
* dotenv

### Frontend

* Web-based UI
* Connected via REST API
* Runs locally

---

## 🔐 Authentication & Security

* JWT-based authentication
* httpOnly cookies for access tokens
* Role-based access control (RBAC)
* Protected routes
* Environment variables for secrets

---

## 📦 Core Features

### 👤 User Management

* Login / Logout
* Role assignment
* Account suspension

### 📚 Book Management

* Add / update / delete books
* Categories
* Availability tracking

### 🔄 Borrowing System

* Borrow limit enforcement
* Due date calculation
* Prevent duplicate borrowing
* Status tracking

### 💰 Fine System

* Late return fines
* Fine accumulation
* Borrow blocking when limit exceeded

---

## 🌐 API Design Principles

* RESTful endpoints
* Meaningful HTTP status codes
* JSON-based responses
* No business logic in routes
* Centralized validation & error handling

---

## 📂 Project Structure (Backend)

```
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── .env
├── database.js
└── server.js
```

---

## ⚙️ How to Run Locally

### 1️⃣ Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL
* npm

---

### 2️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-name>
```

---

### 3️⃣ Install Dependencies

Do install dependencies for the frontend and backend by:

```bash
npm install
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/lms
JWT_SECRET=your_jwt_secret
```

---

### 5️⃣ Setup Database

* Create the database
* Run the provided SQL schema / migrations from DATABASE_DDL.txt provided
* Ensure tables:

  * users
  * roles
  * books
  * categories
  * borrow_records
  * fine_records

---

### 6️⃣ Start the Backend

```bash
node server.js
```

Server runs on:

```
http://localhost:3000
```

---

### 7️⃣ Run the Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔄 CORS Configuration

Backend allows frontend access:

```js
origin: "http://localhost:5173",
credentials: true
```

Frontend requests must include:

```js
credentials: "include"
```

---

## 🧪 Testing (Manual)

* Use Postman to test APIs
* Validate:

  * Role restrictions
  * Borrow limits
  * Fine logic
  * Status enforcement

---

## 📌 Notes

* Backend is **fully completed**
* Frontend consumes backend APIs directly
* No mock data
* Suitable for real-world extension

---

## 🏁 Final Outcome

After completing this project:

* ✅ Solid backend engineering foundation
* ✅ Real-world business logic implementation
* ✅ Production-style API design
* ✅ Ready for frontend integration or deployment
