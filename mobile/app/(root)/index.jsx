import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NoTransactionFound from "../../components/NoTransactionFound";
import { SignOutButton } from "../../components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useCallback, useEffect, useState } from "react";
import BalanceCard from "../../components/BalanceCard";
import TransactionItem from "../../components/TransactionItem";
import PageLoader from "../../components/PageLoader";
import { styles } from "@/assets/styles/home.style";
import { useFocusEffect, useRouter } from "expo-router";
export default function Page() {
  const { user } = useUser();
  const { transactions, summary, loading, loadData, deleteTransaction } =useTransactions(user.id);
  const router = useRouter();
  const [refreshing,setRefreshing] =useState(false)
  const onRefresh =async()=>{
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  } 
  useFocusEffect(
  useCallback(() => {
    loadData();
  }, [loadData])
);
  const handleDelete = (id) => {
    try {
      Alert.alert("Delete Transaction", "Do you wanna delete this?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]);
    } catch (err) {
      Alert.alert("error", err);
    }
  };
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !refreshing) return <PageLoader />;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("create")}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<NoTransactionFound />}
      />
    </View>
  );
}
