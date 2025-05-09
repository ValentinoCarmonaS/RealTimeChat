const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

roomSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
