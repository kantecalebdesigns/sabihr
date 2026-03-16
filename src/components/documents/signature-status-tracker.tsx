import {
  Check,
  Clock,
  X,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface SignatoryStatus {
  id: string
  name: string
  role: string
  email: string
  status: "pending" | "signed" | "declined"
  signedAt?: string
  order: number
}

interface SignatureStatusTrackerProps {
  signatories: SignatoryStatus[]
  documentName: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SignatureStatusTracker({
  signatories,
  documentName,
}: SignatureStatusTrackerProps) {
  const sorted = [...signatories].sort((a, b) => a.order - b.order)
  const signedCount = sorted.filter((s) => s.status === "signed").length
  const total = sorted.length

  // The current signer is the first pending one
  const currentSignerIndex = sorted.findIndex((s) => s.status === "pending")

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Signature Progress
        </h3>
        <p className="text-sm text-muted-foreground">{documentName}</p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {signedCount} of {total} signatures completed
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${total > 0 ? (signedCount / total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {sorted.map((signatory, index) => {
          const isCurrent = index === currentSignerIndex
          const isLast = index === sorted.length - 1

          return (
            <div key={signatory.id} className="flex gap-4">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                {/* Avatar circle */}
                <div
                  className={cn(
                    "relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                    signatory.status === "signed" &&
                      "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
                    signatory.status === "declined" &&
                      "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                    signatory.status === "pending" &&
                      !isCurrent &&
                      "border-muted-foreground/30 bg-muted text-muted-foreground",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary animate-pulse"
                  )}
                >
                  {signatory.status === "signed" ? (
                    <Check className="size-4" />
                  ) : signatory.status === "declined" ? (
                    <X className="size-4" />
                  ) : (
                    getInitials(signatory.name)
                  )}
                </div>
                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-6",
                      signatory.status === "signed"
                        ? "bg-green-300 dark:bg-green-700"
                        : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-primary" : "text-foreground"
                      )}
                    >
                      {signatory.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {signatory.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {signatory.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {signatory.status === "signed" && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200">
                        <Check className="size-3" />
                        Signed
                      </Badge>
                    )}
                    {signatory.status === "declined" && (
                      <Badge variant="destructive">
                        <X className="size-3" />
                        Declined
                      </Badge>
                    )}
                    {signatory.status === "pending" && (
                      <>
                        <Badge
                          variant="outline"
                          className={cn(
                            isCurrent &&
                              "border-primary/50 text-primary"
                          )}
                        >
                          <Clock className="size-3" />
                          {isCurrent ? "Awaiting" : "Pending"}
                        </Badge>
                        <Button variant="ghost" size="xs">
                          <Send className="size-3" />
                          Remind
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {signatory.status === "signed" && signatory.signedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Signed on {formatDate(signatory.signedAt)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
