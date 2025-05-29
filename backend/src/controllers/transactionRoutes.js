import { sql } from "../config/db.js";

export const getTransactions=async (req, res) => {
  try {
    const { userId } = req.params;
    const transaction = await sql`
    SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transaction);
  } catch (err) {
    console.log(err);
    res.status(500).json({message:"Internal server error"})
  }
}


export const deleteTransaction=async(req,res)=>{
    try {
        const {id} = req.params
        if(isNaN(parseInt(id))){
            return res.status(400).json({message:"Invaid Id"})
        }
        const result = await sql`DELETE FROM transactions WHERE id=${id} RETURNING *`
        if (result.length=== 0){
            return res.status(404).json({message:"transaction not found"})
        }
        res.status(200).json({message:"transaction deleted successfully"})

    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

export const createTransaction =async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;
    res.status(201).json(transaction[0]);
  } catch (err) {
    console.log("error creating transaction", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getSummary =async(req,res)=>{
    try {
        const {userId}=req.params        
        const balanceResult =await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}`
        const incomeResult =await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${userId} AND amount>0`
        const expenseResult =await sql`SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id=${userId} AND amount <0`

        res.status(200).json({balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expenses:expenseResult[0].expenses
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}