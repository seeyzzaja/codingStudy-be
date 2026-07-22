  import "dotenv/config";
  
  const port = Number(process.env.PORT) || 3000;

  const accessSecret = process.env.ACCESS_SECRET?.trim();

  if (!accessSecret) {
    throw new Error("ACCESS_SECRET belum diisi di file .env");
  }

 const config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: port,
  HOST: process.env.HOST || "localhost",
  NODE_ENV: process.env.NODE_ENV || "development",
  BASE_URL: process.env.BASE_URL || `http://localhost:${port}`,
  ACCESS_SECRET: accessSecret,
  API_PREFIX: process.env.API_PREFIX || "/api",

  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY!,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY!,
  MIDTRANS_IS_PRODUCTION:
    process.env.MIDTRANS_IS_PRODUCTION === "true",

  MIDTRANS_MERCHANT_ID: process.env.MIDTRANS_MERCHANT_ID!,
};

  export default config;
