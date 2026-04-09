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
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ASSET_REQUESTS } from "@/lib/asset-mock-data";
import type { RequestStatus, RequestUrgency } from "@/types/asset";

const CURRENT_EMPLOYEE_ID = "emp-001";

const CATEGORY_OPTIONS = [
  { id: "cat-1", name: "Laptop", icon: Laptop, description: "Work laptops and notebooks" },
  { id: "cat-2", name: "Monitor", icon: Monitor, description: "External displays and screens" },
  { id: "cat-3", name: "Phone", icon: Smartphone, description: "Company mobile phones" },
  { id: "cat-4", name: "Furniture", icon: Armchair, description: "Desks, chairs, and office furniture" },
  { id: "cat-5", name: "Vehicle", icon: Car, description: "Company vehicles" },
  { id: "cat-6", name: "Networking", icon: Wifi, description: "Routers, switches, and cables" },
  { id: "cat-7", name: "Printer", icon: Printer, description: "Printers and scanners" },
  { id: "cat-8", name: "Other", icon: Box, description: "Miscellaneous equipment" },
];

const REQUEST_STATUS_STYLES: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "manager-approved": { label: "Manager Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  "it-processing": { label: "IT Processing", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  "ready-for-pickup": { label: "Ready", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export default function EmployeeAssetRequestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [justification, setJustification] = useState("");
  const [urgency, setUrgency] = useState<RequestUrgency>("standard");
  const [specs, setSpecs] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");

  const myRequests = MOCK_ASSET_REQUESTS.filter(
    (r) => r.employeeId === CURRENT_EMPLOYEE_ID
  );

  const handleSubmit = () => {
    const num = `AR-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    setRequestNumber(num);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setJustification("");
    setUrgency("standard");
    setSpecs("");
    setSubmitted(false);
    setRequestNumber("");
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Request New Asset</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a category, explain your need, and submit your request.
        </p>
      </div>

      {submitted ? (
        <Card className="rounded-xl border-[#efefef] bg-white">
          <CardContent className="text-center py-10 space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold">Request Submitted</h2>
            <p className="text-sm text-slate-500">
              Your request number is{" "}
              <span className="font-mono font-semibold text-slate-900">
                {requestNumber}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Your manager will review this request. You can track the status
              below.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Category selector */}
          <div className="space-y-3">
            <Label className="text-sm">Select Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const selected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border border-[#efefef] bg-white p-4 text-sm transition-colors hover:bg-[#f8fafc]",
                      selected && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <cat.icon className={cn("size-6", selected ? "text-blue-600" : "text-slate-500")} />
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-xs text-slate-500 text-center leading-tight">
                      {cat.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm">
              Justification
            </Label>
            <textarea
              id="justification"
              rows={3}
              placeholder="Explain why you need this asset..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="flex w-full rounded-xl border border-[#efefef] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-ring resize-none"
            />
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label className="text-sm">Urgency</Label>
            <div className="flex gap-3">
              {(["standard", "urgent"] as RequestUrgency[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-[#efefef] bg-white px-4 py-2.5 text-sm transition-colors hover:bg-[#f8fafc]",
                    urgency === u && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <Clock className={cn("size-4", urgency === u ? "text-blue-600" : "text-slate-500")} />
                  <span className="font-medium capitalize">{u}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred specs */}
          <div className="space-y-2">
            <Label htmlFor="specs" className="text-sm">
              Preferred Specifications{" "}
              <span className="text-slate-500 font-normal">(optional)</span>
            </Label>
            <textarea
              id="specs"
              rows={2}
              placeholder="E.g., 16GB RAM, 27-inch screen..."
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="flex w-full rounded-xl border border-[#efefef] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-ring resize-none"
            />
          </div>

          {/* Manager */}
          <div className="space-y-2">
            <Label className="text-sm">Approving Manager</Label>
            <div className="rounded-xl border border-[#efefef] bg-[#f8fafc] px-4 py-2.5 text-sm">
              Chiamaka Eze
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedCategory || justification.trim().length === 0}
            className="w-full sm:w-auto"
          >
            <Send className="size-4" />
            Submit Request
          </Button>
        </div>
      )}

      {/* My Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Requests</h2>
        {myRequests.length === 0 ? (
          <p className="text-sm text-slate-500">
            You have no asset requests yet.
          </p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => {
              const style = REQUEST_STATUS_STYLES[req.status];
              return (
                <Card key={req.id} className="rounded-xl border-[#efefef] bg-white">
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {req.categoryName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {req.requestNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Requested on{" "}
                        {new Date(req.requestDate).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {req.urgency === "urgent" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-orange-700 bg-orange-50 border-orange-200"
                        >
                          Urgent
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={cn("text-xs", style.color, style.bg)}
                      >
                        {style.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
