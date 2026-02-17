# Backend Series - Day 01: Getting Started with Express.js

Welcome to Day 01 of the Backend Development Series! Today, we'll explore the fundamentals of **Express.js**, a fast, unopinionated, and minimalist web framework for Node.js.

---

## 📚 What is Express.js?

Express.js is a lightweight Node.js framework used to build web applications and APIs. It simplifies the process of building servers by providing:

- **Routing**: Handle different HTTP requests (GET, POST, PUT, DELETE, etc.)
- **Middleware**: Process requests before they reach route handlers
- **Easy Server Setup**: Start a server with just a few lines of code
- **Flexible**: Minimal structure, letting you organize code your way

---

## 🚀 Project Overview

This is our first day exploring Express.js basics. We've created a simple web server with two routes to demonstrate the fundamental concepts.

### Project Structure
```
Day-01/
├── server.js       # Main application file
├── package.json    # Project metadata and dependencies
└── README.md       # This file
```

---

## 📋 Key Concepts Today

### 1. **Initializing Express**
```javascript
const express = require('express');
const app = express();
```
- Import the Express module
- Create an Express application instance

### 2. **Defining Routes**
Routes define how your server responds to specific URLs:

```javascript
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```

- `app.get()` - Handles GET requests to a specific path
- `req` - Request object (contains client data)
- `res` - Response object (used to send data back)
- `res.send()` - Send a response to the client

### 3. **Starting the Server**
```javascript
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```
- Server listens on port 3000
- The callback function runs when the server starts

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed on your machine
- npm (comes with Node.js)

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs Express.js from `package.json`

2. **Start the Server**
   ```bash
   node server.js
   ```

3. **Test the Server**
   Open your browser and navigate to:
   - `http://localhost:3000/` → Shows "Hello World!"
   - `http://localhost:3000/About` → Shows "Hello About!"

---

## 📝 Current Routes

| Route | Method | Response |
|-------|--------|----------|
| `/` | GET | Hello World! |
| `/About` | GET | Hello About! |

---

## 🎯 Current Implementation

The `server.js` file contains:

1. ✅ Express module import
2. ✅ App initialization
3. ✅ Two GET routes (home and about)
4. ✅ Server listener on port 3000
5. ✅ Console log on server start

---

## 📚 Learning Points for Day 01

- [x] Understanding how Express.js works
- [x] Creating a basic Express application
- [x] Defining GET routes
- [x] Handling requests and sending responses
- [x] Starting and running a local server
- [x] Testing routes in the browser

---

## 🔧 HTTP Methods We'll Cover

- **GET** - Retrieve data (already implemented ✅)
- **POST** - Submit data (coming soon)
- **PUT** - Update data (coming soon)
- **DELETE** - Remove data (coming soon)

---

## 💡 Tips & Best Practices

1. **Port Numbers**: Avoid using ports below 1024 (reserved for system services)
2. **Error Handling**: Always include error handlers for production
3. **Modular Code**: Separate routes into different files as projects grow
4. **Status Codes**: Always send appropriate HTTP status codes
5. **Logging**: Use logging to debug and monitor your server

---

## 🚦 Next Steps (Day 02+)

- [ ] Add POST route to receive data
- [ ] Implement middleware
- [ ] Add error handling
- [ ] Separate routes into a dedicated file
- [ ] Connect to a database
- [ ] Add proper status codes to responses

---

## 📖 Useful Resources

- [Express.js Official Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [HTTP Status Codes Reference](https://httpwg.org/specs/rfc7231.html#status.codes)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎓 Summary

Today, we've learned:
- How to set up an Express server
- How to create basic routes
- How to handle GET requests
- How to start and test a local server

This foundation will help us build more complex applications in the coming days!

---

**Happy Coding! 🎉**
