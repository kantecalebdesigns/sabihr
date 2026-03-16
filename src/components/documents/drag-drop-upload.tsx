import * as React from "react"
import { useCallback, useRef, useState } from "react"
import {
  Upload,
  FileText,
  FileImage,
  File,
  X,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DEFAULT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx"
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB

interface SelectedFile {
  file: File
  id: string
  error?: string
}

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return <FileImage className="size-5 text-blue-500" />
  }
  if (["pdf"].includes(ext)) {
    return <FileText className="size-5 text-red-500" />
  }
  if (["doc", "docx"].includes(ext)) {
    return <FileText className="size-5 text-blue-600" />
  }
  return <File className="size-5 text-muted-foreground" />
}

function validateFile(
  file: File,
  accept: string,
  maxSize: number
): string | undefined {
  // Validate file type
  const allowedExts = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  if (allowedExts.length > 0) {
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`
    const mimeMatch = allowedExts.some((a) => {
      if (a.startsWith(".")) return fileExt === a
      if (a.includes("/")) return file.type === a || a.endsWith("/*") && file.type.startsWith(a.replace("/*", "/"))
      return false
    })
    if (!mimeMatch) {
      return `File type not allowed. Accepted: ${allowedExts.join(", ")}`
    }
  }

  // Validate file size
  if (file.size > maxSize) {
    return `File too large. Maximum size: ${formatFileSize(maxSize)}`
  }

  return undefined
}

export function DragDropUpload({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles,
  multiple = true,
  className,
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList)
      const newFiles: SelectedFile[] = incoming.map((file) => ({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        error: validateFile(file, accept, maxSize),
      }))

      setSelectedFiles((prev) => {
        let merged = [...prev, ...newFiles]
        if (maxFiles) {
          merged = merged.slice(0, maxFiles)
        }
        // Notify parent with valid files only
        const validFiles = merged
          .filter((sf) => !sf.error)
          .map((sf) => sf.file)
        onFilesSelected(validFiles)
        return merged
      })
    },
    [accept, maxSize, maxFiles, onFilesSelected]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragOver(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      dragCounter.current = 0
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
      // Reset so the same file can be re-selected
      e.target.value = ""
    },
    [processFiles]
  )

  const removeFile = useCallback(
    (id: string) => {
      setSelectedFiles((prev) => {
        const next = prev.filter((sf) => sf.id !== id)
        const validFiles = next.filter((sf) => !sf.error).map((sf) => sf.file)
        onFilesSelected(validFiles)
        return next
      })
    },
    [onFilesSelected]
  )

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div
          className={cn(
            "rounded-full p-3 transition-colors",
            isDragOver ? "bg-primary/10" : "bg-muted"
          )}
        >
          <Upload
            className={cn(
              "size-6 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Drag & drop files here
          </p>
          <p className="text-xs text-muted-foreground">
            or{" "}
            <span className="text-primary font-medium underline underline-offset-2">
              browse files
            </span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {accept
            .split(",")
            .map((s) => s.trim().toUpperCase().replace(".", ""))
            .join(", ")}{" "}
          up to {formatFileSize(maxSize)}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((sf) => (
            <div
              key={sf.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3",
                sf.error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-card"
              )}
            >
              <div className="shrink-0">{getFileIcon(sf.file.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {sf.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(sf.file.size)}
                </p>
                {sf.error && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{sf.error}</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeFile(sf.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
