'use client'

import type { SplitData } from '@/lib/use-split-data'

interface PayButtonProps {
  splitData: SplitData
}

export function PayButton({ splitData }: PayButtonProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: splitData.currency,
    }).format(amount)
  }

  const pay = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        splitData: {
          people: splitData.people,
          personTotals: splitData.personTotals,
          grandTotal: splitData.grandTotal,
        },
      }),
    })

    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Resumen de pagos
        </h3>
        <div className="space-y-2">
          {splitData.people.map(person => {
            const total = splitData.personTotals[person.id] || 0
            
            return (
              <div
                key={person.id}
                className="flex justify-between items-center p-3 rounded-lg bg-slate-50"
              >
                <span className="font-medium text-slate-900">{person.name}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(total)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-slate-700">Total:</span>
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(splitData.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        onClick={pay}
      >
        Proceder al pago
      </button>
    </div>
  )
}
