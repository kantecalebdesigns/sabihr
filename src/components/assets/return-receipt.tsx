import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Mail,
  Printer,
  FileCheck,
} from "lucide-react";
import { ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";
import type { AssetCondition } from "@/types/asset";

interface ReturnReceiptProps {
  assetName: string;
  assetTag: string;
  employeeName: string;
  conditionBefore: AssetCondition;
  conditionAfter: AssetCondition;
  damages: string;
  date: string;
}

export default function ReturnReceipt({
  assetName,
  assetTag,
  employeeName,
  conditionBefore,
  conditionAfter,
  damages,
  date,
}: ReturnReceiptProps) {
  const beforeStyle = ASSET_CONDITION_STYLES[conditionBefore];
  const afterStyle = ASSET_CONDITION_STYLES[conditionAfter];

  function handleDownload() {
    alert("Downloading receipt as PDF...");
  }

  function handleEmail() {
    alert(`Emailing receipt to ${employeeName}...`);
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="size-5" />
          Return Receipt
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-sm gap-1.5"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            Download Receipt
          </Button>
          <Button
            size="sm"
            className="rounded-xl text-sm gap-1.5"
            onClick={handleEmail}
          >
            <Mail className="size-4" />
            Email to Employee
          </Button>
        </div>
      </div>

      {/* Printable Receipt */}
      <Card className="rounded-xl border-border bg-card print:shadow-none print:border">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="text-center border-b border-border pb-6 mb-6">
            <h3 className="text-xl font-bold">Asset Return Acknowledgment</h3>
            <p className="text-sm text-muted-foreground mt-1">Sabi HR Asset Management</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Asset Name</p>
                <p className="text-sm font-semibold mt-0.5">{assetName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Asset Tag</p>
                <p className="text-sm font-medium mt-0.5">{assetTag}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Return Date</p>
                <p className="text-sm font-medium mt-0.5">{new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Employee</p>
                <p className="text-sm font-semibold mt-0.5">{employeeName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Condition at Assignment</p>
                <Badge variant="outline" className={cn("text-xs border mt-1", beforeStyle.bg, beforeStyle.color)}>
                  {beforeStyle.label}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Condition at Return</p>
                <Badge variant="outline" className={cn("text-xs border mt-1", afterStyle.bg, afterStyle.color)}>
                  {afterStyle.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Damages */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Noted Damages</p>
            <div className="rounded-xl border border-border bg-muted/50 p-4 min-h-[60px]">
              <p className="text-sm">{damages || "No damages noted."}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="border-b border-border pb-8 mb-2" />
              <p className="text-xs text-muted-foreground">Employee Signature</p>
              <p className="text-sm font-medium">{employeeName}</p>
            </div>
            <div>
              <div className="border-b border-border pb-8 mb-2" />
              <p className="text-xs text-muted-foreground">Inspector Signature</p>
              <p className="text-sm font-medium">Asset Administrator</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              This document acknowledges the return of the above-listed asset. Both parties confirm the condition as assessed.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Generated on {new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
