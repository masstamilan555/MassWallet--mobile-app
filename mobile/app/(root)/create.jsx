import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useId, useState } from 'react'
import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { API_URL } from "../../lib/api"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import { styles } from "../../assets/styles/create.styles"
const CATEGORIES = [
    { id: "food", name: "Food & Drinks", icon: "fast-food" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "transportation", name: "Transportation", icon: "car" },
    { id: "entertainment", name: "Entertainment", icon: "film" },
    { id: "bills", name: "Bills", icon: "receipt" },
    { id: "income", name: "Income", icon: "cash" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal" },
]
const CreateScreen = () => {
    const router = useRouter()
    const { user } = useUser()
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [isExpense, setISExpense] = useState(true)
    const [isLoading, setISLoading] = useState(false)

    const handleCreate = async () => {
        if (!title.trim()) return Alert.alert("Error", "Please select a category")

        if (!amount || isNaN((parseFloat(amount)) || parseFloat(amount) <= 0)) {
            return Alert.alert("Error", "Please enter a valid amount")
        }

        if (!selectedCategory) return Alert.alert("Error", "Please select a valid category")
        setISLoading(true)
        try {
            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))

            const response = await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    title,
                    amount: formattedAmount,
                    category: selectedCategory
                })
            })
            

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to create successfully")
            }

            Alert.alert("Success", "Transation created successfully")
            router.back()
        } catch (err) {
            console.log(err);
            
            return Alert.alert("Error", err.message)
        } finally {
            setISLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading}>
                    <Text style={styles.saveButton}>{isLoading ? "Saving" : "Save"}</Text>
                    {isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    {/* income or expense */}
                    <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setISExpense(true)}
                    >
                        <Ionicons name='arrow-down-circle' size={22} color={isExpense ? COLORS.white : COLORS.expense}
                            style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, isExpense && styles.typeButtonText, isExpense && { color: "white" }]}>Expense</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                        onPress={() => setISExpense(false)}
                    >
                        <Ionicons name='arrow-down-circle' size={22} color={!isExpense ? COLORS.white : COLORS.income}
                            style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonText, !isExpense && { color: "white" }]}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* Amount conatiner */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder='0.00'
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType='numeric'
                    ></TextInput>
                </View>

                {/* input conatiner */}
                <View style={styles.inputContainer}>
                    <Ionicons name='create-outline'
                        size={22}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Transaction Title'
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Title */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name='pricetag-outline'
                        size={16}
                        color={COLORS.text}
                    />Category
                </Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity key={category.id}
                            style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons style={styles.categoryIcon}
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                            />
                            <Text style={[styles.categoryButtonText, selectedCategory === category.name && styles.categoryButtonTextActive]}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            )}
        </View>
    )
}

export default CreateScreen