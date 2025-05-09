const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			minlength: 6
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

UserSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
	// Compare the password with the hashed password
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('user', UserSchema);
