const { messagesModel } = require('../models/index');

module.exports = io => {
	io.on('connection', socket => {
		// Join to the room
		socket.on('join', async ({ username, roomId }) => {
			socket.join(roomId);
			socket.username = username;
			socket.room = roomId;

			// Send all messages to the client only for the room
			const messages = await messagesModel.find({
				room: socket.room
			});
			socket.emit('loadMessages', messages);

			// Notify all clients in the room that a new user has joined
			io.to(socket.room).emit(
				'notification',
				`${username} has joined the room`
			);
		});

		// Handle incoming messages
		socket.on('sendMessage', async message => {
			const newMessage = new messagesModel({
				username: socket.username,
				message: message,
				room: socket.room
			});
			await newMessage.save();
			io.to(socket.room).emit('message', {
				username: newMessage.username,
				message: newMessage.message,
				date: newMessage.date
			});
		});

		// Handle user disconnect
		socket.on('disconnect', () => {
			io.to(socket.room).emit(
				'notification',
				`${socket.username} has left the room`
			);
		});
	});
};
