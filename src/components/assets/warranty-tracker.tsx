import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { MOCK_WARRANTIES } from "@/lib/asset-mock-data";
import type { WarrantyInfo, WarrantyClaim } from "@/types/asset";

function daysUntilExpiry(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ endDate }: { endDate: string }) {
  const days = daysUntilExpiry(endDate);
  if (days < 0) {
    return (
      <Badge variant="outline" className="text-xs border border-red-200 bg-red-50 text-red-700 gap-1">
        <XCircle className="size-3" />
        Expired
      </Badge>
    );
  }
  if (days <= 90) {
    return (
      <Badge variant="outline" className="text-xs border border-amber-200 bg-amber-50 text-amber-700 gap-1">
        <AlertTriangle className="size-3" />
        {days} days left
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs border border-green-200 bg-green-50 text-green-700 gap-1">
      <ShieldCheck className="size-3" />
      {days} days left
    </Badge>
  );
}

function UnderWarrantyBadge() {
  return (
    <Badge variant="outline" className="text-xs border border-green-200 bg-green-50 text-green-700 gap-1">
      <ShieldCheck className="size-3" />
      Under Warranty
    </Badge>
  );
}

const CLAIM_STATUS_STYLES: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  submitted: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: FileText },
  "in-progress": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Loader2 },
  resolved: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export function WarrantyTracker() {
  const expiringSoon = useMemo(
    () => MOCK_WARRANTIES.filter((w) => {
      const days = daysUntilExpiry(w.endDate);
      return days >= 0 && days <= 180;
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Widget: Expiring Soon */}
      {expiringSoon.length > 0 && (
        <Card className="rounded-xl border-border bg-card border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700">
              <AlertTriangle className="size-4" />
              Warranty Expiring Soon
            </CardTitle>
            <CardDescription className="text-sm">
              {expiringSoon.length} asset{expiringSoon.length !== 1 ? "s" : ""} with warranty expiring within 180 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((w) => (
                <div
                  key={w.assetId}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{w.assetName}</p>
                    <p className="text-xs text-muted-foreground">{w.assetTag} &middot; {w.provider}</p>
                  </div>
                  <ExpiryBadge endDate={w.endDate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Warranty Cards */}
      {MOCK_WARRANTIES.map((warranty) => {
        const days = daysUntilExpiry(warranty.endDate);
        const isActive = days >= 0;

        return (
          <Card key={warranty.assetId} className="rounded-xl border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {warranty.assetName}
                    {isActive && <UnderWarrantyBadge />}
                  </CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    {warranty.assetTag}
                  </CardDescription>
                </div>
                <ExpiryBadge endDate={warranty.endDate} />
              </div>
            </CardHeader>
            <CardContent>
              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Provider</p>
                  <p className="text-sm font-medium">{warranty.provider}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Coverage</p>
                  <p className="text-sm">{warranty.coverage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
                    <Calendar className="size-3" /> Period
                  </p>
                  <p className="text-sm">
                    {new Date(warranty.startDate).toLocaleDateString()} &ndash; {new Date(warranty.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
                    <Phone className="size-3" /> Claim Contact
                  </p>
                  <p className="text-sm">{warranty.claimContact}</p>
                </div>
              </div>

              {/* Claims Log */}
              {warranty.claims.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="size-4" />
                    Claims History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 font-medium text-muted-foreground">Submitted</th>
                          <th className="text-left py-2 px-2 font-medium text-muted-foreground">Description</th>
                          <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-2 px-2 font-medium text-muted-foreground">Resolution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warranty.claims.map((claim) => {
                          const style = CLAIM_STATUS_STYLES[claim.status];
                          const ClaimIcon = style.icon;
                          return (
                            <tr key={claim.id} className="border-b border-border last:border-0">
                              <td className="py-2 px-2 whitespace-nowrap">
                                {new Date(claim.submissionDate).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-2">{claim.description}</td>
                              <td className="py-2 px-2">
                                <Badge variant="outline" className={cn("text-xs border gap-1", style.bg, style.color)}>
                                  <ClaimIcon className="size-3" />
                                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1).replace("-", " ")}
                                </Badge>
                              </td>
                              <td className="py-2 px-2">{claim.resolution || "--"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {warranty.claims.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No claims filed for this warranty.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
