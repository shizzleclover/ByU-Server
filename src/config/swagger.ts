import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ByU Connect API',
      version: '1.0.0',
      description: 'The backend API for ByU Connect campus talent discovery platform.',
      contact: {
        name: 'API Support',
        url: 'https://byu-connect.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.validation.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
