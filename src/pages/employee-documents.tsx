import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropUpload } from "@/components/documents/drag-drop-upload";
import { cn } from "@/lib/utils";
import {
  FileText,
  FileImage,
  Download,
  Eye,
  Upload,
  RefreshCw,
  PenLine,
  Clock,
  AlertTriangle,
  CalendarDays,
  User,
  Files,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

// ---------- Types ----------

type DocStatus = "uploaded" | "verified" | "rejected";
type SignatureStatus = "signed" | "pending" | "not_required";

interface MyDocument {
  id: string;
  name: string;
  type: string;
  fileType: "pdf" | "image" | "doc";
  uploadDate: string;
  expiryDate?: string;
  status: DocStatus;
}

interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  sentBy: string;
  sentDate: string;
  signatureStatus: SignatureStatus;
}

interface PendingDocument {
  id: string;
  requiredType: string;
  description: string;
  deadline: string;
}

// ---------- Mock Data ----------

const myDocuments: MyDocument[] = [
  { id: "1", name: "BSc_Certificate.pdf", type: "School Certificate", fileType: "pdf", uploadDate: "2025-09-15", expiryDate: undefined, status: "verified" },
  { id: "2", name: "National_ID_Card.jpg", type: "National ID", fileType: "image", uploadDate: "2025-10-02", expiryDate: "2026-05-20", status: "uploaded" },
  { id: "3", name: "Drivers_License.pdf", type: "Driver's License", fileType: "pdf", uploadDate: "2025-08-11", expiryDate: "2026-03-28", status: "uploaded" },
  { id: "4", name: "NYSC_Discharge.pdf", type: "NYSC Certificate", fileType: "pdf", uploadDate: "2025-07-20", expiryDate: undefined, status: "verified" },
  { id: "5", name: "Passport_Photo.png", type: "Passport Photograph", fileType: "image", uploadDate: "2025-06-01", expiryDate: "2025-12-01", status: "rejected" },
];

const companyDocuments: CompanyDocument[] = [
  { id: "c1", name: "Offer_Letter_2025.pdf", type: "Offer Letter", sentBy: "HR Admin", sentDate: "2025-06-01", signatureStatus: "signed" },
  { id: "c2", name: "Employment_Contract.pdf", type: "Employment Contract", sentBy: "HR Admin", sentDate: "2025-06-15", signatureStatus: "signed" },
  { id: "c3", name: "NDA_Agreement.pdf", type: "Non-Disclosure Agreement", sentBy: "Legal Team", sentDate: "2025-07-01", signatureStatus: "pending" },
  { id: "c4", name: "Promotion_Letter_Q1_2026.pdf", type: "Promotion Letter", sentBy: "HR Manager", sentDate: "2026-01-20", signatureStatus: "not_required" },
];

const pendingDocuments: PendingDocument[] = [
  { id: "p1", requiredType: "Tax Identification Number (TIN)", description: "Upload a copy of your Tax Identification Number certificate for payroll processing.", deadline: "2026-04-01" },
  { id: "p2", requiredType: "Guarantor's Form", description: "Complete and upload the signed guarantor's form. Download the template from Company Documents.", deadline: "2026-03-31" },
  { id: "p3", requiredType: "Medical Fitness Certificate", description: "Upload a recent medical fitness certificate from an accredited hospital.", deadline: "2026-04-15" },
];

// ---------- Helpers ----------

const tabs = ["Uploaded by Me", "Company Documents", "Pending"] as const;
type Tab = (typeof tabs)[number];

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

const STATUS_PILL: Record<DocStatus, { label: string; cls: string; dot: string }> = {
  verified: {
    label: "Verified",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  uploaded: {
    label: "Uploaded",
    cls: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

const SIGNATURE_PILL: Record<
  SignatureStatus,
  { label: string; cls: string; dot: string }
> = {
  signed: {
    label: "Signed",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending signature",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  not_required: {
    label: "Not required",
    cls: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

function fileIcon(fileType: string) {
  switch (fileType) {
    case "image":
      return <FileImage className="w-[18px] h-[18px] text-blue-600" />;
    case "pdf":
      return <FileText className="w-[18px] h-[18px] text-rose-600" />;
    default:
      return <FileText className="w-[18px] h-[18px] text-slate-600" />;
  }
}

function StatusPill({ status }: { status: DocStatus }) {
  const p = STATUS_PILL[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        p.cls
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
      {p.label}
    </span>
  );
}

function ExpiryPill({ expiryDate }: { expiryDate?: string }) {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700">
        <AlertTriangle className="w-3 h-3" />
        Expired
      </span>
    );
  }
  if (daysLeft <= 90) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
        <AlertTriangle className="w-3 h-3" />
        Expires in {daysLeft}d
      </span>
    );
  }
  return null;
}

function SignaturePill({ status }: { status: SignatureStatus }) {
  const p = SIGNATURE_PILL[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        p.cls
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
      {p.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------- Component ----------

export default function EmployeeDocumentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Uploaded by Me");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const verifiedCount = myDocuments.filter((d) => d.status === "verified").length;
  const awaitingSignature = companyDocuments.filter(
    (d) => d.signatureStatus === "pending"
  ).length;

  const kpis = [
    { label: "Uploaded by Me", value: myDocuments.length, icon: Files },
    { label: "Verified", value: verifiedCount, icon: CheckCircle2 },
    { label: "Awaiting Signature", value: awaitingSignature, icon: PenLine },
    { label: "Pending Action", value: pendingDocuments.length, icon: ClipboardList },
  ];

  const tabConfig: { key: Tab; count: number }[] = [
    { key: "Uploaded by Me", count: myDocuments.length },
    { key: "Company Documents", count: companyDocuments.length },
    { key: "Pending", count: pendingDocuments.length },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Documents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage the documents you've uploaded and the ones your company has shared with you.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={cn(CARD_SHELL, "px-5 pt-5 pb-5 flex flex-col gap-7")}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600 w-[18px] h-[18px]" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {c.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chip filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabConfig.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.key}
              <span
                className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "Uploaded by Me" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDocuments.map((doc) => (
            <div key={doc.id} className={cn(CARD_SHELL, "p-5 space-y-3")}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {fileIcon(doc.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">
                    {doc.type}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Uploaded: {formatDate(doc.uploadDate)}
                </div>
                {doc.expiryDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Expires: {formatDate(doc.expiryDate)}
                  </div>
                )}
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-1.5">
                <StatusPill status={doc.status} />
                <ExpiryPill expiryDate={doc.expiryDate} />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Re-upload
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Company Documents" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {companyDocuments.map((doc) => (
            <div key={doc.id} className={cn(CARD_SHELL, "p-5 space-y-3")}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-[18px] h-[18px] text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">
                    {doc.type}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Sent by: {doc.sentBy}
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Sent: {formatDate(doc.sentDate)}
                </div>
              </div>

              <div>
                <SignaturePill status={doc.signatureStatus} />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                </Button>
                {doc.signatureStatus === "pending" && (
                  <Button
                    size="sm"
                    className="flex-1 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                  >
                    <PenLine className="w-3.5 h-3.5 mr-1" />
                    Sign
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Pending" && (
        <div className="space-y-4">
          {pendingDocuments.map((doc) => (
            <div key={doc.id} className={cn(CARD_SHELL, "p-5 space-y-3")}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-[18px] h-[18px] text-amber-600" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {doc.requiredType}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline: {formatDate(doc.deadline)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-9 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
                  onClick={() =>
                    setUploadingFor(uploadingFor === doc.id ? null : doc.id)
                  }
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {uploadingFor === doc.id ? "Cancel" : "Upload"}
                </Button>
              </div>

              {/* Inline upload area */}
              {uploadingFor === doc.id && (
                <div className="pt-2">
                  <DragDropUpload
                    onFilesSelected={(files) => {
                      console.log(
                        `Files selected for ${doc.requiredType}:`,
                        files
                      );
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    maxSize={10 * 1024 * 1024}
                    multiple={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
