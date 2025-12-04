import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // ให้ drizzle-kit เห็น .env ตอนรันคำสั่ง

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // บังคับให้ใช้ SSL กับ Render
    url: process.env.DATABASE_URL + "?sslmode=require",
  },
});