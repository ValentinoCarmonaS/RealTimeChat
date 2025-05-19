require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dbConnect = require('./config/mongo');

const app = express();
dbConnect();

app.use(
	cors({
		origin: 'http://localhost:3000'
	})
);

app.use(express.json());

app.use('/api', require('./routes/index'));

app.use((req, res, next) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
	});
})

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		success: false,
		message: 'Internal Server Error'
	});
});

const s = http.createServer(app);
const io = new Server(s, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});

require('./sockets/chat')(io);

module.exports = { app, io, s };
