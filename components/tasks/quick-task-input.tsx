"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createTask } from "@/lib/firebase/tasks"

interface QuickTaskInputProps {
  onTaskCreated?: () => void
}

export function QuickTaskInput({ onTaskCreated }: QuickTaskInputProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) return

    setLoading(true)
    try {
      await createTask(user.uid, {
        title: title.trim(),
        status: "todo",
        priority: "medium",
        type: "task",
      })
      setTitle("")
      if (onTaskCreated) onTaskCreated()
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Adicionar tarefa rápida..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
