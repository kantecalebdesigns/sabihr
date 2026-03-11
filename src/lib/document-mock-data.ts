import {
  FileText,
  FileSignature,
  ScrollText,
  Plane,
  TrendingUp,
  UserX,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type {
  DocumentTemplate,
  TemplateVariable,
  TemplateTypeConfig,
  GeneratedDocument,
  DocumentVersionEntry,
  StorageActivity,
  TemplateBlock,
} from "@/types/document";

// --- Template Type Configs ---
export const TEMPLATE_TYPE_CONFIGS: TemplateTypeConfig[] = [
  { type: "OFFER_LETTER", label: "Offer Letter", description: "Employment offer letters for new hires", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
  { type: "CONTRACT", label: "Employment Contract", description: "Formal employment agreements", icon: FileSignature, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { type: "REFERENCE_LETTER", label: "Reference Letter", description: "Employee reference and recommendation letters", icon: ScrollText, color: "text-violet-600", bgColor: "bg-violet-50" },
  { type: "EMBASSY_LETTER", label: "Embassy Letter", description: "Employment verification for visa applications", icon: Plane, color: "text-amber-600", bgColor: "bg-amber-50" },
  { type: "PROMOTION_LETTER", label: "Promotion Letter", description: "Employee promotion announcements", icon: TrendingUp, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { type: "TERMINATION_LETTER", label: "Termination Letter", description: "Employment termination notices", icon: UserX, color: "text-red-600", bgColor: "bg-red-50" },
  { type: "WARNING_LETTER", label: "Warning Letter", description: "Disciplinary warning notices", icon: AlertTriangle, color: "text-amber-600", bgColor: "bg-amber-50" },
  { type: "TWIMC", label: "To Whom It May Concern", description: "General purpose verification letters", icon: HelpCircle, color: "text-slate-600", bgColor: "bg-slate-50" },
  { type: "CUSTOM", label: "Custom Template", description: "Create your own template from scratch", icon: Sparkles, color: "text-primary", bgColor: "bg-primary/10" },
];

// --- Template Variables ---
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Employee
  { key: "employee.firstName", label: "First Name", category: "employee", sampleValue: "Adebayo" },
  { key: "employee.lastName", label: "Last Name", category: "employee", sampleValue: "Ogunlesi" },
  { key: "employee.fullName", label: "Full Name", category: "employee", sampleValue: "Adebayo Ogunlesi" },
  { key: "employee.jobTitle", label: "Job Title", category: "employee", sampleValue: "Senior Software Engineer" },
  { key: "employee.department", label: "Department", category: "employee", sampleValue: "Engineering" },
  { key: "employee.employeeId", label: "Employee ID", category: "employee", sampleValue: "EMP-0042" },
  { key: "employee.startDate", label: "Start Date", category: "employee", sampleValue: "March 1, 2026" },
  { key: "employee.salary", label: "Salary", category: "employee", sampleValue: "₦850,000.00" },
  { key: "employee.email", label: "Work Email", category: "employee", sampleValue: "adebayo.ogunlesi@company.com" },
  { key: "employee.phone", label: "Phone", category: "employee", sampleValue: "+234 801 234 5678" },
  { key: "employee.address", label: "Address", category: "employee", sampleValue: "12 Admiralty Way, Lekki, Lagos" },
  // Company
  { key: "company.name", label: "Company Name", category: "company", sampleValue: "SoftGEM Technologies Ltd" },
  { key: "company.address", label: "Company Address", category: "company", sampleValue: "42 Marina Street, Victoria Island, Lagos" },
  { key: "company.email", label: "Company Email", category: "company", sampleValue: "hr@softgem.com" },
  { key: "company.phone", label: "Company Phone", category: "company", sampleValue: "+234 1 234 5678" },
  { key: "company.rcNumber", label: "RC Number", category: "company", sampleValue: "RC 123456" },
  { key: "company.logo", label: "Company Logo", category: "company", sampleValue: "[Logo]" },
  // Manager
  { key: "manager.name", label: "Manager Name", category: "manager", sampleValue: "Chioma Nwosu" },
  { key: "manager.title", label: "Manager Title", category: "manager", sampleValue: "Engineering Manager" },
  { key: "manager.email", label: "Manager Email", category: "manager", sampleValue: "chioma.nwosu@company.com" },
  // Date
  { key: "currentDate", label: "Current Date", category: "date", sampleValue: "March 11, 2026" },
  { key: "currentYear", label: "Current Year", category: "date", sampleValue: "2026" },
];

// --- Default Template Blocks per Type ---
export const OFFER_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "ol-1", type: "logo", content: "{{company.logo}}", style: { alignment: "center" } },
  { id: "ol-2", type: "header", content: "OFFER OF EMPLOYMENT", style: { alignment: "center", fontSize: "xl", bold: true } },
  { id: "ol-3", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "ol-4", type: "paragraph", content: "Dear {{employee.fullName}},", style: { bold: false } },
  { id: "ol-5", type: "paragraph", content: "We are pleased to offer you the position of {{employee.jobTitle}} in the {{employee.department}} department at {{company.name}}. We were impressed with your qualifications and believe you will make a significant contribution to our team." },
  { id: "ol-6", type: "paragraph", content: "Your employment will commence on {{employee.startDate}}. You will report to {{manager.name}}, {{manager.title}}." },
  { id: "ol-7", type: "paragraph", content: "Your starting salary will be {{employee.salary}} per annum, payable monthly. This is subject to statutory deductions including PAYE, Pension, NHF, and other applicable deductions." },
  { id: "ol-8", type: "paragraph", content: "This offer is contingent upon successful completion of background verification and submission of all required documentation." },
  { id: "ol-9", type: "paragraph", content: "Please confirm your acceptance by signing and returning this letter by {{currentDate}}." },
  { id: "ol-10", type: "spacer", content: "" },
  { id: "ol-11", type: "paragraph", content: "Yours sincerely," },
  { id: "ol-12", type: "signature", content: "HR Manager\n{{company.name}}" },
  { id: "ol-13", type: "divider", content: "" },
  { id: "ol-14", type: "paragraph", content: "I, {{employee.fullName}}, accept this offer of employment.", style: { italic: true } },
  { id: "ol-15", type: "signature", content: "Employee Signature\nDate: _______________" },
];

export const CONTRACT_BLOCKS: TemplateBlock[] = [
  { id: "ct-1", type: "logo", content: "{{company.logo}}", style: { alignment: "center" } },
  { id: "ct-2", type: "header", content: "EMPLOYMENT CONTRACT", style: { alignment: "center", fontSize: "xl", bold: true } },
  { id: "ct-3", type: "paragraph", content: "This Employment Contract (\"Agreement\") is entered into on {{currentDate}} between:" },
  { id: "ct-4", type: "paragraph", content: "{{company.name}}, a company registered under the laws of the Federal Republic of Nigeria with RC Number {{company.rcNumber}}, having its registered office at {{company.address}} (hereinafter referred to as the \"Employer\")", style: { bold: true } },
  { id: "ct-5", type: "paragraph", content: "AND" , style: { alignment: "center", bold: true } },
  { id: "ct-6", type: "paragraph", content: "{{employee.fullName}}, residing at {{employee.address}} (hereinafter referred to as the \"Employee\")", style: { bold: true } },
  { id: "ct-7", type: "header", content: "1. POSITION AND DUTIES", style: { fontSize: "base", bold: true } },
  { id: "ct-8", type: "paragraph", content: "The Employee is hired as {{employee.jobTitle}} in the {{employee.department}} department. The Employee shall report to {{manager.name}} and perform duties as reasonably assigned." },
  { id: "ct-9", type: "header", content: "2. COMMENCEMENT DATE", style: { fontSize: "base", bold: true } },
  { id: "ct-10", type: "paragraph", content: "Employment shall commence on {{employee.startDate}} and shall continue until terminated in accordance with this Agreement." },
  { id: "ct-11", type: "header", content: "3. REMUNERATION", style: { fontSize: "base", bold: true } },
  { id: "ct-12", type: "paragraph", content: "The Employee shall receive an annual gross salary of {{employee.salary}}, paid monthly in arrears. Statutory deductions (PAYE, Pension, NHF) shall apply." },
  { id: "ct-13", type: "header", content: "4. WORKING HOURS", style: { fontSize: "base", bold: true } },
  { id: "ct-14", type: "paragraph", content: "The standard working hours are Monday to Friday, 9:00 AM to 5:00 PM, with a one-hour lunch break." },
  { id: "ct-15", type: "header", content: "5. PROBATION", style: { fontSize: "base", bold: true } },
  { id: "ct-16", type: "paragraph", content: "The Employee shall be on probation for a period of six (6) months from the commencement date." },
  { id: "ct-17", type: "spacer", content: "" },
  { id: "ct-18", type: "signature", content: "For and on behalf of {{company.name}}\n\nName: _______________\nTitle: HR Manager\nDate: _______________" },
  { id: "ct-19", type: "signature", content: "Employee\n\nName: {{employee.fullName}}\nDate: _______________" },
];

export const REFERENCE_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "rl-1", type: "logo", content: "{{company.logo}}", style: { alignment: "left" } },
  { id: "rl-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "rl-3", type: "header", content: "LETTER OF REFERENCE", style: { alignment: "center", fontSize: "xl", bold: true } },
  { id: "rl-4", type: "paragraph", content: "To Whom It May Concern," },
  { id: "rl-5", type: "paragraph", content: "This letter serves to confirm that {{employee.fullName}} was employed at {{company.name}} from {{employee.startDate}} as a {{employee.jobTitle}} in the {{employee.department}} department." },
  { id: "rl-6", type: "paragraph", content: "During their tenure, {{employee.firstName}} demonstrated exceptional professionalism, competence, and dedication. They consistently met and exceeded performance expectations." },
  { id: "rl-7", type: "paragraph", content: "We recommend {{employee.firstName}} without reservation and wish them success in their future endeavors." },
  { id: "rl-8", type: "spacer", content: "" },
  { id: "rl-9", type: "paragraph", content: "Yours faithfully," },
  { id: "rl-10", type: "signature", content: "{{manager.name}}\n{{manager.title}}\n{{company.name}}\n{{company.phone}}" },
];

export const EMBASSY_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "el-1", type: "logo", content: "{{company.logo}}", style: { alignment: "left" } },
  { id: "el-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "el-3", type: "paragraph", content: "The Visa Officer\nEmbassy/Consulate" },
  { id: "el-4", type: "header", content: "RE: EMPLOYMENT VERIFICATION — {{employee.fullName}}", style: { fontSize: "base", bold: true } },
  { id: "el-5", type: "paragraph", content: "Dear Sir/Madam," },
  { id: "el-6", type: "paragraph", content: "We write to confirm that {{employee.fullName}} (Employee ID: {{employee.employeeId}}) is a bona fide employee of {{company.name}}, {{company.address}}." },
  { id: "el-7", type: "paragraph", content: "{{employee.firstName}} has been employed as a {{employee.jobTitle}} since {{employee.startDate}} and currently earns an annual salary of {{employee.salary}}." },
  { id: "el-8", type: "paragraph", content: "{{employee.firstName}} is travelling for official/personal purposes and is expected to return to resume duties upon completion of the trip. Their position at {{company.name}} remains secure." },
  { id: "el-9", type: "paragraph", content: "We kindly request that all courtesies be extended to {{employee.firstName}} during their visit." },
  { id: "el-10", type: "spacer", content: "" },
  { id: "el-11", type: "paragraph", content: "Yours faithfully," },
  { id: "el-12", type: "signature", content: "HR Manager\n{{company.name}}\n{{company.rcNumber}}\n{{company.phone}}" },
];

export const PROMOTION_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "pl-1", type: "logo", content: "{{company.logo}}", style: { alignment: "center" } },
  { id: "pl-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "pl-3", type: "paragraph", content: "{{employee.fullName}}\n{{employee.address}}" },
  { id: "pl-4", type: "header", content: "PROMOTION LETTER", style: { alignment: "center", fontSize: "xl", bold: true } },
  { id: "pl-5", type: "paragraph", content: "Dear {{employee.firstName}}," },
  { id: "pl-6", type: "paragraph", content: "We are delighted to inform you that, in recognition of your outstanding performance and contribution to {{company.name}}, you have been promoted to the position of {{employee.jobTitle}} in the {{employee.department}} department, effective {{employee.startDate}}." },
  { id: "pl-7", type: "paragraph", content: "Your new remuneration will be {{employee.salary}} per annum. All other terms and conditions of your employment remain unchanged." },
  { id: "pl-8", type: "paragraph", content: "Congratulations on this well-deserved achievement. We look forward to your continued growth and success." },
  { id: "pl-9", type: "spacer", content: "" },
  { id: "pl-10", type: "paragraph", content: "Yours sincerely," },
  { id: "pl-11", type: "signature", content: "{{manager.name}}\n{{manager.title}}\n{{company.name}}" },
];

export const TERMINATION_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "tl-1", type: "logo", content: "{{company.logo}}", style: { alignment: "left" } },
  { id: "tl-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "tl-3", type: "paragraph", content: "{{employee.fullName}}\n{{employee.address}}" },
  { id: "tl-4", type: "header", content: "NOTICE OF TERMINATION OF EMPLOYMENT", style: { alignment: "center", fontSize: "lg", bold: true } },
  { id: "tl-5", type: "paragraph", content: "Dear {{employee.firstName}}," },
  { id: "tl-6", type: "paragraph", content: "This letter serves as formal notice that your employment with {{company.name}} as {{employee.jobTitle}} in the {{employee.department}} department is hereby terminated, effective {{employee.startDate}}." },
  { id: "tl-7", type: "paragraph", content: "This decision was reached after careful consideration and in accordance with the terms outlined in your employment contract and the company's disciplinary policy." },
  { id: "tl-8", type: "paragraph", content: "Your final settlement, including outstanding salary, accrued leave entitlements, and any applicable benefits, will be processed within 30 days of your last working day." },
  { id: "tl-9", type: "paragraph", content: "You are required to return all company property, including but not limited to ID cards, laptops, keys, and access credentials, on or before your last working day." },
  { id: "tl-10", type: "spacer", content: "" },
  { id: "tl-11", type: "paragraph", content: "Yours sincerely," },
  { id: "tl-12", type: "signature", content: "HR Manager\n{{company.name}}" },
];

export const WARNING_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "wl-1", type: "logo", content: "{{company.logo}}", style: { alignment: "left" } },
  { id: "wl-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "wl-3", type: "paragraph", content: "{{employee.fullName}}\n{{employee.department}} Department" },
  { id: "wl-4", type: "header", content: "WRITTEN WARNING", style: { alignment: "center", fontSize: "lg", bold: true } },
  { id: "wl-5", type: "paragraph", content: "Dear {{employee.firstName}}," },
  { id: "wl-6", type: "paragraph", content: "This letter serves as a formal written warning regarding your conduct/performance as {{employee.jobTitle}} at {{company.name}}." },
  { id: "wl-7", type: "paragraph", content: "Specifically, this warning is being issued for the following reason(s):\n\n[Details of the offence or performance issue]" },
  { id: "wl-8", type: "paragraph", content: "This behavior/performance is in violation of the company's policies and is unacceptable. You are expected to take immediate corrective action." },
  { id: "wl-9", type: "paragraph", content: "Failure to improve may result in further disciplinary action, up to and including termination of employment." },
  { id: "wl-10", type: "paragraph", content: "A copy of this letter will be placed in your personnel file." },
  { id: "wl-11", type: "spacer", content: "" },
  { id: "wl-12", type: "signature", content: "{{manager.name}}\n{{manager.title}}" },
  { id: "wl-13", type: "divider", content: "" },
  { id: "wl-14", type: "paragraph", content: "I acknowledge receipt of this warning letter.", style: { italic: true } },
  { id: "wl-15", type: "signature", content: "{{employee.fullName}}\nDate: _______________" },
];

export const TWIMC_LETTER_BLOCKS: TemplateBlock[] = [
  { id: "tw-1", type: "logo", content: "{{company.logo}}", style: { alignment: "left" } },
  { id: "tw-2", type: "date", content: "{{currentDate}}", style: { alignment: "right" } },
  { id: "tw-3", type: "header", content: "TO WHOM IT MAY CONCERN", style: { alignment: "center", fontSize: "xl", bold: true } },
  { id: "tw-4", type: "paragraph", content: "This is to certify that {{employee.fullName}} (Employee ID: {{employee.employeeId}}) is currently employed at {{company.name}} as a {{employee.jobTitle}} in the {{employee.department}} department." },
  { id: "tw-5", type: "paragraph", content: "{{employee.firstName}} has been with the company since {{employee.startDate}} and is in good standing." },
  { id: "tw-6", type: "paragraph", content: "This letter is issued upon the request of the above-named employee for whatever purpose it may serve." },
  { id: "tw-7", type: "spacer", content: "" },
  { id: "tw-8", type: "paragraph", content: "Yours faithfully," },
  { id: "tw-9", type: "signature", content: "HR Manager\n{{company.name}}\n{{company.address}}\n{{company.phone}}" },
];

// Map of type to default blocks
export const DEFAULT_TEMPLATE_BLOCKS: Record<string, TemplateBlock[]> = {
  OFFER_LETTER: OFFER_LETTER_BLOCKS,
  CONTRACT: CONTRACT_BLOCKS,
  REFERENCE_LETTER: REFERENCE_LETTER_BLOCKS,
  EMBASSY_LETTER: EMBASSY_LETTER_BLOCKS,
  PROMOTION_LETTER: PROMOTION_LETTER_BLOCKS,
  TERMINATION_LETTER: TERMINATION_LETTER_BLOCKS,
  WARNING_LETTER: WARNING_LETTER_BLOCKS,
  TWIMC: TWIMC_LETTER_BLOCKS,
};

// --- Mock Templates ---
export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: "tpl-1",
    name: "Standard Offer Letter",
    type: "OFFER_LETTER",
    description: "Default offer letter template for full-time employees",
    content: "",
    status: "active",
    version: 3,
    versions: [
      { id: "v1", version: 1, changelog: "Initial template created", createdBy: "Amina Bello", createdAt: "2025-09-15T10:00:00Z", status: "archived" },
      { id: "v2", version: 2, changelog: "Updated salary section format", createdBy: "Amina Bello", createdAt: "2025-11-20T14:30:00Z", status: "archived" },
      { id: "v3", version: 3, changelog: "Added probation terms paragraph", createdBy: "Fatima Ibrahim", createdAt: "2026-01-10T09:15:00Z", status: "active" },
    ],
    permissions: { level: "hr_only", canGenerate: ["hr", "admin"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Amina Bello",
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2026-01-10T09:15:00Z",
    usageCount: 47,
    lastUsed: "2026-03-08T11:00:00Z",
    tags: ["hiring", "full-time"],
  },
  {
    id: "tpl-2",
    name: "Employment Contract (Full-Time)",
    type: "CONTRACT",
    description: "Standard employment contract for permanent staff",
    content: "",
    status: "active",
    version: 2,
    versions: [
      { id: "v4", version: 1, changelog: "Initial contract template", createdBy: "Amina Bello", createdAt: "2025-09-15T11:00:00Z", status: "archived" },
      { id: "v5", version: 2, changelog: "Added pension and NHF clauses", createdBy: "Amina Bello", createdAt: "2025-12-05T16:00:00Z", status: "active" },
    ],
    permissions: { level: "hr_only", canGenerate: ["hr", "admin"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Amina Bello",
    createdAt: "2025-09-15T11:00:00Z",
    updatedAt: "2025-12-05T16:00:00Z",
    usageCount: 45,
    lastUsed: "2026-03-08T11:15:00Z",
    tags: ["hiring", "legal"],
  },
  {
    id: "tpl-3",
    name: "Reference Letter",
    type: "REFERENCE_LETTER",
    description: "Standard reference letter for departing employees",
    content: "",
    status: "active",
    version: 1,
    versions: [
      { id: "v6", version: 1, changelog: "Initial reference template", createdBy: "Fatima Ibrahim", createdAt: "2025-10-22T09:00:00Z", status: "active" },
    ],
    permissions: { level: "managers", canGenerate: ["hr", "admin", "manager"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Fatima Ibrahim",
    createdAt: "2025-10-22T09:00:00Z",
    updatedAt: "2025-10-22T09:00:00Z",
    usageCount: 12,
    lastUsed: "2026-02-14T10:00:00Z",
    tags: ["exit"],
  },
  {
    id: "tpl-4",
    name: "Embassy Verification Letter",
    type: "EMBASSY_LETTER",
    description: "Employment verification for visa and travel purposes",
    content: "",
    status: "active",
    version: 2,
    versions: [
      { id: "v7", version: 1, changelog: "Initial embassy letter", createdBy: "Amina Bello", createdAt: "2025-10-01T08:00:00Z", status: "archived" },
      { id: "v8", version: 2, changelog: "Added RC number and salary details", createdBy: "Fatima Ibrahim", createdAt: "2026-01-15T13:00:00Z", status: "active" },
    ],
    permissions: { level: "hr_only", canGenerate: ["hr", "admin"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Amina Bello",
    createdAt: "2025-10-01T08:00:00Z",
    updatedAt: "2026-01-15T13:00:00Z",
    usageCount: 8,
    lastUsed: "2026-03-01T09:30:00Z",
    tags: ["travel", "verification"],
  },
  {
    id: "tpl-5",
    name: "Promotion Letter",
    type: "PROMOTION_LETTER",
    description: "Employee promotion announcement and new terms",
    content: "",
    status: "active",
    version: 1,
    versions: [
      { id: "v9", version: 1, changelog: "Initial promotion template", createdBy: "Fatima Ibrahim", createdAt: "2025-11-10T10:00:00Z", status: "active" },
    ],
    permissions: { level: "managers", canGenerate: ["hr", "admin", "manager"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Fatima Ibrahim",
    createdAt: "2025-11-10T10:00:00Z",
    updatedAt: "2025-11-10T10:00:00Z",
    usageCount: 15,
    lastUsed: "2026-02-28T14:00:00Z",
    tags: ["promotion"],
  },
  {
    id: "tpl-6",
    name: "Termination Notice",
    type: "TERMINATION_LETTER",
    description: "Formal employment termination letter",
    content: "",
    status: "active",
    version: 2,
    versions: [
      { id: "v10", version: 1, changelog: "Initial termination template", createdBy: "Amina Bello", createdAt: "2025-09-20T12:00:00Z", status: "archived" },
      { id: "v11", version: 2, changelog: "Updated to include clearance instructions", createdBy: "Amina Bello", createdAt: "2026-02-01T10:00:00Z", status: "active" },
    ],
    permissions: { level: "hr_only", canGenerate: ["hr", "admin"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Amina Bello",
    createdAt: "2025-09-20T12:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    usageCount: 5,
    lastUsed: "2026-02-20T16:00:00Z",
    tags: ["exit", "legal"],
  },
  {
    id: "tpl-7",
    name: "Written Warning",
    type: "WARNING_LETTER",
    description: "Disciplinary written warning notice",
    content: "",
    status: "active",
    version: 1,
    versions: [
      { id: "v12", version: 1, changelog: "Initial warning template", createdBy: "Amina Bello", createdAt: "2025-10-15T11:00:00Z", status: "active" },
    ],
    permissions: { level: "managers", canGenerate: ["hr", "admin", "manager"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Amina Bello",
    createdAt: "2025-10-15T11:00:00Z",
    updatedAt: "2025-10-15T11:00:00Z",
    usageCount: 9,
    lastUsed: "2026-03-05T10:00:00Z",
    tags: ["disciplinary"],
  },
  {
    id: "tpl-8",
    name: "To Whom It May Concern",
    type: "TWIMC",
    description: "General employment verification letter",
    content: "",
    status: "active",
    version: 1,
    versions: [
      { id: "v13", version: 1, changelog: "Initial TWIMC template", createdBy: "Fatima Ibrahim", createdAt: "2025-10-22T14:00:00Z", status: "active" },
    ],
    permissions: { level: "all", canGenerate: ["hr", "admin", "manager"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Fatima Ibrahim",
    createdAt: "2025-10-22T14:00:00Z",
    updatedAt: "2025-10-22T14:00:00Z",
    usageCount: 22,
    lastUsed: "2026-03-10T08:30:00Z",
    tags: ["verification"],
  },
  {
    id: "tpl-9",
    name: "Contract Employee Offer",
    type: "OFFER_LETTER",
    description: "Offer letter template for contract employees",
    content: "",
    status: "draft",
    version: 1,
    versions: [
      { id: "v14", version: 1, changelog: "Draft created", createdBy: "Fatima Ibrahim", createdAt: "2026-03-09T10:00:00Z", status: "draft" },
    ],
    permissions: { level: "hr_only", canGenerate: ["hr", "admin"], canEdit: ["hr"], canDelete: ["admin"] },
    createdBy: "Fatima Ibrahim",
    createdAt: "2026-03-09T10:00:00Z",
    updatedAt: "2026-03-09T10:00:00Z",
    usageCount: 0,
    lastUsed: null,
    tags: ["hiring", "contract"],
  },
];

// --- Mock Generated Documents ---
export const MOCK_GENERATED_DOCUMENTS: GeneratedDocument[] = [
  { id: "doc-1", templateId: "tpl-1", templateName: "Standard Offer Letter", employeeId: "emp-1", employeeName: "Adebayo Ogunlesi", status: "delivered", generatedBy: "Amina Bello", generatedAt: "2026-03-08T11:00:00Z", signedAt: "2026-03-08T14:00:00Z", deliveredAt: "2026-03-08T14:30:00Z", deliveredVia: "email", fileSize: "245 KB", version: 1 },
  { id: "doc-2", templateId: "tpl-2", templateName: "Employment Contract (Full-Time)", employeeId: "emp-1", employeeName: "Adebayo Ogunlesi", status: "pending_signature", generatedBy: "Amina Bello", generatedAt: "2026-03-08T11:15:00Z", signedAt: null, deliveredAt: null, deliveredVia: null, fileSize: "380 KB", version: 1 },
  { id: "doc-3", templateId: "tpl-5", templateName: "Promotion Letter", employeeId: "emp-5", employeeName: "Chioma Nwosu", status: "signed", generatedBy: "Fatima Ibrahim", generatedAt: "2026-02-28T14:00:00Z", signedAt: "2026-03-01T09:00:00Z", deliveredAt: null, deliveredVia: null, fileSize: "198 KB", version: 1 },
  { id: "doc-4", templateId: "tpl-4", templateName: "Embassy Verification Letter", employeeId: "emp-8", employeeName: "Emeka Eze", status: "delivered", generatedBy: "Amina Bello", generatedAt: "2026-03-01T09:30:00Z", signedAt: "2026-03-01T10:00:00Z", deliveredAt: "2026-03-01T10:15:00Z", deliveredVia: "portal", fileSize: "210 KB", version: 1 },
  { id: "doc-5", templateId: "tpl-8", templateName: "To Whom It May Concern", employeeId: "emp-12", employeeName: "Oluwaseun Adeyemi", status: "draft", generatedBy: "Fatima Ibrahim", generatedAt: "2026-03-10T08:30:00Z", signedAt: null, deliveredAt: null, deliveredVia: null, fileSize: "156 KB", version: 1 },
];

// --- Mock Document Version History ---
export const MOCK_VERSION_HISTORY: DocumentVersionEntry[] = [
  { id: "vh-1", documentId: "doc-1", version: 1, action: "created", performedBy: "Amina Bello", performedAt: "2026-03-08T11:00:00Z", changes: "Document generated from Standard Offer Letter template", fileSize: "245 KB" },
  { id: "vh-2", documentId: "doc-1", version: 1, action: "signed", performedBy: "Adebayo Ogunlesi", performedAt: "2026-03-08T14:00:00Z", changes: "Employee signature added", fileSize: "248 KB" },
  { id: "vh-3", documentId: "doc-1", version: 1, action: "delivered", performedBy: "System", performedAt: "2026-03-08T14:30:00Z", changes: "Delivered via email to adebayo.ogunlesi@company.com", fileSize: "248 KB" },
  { id: "vh-4", documentId: "doc-2", version: 1, action: "created", performedBy: "Amina Bello", performedAt: "2026-03-08T11:15:00Z", changes: "Contract generated for new hire", fileSize: "380 KB" },
  { id: "vh-5", documentId: "doc-3", version: 1, action: "created", performedBy: "Fatima Ibrahim", performedAt: "2026-02-28T14:00:00Z", changes: "Promotion letter generated", fileSize: "198 KB" },
  { id: "vh-6", documentId: "doc-3", version: 1, action: "signed", performedBy: "Chioma Nwosu", performedAt: "2026-03-01T09:00:00Z", changes: "Manager signature added", fileSize: "201 KB" },
];

// --- Mock Storage Activity ---
export const MOCK_STORAGE_ACTIVITIES: StorageActivity[] = [
  { id: "sa-1", type: "generate", description: "Generated offer letter for Adebayo Ogunlesi", fileName: "Offer_Letter_Adebayo_Ogunlesi.pdf", performedBy: "Amina Bello", performedAt: "2026-03-08T11:00:00Z", fileSize: "245 KB" },
  { id: "sa-2", type: "generate", description: "Generated employment contract for Adebayo Ogunlesi", fileName: "Contract_Adebayo_Ogunlesi.pdf", performedBy: "Amina Bello", performedAt: "2026-03-08T11:15:00Z", fileSize: "380 KB" },
  { id: "sa-3", type: "sign", description: "Offer letter signed by Adebayo Ogunlesi", fileName: "Offer_Letter_Adebayo_Ogunlesi.pdf", performedBy: "Adebayo Ogunlesi", performedAt: "2026-03-08T14:00:00Z", fileSize: "248 KB" },
  { id: "sa-4", type: "deliver", description: "Offer letter delivered via email", fileName: "Offer_Letter_Adebayo_Ogunlesi.pdf", performedBy: "System", performedAt: "2026-03-08T14:30:00Z", fileSize: "248 KB" },
  { id: "sa-5", type: "upload", description: "Employee uploaded ID card scan", fileName: "ID_Card_Emeka_Eze.jpg", performedBy: "Emeka Eze", performedAt: "2026-03-07T16:00:00Z", fileSize: "1.2 MB" },
  { id: "sa-6", type: "generate", description: "Generated embassy letter for Emeka Eze", fileName: "Embassy_Letter_Emeka_Eze.pdf", performedBy: "Amina Bello", performedAt: "2026-03-01T09:30:00Z", fileSize: "210 KB" },
  { id: "sa-7", type: "download", description: "Downloaded promotion letter", fileName: "Promotion_Chioma_Nwosu.pdf", performedBy: "Chioma Nwosu", performedAt: "2026-03-01T09:15:00Z", fileSize: "198 KB" },
  { id: "sa-8", type: "archive", description: "Archived old contract template v1", fileName: "Contract_Template_v1.docx", performedBy: "Fatima Ibrahim", performedAt: "2026-02-28T10:00:00Z", fileSize: "45 KB" },
  { id: "sa-9", type: "delete", description: "Deleted duplicate document", fileName: "Duplicate_Offer_Letter.pdf", performedBy: "Amina Bello", performedAt: "2026-02-25T15:00:00Z", fileSize: "230 KB" },
  { id: "sa-10", type: "upload", description: "Uploaded updated company letterhead", fileName: "SoftGEM_Letterhead_2026.png", performedBy: "Amina Bello", performedAt: "2026-02-20T11:00:00Z", fileSize: "520 KB" },
];

// --- Supported File Types ---
export const SUPPORTED_FILE_TYPES = {
  documents: [".pdf", ".docx", ".xlsx", ".csv"],
  images: [".jpg", ".jpeg", ".png"],
};

export const MAX_FILE_SIZE_DOCS = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_IMAGES = 5 * 1024 * 1024; // 5MB
