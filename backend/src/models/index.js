const models = {
	usersModel: require('./nosql/user'),
	messagesModel: require('./nosql/message'),
	roomsModel: require('./nosql/room')
};

module.exports = models;
