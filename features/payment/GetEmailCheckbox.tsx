'use client'

interface GetEmailCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function GetEmailCheckbox({ checked, onChange }: GetEmailCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input 
        type="checkbox" 
        name="email" 
        id="email" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="email" className="text-sm text-slate-600">Quiero recibir un correo electrónico con los detalles de los pagos</label>
    </div>
  )
}
