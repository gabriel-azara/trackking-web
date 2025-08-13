"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Minus, ArrowUp } from "lucide-react"
import type { Task } from "@/lib/types"

interface PrioritySelectProps {
  value?: Task["priority"]
  onChange: (priority: Task["priority"]) => void
  label?: string
}

export function PrioritySelect({ value, onChange, label = "Prioridade" }: PrioritySelectProps) {
  const priorities = [
    { value: "low", label: "Baixa", color: "green", icon: Minus },
    { value: "medium", label: "Média", color: "yellow", icon: AlertCircle },
    { value: "high", label: "Alta", color: "red", icon: ArrowUp },
  ] as const

  const selectedPriority = priorities.find((p) => p.value === value)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(value) => onChange(value as Task["priority"])}>
        <SelectTrigger>
          <SelectValue placeholder="Selecionar prioridade">
            {selectedPriority && (
              <div className="flex items-center space-x-2">
                <selectedPriority.icon className="h-4 w-4" />
                <span>{selectedPriority.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              <div className="flex items-center space-x-2">
                <priority.icon className="h-4 w-4" />
                <span>{priority.label}</span>
                <Badge variant="outline" className={`text-${priority.color}-600 border-${priority.color}-200`}>
                  {priority.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
