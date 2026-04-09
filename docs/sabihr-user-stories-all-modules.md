# SabiHR - User Stories & Use Cases (All Modules)

## Overview

This document covers user stories for all built admin modules in SabiHR. Each story describes **what the user sees**, **what data is required**, and **what actions they can perform** — written to guide backend API development.

**Modules Covered:**
1. Admin Dashboard
2. Attendance Management
3. Leave Management
4. Employee Management
5. Department Management
6. Payroll Management
7. Payroll Configuration
8. Statutory Compliance

---

# 1. Admin Dashboard (`/dashboard`)

## US-1: View Dashboard Overview

**As a** company admin,
**I want to** see a summary of key HR metrics, attendance, recent activity, and alerts on one screen,
**So that** I can monitor the health of my organization at a glance.

### Data the User Sees

**Greeting:**
- Admin's name (from logged-in user profile)
- Current date

**KPI Cards (4):**

| Metric | Example Value | Comparison |
|--------|--------------|------------|
| Total Employees | 156 | +5.2% vs last month |
| Payroll Cost | ₦45.2M | +2.1% vs last month |
| Attendance Rate | 94.2% | +1.3% vs last month |
| Turnover Rate | 3.1% | -0.8% vs last month |

**Today's Attendance Summary:**

| Status | Count | Percentage |
|--------|-------|------------|
| Present | 128 | 82.1% |
| Late | 12 | 7.7% |
| Absent | 8 | 5.1% |
| On Leave | 8 | 5.1% |

**Recent Activity Feed (latest 6):**
Each activity contains: `type`, `employee name`, `description`, `timestamp`

Activity types: `new_hire`, `leave_approved`, `leave_requested`, `payroll_processed`, `document_generated`, `probation_ending`, `employee_exit`

**Alerts (actionable):**
Each alert contains: `severity` (info | warning | urgent), `title`, `description`

Examples: probation reviews due, payroll deadline approaching, low leave balances, pension remittance overdue

### User Actions
- Dismiss individual alerts
- Dismiss the account setup section
- Complete admin profile (first name, last name, phone)
- Set account password (with strength validation)

### Backend API Needs
- `GET /dashboard/kpi` — returns KPI metrics with month-over-month change
- `GET /dashboard/attendance-summary` — today's attendance counts by status
- `GET /dashboard/recent-activity` — latest activity feed (paginated)
- `GET /dashboard/alerts` — active alerts for the admin
- `PATCH /dashboard/alerts/:id/dismiss` — dismiss an alert
- `PUT /admin/profile` — update admin profile (first name, last name, phone)
- `PUT /admin/password` — set/change password

---

# 2. Attendance Management (`/attendance`)

## US-2: View and Manage Daily Attendance

**As a** company admin,
**I want to** view, search, and filter employee attendance records by date,
**So that** I can track who is present, late, or absent and export reports.

### Data the User Sees

**Summary Cards:**

| Metric | Description |
|--------|------------|
| Total | Total employees expected |
| Present | Employees clocked in on time |
| Late | Employees who clocked in after expected time |
| Absent | Employees who did not clock in |
| On Leave | Employees on approved leave |

**Attendance Rate:** Percentage bar showing present + late + half-day vs total

**Attendance Table (per day):**

| Column | Data |
|--------|------|
| Employee | Name, avatar initials, employee ID |
| Department | Department name |
| Clock In | Time (e.g. "08:45 AM") or "—" if absent |
| Clock Out | Time (e.g. "05:30 PM") or "—" |
| Hours Worked | Decimal hours (e.g. "8.5h") or "—" |
| Status | present, late, absent, on-leave, half-day |
| Location | Office location (e.g. "Lagos Office") |

### User Actions
- Navigate between dates (previous/next day, date picker)
- Search by employee name or department
- Filter by status (present, late, absent, on-leave, half-day)
- Filter by department
- Export attendance report

### Backend API Needs
- `GET /attendance?date=YYYY-MM-DD` — returns all attendance records for a date
- `GET /attendance/summary?date=YYYY-MM-DD` — returns count by status for a date
- `GET /attendance/export?date=YYYY-MM-DD&format=csv` — export attendance data

### Data Model: AttendanceRecord

```typescript
{
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string              // "YYYY-MM-DD"
  clockIn: string | null    // "HH:MM AM/PM"
  clockOut: string | null
  status: "present" | "late" | "absent" | "on-leave" | "half-day"
  hoursWorked: number | null
  location: string
}
```

---

# 3. Leave Management (`/leave`)

## US-3: View and Manage Leave Requests

**As a** company admin,
**I want to** view all leave requests, filter by status, and approve or reject pending requests,
**So that** I can manage employee time-off efficiently and maintain adequate staffing.

### Data the User Sees

**Leave Policy Summary (6 types):**

| Leave Type | Annual Allocation |
|-----------|------------------|
| Annual Leave | 20 days |
| Sick Leave | 10 days |
| Casual Leave | 5 days |
| Maternity Leave | 90 days |
| Paternity Leave | 10 days |
| Compassionate Leave | 5 days |

**Leave Requests Table:**

| Column | Data |
|--------|------|
| Employee | Name, department |
| Leave Type | annual, sick, casual, maternity, paternity, compassionate |
| Duration | Start date → End date |
| Days | Number of days requested |
| Applied On | Date the request was submitted |
| Status | pending, approved, rejected, cancelled |
| Approved By | Manager name (for non-pending) |
| Actions | Approve / Reject buttons (for pending only) |

### User Actions
- Filter by status tab (All, Pending, Approved, Rejected) with counts
- Search by employee name or department
- Filter by leave type
- Filter by department
- Approve a pending leave request
- Reject a pending leave request

### Backend API Needs
- `GET /leave/policy` — returns leave types and annual allocations
- `GET /leave/requests?status=&type=&department=` — filtered leave requests
- `GET /leave/requests/counts` — count per status (for tab badges)
- `PATCH /leave/requests/:id/approve` — approve a request
- `PATCH /leave/requests/:id/reject` — reject a request

### Data Model: LeaveRequest

```typescript
{
  id: string
  employeeId: string
  employeeName: string
  department: string
  leaveType: "annual" | "sick" | "casual" | "maternity" | "paternity" | "compassionate"
  startDate: string
  endDate: string
  days: number
  status: "pending" | "approved" | "rejected" | "cancelled"
  reason: string
  appliedOn: string
  approvedBy: string | null
}
```

---

# 4. Employee Management (`/employees`)

## US-4: View and Manage Employees

**As a** company admin,
**I want to** view all employees with summary stats, search, filter, and navigate to individual profiles,
**So that** I can manage the workforce and find employee information quickly.

### Data the User Sees

**Summary Cards:**

| Metric | Description |
|--------|------------|
| Total Employees | Count of all employees |
| Active | Count where status = active |
| On Leave | Count where status = on-leave |
| Terminated | Count where status = terminated |

**Employee Table:**

| Column | Data |
|--------|------|
| Employee | Photo, full name, employee ID |
| Email | Work email |
| Job Title | Current role |
| Department | Department name |
| Employment Type | full-time, part-time, contract, intern |
| Status | active, inactive, on-leave, suspended, terminated |
| Start Date | Date joined |
| Location | Office location |
| Supervisor | Direct manager name |

### User Actions
- Filter by status tab (All, Active, On Leave, Suspended, Terminated) with counts
- Search by name, email, job title, employee ID, or department
- Filter by department, employment type, location
- Click "Add Employee" to create new employee
- Export employee list
- Click employee row to view profile (`/employees/:id`)

### Backend API Needs
- `GET /employees?status=&department=&type=&location=&search=` — filtered list
- `GET /employees/counts` — count per status
- `GET /employees/:id` — single employee detail
- `GET /employees/export?format=csv` — export

---

## US-5: Create New Employee

**As a** company admin,
**I want to** add a new employee through a step-by-step form,
**So that** I can onboard new hires into the system with all required information.

### Form Steps

**Step 1 — Personal Information:**

| Field | Type | Required |
|-------|------|----------|
| First Name | text | Yes |
| Last Name | text | Yes |
| Middle Name | text | No |
| Email | email | Yes |
| Phone | text | Yes |
| Date of Birth | date | No |
| Gender | select (male, female, other, prefer-not-to-say) | No |
| Marital Status | select (single, married, divorced, widowed) | No |

**Step 2 — Contact Details:**

| Field | Type | Required |
|-------|------|----------|
| Address | text | No |
| City | text | No |
| State | select (Nigerian states) | No |
| Country | text | No |
| Emergency Contact Name | text | No |
| Emergency Contact Phone | text | No |
| Emergency Contact Relationship | text | No |

**Step 3 — Employment Information:**

| Field | Type | Required |
|-------|------|----------|
| Employee ID | text | Yes (auto-generated) |
| Job Title | text | Yes |
| Department | select (from departments) | Yes |
| Employment Type | select (full-time, part-time, contract, intern) | Yes |
| Start Date | date | Yes |
| Supervisor | select (from employees) | No |
| Location | text | No |
| Basic Salary | number | No |

**Step 4 — Review & Submit:**
- Shows all entered data for confirmation before submission

### User Actions
- Navigate between steps (next/back)
- Save draft (persists to localStorage)
- Submit final employee record

### Backend API Needs
- `POST /employees` — create new employee
- `GET /departments` — for department dropdown
- `GET /employees?role=supervisor` — for supervisor dropdown

### Data Model: Employee

```typescript
{
  id: string
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other" | "prefer-not-to-say"
  maritalStatus?: "single" | "married" | "divorced" | "widowed"
  address?: string
  city?: string
  state?: string
  country?: string
  jobTitle: string
  department: string
  employmentType: "full-time" | "part-time" | "contract" | "intern"
  employmentStatus: "active" | "inactive" | "on-leave" | "suspended" | "terminated"
  startDate: string
  supervisor?: string
  location?: string
  basicSalary?: number
  photo?: string
  emergencyContacts?: { name: string; phone: string; relationship: string }[]
}
```

---

# 5. Department Management (`/departments`)

## US-6: View and Manage Departments

**As a** company admin,
**I want to** view all departments with employee counts and budgets,
**So that** I can manage organizational structure and resource allocation.

### Data the User Sees

**Summary Cards:**

| Metric | Description |
|--------|------------|
| Total Departments | Count of all departments |
| Total Employees | Sum of employees across all departments |
| Total Budget | Sum of all department budgets (₦) |
| Active Locations | Count of distinct office locations |

**Department List/Grid:**

| Field | Data |
|-------|------|
| Department Name | Name |
| Department Code | Short code (e.g. "ENG") |
| Head | Department head name |
| Employee Count | Number of employees |
| Budget | Annual budget (₦) |
| Location | Office location |
| Status | active, inactive |

### User Actions
- Search departments by name
- Toggle between grid view and table view
- Click department to view filtered employee list
- Click "Create Department" to add new department
- Open "Reassign Employees" modal to move employees between departments

---

## US-7: Create New Department

**As a** company admin,
**I want to** create a new department with a name, code, head, and budget,
**So that** I can expand the organizational structure.

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Department Name | text | Yes | Non-empty |
| Department Code | text | Yes | Auto-uppercased |
| Department Head | select (from employees) | No | — |
| Description | textarea | No | — |
| Location | text | No | — |
| Budget | number | No | Numeric only |
| Status | select (active, inactive) | Yes | Default: active |

### Backend API Needs
- `GET /departments` — list all departments
- `GET /departments/:id` — single department detail
- `POST /departments` — create new department
- `PUT /departments/:id` — update department
- `DELETE /departments/:id` — delete department

---

## US-8: Reassign Employees Between Departments

**As a** company admin,
**I want to** move one or more employees from one department to another,
**So that** I can handle restructuring and team changes.

### User Actions
- Select target department from dropdown
- Select employees via checkboxes (with "select all" option)
- Confirm reassignment
- See success confirmation

### Backend API Needs
- `PATCH /employees/bulk-reassign` — body: `{ employeeIds: string[], targetDepartmentId: string }`

### Data Model: Department

```typescript
{
  id: string
  name: string
  code: string
  head?: string
  headName?: string
  description?: string
  location?: string
  budget?: number
  employeeCount: number
  status: "active" | "inactive"
  createdAt: string
}
```

---

# 6. Payroll Management (`/payroll`)

## US-9: View and Process Payroll Runs

**As a** payroll administrator,
**I want to** view payroll run history, see summary totals, and process current payroll,
**So that** I can ensure employees are paid accurately and on time.

### Data the User Sees

**Summary Cards:**

| Metric | Description |
|--------|------------|
| Last Gross Pay | Total gross from last completed run |
| Last Net Pay | Total net from last completed run |
| Total Deductions | Total deductions from last completed run |
| Employees Paid | Headcount from last completed run |

**Payroll Runs Table:**

| Column | Data |
|--------|------|
| Period | Month + Year (e.g. "March 2026") |
| Status | draft, processing, completed, failed |
| Gross Pay | Total gross amount (₦) |
| Deductions | Total deductions (₦) |
| Net Pay | Total net amount (₦) |
| Employees | Number of employees in run |
| Processed Date | Date completed (or "—") |
| Approved By | Approver name (or "—") |

**Payroll Tabs (8 views):**
1. **Payroll Runs** — list of all runs
2. **Payslips** — individual employee payslips for a run
3. **Input Review** — verify salary inputs before processing
4. **Computation** — view calculated breakdowns
5. **Approval** — approve/reject payroll before disbursement
6. **Off-Cycle** — bonus and ad-hoc payment runs
7. **Adjustments** — retroactive salary corrections
8. **Auto-Payroll** — configure automatic monthly processing

### User Actions
- View all payroll runs with status
- Process current draft payroll run
- View individual payslips per run
- Search payslips by employee name
- Approve or reject a payroll run
- Export payroll data
- Configure auto-payroll settings

### Backend API Needs
- `GET /payroll/runs` — list all payroll runs
- `GET /payroll/runs/:id` — single run detail
- `POST /payroll/runs` — create new payroll run
- `PATCH /payroll/runs/:id/process` — process a draft run
- `PATCH /payroll/runs/:id/approve` — approve a run
- `PATCH /payroll/runs/:id/reject` — reject a run
- `GET /payroll/runs/:id/payslips?search=` — payslips for a run
- `GET /payroll/runs/:id/summary` — summary totals for a run
- `GET /payroll/export/:runId?format=csv` — export run data
- `POST /payroll/off-cycle` — create off-cycle run
- `POST /payroll/adjustments` — create adjustment
- `PUT /payroll/auto-config` — update auto-payroll settings

### Data Model: PayrollRun

```typescript
{
  id: string
  period: string          // "March 2026"
  month: number
  year: number
  status: "draft" | "processing" | "completed" | "failed"
  totalGross: number
  totalNet: number
  totalDeductions: number
  employeeCount: number
  processedDate: string | null
  approvedBy: string | null
}
```

### Data Model: EmployeePayslip

```typescript
{
  id: string
  payrollRunId: string
  employeeId: string
  employeeName: string
  department: string
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  otherAllowances: number
  grossPay: number
  tax: number
  pension: number
  otherDeductions: number
  totalDeductions: number
  netPay: number
  status: "pending" | "paid" | "on-hold"
  bankName: string
  accountNumber: string
}
```

---

# 7. Payroll Configuration (`/payroll/config`)

## US-10: Manage Pay Grades and Salary Structures

**As a** payroll administrator,
**I want to** define pay grades, salary structures, and allowance templates,
**So that** employee compensation is standardized and consistent.

### Data the User Sees

**Tabs:**
1. **Pay Grades** — salary bands by level
2. **Salary Structures** — component breakdowns
3. **Allowances & Deductions** — reusable templates
4. **Payroll Calendar** — processing schedule
5. **Assignments** — employee-to-grade mapping

**Pay Grades Table:**

| Column | Data |
|--------|------|
| Grade Name | e.g. "Grade 1 — Entry Level" |
| Level | Numeric level (1-7) |
| Min Salary | Floor amount (₦) |
| Mid Salary | Midpoint amount (₦) |
| Max Salary | Ceiling amount (₦) |
| Employees | Count assigned to this grade |
| Status | active, inactive |

**Salary Structures Table:**

| Column | Data |
|--------|------|
| Structure Name | e.g. "Standard Nigerian" |
| Components | List of salary components |
| Employee Count | How many employees use it |
| Status | active, inactive |

**Salary Components:**
- Basic Salary (percentage of gross, e.g. 40%)
- Housing Allowance (e.g. 20%)
- Transport Allowance (e.g. 15%)
- Meal Allowance (e.g. 10%)
- Utility Allowance (e.g. 5%)
- Other components as configured

**Allowance/Deduction Templates:**

| Field | Data |
|-------|------|
| Name | Template name |
| Type | allowance or deduction |
| Category | statutory, voluntary, benefit |
| Calculation | fixed amount or percentage |
| Amount/Rate | ₦ value or % |
| Taxable | yes/no |

### User Actions
- View, create, edit, deactivate pay grades
- View, create, edit salary structures with component breakdowns
- View, create, edit allowance/deduction templates
- View payroll calendar with processing dates
- Assign employees to pay grades

### Backend API Needs
- `GET /payroll/pay-grades` — list pay grades
- `POST /payroll/pay-grades` — create grade
- `PUT /payroll/pay-grades/:id` — update grade
- `GET /payroll/salary-structures` — list structures
- `POST /payroll/salary-structures` — create structure
- `PUT /payroll/salary-structures/:id` — update structure
- `GET /payroll/templates` — list allowance/deduction templates
- `POST /payroll/templates` — create template
- `GET /payroll/calendar` — payroll processing schedule
- `GET /payroll/assignments` — employee-to-grade assignments
- `PUT /payroll/assignments/:employeeId` — assign grade to employee

---

# 8. Statutory Compliance (`/payroll/compliance`)

## US-11: View and Manage Statutory Compliance

**As a** payroll administrator,
**I want to** view tax configurations, pension settings, and statutory body registrations,
**So that** I can ensure the company complies with Nigerian labor and tax regulations.

### Data the User Sees

**Tabs:**
1. **PAYE Tax** — tax band configuration
2. **Pension** — PFA and contribution rates
3. **NHF / ITF / NSITF / NHIS** — statutory body details
4. **Compliance Overview** — payment tracking and status

**PAYE Tax Configuration:**

| Tax Band | Income Range (₦) | Rate |
|----------|------------------|------|
| First Band | 0 – 100,000 | 0% |
| Second Band | 100,001 – 500,000 | 5% |
| Third Band | 500,001 – 1,000,000 | 10% |
| Fourth Band | 1,000,001 – 2,000,000 | 15% |
| Fifth Band | 2,000,001 – 3,200,000 | 20% |
| Above | 3,200,001+ | 24% |

Plus: Consolidated Relief Allowance (CRA), Gross Income relief percentage

**Pension Configuration:**

| Field | Value |
|-------|-------|
| Employee Contribution Rate | 8% |
| Employer Contribution Rate | 10% |
| PFAs Configured | List of Pension Fund Administrators |

**Statutory Bodies:**

| Body | Full Name | Rate/Amount |
|------|-----------|------------|
| NHF | National Housing Fund | 2.5% of basic salary |
| ITF | Industrial Training Fund | 1% of annual payroll |
| NSITF | National Social Insurance Trust Fund | 1% of monthly payroll |
| NHIS | National Health Insurance Scheme | Employer 10%, Employee 5% |

**Compliance Overview:**
- Payment status per statutory body per month
- Due dates and remittance tracking
- Overdue/pending/completed status

### User Actions
- View all tax band configurations
- View pension PFA details and contribution rates
- View statutory body registration details
- Track compliance payment status per month
- See overdue remittances

### Backend API Needs
- `GET /compliance/paye` — tax bands and CRA config
- `PUT /compliance/paye` — update tax configuration
- `GET /compliance/pension` — pension config and PFA list
- `PUT /compliance/pension` — update pension config
- `GET /compliance/statutory-bodies` — NHF, ITF, NSITF, NHIS details
- `GET /compliance/overview` — payment status tracking by month
- `POST /compliance/remittance` — record a remittance payment

---

# Complete Route Map

```
/dashboard                  → Admin Dashboard (US-1)
/attendance                 → Attendance Management (US-2)
/leave                      → Leave Management (US-3)
/employees                  → Employee List (US-4)
/employees/create           → Create Employee (US-5)
/employees/:id              → Employee Detail
/departments                → Department List (US-6)
/departments/create         → Create Department (US-7)
/payroll                    → Payroll Management (US-9)
/payroll/config             → Payroll Configuration (US-10)
/payroll/compliance         → Statutory Compliance (US-11)
```

---

# Summary of Backend API Endpoints

| Module | Endpoints |
|--------|----------|
| Dashboard | 7 endpoints (KPI, attendance summary, activity, alerts, profile, password) |
| Attendance | 3 endpoints (records by date, summary, export) |
| Leave | 5 endpoints (policy, requests, counts, approve, reject) |
| Employees | 5 endpoints (list, detail, create, export, counts) |
| Departments | 5 endpoints (list, detail, create, update, delete) + bulk reassign |
| Payroll | 12 endpoints (runs, payslips, process, approve, off-cycle, adjustments, auto-config) |
| Payroll Config | 9 endpoints (grades, structures, templates, calendar, assignments) |
| Compliance | 7 endpoints (PAYE, pension, statutory bodies, overview, remittance) |

**Total: ~53 API endpoints**
