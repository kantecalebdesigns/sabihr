import { useState } from "react";
import { FileDown, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AssetAcceptanceProps {
  asset: {
    name: string;
    tag: string;
    category: string;
    serialNumber: string;
    condition: string;
  };
  onAccept: () => void;
}

export function AssetAcceptanceScreen({ asset, onAccept }: AssetAcceptanceProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [signature, setSignature] = useState("");
  const [accepted, setAccepted] = useState(false);

  const canAccept = acknowledged && signature.trim().length > 0;

  const handleAccept = () => {
    if (!canAccept) return;
    setAccepted(true);
    onAccept();
  };

  if (accepted) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-12 space-y-4">
        <CheckCircle2 className="size-16 mx-auto text-green-600" />
        <h2 className="text-xl font-semibold">Asset Accepted</h2>
        <p className="text-sm text-muted-foreground">
          You have successfully accepted responsibility for{" "}
          <span className="font-medium text-foreground">{asset.name}</span>.
        </p>
        <Button variant="outline">
          <FileDown className="size-4" />
          Download Receipt
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Accept Asset Assignment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review the details below and acknowledge receipt of this asset.
        </p>
      </div>

      {/* Asset summary */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Asset Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{asset.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tag</p>
              <p className="font-medium">{asset.tag}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">{asset.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Serial Number</p>
              <p className="font-medium">{asset.serialNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{asset.condition}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm">Terms of Use</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              By accepting this asset, you agree to the following terms:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Use the asset solely for authorized company purposes.
              </li>
              <li>
                Take reasonable care to prevent damage, loss, or theft.
              </li>
              <li>
                Report any issues, damage, or malfunctions promptly to IT/Admin.
              </li>
              <li>
                Return the asset in acceptable condition when requested or upon
                separation from the company.
              </li>
              <li>
                Do not modify, disassemble, or attempt unauthorized repairs.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Acknowledgment checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="acknowledge"
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked === true)}
        />
        <Label htmlFor="acknowledge" className="text-sm leading-normal cursor-pointer">
          I acknowledge receipt and accept responsibility for this asset
        </Label>
      </div>

      {/* Signature */}
      <div className="space-y-2">
        <Label htmlFor="signature" className="text-sm">
          Signature
        </Label>
        <Input
          id="signature"
          placeholder="Type your full name as signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className={cn(
            "font-serif italic text-lg h-12 border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
          )}
        />
        <p className="text-xs text-muted-foreground">
          Typing your name serves as your electronic signature.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleAccept} disabled={!canAccept} className="flex-1">
          Accept Asset
        </Button>
        <Button variant="outline">
          <FileDown className="size-4" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
}
