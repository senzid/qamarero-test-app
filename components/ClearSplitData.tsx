"use client"

import { useEffect } from 'react'
import { useSplitData } from '@/lib/use-split-data'

export default function ClearSplitData() {
  const { clearSplitData } = useSplitData()

  useEffect(() => {
    clearSplitData()
  }, [clearSplitData])

  return null
}

