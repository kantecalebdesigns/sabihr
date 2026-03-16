import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
} from "lucide-react"
import { useState } from "react"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: {
    name: string
    type: string
    url: string
    size: string
    uploadedBy: string
    uploadedAt: string
  }
}

export function DocumentViewer({
  isOpen,
  onClose,
  document: doc,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [fitToWidth, setFitToWidth] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  // Reset zoom when document changes
  useEffect(() => {
    setZoom(100)
    setFitToWidth(false)
  }, [doc.url])

  if (!isOpen) return null

  const isImage =
    doc.type === "jpg" ||
    doc.type === "jpeg" ||
    doc.type === "png" ||
    doc.type === "gif" ||
    doc.type === "webp"
  const isPdf = doc.type === "pdf"

  const zoomIn = () => setZoom((z) => Math.min(z + 25, 300))
  const zoomOut = () => setZoom((z) => Math.max(z - 25, 25))
  const toggleFitToWidth = () => {
    setFitToWidth((f) => !f)
    if (!fitToWidth) setZoom(100)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-2">
        <h2 className="text-sm font-medium text-white truncate max-w-[40%]">
          {doc.name}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={zoomOut}
            title="Zoom out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-xs text-white/70 w-12 text-center tabular-nums">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={zoomIn}
            title="Zoom in"
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className={`text-white hover:bg-white/10 ${fitToWidth ? "bg-white/20" : ""}`}
            onClick={toggleFitToWidth}
            title="Fit to width"
          >
            <Maximize2 className="size-4" />
          </Button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={() => window.print()}
            title="Print"
          >
            <Printer className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            asChild
            title="Download"
          >
            <a href={doc.url} download={doc.name}>
              <Download className="size-4" />
            </a>
          </Button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={onClose}
            title="Close"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        {isImage && (
          <img
            src={doc.url}
            alt={doc.name}
            className="max-h-full rounded shadow-lg transition-transform"
            style={{
              width: fitToWidth ? "100%" : "auto",
              transform: fitToWidth ? "none" : `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          />
        )}

        {isPdf && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-white/5 p-16">
            <FileText className="size-16 text-white/40" />
            <p className="text-sm text-white/60">PDF Preview</p>
            <p className="text-xs text-white/40">{doc.name}</p>
          </div>
        )}

        {!isImage && !isPdf && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-white/5 p-16">
            <FileText className="size-16 text-white/40" />
            <p className="text-sm text-white/60">
              Preview not available for this file type
            </p>
            <p className="text-xs text-white/40">{doc.name}</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-4 py-2">
        <span className="text-xs text-white/60">Page 1 of 1</span>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span>{doc.size}</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Uploaded by {doc.uploadedBy}</span>
          <span className="w-px h-3 bg-white/20" />
          <span>{doc.uploadedAt}</span>
        </div>
      </div>
    </div>
  )
}
