const { s } = require('./app');

const port = process.env.PORT || 3000;

s.listen(port, () => {
	console.log(`\nServer is running on http://localhost:${port}\n`);
});
