"use client"

import { useSplitData } from '@/lib/use-split-data'
import { PayButton } from './PayButton'

export default function PaymentContent() {
  const { splitData, isLoading } = useSplitData()

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    )
  }

  if (!splitData) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 mb-4">No hay datos de división disponibles</p>
        <p className="text-sm text-slate-500">
          Por favor, vuelve a la página anterior para configurar la división de la cuenta.
        </p>
      </div>
    )
  }

  return <PayButton splitData={splitData} />
}

