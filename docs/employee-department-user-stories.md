# SabiHR - Employee & Department Modules: User Stories & Use Cases

## Overview

This document details the complete Employee Management and Department Management modules for SabiHR, covering every screen, input field, validation rule, user action, mock data record, and edge case for listing, creating, filtering, and managing employees and departments.

The modules are split into two sections:
1. **Employee Module** (`/employees`, `/employees/create`) -- Employee listing, filtering, search, and multi-step creation
2. **Department Module** (`/departments`, `/departments/create`) -- Department listing, search, grid/table views, creation, and employee reassignment

---

## Employee Module

### US-14: Employee List & Summary Dashboard

**As a** company admin,
**I want to** view a list of all employees with summary statistics and status tabs,
**So that** I can quickly assess the workforce composition and find specific employees.

#### Screen: Employee Management

**Route:** `/employees`

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Title | "Employee Management" | `text-xl font-semibold tracking-tight text-slate-900` |
| Subtitle | "{total} total employees · {filtered} shown" | `text-sm text-slate-500` |
| Export button | "Export" with Download icon | `variant="outline" size="sm" border-[#efefef]` |
| Add Employee button | "Add Employee" with Plus icon | `bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium` |

**Summary Cards (4):**

| Card | Icon | Value Source | Style |
|------|------|-------------|-------|
| Total Employees | `Users` | `MOCK_EMPLOYEE_LIST.length` (20) | Icon in `w-8 h-8 rounded-full bg-[#f8fafc]` circle |
| Active | `UserCheck` | Count where `employmentStatus === "active"` (17) | Same icon style |
| On Leave | `Clock` | Count where `employmentStatus === "on-leave"` (1) | Same icon style |
| Terminated | `UserX` | Count where `employmentStatus === "terminated"` (0) | Same icon style |

**Card Layout:**
- Grid: `grid-cols-2 sm:grid-cols-4 gap-4`
- Card container: `rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start`
- Label: `text-xs font-medium text-slate-500`
- Value: `text-2xl font-bold tracking-[-0.6px] text-slate-900`

---

**Status Tabs:**

| Tab Key | Tab Label | Count |
|---------|-----------|-------|
| `all` | All | 20 |
| `active` | Active | 17 |
| `on-leave` | On Leave | 1 |
| `suspended` | Suspended | 1 |
| `terminated` | Terminated | 0 |

**Tab Styling:**
- Container: `flex items-center gap-1 border-b border-slate-200`
- Active tab: `border-blue-600 text-blue-600 border-b-2`
- Inactive tab: `border-transparent text-slate-500 hover:text-slate-900`
- Count badge: `ml-1.5 text-xs bg-[#f8fafc] px-1.5 py-0.5 rounded-full`
- Tab element: `px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px`

---

**Search & Toolbar:**

| Element | Type | Placeholder | Details |
|---------|------|-------------|---------|
| Search input | text with Search icon | "Search by name, ID, email, or title..." | `pl-9`, icon at `left-3 top-1/2` |
| Filters toggle button | Button | "Filters" with Filter icon | `variant="outline" size="sm" border-[#efefef]`, toggles filter panel |

**Search matches against:** `firstName + lastName`, `employeeId`, `email`, `jobTitle`, `department` (all case-insensitive)

---

**Filter Panel (conditionally rendered when `filterOpen === true`):**

| Filter | Type | Default | Options |
|--------|------|---------|---------|
| Department | Select dropdown | "All Departments" | Dynamically extracted from `MOCK_EMPLOYEE_LIST` unique departments, sorted alphabetically: Engineering, Finance, Human Resources, IT, Legal, Marketing, Operations, Sales |
| Employment Type | Select dropdown | "All Types" | Full-time, Part-time, Contract, Intern |
| Location | Select dropdown | "All Locations" | Dynamically extracted unique locations, sorted: Abuja Office, Kano Office, Lagos Office |

**Filter Panel Style:** `grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-[#efefef] bg-white p-4`

Each filter label: `text-xs font-medium text-slate-500`

---

**Employee Table:**

| Column | Width | Content | Style |
|--------|-------|---------|-------|
| Employee | auto | Avatar circle (initials) + Full name + email | Name: `font-medium text-slate-900`, Email: `text-xs text-slate-500` |
| Employee ID | auto | e.g. "SHR-2025-001" | `font-mono text-xs text-slate-500` |
| Department | auto | Department name | `text-slate-900` |
| Job Title | auto | Job title text | `text-slate-500` |
| Type | auto | Employment type label | `text-slate-500` |
| Status | auto | Status badge | Badge with bg + color per status |
| Location | auto | Office location | `text-slate-500` |
| Start Date | auto | Formatted date (e.g. "1 Mar 2025") | `text-slate-500`, formatted with `en-NG` locale |
| Actions | `w-10` | MoreHorizontal icon | `p-1 rounded hover:bg-[#f8fafc]` |

**Table Styles:**
- Container: `rounded-xl border border-[#efefef] bg-white overflow-x-auto`
- Header row: `border-b border-[#efefef] bg-[#f8fafc]`
- Header cells: `p-3 text-left text-xs font-medium text-slate-500`
- Body rows: `border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer`
- Row click: navigates to `/employees/{emp.id}`
- Actions column: `onClick={(e) => e.stopPropagation()}` to prevent row navigation

**Avatar Circle:**
- Style: `w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 text-xs font-medium`
- Content: First initial of firstName + first initial of lastName

**Status Badge Styles:**

| Status | Label | Background | Text Color |
|--------|-------|------------|------------|
| `active` | Active | `bg-emerald-50 border-emerald-200` | `text-emerald-700` |
| `inactive` | Inactive | `bg-gray-50 border-gray-200` | `text-gray-700` |
| `on-leave` | On Leave | `bg-amber-50 border-amber-200` | `text-amber-700` |
| `suspended` | Suspended | `bg-red-50 border-red-200` | `text-red-700` |
| `terminated` | Terminated | `bg-gray-100 border-gray-300` | `text-gray-600` |

Badge element: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`

**Employment Type Labels:**

| Key | Label |
|-----|-------|
| `full-time` | Full-time |
| `part-time` | Part-time |
| `contract` | Contract |
| `intern` | Intern |

---

**Empty State (when filtered results === 0):**
- `UserCircle` icon: `w-10 h-10 mx-auto mb-3 opacity-30`
- Title: "No employees found" (`font-medium text-slate-900`)
- Subtitle: "Try adjusting your search or filters" (`text-xs mt-1 text-slate-500`)
- Cell: `colSpan={9} p-12 text-center text-slate-400`

---

**Mock Data - Complete Employee List (20 records):**

| id | employeeId | firstName | lastName | email | phone | jobTitle | department | location | employmentType | employmentStatus | startDate | supervisor |
|----|-----------|-----------|----------|-------|-------|----------|------------|----------|---------------|-----------------|-----------|------------|
| emp-001 | SHR-2025-001 | Adebayo | Ogunlesi | adebayo.ogunlesi@sabihr.com | +2348012345678 | Senior Software Engineer | Engineering | Lagos Office | full-time | active | 2025-03-01 | Chiamaka Eze |
| emp-002 | SHR-2025-002 | Chiamaka | Eze | chiamaka.eze@sabihr.com | +2348034567890 | VP of Engineering | Engineering | Lagos Office | full-time | active | 2024-06-15 | Olufunke Adeyemi |
| emp-003 | SHR-2025-003 | Oluwaseun | Afolabi | seun.afolabi@sabihr.com | +2348045678901 | Product Designer | Engineering | Lagos Office | full-time | active | 2025-01-10 | Chiamaka Eze |
| emp-004 | SHR-2025-004 | Fatima | Abdullahi | fatima.abdullahi@sabihr.com | +2348056789012 | HR Manager | Human Resources | Abuja Office | full-time | active | 2024-09-01 | Olufunke Adeyemi |
| emp-005 | SHR-2025-005 | Emeka | Okafor | emeka.okafor@sabihr.com | +2348067890123 | Sales Executive | Sales | Lagos Office | full-time | active | 2025-02-01 | Ngozi Ibe |
| emp-006 | SHR-2025-006 | Aisha | Mohammed | aisha.mohammed@sabihr.com | +2348078901234 | Finance Analyst | Finance | Abuja Office | full-time | active | 2025-04-15 | Chibueze Okoro |
| emp-007 | SHR-2025-007 | Tochukwu | Nwankwo | tochukwu.nwankwo@sabihr.com | +2348089012345 | Backend Developer | Engineering | Lagos Office | full-time | active | 2025-05-01 | Adebayo Ogunlesi |
| emp-008 | SHR-2025-008 | Bukola | Adeyemi | bukola.adeyemi@sabihr.com | +2348090123456 | Marketing Manager | Marketing | Lagos Office | full-time | active | 2024-11-01 | Olufunke Adeyemi |
| emp-009 | SHR-2025-009 | Ibrahim | Musa | ibrahim.musa@sabihr.com | +2348001234567 | Operations Lead | Operations | Kano Office | full-time | active | 2024-08-15 | Olufunke Adeyemi |
| emp-010 | SHR-2025-010 | Yetunde | Bakare | yetunde.bakare@sabihr.com | +2348012345670 | Legal Counsel | Legal | Lagos Office | full-time | active | 2025-01-15 | Olufunke Adeyemi |
| emp-011 | SHR-2025-011 | Chibueze | Okoro | chibueze.okoro@sabihr.com | +2348023456780 | Finance Director | Finance | Lagos Office | full-time | active | 2024-05-01 | Olufunke Adeyemi |
| emp-012 | SHR-2025-012 | Ngozi | Ibe | ngozi.ibe@sabihr.com | +2348034567891 | Sales Director | Sales | Lagos Office | full-time | active | 2024-07-01 | Olufunke Adeyemi |
| emp-013 | SHR-2025-013 | Kemi | Adekunle | kemi.adekunle@sabihr.com | +2348045678902 | Recruitment Specialist | Human Resources | Lagos Office | full-time | on-leave | 2025-06-01 | Fatima Abdullahi |
| emp-014 | SHR-2025-014 | Damilola | Osei | damilola.osei@sabihr.com | +2348056789013 | Frontend Developer | Engineering | Lagos Office | contract | active | 2025-09-01 | Adebayo Ogunlesi |
| emp-015 | SHR-2025-015 | Usman | Bello | usman.bello@sabihr.com | +2348067890124 | IT Support Technician | IT | Abuja Office | full-time | active | 2025-07-15 | Ibrahim Musa |
| emp-016 | SHR-2025-016 | Amara | Obi | amara.obi@sabihr.com | +2348078901235 | Content Marketing Specialist | Marketing | Lagos Office | full-time | active | 2025-08-01 | Bukola Adeyemi |
| emp-017 | SHR-2025-017 | Olumide | Fashola | olumide.fashola@sabihr.com | +2348089012346 | Account Executive | Sales | Lagos Office | full-time | suspended | 2025-03-15 | Ngozi Ibe |
| emp-018 | SHR-2025-018 | Halima | Yusuf | halima.yusuf@sabihr.com | +2348090123457 | Compliance Officer | Legal | Abuja Office | full-time | active | 2025-10-01 | Yetunde Bakare |
| emp-019 | SHR-2025-019 | Segun | Adeniyi | segun.adeniyi@sabihr.com | +2348001234568 | Operations Analyst | Operations | Lagos Office | intern | active | 2026-01-15 | Ibrahim Musa |
| emp-020 | SHR-2025-020 | Folake | Williams | folake.williams@sabihr.com | +2348012345671 | Payroll Specialist | Finance | Lagos Office | full-time | active | 2025-11-01 | Chibueze Okoro |

---

**User Actions:**
- Click "Add Employee" button to navigate to `/employees/create`
- Click "Export" button to trigger CSV/Excel export (mock -- no implementation yet)
- Type in the search field to filter employees by name, ID, email, job title, or department
- Click a status tab (All, Active, On Leave, Suspended, Terminated) to filter by employment status
- Click "Filters" button to toggle the filter panel open/closed
- Select a department from the Department filter dropdown
- Select an employment type from the Employment Type filter dropdown
- Select a location from the Location filter dropdown
- Click any employee row to navigate to `/employees/{emp.id}` detail page
- Click the MoreHorizontal (three-dot) icon on a row to open actions menu (stops row click propagation)

**Success Flow:**
1. Admin navigates to `/employees`
2. Page loads with 4 summary cards showing Total Employees (20), Active (17), On Leave (1), Terminated (0)
3. All 20 employees are displayed in the table with "All" tab active
4. Admin types "engineer" in search -- table filters to show matching employees
5. Admin clicks "Filters" -- filter panel expands with Department, Employment Type, and Location dropdowns
6. Admin selects "Engineering" department -- table shows only Engineering employees
7. Admin clicks "On Leave" tab -- table shows only employees with on-leave status
8. Admin clicks an employee row -- navigates to employee detail page

**Error States / Edge Cases:**
- No employees match search + filters: empty state with UserCircle icon and "No employees found" message
- Status tabs always show counts from the full unfiltered dataset (not affected by search/filter)
- Filters combine with AND logic: search AND department AND status AND type AND location must all match
- Status filter from tabs and other filters from the filter panel work independently
- Department and location options are dynamically derived from the dataset (not hardcoded)

**Responsive Behavior:**
- Summary cards: `grid-cols-2` on mobile, `grid-cols-4` on `sm:` breakpoint
- Header: stacks vertically on mobile (`flex-col`), horizontal on `sm:` (`sm:flex-row sm:items-center sm:justify-between`)
- Toolbar: stacks vertically on mobile, horizontal on `sm:`
- Filter panel: `grid-cols-2` on mobile, `grid-cols-3` on `sm:`
- Table: horizontal scroll enabled via `overflow-x-auto`

---

### US-15: Add New Employee (Multi-Step Form)

**As a** company admin,
**I want to** add a new employee through a guided multi-step form,
**So that** I can capture all necessary personal, contact, and employment information in an organized manner.

#### Screen: Add New Employee

**Route:** `/employees/create`

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Back link | "Back to Employees" with ArrowLeft icon | `text-sm text-muted-foreground hover:text-foreground transition-colors`, navigates to `/employees` |
| Title | "Add New Employee" | `text-xl font-semibold tracking-tight` |
| Subtitle | "Fill in the details below to add a new employee to the organisation" | `text-sm text-muted-foreground` |

---

**Step Progress Indicator:**

| Step | Key | Label | Icon |
|------|-----|-------|------|
| 1 | `personal` | Personal Info | `User` |
| 2 | `contact` | Contact Details | `Phone` |
| 3 | `employment` | Employment | `Briefcase` |
| 4 | `review` | Review | `FileText` |

**Progress Button Styles:**
- Current step: `bg-primary text-primary-foreground`
- Completed step (index < current): `bg-primary/10 text-primary`
- Future step: `bg-muted text-muted-foreground hover:text-foreground`
- All: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors`
- Step number circle: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current`
- Container: `flex items-center gap-1 overflow-x-auto pb-2`
- Users can click any step to navigate directly (non-linear)

---

#### Step 1: Personal Information

**Section Header:** "Personal Information" with User icon (`text-sm font-semibold`)

**Container:** `rounded-xl border border-border bg-card p-6 space-y-5`

| Field | ID | Type | Placeholder | Required | Grid Position |
|-------|----|------|-------------|----------|---------------|
| First Name | `firstName` | text | "e.g. Adebayo" | Yes (*) | Col 1 |
| Last Name | `lastName` | text | "e.g. Ogunlesi" | Yes (*) | Col 2 |
| Middle Name | `middleName` | text | "e.g. Chukwuemeka" | No | Col 1 |
| Date of Birth | `dateOfBirth` | date | native date picker | Yes (*) | Col 2 |
| Gender | `gender` | select | "Select gender" | Yes (*) | Col 1 |
| Marital Status | `maritalStatus` | select | "Select status" | No | Col 2 |
| Nationality | `nationality` | text | "e.g. Nigerian" | No | Col 1 |
| State of Origin | `stateOfOrigin` | text | "e.g. Lagos" | No | Col 2 |

**Gender Options (4):**
- Male
- Female
- Other
- Prefer not to say

**Marital Status Options (4):**
- Single
- Married
- Divorced
- Widowed

**Field Grid:** `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

#### Step 2: Contact Details

**Section Header:** "Contact Details" with Phone icon (`text-sm font-semibold`)

**Container:** `rounded-xl border border-border bg-card p-6 space-y-5`

| Field | ID | Type | Placeholder | Required | Grid Position |
|-------|----|------|-------------|----------|---------------|
| Personal Email | `personalEmail` | email | "personal@email.com" | Yes (*) | Col 1 |
| Work Email | `workEmail` | email | "name@sabihr.com" | Yes (*) | Col 2 |
| Phone Number | `phone` | text | "+234..." | Yes (*) | Col 1 |
| Alternate Phone | `alternatePhone` | text | "+234..." | No | Col 2 |
| Residential Address | `address` | text | "Street address" | Yes (*) | Full width (`sm:col-span-2`) |
| City | `city` | text | "e.g. Lagos" | No | Col 1 |
| State | `state` | text | "e.g. Lagos" | No | Col 2 |
| Country | `country` | text | "e.g. Nigeria" | No | Col 1 |

**Field Grid:** `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

#### Step 3: Employment Details

**Section Header:** "Employment Details" with Briefcase icon (`text-sm font-semibold`)

**Container:** `rounded-xl border border-border bg-card p-6 space-y-5`

| Field | ID | Type | Placeholder | Required | Options |
|-------|----|------|-------------|----------|---------|
| Job Title | `jobTitle` | text | "e.g. Software Engineer" | Yes (*) | -- |
| Department | `department` | select | "Select department" | Yes (*) | Engineering, Sales, Marketing, Finance, Human Resources, Operations, Legal, IT |
| Employment Type | `employmentType` | select | "Select type" | Yes (*) | Full-time, Part-time, Contract, Intern |
| Contract Type | `contractType` | select | "Select contract type" | No | Permanent, Fixed-term, Temporary |
| Start Date | `startDate` | date | native date picker | Yes (*) | -- |
| Work Location | `workLocation` | select | "Select location" | Yes (*) | Lagos Office, Abuja Office, Kano Office |
| Supervisor | `supervisor` | text | "e.g. Chiamaka Eze" | No | -- |
| Pay Grade | `payGrade` | text | "e.g. Grade 5" | No | -- |

**Department Options (8):**
Engineering, Sales, Marketing, Finance, Human Resources, Operations, Legal, IT

**Employment Type Options (4):**
- `full-time` -- Full-time
- `part-time` -- Part-time
- `contract` -- Contract
- `intern` -- Intern

**Contract Type Options (3):**
- `permanent` -- Permanent
- `fixed-term` -- Fixed-term
- `temporary` -- Temporary

**Work Location Options (3):**
Lagos Office, Abuja Office, Kano Office

**Field Grid:** `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

#### Step 4: Review & Submit

**Section Header:** "Review & Submit" with FileText icon (`text-sm font-semibold`)

**Container:** `rounded-xl border border-border bg-card p-6 space-y-5`

The review step displays all entered data in three read-only summary panels:

**Panel 1: Personal Information**
- Style: `rounded-lg bg-muted/50 p-4 space-y-3`
- Header: "PERSONAL INFORMATION" (`text-xs font-semibold text-muted-foreground uppercase tracking-wider`) with "Edit" link (`text-xs text-primary hover:underline`) that navigates to step 1
- Fields displayed in `grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm`:
  - Full Name (concatenated firstName + middleName + lastName)
  - Date of Birth
  - Gender (capitalized)
  - Nationality
  - State of Origin

**Panel 2: Contact Details**
- Same style as Panel 1, "Edit" navigates to step 2
- Fields displayed:
  - Work Email
  - Personal Email
  - Phone
  - Address (concatenated address + city + state + country, comma-separated, `col-span-2`)

**Panel 3: Employment Details**
- Same style as Panel 1, "Edit" navigates to step 3
- Fields displayed:
  - Job Title
  - Department
  - Employment Type (capitalized, hyphens replaced with spaces)
  - Start Date
  - Work Location
  - Supervisor
  - Pay Grade
  - Contract Type (capitalized, hyphens replaced with spaces)

**Empty field display:** "--" when no value provided

---

**Navigation Footer:**

| Element | Position | Action | Condition |
|---------|----------|--------|-----------|
| Back button | Left | Go to previous step | Disabled on step 1 (`stepIndex === 0`) |
| Save Draft button | Right group | Save form state to localStorage | Always available |
| Next button | Right group | Go to next step | Shown on steps 1-3 |
| Add Employee button | Right group | Submit the form | Shown only on step 4 (Review) |

**Button Details:**

| Button | Icon | Label | Loading Label | Style |
|--------|------|-------|---------------|-------|
| Back | `ArrowLeft` | -- | -- | `variant="outline"` |
| Save Draft | `Save` | "Save Draft" | "Saving..." | `variant="outline"`, spinner replaces icon when saving |
| Next | `ArrowRight` (right side) | "Next" | -- | Default primary |
| Add Employee | `Send` | "Add Employee" | "Submitting..." | Default primary, spinner replaces icon when submitting |

**Save Draft Behavior:**
1. Click "Save Draft"
2. Button shows spinner + "Saving..." (disabled)
3. Mock delay: 800ms
4. Saves `{ form, step }` to `localStorage` key `"employee-draft"`
5. Toast notification: "Draft saved successfully"

**Submit Behavior:**
1. Click "Add Employee" on Review step
2. Button shows spinner + "Submitting..." (disabled)
3. Mock delay: 1200ms
4. Removes `"employee-draft"` from localStorage
5. Toast notification: "Employee added successfully"
6. After 1000ms, navigates to `/employees`

**Toast Notification:**
- Style: `fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 fade-in`
- Icon: `Check` in `text-green-600`
- Auto-dismiss: 3000ms

---

**User Actions:**
- Click "Back to Employees" link to return to `/employees`
- Click any step button in the progress indicator to jump to that step directly
- Fill in fields on each step
- Click "Next" to advance to the next step
- Click "Back" to return to the previous step
- Click "Save Draft" to persist form state to localStorage
- Click "Add Employee" on the Review step to submit
- Click "Edit" links in the review panels to jump back to the corresponding step

**Success Flow:**
1. Admin clicks "Add Employee" on the Employee List page
2. Navigates to `/employees/create`, Step 1 (Personal Info) is displayed
3. Admin fills in first name, last name, date of birth, gender
4. Clicks "Next" to advance to Step 2 (Contact Details)
5. Admin fills in personal email, work email, phone, address
6. Clicks "Next" to advance to Step 3 (Employment Details)
7. Admin fills in job title, department, employment type, start date, work location
8. Clicks "Next" to advance to Step 4 (Review)
9. Admin reviews all entered information across three summary panels
10. Optionally clicks "Edit" to go back and correct any section
11. Clicks "Add Employee" to submit
12. Spinner shows "Submitting..." for 1.2 seconds
13. Toast shows "Employee added successfully"
14. After 1 second, redirected to `/employees`

**Error States / Edge Cases:**
- No client-side validation is enforced before advancing steps (fields marked with * are conventionally required but not blocked)
- Save Draft can be clicked at any step
- If draft exists in localStorage, it is not currently auto-loaded (no restore draft logic implemented)
- The form does not prevent navigating to any step regardless of completion
- Empty fields display as "--" in the Review step
- Employment type and contract type display with hyphens replaced by spaces and capitalized

**Responsive Behavior:**
- Page max width: `max-w-[900px] mx-auto`
- Progress indicator: horizontal scroll on mobile via `overflow-x-auto pb-2`
- All form grids: `grid-cols-1` on mobile, `grid-cols-2` on `sm:` breakpoint
- Address field spans full width on desktop: `sm:col-span-2`
- Review panels use `grid-cols-2 sm:grid-cols-3` for field layout
- Navigation footer: `flex items-center justify-between`

---

**Data Structures:**

```typescript
// Form state
interface EmployeeCreateForm {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;            // "" | "male" | "female" | "other" | "prefer-not-to-say"
  maritalStatus: string;     // "" | "single" | "married" | "divorced" | "widowed"
  nationality: string;
  stateOfOrigin: string;
  personalEmail: string;
  workEmail: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  jobTitle: string;
  department: string;        // "" | one of DEPARTMENTS array
  employmentType: string;    // "" | "full-time" | "part-time" | "contract" | "intern"
  startDate: string;
  workLocation: string;      // "" | "Lagos Office" | "Abuja Office" | "Kano Office"
  supervisor: string;
  payGrade: string;
  contractType: string;      // "" | "permanent" | "fixed-term" | "temporary"
}

// Step type
type Section = "personal" | "contact" | "employment" | "review";

// Section definition
interface SectionDef {
  key: Section;
  label: string;
  icon: React.ReactNode;
}

// Employee list item (from mock data)
interface EmployeeListItem {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: EmploymentType;      // "full-time" | "part-time" | "contract" | "intern"
  employmentStatus: EmploymentStatus;  // "active" | "inactive" | "on-leave" | "suspended" | "terminated"
  startDate: string;
  supervisor: string;
}

// Full employee profile (from types/employee.ts)
interface EmployeeProfile {
  id: string;
  basicDetails: BasicDetails;
  contactInfo: ContactInfo;
  emergencyContacts: EmergencyContact[];
  familyDependents: FamilyDependent[];
  documents: EmployeeDocument[];
  employment: EmploymentInfo;
  profilePhoto: string;
  profileCompletion: number;
}
```

---

## Department Module

### US-16: Department List & Summary Dashboard

**As a** company admin,
**I want to** view all departments with summary statistics in either grid or table format,
**So that** I can monitor departmental structure, headcount, budgets, and quickly find specific departments.

#### Screen: Department Management

**Route:** `/departments`

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Title | "Department Management" | `text-xl font-semibold tracking-tight text-slate-900` |
| Subtitle | "{count} departments · {totalEmployees} employees" | `text-sm text-slate-500` |
| Add Department button | "Add Department" with Plus icon | `bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium` |

---

**Summary Cards (4):**

| Card | Icon | Value | Computed From |
|------|------|-------|---------------|
| Total Departments | `Building2` | 8 | `MOCK_DEPARTMENTS.length` |
| Total Employees | `Users` | 156 | Sum of all `employeeCount` fields |
| Total Budget | `TrendingUp` | "63.5M" | Sum of all `budget` fields, formatted with `formatBudget()` |
| Locations | `MapPin` | 3 | Count of unique `location` values |

**Card Layout:** Same styling as Employee module summary cards:
- Grid: `grid-cols-2 sm:grid-cols-4 gap-4`
- Card: `rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start`
- Icon circle: `w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0`
- Icon: `w-4 h-4 text-slate-500`
- Label: `text-xs font-medium text-slate-500`
- Value: `text-2xl font-bold tracking-[-0.6px] text-slate-900`

**Divider:** `h-px bg-[#efefef]` between summary cards and toolbar

---

**Toolbar:**

| Element | Type | Details |
|---------|------|---------|
| Search input | text with Search icon | Placeholder: "Search departments...", `pl-9`, max-width: `max-w-sm` |
| View toggle | Two-button toggle | "Grid" and "Table" buttons |

**Search matches against:** `name`, `code`, `headOfDepartment` (all case-insensitive)

**View Toggle Styles:**
- Container: `flex items-center border border-[#efefef] rounded-lg overflow-hidden`
- Active button: `bg-blue-600 text-white`
- Inactive button: `hover:bg-[#f8fafc] text-slate-500`
- Both: `px-3 py-1.5 text-xs font-medium transition-colors`
- Default view: `"grid"`

---

#### Grid View (`view === "grid"`)

**Grid Layout:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

**Department Card Structure:**

| Section | Content | Style |
|---------|---------|-------|
| Top row | Department name + code + status | Name: `font-semibold text-slate-900`, Code: `text-xs text-slate-500`, Status: `text-xs font-medium` |
| Description | Department description | `text-xs text-[#62748e] line-clamp-2` |
| Footer divider | Horizontal line | `pt-3 border-t border-[#efefef]` |
| Stats row | Employee count + on-leave count + budget | Employee: `text-xs text-slate-500`, On leave: `text-[#e17100]`, Budget: `text-xs font-medium text-slate-900` |
| Action row | "Reassign Employees" link | `text-xs font-medium text-blue-600 hover:text-blue-700` with ArrowRightLeft icon |

**Card Container:** `rounded-xl border border-[#efefef] bg-white p-5 space-y-4 hover:border-slate-300 transition-colors cursor-pointer`

**Card Click:** navigates to `/employees?department={encodeURIComponent(dept.name)}`

**Status Display:**
- Active: `text-[#007a55]` -- "Active"
- Inactive: `text-gray-500` -- "Inactive"

**Employee Count Display:**
- Icon: `Users w-3.5 h-3.5`
- Text: "{count} employees"
- On leave count (only shown when > 0): "{count} on leave" in `text-[#e17100]`

**Reassign Employees Button:**
- Wrapped in `onClick={(e) => e.stopPropagation()}` to prevent card navigation
- Opens the Reassign Modal for that department

---

#### Table View (`view === "table"`)

**Table Container:** `rounded-xl border border-[#efefef] bg-white overflow-x-auto`

| Column | Alignment | Content | Style |
|--------|-----------|---------|-------|
| Department | left | Department name | `font-medium text-slate-900` |
| Code | left | Department code | `font-mono text-xs text-slate-500` |
| Head of Department | left | Name + title (two lines) | Name: `font-medium text-slate-900`, Title: `text-xs text-slate-500`. Shows "--" if no head |
| Employees | left | Count + on-leave badge | Count: `font-medium text-slate-900`, On leave: `text-xs text-[#e17100] ml-1` in parentheses |
| Location | left | Office location | `text-slate-500` |
| Budget | right | Formatted budget | `font-medium text-slate-900` |
| Status | left | Active/Inactive text | Same color scheme as grid view |
| Actions | -- (w-20) | "Reassign" link with ArrowRightLeft icon | `text-xs font-medium text-blue-600 hover:text-blue-700` |

**Table Styles:**
- Header row: `border-b border-[#efefef] bg-[#f8fafc]`
- Header cells: `p-3 text-left text-xs font-medium text-slate-500` (Budget is `text-right`)
- Body rows: `border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer`
- Row click: navigates to `/employees?department={encodeURIComponent(dept.name)}`
- Actions cell: `onClick={(e) => e.stopPropagation()}`

---

**Empty State (both views, when search yields 0 results):**
- Grid: wraps in `col-span-full`
- Table: wraps in `colSpan={8}`
- Both: `p-12 text-center text-slate-400`
- Icon: `Building2 w-10 h-10 mx-auto mb-3 opacity-30`
- Title: "No departments found" (`font-medium text-slate-900`)
- Subtitle: "Try adjusting your search" (`text-xs mt-1 text-slate-500`)

---

**Mock Data - Complete Department List (8 records):**

| id | name | code | headOfDepartment | headTitle | employeeCount | activeCount | onLeaveCount | location | budget | description | createdDate | status | color |
|----|------|------|-----------------|-----------|---------------|-------------|-------------|----------|--------|-------------|-------------|--------|-------|
| dept-001 | Engineering | ENG | Chiamaka Eze | VP of Engineering | 42 | 40 | 2 | Lagos Office | 18500000 | Responsible for product development, software engineering, and technical infrastructure. | 2024-01-01 | active | #2563eb |
| dept-002 | Sales | SAL | Ngozi Ibe | Sales Director | 28 | 27 | 1 | Lagos Office | 12000000 | Drives revenue growth through client acquisition, relationship management, and sales strategy. | 2024-01-01 | active | #10b981 |
| dept-003 | Marketing | MKT | Bukola Adeyemi | Marketing Manager | 22 | 22 | 0 | Lagos Office | 8500000 | Manages brand strategy, digital marketing, content, and communications. | 2024-01-01 | active | #f59e0b |
| dept-004 | Finance | FIN | Chibueze Okoro | Finance Director | 18 | 18 | 0 | Lagos Office | 6200000 | Handles financial planning, accounting, payroll, budgeting, and compliance. | 2024-01-01 | active | #8b5cf6 |
| dept-005 | Human Resources | HR | Fatima Abdullahi | HR Manager | 15 | 14 | 1 | Abuja Office | 5800000 | Manages talent acquisition, employee relations, benefits, and organizational development. | 2024-01-01 | active | #ec4899 |
| dept-006 | Operations | OPS | Ibrahim Musa | Operations Lead | 14 | 14 | 0 | Kano Office | 4500000 | Oversees day-to-day operations, logistics, and process optimization. | 2024-01-01 | active | #06b6d4 |
| dept-007 | Legal | LEG | Yetunde Bakare | Legal Counsel | 9 | 9 | 0 | Lagos Office | 3800000 | Provides legal advisory, handles contracts, regulatory compliance, and corporate governance. | 2024-01-01 | active | #64748b |
| dept-008 | IT | IT | Usman Bello | IT Support Lead | 8 | 8 | 0 | Abuja Office | 4200000 | Manages IT infrastructure, network security, helpdesk, and system administration. | 2024-01-01 | active | #f97316 |

**Budget Format Function:**
```typescript
function formatBudget(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString()}`;
}
```

**Formatted Budget Values:**

| Department | Raw Budget (NGN) | Formatted |
|------------|-----------------|-----------|
| Engineering | 18,500,000 | ₦18.5M |
| Sales | 12,000,000 | ₦12.0M |
| Marketing | 8,500,000 | ₦8.5M |
| Finance | 6,200,000 | ₦6.2M |
| Human Resources | 5,800,000 | ₦5.8M |
| Operations | 4,500,000 | ₦4.5M |
| Legal | 3,800,000 | ₦3.8M |
| IT | 4,200,000 | ₦4.2M |
| **Total** | **63,500,000** | **₦63.5M** |

---

**User Actions:**
- Click "Add Department" button to navigate to `/departments/create`
- Type in the search field to filter departments by name, code, or head of department
- Click "Grid" or "Table" toggle to switch between views
- Click a department card (grid) or row (table) to navigate to `/employees?department={name}`
- Click "Reassign Employees" link on any department to open the Reassign Modal
- All filtering is real-time as the user types

**Success Flow:**
1. Admin navigates to `/departments`
2. Page loads with 4 summary cards: Total Departments (8), Total Employees (156), Total Budget (₦63.5M), Locations (3)
3. Default view is Grid with 8 department cards
4. Admin types "eng" in search -- only Engineering card/row is shown
5. Admin clicks "Table" toggle -- view switches to table layout
6. Admin clicks "Reassign Employees" on Engineering -- Reassign Modal opens
7. Admin clicks a department row -- navigates to filtered employee list

**Error States / Edge Cases:**
- Search with no results shows empty state in both grid and table views
- Budget formatting handles amounts under 1 million differently (comma-formatted)
- View toggle state is stored in component state only (resets on navigation)
- Department color field exists in data but is not currently rendered visually in the list views
- On leave count of 0 hides the on-leave indicator entirely

**Responsive Behavior:**
- Summary cards: `grid-cols-2` on mobile, `grid-cols-4` on `sm:`
- Header: stacks vertically on mobile, horizontal on `sm:`
- Toolbar: stacks vertically on mobile, horizontal on `sm:`
- Grid view: `grid-cols-1` on mobile, `grid-cols-2` on `sm:`, `grid-cols-3` on `lg:`
- Table view: horizontal scroll via `overflow-x-auto`

---

### US-17: Reassign Employees Between Departments

**As a** company admin,
**I want to** select employees from one department and reassign them to another department,
**So that** I can restructure teams without navigating away from the department list.

#### Screen: Reassign Employees Modal

**Route:** N/A (overlay modal on `/departments`)

**Modal Container:**
- Overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40`
- Overlay click: closes modal
- Modal body: `bg-white rounded-xl border border-[#efefef] w-full max-w-[520px] max-h-[80vh] flex flex-col`
- Body click: `e.stopPropagation()` to prevent overlay close

---

**Modal Header:**

| Element | Content | Style |
|---------|---------|-------|
| Title | "Reassign Employees" | `text-sm font-semibold text-slate-900` |
| Subtitle | "From {departmentName}" | `text-xs text-slate-500` |
| Close button | X icon | `p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-[#f8fafc] transition-colors` |

Header container: `flex items-center justify-between px-5 py-4 border-b border-[#efefef]`

---

**Target Department Selector:**

| Field | Type | Placeholder | Required | Options |
|-------|------|-------------|----------|---------|
| Move to | Select dropdown | "Select department" | Yes (for reassign to work) | All departments except the source department |

Container: `px-5 py-3 border-b border-[#efefef]`
Label: `text-xs font-medium text-slate-500 mb-1.5 block`

---

**Employee Checklist:**

Container: `flex-1 overflow-y-auto px-5 py-3`

**Select All / Deselect All Toggle:**
- Text: "Select all" or "Deselect all" depending on state
- Style: `text-xs font-medium text-blue-600 hover:text-blue-700 mb-2`
- Logic: if `selected.size === employees.length` then "Deselect all", else "Select all"

**Employee Row (per active employee in source department):**

| Element | Content | Style |
|---------|---------|-------|
| Checkbox | Standard checkbox | `w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600` |
| Avatar | Initials circle | `w-7 h-7 rounded-full bg-[#f8fafc]`, text: `text-[10px] font-medium text-slate-500` |
| Name | Full name | `text-sm font-medium text-slate-900 truncate` |
| Job Title | Title text | `text-xs text-slate-500 truncate` |

Row container: `flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer`
Each row is a `<label>` element wrapping the checkbox for click-anywhere-to-toggle behavior.

**Employee Filter:** Only employees where `department === departmentName` AND `employmentStatus === "active"` are shown.

**Empty Employee State:**
- "No active employees in this department"
- Style: `text-sm text-slate-400 text-center py-8`

---

**Modal Footer:**

| Element | Content | Style |
|---------|---------|-------|
| Selection count | "{count} selected" | `text-xs text-slate-500` |
| Cancel button | "Cancel" | `variant="outline" size="sm" border-[#efefef]` |
| Reassign button | "Reassign" | `size="sm" bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium` |

Footer container: `flex items-center justify-between px-5 py-3 border-t border-[#efefef]`

**Reassign button disabled when:** `selected.size === 0 || !targetDept`

---

**Success State (after reassign):**

| Element | Content | Style |
|---------|---------|-------|
| Check icon | Green checkmark | `w-10 h-10 rounded-full bg-[#ecfdf5]` container, `Check w-5 h-5 text-[#007a55]` icon |
| Message | "{count} employee(s) reassigned" | `text-sm font-medium text-slate-900` |

Container: `flex flex-col items-center justify-center py-12 gap-3`
Auto-close: `setTimeout(onClose, 1500)` after reassignment

**Pluralization:** Uses `selected.size !== 1 ? "s" : ""` for "employee/employees"

---

**User Actions:**
- Click "Reassign Employees" on a department card/row to open the modal
- Click the overlay backdrop to close the modal
- Click the X button to close the modal
- Select a target department from the "Move to" dropdown
- Click "Select all" to check all employees / "Deselect all" to uncheck all
- Click individual employee checkboxes or rows to toggle selection
- Click "Cancel" to close without action
- Click "Reassign" to execute the reassignment (mock)

**Success Flow:**
1. Admin clicks "Reassign Employees" on the Engineering department
2. Modal opens showing target department dropdown and list of active Engineering employees
3. Admin selects "Sales" from the "Move to" dropdown
4. Admin clicks "Select all" to select all employees (or individually checks specific ones)
5. Footer shows "{count} selected"
6. Admin clicks "Reassign"
7. Success state shows green checkmark with "{count} employees reassigned"
8. Modal auto-closes after 1.5 seconds

**Error States / Edge Cases:**
- Reassign button stays disabled until both a target department is selected AND at least one employee is checked
- Only active employees are shown (on-leave, suspended, terminated employees are excluded)
- If a department has no active employees, the empty state message is shown
- The source department is excluded from the target department dropdown
- This is a mock operation -- no actual data is modified; the department list remains unchanged after closing the modal
- The `done` state replaces the entire form with the success message

---

### US-18: Create New Department

**As a** company admin,
**I want to** create a new department with relevant details,
**So that** I can expand the organizational structure to accommodate new teams.

#### Screen: Create Department

**Route:** `/departments/create`

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Back button | ArrowLeft icon | `w-9 h-9 rounded-lg border border-[#efefef] bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] transition-colors`, navigates to `/departments` |
| Title | "Create Department" | `text-xl font-semibold tracking-tight text-slate-900` |
| Subtitle | "Add a new department to your organization" | `text-sm text-slate-500` |

Header container: `flex items-center gap-4`

---

**Form Container:** `rounded-xl border border-[#efefef] bg-white p-6 space-y-6`

**Form Fields:**

| Field | ID | Type | Placeholder | Required | Validation | Max Length | Grid Position |
|-------|----|------|-------------|----------|------------|-----------|---------------|
| Department name | `deptName` | text | "e.g. Engineering" | Yes | Non-empty after trim | -- | Row 1, Col 1 |
| Code | `deptCode` | text | "e.g. ENG" | Yes | Non-empty after trim | 5 | Row 1, Col 2 |
| Description | `deptDesc` | text | "Brief description of the department's responsibilities" | No | -- | -- | Full width |
| Head of Department | `deptHead` | text | "e.g. John Doe" | No | -- | -- | Row 3, Col 1 |
| Title | `deptHeadTitle` | text | "e.g. VP of Engineering" | No | -- | -- | Row 3, Col 2 |
| Location | `deptLocation` | select | "Select location" | Yes | Must be selected | -- | Row 4, Col 1 |
| Annual Budget (NGN) | `deptBudget` | text (numeric) | "e.g. 5000000" | No | Digits only | -- | Row 4, Col 2 |

**Field Groups (grid layout `grid-cols-1 sm:grid-cols-2 gap-4`):**
- Row 1: Department name + Code
- Row 2: Description (full width, not in grid)
- Row 3: Head of Department + Title
- Row 4: Location + Annual Budget

**Location Options (3):**
- Lagos Office
- Abuja Office
- Port Harcourt Office

**Code Field Behavior:**
- Auto-converts to uppercase: `e.target.value.toUpperCase()`
- Maximum 5 characters: `maxLength={5}`
- Auto-focus: Department name field has `autoFocus`

**Budget Field Behavior:**
- Strips non-digit characters: `e.target.value.replace(/[^0-9]/g, "")`
- Input mode: `inputMode="numeric"`

**Label Format:**
- Required fields show red asterisk: `<span className="text-red-500">*</span>`
- Label component: `<Label>` from shadcn/ui

---

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| Department name | `!name.trim()` | "Department name is required" |
| Code | `!code.trim()` | "Department code is required" |
| Location | `!location` (empty string) | "Location is required" |

**Error Display:** `text-xs text-red-500` below the field
**Error Clearing:** Each field clears its own error on change via `setErrors((p) => ({ ...p, [field]: "" }))`

---

**Form Actions:**

| Button | Position | Action | Style |
|--------|----------|--------|-------|
| Cancel | Left | Navigate to `/departments` | `variant="outline" border-[#efefef]` |
| Create Department | Right | Validate and submit | `bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium` |

Actions container: `flex items-center justify-between pt-4 border-t border-[#efefef]`

**Submit Behavior:**
1. Click "Create Department"
2. Validation runs -- if errors, they display below respective fields and submission is blocked
3. If valid, button becomes disabled and text changes to "Creating..."
4. Mock API call: 1000ms delay (`setTimeout`)
5. `isSubmitting` resets to false
6. Navigates to `/departments`

---

**User Actions:**
- Click the back arrow button to return to `/departments`
- Fill in department name (auto-focused)
- Fill in code (auto-uppercased, max 5 chars)
- Optionally fill in description
- Optionally fill in head of department name and title
- Select a location from the dropdown
- Optionally enter annual budget (digits only)
- Click "Cancel" to discard and return to `/departments`
- Click "Create Department" to validate and submit

**Success Flow:**
1. Admin clicks "Add Department" on the Department List page
2. Navigates to `/departments/create`
3. Department name field is auto-focused
4. Admin types "Customer Success" in name field
5. Admin types "CS" in code field (auto-uppercased)
6. Admin types "Manages customer onboarding, retention, and satisfaction." in description
7. Admin types "Amina Bello" as head of department, "CS Director" as title
8. Admin selects "Lagos Office" from location dropdown
9. Admin types "3500000" in budget field
10. Admin clicks "Create Department"
11. Validation passes (name, code, location all provided)
12. Button shows "Creating..." for 1 second
13. Navigates back to `/departments`

**Error States / Edge Cases:**
- Submitting with empty department name shows "Department name is required" below the field
- Submitting with empty code shows "Department code is required" below the field
- Submitting without selecting a location shows "Location is required" below the field
- Multiple errors can display simultaneously (one per invalid field)
- Errors clear individually when the user modifies the corresponding field
- Budget field silently strips any non-numeric characters (letters, symbols, spaces)
- Code field silently converts all input to uppercase
- Button is disabled during submission to prevent double-submit
- No duplicate name/code validation exists (can create departments with the same name or code as existing ones)
- This is a mock operation -- no data is persisted; the department list remains unchanged

**Responsive Behavior:**
- Page max width: `max-w-[800px] mx-auto`
- All field group grids: `grid-cols-1` on mobile, `grid-cols-2` on `sm:` breakpoint
- Description field is always full width (not in a grid)
- Action buttons maintain `justify-between` spacing at all screen sizes

---

**Data Structures:**

```typescript
// Department interface (from department-mock-data.ts)
interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  headTitle: string;
  employeeCount: number;
  activeCount: number;
  onLeaveCount: number;
  location: string;
  budget: number;
  description: string;
  createdDate: string;
  status: "active" | "inactive";
  color: string;
}

// Create form state (local component state)
interface DepartmentCreateForm {
  name: string;
  code: string;          // auto-uppercased, max 5 chars
  description: string;
  head: string;
  headTitle: string;
  location: string;      // "" | "Lagos Office" | "Abuja Office" | "Port Harcourt Office"
  budget: string;        // numeric string, digits only
}

// Validation errors
type DepartmentErrors = Record<string, string>;
// Possible keys: "name", "code", "location"
```

---

## Complete Module Journey Map

```
/employees
  |
  +-- Employee List Dashboard
  |     |-- Summary Cards: Total (20), Active (17), On Leave (1), Terminated (0)
  |     |-- Status Tabs: All | Active | On Leave | Suspended | Terminated
  |     |-- Search: by name, ID, email, title, department
  |     |-- Filters: Department, Employment Type, Location
  |     |-- Table: 20 employee rows with avatar, ID, dept, title, type, status, location, date
  |     |-- Row click → /employees/{id}
  |     |
  |     +-- "Add Employee" → /employees/create
  |     +-- "Export" → CSV/Excel (mock)
  |
  +-- /employees/create
        |-- Step 1: Personal Info (8 fields)
        |-- Step 2: Contact Details (8 fields)
        |-- Step 3: Employment (8 fields)
        |-- Step 4: Review & Submit (3 summary panels)
        |-- Save Draft (localStorage)
        |-- Submit → /employees

/departments
  |
  +-- Department List Dashboard
  |     |-- Summary Cards: Departments (8), Employees (156), Budget (₦63.5M), Locations (3)
  |     |-- Search: by name, code, head
  |     |-- View Toggle: Grid | Table
  |     |-- Grid: 3-column card layout
  |     |-- Table: 8-column data table
  |     |-- Card/Row click → /employees?department={name}
  |     |
  |     +-- "Add Department" → /departments/create
  |     +-- "Reassign Employees" → Modal overlay
  |           |-- Select target department
  |           |-- Select/deselect active employees
  |           |-- Reassign (mock)
  |           |-- Success confirmation + auto-close
  |
  +-- /departments/create
        |-- Form: name*, code*, description, head, title, location*, budget
        |-- Validate → Create (mock) → /departments
```

---

## State Persistence

- **Employee draft:** `localStorage.setItem("employee-draft", JSON.stringify({ form, step }))` -- saved on "Save Draft" click, removed on successful submission
- **No server persistence:** All data is mock -- employee creation, department creation, and reassignment do not persist to any backend or modify the in-memory mock arrays
- **Filter/search state:** Stored in component `useState` only -- resets on navigation away from the page
- **View toggle (departments):** Stored in component `useState` only -- defaults to "grid" on each visit
