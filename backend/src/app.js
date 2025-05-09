require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/mongo');
const app = express();

// Socket.io
const chatSocket = require('./sockets/chat.js');
const http = require('http');
const { Server } = require('socket.io');
const s = http.createServer(app);
const io = new Server(s);

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// All routes for the Frontend localhost:3000/______
app.use('/', require('./../../frontend/index.html'));

// ALL routes localhost:3000/api/______
app.use('/api', require('./routes/index'));

const server = app.listen(port, () => {
	console.log(`\nServer is running on http://localhost:${port}\n`);
});

dbConnect();
chatSocket(io);

module.exports = { app }; // Export the server for testing purposes
