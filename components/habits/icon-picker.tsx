"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ICONS } from "@/lib/constants"
import { Search } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
  label?: string
}

export function IconPicker({ value, onChange, label = "Ícone" }: IconPickerProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const categories = [...new Set(ICONS.map((icon) => icon.category))]

  const filteredIcons = ICONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search.toLowerCase()) || icon.name.toLowerCase().includes(search.toLowerCase()),
  )

  const getIconsByCategory = (category: string) => {
    return filteredIcons.filter((icon) => icon.category === category)
  }

  const handleIconSelect = (iconName: string) => {
    onChange(iconName)
    setIsOpen(false)
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
    ]

    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />
    }
    return <LucideIcons.Circle className="h-5 w-5" />
  }

  const selectedIcon = ICONS.find((icon) => icon.name === value)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <div className="flex items-center space-x-2">
              {value ? renderIcon(value) : <LucideIcons.Circle className="h-5 w-5" />}
              <span>{selectedIcon?.label || "Selecionar ícone"}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ícones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {categories.slice(0, 3).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-48">
                    <div className="grid grid-cols-6 gap-2 p-2">
                      {getIconsByCategory(category).map((icon) => (
                        <button
                          key={icon.name}
                          onClick={() => handleIconSelect(icon.name)}
                          className="p-2 rounded hover:bg-accent hover:text-accent-foreground"
                          title={icon.label}
                        >
                          {renderIcon(icon.name)}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
