import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.style'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { useRouter } from 'expo-router'

const NoTransactionFound = () => {
    const router =useRouter()
  return (
    <View style={styles.emptyState}>
        <Ionicons style={styles.emptyStateIcon}
        name='receipt-outline'
        color={COLORS.textLight}
        size={60}/>
      <Text style={styles.emptyStateTitle}>No Transaction Found</Text>
      <Text style={styles.emptyStateText}>Start tracking your expenses and save you currency</Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={()=>router.push("/create")}>
        <Ionicons name='add-circle' size={18} color={COLORS.white}/>
        <Text style={styles.emptyStateButtonText}>Add a new Transaction</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NoTransactionFound