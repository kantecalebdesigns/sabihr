import * as React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  PenLine,
  Type,
  Upload,
  Undo2,
  Eraser,
  Check,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SignaturePadProps {
  isOpen: boolean
  onClose: () => void
  signerName: string
  documentName: string
  onSign: (signatureData: string) => void
}

type TabId = "draw" | "type" | "upload"

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "draw", label: "Draw", icon: PenLine },
  { id: "type", label: "Type", icon: Type },
  { id: "upload", label: "Upload", icon: Upload },
]

const FONT_OPTIONS = [
  {
    id: "cursive-1",
    label: "Script",
    fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
  },
  {
    id: "cursive-2",
    label: "Elegant",
    fontFamily: "'Lucida Handwriting', 'Apple Chancery', cursive",
  },
  {
    id: "cursive-3",
    label: "Classic",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', 'Georgia', serif",
  },
]

export function SignaturePad({
  isOpen,
  onClose,
  signerName,
  documentName,
  onSign,
}: SignaturePadProps) {
  const [activeTab, setActiveTab] = useState<TabId>("draw")
  const [isSigning, setIsSigning] = useState(false)

  // Draw state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [strokes, setStrokes] = useState<ImageData[]>([])

  // Type state
  const [typedName, setTypedName] = useState("")
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].id)

  // Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Canvas setup
  useEffect(() => {
    if (!isOpen || activeTab !== "draw") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 2
    ctx.strokeStyle = "#1a1a1a"
  }, [isOpen, activeTab])

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      let clientX: number, clientY: number
      if ("touches" in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    },
    []
  )

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      const point = getCanvasPoint(e)
      if (!point) return
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx) return

      // Save current state for undo
      const canvas = canvasRef.current!
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setStrokes((prev) => [...prev, imageData])

      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      setIsDrawing(true)
      setHasDrawn(true)
    },
    [getCanvasPoint]
  )

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      if (!isDrawing) return
      const point = getCanvasPoint(e)
      if (!point) return
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx) return
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    },
    [isDrawing, getCanvasPoint]
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setStrokes([])
  }, [])

  const undoStroke = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx || strokes.length === 0) return

    const prev = strokes[strokes.length - 1]
    ctx.putImageData(prev, 0, 0)
    setStrokes((s) => s.slice(0, -1))
    if (strokes.length === 1) {
      setHasDrawn(false)
    }
  }, [strokes])

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      e.target.value = ""
    },
    []
  )

  const getSignatureData = useCallback((): string | null => {
    if (activeTab === "draw") {
      if (!hasDrawn) return null
      return canvasRef.current?.toDataURL("image/png") ?? null
    }
    if (activeTab === "type") {
      if (!typedName.trim()) return null
      const font = FONT_OPTIONS.find((f) => f.id === selectedFont)
      return JSON.stringify({
        type: "typed",
        text: typedName.trim(),
        fontFamily: font?.fontFamily,
      })
    }
    if (activeTab === "upload") {
      return uploadedImage
    }
    return null
  }, [activeTab, hasDrawn, typedName, selectedFont, uploadedImage])

  const canSign =
    (activeTab === "draw" && hasDrawn) ||
    (activeTab === "type" && typedName.trim().length > 0) ||
    (activeTab === "upload" && uploadedImage !== null)

  const handleSign = useCallback(() => {
    const data = getSignatureData()
    if (!data) return
    setIsSigning(true)
    setTimeout(() => {
      onSign(data)
      setIsSigning(false)
    }, 1000)
  }, [getSignatureData, onSign])

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab("draw")
      setHasDrawn(false)
      setStrokes([])
      setTypedName("")
      setSelectedFont(FONT_OPTIONS[0].id)
      setUploadedImage(null)
      setIsSigning(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-background shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Sign Document
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {documentName} &mdash; Signing as {signerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* Draw tab */}
          {activeTab === "draw" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Draw your signature below
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={undoStroke}
                    disabled={strokes.length === 0}
                  >
                    <Undo2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={clearCanvas}
                    disabled={!hasDrawn}
                  >
                    <Eraser className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border-2 border-dashed bg-white">
                <canvas
                  ref={canvasRef}
                  className="h-40 w-full cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          )}

          {/* Type tab */}
          {activeTab === "type" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Type your name
                </p>
                <Input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={signerName}
                />
              </div>
              {typedName.trim() && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Choose a style
                  </p>
                  <div className="grid gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
                          selectedFont === font.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span
                          className="text-2xl text-foreground"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {typedName}
                        </span>
                        {selectedFont === font.id && (
                          <Check className="size-4 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload tab */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Upload a signature image (.png, .jpg)
              </p>
              {uploadedImage ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-white p-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-h-32 object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                    className="w-full"
                  >
                    Remove and re-upload
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="rounded-full bg-muted p-2">
                    <ImageIcon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG or JPG only
                  </p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By signing, you agree that this electronic signature is legally
            binding.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSigning}>
              Cancel
            </Button>
            <Button onClick={handleSign} disabled={!canSign || isSigning}>
              {isSigning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Check />
                  Adopt and Sign
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
