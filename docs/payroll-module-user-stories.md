# SabiHR - Payroll Module: User Stories & Use Cases

## Overview

This document details the complete Payroll Module for SabiHR, covering payroll run management, payslip generation, input review, computation, approval workflows, off-cycle payroll, adjustments, auto-payroll, payroll configuration (pay grades, salary structures, allowance/deduction templates, payroll calendar, salary assignments), and statutory compliance (PAYE tax, pension, statutory bodies, compliance overview).

The Payroll Module is split into three major screens:
1. **Payroll Management** (`/payroll`) -- Payroll runs, payslips, input review, computation, approval, off-cycle, adjustments, auto-payroll
2. **Payroll Configuration** (`/payroll/config`) -- Pay grades, salary structures, templates, calendar, assignments
3. **Statutory Compliance** (`/payroll/compliance`) -- PAYE tax, pension, statutory bodies (NHF/ITF/NSITF/NHIS), compliance overview

---

## Screen 1: Payroll Management

### US-18: View Payroll Runs

**As a** payroll administrator,
**I want to** view a list of all payroll runs organized by period,
**So that** I can track payroll processing history and initiate new payroll cycles.

#### Screen: Payroll Management -- Payroll Runs Tab

**Route:** `/payroll`

**Page Header:**

| Element | Type | Content | Behavior |
|---------|------|---------|----------|
| Page title | h1 | "Payroll Management" | `text-xl font-semibold tracking-tight` |
| Subtitle | p | "Process payroll and manage employee compensation" | `text-sm text-muted-foreground` |
| Export button | Button (outline, sm) | Download icon + "Export" | `alert("Payroll data exported successfully.")` |
| Process button | Button (primary) | Play icon + "Process {period}" | Only visible when current run status is `"draft"`. `alert("Processing payroll for March 2026...")` |

**Summary Cards (4 cards, grid `grid-cols-2 sm:grid-cols-4 gap-4`):**

| Card | Icon | Label | Value | Subtext |
|------|------|-------|-------|---------|
| Last Gross Pay | Banknote | "Last Gross Pay" | `₦47,800,000` | "February 2026" |
| Last Net Pay | DollarSign | "Last Net Pay" | `₦33,800,000` | "February 2026" |
| Total Deductions | TrendingUp | "Total Deductions" | `₦14,000,000` | "February 2026" |
| Employees Paid | Users | "Employees Paid" | `154` | "February 2026" |

Each card: `rounded-xl border border-border bg-card p-4`. Icon + label row: `text-muted-foreground`, `text-xs font-medium`. Value: `text-xl font-semibold`. Subtext: `text-[10px] text-muted-foreground mt-0.5`.

**Tab Navigation (8 tabs, horizontal scrollable):**

| Tab Key | Label | Icon |
|---------|-------|------|
| `runs` | Payroll Runs | Play |
| `payslips` | Payslips | FileText |
| `input-review` | Input Review | ClipboardCheck |
| `computation` | Computation | Calculator |
| `approval` | Approval | CheckSquare |
| `off-cycle` | Off-Cycle | Zap |
| `adjustments` | Adjustments | PenTool |
| `auto-payroll` | Auto-Payroll | RotateCcw |

Tab styling: `flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap`. Active: `border-primary text-primary`. Inactive: `border-transparent text-muted-foreground hover:text-foreground`. Icons: `w-3.5 h-3.5`.

**Payroll Runs Table:**

Container: `rounded-xl border border-border bg-card overflow-x-auto`.

| Column | Alignment | Style |
|--------|-----------|-------|
| Period | Left | `font-medium` |
| Status | Left | Status badge (rounded pill) |
| Gross Pay | Right | `font-medium` |
| Deductions | Right | `text-muted-foreground` |
| Net Pay | Right | `font-medium` |
| Employees | Left | Plain text |
| Processed | Left | `text-muted-foreground text-xs`, date formatted as "DD Mon YYYY" (en-NG locale), or "--" if null |
| Approved By | Left | `text-muted-foreground text-xs`, or "--" if null |
| Action | Center | Eye icon button to view payslips |

**Payroll Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `draft` | Draft | `bg-gray-50 border-gray-200` | `text-gray-700` |
| `processing` | Processing | `bg-blue-50 border-blue-200` | `text-blue-700` |
| `completed` | Completed | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `failed` | Failed | `bg-red-50 border-red-200` | `text-red-700` |

Badge styling: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`.

**Mock Data -- Payroll Runs (6 records):**

| ID | Period | Month | Year | Status | Total Gross | Total Net | Total Deductions | Employee Count | Processed Date | Approved By |
|----|--------|-------|------|--------|-------------|-----------|------------------|----------------|----------------|-------------|
| pr-001 | March 2026 | March | 2026 | draft | ₦48,200,000 | ₦34,100,000 | ₦14,100,000 | 156 | null | null |
| pr-002 | February 2026 | February | 2026 | completed | ₦47,800,000 | ₦33,800,000 | ₦14,000,000 | 154 | 2026-02-28 | Chibueze Okoro |
| pr-003 | January 2026 | January | 2026 | completed | ₦46,500,000 | ₦32,900,000 | ₦13,600,000 | 150 | 2026-01-30 | Chibueze Okoro |
| pr-004 | December 2025 | December | 2025 | completed | ₦52,300,000 | ₦37,200,000 | ₦15,100,000 | 150 | 2025-12-24 | Chibueze Okoro |
| pr-005 | November 2025 | November | 2025 | completed | ₦45,200,000 | ₦32,000,000 | ₦13,200,000 | 148 | 2025-11-28 | Chibueze Okoro |
| pr-006 | October 2025 | October | 2025 | completed | ₦44,800,000 | ₦31,700,000 | ₦13,100,000 | 145 | 2025-10-30 | Chibueze Okoro |

**User Actions:**
- View all payroll runs in a table sorted by period (newest first)
- Click the Eye icon button on any row to navigate to the Payslips tab filtered to that run
- Click "Export" to export payroll data
- Click "Process {period}" to initiate payroll processing for the current draft run
- Switch between tabs to view different payroll management sections

**Success Flow:**
1. User navigates to `/payroll`
2. Page loads with "Payroll Runs" tab active by default
3. Summary cards display data from the last completed run (February 2026)
4. Payroll runs table shows all 6 runs with status badges
5. User clicks Eye icon on a specific run row
6. System sets `selectedRunId` to that run's ID and switches to Payslips tab

**Error States / Edge Cases:**
- If no payroll runs exist, table body would be empty (no explicit empty state defined)
- Process button only appears when `currentRun.status === "draft"`
- Date column shows "--" for runs with no `processedDate`
- Approved By column shows "--" for runs with no `approvedBy`

**Data Structures:**

```typescript
type PayrollStatus = "draft" | "processing" | "completed" | "failed";

interface PayrollRun {
  id: string;
  period: string;
  month: string;
  year: number;
  status: PayrollStatus;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  processedDate: string | null;
  approvedBy: string | null;
}
```

**Responsive Behavior:**
- Header: `flex-col` on mobile, `flex-row items-center justify-between` on `sm:` and above
- Summary cards: 2 columns on mobile (`grid-cols-2`), 4 columns on `sm:` (`sm:grid-cols-4`)
- Tab bar: horizontal scrollable with `overflow-x-auto`
- Table: horizontal scroll via `overflow-x-auto` wrapper
- Row hover: `hover:bg-muted/30 transition-colors`
- Table headers: `bg-muted/50`, `p-3 text-left font-medium text-muted-foreground`

---

### US-19: View Employee Payslips

**As a** payroll administrator,
**I want to** view individual employee payslips for a specific payroll run,
**So that** I can verify compensation breakdowns and resolve payment discrepancies.

#### Screen: Payroll Management -- Payslips Tab

**Route:** `/payroll` (Payslips tab)

**Payslip Toolbar:**

| Element | Type | Details |
|---------|------|---------|
| Search input | Input | Placeholder: "Search employee...", icon: Search (left), max-width: `max-w-sm` |
| Period indicator | Text | "Showing payslips for **{period}**", `text-xs text-muted-foreground`, period in `font-medium text-foreground` |

Layout: `flex-col` on mobile, `flex-row gap-3 items-center justify-between` on `sm:`.

**Payslip Summary Totals (3 cards, `grid-cols-3 gap-4`):**

| Card | Label | Value |
|------|-------|-------|
| Total Gross | "Total Gross" | Computed sum of `grossPay` from filtered payslips |
| Total Deductions | "Total Deductions" | Computed sum of `totalDeductions` from filtered payslips |
| Total Net | "Total Net" | Computed sum of `netPay` from filtered payslips |

Card styling: `rounded-xl border border-border bg-card p-3 text-center`. Label: `text-xs text-muted-foreground`. Value: `text-lg font-semibold`.

**Payslips Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Employee | Left | Avatar circle (initials, `w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-medium`) + name (`font-medium`) |
| Department | Left | `text-muted-foreground` |
| Basic | Right | Plain amount |
| Allowances | Right | `text-muted-foreground`, computed as `housingAllowance + transportAllowance + otherAllowances` |
| Gross | Right | `font-medium` |
| Tax | Right | `text-red-600`, prefixed with "-" |
| Pension | Right | `text-red-600`, prefixed with "-" |
| Net Pay | Right | `font-semibold` |
| Status | Left | Status badge (rounded pill) |
| Bank | Left | Bank name + masked account number (`font-mono`), stacked vertically |

**Payslip Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `paid` | Paid | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `on-hold` | On Hold | `bg-red-50 border-red-200` | `text-red-700` |

**Mock Data -- Employee Payslips (9 records, all for payroll run pr-002 "February 2026"):**

| ID | Employee ID | Employee Name | Department | Basic Salary | Housing | Transport | Other Allow. | Gross Pay | Tax | Pension | Other Ded. | Total Ded. | Net Pay | Status | Bank | Account |
|----|-------------|---------------|------------|-------------|---------|-----------|-------------|-----------|-----|---------|------------|------------|---------|--------|------|---------|
| ps-001 | emp-001 | Adebayo Ogunlesi | Engineering | ₦850,000 | ₦170,000 | ₦85,000 | ₦95,000 | ₦1,200,000 | ₦180,000 | ₦96,000 | ₦74,000 | ₦350,000 | ₦850,000 | paid | GTBank | ****4521 |
| ps-002 | emp-002 | Chiamaka Eze | Engineering | ₦1,200,000 | ₦240,000 | ₦120,000 | ₦140,000 | ₦1,700,000 | ₦280,000 | ₦136,000 | ₦84,000 | ₦500,000 | ₦1,200,000 | paid | First Bank | ****7832 |
| ps-003 | emp-003 | Oluwaseun Afolabi | Engineering | ₦600,000 | ₦120,000 | ₦60,000 | ₦70,000 | ₦850,000 | ₦120,000 | ₦68,000 | ₦62,000 | ₦250,000 | ₦600,000 | paid | Access Bank | ****2190 |
| ps-004 | emp-004 | Fatima Abdullahi | Human Resources | ₦700,000 | ₦140,000 | ₦70,000 | ₦90,000 | ₦1,000,000 | ₦150,000 | ₦80,000 | ₦70,000 | ₦300,000 | ₦700,000 | paid | Zenith Bank | ****5643 |
| ps-005 | emp-005 | Emeka Okafor | Sales | ₦500,000 | ₦100,000 | ₦50,000 | ₦50,000 | ₦700,000 | ₦95,000 | ₦56,000 | ₦49,000 | ₦200,000 | ₦500,000 | paid | UBA | ****8901 |
| ps-006 | emp-006 | Aisha Mohammed | Finance | ₦550,000 | ₦110,000 | ₦55,000 | ₦60,000 | ₦775,000 | ₦108,000 | ₦62,000 | ₦55,000 | ₦225,000 | ₦550,000 | paid | Fidelity Bank | ****3456 |
| ps-007 | emp-008 | Bukola Adeyemi | Marketing | ₦750,000 | ₦150,000 | ₦75,000 | ₦75,000 | ₦1,050,000 | ₦158,000 | ₦84,000 | ₦58,000 | ₦300,000 | ₦750,000 | paid | Stanbic IBTC | ****6789 |
| ps-008 | emp-011 | Chibueze Okoro | Finance | ₦1,100,000 | ₦220,000 | ₦110,000 | ₦120,000 | ₦1,550,000 | ₦248,000 | ₦124,000 | ₦78,000 | ₦450,000 | ₦1,100,000 | paid | GTBank | ****1234 |
| ps-009 | emp-017 | Olumide Fashola | Sales | ₦450,000 | ₦90,000 | ₦45,000 | ₦40,000 | ₦625,000 | ₦85,000 | ₦50,000 | ₦40,000 | ₦175,000 | ₦450,000 | on-hold | Wema Bank | ****5678 |

**User Actions:**
- Search payslips by employee name or department via the search input
- View payslip totals (Gross, Deductions, Net) in summary cards above the table
- See which payroll run period is currently displayed
- Review individual compensation breakdowns per employee

**Success Flow:**
1. User clicks Eye icon on a payroll run row (or navigates to Payslips tab)
2. The `selectedRunId` is set; payslips are filtered to that run
3. If no run is selected, defaults to the last completed run (`pr-002`)
4. Summary cards compute and display totals from the filtered payslips
5. Table displays matching payslips with full compensation breakdown
6. User types in search box to filter by name or department

**Error States / Edge Cases:**
- Empty state: FileText icon (`w-10 h-10 mx-auto mb-3 opacity-30`), "No payslips found", "Try adjusting your search"
- Empty state uses `colSpan={10}` and `p-12 text-center text-muted-foreground`
- Search is case-insensitive
- Payslip totals dynamically recompute as search filters change
- Avatar initials are generated from first letter of each name part (e.g., "AO" for "Adebayo Ogunlesi")

**Data Structures:**

```typescript
type PayslipStatus = "pending" | "paid" | "on-hold";

interface EmployeePayslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  grossPay: number;
  tax: number;
  pension: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: PayslipStatus;
  bankName: string;
  accountNumber: string;
}
```

**Interactive Features:**
- Search input with magnifying glass icon, `pl-9` left-padding for icon
- Payslip totals cards update in real time as search filters change (via `useMemo`)
- Table rows have hover effect: `hover:bg-muted/30 transition-colors`

**Responsive Behavior:**
- Toolbar: `flex-col` on mobile, `flex-row` on `sm:`
- Summary totals: always 3 columns (`grid-cols-3`)
- Table: horizontal scroll wrapper for narrow viewports
- Avatar + name in Employee column: `flex items-center gap-3`

---

### US-20: Review Payroll Inputs

**As a** payroll administrator,
**I want to** review, approve, or reject individual payroll inputs (overtime, bonuses, commissions, deductions, reimbursements),
**So that** only validated inputs are included in the payroll computation.

#### Screen: Payroll Management -- Input Review Tab

**Route:** `/payroll` (Input Review tab)

**Summary Cards (4 cards, grid `grid-cols-2 sm:grid-cols-4 gap-4`):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Inputs | ClipboardCheck | "Total Inputs" | `6` |
| Pending Review | AlertCircle | "Pending Review" | `3` (dynamically computed) |
| Approved | CheckSquare | "Approved" | `2` (dynamically computed) |
| Total Amount | Banknote | "Total Amount" | `₦419,000` (sum of all amounts) |

**Search Bar:**
`relative max-w-sm`. Search icon at `left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`. Input placeholder: "Search inputs...". `pl-9`.

**Input Review Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Employee | Left | `font-medium` |
| Department | Left | `text-muted-foreground` |
| Type | Left | Plain text |
| Hours | Right | Value or "--" if 0 |
| Rate | Right | Formatted as Naira or "--" if 0 |
| Amount | Right | `font-medium`; negative amounts in `text-red-600` with "(Ded)" suffix |
| Status | Left | Status badge |
| Actions | Left | Approve/Reject buttons (only for `pending` status) |

**Input Review Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `approved` | Approved | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `rejected` | Rejected | `bg-red-50 border-red-200` | `text-red-700` |

**Action Buttons (for `pending` items only):**
- "Approve" button: `variant="outline" size="sm" className="h-7 text-xs"`
- "Reject" button: `variant="outline" size="sm" className="h-7 text-xs text-red-600"`
- Buttons appear in a `flex gap-1` container

**Mock Data -- Input Review (6 records):**

| ID | Employee | Department | Type | Hours | Rate | Amount | Status |
|----|----------|------------|------|-------|------|--------|--------|
| ir-1 | Adebayo Ogunlesi | Engineering | Overtime | 12 | ₦5,000 | ₦60,000 | pending |
| ir-2 | Chioma Eze | Product | Bonus | 0 | 0 | ₦150,000 | approved |
| ir-3 | Emeka Nwosu | Finance | Deduction | 0 | 0 | -₦50,000 | pending |
| ir-4 | Fatima Bello | HR | Overtime | 8 | ₦3,000 | ₦24,000 | approved |
| ir-5 | Gbenga Adeyemi | Marketing | Commission | 0 | 0 | ₦200,000 | pending |
| ir-6 | Halima Yusuf | Engineering | Reimbursement | 0 | 0 | ₦35,000 | rejected |

**User Actions:**
- Search inputs by employee name or type
- Click "Approve" on a pending input to change its status to `approved`
- Click "Reject" on a pending input to change its status to `rejected`
- View summary cards reflecting real-time counts

**Success Flow:**
1. User navigates to Input Review tab
2. Summary cards show total inputs, pending, approved counts, and total amount
3. Table displays all 6 input records with their statuses
4. User clicks "Approve" on ir-1 (Adebayo Ogunlesi Overtime)
5. Status badge changes from "Pending" (amber) to "Approved" (emerald)
6. Summary cards update: Pending decreases by 1, Approved increases by 1
7. Action buttons disappear for that row

**Error States / Edge Cases:**
- Rejected inputs show no action buttons (actions only for `pending`)
- Negative amounts display with red text and "(Ded)" suffix
- Hours and Rate show "--" when value is 0
- Search is case-insensitive on employee name and type
- Status update is client-side only (`useState` with state setter)

**Data Structures:**

```typescript
interface PayrollInput {
  id: string;
  employee: string;
  department: string;
  type: "Overtime" | "Bonus" | "Deduction" | "Commission" | "Reimbursement";
  hours: number;
  rate: number;
  amount: number;
  status: "pending" | "approved" | "rejected";
}
```

---

### US-21: View Payroll Computation Results

**As a** payroll administrator,
**I want to** view detailed computation results showing each employee's salary breakdown including PAYE tax, pension, and NHF deductions,
**So that** I can verify that payroll calculations are accurate before approval.

#### Screen: Payroll Management -- Computation Tab

**Route:** `/payroll` (Computation tab)

**Summary Cards (4 cards, grid `grid-cols-2 sm:grid-cols-4 gap-4`):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Gross | Calculator | "Total Gross" | `₦5,836,250` (sum of all gross) |
| Total Deductions | TrendingUp | "Total Deductions" | `₦1,427,025` (sum of all totalDed) |
| Total Net | DollarSign | "Total Net" | `₦4,409,225` (sum of all net) |
| Employees | Users | "Employees" | `4` |

**Computation Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Employee | Left | `font-medium` |
| Basic | Right | Plain amount |
| Allowances | Right | `text-muted-foreground` |
| Gross | Right | `font-medium` |
| PAYE | Right | `text-red-600`, prefixed with "-" |
| Pension | Right | `text-red-600`, prefixed with "-" |
| NHF | Right | `text-red-600`, prefixed with "-" |
| Total Ded. | Right | `text-red-600 font-medium`, prefixed with "-" |
| Net Pay | Right | `font-semibold` |

**Mock Data -- Computation (4 records):**

| ID | Employee | Basic | Allowances | Gross | PAYE | Pension | NHF | Total Ded. | Net |
|----|----------|-------|------------|-------|------|---------|-----|------------|-----|
| c-1 | Adebayo Ogunlesi | ₦1,000,000 | ₦450,000 | ₦1,450,000 | ₦195,000 | ₦116,000 | ₦25,000 | ₦336,000 | ₦1,114,000 |
| c-2 | Chioma Eze | ₦650,000 | ₦292,500 | ₦942,500 | ₦98,000 | ₦75,400 | ₦16,250 | ₦189,650 | ₦752,850 |
| c-3 | Emeka Nwosu | ₦2,150,000 | ₦967,500 | ₦3,117,500 | ₦548,000 | ₦249,400 | ₦53,750 | ₦851,150 | ₦2,266,350 |
| c-4 | Fatima Bello | ₦225,000 | ₦101,250 | ₦326,250 | ₦18,500 | ₦26,100 | ₦5,625 | ₦50,225 | ₦276,025 |

**User Actions:**
- View computed salary breakdowns for all employees
- Verify PAYE, pension, and NHF deductions are correct
- Review summary totals in cards above the table

**Success Flow:**
1. User clicks the "Computation" tab
2. Summary cards display aggregated totals
3. Table shows per-employee breakdown with all earnings and deductions
4. All deduction columns display in red with "-" prefix for visual clarity

**Error States / Edge Cases:**
- No search or filter controls on this tab (read-only view)
- All amounts are formatted with Naira symbol and thousands separator via `formatNaira()`

**Data Structures:**

```typescript
interface ComputationResult {
  id: string;
  employee: string;
  basic: number;
  allowances: number;
  gross: number;
  paye: number;
  pension: number;
  nhf: number;
  totalDed: number;
  net: number;
}
```

---

### US-22: Manage Payroll Approval Workflow

**As a** payroll administrator,
**I want to** manage a multi-step approval workflow for payroll runs,
**So that** payroll disbursement requires proper authorization from HR, Finance, and Management.

#### Screen: Payroll Management -- Approval Tab

**Route:** `/payroll` (Approval tab)

**Summary Cards (3 cards, grid `grid-cols-2 sm:grid-cols-3 gap-4`):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Pending Approvals | CheckSquare | "Pending Approvals" | Dynamically computed count |
| Waiting | AlertCircle | "Waiting" | Dynamically computed count |
| Completed | CheckSquare | "Completed" | Dynamically computed count (status `approved`) |

**Approval Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Period | Left | `font-medium` |
| Step | Left | Plain text (e.g., "HR Review", "Finance Review", "MD Approval") |
| Assignee | Left | `text-muted-foreground` |
| Gross Amount | Right | `font-medium` |
| Submitted | Left | `text-muted-foreground text-xs`, date formatted as "DD Mon YYYY" (en-NG), or "--" if empty |
| Status | Left | Status badge |
| Actions | Left | Approve/Reject buttons (only for `pending` items) |

**Approval Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `waiting` | Waiting | `bg-gray-50 border-gray-200` | `text-gray-700` |
| `approved` | Approved | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `rejected` | Rejected | `bg-red-50 border-red-200` | `text-red-700` |

**Mock Data -- Approvals (6 records):**

| ID | Period | Step | Assignee | Status | Submitted At | Gross Amount |
|----|--------|------|----------|--------|--------------|--------------|
| a-1 | March 2026 | HR Review | Halima Yusuf | pending | 2026-03-22T10:00:00 | ₦48,200,000 |
| a-2 | March 2026 | Finance Review | Emeka Nwosu | waiting | -- | ₦48,200,000 |
| a-3 | March 2026 | MD Approval | CEO | waiting | -- | ₦48,200,000 |
| a-4 | February 2026 | HR Review | Halima Yusuf | approved | 2026-02-22T10:00:00 | ₦47,800,000 |
| a-5 | February 2026 | Finance Review | Emeka Nwosu | approved | 2026-02-23T09:00:00 | ₦47,800,000 |
| a-6 | February 2026 | MD Approval | CEO | approved | 2026-02-24T11:00:00 | ₦47,800,000 |

**Cascading Approval Logic:**
When a step is approved, the system finds the next `waiting` step in the same period and promotes it to `pending`. This creates a sequential chain: HR Review -> Finance Review -> MD Approval.

**User Actions:**
- View all approval steps across payroll periods
- Click "Approve" to approve a pending step, which automatically unlocks the next step
- Click "Reject" to reject a pending step
- View historical approvals for completed periods

**Success Flow:**
1. User views the Approval tab
2. March 2026 shows: HR Review (pending), Finance Review (waiting), MD Approval (waiting)
3. February 2026 shows all three steps as approved
4. User clicks "Approve" on a-1 (HR Review, March 2026)
5. a-1 status changes to `approved`
6. a-2 (Finance Review) automatically changes from `waiting` to `pending`
7. Approve/Reject buttons now appear on the Finance Review row

**Error States / Edge Cases:**
- "Waiting" status items have no action buttons (must wait for prior step)
- If a step is rejected, subsequent steps remain in `waiting` status
- Cascading logic only promotes the first `waiting` item in the same period
- Submitted date column shows "--" for items that have not been submitted yet

**Data Structures:**

```typescript
interface ApprovalStep {
  id: string;
  period: string;
  step: string;
  assignee: string;
  status: "pending" | "waiting" | "approved" | "rejected";
  submittedAt: string;
  grossAmount: number;
}
```

---

### US-23: Manage Off-Cycle Payroll Runs

**As a** payroll administrator,
**I want to** create and manage off-cycle payroll runs for bonuses, settlements, and commissions,
**So that** special payments outside the regular payroll cycle can be processed.

#### Screen: Payroll Management -- Off-Cycle Tab

**Route:** `/payroll` (Off-Cycle tab)

**Header Row:**
- Description: `text-sm text-muted-foreground` -- "Create and manage off-cycle payroll runs for bonuses, settlements, and special payments"
- "New Off-Cycle Run" button: `Button size="sm"`, Plus icon + "New Off-Cycle Run". `alert("New off-cycle payroll run form would open here.")`

**Off-Cycle Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Name | Left | `font-medium` |
| Type | Left | `text-muted-foreground` |
| Employees | Left | Plain number |
| Total Amount | Right | `font-medium` |
| Created | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Off-Cycle Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `draft` | Draft | `bg-gray-50 border-gray-200` | `text-gray-700` |
| `processing` | Processing | `bg-blue-50 border-blue-200` | `text-blue-700` |
| `completed` | Completed | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |

**Mock Data -- Off-Cycle Runs (3 records):**

| ID | Name | Type | Employees | Total Amount | Created | Status |
|----|------|------|-----------|-------------|---------|--------|
| oc-1 | Bonus Payout - Q1 2026 | Bonus | 45 | ₦15,000,000 | 2026-03-20 | draft |
| oc-2 | Final Settlement - Feb Exits | Settlement | 3 | ₦2,800,000 | 2026-02-28 | completed |
| oc-3 | Commission Payout - Feb | Commission | 16 | ₦4,200,000 | 2026-02-25 | completed |

**User Actions:**
- View all off-cycle payroll runs in a table
- Click "New Off-Cycle Run" to create a new special payment run

**Success Flow:**
1. User clicks the "Off-Cycle" tab
2. Description text and "New Off-Cycle Run" button are displayed
3. Table shows 3 off-cycle runs with their types and statuses
4. User clicks "New Off-Cycle Run" button
5. Alert message displayed (placeholder for future form)

---

### US-24: Manage Payroll Adjustments

**As a** payroll administrator,
**I want to** create and track payroll adjustments including salary corrections, retroactive pay, deduction reversals, and tax corrections,
**So that** errors in previous payroll runs can be corrected transparently.

#### Screen: Payroll Management -- Adjustments Tab

**Route:** `/payroll` (Adjustments tab)

**Header Row:**
- Description: `text-sm text-muted-foreground` -- "Manage payroll corrections, retroactive adjustments, and reversals"
- "New Adjustment" button: `Button size="sm"`, PenTool icon + "New Adjustment". `alert("New payroll adjustment form would open here.")`

**Search Bar:**
Same pattern as Input Review: `relative max-w-sm`, Search icon, placeholder "Search adjustments...", `pl-9`.

**Adjustments Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Employee | Left | `font-medium` |
| Type | Left | Plain text |
| Description | Left | `text-muted-foreground text-xs` |
| Amount | Right | `font-medium`; positive in `text-emerald-600` with "+" prefix, negative in `text-red-600` with "-" prefix. Uses `Math.abs()` for display. |
| Period | Left | `text-muted-foreground` |
| Adjusted By | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Adjustment Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `applied` | Applied | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `reversed` | Reversed | `bg-red-50 border-red-200` | `text-red-700` |

**Mock Data -- Adjustments (4 records):**

| ID | Employee | Type | Description | Amount | Period | Adjusted By | Date | Status |
|----|----------|------|-------------|--------|--------|-------------|------|--------|
| adj-1 | Adebayo Ogunlesi | Salary Correction | Transport allowance under-calculated in Feb | +₦15,000 | February 2026 | Halima Yusuf | 2026-03-05 | applied |
| adj-2 | Fatima Bello | Retroactive Pay | Pay grade change effective Jan, applied in Mar | +₦75,000 | January 2026 | Emeka Nwosu | 2026-03-10 | applied |
| adj-3 | Gbenga Adeyemi | Deduction Reversal | Incorrect loan deduction reversed | +₦50,000 | February 2026 | Emeka Nwosu | 2026-03-12 | pending |
| adj-4 | Ibrahim Musa | Tax Correction | PAYE recalculation after relief update | -₦8,500 | March 2026 | System | 2026-03-22 | pending |

**User Actions:**
- Search adjustments by employee name or type
- Click "New Adjustment" to create a new payroll adjustment
- View adjustment history with amount, period, and responsible person

**Success Flow:**
1. User clicks the "Adjustments" tab
2. Description text and "New Adjustment" button appear
3. Table shows 4 adjustment records with color-coded amounts
4. Positive adjustments (corrections, reversals) display in emerald green with "+" prefix
5. Negative adjustments (tax corrections) display in red with "-" prefix

**Error States / Edge Cases:**
- Search is case-insensitive on employee name and type
- Amount sign determines color: positive = emerald, negative = red
- "System" can appear as the adjuster for automated corrections

---

### US-25: Configure Auto-Payroll

**As a** payroll administrator,
**I want to** configure and monitor auto-payroll settings and view execution history,
**So that** payroll can be automatically triggered on schedule without manual intervention.

#### Screen: Payroll Management -- Auto-Payroll Tab

**Route:** `/payroll` (Auto-Payroll tab)

**Configuration Card:**

Container: `rounded-xl border border-border bg-card p-6`.

| Element | Details |
|---------|---------|
| Title | "Auto-Payroll Configuration", `font-medium` |
| Status Badge | "Enabled" (emerald) or "Disabled" (gray), top-right |
| Schedule | "22nd of every month" |
| Next Run | "2026-04-22" |
| Auto-Approve | "No (Manual approval required)" |
| Notify Admin | "Yes" |
| Notify Employees | "Yes" |
| Edit button | `variant="outline" size="sm"`, Settings icon + "Edit Configuration" |

Configuration grid: `grid-cols-2 sm:grid-cols-3 gap-4 text-sm`. Labels in `text-muted-foreground`, values in `font-medium`.

**Execution Log Table:**

Container: `rounded-xl border border-border bg-card overflow-x-auto`. Header: `p-3 border-b border-border bg-muted/30`, title "Execution Log" (`font-medium text-sm`).

| Column | Alignment | Style |
|--------|-----------|-------|
| Date | Left | `text-muted-foreground text-xs`, formatted as "DD Mon YYYY, HH:MM" (en-NG locale) |
| Action | Left | `font-medium` |
| Details | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Log Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `success` | Success | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `failed` | Failed | `bg-red-50 border-red-200` | `text-red-700` |

**Mock Data -- Auto-Payroll Config:**

```
enabled: true
schedule: "22nd of every month"
nextRun: "2026-04-22"
autoApprove: false
notifyAdmin: true
notifyEmployees: true
```

**Mock Data -- Execution Log (5 records):**

| ID | Date | Action | Status | Details |
|----|------|--------|--------|---------|
| log-1 | 2026-03-22 09:00 | Auto-payroll triggered | success | March 2026 payroll run created (Draft) |
| log-2 | 2026-02-22 09:00 | Auto-payroll triggered | success | February 2026 payroll run created and processed |
| log-3 | 2026-01-22 09:00 | Auto-payroll triggered | success | January 2026 payroll run created and processed |
| log-4 | 2025-12-22 09:00 | Auto-payroll triggered | success | December 2025 payroll run created and processed |
| log-5 | 2025-11-22 09:00 | Auto-payroll failed | failed | Missing salary data for 3 new employees - required manual intervention |

**User Actions:**
- View auto-payroll configuration settings
- Click "Edit Configuration" to modify auto-payroll settings
- Review execution log for past auto-payroll events
- Identify failed runs and their reasons

**Success Flow:**
1. User clicks "Auto-Payroll" tab
2. Configuration card shows current settings with "Enabled" badge
3. Execution log table displays 5 entries chronologically
4. User can see that log-5 (Nov 2025) failed due to missing salary data
5. User clicks "Edit Configuration" to modify settings (placeholder alert)

---

## Screen 2: Payroll Configuration

### US-26: Manage Pay Grades

**As a** payroll administrator,
**I want to** view and manage pay grade tiers with salary ranges,
**So that** employees can be classified into appropriate compensation levels.

#### Screen: Payroll Configuration -- Pay Grades Tab

**Route:** `/payroll/config`

**Page Header:**

| Element | Type | Content | Behavior |
|---------|------|---------|----------|
| Page title | h1 | "Payroll Configuration" | `text-xl font-semibold tracking-tight` |
| Subtitle | p | "Manage pay grades, salary structures, and payroll schedules" | `text-sm text-muted-foreground` |
| Export button | Button (outline, sm) | Download icon + "Export" | `alert("Payroll configuration exported successfully.")` |
| Add New button | Button (primary, sm) | Plus icon + "Add New" | `alert("Add new pay grades form would open here.")` (label changes per active tab) |

**Tab Navigation (5 tabs):**

| Tab Key | Label | Icon |
|---------|-------|------|
| `pay-grades` | Pay Grades | Layers |
| `salary-structures` | Salary Structures | Banknote |
| `templates` | Allowances & Deductions | FileText |
| `calendar` | Payroll Calendar | Calendar |
| `assignments` | Assignments | UserCheck |

Tab styling: Same as payroll page tabs. `flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap`. Active: `border-primary text-primary`. Inactive: `border-transparent text-muted-foreground hover:text-foreground`. Icons: `w-4 h-4`.

**Pay Grades Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Grades | Layers | "Total Grades" | `9` |
| Total Employees | UserCheck | "Total Employees" | `156` (sum of all `employeeCount`) |
| Min Salary | Banknote | "Min Salary" | `₦75,000` (minimum of all `minSalary`) |
| Max Salary | Banknote | "Max Salary" | `₦7,000,000` (maximum of all `maxSalary`) |

Card styling: `rounded-xl border border-border bg-card p-4`. Icon + label: `text-muted-foreground`, `text-xs font-medium`. Value: `text-xl font-semibold`.

**Search Bar:**
`relative flex-1 max-w-sm`. Search icon at left. Placeholder: "Search pay grades...". `pl-9`.

**Pay Grades Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Grade | Left | `font-medium` |
| Level | Left | `text-muted-foreground` |
| Min Salary | Left | Formatted Naira |
| Mid Salary | Left | Formatted Naira |
| Max Salary | Left | Formatted Naira |
| Employees | Left | Plain number |
| Status | Left | Status badge |

**Pay Grade Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `active` | Active | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `inactive` | Inactive | `bg-gray-50 border-gray-200` | `text-gray-700` |

**Mock Data -- Pay Grades (9 records):**

| ID | Name | Level | Min Salary | Mid Salary | Max Salary | Employees | Status | Created |
|----|------|-------|-----------|-----------|-----------|-----------|--------|---------|
| pg-1 | Entry Level | 1 | ₦150,000 | ₦225,000 | ₦300,000 | 42 | active | 2025-01-15 |
| pg-2 | Junior | 2 | ₦300,000 | ₦400,000 | ₦500,000 | 35 | active | 2025-01-15 |
| pg-3 | Mid-Level | 3 | ₦500,000 | ₦650,000 | ₦800,000 | 28 | active | 2025-01-15 |
| pg-4 | Senior | 4 | ₦800,000 | ₦1,000,000 | ₦1,200,000 | 22 | active | 2025-01-15 |
| pg-5 | Lead | 5 | ₦1,200,000 | ₦1,500,000 | ₦1,800,000 | 14 | active | 2025-01-15 |
| pg-6 | Manager | 6 | ₦1,800,000 | ₦2,150,000 | ₦2,500,000 | 8 | active | 2025-01-15 |
| pg-7 | Director | 7 | ₦2,500,000 | ₦3,250,000 | ₦4,000,000 | 5 | active | 2025-01-15 |
| pg-8 | Executive | 8 | ₦4,000,000 | ₦5,500,000 | ₦7,000,000 | 2 | active | 2025-01-15 |
| pg-9 | Intern | 0 | ₦75,000 | ₦112,500 | ₦150,000 | 0 | inactive | 2025-06-01 |

**User Actions:**
- Search pay grades by name
- View salary ranges and employee counts per grade
- Click "Add New" to create a new pay grade
- Click "Export" to export configuration

**Success Flow:**
1. User navigates to `/payroll/config`
2. "Pay Grades" tab is active by default
3. Summary cards display aggregated data
4. Table shows all 9 pay grades
5. User types "senior" in search to filter
6. Only "Senior" grade row appears

**Error States / Edge Cases:**
- Empty state: FileText icon (`w-10 h-10 mx-auto mb-3 opacity-30`), "No items found", "Try adjusting your search or filters"
- Empty state uses `colSpan={7}` and `p-12 text-center text-muted-foreground`
- Search clears when switching between tabs
- Inactive grades (Intern) appear with gray badge

**Data Structures:**

```typescript
interface PayGrade {
  id: string;
  name: string;
  level: number;
  minSalary: number;
  maxSalary: number;
  midSalary: number;
  employeeCount: number;
  status: "active" | "inactive";
  createdAt: string;
}
```

---

### US-27: Manage Salary Structures

**As a** payroll administrator,
**I want to** define salary structures that map salary components to pay grades,
**So that** employee compensation packages are standardized and consistently applied.

#### Screen: Payroll Configuration -- Salary Structures Tab

**Route:** `/payroll/config` (Salary Structures tab)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Structures | Banknote | "Total Structures" | `5` |
| Active | ToggleLeft | "Active" | `4` |
| Assigned Employees | UserCheck | "Assigned Employees" | `100` (sum of `employeeCount` across all structures) |
| Drafts | FileText | "Drafts" | `1` |

**Filters Row:**
- Search bar: `flex-1 max-w-sm`, placeholder "Search structures..."
- Status dropdown: `Select` with `w-40` trigger. Options: All Status, Active, Draft, Archived.

Layout: `flex-col sm:flex-row gap-3 items-start sm:items-center`.

**Salary Structures Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Structure Name | Left | Name in `font-medium`, description in `text-xs text-muted-foreground` (stacked) |
| Pay Grade | Left | Plain text |
| Total Earnings | Left | Formatted Naira |
| Deductions | Left | `text-red-600` |
| Net Pay | Left | `font-medium` |
| Employees | Left | Plain number |
| Effective From | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Structure Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `active` | Active | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `draft` | Draft | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `archived` | Archived | `bg-gray-50 border-gray-200` | `text-gray-700` |

**Mock Data -- Salary Structures (5 records):**

| ID | Name | Description | Pay Grade | Total Earnings | Total Ded. | Net Pay | Employees | Effective From | Status |
|----|------|-------------|-----------|----------------|------------|---------|-----------|----------------|--------|
| ss-1 | Standard Entry Level | Default salary structure for entry-level employees | Entry Level | ₦225,000 | ₦33,750 | ₦191,250 | 42 | 2025-01-01 | active |
| ss-2 | Standard Mid-Level | Salary structure for mid-level professionals | Mid-Level | ₦650,000 | ₦97,500 | ₦552,500 | 28 | 2025-01-01 | active |
| ss-3 | Senior Professional | Comprehensive package for senior employees | Senior | ₦1,000,000 | ₦150,000 | ₦850,000 | 22 | 2025-01-01 | active |
| ss-4 | Management Package | Executive compensation structure for managers | Manager | ₦2,150,000 | ₦322,500 | ₦1,827,500 | 8 | 2025-01-01 | active |
| ss-5 | Director Package (Draft) | New structure pending approval | Director | ₦3,250,000 | ₦487,500 | ₦2,762,500 | 0 | 2026-04-01 | draft |

**Salary Components (referenced in structures):**

| ID | Name | Type | Category | Calculation | Value | % Of | Taxable | Status |
|----|------|------|----------|-------------|-------|------|---------|--------|
| sc-1 | Basic Salary | earning | basic | percentage | 50% | gross | Yes | active |
| sc-2 | Housing Allowance | earning | allowance | percentage | 20% | basic | Yes | active |
| sc-3 | Transport Allowance | earning | allowance | percentage | 15% | basic | Yes | active |
| sc-4 | Meal Allowance | earning | allowance | fixed | ₦25,000 | -- | No | active |
| sc-5 | Utility Allowance | earning | allowance | percentage | 10% | basic | Yes | active |
| sc-6 | PAYE Tax | deduction | statutory | percentage | 0% | -- | No | active |
| sc-7 | Pension (Employee) | deduction | statutory | percentage | 8% | basic | No | active |
| sc-8 | NHF | deduction | statutory | percentage | 2.5% | basic | No | active |
| sc-9 | Health Insurance | deduction | voluntary | fixed | ₦15,000 | -- | No | active |

**User Actions:**
- Search structures by name or pay grade name
- Filter by status (All, Active, Draft, Archived)
- Click "Add New" to create a new salary structure
- Click "Export" to export configuration

**Success Flow:**
1. User clicks "Salary Structures" tab
2. Summary cards show structure counts
3. Table displays all 5 structures
4. User selects "Draft" from status dropdown
5. Only "Director Package (Draft)" row is displayed
6. User clears filter back to "All Status"

**Error States / Edge Cases:**
- Combined search + status filter narrows results
- Draft structures show 0 employees
- Deductions column always renders in `text-red-600`

**Data Structures:**

```typescript
interface SalaryComponent {
  id: string;
  name: string;
  type: "earning" | "deduction";
  category: "basic" | "allowance" | "bonus" | "statutory" | "voluntary";
  calculationType: "fixed" | "percentage";
  value: number;
  percentageOf?: string;
  taxable: boolean;
  status: "active" | "inactive";
}

interface SalaryStructure {
  id: string;
  name: string;
  description: string;
  payGradeId: string;
  payGradeName: string;
  components: SalaryComponent[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  employeeCount: number;
  status: "active" | "draft" | "archived";
  effectiveFrom: string;
  createdAt: string;
}
```

---

### US-28: Manage Allowance & Deduction Templates

**As a** payroll administrator,
**I want to** configure reusable allowance and deduction templates with calculation rules,
**So that** standard pay components can be consistently applied across salary structures.

#### Screen: Payroll Configuration -- Allowances & Deductions Tab

**Route:** `/payroll/config` (Templates tab)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Templates | FileText | "Total Templates" | `11` |
| Allowances | Plus | "Allowances" | `5` |
| Deductions | Percent | "Deductions" | `6` |
| Statutory | ToggleLeft | "Statutory" | `4` |

**Filters Row:**
- Search bar: placeholder "Search templates..."
- Type dropdown: `Select w-40`. Options: All Types, Allowances, Deductions.

**Templates Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Name | Left | Name in `font-medium`, description in `text-xs text-muted-foreground` (stacked) |
| Type | Left | Colored badge: allowance = `bg-emerald-50 border-emerald-200 text-emerald-700`, deduction = `bg-red-50 border-red-200 text-red-700` |
| Category | Left | `text-muted-foreground` |
| Calculation | Left | `text-muted-foreground capitalize` |
| Default Value | Left | Fixed: formatted as Naira. Percentage: `{value}%`. If `percentageOf` exists, appended as `of {percentageOf}` |
| Taxable | Left | Yes in `text-amber-600`, No in `text-muted-foreground` |
| Statutory | Left | Yes in `text-blue-600`, No in `text-muted-foreground` |
| Applies To | Left | `text-muted-foreground capitalize`, hyphens replaced with spaces |
| Status | Left | Status badge (uses `PAY_GRADE_STATUS_STYLES`) |

**Mock Data -- Templates (11 records):**

| ID | Name | Type | Category | Calc. Type | Default Value | % Of | Taxable | Statutory | Description | Applies To | Status |
|----|------|------|----------|------------|---------------|------|---------|-----------|-------------|-----------|--------|
| t-1 | Housing Allowance | allowance | Housing | percentage | 20% | basic | Yes | No | Standard housing allowance | all | active |
| t-2 | Transport Allowance | allowance | Transport | percentage | 15% | basic | Yes | No | Monthly transport allowance | all | active |
| t-3 | Meal Allowance | allowance | Meals | fixed | ₦25,000 | -- | No | No | Daily meal subsidy | all | active |
| t-4 | Leave Allowance | allowance | Leave | percentage | 10% | basic | Yes | No | Annual leave allowance | all | active |
| t-5 | 13th Month | allowance | Bonus | percentage | 100% | basic | Yes | No | Year-end 13th month salary | all | active |
| t-6 | PAYE Tax | deduction | Tax | percentage | 0% | -- | No | Yes | Pay-As-You-Earn income tax | all | active |
| t-7 | Pension (Employee 8%) | deduction | Pension | percentage | 8% | basic+housing+transport | No | Yes | Employee pension contribution | all | active |
| t-8 | Pension (Employer 10%) | deduction | Pension | percentage | 10% | basic+housing+transport | No | Yes | Employer pension contribution | all | active |
| t-9 | NHF | deduction | NHF | percentage | 2.5% | basic | No | Yes | National Housing Fund | all | active |
| t-10 | Health Insurance (HMO) | deduction | Insurance | fixed | ₦15,000 | -- | No | No | Health maintenance organization | all | active |
| t-11 | Cooperative Deduction | deduction | Voluntary | fixed | ₦0 | -- | No | No | Staff cooperative society | specific-grades | active |

**User Actions:**
- Search templates by name or category
- Filter by type (All, Allowances, Deductions)
- Click "Add New" to create a new template
- Click "Export" to export templates

**Success Flow:**
1. User clicks "Allowances & Deductions" tab
2. Summary cards show counts of templates by type
3. Table displays all 11 templates with type badges
4. User selects "Deductions" from type dropdown
5. Only 6 deduction rows are displayed
6. User searches "pension" to further narrow results

**Error States / Edge Cases:**
- Templates with `percentageOf` show value as `{value}% of {percentageOf}` (e.g., "8% of basic+housing+transport")
- PAYE Tax has 0% default because it is calculated dynamically using tax bands
- Cooperative Deduction has ₦0 default and applies to `specific-grades` only

**Data Structures:**

```typescript
interface AllowanceDeductionTemplate {
  id: string;
  name: string;
  type: "allowance" | "deduction";
  category: string;
  calculationType: "fixed" | "percentage";
  defaultValue: number;
  percentageOf?: string;
  taxable: boolean;
  statutory: boolean;
  description: string;
  applicableTo: "all" | "specific-grades";
  status: "active" | "inactive";
}
```

---

### US-29: View and Manage Payroll Calendar

**As a** payroll administrator,
**I want to** view the payroll calendar with all pay periods, cutoff dates, processing dates, and pay dates,
**So that** I can plan payroll operations and ensure timely salary disbursement.

#### Screen: Payroll Configuration -- Payroll Calendar Tab

**Route:** `/payroll/config` (Calendar tab)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Frequency | Calendar | "Frequency" | "Monthly" |
| Pay Day | Banknote | "Pay Day" | "25th of month" |
| Processed | Settings2 | "Processed" | "2 / 12" |
| Open Periods | ToggleLeft | "Open Periods" | "1" |

**Calendar Configuration Card:**

Container: `rounded-xl border border-border bg-card p-4`.

| Element | Details |
|---------|---------|
| Title | "Calendar: Monthly Payroll 2026", `font-medium` |
| Status Badge | "Active" badge (emerald), top-right |
| Cutoff Day | "20th" |
| Processing Day | "22nd" |
| Pay Day | "25th" |

Configuration info grid: `grid-cols-3 gap-3 text-sm mb-4`. Labels in `text-muted-foreground`, values in `font-medium`.

**Payroll Periods Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Period | Left | `font-medium` |
| Start Date | Left | `text-muted-foreground` |
| End Date | Left | `text-muted-foreground` |
| Cutoff | Left | `text-muted-foreground` |
| Processing | Left | `text-muted-foreground` |
| Pay Date | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Period Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `upcoming` | Upcoming | `bg-blue-50 border-blue-200` | `text-blue-700` |
| `open` | Open | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `closed` | Closed | `bg-gray-50 border-gray-200` | `text-gray-700` |
| `processed` | Processed | `bg-violet-50 border-violet-200` | `text-violet-700` |

**Mock Data -- Payroll Calendar:**

```
id: "cal-1"
name: "Monthly Payroll 2026"
frequency: "monthly"
payDay: 25
cutoffDay: 20
processingDay: 22
year: 2026
status: "active"
```

**Mock Data -- Payroll Periods (12 records):**

| ID | Period Name | Start Date | End Date | Cutoff | Processing | Pay Date | Status |
|----|------------|------------|----------|--------|------------|----------|--------|
| p-01 | January 2026 | 2026-01-01 | 2026-01-31 | 2026-01-20 | 2026-01-22 | 2026-01-25 | processed |
| p-02 | February 2026 | 2026-02-01 | 2026-02-28 | 2026-02-20 | 2026-02-22 | 2026-02-25 | processed |
| p-03 | March 2026 | 2026-03-01 | 2026-03-31 | 2026-03-20 | 2026-03-22 | 2026-03-25 | open |
| p-04 | April 2026 | 2026-04-01 | 2026-04-30 | 2026-04-20 | 2026-04-22 | 2026-04-25 | upcoming |
| p-05 | May 2026 | 2026-05-01 | 2026-05-31 | 2026-05-20 | 2026-05-22 | 2026-05-25 | upcoming |
| p-06 | June 2026 | 2026-06-01 | 2026-06-30 | 2026-06-20 | 2026-06-22 | 2026-06-25 | upcoming |
| p-07 | July 2026 | 2026-07-01 | 2026-07-31 | 2026-07-20 | 2026-07-22 | 2026-07-25 | upcoming |
| p-08 | August 2026 | 2026-08-01 | 2026-08-31 | 2026-08-20 | 2026-08-22 | 2026-08-25 | upcoming |
| p-09 | September 2026 | 2026-09-01 | 2026-09-30 | 2026-09-20 | 2026-09-22 | 2026-09-25 | upcoming |
| p-10 | October 2026 | 2026-10-01 | 2026-10-31 | 2026-10-20 | 2026-10-22 | 2026-10-25 | upcoming |
| p-11 | November 2026 | 2026-11-01 | 2026-11-30 | 2026-11-20 | 2026-11-22 | 2026-11-25 | upcoming |
| p-12 | December 2026 | 2026-12-01 | 2026-12-31 | 2026-12-20 | 2026-12-22 | 2026-12-25 | upcoming |

**User Actions:**
- View calendar configuration details (frequency, cutoff, processing, pay day)
- Browse all 12 monthly periods with their dates and statuses
- Click "Add New" to create a new calendar
- Click "Export" to export calendar data

**Success Flow:**
1. User clicks "Payroll Calendar" tab
2. Summary cards show frequency, pay day, processed count, and open periods
3. Configuration card displays calendar settings with Active badge
4. Periods table shows all 12 months: 2 processed, 1 open, 9 upcoming

**Error States / Edge Cases:**
- No search or filter on this tab (displays all periods)
- Calendar tab has no search bar (unlike other tabs)

**Data Structures:**

```typescript
interface PayrollCalendar {
  id: string;
  name: string;
  frequency: "monthly" | "bi-weekly" | "weekly";
  payDay: number;
  cutoffDay: number;
  processingDay: number;
  year: number;
  periods: PayrollPeriod[];
  status: "active" | "inactive";
}

interface PayrollPeriod {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  cutoffDate: string;
  processingDate: string;
  payDate: string;
  status: "upcoming" | "open" | "closed" | "processed";
}
```

---

### US-30: Manage Salary Assignments

**As a** payroll administrator,
**I want to** assign salary structures to employees and track their compensation details,
**So that** each employee's pay is correctly calculated based on their assigned structure.

#### Screen: Payroll Configuration -- Assignments Tab

**Route:** `/payroll/config` (Assignments tab)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Assignments | UserCheck | "Total Assignments" | `8` |
| Active | ToggleLeft | "Active" | `6` |
| Pending | Settings2 | "Pending" | `1` |
| Total Monthly Gross | Banknote | "Total Monthly Gross" | Sum of `grossPay` for active assignments only |

**Filters Row:**
- Search bar: placeholder "Search employees or structures..."
- Status dropdown: Options: All Status, Active, Pending, Expired.

**Assignments Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Employee | Left | Name in `font-medium`, employee ID in `text-xs text-muted-foreground` (stacked) |
| Department | Left | `text-muted-foreground` |
| Structure | Left | Plain text |
| Pay Grade | Left | `text-muted-foreground` |
| Basic Salary | Left | Formatted Naira |
| Gross Pay | Left | `font-medium` |
| Effective From | Left | `text-muted-foreground` |
| Status | Left | Status badge |

**Assignment Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `active` | Active | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `expired` | Expired | `bg-gray-50 border-gray-200` | `text-gray-700` |

**Mock Data -- Salary Assignments (8 records):**

| ID | Employee ID | Employee Name | Department | Structure | Pay Grade | Basic Salary | Gross Pay | Effective From | Status |
|----|-------------|---------------|------------|-----------|-----------|-------------|-----------|----------------|--------|
| sa-1 | EMP-001 | Adebayo Ogunlesi | Engineering | Senior Professional | Senior | ₦1,000,000 | ₦1,450,000 | 2025-03-01 | active |
| sa-2 | EMP-002 | Chioma Eze | Product | Standard Mid-Level | Mid-Level | ₦650,000 | ₦942,500 | 2025-01-01 | active |
| sa-3 | EMP-003 | Emeka Nwosu | Finance | Management Package | Manager | ₦2,150,000 | ₦3,117,500 | 2025-06-01 | active |
| sa-4 | EMP-004 | Fatima Bello | HR | Standard Entry Level | Entry Level | ₦225,000 | ₦326,250 | 2025-09-01 | active |
| sa-5 | EMP-005 | Gbenga Adeyemi | Marketing | Standard Mid-Level | Mid-Level | ₦700,000 | ₦1,015,000 | 2025-04-01 | active |
| sa-6 | EMP-006 | Halima Yusuf | Engineering | Senior Professional | Senior | ₦1,100,000 | ₦1,595,000 | 2025-01-01 | active |
| sa-7 | EMP-007 | Ibrahim Musa | Operations | Standard Entry Level | Entry Level | ₦200,000 | ₦290,000 | 2026-01-15 | pending |
| sa-8 | EMP-008 | Joy Okafor | Legal | Standard Mid-Level | Mid-Level | ₦600,000 | ₦870,000 | 2024-06-01 | expired |

**User Actions:**
- Search assignments by employee name, structure name, or department
- Filter by status (All, Active, Pending, Expired)
- Click "Add New" to create a new salary assignment
- Click "Export" to export assignment data

**Success Flow:**
1. User clicks "Assignments" tab
2. Summary cards show total assignments and aggregated gross
3. Table displays all 8 assignments with compensation details
4. User filters by "Active" to see only 6 active assignments
5. "Total Monthly Gross" card sums only active assignment gross values

**Error States / Edge Cases:**
- Total Monthly Gross card only considers `active` status assignments
- Search is case-insensitive across employee name, structure name, and department
- Employee ID is displayed below employee name for identification

**Data Structures:**

```typescript
interface SalaryAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  structureId: string;
  structureName: string;
  payGradeName: string;
  basicSalary: number;
  grossPay: number;
  effectiveFrom: string;
  status: "active" | "pending" | "expired";
}
```

---

## Screen 3: Statutory Compliance

### US-31: View PAYE Tax Configuration

**As a** payroll administrator,
**I want to** view the PAYE tax configuration including tax bands and relief amounts,
**So that** I can verify that employee income tax is calculated according to Nigerian tax law.

#### Screen: Statutory Compliance -- PAYE Tax Tab

**Route:** `/payroll/compliance`

**Page Header:**

| Element | Type | Content | Behavior |
|---------|------|---------|----------|
| Page title | h1 | "Statutory Compliance" | `text-xl font-semibold tracking-tight` |
| Subtitle | p | "Tax configuration, pension, and statutory deduction management" | `text-sm text-muted-foreground` |
| Export button | Button (outline, sm) | Download icon + "Export" | `alert("Statutory compliance data exported successfully.")` |

**Tab Navigation (4 tabs):**

| Tab Key | Label | Icon |
|---------|-------|------|
| `paye` | PAYE Tax | Landmark |
| `pension` | Pension | Building2 |
| `statutory-bodies` | NHF / ITF / NSITF / NHIS | Shield |
| `overview` | Compliance Overview | BarChart3 |

Default active tab: `"overview"`.

**PAYE Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Tax Bands | Landmark | "Tax Bands" | `6` |
| CRA | Shield | "CRA" | `₦200,000` |
| GI Relief | BarChart3 | "GI Relief" | `20%` |
| Effective From | Clock | "Effective From" | `2026-01-01` |

**PAYE Configuration Card:**

Container: `rounded-xl border border-border bg-card p-4`.

| Element | Details |
|---------|---------|
| Title | "Nigeria PAYE 2026", `font-medium` |
| Status Badge | "Active" (emerald), top-right |
| Consolidated Relief | ₦200,000 |
| GI Relief Rate | 20% |
| Minimum Tax Rate | 1% |
| Effective From | 2026-01-01 |

Grid layout: `grid-cols-2 sm:grid-cols-4 gap-4 text-sm`. Labels in `text-muted-foreground`, values in `font-medium`.

**PAYE Config Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `active` | Active | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `draft` | Draft | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `expired` | Expired | `bg-gray-50 border-gray-200` | `text-gray-700` |

**Tax Bands Table:**

Container: `rounded-xl border border-border bg-card overflow-x-auto`. Sub-header: `p-3 border-b border-border bg-muted/30`, title "Tax Bands" (`font-medium text-sm`).

| Column | Alignment | Style |
|--------|-----------|-------|
| Band | Left | `font-medium` |
| Income Range | Left | `text-muted-foreground`, formatted as "₦{min} -- {₦max / Above}" |
| Rate | Left | `font-medium`, percentage |

**Mock Data -- PAYE Configuration:**

```
id: "paye-1"
name: "Nigeria PAYE 2026"
effectiveFrom: "2026-01-01"
consolidatedRelief: 200000
grossIncomeRelief: 20
minimumTax: 0
minimumTaxRate: 1
status: "active"
```

**Mock Data -- Tax Bands (6 records):**

| ID | Description | Min | Max | Rate |
|----|-------------|-----|-----|------|
| tb-1 | First ₦300,000 | ₦0 | ₦300,000 | 7% |
| tb-2 | Next ₦300,000 | ₦300,001 | ₦600,000 | 11% |
| tb-3 | Next ₦500,000 | ₦600,001 | ₦1,100,000 | 15% |
| tb-4 | Next ₦500,000 | ₦1,100,001 | ₦1,600,000 | 19% |
| tb-5 | Next ₦1,600,000 | ₦1,600,001 | ₦3,200,000 | 21% |
| tb-6 | Above ₦3,200,000 | ₦3,200,001 | null (Above) | 24% |

**User Actions:**
- View PAYE tax configuration including relief amounts
- Browse all 6 progressive tax bands
- Click "Export" to export compliance data

**Success Flow:**
1. User navigates to `/payroll/compliance`
2. Default tab is "Compliance Overview"; user clicks "PAYE Tax" tab
3. Summary cards display tax band count and relief values
4. Configuration card shows full PAYE settings with Active badge
5. Tax bands table shows Nigeria's progressive income tax structure

**Data Structures:**

```typescript
interface PAYETaxBand {
  id: string;
  min: number;
  max: number | null;
  rate: number;
  description: string;
}

interface PAYEConfig {
  id: string;
  name: string;
  effectiveFrom: string;
  consolidatedRelief: number;
  grossIncomeRelief: number;
  taxBands: PAYETaxBand[];
  minimumTax: number;
  minimumTaxRate: number;
  status: "active" | "draft" | "expired";
}
```

---

### US-32: View Pension Configuration

**As a** payroll administrator,
**I want to** view pension fund administrator (PFA) configurations with contribution rates,
**So that** I can ensure pension deductions comply with Nigerian Pension Reform Act.

#### Screen: Statutory Compliance -- Pension Tab

**Route:** `/payroll/compliance` (Pension tab)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| PFAs Configured | Building2 | "PFAs Configured" | `3` |
| Employee Rate | Shield | "Employee Rate" | `8%` |
| Employer Rate | Shield | "Employer Rate" | `10%` |
| Active | CheckCircle2 | "Active" | `3` |

**Pension Configurations Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| PFA | Left | `font-medium` |
| PFA Code | Left | `text-muted-foreground` |
| Employee % | Left | Plain number + "%" |
| Employer % | Left | Plain number + "%" |
| Voluntary % | Left | Plain number + "%" |
| Computation Base | Left | `text-muted-foreground`, array joined with " + " |
| Effective From | Left | `text-muted-foreground` |
| Status | Left | Inline badge: active = `bg-emerald-50 border-emerald-200 text-emerald-700`, inactive = `bg-gray-50 border-gray-200 text-gray-700` |

**Mock Data -- Pension Configurations (3 records):**

| ID | PFA | PFA Code | Employee % | Employer % | Voluntary % | Computation Base | RSA Number | Effective From | Status |
|----|-----|----------|------------|------------|-------------|-----------------|------------|----------------|--------|
| pen-1 | ARM Pension Managers | ARM001 | 8% | 10% | 0% | Basic + Housing + Transport | PEN100264732891 | 2025-01-01 | active |
| pen-2 | Stanbic IBTC Pension | STB002 | 8% | 10% | 2% | Basic + Housing + Transport | PEN100398271645 | 2025-01-01 | active |
| pen-3 | Leadway Pensure PFA | LDW003 | 8% | 10% | 0% | Basic + Housing + Transport | PEN100512389076 | 2025-06-01 | active |

**User Actions:**
- View all configured PFAs with their contribution rates
- Compare employee, employer, and voluntary contribution percentages
- Verify computation base for each PFA

**Success Flow:**
1. User clicks "Pension" tab
2. Summary cards show PFA count and standard rates
3. Table displays 3 PFA configurations
4. User can see that Stanbic IBTC has an additional 2% voluntary contribution

**Data Structures:**

```typescript
interface PensionConfig {
  id: string;
  pfa: string;
  pfaCode: string;
  employeeRate: number;
  employerRate: number;
  voluntaryRate: number;
  computationBase: string[];
  rsaNumber: string;
  effectiveFrom: string;
  status: "active" | "inactive";
}
```

---

### US-33: View Statutory Bodies (NHF / ITF / NSITF / NHIS)

**As a** payroll administrator,
**I want to** view all statutory body configurations with rates, remittance schedules, and compliance statuses,
**So that** I can ensure the organization meets all statutory deduction and remittance obligations.

#### Screen: Statutory Compliance -- NHF / ITF / NSITF / NHIS Tab

**Route:** `/payroll/compliance` (Statutory Bodies tab)

**Statutory Body Cards (4 cards, `grid-cols-2 sm:grid-cols-4 gap-4`):**

Each card: `rounded-xl border border-border bg-card p-4`.

| Element | Details |
|---------|---------|
| Code | `text-xs font-medium text-muted-foreground`, top-left |
| Compliance Badge | Status badge, top-right |
| Name | `text-sm font-medium mb-1` |
| Rate info | `text-xs text-muted-foreground` -- "Rate: {rate}% of {computationBase}" |
| Next Due | `text-xs text-muted-foreground` -- "Next Due: {nextDueDate}" |

**Compliance Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `compliant` | Compliant | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `due-soon` | Due Soon | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `overdue` | Overdue | `bg-red-50 border-red-200` | `text-red-700` |
| `not-applicable` | N/A | `bg-gray-50 border-gray-200` | `text-gray-700` |

**Statutory Bodies Detail Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Body | Left | `font-medium` |
| Code | Left | `text-muted-foreground` |
| Rate | Left | Percentage |
| Employer % | Left | Percentage |
| Employee % | Left | Percentage |
| Frequency | Left | `text-muted-foreground capitalize` |
| Next Due | Left | `text-muted-foreground` |
| Status | Left | Compliance status badge |

**Mock Data -- Statutory Bodies (4 records):**

| ID | Name | Code | Rate | Base | Employer % | Employee % | Max | Effective | Frequency | Status | Last Remittance | Next Due | Compliance |
|----|------|------|------|------|-----------|-----------|-----|-----------|-----------|--------|----------------|----------|------------|
| sb-1 | National Housing Fund | NHF | 2.5% | Basic Salary | 0% | 2.5% | null | 2025-01-01 | monthly | active | 2026-02-28 | 2026-03-31 | due-soon |
| sb-2 | Industrial Training Fund | ITF | 1% | Total Payroll | 1% | 0% | null | 2025-01-01 | quarterly | active | 2025-12-31 | 2026-03-31 | due-soon |
| sb-3 | Nigeria Social Insurance Trust Fund | NSITF | 1% | Total Payroll | 1% | 0% | null | 2025-01-01 | monthly | active | 2026-02-28 | 2026-03-31 | compliant |
| sb-4 | National Health Insurance Scheme | NHIS | 15% | Basic Salary | 10% | 5% | null | 2025-01-01 | monthly | active | 2026-01-31 | 2026-03-31 | overdue |

**User Actions:**
- View statutory body summary cards with compliance badges
- Review detailed rate and remittance information in the table
- Identify which bodies are compliant, due soon, or overdue

**Success Flow:**
1. User clicks "NHF / ITF / NSITF / NHIS" tab
2. Four summary cards show each body with its compliance status
3. NHIS card shows "Overdue" in red, NHF and ITF show "Due Soon" in amber, NSITF shows "Compliant" in green
4. Detail table below shows full rate breakdowns and remittance frequency

**Error States / Edge Cases:**
- NHIS has last remittance in January but next due in March, so it is overdue (missed February)
- NHF is employee-only (0% employer), while ITF and NSITF are employer-only (0% employee)

**Data Structures:**

```typescript
interface StatutoryBody {
  id: string;
  name: string;
  code: string;
  rate: number;
  computationBase: string;
  employerPortion: number;
  employeePortion: number;
  maxContribution: number | null;
  effectiveFrom: string;
  remittanceFrequency: "monthly" | "quarterly" | "annually";
  status: "active" | "inactive";
  lastRemittanceDate: string | null;
  nextDueDate: string;
  complianceStatus: "compliant" | "due-soon" | "overdue" | "not-applicable";
}
```

---

### US-34: View Compliance Overview and Payment Tracking

**As a** payroll administrator,
**I want to** view a consolidated compliance overview showing all statutory payment obligations with amounts, due dates, and filing statuses,
**So that** I can ensure timely remittance and avoid penalties for late filing.

#### Screen: Statutory Compliance -- Compliance Overview Tab

**Route:** `/payroll/compliance` (Overview tab -- default)

**Summary Cards (4 cards):**

| Card | Icon | Label | Value |
|------|------|-------|-------|
| Total Outstanding | Landmark | "Total Outstanding" | Sum of all `balance` values across all records |
| Overdue | AlertTriangle | "Overdue" | Count of records with `status === "overdue"` |
| Paid This Period | CheckCircle2 | "Paid This Period" | Count of records with `status === "paid"` |
| Pending | Clock | "Pending" | Count of records with `status === "pending"` |

**Filters Row:**
- Search bar: placeholder "Search..."
- Status dropdown: Options: All Status, Paid, Pending, Overdue, Partial.

Layout: `flex-col sm:flex-row gap-3 items-start sm:items-center`.

**Compliance Overview Table:**

| Column | Alignment | Style |
|--------|-----------|-------|
| Body | Left | `font-medium` |
| Period | Left | `text-muted-foreground` |
| Amount Due | Left | Formatted Naira |
| Amount Paid | Left | Formatted Naira |
| Balance | Left | `font-medium`; positive balance in `text-red-600`, zero balance in `text-emerald-600` |
| Due Date | Left | `text-muted-foreground` |
| Filed Date | Left | `text-muted-foreground`, or "--" if null |
| Status | Left | Payment status badge |

**Payment Status Badge Styles:**

| Status | Label | Background | Text |
|--------|-------|------------|------|
| `paid` | Paid | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `pending` | Pending | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `overdue` | Overdue | `bg-red-50 border-red-200` | `text-red-700` |
| `partial` | Partial | `bg-blue-50 border-blue-200` | `text-blue-700` |

**Mock Data -- Compliance Overview (10 records):**

| ID | Body | Period | Amount Due | Amount Paid | Balance | Due Date | Status | Filed Date |
|----|------|--------|-----------|-------------|---------|----------|--------|------------|
| co-1 | PAYE | March 2026 | ₦14,250,000 | ₦0 | ₦14,250,000 | 2026-04-10 | pending | null |
| co-2 | Pension | March 2026 | ₦8,650,000 | ₦0 | ₦8,650,000 | 2026-04-07 | pending | null |
| co-3 | NHF | March 2026 | ₦1,205,000 | ₦0 | ₦1,205,000 | 2026-03-31 | pending | null |
| co-4 | NHIS | February 2026 | ₦2,400,000 | ₦0 | ₦2,400,000 | 2026-03-15 | overdue | null |
| co-5 | PAYE | February 2026 | ₦13,980,000 | ₦13,980,000 | ₦0 | 2026-03-10 | paid | 2026-03-08 |
| co-6 | Pension | February 2026 | ₦8,520,000 | ₦8,520,000 | ₦0 | 2026-03-07 | paid | 2026-03-05 |
| co-7 | ITF | Q1 2026 | ₦4,820,000 | ₦0 | ₦4,820,000 | 2026-03-31 | pending | null |
| co-8 | NSITF | February 2026 | ₦482,000 | ₦482,000 | ₦0 | 2026-03-15 | paid | 2026-03-12 |
| co-9 | NHF | February 2026 | ₦1,180,000 | ₦1,180,000 | ₦0 | 2026-02-28 | paid | 2026-02-25 |
| co-10 | NHIS | January 2026 | ₦2,350,000 | ₦2,350,000 | ₦0 | 2026-02-15 | paid | 2026-02-14 |

**User Actions:**
- Search compliance records by body name or period
- Filter by payment status (All, Paid, Pending, Overdue, Partial)
- Identify overdue obligations requiring immediate action
- View filing dates for completed payments
- Click "Export" to export compliance data

**Success Flow:**
1. User navigates to `/payroll/compliance` (Overview tab is default)
2. Summary cards show: total outstanding balance, 1 overdue, 5 paid, 4 pending
3. Table displays all 10 compliance records
4. User selects "Overdue" from status dropdown
5. Only NHIS February 2026 (₦2,400,000 balance) is displayed
6. User clears filter, searches "pension" to see pension-related entries only

**Error States / Edge Cases:**
- Empty state: FileText icon (`w-10 h-10 mx-auto mb-3 opacity-30`), "No records found"
- Empty state uses `colSpan={8}` and `p-12 text-center text-muted-foreground`
- Balance of ₦0 renders in `text-emerald-600`, positive balance renders in `text-red-600`
- Filed Date shows "--" for unfiled (null) records
- Search is case-insensitive on body and period fields
- ITF uses quarterly period naming ("Q1 2026") unlike monthly bodies

**Data Structures:**

```typescript
interface ComplianceOverviewItem {
  id: string;
  body: string;
  period: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "partial";
  filedDate: string | null;
}
```

---

## Shared Utility: Naira Formatting

All monetary values across the payroll module use the `formatNaira()` utility:

```typescript
function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
```

This produces output like `₦48,200,000`, `₦850,000`, etc.

---

## Shared UI Components

### SummaryCard

Used across all payroll screens for KPI display:

```typescript
function SummaryCard({ icon: Icon, label, value }: {
  icon: typeof Settings2;
  label: string;
  value: string;
}) {
  // Container: rounded-xl border border-border bg-card p-4
  // Icon + label row: flex items-center gap-2 text-muted-foreground mb-1
  // Icon: w-4 h-4
  // Label: text-xs font-medium
  // Value: text-xl font-semibold
}
```

### SearchBar

Used across multiple tabs:

```typescript
function SearchBar({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  // Container: relative flex-1 max-w-sm
  // Search icon: absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground
  // Input: pl-9
}
```

### StatusBadge

Used for all status displays:

```typescript
function StatusBadge({ style }: {
  style: { label: string; bg: string; color: string } | undefined;
}) {
  // span: inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
  // + style.bg + style.color
}
```

### EmptyRow

Used for empty table states:

```typescript
function EmptyRow({ colSpan }: { colSpan: number }) {
  // td: colSpan={colSpan} p-12 text-center text-muted-foreground
  // FileText icon: w-10 h-10 mx-auto mb-3 opacity-30
  // "No items found" (font-medium)
  // "Try adjusting your search or filters" (text-xs mt-1)
}
```

---

## Complete Payroll Module Route Map

```
/payroll                          Payroll Management
  ├── Tab: Payroll Runs           US-18 - View payroll runs, process payroll
  ├── Tab: Payslips               US-19 - View employee payslips per run
  ├── Tab: Input Review           US-20 - Approve/reject payroll inputs
  ├── Tab: Computation            US-21 - View computed salary breakdowns
  ├── Tab: Approval               US-22 - Multi-step approval workflow
  ├── Tab: Off-Cycle              US-23 - Manage off-cycle payroll runs
  ├── Tab: Adjustments            US-24 - Payroll corrections & reversals
  └── Tab: Auto-Payroll           US-25 - Auto-payroll config & execution log

/payroll/config                   Payroll Configuration
  ├── Tab: Pay Grades             US-26 - Manage pay grade tiers
  ├── Tab: Salary Structures      US-27 - Define salary structures
  ├── Tab: Allowances & Ded.      US-28 - Manage allowance/deduction templates
  ├── Tab: Payroll Calendar       US-29 - View payroll periods & schedule
  └── Tab: Assignments            US-30 - Assign structures to employees

/payroll/compliance               Statutory Compliance
  ├── Tab: PAYE Tax               US-31 - PAYE tax bands & relief config
  ├── Tab: Pension                US-32 - PFA configurations
  ├── Tab: NHF/ITF/NSITF/NHIS    US-33 - Statutory body details
  └── Tab: Compliance Overview    US-34 - Payment tracking & filing
```

---

## State Management

- **No server persistence yet**: All data is mock -- payroll runs, payslips, inputs, approvals, and configurations are not sent to an API
- **Local component state**: `useState` manages tab selection, search input, filters, and status updates
- **Computed values**: `useMemo` is used for filtered lists and aggregated totals
- **Client-side status updates**: Input review approvals, payroll approval workflow status changes, and cascading approval logic all operate on local state only
