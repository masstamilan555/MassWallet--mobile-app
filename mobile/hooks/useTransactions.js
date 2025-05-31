import { useCallback, useState } from "react";
import { Alert } from "react-native";
import {API_URL} from "../lib/api"
export const useTransactions = (userId) => {
  const [transactions, setTransaction] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTransaction = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await res.json();
      setTransaction(data);
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/summary/${userId}`,{method:"GET"});
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([fetchSummary(), fetchTransaction()]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [fetchTransaction, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete transaction");
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };
  return { transactions, summary, loading, loadData, deleteTransaction };
};
