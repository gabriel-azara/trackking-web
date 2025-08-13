"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Frequency } from "@/lib/types"
import { getWeekDays } from "@/lib/utils/date"

interface FrequencyPickerProps {
  value: Frequency
  onChange: (frequency: Frequency) => void
  label?: string
}

export function FrequencyPicker({ value, onChange, label = "Frequência" }: FrequencyPickerProps) {
  const [customRRule, setCustomRRule] = useState("")
  const weekDays = getWeekDays()

  const handleDailyChange = (times?: number) => {
    onChange({ kind: "daily", times })
  }

  const handleWeeklyChange = (days: number[]) => {
    onChange({ kind: "weekly", days })
  }

  const handleMonthlyChange = (dates: number[]) => {
    onChange({ kind: "monthly", dates })
  }

  const handleCustomChange = (rrule: string) => {
    onChange({ kind: "custom", rrule })
  }

  const toggleWeekDay = (dayValue: number) => {
    if (value.kind !== "weekly") return

    const currentDays = value.days || []
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue].sort()

    handleWeeklyChange(newDays)
  }

  const toggleMonthDate = (date: number) => {
    if (value.kind !== "monthly") return

    const currentDates = value.dates || []
    const newDates = currentDates.includes(date)
      ? currentDates.filter((d) => d !== date)
      : [...currentDates, date].sort()

    handleMonthlyChange(newDates)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs
        value={value.kind}
        onValueChange={(kind) => {
          switch (kind) {
            case "daily":
              onChange({ kind: "daily" })
              break
            case "weekly":
              onChange({ kind: "weekly", days: [] })
              break
            case "monthly":
              onChange({ kind: "monthly", dates: [] })
              break
            case "custom":
              onChange({ kind: "custom", rrule: "" })
              break
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Diária</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Vezes por dia (opcional)</Label>
            <Input
              type="number"
              min="1"
              placeholder="1"
              value={value.kind === "daily" ? value.times || "" : ""}
              onChange={(e) => handleDailyChange(e.target.value ? Number.parseInt(e.target.value) : undefined)}
            />
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Dias da semana</Label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day.value} className="flex flex-col items-center space-y-1">
                  <Checkbox
                    checked={value.kind === "weekly" && value.days?.includes(day.value)}
                    onCheckedChange={() => toggleWeekDay(day.value)}
                  />
                  <Label className="text-xs">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Dias do mês</Label>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                <Button
                  key={date}
                  variant={value.kind === "monthly" && value.dates?.includes(date) ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleMonthDate(date)}
                >
                  {date}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">RRULE (Regra personalizada)</Label>
            <Input
              placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
              value={value.kind === "custom" ? value.rrule : customRRule}
              onChange={(e) => {
                setCustomRRule(e.target.value)
                handleCustomChange(e.target.value)
              }}
            />
            <p className="text-xs text-muted-foreground">Use formato RRULE padrão para recorrências complexas</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
