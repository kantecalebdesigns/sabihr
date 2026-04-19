import type { LucideIcon } from "lucide-react";

// Template Types
export type DocumentTemplateType =
  | "OFFER_LETTER"
  | "CONFIRMATION_LETTER"
  | "CONTRACT"
  | "REFERENCE_LETTER"
  | "EMBASSY_LETTER"
  | "PROMOTION_LETTER"
  | "TERMINATION_LETTER"
  | "WARNING_LETTER"
  | "TWIMC"
  | "CUSTOM";

export type TemplateStatus = "draft" | "active" | "archived";

export type TemplatePermissionLevel = "all" | "hr_only" | "managers" | "custom";

export interface TemplateVariable {
  key: string;
  label: string;
  category: "employee" | "company" | "manager" | "date" | "custom";
  sampleValue: string;
}

export interface TemplateVersion {
  id: string;
  version: number;
  changelog: string;
  createdBy: string;
  createdAt: string;
  status: TemplateStatus;
}

export interface TemplatePermission {
  level: TemplatePermissionLevel;
  canGenerate: string[]; // role ids
  canEdit: string[]; // role ids
  canDelete: string[]; // role ids
  customRoles?: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentTemplateType;
  description: string;
  content: string;
  status: TemplateStatus;
  version: number;
  versions: TemplateVersion[];
  permissions: TemplatePermission;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  lastUsed: string | null;
  tags: string[];
}

// Generated Document Types
export type GeneratedDocumentStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "delivered";

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  employeeId: string;
  employeeName: string;
  status: GeneratedDocumentStatus;
  generatedBy: string;
  generatedAt: string;
  signedAt: string | null;
  deliveredAt: string | null;
  deliveredVia: "email" | "portal" | null;
  fileSize: string;
  version: number;
}

// Document Version History
export interface DocumentVersionEntry {
  id: string;
  documentId: string;
  version: number;
  action: "created" | "edited" | "signed" | "delivered" | "regenerated";
  performedBy: string;
  performedAt: string;
  changes: string;
  fileSize: string;
}

// File Upload
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface FileUploadError {
  code: "FILE_TOO_LARGE" | "INVALID_TYPE" | "UPLOAD_FAILED" | "QUOTA_EXCEEDED";
  message: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  status: UploadStatus;
  error?: FileUploadError;
}

// Storage Activity Log
export type StorageActivityType =
  | "upload"
  | "download"
  | "delete"
  | "generate"
  | "sign"
  | "deliver"
  | "archive"
  | "restore";

export interface StorageActivity {
  id: string;
  type: StorageActivityType;
  description: string;
  fileName: string;
  performedBy: string;
  performedAt: string;
  fileSize: string;
  metadata?: Record<string, string>;
}

// Template Builder
export interface TemplateBlock {
  id: string;
  type: "header" | "paragraph" | "variable" | "signature" | "date" | "spacer" | "divider" | "logo" | "table";
  content: string;
  variables?: string[];
  style?: {
    alignment?: "left" | "center" | "right";
    bold?: boolean;
    italic?: boolean;
    fontSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  };
}

// Template type config for UI
export interface TemplateTypeConfig {
  type: DocumentTemplateType;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// View mode for template library
export type LibraryViewMode = "grid" | "list";

// Filter for template library
export interface TemplateFilter {
  type: DocumentTemplateType | "all";
  status: TemplateStatus | "all";
  search: string;
}
