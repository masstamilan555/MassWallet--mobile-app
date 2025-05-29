import express from "express"

import { createTransaction, deleteTransaction, getSummary, getTransactions } from "../controllers/transactionRoutes.js";

const router = express.Router()

router.get("/:userId", getTransactions);
router.post("/", createTransaction);
router.delete("/:id",deleteTransaction)
router.get("/summary/:userId",getSummary)

export default router