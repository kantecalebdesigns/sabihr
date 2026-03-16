import * as React from "react"
import { useState, useCallback } from "react"
import {
  PenLine,
  TextCursorInput,
  Calendar,
  User,
  GripVertical,
  X,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SignatureField {
  id: string
  type: "signature" | "initials" | "date" | "name"
  x: number
  y: number
  signerId: string
  signerName: string
}

interface SignatureFieldPlacerProps {
  documentName: string
  onSave: (fields: SignatureField[]) => void
}

const FIELD_TYPES = [
  { type: "signature" as const, label: "Signature", icon: PenLine },
  { type: "initials" as const, label: "Initials", icon: TextCursorInput },
  { type: "date" as const, label: "Date", icon: Calendar },
  { type: "name" as const, label: "Name", icon: User },
]

const SIGNERS = [
  { id: "signer-1", name: "Adebayo Ogunlesi - Employee" },
  { id: "signer-2", name: "Amina Bello - HR Manager" },
  { id: "signer-3", name: "Chioma Nwosu - Department Head" },
]

const SIGNER_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  "signer-1": {
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  "signer-2": {
    border: "border-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-600 dark:text-green-400",
  },
  "signer-3": {
    border: "border-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
  },
}

function generateId() {
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function SignatureFieldPlacer({
  documentName,
  onSave,
}: SignatureFieldPlacerProps) {
  const [fields, setFields] = useState<SignatureField[]>([])
  const [activeFieldType, setActiveFieldType] = useState<
    SignatureField["type"] | null
  >(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const documentRef = React.useRef<HTMLDivElement>(null)

  const handleDocumentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!activeFieldType || draggingId) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      const newField: SignatureField = {
        id: generateId(),
        type: activeFieldType,
        x: Math.max(0, Math.min(85, x)),
        y: Math.max(0, Math.min(95, y)),
        signerId: SIGNERS[0].id,
        signerName: SIGNERS[0].name,
      }
      setFields((prev) => [...prev, newField])
    },
    [activeFieldType, draggingId]
  )

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const updateFieldSigner = useCallback((id: string, signerId: string) => {
    const signer = SIGNERS.find((s) => s.id === signerId)
    if (!signer) return
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, signerId: signer.id, signerName: signer.name } : f
      )
    )
  }, [])

  const handleDragStart = useCallback(
    (e: React.MouseEvent, fieldId: string) => {
      e.stopPropagation()
      const fieldEl = (e.target as HTMLElement).closest(
        "[data-field-id]"
      ) as HTMLElement | null
      if (!fieldEl || !documentRef.current) return
      const docRect = documentRef.current.getBoundingClientRect()
      const fieldRect = fieldEl.getBoundingClientRect()
      setDraggingId(fieldId)
      setDragOffset({
        x: e.clientX - fieldRect.left + (fieldRect.left - docRect.left),
        y: e.clientY - fieldRect.top + (fieldRect.top - docRect.top),
      })
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingId || !documentRef.current) return
      const rect = documentRef.current.getBoundingClientRect()
      const x =
        ((e.clientX - rect.left - dragOffset.x + (dragOffset.x)) / rect.width) *
        100
      const y =
        ((e.clientY - rect.top - dragOffset.y + (dragOffset.y)) / rect.height) *
        100
      setFields((prev) =>
        prev.map((f) =>
          f.id === draggingId
            ? {
                ...f,
                x: Math.max(0, Math.min(85, x)),
                y: Math.max(0, Math.min(95, y)),
              }
            : f
        )
      )
    },
    [draggingId, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingId(null)
  }, [])

  const getFieldLabel = (type: SignatureField["type"]) => {
    return FIELD_TYPES.find((ft) => ft.type === type)?.label ?? type
  }

  const getColors = (signerId: string) => {
    return (
      SIGNER_COLORS[signerId] ?? {
        border: "border-gray-400",
        bg: "bg-gray-50 dark:bg-gray-950/30",
        text: "text-gray-600 dark:text-gray-400",
      }
    )
  }

  // Mock document lines
  const documentLines = Array.from({ length: 28 }, (_, i) => i)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Place Signature Fields
          </h3>
          <p className="text-sm text-muted-foreground">{documentName}</p>
        </div>
        <Button onClick={() => onSave(fields)}>
          <Save />
          Save Fields
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar / Toolbar */}
        <div className="w-56 shrink-0 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Field Types
          </p>
          <div className="space-y-1.5">
            {FIELD_TYPES.map((ft) => {
              const Icon = ft.icon
              const isActive = activeFieldType === ft.type
              return (
                <button
                  key={ft.type}
                  onClick={() =>
                    setActiveFieldType(isActive ? null : ft.type)
                  }
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:bg-muted/60"
                  )}
                >
                  <Icon className="size-4" />
                  {ft.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {activeFieldType
              ? "Click on the document to place the field."
              : "Select a field type, then click on the document."}
          </p>

          {/* Placed fields summary */}
          {fields.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Placed Fields ({fields.length})
              </p>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {fields.map((field) => {
                  const colors = getColors(field.signerId)
                  return (
                    <div
                      key={field.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md border border-dashed px-2 py-1.5 text-xs",
                        colors.border,
                        colors.bg
                      )}
                    >
                      <span className={cn("font-medium", colors.text)}>
                        {getFieldLabel(field.type)}
                      </span>
                      <button
                        onClick={() => removeField(field.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Document area */}
        <div className="flex-1 overflow-auto rounded-xl border bg-muted/30 p-6">
          <div
            ref={documentRef}
            onClick={handleDocumentClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={cn(
              "relative mx-auto bg-white shadow-lg",
              activeFieldType ? "cursor-crosshair" : "cursor-default"
            )}
            style={{
              width: "100%",
              maxWidth: 595,
              aspectRatio: "210 / 297",
            }}
          >
            {/* Mock document content */}
            <div className="pointer-events-none select-none p-8 space-y-3">
              <div className="h-5 w-2/5 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-100 mt-1 mb-4" />
              {documentLines.map((i) => (
                <div
                  key={i}
                  className="h-2.5 rounded bg-gray-100"
                  style={{
                    width: `${65 + Math.sin(i * 1.3) * 25}%`,
                  }}
                />
              ))}
            </div>

            {/* Placed fields */}
            {fields.map((field) => {
              const colors = getColors(field.signerId)
              return (
                <div
                  key={field.id}
                  data-field-id={field.id}
                  className={cn(
                    "absolute flex flex-col gap-1 rounded border-2 border-dashed px-2 py-1.5 select-none",
                    colors.border,
                    colors.bg,
                    draggingId === field.id && "opacity-70"
                  )}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    minWidth: 120,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      onMouseDown={(e) => handleDragStart(e, field.id)}
                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                    >
                      <GripVertical className="size-3" />
                    </button>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide",
                        colors.text
                      )}
                    >
                      {getFieldLabel(field.type)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeField(field.id)
                      }}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={field.signerId}
                      onValueChange={(val) => updateFieldSigner(field.id, val)}
                    >
                      <SelectTrigger className="h-6 text-[10px] min-w-0 w-full px-1.5 bg-white/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIGNERS.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
