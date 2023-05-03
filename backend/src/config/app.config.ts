import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
		name: process.env.APP_NAME,
		port: parseInt(process.env.SERVER_PORT || process.env.PORT, 10) || 3000,
	  env: process.env.NODE_ENV || 'development',
	  workingDirectory: process.env.PWD || process.cwd(),
	  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
	  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
	  apiPrefix: process.env.API_PREFIX || 'api',
}));