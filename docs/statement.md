## **Practical Assignment: Real-Time Chat System with WebSockets**

### **Introduction**

In this project, you will develop a _real-time chat system_ that allows multiple
users to send and receive messages instantly in a shared chat room. The
application will use WebSockets as the communication protocol and will follow
backend development best practices. This assignment includes detailed
instructions and considerations to guide you.

The purpose of this project is to introduce you to the concepts of real-time
communication, a key component in modern applications such as instant messaging,
multiplayer games, or collaborative tools. You will learn to set up a backend
server, manage WebSocket connections, and connect a frontend to test the
functionality.

---

### **Objectives**

- Design and implement a chat application that supports real-time communication
  between multiple users.
- Use WebSockets to manage bidirectional connections between clients and the
  server.
- Write JavaScript code following programming best practices.
- Perform tests to ensure the functionality and quality of the application.
- Document the application clearly and comprehensively.

---

### **Technical Requirements**

- **Programming Language**: JavaScript, using Node.js as the runtime
  environment.
- **WebSocket Library**: Socket.IO (recommended for its simplicity) or `ws` (for
  a lighter solution).
- **Framework (optional)**: Express.js to handle HTTP routes and serve frontend
  files.
- **Frontend**: HTML, CSS, and vanilla JavaScript for a minimal interface.
  Optionally, use `Socket.IO-client` to connect the frontend to the backend.
- **Testing**: Conduct manual tests to verify chat functionality. Optionally,
  use a framework like Jest for automated tests.
- **Documentation**: Document the application in a `README.md` file with clear
  instructions for installation, execution, and usage.

---

### **Project Details**

#### **1. Backend**

- Implement a backend server that manages WebSocket connections and supports the
  following functionalities:
     - **User Connections**: Allow multiple users to connect to a shared chat
       room.
     - **Real-Time Messaging**: Send messages from one user to all others,
       including the sender’s username and message content.
     - **Notifications**: Notify all users when someone connects or disconnects
       (e.g., "User X has connected" or "User X has disconnected").
- Use Express.js (optional) to serve frontend files (e.g., `index.html`).
- Handle basic errors, such as failed connections or empty messages.

#### **2. Frontend**

- Create a minimal web interface with the following elements:
     - A form for users to enter their username before joining the chat.
     - An area to display chat messages, updated in real time.
     - A text input field and a button to send messages.
- Connect the frontend to the backend using WebSockets (e.g., with
  `Socket.IO-client`).
- The interface must be functional, though advanced styling is not required.

#### **3. Routes and Events**

- Define the necessary WebSocket events for communication:
     - `connection`: Detect when a user connects.
     - `disconnect`: Detect when a user disconnects.
     - `message`: Send and receive messages between users.
     - `join`: Register the user’s username upon joining the chat.
- If using Express.js, define an HTTP route to serve the frontend (e.g., `GET /`
  to return `index.html`).

#### **4. Testing**

- Perform manual tests to verify:
     - Messages are sent and received in real time.
     - Connection and disconnection notifications work correctly.
     - Multiple users can connect simultaneously without errors.
- Optional: Implement automated tests with Jest or Mocha to verify WebSocket
  events or HTTP routes.

#### **5. Documentation**

- Provide a clear description of the application in a `README.md` file,
  including:
     - **Description**: What the application does and its purpose.
     - **Installation Instructions**: How to install dependencies (e.g.,
       `npm install`) and run the application (e.g., `npm start`).
     - **Usage Instructions**: How to connect to the chat and send messages.
     - **Example Interaction**:
          ```
          User enters their name: "Ana"
          Ana sends: "Hello, how are you?"
          All users see: "Ana: Hello, how are you?"
          Ana disconnects, all users see: "Ana has disconnected"
          ```
     - **Technologies Used**: List of tools and libraries used (Node.js,
       Socket.IO, etc.).

---

### **Additional Considerations**

- **Best Practices**:
     - Write modular code, separating server logic, WebSocket events, and
       frontend code into different files.
     - Use consistent naming for variables and functions (e.g., `camelCase`).
     - Define constants for fixed values, such as WebSocket event names
       (`"message"`, `"join"`, etc.).
- **Basic Validation**:
     - Ensure messages are not empty before sending.
     - Validate that usernames are unique or not empty.
- **Scalability**:
     - Although this is a basic project, consider how you could expand it in the
       future (e.g., adding private chat rooms or authentication).
- **Debugging**:
     - Use `console.log` or a debugger to identify issues during development.

---

### **Deliverables**

1. **Source Code**: All application files, organized in a clear structure (e.g.,
   `backend/` and `frontend/` folders).
2. **Documentation**: A `README.md` file with the specified instructions and
   details.
3. **Execution Instructions**: Explain how to install dependencies, set up the
   environment, and run the application.
4. **Test Report**: A brief description of the tests performed (manual or
   automated) and their results.

---

### **Evaluation Criteria**

- **Functionality (40%)**: The application must enable real-time communication,
  with messages and notifications working correctly.
- **Code Quality (30%)**: The code must be clean, organized, and follow best
  practices.
- **Testing (15%)**: Tests must verify the main cases (connection, messaging,
  disconnection).
- **Documentation (15%)**: The documentation must be clear and sufficient for
  another developer to install and use the application without issues.

---

### **Recommended Resources**

- **Official Documentation**:
     - [Node.js](https://nodejs.org/en/docs/)
     - [Express.js](https://expressjs.com/)
     - [Socket.IO](https://socket.io/docs/v4/)
- **Tutorials**:
     - Tutorials on building a chat with Socket.IO (e.g., on FreeCodeCamp or
       Dev.to).
     - Example:
       [Socket.IO Guide on FreeCodeCamp](https://www.freecodecamp.org/news/how-to-build-a-chat-app-with-socket-io-node-js/).
- **Testing**:
     - Guides for testing with Jest or Mocha.
- **Documentation**:
     - Examples of `README.md` files in GitHub projects.

---

### **Final Tips**

- **Plan**: Break the work into stages (setup, backend, frontend, testing,
  documentation).
- **Test Frequently**: Run the application and perform manual tests during
  development to catch errors early.
- **Seek Help**: If you have questions, consult official documentation, online
  tutorials, or ask your instructor.
- **Have Fun**: This project is a chance to explore how applications like
  WhatsApp or Discord work.

---

### **Submission**

- Upload your project to a GitHub repository.
- Ensure all necessary files (code, documentation, etc.) are included.
- Share the repository link with your instructor before the deadline.

**Submission Deadline**: [Specify date, e.g., May 20, 2025]  
**Format**: GitHub repository link submitted via [email/course platform].

**Good luck, and happy coding!**
