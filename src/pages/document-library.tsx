import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentSearchFilter } from "@/components/documents/document-search-filter";
import { SensitivityBadge } from "@/components/documents/sensitivity-badge";
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

const FILE_TYPE_ICONS: Record<FileType, { icon: typeof FileText; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  docx: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  xlsx: { icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  jpg: { icon: FileImage, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
  png: { icon: FileImage, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
};

const CATEGORY_STYLES: Record<DocumentCategory, { label: string; className: string }> = {
  personal: { label: "Personal", className: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400" },
  employment: { label: "Employment", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  compliance: { label: "Compliance", className: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400" },
  financial: { label: "Financial", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  legal: { label: "Legal", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  training: { label: "Training", className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400" },
};

const STATUS_STYLES: Record<DocumentStatus, { label: string; className: string }> = {
  uploaded: { label: "Uploaded", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  verified: { label: "Verified", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
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
          <p className="text-sm text-muted-foreground">
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
        <p className="text-sm text-muted-foreground">
          {filteredDocuments.length} document
          {filteredDocuments.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
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
                : "text-muted-foreground hover:text-foreground"
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
            const ftConfig = FILE_TYPE_ICONS[doc.fileType] ?? {
              icon: File,
              color: "text-gray-600",
              bg: "bg-gray-100",
            };
            const FTIcon = ftConfig.icon;
            const catStyle = CATEGORY_STYLES[doc.category];
            const statusStyle = STATUS_STYLES[doc.status];

            return (
              <div
                key={doc.id}
                className="group relative rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                {/* File icon + name */}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      ftConfig.bg
                    )}
                  >
                    <FTIcon className={cn("w-5 h-5", ftConfig.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.employee}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className={cn("text-[11px]", catStyle.className)}
                  >
                    {catStyle.label}
                  </Badge>
                  <SensitivityBadge level={doc.sensitivity} />
                  <Badge
                    variant="secondary"
                    className={cn("text-[11px]", statusStyle.className)}
                  >
                    {statusStyle.label}
                  </Badge>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(doc.uploadDate)}</span>
                  <span>{doc.size}</span>
                </div>

                {/* Hover actions */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 p-3 rounded-b-xl bg-gradient-to-t from-card via-card/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List / Table View */}
      {viewMode === "list" && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
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
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const ftConfig = FILE_TYPE_ICONS[doc.fileType] ?? {
                    icon: File,
                    color: "text-gray-600",
                    bg: "bg-gray-100",
                  };
                  const FTIcon = ftConfig.icon;
                  const catStyle = CATEGORY_STYLES[doc.category];
                  const statusStyle = STATUS_STYLES[doc.status];

                  return (
                    <tr
                      key={doc.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              ftConfig.bg
                            )}
                          >
                            <FTIcon
                              className={cn("w-4 h-4", ftConfig.color)}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden truncate">
                              {doc.employee}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">
                        {doc.employee}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Badge
                          variant="secondary"
                          className={cn("text-[11px]", catStyle.className)}
                        >
                          {catStyle.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={cn("text-[11px]", statusStyle.className)}
                        >
                          {statusStyle.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <SensitivityBadge level={doc.sensitivity} />
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm text-muted-foreground">
                        {formatDate(doc.uploadDate)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm text-muted-foreground">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
          <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
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
    <th className={cn("px-4 py-3 font-medium text-muted-foreground", className)}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
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
