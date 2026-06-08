import swaggerJsdoc from "swagger-jsdoc";
import config from "#utils/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "coding_study API Documentation",
      version: "1.0.0",
      description: "Dokumentasi lengkap API coding_study",
      contact: {
        name: "Backend Developer",
      },
    },
    servers: [
      {
        url: `${config.BASE_URL}${config.API_PREFIX}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/**/*.ts", "src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
