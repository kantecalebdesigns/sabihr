import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DocumentSearchFilter } from "@/components/documents/document-search-filter";
import type { DocumentFilters } from "@/components/documents/document-search-filter";
import {
  Grid3X3,
  List,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Eye,
  Download,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

/* ─── Types ─── */

type DocumentStatus = "uploaded" | "verified" | "rejected";
type DocumentCategory =
  | "personal"
  | "employment"
  | "compliance"
  | "financial"
  | "legal"
  | "training";
type SensitivityLevel = "public" | "internal" | "confidential" | "restricted";
type FileType = "pdf" | "docx" | "xlsx" | "jpg" | "png";
type ViewMode = "grid" | "list";
type SortField =
  | "name"
  | "employee"
  | "category"
  | "status"
  | "sensitivity"
  | "uploadDate"
  | "size";
type SortDirection = "asc" | "desc";

interface MockDocument {
  id: string;
  name: string;
  employee: string;
  category: DocumentCategory;
  sensitivity: SensitivityLevel;
  status: DocumentStatus;
  uploadDate: string;
  size: string;
  sizeBytes: number;
  fileType: FileType;
}

/* ─── Mock Data ─── */

const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "doc-001",
    name: "Employment Contract.pdf",
    employee: "Adebayo Ogundimu",
    category: "employment",
    sensitivity: "confidential",
    status: "verified",
    uploadDate: "2025-12-10",
    size: "1.2 MB",
    sizeBytes: 1258291,
    fileType: "pdf",
  },
  {
    id: "doc-002",
    name: "National ID Card.jpg",
    employee: "Chinwe Okafor",
    category: "personal",
    sensitivity: "restricted",
    status: "verified",
    uploadDate: "2025-11-22",
    size: "3.4 MB",
    sizeBytes: 3565158,
    fileType: "jpg",
  },
  {
    id: "doc-003",
    name: "Tax Clearance Certificate.pdf",
    employee: "Emeka Nwosu",
    category: "financial",
    sensitivity: "confidential",
    status: "uploaded",
    uploadDate: "2026-01-05",
    size: "890 KB",
    sizeBytes: 911360,
    fileType: "pdf",
  },
  {
    id: "doc-004",
    name: "Safety Training Certificate.pdf",
    employee: "Fatima Bello",
    category: "training",
    sensitivity: "internal",
    status: "verified",
    uploadDate: "2025-10-15",
    size: "540 KB",
    sizeBytes: 552960,
    fileType: "pdf",
  },
  {
    id: "doc-005",
    name: "NDA Agreement.docx",
    employee: "Ifeanyi Eze",
    category: "legal",
    sensitivity: "restricted",
    status: "verified",
    uploadDate: "2025-09-30",
    size: "220 KB",
    sizeBytes: 225280,
    fileType: "docx",
  },
  {
    id: "doc-006",
    name: "Payroll Summary Q4.xlsx",
    employee: "Kemi Adeyemi",
    category: "financial",
    sensitivity: "confidential",
    status: "uploaded",
    uploadDate: "2026-01-12",
    size: "1.8 MB",
    sizeBytes: 1887436,
    fileType: "xlsx",
  },
  {
    id: "doc-007",
    name: "Passport Photograph.png",
    employee: "Musa Ibrahim",
    category: "personal",
    sensitivity: "internal",
    status: "rejected",
    uploadDate: "2026-02-03",
    size: "2.1 MB",
    sizeBytes: 2202009,
    fileType: "png",
  },
  {
    id: "doc-008",
    name: "Compliance Audit Report.pdf",
    employee: "Ngozi Uche",
    category: "compliance",
    sensitivity: "restricted",
    status: "verified",
    uploadDate: "2025-11-08",
    size: "4.5 MB",
    sizeBytes: 4718592,
    fileType: "pdf",
  },
  {
    id: "doc-009",
    name: "Offer Letter.docx",
    employee: "Oluwaseun Bakare",
    category: "employment",
    sensitivity: "confidential",
    status: "verified",
    uploadDate: "2025-08-20",
    size: "180 KB",
    sizeBytes: 184320,
    fileType: "docx",
  },
  {
    id: "doc-010",
    name: "Health Insurance Form.pdf",
    employee: "Precious Obi",
    category: "personal",
    sensitivity: "confidential",
    status: "uploaded",
    uploadDate: "2026-02-18",
    size: "620 KB",
    sizeBytes: 634880,
    fileType: "pdf",
  },
  {
    id: "doc-011",
    name: "Fire Safety Drill Report.pdf",
    employee: "Rasheed Afolabi",
    category: "compliance",
    sensitivity: "public",
    status: "verified",
    uploadDate: "2026-01-28",
    size: "310 KB",
    sizeBytes: 317440,
    fileType: "pdf",
  },
  {
    id: "doc-012",
    name: "Performance Review 2025.xlsx",
    employee: "Sade Williams",
    category: "employment",
    sensitivity: "confidential",
    status: "rejected",
    uploadDate: "2026-03-01",
    size: "950 KB",
    sizeBytes: 972800,
    fileType: "xlsx",
  },
];

/* ─── Helpers ─── */

const FILE_TYPE_ICONS: Record<FileType, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "text-red-500" },
  docx: { icon: FileText, color: "text-blue-500" },
  xlsx: { icon: FileSpreadsheet, color: "text-emerald-500" },
  jpg: { icon: FileImage, color: "text-amber-500" },
  png: { icon: FileImage, color: "text-purple-500" },
};

const CATEGORY_STYLES: Record<DocumentCategory, { label: string; color: string }> = {
  personal: { label: "Personal", color: "text-violet-600" },
  employment: { label: "Employment", color: "text-blue-600" },
  compliance: { label: "Compliance", color: "text-teal-600" },
  financial: { label: "Financial", color: "text-emerald-600" },
  legal: { label: "Legal", color: "text-orange-600" },
  training: { label: "Training", color: "text-cyan-600" },
};

const STATUS_STYLES: Record<DocumentStatus, { label: string; color: string }> = {
  uploaded: { label: "Uploaded", color: "text-gray-500" },
  verified: { label: "Verified", color: "text-emerald-700" },
  rejected: { label: "Rejected", color: "text-red-700" },
};

const SENSITIVITY_STYLES: Record<SensitivityLevel, { label: string; color: string }> = {
  public: { label: "Public", color: "text-green-600" },
  internal: { label: "Internal", color: "text-blue-600" },
  confidential: { label: "Confidential", color: "text-amber-600" },
  restricted: { label: "Restricted", color: "text-red-600" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ─── Page Component ─── */

export default function DocumentLibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DocumentFilters | null>(null);
  const [sortField, setSortField] = useState<SortField>("uploadDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredDocuments = useMemo(() => {
    let docs = [...MOCK_DOCUMENTS];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.employee.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters) {
      if (filters.documentType && filters.documentType !== "all") {
        docs = docs.filter((d) => d.category === filters.documentType);
      }
      if (filters.status && filters.status !== "all") {
        docs = docs.filter((d) => d.status === filters.status);
      }
      if (filters.sensitivity && filters.sensitivity !== "all") {
        docs = docs.filter((d) => d.sensitivity === filters.sensitivity);
      }
      if (filters.dateFrom) {
        docs = docs.filter((d) => d.uploadDate >= filters.dateFrom);
      }
      if (filters.dateTo) {
        docs = docs.filter((d) => d.uploadDate <= filters.dateTo);
      }
      if (filters.uploadedBy) {
        const ub = filters.uploadedBy.toLowerCase();
        docs = docs.filter((d) => d.employee.toLowerCase().includes(ub));
      }
    }

    // Sort
    docs.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "employee":
          cmp = a.employee.localeCompare(b.employee);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "sensitivity":
          cmp = a.sensitivity.localeCompare(b.sensitivity);
          break;
        case "uploadDate":
          cmp = a.uploadDate.localeCompare(b.uploadDate);
          break;
        case "size":
          cmp = a.sizeBytes - b.sizeBytes;
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return docs;
  }, [searchQuery, filters, sortField, sortDirection]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Document Library
          </h1>
          <p className="text-sm text-slate-500">
            Browse and manage all employee documents
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Upload className="w-4 h-4" />
          Upload Documents
        </Button>
      </div>

      {/* Search / Filters */}
      <DocumentSearchFilter
        onSearch={(query) => setSearchQuery(query)}
        onFilter={(f) => setFilters(f)}
      />

      {/* Toolbar: count + view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredDocuments.length} document
          {filteredDocuments.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex items-center gap-1 border border-[#efefef] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => {
            const ftConfig = FILE_TYPE_ICONS[doc.fileType] ?? { icon: File, color: "text-gray-500" };
            const FTIcon = ftConfig.icon;
            return (
              <div
                key={doc.id}
                className="group relative rounded-xl border border-[#efefef] bg-white p-4 space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* File icon + name */}
                <div className="flex items-start gap-3">
                  <FTIcon className={cn("w-5 h-5 mt-0.5 shrink-0", ftConfig.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-slate-500 truncate">{doc.employee}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatDate(doc.uploadDate)}</span>
                  <span>{doc.size}</span>
                </div>

                {/* Hover actions */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-3 rounded-b-xl bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List / Table View */}
      {viewMode === "list" && (
        <div className="border border-[#efefef] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] text-left">
                  <SortableHeader
                    label="Name"
                    field="name"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Employee"
                    field="employee"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="hidden md:table-cell"
                  />
                  <SortableHeader
                    label="Category"
                    field="category"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="hidden lg:table-cell"
                  />
                  <SortableHeader
                    label="Status"
                    field="status"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Sensitivity"
                    field="sensitivity"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="hidden lg:table-cell"
                  />
                  <SortableHeader
                    label="Upload Date"
                    field="uploadDate"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="hidden xl:table-cell"
                  />
                  <SortableHeader
                    label="Size"
                    field="size"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="hidden xl:table-cell"
                  />
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const ftConfig = FILE_TYPE_ICONS[doc.fileType] ?? { icon: File, color: "text-gray-500" };
                  const FTIcon = ftConfig.icon;
                  const catStyle = CATEGORY_STYLES[doc.category];
                  const statusStyle = STATUS_STYLES[doc.status];
                  const sensStyle = SENSITIVITY_STYLES[doc.sensitivity];

                  return (
                    <tr
                      key={doc.id}
                      className="border-t border-[#efefef] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FTIcon className={cn("w-4 h-4 shrink-0", ftConfig.color)} />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-slate-500 md:hidden truncate">{doc.employee}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-500">
                        {doc.employee}
                      </td>
                      <td className={cn("px-4 py-3 hidden lg:table-cell text-sm font-medium", catStyle.color)}>
                        {catStyle.label}
                      </td>
                      <td className={cn("px-4 py-3 text-sm font-medium", statusStyle.color)}>
                        {statusStyle.label}
                      </td>
                      <td className={cn("px-4 py-3 hidden lg:table-cell text-sm font-medium", sensStyle.color)}>
                        {sensStyle.label}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-500">
                        {formatDate(doc.uploadDate)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-500">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <FileText className="w-10 h-10 text-slate-500/30 mb-3" />
          <p className="text-sm text-slate-500">
            No documents match your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Sortable Table Header ─── */

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const isActive = currentField === field;

  return (
    <th className={cn("px-4 py-3 text-xs font-medium text-slate-500", className)}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
      >
        {label}
        {isActive ? (
          direction === "asc" ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-40" />
        )}
      </button>
    </th>
  );
}
