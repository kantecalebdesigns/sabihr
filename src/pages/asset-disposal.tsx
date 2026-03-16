import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Trash2,
  Search,
  Plus,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Archive,
} from "lucide-react";
import {
  MOCK_DISPOSALS,
  MOCK_ASSETS,
  formatCurrency,
} from "@/lib/asset-mock-data";
import type { DisposalMethod, ApprovalStatus } from "@/types/asset";

const DISPOSAL_METHOD_LABELS: Record<DisposalMethod, string> = {
  sold: "Sold",
  donated: "Donated",
  scrapped: "Scrapped",
  recycled: "Recycled",
};

const APPROVAL_STYLES: Record<ApprovalStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Pending Approval", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function AssetDisposal() {
  const [activeTab, setActiveTab] = useState<"request" | "archive">("request");
  const [archiveSearch, setArchiveSearch] = useState("");

  // Form state
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [method, setMethod] = useState<DisposalMethod>("sold");
  const [disposalValue, setDisposalValue] = useState("");
  const [buyerRecipient, setBuyerRecipient] = useState("");
  const [reason, setReason] = useState("");
  const [showCertificate, setShowCertificate] = useState<string | null>(null);

  const availableAssets = MOCK_ASSETS.filter(
    (a) => a.status !== "disposed"
  );

  const filteredDisposals = useMemo(() => {
    if (!archiveSearch.trim()) return MOCK_DISPOSALS;
    const q = archiveSearch.toLowerCase();
    return MOCK_DISPOSALS.filter(
      (d) =>
        d.assetName.toLowerCase().includes(q) ||
        d.assetTag.toLowerCase().includes(q) ||
        d.buyerOrRecipient.toLowerCase().includes(q)
    );
  }, [archiveSearch]);

  function handleSubmitDisposal() {
    const asset = MOCK_ASSETS.find((a) => a.id === selectedAssetId);
    alert(`Disposal request submitted for ${asset?.name ?? selectedAssetId}`);
    setSelectedAssetId("");
    setDisposalValue("");
    setBuyerRecipient("");
    setReason("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Disposal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit disposal requests, track approvals, and manage disposed asset records.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("request")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
            activeTab === "request"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Plus className="inline size-4 mr-1.5 -mt-0.5" />
          Disposal Request
        </button>
        <button
          onClick={() => setActiveTab("archive")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
            activeTab === "archive"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Archive className="inline size-4 mr-1.5 -mt-0.5" />
          Disposed Assets
        </button>
      </div>

      {activeTab === "request" && (
        <div className="space-y-6">
          {/* Disposal Request Form */}
          <Card className="rounded-xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Trash2 className="size-4" />
                New Disposal Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-1.5 block">Asset</Label>
                  <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                    <SelectTrigger className="rounded-xl text-sm w-full">
                      <SelectValue placeholder="Select an asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} ({asset.tag})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Disposal Method</Label>
                  <Select value={method} onValueChange={(v) => setMethod(v as DisposalMethod)}>
                    <SelectTrigger className="rounded-xl text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="donated">Donated</SelectItem>
                      <SelectItem value="scrapped">Scrapped</SelectItem>
                      <SelectItem value="recycled">Recycled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Disposal Value</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount..."
                    value={disposalValue}
                    onChange={(e) => setDisposalValue(e.target.value)}
                    className="text-sm rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">
                    {method === "sold" ? "Buyer" : method === "donated" ? "Recipient" : "Handler"}
                  </Label>
                  <Input
                    placeholder="Enter name..."
                    value={buyerRecipient}
                    onChange={(e) => setBuyerRecipient(e.target.value)}
                    className="text-sm rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm mb-1.5 block">Reason for Disposal</Label>
                  <Input
                    placeholder="Why is this asset being disposed?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-sm rounded-xl"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  className="rounded-xl text-sm gap-2"
                  onClick={handleSubmitDisposal}
                  disabled={!selectedAssetId || !reason.trim()}
                >
                  <Trash2 className="size-4" />
                  Submit Disposal Request
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Approval Tracker */}
          <Card className="rounded-xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Approval Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_DISPOSALS.map((disposal) => {
                  const approval = APPROVAL_STYLES[disposal.approvalStatus];
                  const ApprovalIcon = approval.icon;
                  return (
                    <div
                      key={disposal.id}
                      className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{disposal.assetName}</span>
                          <span className="text-xs text-muted-foreground">({disposal.assetTag})</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span>Method: <span className="font-medium text-foreground">{DISPOSAL_METHOD_LABELS[disposal.method]}</span></span>
                          <span>Value: <span className="font-medium text-foreground">{formatCurrency(disposal.disposalValue)}</span></span>
                          <span>Date: {new Date(disposal.disposalDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs border gap-1", approval.bg, approval.color)}>
                          <ApprovalIcon className="size-3" />
                          {approval.label}
                        </Badge>
                        {disposal.certificateGenerated && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl text-xs gap-1"
                            onClick={() => setShowCertificate(showCertificate === disposal.id ? null : disposal.id)}
                          >
                            <FileText className="size-3.5" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Disposal Certificate Preview */}
          {showCertificate && (() => {
            const disposal = MOCK_DISPOSALS.find((d) => d.id === showCertificate);
            if (!disposal) return null;
            return (
              <Card className="rounded-xl border-border bg-card">
                <CardContent className="pt-6">
                  <div className="max-w-lg mx-auto border border-border rounded-xl p-8 print:border print:shadow-none">
                    <div className="text-center border-b border-border pb-4 mb-6">
                      <h3 className="text-lg font-bold">Certificate of Disposal</h3>
                      <p className="text-xs text-muted-foreground mt-1">Sabi HR Asset Management</p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Asset:</span>
                        <span className="font-medium">{disposal.assetName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tag:</span>
                        <span className="font-medium">{disposal.assetTag}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method:</span>
                        <span className="font-medium">{DISPOSAL_METHOD_LABELS[disposal.method]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-medium">{formatCurrency(disposal.disposalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Book Value:</span>
                        <span className="font-medium">{formatCurrency(disposal.bookValueAtDisposal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Buyer/Recipient:</span>
                        <span className="font-medium">{disposal.buyerOrRecipient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{new Date(disposal.disposalDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved By:</span>
                        <span className="font-medium">{disposal.approvedBy ?? "N/A"}</span>
                      </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-border">
                      <div className="border-b border-border pb-8 mb-2" />
                      <p className="text-xs text-muted-foreground">Authorized Signature</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-6">
                      This certifies the disposal of the above-listed asset in accordance with company policy.
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm" className="rounded-xl text-sm gap-1.5" onClick={() => window.print()}>
                      <Printer className="size-4" />
                      Print Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}

      {activeTab === "archive" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search disposed assets..."
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              className="pl-9 text-sm rounded-xl"
            />
          </div>

          {/* Archive Table */}
          <Card className="rounded-xl border-border bg-card">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Asset</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tag</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Method</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Value</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Buyer/Recipient</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisposals.map((d) => {
                      const approval = APPROVAL_STYLES[d.approvalStatus];
                      const ApprovalIcon = approval.icon;
                      return (
                        <tr key={d.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-2 font-medium">{d.assetName}</td>
                          <td className="py-3 px-2 text-muted-foreground">{d.assetTag}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">
                              {DISPOSAL_METHOD_LABELS[d.method]}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 font-medium">{formatCurrency(d.disposalValue)}</td>
                          <td className="py-3 px-2">{d.buyerOrRecipient}</td>
                          <td className="py-3 px-2 whitespace-nowrap">{new Date(d.disposalDate).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={cn("text-xs border gap-1", approval.bg, approval.color)}>
                              <ApprovalIcon className="size-3" />
                              {approval.label}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredDisposals.length === 0 && (
                  <div className="py-12 text-center">
                    <Package className="size-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No disposed assets found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
