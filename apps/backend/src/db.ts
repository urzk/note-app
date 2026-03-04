import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    return "";
  }
  return value;
};

export const pool = mysql.createPool({
  host: requiredEnv("DB_HOST"),
  port: Number(requiredEnv("DB_PORT")),
  user: requiredEnv("DB_USER"),
  password: requiredEnv("DB_PASSWORD"),
  database: requiredEnv("DB_NAME"),
  connectionLimit: 10,
});
