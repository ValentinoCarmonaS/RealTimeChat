# Real-Time Chat System

![Build Status](https://github.com/ValentinoCarmonaS/RealTimeChat/actions/workflows/ci.yml/badge.svg)
[![Codecov](https://codecov.io/gh/ValentinoCarmonaS/RealTimeChat/branch/main/graph/badge.svg)](https://codecov.io/gh/ValentinoCarmonaS/RealTimeChat)

A **real-time chat application** built with **Node.js**, **Express**,
**Socket.IO**, and **MongoDB**, enabling multiple users to send and receive
messages instantly in a shared chat room. It implements the **MVC** pattern,
featuring a minimal frontend, persistent message storage, and easy deployment.

## 🚀 Features

- **Real-Time Messaging**: Send and receive messages instantly using WebSockets.
- **Persistence**: Store messages in MongoDB for chat history.
- **Notifications**: Alerts for user connections and disconnections.
- **Minimal Interface**: Simple frontend with HTML, CSS, and JavaScript.
- **Testing**: Comprehensive automated tests with Jest and Supertest (93.75%
  branch coverage).
- **Docker**: Containerized setup for easy deployment.

## 📋 Prerequisites

- **Node.js** v16+
- **MongoDB Atlas** or a local MongoDB instance
- **Docker** and **Docker Compose** (optional, for containerized setup)
- Modern web browser (Chrome, Firefox, etc.)

## 🛠️ Installation

1. Clone the repository:

      ```bash
      git clone https://github.com/ValentinoCarmonaS/RealTimeChat.git
      cd RealTimeChat
      ```

2. Install dependencies:

      ```bash
      npm install
      ```

3. Create a `.env` file in the root directory with:

      ```bash
      PORT=3000
      MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/realtime-chat?retryWrites=true&w=majority
      ```

## ▶️ Running the Application

- **Locally**:

     ```bash
     npm start
     ```

     The application will be available at `http://localhost:3000`.

- **With Docker**:

     ```bash
     make build
     make up
     ```

     Stop containers with:

     ```bash
     make down
     ```

## 🧪 Testing

Run tests with Docker:

```bash
make test
```

Or run tests with npm:

```bash
npm test
```

- Tests cover user connections, message sending and storage, and WebSocket event
  logic.
- Coverage: 93.75% branches, 98.64% statements.
- View detailed reports in `coverage/lcov-report/index.html`.

## 📚 Main Functionalities

- **User Connection**: Users enter a username and join a shared chat room.
- **Messages**: Messages are sent in real-time, stored in MongoDB, and displayed
  with the sender’s username.
- **History**: Retrieve historical messages when a new user connects.
- **Notifications**: Alerts when a user connects or disconnects.

### Example Interaction

```
User enters their name: "Ana"
Ana sends: "Hello, how are you?"
All users see: "Ana: Hello, how are you?" (stored in MongoDB)
Ana disconnects, all users see: "Ana has disconnected"
```

For more details, refer to the [technical specification](docs/spec.md).

## 🗂️ Project Structure

```
RealTimeChat/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment and database setup
│   │   ├── controllers/    # Business logic for WebSockets and messages
│   │   ├── middlewares/    # Validation and error handling
│   │   ├── models/         # MongoDB schemas for messages
│   │   ├── routes/         # HTTP routes for frontend and auxiliary endpoints
│   │   ├── sockets/        # WebSocket-specific logic
│   │   ├── tests/          # Unit and integration tests
│   │   └── app.js          # Express application setup
├── frontend/
│   ├── index.html          # Main interface
│   ├── styles.css          # Basic styles
│   └── script.js           # Frontend logic
├── .env                    # Environment variables
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── Makefile                # Automation scripts
└── package.json            # Dependencies and scripts
```

## 📜 License

[MIT](LICENSE)
