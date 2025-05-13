require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dbConnect = require('./config/mongo');

const app = express();
const s = http.createServer(app);
const io = new Server(s, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});

dbConnect();

app.use(
	cors({
		origin: 'http://localhost:3000'
	})
);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use('/api', require('./routes/index'));

require('./sockets/chat')(io);

const port = process.env.PORT || 3000;

s.listen(port, () => {
	console.log(`\nServer is running on http://localhost:${port}\n`);
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: 'Error interno del servidor'
	});
});

module.exports = { app, io };
