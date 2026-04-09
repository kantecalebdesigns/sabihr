import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropUpload } from "@/components/documents/drag-drop-upload";
import { cn } from "@/lib/utils";
import {
  FileText,
  FileImage,
  FileCheck2,
  Download,
  Eye,
  Upload,
  RefreshCw,
  PenLine,
  Clock,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  CalendarDays,
  User,
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
  {
    id: "1",
    name: "BSc_Certificate.pdf",
    type: "School Certificate",
    fileType: "pdf",
    uploadDate: "2025-09-15",
    expiryDate: undefined,
    status: "verified",
  },
  {
    id: "2",
    name: "National_ID_Card.jpg",
    type: "National ID",
    fileType: "image",
    uploadDate: "2025-10-02",
    expiryDate: "2026-05-20",
    status: "uploaded",
  },
  {
    id: "3",
    name: "Drivers_License.pdf",
    type: "Driver's License",
    fileType: "pdf",
    uploadDate: "2025-08-11",
    expiryDate: "2026-03-28",
    status: "uploaded",
  },
  {
    id: "4",
    name: "NYSC_Discharge.pdf",
    type: "NYSC Certificate",
    fileType: "pdf",
    uploadDate: "2025-07-20",
    expiryDate: undefined,
    status: "verified",
  },
  {
    id: "5",
    name: "Passport_Photo.png",
    type: "Passport Photograph",
    fileType: "image",
    uploadDate: "2025-06-01",
    expiryDate: "2025-12-01",
    status: "rejected",
  },
];

const companyDocuments: CompanyDocument[] = [
  {
    id: "c1",
    name: "Offer_Letter_2025.pdf",
    type: "Offer Letter",
    sentBy: "HR Admin",
    sentDate: "2025-06-01",
    signatureStatus: "signed",
  },
  {
    id: "c2",
    name: "Employment_Contract.pdf",
    type: "Employment Contract",
    sentBy: "HR Admin",
    sentDate: "2025-06-15",
    signatureStatus: "signed",
  },
  {
    id: "c3",
    name: "NDA_Agreement.pdf",
    type: "Non-Disclosure Agreement",
    sentBy: "Legal Team",
    sentDate: "2025-07-01",
    signatureStatus: "pending",
  },
  {
    id: "c4",
    name: "Promotion_Letter_Q1_2026.pdf",
    type: "Promotion Letter",
    sentBy: "HR Manager",
    sentDate: "2026-01-20",
    signatureStatus: "not_required",
  },
];

const pendingDocuments: PendingDocument[] = [
  {
    id: "p1",
    requiredType: "Tax Identification Number (TIN)",
    description:
      "Upload a copy of your Tax Identification Number certificate for payroll processing.",
    deadline: "2026-04-01",
  },
  {
    id: "p2",
    requiredType: "Guarantor's Form",
    description:
      "Complete and upload the signed guarantor's form. Download the template from Company Documents.",
    deadline: "2026-03-31",
  },
  {
    id: "p3",
    requiredType: "Medical Fitness Certificate",
    description:
      "Upload a recent medical fitness certificate from an accredited hospital.",
    deadline: "2026-04-15",
  },
];

// ---------- Helpers ----------

const tabs = ["Uploaded by Me", "Company Documents", "Pending"] as const;
type Tab = (typeof tabs)[number];

function fileIcon(fileType: string) {
  switch (fileType) {
    case "image":
      return <FileImage className="size-5 text-blue-500" />;
    case "pdf":
      return <FileText className="size-5 text-red-500" />;
    default:
      return <FileText className="size-5 text-blue-600" />;
  }
}

function statusBadge(status: DocStatus) {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <ShieldCheck className="size-3" />
          Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle className="size-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <FileCheck2 className="size-3" />
          Uploaded
        </Badge>
      );
  }
}

function expiryBadge(expiryDate?: string) {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200">
        <AlertTriangle className="size-3" />
        Expired
      </Badge>
    );
  }
  if (daysLeft <= 90) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
        <AlertTriangle className="size-3" />
        Expires in {daysLeft}d
      </Badge>
    );
  }
  return null;
}

function signatureBadge(status: SignatureStatus) {
  switch (status) {
    case "signed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <ShieldCheck className="size-3" />
          Signed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
          <Clock className="size-3" />
          Pending Signature
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
          Not Required
        </Badge>
      );
  }
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

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Documents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage your documents
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Uploaded by Me" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3"
            >
              {/* Top row: icon + name */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f8fafc] p-2 shrink-0">
                  {fileIcon(doc.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500">{doc.type}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Uploaded: {formatDate(doc.uploadDate)}
                </div>
                {doc.expiryDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    Expires: {formatDate(doc.expiryDate)}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {statusBadge(doc.status)}
                {expiryBadge(doc.expiryDate)}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="size-3.5 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Download className="size-3.5 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <RefreshCw className="size-3.5 mr-1" />
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
            <div
              key={doc.id}
              className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3"
            >
              {/* Top */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f8fafc] p-2 shrink-0">
                  <FileText className="size-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500">{doc.type}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  Sent by: {doc.sentBy}
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Sent: {formatDate(doc.sentDate)}
                </div>
              </div>

              {/* Signature Badge */}
              <div>{signatureBadge(doc.signatureStatus)}</div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="size-3.5 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Download className="size-3.5 mr-1" />
                  Download
                </Button>
                {doc.signatureStatus === "pending" && (
                  <Button size="sm" className="flex-1 text-xs">
                    <PenLine className="size-3.5 mr-1" />
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
            <div
              key={doc.id}
              className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {doc.requiredType}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {doc.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <Clock className="size-3.5" />
                    Deadline: {formatDate(doc.deadline)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() =>
                    setUploadingFor(
                      uploadingFor === doc.id ? null : doc.id
                    )
                  }
                >
                  <Upload className="size-3.5 mr-1.5" />
                  {uploadingFor === doc.id ? "Cancel" : "Upload"}
                </Button>
              </div>

              {/* Inline upload area */}
              {uploadingFor === doc.id && (
                <div className="pt-2">
                  <DragDropUpload
                    onFilesSelected={(files) => {
                      // In a real app this would trigger an upload
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
