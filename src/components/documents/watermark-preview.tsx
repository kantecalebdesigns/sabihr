import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface WatermarkPreviewProps {
  text?: string
  opacity?: number
  angle?: number
  children: React.ReactNode
}

export function WatermarkPreview({
  text = "CONFIDENTIAL",
  opacity = 0.08,
  angle = -30,
  children,
}: WatermarkPreviewProps) {
  // Build repeated text pattern
  const repeatedText = Array.from({ length: 80 }, () => text).join("     ")
  const lines = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div className="relative overflow-hidden">
      {children}
      {/* Watermark overlay */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-[-50%] flex flex-col justify-center gap-8"
          style={{
            transform: `rotate(${angle}deg)`,
            opacity,
            width: "200%",
            height: "200%",
          }}
        >
          {lines.map((i) => (
            <p
              key={i}
              className="whitespace-nowrap text-lg font-bold tracking-[0.3em] text-foreground"
            >
              {repeatedText}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

interface WatermarkSettingsProps {
  text: string
  opacity: number
  angle: number
  onChange: (settings: { text: string; opacity: number; angle: number }) => void
}

export function WatermarkSettings({
  text,
  opacity,
  angle,
  onChange,
}: WatermarkSettingsProps) {
  const [localText, setLocalText] = useState(text)
  const [localOpacity, setLocalOpacity] = useState(opacity)
  const [localAngle, setLocalAngle] = useState(angle)

  const handleChange = (updates: Partial<{ text: string; opacity: number; angle: number }>) => {
    const next = {
      text: updates.text ?? localText,
      opacity: updates.opacity ?? localOpacity,
      angle: updates.angle ?? localAngle,
    }
    if ("text" in updates) setLocalText(next.text)
    if ("opacity" in updates) setLocalOpacity(next.opacity)
    if ("angle" in updates) setLocalAngle(next.angle)
    onChange(next)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {/* Text input */}
        <div className="space-y-1.5">
          <Label htmlFor="watermark-text">Watermark Text</Label>
          <Input
            id="watermark-text"
            value={localText}
            onChange={(e) => handleChange({ text: e.target.value })}
            placeholder="CONFIDENTIAL"
          />
        </div>

        {/* Opacity slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark-opacity">Opacity</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {localOpacity.toFixed(2)}
            </span>
          </div>
          <input
            id="watermark-opacity"
            type="range"
            min={0.02}
            max={0.2}
            step={0.01}
            value={localOpacity}
            onChange={(e) => handleChange({ opacity: parseFloat(e.target.value) })}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm",
              "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
            )}
          />
        </div>

        {/* Angle slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark-angle">Angle</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {localAngle}&deg;
            </span>
          </div>
          <input
            id="watermark-angle"
            type="range"
            min={-45}
            max={0}
            step={1}
            value={localAngle}
            onChange={(e) => handleChange({ angle: parseInt(e.target.value, 10) })}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm",
              "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
            )}
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-1.5">
        <Label>Preview</Label>
        <WatermarkPreview text={localText} opacity={localOpacity} angle={localAngle}>
          <div className="rounded-lg border bg-white p-6 space-y-2 min-h-[160px]">
            <div className="h-4 w-3/5 rounded bg-gray-200" />
            <div className="h-3 w-2/5 rounded bg-gray-100" />
            <div className="h-2.5 w-full rounded bg-gray-100 mt-3" />
            <div className="h-2.5 w-[90%] rounded bg-gray-100" />
            <div className="h-2.5 w-[75%] rounded bg-gray-100" />
            <div className="h-2.5 w-[85%] rounded bg-gray-100" />
            <div className="h-2.5 w-[60%] rounded bg-gray-100" />
          </div>
        </WatermarkPreview>
      </div>
    </div>
  )
}
