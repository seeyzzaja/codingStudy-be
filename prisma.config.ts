import "dotenv/config";
import process from "node:process";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url:
      process.env["DATABASE_URL"] ??
      "postgresql://postgres:postgres@localhost:5432/postgres",
  },
});
