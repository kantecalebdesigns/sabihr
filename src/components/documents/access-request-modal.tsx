import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, Loader2 } from "lucide-react"

interface AccessRequestModalProps {
  isOpen: boolean
  onClose: () => void
  documentName: string
  onSubmit: (reason: string) => void
}

const MIN_CHARS = 20

export function AccessRequestModal({
  isOpen,
  onClose,
  documentName,
  onSubmit,
}: AccessRequestModalProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const charCount = reason.length
  const isValid = charCount >= MIN_CHARS

  const handleClose = useCallback(() => {
    setReason("")
    setIsLoading(false)
    setIsSuccess(false)
    onClose()
  }, [onClose])

  const handleSubmit = async () => {
    if (!isValid || isLoading) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit(reason)
    setIsLoading(false)
    setIsSuccess(true)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose()
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Request Document Access</h2>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle2 className="size-10 text-green-500" />
              <p className="text-sm font-medium text-center">
                Request submitted
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-[280px]">
                You'll be notified when access is granted.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="mt-2"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Document</p>
                <p className="text-sm font-medium mt-0.5">{documentName}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-reason">Reason for access</Label>
                <textarea
                  id="access-reason"
                  rows={4}
                  placeholder="Explain why you need access to this document (min 20 characters)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none disabled:opacity-50 resize-none",
                    "dark:bg-input/30"
                  )}
                />
                <p
                  className={cn(
                    "text-xs text-right",
                    charCount > 0 && !isValid
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {charCount}/{MIN_CHARS} characters minimum
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
