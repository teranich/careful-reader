import React from 'react'

interface CheckboxProps {
  label?: string
  name?: string
  value?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function Checkbox({ label, name, value, onChange }: CheckboxProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={value}
        value="1"
        onChange={onChange}
      />
    </label>
  )
}
