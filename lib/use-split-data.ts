"use client"

import { useState, useEffect, useCallback } from 'react'

export interface Person {
  id: string
  name: string
}

export interface SplitData {
  type: 'split-bill' | 'split-equal'
  tableId: string
  people: Person[]
  personTotals: { [personId: string]: number }
  grandTotal: number
  currency: string
  itemAssignments?: { [itemId: string]: string[] }
}

const STORAGE_KEY = 'qamarero-split-data'

export function useSplitData() {
  const [splitData, setSplitDataState] = useState<SplitData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load from sessionStorage when mounting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (stored) {
          setSplitDataState(JSON.parse(stored))
        }
      } catch (e) {
        console.error('Error loading split data:', e)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  // Function to save data
  const saveSplitData = useCallback((data: SplitData) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setSplitDataState(data)
      } catch (e) {
        console.error('Error saving split data:', e)
      }
    }
  }, [])

  // Function to clear data
  const clearSplitData = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
      setSplitDataState(null)
    }
  }, [])

  return {
    splitData,
    saveSplitData,
    clearSplitData,
    isLoading,
  }
}

