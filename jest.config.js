module.exports = {
	// Entorno de pruebas (Node.js para una API)
	testEnvironment: 'node',

	// Tiempo máximo por prueba (10 segundos, útil para MongoDB)
	testTimeout: 10000,

	// Archivos de setup que se ejecutan después de configurar el entorno
	setupFilesAfterEnv: ['./backend/src/tests/setup.js'],

	// Ignorar la carpeta node_modules
	testPathIgnorePatterns: ['/node_modules/'],

	// Patrones para encontrar archivos de prueba
	testMatch: ['<rootDir>/backend/src/tests/**/*.test.js'],

	// Extensiones de archivos que Jest debe reconocer
	moduleFileExtensions: ['js', 'json'],

	// Mostrar información detallada de las pruebas
	verbose: true,

	// Limpiar mocks automáticamente entre pruebas
	clearMocks: true,

	// Ejecutar pruebas secuencialmente
	maxWorkers: 1,

	// Configuración de cobertura
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/backend/src/tests/setup.js',
		'/backend/src/config/',
		'/frontend/'
	],

	// Umbral mínimo de cobertura (opcional, ajusta según tus necesidades)
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	}
};
