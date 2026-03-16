import * as React from "react"
import {
  FileText,
  FileImage,
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface BulkUploadFile {
  id: string
  name: string
  size: number
  status: "queued" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface BulkUploadProgressProps {
  files: BulkUploadFile[]
  onRetry?: (id: string) => void
  onRemove?: (id: string) => void
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

function StatusBadge({ status }: { status: BulkUploadFile["status"] }) {
  const config = {
    queued: {
      label: "Queued",
      className: "bg-muted text-muted-foreground",
      icon: <Clock className="size-3" />,
    },
    uploading: {
      label: "Uploading",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      icon: <Loader2 className="size-3 animate-spin" />,
    },
    success: {
      label: "Uploaded",
      className:
        "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      icon: <CheckCircle2 className="size-3" />,
    },
    error: {
      label: "Failed",
      className:
        "bg-destructive/10 text-destructive",
      icon: <AlertCircle className="size-3" />,
    },
  }[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}

export function BulkUploadProgress({
  files,
  onRetry,
  onRemove,
  className,
}: BulkUploadProgressProps) {
  const successCount = files.filter((f) => f.status === "success").length
  const totalCount = files.length

  // Overall progress: completed files count fully, uploading files use their progress
  const overallProgress =
    totalCount === 0
      ? 0
      : Math.round(
          files.reduce((acc, f) => {
            if (f.status === "success") return acc + 100
            if (f.status === "uploading") return acc + f.progress
            return acc
          }, 0) / totalCount
        )

  if (totalCount === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary */}
      <div className="space-y-2 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {successCount} of {totalCount} files uploaded
          </span>
          <span className="text-muted-foreground">{overallProgress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              successCount === totalCount
                ? "bg-green-500"
                : "bg-primary"
            )}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* File Rows */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3",
              file.status === "error"
                ? "border-destructive/50 bg-destructive/5"
                : "border-border bg-card"
            )}
          >
            <div className="shrink-0">{getFileIcon(file.name)}</div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <StatusBadge status={file.status} />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
              </div>

              {/* Progress bar for uploading state */}
              {file.status === "uploading" && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300 ease-out animate-pulse"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}

              {/* Error message */}
              {file.status === "error" && file.error && (
                <p className="text-xs text-destructive">{file.error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              {file.status === "error" && onRetry && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRetry(file.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Retry upload"
                >
                  <RotateCcw className="size-3.5" />
                  <span className="sr-only">Retry</span>
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRemove(file.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Remove file"
                >
                  <X className="size-3.5" />
                  <span className="sr-only">Remove</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
