import type { LucideIcon } from "lucide-react";

// --- Core Enums ---
export type AssetStatus = "available" | "assigned" | "maintenance" | "disposed" | "missing";
export type AssetCondition = "new" | "good" | "fair" | "poor" | "damaged" | "non-functional";
export type DepreciationMethod = "straight-line" | "declining-balance" | "units-of-production";
export type DisposalMethod = "sold" | "donated" | "scrapped" | "recycled";
export type AssignmentStatus = "active" | "returned" | "transferred";
export type ReturnReason = "no-longer-needed" | "upgrade" | "leaving" | "damaged";
export type RequestUrgency = "standard" | "urgent";
export type RequestStatus = "submitted" | "manager-approved" | "it-processing" | "ready-for-pickup" | "rejected";
export type ReturnStatus = "submitted" | "collection-scheduled" | "returned" | "completed";
export type MaintenanceType = "preventive" | "corrective" | "inspection" | "upgrade";
export type IssueType = "damaged" | "malfunctioning" | "lost" | "stolen";
export type ApprovalStatus = "pending" | "approved" | "rejected";

// --- Category ---
export interface AssetSubCategory {
  id: string;
  name: string;
  assetCount: number;
}

export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  assetCount: number;
  defaultDepreciationMethod: DepreciationMethod;
  defaultUsefulLife: number; // months
  defaultMaintenanceFrequency: number; // months
  subCategories: AssetSubCategory[];
}

// --- Asset ---
export interface Asset {
  id: string;
  name: string;
  tag: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  status: AssetStatus;
  condition: AssetCondition;
  location: string;
  branch: string;
  assignedTo: string | null;
  assignedToName: string | null;
  assignedDate: string | null;
  // Purchase
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  warrantyExpiry: string | null;
  warrantyProvider: string;
  // Specs
  model: string;
  serialNumber: string;
  specifications: Record<string, string>;
  // Depreciation
  depreciationMethod: DepreciationMethod;
  usefulLifeMonths: number;
  currentBookValue: number;
  salvageValue: number;
  // Media
  photos: string[];
  documents: AssetDocument[];
  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: "invoice" | "warranty" | "manual" | "other";
  fileName: string;
  uploadDate: string;
  size: string;
}

// --- Assignment ---
export interface AssignmentRecord {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  employeeId: string;
  employeeName: string;
  department: string;
  assignedBy: string;
  assignedDate: string;
  returnedDate: string | null;
  status: AssignmentStatus;
  notes: string;
  acknowledged: boolean;
  acknowledgedDate: string | null;
}

// --- Assignment Request (Approval Queue) ---
export interface AssignmentApproval {
  id: string;
  assetId: string;
  assetName: string;
  assetPhoto: string;
  categoryName: string;
  requestedBy: string;
  targetEmployee: string;
  targetDepartment: string;
  requestDate: string;
  urgency: RequestUrgency;
  status: ApprovalStatus;
  comment: string;
  slaDeadline: string;
}

// --- Transfer ---
export interface AssetTransfer {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  reason: string;
  transferDate: string;
  conditionAtTransfer: AssetCondition;
  approvalStatus: ApprovalStatus;
  approvedBy: string | null;
}

// --- Return ---
export interface ReturnRequest {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  assetPhoto: string;
  employeeId: string;
  employeeName: string;
  reason: ReturnReason;
  selfAssessedCondition: AssetCondition;
  proposedDate: string;
  submittedDate: string;
  status: ReturnStatus;
  branch: string;
  categoryName: string;
}

// --- Condition History ---
export interface ConditionEntry {
  id: string;
  assetId: string;
  condition: AssetCondition;
  previousCondition: AssetCondition;
  notes: string;
  photos: string[];
  assessedBy: string;
  assessedDate: string;
}

// --- Maintenance ---
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: MaintenanceType;
  description: string;
  vendor: string;
  cost: number;
  date: string;
  nextDueDate: string | null;
  isRecurring: boolean;
  recurringFrequencyMonths: number | null;
  status: "scheduled" | "in-progress" | "completed" | "overdue";
}

export type MaintenanceRequestStatus = "pending" | "approved" | "rejected" | "scheduled";
export type MaintenanceRequestUrgency = "low" | "normal" | "high";

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  employeeId: string;
  employeeName: string;
  type: MaintenanceType;
  urgency: MaintenanceRequestUrgency;
  description: string;
  preferredDate: string | null;
  submittedAt: string;
  status: MaintenanceRequestStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

// --- Depreciation ---
export interface DepreciationEntry {
  period: string;
  openingValue: number;
  charge: number;
  accumulated: number;
  closingValue: number;
}

// --- Disposal ---
export interface DisposalRecord {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  method: DisposalMethod;
  disposalValue: number;
  bookValueAtDisposal: number;
  reason: string;
  buyerOrRecipient: string;
  disposalDate: string;
  approvalStatus: ApprovalStatus;
  approvedBy: string | null;
  certificateGenerated: boolean;
}

// --- Employee Asset Request ---
export interface AssetRequest {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  categoryId: string;
  categoryName: string;
  justification: string;
  urgency: RequestUrgency;
  preferredSpecs: string;
  manager: string;
  requestDate: string;
  status: RequestStatus;
  expectedDelivery: string | null;
  comments: { by: string; text: string; date: string }[];
}

// --- Damage/Loss Report ---
export interface DamageReport {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  employeeId: string;
  employeeName: string;
  issueType: IssueType;
  description: string;
  incidentDate: string;
  reportedDate: string;
  photos: string[];
  status: "submitted" | "under-investigation" | "resolved" | "closed";
  resolution: string;
}

// --- Warranty ---
export interface WarrantyInfo {
  assetId: string;
  assetName: string;
  assetTag: string;
  provider: string;
  coverage: string;
  startDate: string;
  endDate: string;
  claimContact: string;
  claims: WarrantyClaim[];
}

export interface WarrantyClaim {
  id: string;
  submissionDate: string;
  description: string;
  status: "submitted" | "in-progress" | "resolved" | "rejected";
  resolution: string;
}

// --- UI Configs ---
export interface AssetCategoryConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// --- Notification ---
export type AssetNotificationType =
  | "assignment"
  | "return-reminder"
  | "damage-update"
  | "request-status"
  | "maintenance-due"
  | "warranty-expiry";

export interface AssetNotification {
  id: string;
  type: AssetNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  assetId: string;
  actionUrl: string;
}
