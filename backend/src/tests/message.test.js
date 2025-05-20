const request = require('supertest');
const { app } = require('../app');
const { messagesModel, usersModel, roomsModel } = require('../models/index');
const jwt = require('jsonwebtoken');
const message = require('../models/nosql/message');

describe('Message Endpoints', () => {
	let token;
	let userId;
	let username;
	let roomId;
	const messageContent = 'Hello, this is a test message';

	beforeAll(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
		const user = await usersModel.create({
			name: 'TestUser',
			email: 'testuser@email.com',
			password: 'password123'
		});
		userId = user._id;
		username = user.name;
		token = jwt.sign(
			{
				id: user._id,
				name: user.name
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		const room = await roomsModel.create({
			name: 'TestRoom',
			createdBy: userId
		});
		roomId = room._id;
	});

	afterEach(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
	});

	afterAll(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
	});

	it('should create a new message', async () => {
		const res = await request(app)
			.post('/api/message')
			.set('Authorization', `Bearer ${token}`)
			.send({
				room: roomId,
				user: userId,
				message: messageContent
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Message created successfully');
		expect(res.body.data.message).toBe(messageContent);
		expect(res.body.data.room).toBe(roomId.toString());
		expect(res.body.data.user).toBe(userId.toString());
	});
});
