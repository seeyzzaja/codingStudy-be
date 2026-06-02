import "dotenv/config";

const port = Number(process.env.PORT) || 3000;

const config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: port,
  HOST: process.env.HOST || "localhost",
  NODE_ENV: process.env.NODE_ENV || "development",
  BASE_URL: process.env.BASE_URL || `http://localhost:${port}`,

};

export default config;
