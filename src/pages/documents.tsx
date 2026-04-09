import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Filter,
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

const ACTIVITY_ICON_MAP: Record<
  StorageActivityType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  upload: { icon: Upload, color: "text-blue-600", bg: "bg-blue-100" },
  download: { icon: Download, color: "text-cyan-600", bg: "bg-cyan-100" },
  delete: { icon: Trash2, color: "text-red-600", bg: "bg-red-100" },
  generate: { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
  sign: { icon: FileSignature, color: "text-violet-600", bg: "bg-violet-100" },
  deliver: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  archive: { icon: Archive, color: "text-amber-600", bg: "bg-amber-100" },
  restore: { icon: RotateCcw, color: "text-green-600", bg: "bg-green-100" },
};

const DOC_STATUS_STYLES: Record<
  GeneratedDocumentStatus,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  pending_signature: {
    label: "Pending Signature",
    className: "bg-amber-50 text-amber-700",
  },
  signed: { label: "Signed", className: "bg-blue-50 text-blue-700" },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700" },
};

const TEMPLATE_STATUS_STYLES: Record<
  TemplateStatus,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700" },
  archived: { label: "Archived", className: "bg-amber-50 text-amber-700" },
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
    return MOCK_STORAGE_ACTIVITIES.filter(
      (a) => a.type === activityTypeFilter
    );
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

  const tabs: { key: TabType; label: string }[] = [
    { key: "templates", label: "Templates" },
    { key: "generated", label: "Generated Documents" },
    { key: "activity", label: "Activity Log" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Document Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage templates, generate documents, and track activity
          </p>
        </div>
        {activeTab === "templates" && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => navigate("/documents/templates/new")}
          >
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
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
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search templates..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="pl-9"
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 ml-auto border border-[#efefef] rounded-lg p-0.5">
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

      {/* Results count */}
      <p className="text-sm text-slate-500">
        {templates.length} template{templates.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl) => {
            const typeConfig = getTemplateTypeConfig(tpl.type);
            const statusStyle = TEMPLATE_STATUS_STYLES[tpl.status];
            const TypeIcon = typeConfig?.icon ?? FileText;

            return (
              <Card
                key={tpl.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/documents/templates/${tpl.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        typeConfig?.bgColor ?? "bg-gray-100"
                      )}
                    >
                      <TypeIcon
                        className={cn(
                          "w-5 h-5",
                          typeConfig?.color ?? "text-gray-600"
                        )}
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-[11px]", statusStyle.className)}
                    >
                      {statusStyle.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-3">
                    {tpl.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {tpl.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>v{tpl.version}</span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {tpl.usageCount} uses
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    Last used: {formatDate(tpl.lastUsed)}
                  </div>
                  {tpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tpl.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border border-[#efefef] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden md:table-cell">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">
                  Version
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">
                  Usage
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden xl:table-cell">
                  Last Used
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => {
                const typeConfig = getTemplateTypeConfig(tpl.type);
                const statusStyle = TEMPLATE_STATUS_STYLES[tpl.status];
                const TypeIcon = typeConfig?.icon ?? FileText;

                return (
                  <tr
                    key={tpl.id}
                    className="border-t border-[#efefef] hover:bg-[#f8fafc] cursor-pointer transition-colors"
                    onClick={() => navigate(`/documents/templates/${tpl.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            typeConfig?.bgColor ?? "bg-gray-100"
                          )}
                        >
                          <TypeIcon
                            className={cn(
                              "w-4 h-4",
                              typeConfig?.color ?? "text-gray-600"
                            )}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tpl.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-500">
                      {typeConfig?.label ?? tpl.type}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={cn("text-[11px]", statusStyle.className)}
                      >
                        {statusStyle.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-500">
                      v{tpl.version}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-500">
                      {tpl.usageCount}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-500">
                      {formatDate(tpl.lastUsed)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {templates.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <FileText className="w-10 h-10 text-slate-500/30 mb-3" />
          <p className="text-sm text-slate-500">
            No templates match your filters
          </p>
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
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {documents.length} generated document
        {documents.length !== 1 ? "s" : ""}
      </p>

      <div className="border border-[#efefef] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">
                Employee
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden md:table-cell">
                Template
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">
                Generated By
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 hidden xl:table-cell">
                File Size
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const statusStyle = DOC_STATUS_STYLES[doc.status];

              return (
                <tr
                  key={doc.id}
                  className="border-t border-[#efefef] hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{doc.employeeName}</p>
                      <p className="text-xs text-slate-500 md:hidden">
                        {doc.templateName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-500">
                    {doc.templateName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={cn("text-[11px]", statusStyle.className)}
                    >
                      {statusStyle.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-500">
                    {doc.generatedBy}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-500">
                    {formatDate(doc.generatedAt)}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-500">
                    {doc.fileSize}
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
                      {doc.status === "signed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Deliver"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {documents.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <FileText className="w-10 h-10 text-slate-500/30 mb-3" />
          <p className="text-sm text-slate-500">
            No documents generated yet
          </p>
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
  const activityTypes: { value: StorageActivityType | "all"; label: string }[] =
    [
      { value: "all", label: "All Activities" },
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
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select
          value={activityTypeFilter}
          onValueChange={(val) =>
            setActivityTypeFilter(val as StorageActivityType | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Activities" />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((at) => (
              <SelectItem key={at.value} value={at.value}>
                {at.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500 ml-auto">
          {activities.length} activit{activities.length !== 1 ? "ies" : "y"}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {activities.map((activity) => {
          const config = ACTIVITY_ICON_MAP[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-[#efefef] hover:shadow-sm transition-all"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  config.bg
                )}
              >
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activity.fileName}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-[11px] text-slate-500/60">
                    {activity.performedBy}
                  </p>
                  <span className="text-[11px] text-slate-500/40">
                    |
                  </span>
                  <p className="text-[11px] text-slate-500/60">
                    {formatDateTime(activity.performedAt)}
                  </p>
                  <span className="text-[11px] text-slate-500/40">
                    |
                  </span>
                  <p className="text-[11px] text-slate-500/60">
                    {activity.fileSize}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Clock className="w-10 h-10 text-slate-500/30 mb-3" />
          <p className="text-sm text-slate-500">
            No activity to show
          </p>
        </div>
      )}
    </div>
  );
}
