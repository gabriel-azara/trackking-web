"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface TimeListProps {
  value: string[]
  onChange: (times: string[]) => void
  addLabel?: string
}

export function TimeList({ value, onChange, addLabel = "Adicionar horário" }: TimeListProps) {
  const [newTime, setNewTime] = useState("")

  const addTime = () => {
    if (newTime && !value.includes(newTime)) {
      onChange([...value, newTime].sort())
      setNewTime("")
    }
  }

  const removeTime = (timeToRemove: string) => {
    onChange(value.filter((time) => time !== timeToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTime()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label htmlFor="new-time" className="sr-only">
            Novo horário
          </Label>
          <Input
            id="new-time"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="HH:MM"
          />
        </div>
        <Button type="button" onClick={addTime} disabled={!newTime}>
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((time) => (
            <Badge key={time} variant="secondary" className="flex items-center space-x-1">
              <span>{time}</span>
              <button type="button" onClick={() => removeTime(time)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
