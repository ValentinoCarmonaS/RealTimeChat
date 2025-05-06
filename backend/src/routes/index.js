const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH_ROUTES = __dirname;

// Remove the file extension from the filename, and return the name of the file
const removeExtension = filename => {
	return filename.split('.').shift();
};

// Read all files in the routes directory and use them as routes
fs.readdirSync(PATH_ROUTES).filter(file => {
	const name = removeExtension(file);
	if (name !== 'index') {
		router.use(`/${name}`, require(`./${file}`));
	}
});

module.exports = router;
