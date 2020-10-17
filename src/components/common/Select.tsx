import React, { useState } from 'react'

export type SelectOption<T> = {
  id: number
  value: T
  text: string
}

export interface SelectProps<T> {
  options: SelectOption<T>[]
  value: SelectOption<T>
  onChange: (option: SelectOption<T>) => void
}

export default function Select<T>({ value, options, onChange }: SelectProps<T>) {
  const [selected, setSelected] = useState(value)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    const newSelected = options.find(option => String(option.id) === selectedId)
    if (newSelected) {
      setSelected(newSelected)
      onChange(newSelected)
    }
  }

  return (
    <select value={selected.id}
      onChange={handleChange}>
      {options.map(option => (
        <option key={option.id} value={option.id}>{option.text}</option>
      ))}
    </select>
  )
}