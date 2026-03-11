import { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_TEMPLATES,
  TEMPLATE_TYPE_CONFIGS,
  TEMPLATE_VARIABLES,
  DEFAULT_TEMPLATE_BLOCKS,
} from "@/lib/document-mock-data";
import type {
  TemplateBlock,
  UploadStatus,
  FileUploadError,
} from "@/types/document";
import {
  ArrowLeft,
  Edit,
  Copy,
  FileOutput,
  Eye,
  ToggleLeft,
  ToggleRight,
  Calendar,
  User,
  Hash,
  Tag,
  Clock,
  Shield,
  Check,
  X,
  Upload,
  File,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";

// ----- Types for local file upload state -----
interface UploadedFileLocal {
  id: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  error?: FileUploadError;
}

// ----- Permission role table data -----
const PERMISSION_ROLES = [
  { role: "Admin", key: "admin" },
  { role: "HR", key: "hr" },
  { role: "Manager", key: "manager" },
  { role: "Employee", key: "employee" },
];

const PERMISSION_LEVEL_LABELS: Record<string, string> = {
  all: "All Staff",
  hr_only: "HR Only",
  managers: "Managers & Above",
  custom: "Custom",
};

// ----- Accepted file extensions and limits -----
const ACCEPTED_DOC_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".csv"];
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const ALL_ACCEPTED = [...ACCEPTED_DOC_EXTENSIONS, ...ACCEPTED_IMAGE_EXTENSIONS];
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ----- Variable replacement helper -----
function replaceVariables(text: string, useSampleData: boolean): string {
  if (!useSampleData) return text;
  let result = text;
  for (const v of TEMPLATE_VARIABLES) {
    const pattern = new RegExp(`\\{\\{${v.key.replace(".", "\\.")}\\}\\}`, "g");
    result = result.replace(pattern, v.sampleValue);
  }
  return result;
}

// ----- File extension helper -----
function getFileExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

function isImageExtension(ext: string): boolean {
  return ACCEPTED_IMAGE_EXTENSIONS.includes(ext);
}

// ----- Block renderer -----
function renderBlock(block: TemplateBlock, useSampleData: boolean) {
  const alignment = block.style?.alignment ?? "left";
  const alignClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
        ? "text-right"
        : "text-left";

  switch (block.type) {
    case "header": {
      const fontSize = block.style?.fontSize ?? "xl";
      const Tag = fontSize === "xl" || fontSize === "2xl" ? "h2" : "h3";
      const sizeClass =
        fontSize === "2xl"
          ? "text-2xl"
          : fontSize === "xl"
            ? "text-xl"
            : fontSize === "lg"
              ? "text-lg"
              : "text-base";
      return (
        <Tag
          key={block.id}
          className={cn(sizeClass, "font-bold my-2", alignClass)}
        >
          {replaceVariables(block.content, useSampleData)}
        </Tag>
      );
    }

    case "paragraph": {
      const content = replaceVariables(block.content, useSampleData);
      const isBold = block.style?.bold;
      const isItalic = block.style?.italic;
      return (
        <p
          key={block.id}
          className={cn(
            "my-2 whitespace-pre-wrap text-sm leading-relaxed",
            alignClass,
            isBold && "font-bold",
            isItalic && "italic"
          )}
        >
          {useSampleData
            ? content
            : renderContentWithVariableChips(content)}
        </p>
      );
    }

    case "variable": {
      const content = replaceVariables(block.content, useSampleData);
      if (useSampleData) {
        return (
          <span key={block.id} className="text-sm">
            {content}
          </span>
        );
      }
      return (
        <span
          key={block.id}
          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium my-1"
        >
          {block.content}
        </span>
      );
    }

    case "signature": {
      return (
        <div key={block.id} className={cn("my-6", alignClass)}>
          <div className="inline-block min-w-[200px]">
            <div className="border-b border-gray-400 mb-2 h-10" />
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
              {replaceVariables(block.content, useSampleData)}
            </p>
          </div>
        </div>
      );
    }

    case "date": {
      return (
        <p
          key={block.id}
          className={cn("my-2 text-sm", alignClass)}
        >
          {replaceVariables(block.content, useSampleData)}
        </p>
      );
    }

    case "spacer":
      return <div key={block.id} className="h-6" />;

    case "divider":
      return <hr key={block.id} className="my-4 border-gray-300" />;

    case "logo": {
      return (
        <div key={block.id} className={cn("my-4", alignClass)}>
          <div className="inline-flex items-center justify-center w-24 h-16 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-muted-foreground">
            {useSampleData ? "[Logo]" : block.content}
          </div>
        </div>
      );
    }

    case "table": {
      return (
        <div key={block.id} className={cn("my-4", alignClass)}>
          <div className="border border-dashed border-gray-300 rounded p-4 text-xs text-muted-foreground text-center bg-gray-50">
            [Table Placeholder]
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// Render paragraph content with variable chips shown inline
function renderContentWithVariableChips(content: string) {
  const regex = /(\{\{[^}]+\}\})/g;
  const parts = content.split(regex);
  return parts.map((part, i) => {
    const varMatch = part.match(/^\{\{([^}]+)\}\}$/);
    if (varMatch) {
      const key = varMatch[1].trim();
      const variable = TEMPLATE_VARIABLES.find((v) => v.key === key);
      return (
        <span
          key={i}
          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-1.5 py-0 text-xs font-medium mx-0.5"
        >
          {variable?.label || key}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DocumentTemplateDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const template = MOCK_TEMPLATES.find((t) => t.id === id);
  const typeConfig = template
    ? TEMPLATE_TYPE_CONFIGS.find((c) => c.type === template.type)
    : undefined;

  const blocks: TemplateBlock[] = template
    ? DEFAULT_TEMPLATE_BLOCKS[template.type] ?? []
    : [];

  // Toggle between template variables and sample data
  const [showSampleData, setShowSampleData] = useState(false);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileLocal[]>([
    {
      id: "existing-1",
      name: "Company_Letterhead.png",
      size: 520000,
      type: "image/png",
      status: "success",
      progress: 100,
    },
    {
      id: "existing-2",
      name: "Appendix_A.pdf",
      size: 1240000,
      type: "application/pdf",
      status: "success",
      progress: 100,
    },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- File validation ---
  const validateFile = useCallback(
    (file: globalThis.File): FileUploadError | null => {
      const ext = getFileExtension(file.name);
      if (!ALL_ACCEPTED.includes(ext)) {
        return {
          code: "INVALID_TYPE",
          message: `File type "${ext}" is not supported. Accepted: ${ALL_ACCEPTED.join(", ")}`,
        };
      }
      const maxSize = isImageExtension(ext) ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
      if (file.size > maxSize) {
        return {
          code: "FILE_TOO_LARGE",
          message: `File exceeds ${isImageExtension(ext) ? "5MB" : "10MB"} limit (${formatFileSize(file.size)})`,
        };
      }
      if (uploadedFiles.length >= 10) {
        return {
          code: "QUOTA_EXCEEDED",
          message: "Maximum of 10 attachments allowed per template",
        };
      }
      return null;
    },
    [uploadedFiles.length]
  );

  // --- Handle file selection ---
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        const fileId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        if (error) {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              status: "error",
              progress: 0,
              error,
            },
          ]);
          return;
        }

        // Start uploading simulation
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading",
            progress: 0,
          },
        ]);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            // Simulate possible random failure (10% chance)
            const failed = Math.random() < 0.1;
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? {
                      ...f,
                      progress: 100,
                      status: failed ? "error" : "success",
                      error: failed
                        ? { code: "UPLOAD_FAILED" as const, message: "Upload failed. Please try again." }
                        : undefined,
                    }
                  : f
              )
            );
          } else {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f
              )
            );
          }
        }, 400);
      });
    },
    [validateFile]
  );

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // --- Not found ---
  if (!template || !typeConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Template Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The template you are looking for does not exist or has been removed.
        </p>
        <Button variant="outline" onClick={() => navigate("/documents/templates")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    );
  }

  const TypeIcon = typeConfig.icon;

  const statusVariant =
    template.status === "active"
      ? "default"
      : template.status === "draft"
        ? "secondary"
        : "outline";

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight">
                {template.name}
              </h1>
              <Badge className={cn(typeConfig.bgColor, typeConfig.color, "border-0")}>
                {typeConfig.label}
              </Badge>
              <Badge variant={statusVariant} className="capitalize">
                {template.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/documents/templates/${template.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-1.5" />
            Duplicate
          </Button>
          <Button size="sm">
            <FileOutput className="h-4 w-4 mr-1.5" />
            Generate
          </Button>
        </div>
      </div>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ----- LEFT COLUMN: Template Preview ----- */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Template Preview
            </div>
            <button
              type="button"
              onClick={() => setShowSampleData(!showSampleData)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSampleData ? (
                <ToggleRight className="h-5 w-5 text-primary" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
              {showSampleData ? "Sample Data" : "Template"}
            </button>
          </div>

          {/* A4 Paper */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-sm mx-auto max-w-[210mm] min-h-[297mm] p-12 sm:p-16">
            {blocks.map((block) => renderBlock(block, showSampleData))}
          </div>
        </div>

        {/* ----- RIGHT COLUMN: Metadata Cards ----- */}
        <div className="space-y-6">
          {/* 1. Template Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    typeConfig.bgColor
                  )}
                >
                  <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium">{typeConfig.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeConfig.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Created by</span>
                  <span className="ml-auto font-medium text-foreground">
                    {template.createdBy}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created</span>
                  <span className="ml-auto font-medium text-foreground">
                    {formatDate(template.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last updated</span>
                  <span className="ml-auto font-medium text-foreground">
                    {formatDate(template.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" />
                  <span>Usage count</span>
                  <span className="ml-auto font-medium text-foreground">
                    {template.usageCount} documents
                  </span>
                </div>
              </div>

              {template.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Version History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Version History</CardTitle>
              <CardAction>
                <Badge variant="outline" className="text-xs">
                  v{template.version}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {[...template.versions]
                  .sort((a, b) => b.version - a.version)
                  .map((version, idx, arr) => {
                    const isCurrent = version.version === template.version;
                    const isLast = idx === arr.length - 1;

                    return (
                      <div key={version.id} className="relative flex gap-3">
                        {/* Timeline line */}
                        {!isLast && (
                          <div className="absolute left-[9px] top-5 bottom-0 w-px bg-border" />
                        )}

                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "relative z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 flex items-center justify-center",
                            isCurrent
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30 bg-background"
                          )}
                        >
                          {isCurrent && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={cn(
                            "pb-5 flex-1 min-w-0",
                            !isCurrent && "opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">
                              v{version.version}
                            </span>
                            <Badge
                              variant={
                                version.status === "active"
                                  ? "default"
                                  : version.status === "draft"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-[10px] capitalize px-1.5 py-0"
                            >
                              {version.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {version.changelog}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {version.createdBy} &middot;{" "}
                            {formatDateTime(version.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* 3. Permission Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Permission Settings</CardTitle>
              <CardAction>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {PERMISSION_LEVEL_LABELS[template.permissions.level] ??
                    template.permissions.level}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Generate
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Edit
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSION_ROLES.map((pr) => (
                      <tr key={pr.key} className="border-b last:border-0">
                        <td className="py-2 font-medium">{pr.role}</td>
                        <td className="py-2 text-center">
                          {template.permissions.canGenerate.includes(pr.key) ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600 inline-block" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground/40 inline-block" />
                          )}
                        </td>
                        <td className="py-2 text-center">
                          {template.permissions.canEdit.includes(pr.key) ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600 inline-block" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground/40 inline-block" />
                          )}
                        </td>
                        <td className="py-2 text-center">
                          {template.permissions.canDelete.includes(pr.key) ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600 inline-block" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground/40 inline-block" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 4. File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Attachments</CardTitle>
              <CardAction>
                <span className="text-xs text-muted-foreground">
                  {uploadedFiles.filter((f) => f.status === "success").length}{" "}
                  files
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, XLSX, CSV (max 10MB) &middot; JPG, PNG (max 5MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALL_ACCEPTED.join(",")}
                  multiple
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-sm",
                        file.status === "error" && "border-red-200 bg-red-50",
                        file.status === "success" &&
                          "border-border bg-background"
                      )}
                    >
                      {/* Icon */}
                      {file.status === "uploading" ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      ) : file.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : file.status === "error" ? (
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      ) : (
                        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}

                      {/* Name and meta */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-xs">
                          {file.name}
                        </p>
                        {file.status === "uploading" ? (
                          <div className="mt-1.5">
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${Math.round(file.progress)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {Math.round(file.progress)}% uploaded
                            </p>
                          </div>
                        ) : file.status === "error" && file.error ? (
                          <p className="text-[10px] text-red-600 mt-0.5">
                            {file.error.message}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
