const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Room',
		default: null // Null para mensajes en una sala general
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

messageSchema.index({ room: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
