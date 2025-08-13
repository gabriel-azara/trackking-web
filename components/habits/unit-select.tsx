"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UNITS } from "@/lib/constants"
import type { Unit } from "@/lib/types"

interface UnitSelectProps {
  value?: Unit
  onChange: (unit: Unit) => void
  label?: string
}

export function UnitSelect({ value, onChange, label = "Unidade" }: UnitSelectProps) {
  const categories = [...new Set(UNITS.map((unit) => unit.category))]

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(value) => onChange(value as Unit)}>
        <SelectTrigger>
          <SelectValue placeholder="Selecionar unidade" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <div key={category}>
              <div className="px-2 py-1 text-sm font-medium text-muted-foreground">{category}</div>
              {UNITS.filter((unit) => unit.category === category).map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
