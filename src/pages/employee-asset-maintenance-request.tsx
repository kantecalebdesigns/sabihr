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
  Wrench,
  Send,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  HardDriveDownload,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_MAINTENANCE_REQUESTS,
} from "@/lib/asset-mock-data";
import type {
  MaintenanceType,
  MaintenanceRequestUrgency,
  MaintenanceRequestStatus,
} from "@/types/asset";

const CURRENT_EMPLOYEE_ID = "emp-001";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Laptops: Laptop,
  Monitors: Monitor,
  Phones: Smartphone,
  Furniture: Armchair,
  Vehicles: Car,
  Networking: Wifi,
  Printers: Printer,
  Other: Box,
};

const MAINTENANCE_TYPES: {
  value: MaintenanceType;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { value: "preventive", label: "Preventive", icon: ShieldCheck, description: "Routine care to keep the asset running well" },
  { value: "corrective", label: "Corrective", icon: Wrench, description: "Fix something that is broken or not working right" },
  { value: "inspection", label: "Inspection", icon: Sparkles, description: "Check, audit, or diagnostic service" },
  { value: "upgrade", label: "Upgrade", icon: HardDriveDownload, description: "Parts, firmware, or software improvement" },
];

const URGENCY_OPTIONS: { value: MaintenanceRequestUrgency; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-slate-600" },
  { value: "normal", label: "Normal", color: "text-blue-700" },
  { value: "high", label: "High", color: "text-amber-700" },
];

const STATUS_STYLES: Record<MaintenanceRequestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  approved: { label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  scheduled: { label: "Scheduled", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeeAssetMaintenanceRequestPage() {
  const myAssets = MOCK_ASSETS.filter((a) => a.assignedTo === CURRENT_EMPLOYEE_ID);
  const myRequests = MOCK_MAINTENANCE_REQUESTS.filter(
    (r) => r.employeeId === CURRENT_EMPLOYEE_ID
  );

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [type, setType] = useState<MaintenanceType | null>(null);
  const [urgency, setUrgency] = useState<MaintenanceRequestUrgency>("normal");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    selectedAssetId !== null && type !== null && description.trim().length > 0;

  const resetForm = () => {
    setSelectedAssetId(null);
    setType(null);
    setUrgency("normal");
    setDescription("");
    setPreferredDate("");
    setSubmitted(false);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Raise Maintenance Request</h1>
        <p className="text-sm text-slate-500 mt-1">
          Request servicing, inspection, or repair for an asset assigned to you.
        </p>
      </div>

      {submitted ? (
        <Card className="rounded-xl border-[#efefef] bg-white">
          <CardContent className="text-center py-10 space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold">Request Submitted</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Your maintenance request has been submitted. The IT/Admin team will review and schedule servicing.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Raise Another Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 1. Select Asset */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">1. Select the asset</Label>
            {myAssets.length === 0 ? (
              <Card className="rounded-xl border-[#efefef] bg-white">
                <CardContent className="py-8 text-center text-sm text-slate-500">
                  You don't have any assets assigned to you yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myAssets.map((asset) => {
                  const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
                  const isSelected = selectedAssetId === asset.id;
                  return (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        isSelected
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-[#efefef] bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
                        <IconComp className="size-5 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{asset.tag}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Maintenance Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">2. What kind of maintenance?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MAINTENANCE_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      isSelected
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-[#efefef] bg-white hover:border-slate-300"
                    )}
                  >
                    <Icon className={cn("size-5 mt-0.5 shrink-0", isSelected ? "text-blue-600" : "text-slate-500")} />
                    <div>
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Details */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">3. Details</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Urgency</Label>
                <div className="flex items-center gap-1 border border-[#efefef] rounded-lg p-0.5 w-fit">
                  {URGENCY_OPTIONS.map((u) => (
                    <button
                      key={u.value}
                      onClick={() => setUrgency(u.value)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                        urgency === u.value
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Preferred date (optional)</Label>
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">What needs to be done?</Label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue or service needed..."
                  className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={resetForm}>
              Clear
            </Button>
            <Button onClick={() => setSubmitted(true)} disabled={!canSubmit}>
              <Send className="size-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </div>
      )}

      {/* My requests history */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-700">My Maintenance Requests</h2>
        {myRequests.length === 0 ? (
          <Card className="rounded-xl border-[#efefef] bg-white">
            <CardContent className="py-8 text-center text-sm text-slate-500">
              You haven't raised any maintenance requests yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {myRequests.map((r) => {
              const s = STATUS_STYLES[r.status];
              return (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-[#efefef] bg-white p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{r.assetName}</p>
                      <Badge variant="outline" className={cn("text-[11px]", s.color, s.bg)}>
                        {s.label}
                      </Badge>
                      {r.urgency === "high" && (
                        <span className="text-[11px] text-amber-700 inline-flex items-center gap-1">
                          <AlertTriangle className="size-3" /> High urgency
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {r.description}
                    </p>
                    {r.reviewerNote && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        Admin: {r.reviewerNote}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                    <Calendar className="size-3" />
                    {formatDateTime(r.submittedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
