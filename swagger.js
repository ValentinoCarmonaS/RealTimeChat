const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Real-Time Chat System API',
			version: '1.0.0',
			description:
				'RESTful API for a real-time chat system with authentication, rooms, and messaging.',
			contact: {
				name: 'Valentino Carmona',
				email: 'vcarmona@example.com'
			}
		},
		servers: [
			{
				url: process.env.FRONTEND_URL,
				description: 'Production server'
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		}
	},
	apis: ['./backend/src/controllers/*.js'] // Ruta correcta a los controladores
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
