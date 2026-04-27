import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Grid3X3,
  List,
  Plus,
  Search,
  FileText,
  Eye,
  Download,
  Send,
  MoreHorizontal,
  Clock,
  Upload,
  Trash2,
  Archive,
  RotateCcw,
  FileSignature,
  Files,
  CheckCircle2,
  PenLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MOCK_TEMPLATES,
  MOCK_GENERATED_DOCUMENTS,
  MOCK_STORAGE_ACTIVITIES,
  TEMPLATE_TYPE_CONFIGS,
} from "@/lib/document-mock-data";
import type {
  DocumentTemplate,
  GeneratedDocument,
  StorageActivity,
  LibraryViewMode,
  TemplateFilter,
  DocumentTemplateType,
  TemplateStatus,
  GeneratedDocumentStatus,
  StorageActivityType,
} from "@/types/document";

type TabType = "templates" | "generated" | "activity";

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ACTIVITY_ICON_MAP: Record<
  StorageActivityType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  upload: { icon: Upload, color: "text-blue-600", bg: "bg-blue-50" },
  download: { icon: Download, color: "text-cyan-600", bg: "bg-cyan-50" },
  delete: { icon: Trash2, color: "text-rose-600", bg: "bg-rose-50" },
  generate: { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
  sign: { icon: FileSignature, color: "text-violet-600", bg: "bg-violet-50" },
  deliver: { icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
  archive: { icon: Archive, color: "text-amber-600", bg: "bg-amber-50" },
  restore: { icon: RotateCcw, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const DOC_STATUS_PILL: Record<
  GeneratedDocumentStatus,
  { label: string; cls: string; dot: string }
> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  pending_signature: {
    label: "Pending signature",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  signed: { label: "Signed", cls: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  delivered: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const TEMPLATE_STATUS_PILL: Record<
  TemplateStatus,
  { label: string; cls: string; dot: string }
> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  active: {
    label: "Active",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
};

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("templates");
  const [viewMode, setViewMode] = useState<LibraryViewMode>("grid");
  const [filter, setFilter] = useState<TemplateFilter>({
    type: "all",
    status: "all",
    search: "",
  });
  const [activityTypeFilter, setActivityTypeFilter] = useState<
    StorageActivityType | "all"
  >("all");

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((tpl) => {
      if (
        filter.search &&
        !tpl.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !tpl.description.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false;
      }
      if (filter.type !== "all" && tpl.type !== filter.type) {
        return false;
      }
      if (filter.status !== "all" && tpl.status !== filter.status) {
        return false;
      }
      return true;
    });
  }, [filter]);

  const filteredActivities = useMemo(() => {
    if (activityTypeFilter === "all") return MOCK_STORAGE_ACTIVITIES;
    return MOCK_STORAGE_ACTIVITIES.filter((a) => a.type === activityTypeFilter);
  }, [activityTypeFilter]);

  function getTemplateTypeConfig(type: DocumentTemplateType) {
    return TEMPLATE_TYPE_CONFIGS.find((c) => c.type === type);
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // KPI metrics
  const totalTemplates = MOCK_TEMPLATES.length;
  const activeTemplates = MOCK_TEMPLATES.filter((t) => t.status === "active").length;
  const generatedThisMonth = MOCK_GENERATED_DOCUMENTS.filter((d) => {
    const ts = new Date(d.generatedAt);
    const now = new Date();
    return (
      ts.getFullYear() === now.getFullYear() && ts.getMonth() === now.getMonth()
    );
  }).length;
  const pendingSignatures = MOCK_GENERATED_DOCUMENTS.filter(
    (d) => d.status === "pending_signature"
  ).length;

  const kpis = [
    { label: "Total Templates", value: totalTemplates, icon: Files },
    { label: "Active Templates", value: activeTemplates, icon: CheckCircle2 },
    { label: "Generated This Month", value: generatedThisMonth, icon: FileText },
    { label: "Pending Signatures", value: pendingSignatures, icon: PenLine },
  ];

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "templates", label: "Templates", count: MOCK_TEMPLATES.length },
    {
      key: "generated",
      label: "Generated documents",
      count: MOCK_GENERATED_DOCUMENTS.length,
    },
    {
      key: "activity",
      label: "Activity log",
      count: MOCK_STORAGE_ACTIVITIES.length,
    },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Document Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage templates, generate documents, and track activity across your
            organization.
          </p>
        </div>
        {activeTab === "templates" && (
          <Button
            onClick={() => navigate("/documents/templates/new")}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create template
          </Button>
        )}
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
        {tabs.map((t) => {
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
              {t.label}
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
      {activeTab === "templates" && (
        <TemplatesTab
          templates={filteredTemplates}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filter={filter}
          setFilter={setFilter}
          getTemplateTypeConfig={getTemplateTypeConfig}
          formatDate={formatDate}
          navigate={navigate}
        />
      )}

      {activeTab === "generated" && (
        <GeneratedDocumentsTab
          documents={MOCK_GENERATED_DOCUMENTS}
          formatDate={formatDate}
        />
      )}

      {activeTab === "activity" && (
        <ActivityLogTab
          activities={filteredActivities}
          activityTypeFilter={activityTypeFilter}
          setActivityTypeFilter={setActivityTypeFilter}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

/* ─── Templates Tab ─── */

function TemplatesTab({
  templates,
  viewMode,
  setViewMode,
  filter,
  setFilter,
  getTemplateTypeConfig,
  formatDate,
  navigate,
}: {
  templates: DocumentTemplate[];
  viewMode: LibraryViewMode;
  setViewMode: (v: LibraryViewMode) => void;
  filter: TemplateFilter;
  setFilter: (f: TemplateFilter) => void;
  getTemplateTypeConfig: (
    t: DocumentTemplateType
  ) => ReturnType<typeof TEMPLATE_TYPE_CONFIGS.find>;
  formatDate: (d: string | null) => string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className={cn(CARD_SHELL, "overflow-hidden")}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-200/70">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="pl-9 h-10"
          />
        </div>

        <Select
          value={filter.type}
          onValueChange={(val) =>
            setFilter({
              ...filter,
              type: val as DocumentTemplateType | "all",
            })
          }
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TEMPLATE_TYPE_CONFIGS.map((cfg) => (
              <SelectItem key={cfg.type} value={cfg.type}>
                {cfg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.status}
          onValueChange={(val) =>
            setFilter({ ...filter, status: val as TemplateStatus | "all" })
          }
        >
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 sm:ml-auto">
          <span className="text-sm text-slate-500 mr-2">
            {templates.length} template{templates.length !== 1 ? "s" : ""}
          </span>
          <div className="inline-flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "w-8 h-8 rounded-md transition-colors inline-flex items-center justify-center",
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "w-8 h-8 rounded-md transition-colors inline-flex items-center justify-center",
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {templates.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            No templates match your filters
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl) => {
            const typeConfig = getTemplateTypeConfig(tpl.type);
            const statusPill = TEMPLATE_STATUS_PILL[tpl.status];
            const TypeIcon = typeConfig?.icon ?? FileText;

            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => navigate(`/documents/templates/${tpl.id}`)}
                className="text-left rounded-xl border border-slate-200/70 bg-white px-5 py-5 transition-colors hover:border-slate-300 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <TypeIcon className="w-[18px] h-[18px] text-blue-600" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                      statusPill.cls
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", statusPill.dot)}
                    />
                    {statusPill.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span className="font-medium text-slate-700">v{tpl.version}</span>
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {tpl.usageCount} uses
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(tpl.lastUsed)}
                  </span>
                </div>

                {tpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                  Name
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden md:table-cell">
                  Type
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Status
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden lg:table-cell">
                  Version
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden lg:table-cell">
                  Usage
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden xl:table-cell">
                  Last used
                </th>
                <th className="w-12 py-3 pr-5" />
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => {
                const typeConfig = getTemplateTypeConfig(tpl.type);
                const statusPill = TEMPLATE_STATUS_PILL[tpl.status];
                const TypeIcon = typeConfig?.icon ?? FileText;

                return (
                  <tr
                    key={tpl.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 cursor-pointer transition-colors"
                    onClick={() => navigate(`/documents/templates/${tpl.id}`)}
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <TypeIcon className="w-[18px] h-[18px] text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {tpl.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 leading-tight mt-0.5">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5 hidden md:table-cell text-sm text-slate-700">
                      {typeConfig?.label ?? tpl.type}
                    </td>
                    <td className="py-4 pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          statusPill.cls
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", statusPill.dot)}
                        />
                        {statusPill.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 hidden lg:table-cell text-sm text-slate-700 tabular-nums">
                      v{tpl.version}
                    </td>
                    <td className="py-4 pr-5 hidden lg:table-cell text-sm text-slate-700 tabular-nums">
                      {tpl.usageCount}
                    </td>
                    <td className="py-4 pr-5 hidden xl:table-cell text-sm text-slate-500">
                      {formatDate(tpl.lastUsed)}
                    </td>
                    <td className="py-4 pr-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Generated Documents Tab ─── */

function GeneratedDocumentsTab({
  documents,
  formatDate,
}: {
  documents: GeneratedDocument[];
  formatDate: (d: string | null) => string;
}) {
  return (
    <div className={cn(CARD_SHELL, "overflow-hidden")}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Generated documents
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Letters and contracts generated from your templates.
          </p>
        </div>
        <span className="text-sm text-slate-500">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <p className="mt-3 text-sm text-slate-500">No documents generated yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                  Employee
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden md:table-cell">
                  Template
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Status
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden lg:table-cell">
                  Generated by
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden xl:table-cell">
                  File size
                </th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const statusPill = DOC_STATUS_PILL[doc.status];

                return (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0",
                            avatarColor(doc.id)
                          )}
                        >
                          {initials(doc.employeeName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {doc.employeeName}
                          </p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5 md:hidden">
                            {doc.templateName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5 hidden md:table-cell text-sm text-slate-700">
                      {doc.templateName}
                    </td>
                    <td className="py-4 pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          statusPill.cls
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", statusPill.dot)}
                        />
                        {statusPill.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 hidden lg:table-cell text-sm text-slate-700">
                      {doc.generatedBy}
                    </td>
                    <td className="py-4 pr-5 hidden lg:table-cell text-sm text-slate-500">
                      {formatDate(doc.generatedAt)}
                    </td>
                    <td className="py-4 pr-5 hidden xl:table-cell text-sm text-slate-500">
                      {doc.fileSize}
                    </td>
                    <td className="py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {doc.status === "signed" && (
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md text-blue-600 hover:bg-blue-50 inline-flex items-center justify-center"
                            aria-label="Deliver"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Activity Log Tab ─── */

function ActivityLogTab({
  activities,
  activityTypeFilter,
  setActivityTypeFilter,
  formatDateTime,
}: {
  activities: StorageActivity[];
  activityTypeFilter: StorageActivityType | "all";
  setActivityTypeFilter: (v: StorageActivityType | "all") => void;
  formatDateTime: (d: string) => string;
}) {
  const activityTypes: { value: StorageActivityType | "all"; label: string }[] = [
    { value: "all", label: "All activities" },
    { value: "upload", label: "Upload" },
    { value: "download", label: "Download" },
    { value: "delete", label: "Delete" },
    { value: "generate", label: "Generate" },
    { value: "sign", label: "Sign" },
    { value: "deliver", label: "Deliver" },
    { value: "archive", label: "Archive" },
    { value: "restore", label: "Restore" },
  ];

  return (
    <div className={cn(CARD_SHELL, "overflow-hidden")}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Activity log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of every action across your document storage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={activityTypeFilter}
            onValueChange={(val) =>
              setActivityTypeFilter(val as StorageActivityType | "all")
            }
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="All activities" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((at) => (
                <SelectItem key={at.value} value={at.value}>
                  {at.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500 shrink-0">
            {activities.length} record{activities.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {activities.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <p className="mt-3 text-sm text-slate-500">No activity to show</p>
        </div>
      ) : (
        <div>
          {activities.map((activity) => {
            const config = ACTIVITY_ICON_MAP[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-[18px] h-[18px]", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-tight">
                    {activity.fileName}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="text-[11px] text-slate-500">
                      {activity.performedBy}
                    </span>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">
                      {formatDateTime(activity.performedAt)}
                    </span>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">
                      {activity.fileSize}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
