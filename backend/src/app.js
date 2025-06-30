require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../swagger');
const dbConnect = require('./config/mongo');

const app = express();
dbConnect();

const corsOptions = {
  origin: [
    `http://localhost:${process.env.PORT || 3000}`,
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', require('./routes/index'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

const s = http.createServer(app);
const io = new Server(s, {
  cors: corsOptions
});

require('./sockets/chat')(io);

module.exports = { app, io, s };
