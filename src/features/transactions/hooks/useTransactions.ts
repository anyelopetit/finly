import { useState, useMemo } from 'react'
import { useDataStore } from '@/store/dataStore'
import type { Transaction, TransactionType, CreateTransactionInput } from '@/types'

export function useTransactions() {
  const { transactions, categories, addTransaction, deleteTransaction, updateTransaction } =
    useDataStore()

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [search, setSearch] = useState('')

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const descMatch = t.description?.toLowerCase().includes(q)
        const catMatch = t.category?.name.toLowerCase().includes(q)
        return descMatch || catMatch
      }
      return true
    })
  }, [transactions, filterType, search])

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    filteredTransactions.forEach((t) => {
      const dateKey = t.date
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(t)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredTransactions])

  return {
    transactions,
    categories,
    filterType,
    setFilterType,
    search,
    setSearch,
    filteredTransactions,
    groupedByDate,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  }
}
