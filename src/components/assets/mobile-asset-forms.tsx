import { useState } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Armchair,
  Car,
  Wifi,
  Printer,
  Box,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { RequestUrgency, ReturnReason, AssetCondition } from "@/types/asset";

// ------------------------------------
// Mobile Asset Request Form
// ------------------------------------

const CATEGORY_OPTIONS = [
  { id: "cat-1", name: "Laptop", icon: Laptop },
  { id: "cat-2", name: "Monitor", icon: Monitor },
  { id: "cat-3", name: "Phone", icon: Smartphone },
  { id: "cat-4", name: "Furniture", icon: Armchair },
  { id: "cat-5", name: "Vehicle", icon: Car },
  { id: "cat-6", name: "Networking", icon: Wifi },
  { id: "cat-7", name: "Printer", icon: Printer },
  { id: "cat-8", name: "Other", icon: Box },
];

export function MobileAssetRequestForm() {
  const [category, setCategory] = useState<string | null>(null);
  const [justification, setJustification] = useState("");
  const [urgency, setUrgency] = useState<RequestUrgency>("standard");
  const [specs, setSpecs] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4 px-4">
        <CheckCircle2 className="size-14 mx-auto text-green-600" />
        <h2 className="text-lg font-semibold">Request Submitted</h2>
        <p className="text-sm text-muted-foreground">
          Your manager will review your request shortly.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setCategory(null);
            setJustification("");
            setUrgency("standard");
            setSpecs("");
            setSubmitted(false);
          }}
        >
          New Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 pb-24">
      <h2 className="text-lg font-semibold">Request an Asset</h2>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm">Category</Label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const selected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left min-h-[56px] transition-colors active:bg-accent",
                  selected && "border-primary bg-primary/5 ring-1 ring-primary"
                )}
              >
                <cat.icon
                  className={cn(
                    "size-5 shrink-0",
                    selected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Justification */}
      <div className="space-y-2">
        <Label className="text-sm">Why do you need this?</Label>
        <textarea
          rows={3}
          placeholder="Explain your need..."
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring resize-none min-h-[80px]"
        />
      </div>

      {/* Urgency */}
      <div className="space-y-2">
        <Label className="text-sm">Urgency</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["standard", "urgent"] as RequestUrgency[]).map((u) => (
            <button
              key={u}
              onClick={() => setUrgency(u)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm min-h-[48px] transition-colors active:bg-accent",
                urgency === u && "border-primary bg-primary/5 ring-1 ring-primary"
              )}
            >
              <Clock
                className={cn(
                  "size-4",
                  urgency === u ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="font-medium capitalize">{u}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div className="space-y-2">
        <Label className="text-sm">
          Preferred Specs{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          rows={2}
          placeholder="E.g., 16GB RAM, USB-C..."
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring resize-none"
        />
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          className="w-full h-12 text-base"
          disabled={!category || justification.trim().length === 0}
          onClick={() => setSubmitted(true)}
        >
          <Send className="size-4" />
          Submit Request
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------
// Mobile Asset Return Form
// ------------------------------------

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: "no-longer-needed", label: "No Longer Needed" },
  { value: "upgrade", label: "Upgrade" },
  { value: "leaving", label: "Leaving Company" },
  { value: "damaged", label: "Damaged" },
];

const CONDITION_OPTIONS: { value: AssetCondition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "damaged", label: "Damaged" },
];

export function MobileAssetReturnForm() {
  const [reason, setReason] = useState<ReturnReason | null>(null);
  const [condition, setCondition] = useState<AssetCondition | null>(null);
  const [proposedDate, setProposedDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4 px-4">
        <CheckCircle2 className="size-14 mx-auto text-green-600" />
        <h2 className="text-lg font-semibold">Return Submitted</h2>
        <p className="text-sm text-muted-foreground">
          You will be notified when a collection is scheduled.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setReason(null);
            setCondition(null);
            setProposedDate("");
            setSubmitted(false);
          }}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 pb-24">
      <h2 className="text-lg font-semibold">Return an Asset</h2>

      {/* Reason */}
      <div className="space-y-2">
        <Label className="text-sm">Reason</Label>
        <div className="grid grid-cols-1 gap-2">
          {RETURN_REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={cn(
                "flex items-center rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-left min-h-[48px] transition-colors active:bg-accent",
                reason === r.value &&
                  "border-primary bg-primary/5 ring-1 ring-primary font-medium"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm">Asset Condition</Label>
        <div className="grid grid-cols-3 gap-2">
          {CONDITION_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCondition(c.value)}
              className={cn(
                "flex items-center justify-center rounded-xl border border-border bg-card px-3 py-3 text-sm min-h-[48px] transition-colors active:bg-accent",
                condition === c.value &&
                  "border-primary bg-primary/5 ring-1 ring-primary font-medium"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label className="text-sm">Proposed Return Date</Label>
        <Input
          type="date"
          value={proposedDate}
          onChange={(e) => setProposedDate(e.target.value)}
          className="rounded-xl h-12 text-base"
        />
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          className="w-full h-12 text-base"
          disabled={!reason || !condition || !proposedDate}
          onClick={() => setSubmitted(true)}
        >
          <Send className="size-4" />
          Submit Return
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------
// Mobile Asset Acceptance / Signature
// ------------------------------------

export function MobileAssetAcceptance() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [signature, setSignature] = useState("");
  const [accepted, setAccepted] = useState(false);

  const canAccept = acknowledged && signature.trim().length > 0;

  if (accepted) {
    return (
      <div className="text-center py-12 space-y-4 px-4">
        <CheckCircle2 className="size-14 mx-auto text-green-600" />
        <h2 className="text-lg font-semibold">Asset Accepted</h2>
        <p className="text-sm text-muted-foreground">
          You have acknowledged receipt of this asset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 pb-24">
      <h2 className="text-lg font-semibold">Accept Asset</h2>

      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Terms of Use</p>
        <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed">
          <li>Use the asset solely for authorized company purposes.</li>
          <li>Take reasonable care to prevent damage, loss, or theft.</li>
          <li>Report any issues promptly to IT/Admin.</li>
          <li>Return the asset in acceptable condition when requested.</li>
        </ul>
      </div>

      {/* Acknowledgment */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="m-ack"
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="m-ack" className="text-sm leading-normal">
          I acknowledge receipt and accept responsibility for this asset
        </Label>
      </div>

      {/* Signature - large touch-friendly input */}
      <div className="space-y-2">
        <Label className="text-sm">Your Signature</Label>
        <Input
          placeholder="Type your full name"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className={cn(
            "font-serif italic text-xl h-14 rounded-xl border-2 text-center"
          )}
        />
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          className="w-full h-12 text-base"
          disabled={!canAccept}
          onClick={() => setAccepted(true)}
        >
          Accept Asset
        </Button>
      </div>
    </div>
  );
}
