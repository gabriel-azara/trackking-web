"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, GripVertical } from "lucide-react"

interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

interface ChecklistManagerProps {
  checklist: ChecklistItem[]
  onChange: (checklist: ChecklistItem[]) => void
}

export function ChecklistManager({ checklist, onChange }: ChecklistManagerProps) {
  const [newItemText, setNewItemText] = useState("")

  const addItem = () => {
    if (!newItemText.trim()) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      done: false,
    }

    onChange([...checklist, newItem])
    setNewItemText("")
  }

  const removeItem = (id: string) => {
    onChange(checklist.filter((item) => item.id !== id))
  }

  const toggleItem = (id: string) => {
    onChange(checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const updateItemText = (id: string, text: string) => {
    onChange(checklist.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  const completedCount = checklist.filter((item) => item.done).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Checklist</Label>
        <Badge variant="outline">
          {completedCount}/{checklist.length} concluídos
        </Badge>
      </div>

      {/* Add New Item */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Adicionar Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite um item do checklist..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addItem} disabled={!newItemText.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Items */}
      {checklist.length > 0 && (
        <div className="space-y-2">
          {checklist.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Checkbox checked={item.done} onCheckedChange={() => toggleItem(item.id)} />
                  <Input
                    value={item.text}
                    onChange={(e) => updateItemText(item.id, e.target.value)}
                    className={`flex-1 border-none p-0 h-auto focus-visible:ring-0 ${
                      item.done ? "line-through text-muted-foreground" : ""
                    }`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
