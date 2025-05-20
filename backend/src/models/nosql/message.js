const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	message: {
		type: String,
		required: true
	},
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

messageSchema.index({ room: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
