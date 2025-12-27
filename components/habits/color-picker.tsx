"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COLORS } from "@/lib/constants";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({
  value,
  onChange,
  label = "Cor",
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState("#");
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomColorSubmit = () => {
    if (customColor.match(/^#[0-9A-F]{6}$/i)) {
      onChange(customColor);
      setCustomColor("#");
      setIsOpen(false);
    }
  };

  const getColorStyle = (color: string) => {
    const predefinedColor = COLORS.find((c) => c.value === color);
    if (predefinedColor) {
      return { backgroundColor: predefinedColor.hex };
    }
    if (color.startsWith("#")) {
      return { backgroundColor: color };
    }
    return {};
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            <div className="flex items-center space-x-2">
              <div
                className={cn("w-4 h-4 rounded-full border")}
                style={getColorStyle(value || "")}
              />
              <span>
                {COLORS.find((c) => c.value === value)?.name ||
                  value ||
                  "Selecionar cor"}
              </span>
              <Palette className="ml-auto h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cores Predefinidas</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      "cursor-pointer w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 relative"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {value === color.value && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Cor Personalizada</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="#FF5733"
                  value={customColor}
                  maxLength={7}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleCustomColorSubmit}>
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
