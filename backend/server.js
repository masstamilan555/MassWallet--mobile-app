//libraries import
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//file imports
import ratelimiter from "./src/middleware/rateLimiter.js";
import transactionRoutes from "./src/routes/transactionRoutes.js" 
import { sql } from "./src/config/db.js";
//environment configuration and database connection
dotenv.config();

const app = express();
//json parsing
app.use(express.json());
app.use(ratelimiter)

//cross origins
app.use(
  cors({
    origin: [],
    credentials: true,
  })
);

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
    console.log("db initialized successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
//api alive?
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "API is live & ready to roll" });
});

//api routes
app.use("/api/transactions",transactionRoutes)

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening  on port at http://localhost:${PORT}`);
  });
});
