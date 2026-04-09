# SabiHR - Attendance & Leave Modules: User Stories & Use Cases

## Overview

This document details the complete Attendance Management and Leave Management modules for SabiHR, covering every screen, input field, validation rule, user action, mock data record, and edge case.

The modules are split into two sections:
1. **Attendance Management** (`/attendance`) -- Daily employee attendance tracking, filtering, and reporting
2. **Leave Management** (`/leave`) -- Employee leave request review, approval/rejection, and policy overview

---

## Module 1: Attendance Management

### US-10: View Attendance Summary Cards

**As a** company admin,
**I want to** see a high-level summary of today's attendance at a glance,
**So that** I can quickly understand workforce availability without reviewing individual records.

#### Screen: Attendance Management (`/attendance`)

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Heading | "Attendance Management" | `text-xl font-semibold tracking-tight` |
| Subheading | "Track and manage daily employee attendance" | `text-sm text-muted-foreground` |
| Export Button | "Export Report" with Download icon | `variant="outline" size="sm"`, Download icon `w-4 h-4 mr-2` |

**Summary Cards (5 cards in a row):**

Layout: `grid grid-cols-2 sm:grid-cols-5 gap-4`

| Card | Icon | Label | Value (from mock data) | Border Color | Background | Text Color |
|------|------|-------|----------------------|--------------|------------|------------|
| Total | Users `w-4 h-4` | "Total" | 20 | `border-border` | `bg-card` | default |
| Present | Clock `w-4 h-4` | "Present" | 12 | `border-emerald-200` | `bg-emerald-50/50` | `text-emerald-700` |
| Late | AlertTriangle `w-4 h-4` | "Late" | 3 | `border-amber-200` | `bg-amber-50/50` | `text-amber-700` |
| Absent | Users `w-4 h-4` | "Absent" | 2 | `border-red-200` | `bg-red-50/50` | `text-red-700` |
| On Leave | CalendarDays `w-4 h-4` | "On Leave" | 2 | `border-blue-200` | `bg-blue-50/50` | `text-blue-700` |

**Card Structure (each card):**
- Container: `rounded-xl border p-4`
- Icon + label row: `flex items-center gap-2 mb-1`, label is `text-xs font-medium`
- Value: `text-2xl font-semibold`

**Summary Calculation Logic:**
- `total` = all records count (20)
- `present` = records where `status === "present"` (12)
- `late` = records where `status === "late"` (3)
- `absent` = records where `status === "absent"` (2)
- `onLeave` = records where `status === "on-leave"` (2)
- `halfDay` = records where `status === "half-day"` (1)

**User Actions:**
- View summary card counts (read-only, computed from mock data)
- Click "Export Report" button (no-op in mock)

**Responsive Behavior:**
- Mobile (< 640px): 2-column grid, cards wrap to multiple rows
- Desktop (>= 640px): 5-column single row

---

### US-11: View Attendance Rate Progress Bar

**As a** company admin,
**I want to** see a visual attendance rate bar for the day,
**So that** I can instantly gauge overall attendance health by status breakdown.

#### Screen: Attendance Management (`/attendance`)

**Attendance Rate Bar Container:** `rounded-xl border border-border bg-card p-4`

**Header Row:** `flex items-center justify-between mb-2`
- Label: "Today's Attendance Rate" (`text-sm font-medium`)
- Percentage: e.g. "80%" (`text-sm font-semibold`)

**Rate Calculation:**
```
attendanceRate = Math.round(((present + late + halfDay) / total) * 100)
```
With mock data: `Math.round(((12 + 3 + 1) / 20) * 100)` = **80%**

**Stacked Progress Bar:** `h-3 rounded-full bg-muted overflow-hidden flex`

| Segment | Color | Width Formula | Mock Width |
|---------|-------|---------------|------------|
| Present | `bg-emerald-500` | `(present / total) * 100%` | 60% |
| Late | `bg-amber-400` | `(late / total) * 100%` | 15% |
| Half Day | `bg-violet-400` | `(halfDay / total) * 100%` | 5% |
| On Leave | `bg-blue-400` | `(onLeave / total) * 100%` | 10% |
| Absent | `bg-red-400` | `(absent / total) * 100%` | 10% |

All segments use `transition-all` for smooth width changes.

**Legend:** `flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap`

| Legend Item | Dot Color |
|-------------|-----------|
| Present | `bg-emerald-500` |
| Late | `bg-amber-400` |
| Half Day | `bg-violet-400` |
| On Leave | `bg-blue-400` |
| Absent | `bg-red-400` |

Each legend item: `flex items-center gap-1` with a `w-2 h-2 rounded-full` color dot.

**User Actions:**
- View attendance rate (read-only, no interaction)

---

### US-12: Navigate Dates and Search/Filter Attendance Records

**As a** company admin,
**I want to** select a date and search or filter attendance records,
**So that** I can find specific employee records or view attendance for any given day.

#### Screen: Attendance Management (`/attendance`)

**Date Selector + Toolbar Row:** `flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between`

**Date Navigator:**

Container: `flex items-center gap-1 border border-border rounded-lg p-1`

| Element | Type | Details |
|---------|------|---------|
| Previous Day | button | `<ChevronLeft className="w-4 h-4" />`, `p-1 rounded hover:bg-muted transition-colors` |
| Date Input | `<Input type="date">` | Default value: `"2026-03-24"`, `w-auto border-0 shadow-none text-sm font-medium px-2` |
| Next Day | button | `<ChevronRight className="w-4 h-4" />`, `p-1 rounded hover:bg-muted transition-colors` |

**Search Input:**

| Field | Type | Placeholder | Icon | Style |
|-------|------|-------------|------|-------|
| Search | text | "Search employees..." | Search icon (left, `w-4 h-4 text-muted-foreground`) | `pl-9`, container `relative flex-1 max-w-sm` |

**Search Behavior:**
- Filters by `employeeName` (case-insensitive partial match)
- Filters by `department` (case-insensitive partial match)
- Real-time filtering on every keystroke (controlled input via `useState`)

**Filter Toggle Button:**
- Label: "Filters" with Filter icon (`w-4 h-4 mr-2`)
- `variant="outline" size="sm"`
- Toggles `filterOpen` state on click

**Filter Panel (visible when `filterOpen === true`):**

Container: `grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4`

| Filter | Type | Label | Default | Options |
|--------|------|-------|---------|---------|
| Status | Select dropdown | "Status" (`text-xs font-medium text-muted-foreground`) | "All Statuses" | All Statuses, Present, Late, Absent, On Leave, Half Day |
| Department | Select dropdown | "Department" (`text-xs font-medium text-muted-foreground`) | "All Departments" | All Departments, Engineering, Finance, Human Resources, IT, Legal, Marketing, Operations, Sales |

**Status Filter Options (derived from `ATTENDANCE_STATUS_STYLES`):**

| Value | Display Label |
|-------|---------------|
| `all` | All Statuses |
| `present` | Present |
| `late` | Late |
| `absent` | Absent |
| `on-leave` | On Leave |
| `half-day` | Half Day |

**Department Filter Options (derived dynamically from mock data, sorted alphabetically):**

| Value | Display Label |
|-------|---------------|
| `all` | All Departments |
| `Engineering` | Engineering |
| `Finance` | Finance |
| `Human Resources` | Human Resources |
| `IT` | IT |
| `Legal` | Legal |
| `Marketing` | Marketing |
| `Operations` | Operations |
| `Sales` | Sales |

**Combined Filter Logic:**
```typescript
MOCK_ATTENDANCE_RECORDS.filter((r) => {
  const q = search.toLowerCase();
  const matchesSearch = !q || r.employeeName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  const matchesStatus = statusFilter === "all" || r.status === statusFilter;
  const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
  return matchesSearch && matchesStatus && matchesDept;
});
```

**State Variables:**

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `search` | `string` | `""` | Search query for employee name or department |
| `statusFilter` | `string` | `"all"` | Selected status filter |
| `departmentFilter` | `string` | `"all"` | Selected department filter |
| `filterOpen` | `boolean` | `false` | Whether filter panel is visible |
| `selectedDate` | `string` | `"2026-03-24"` | Currently selected date |

**User Actions:**
- Click left chevron to navigate to previous day
- Click right chevron to navigate to next day
- Change date via the native date picker input
- Type in the search field to filter by employee name or department
- Click "Filters" button to toggle the filter panel open/closed
- Select a status from the Status dropdown
- Select a department from the Department dropdown
- All filters combine with AND logic (all must match)

**Success Flow:**
1. Admin opens Attendance page (all 20 records visible)
2. Types "eng" in search bar
3. Table instantly filters to show only Engineering department employees
4. Admin clicks "Filters" to open the filter panel
5. Selects "Late" from Status dropdown
6. Table now shows only Engineering employees who are late
7. Admin clears search and resets Status to "All Statuses"
8. All 20 records are visible again

**Error States / Edge Cases:**
- Empty search string shows all records (no filter applied)
- Combining filters that match zero records shows empty state
- Department list is computed once via `useMemo` and sorted alphabetically
- Filter panel slides into view immediately (no animation)

---

### US-13: View Attendance Records Table

**As a** company admin,
**I want to** view a detailed table of all employee attendance records for the selected day,
**So that** I can review individual clock-in/out times, hours worked, statuses, and locations.

#### Screen: Attendance Management (`/attendance`)

**Table Container:** `rounded-xl border border-border bg-card overflow-x-auto`

**Table:** `w-full text-sm`

**Table Header Row:** `border-b border-border bg-muted/50`

| Column | Header Text | Style |
|--------|-------------|-------|
| Employee | "Employee" | `p-3 text-left font-medium text-muted-foreground` |
| Department | "Department" | `p-3 text-left font-medium text-muted-foreground` |
| Clock In | "Clock In" | `p-3 text-left font-medium text-muted-foreground` |
| Clock Out | "Clock Out" | `p-3 text-left font-medium text-muted-foreground` |
| Hours | "Hours" | `p-3 text-left font-medium text-muted-foreground` |
| Status | "Status" | `p-3 text-left font-medium text-muted-foreground` |
| Location | "Location" | `p-3 text-left font-medium text-muted-foreground` |

**Table Body Row Style:** `border-b border-border last:border-0 hover:bg-muted/30 transition-colors`

**Column Rendering Details:**

| Column | Rendering | Style |
|--------|-----------|-------|
| Employee | Avatar circle (initials) + full name | Avatar: `w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium`. Name: `font-medium` |
| Department | Plain text | `text-muted-foreground` |
| Clock In | Time string or "--" if null | `font-mono text-xs`. Null: `text-muted-foreground` showing "--" |
| Clock Out | Time string or "--" if null | `font-mono text-xs`. Null: `text-muted-foreground` showing "--" |
| Hours | Number with 1 decimal + "h" or "--" if null | Number: `font-medium` e.g. "8.4h". Null: `text-muted-foreground` showing "--" |
| Status | Colored badge | `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border` + status-specific colors |
| Location | Plain text | `text-muted-foreground` |

**Avatar Initials Logic:**
```typescript
record.employeeName.split(" ").map((n) => n[0]).join("")
```
Example: "Adebayo Ogunlesi" -> "AO"

**Status Badge Styles:**

| Status | Background & Border | Text Color | Display Label |
|--------|-------------------|------------|---------------|
| Present | `bg-emerald-50 border-emerald-200` | `text-emerald-700` | "Present" |
| Late | `bg-amber-50 border-amber-200` | `text-amber-700` | "Late" |
| Absent | `bg-red-50 border-red-200` | `text-red-700` | "Absent" |
| On Leave | `bg-blue-50 border-blue-200` | `text-blue-700` | "On Leave" |
| Half Day | `bg-violet-50 border-violet-200` | `text-violet-700` | "Half Day" |

**Complete Mock Data Table (20 records):**

| ID | Employee ID | Employee Name | Department | Date | Clock In | Clock Out | Status | Hours Worked | Location |
|----|-------------|---------------|------------|------|----------|-----------|--------|-------------|----------|
| att-001 | emp-001 | Adebayo Ogunlesi | Engineering | 2026-03-24 | 08:45 | 17:10 | present | 8.4 | Lagos Office |
| att-002 | emp-002 | Chiamaka Eze | Engineering | 2026-03-24 | 08:30 | 17:30 | present | 9.0 | Lagos Office |
| att-003 | emp-003 | Oluwaseun Afolabi | Engineering | 2026-03-24 | 09:22 | 17:00 | late | 7.6 | Lagos Office |
| att-004 | emp-004 | Fatima Abdullahi | Human Resources | 2026-03-24 | 08:50 | 17:05 | present | 8.2 | Abuja Office |
| att-005 | emp-005 | Emeka Okafor | Sales | 2026-03-24 | null | null | absent | null | Lagos Office |
| att-006 | emp-006 | Aisha Mohammed | Finance | 2026-03-24 | 08:40 | 17:15 | present | 8.6 | Abuja Office |
| att-007 | emp-007 | Tochukwu Nwankwo | Engineering | 2026-03-24 | 09:10 | 17:30 | late | 8.3 | Lagos Office |
| att-008 | emp-008 | Bukola Adeyemi | Marketing | 2026-03-24 | 08:55 | 17:00 | present | 8.1 | Lagos Office |
| att-009 | emp-009 | Ibrahim Musa | Operations | 2026-03-24 | null | null | on-leave | null | Kano Office |
| att-010 | emp-010 | Yetunde Bakare | Legal | 2026-03-24 | 08:35 | 17:00 | present | 8.4 | Lagos Office |
| att-011 | emp-011 | Chibueze Okoro | Finance | 2026-03-24 | 08:28 | 17:20 | present | 8.9 | Lagos Office |
| att-012 | emp-012 | Ngozi Ibe | Sales | 2026-03-24 | 08:50 | 13:00 | half-day | 4.2 | Lagos Office |
| att-013 | emp-013 | Kemi Adekunle | Human Resources | 2026-03-24 | null | null | on-leave | null | Lagos Office |
| att-014 | emp-014 | Damilola Osei | Engineering | 2026-03-24 | 08:42 | 17:05 | present | 8.4 | Lagos Office |
| att-015 | emp-015 | Usman Bello | IT | 2026-03-24 | 08:30 | 17:00 | present | 8.5 | Abuja Office |
| att-016 | emp-016 | Amara Obi | Marketing | 2026-03-24 | 09:05 | 17:10 | late | 8.1 | Lagos Office |
| att-017 | emp-017 | Olumide Fashola | Sales | 2026-03-24 | null | null | absent | null | Lagos Office |
| att-018 | emp-018 | Halima Yusuf | Legal | 2026-03-24 | 08:48 | 17:00 | present | 8.2 | Abuja Office |
| att-019 | emp-019 | Segun Adeniyi | Operations | 2026-03-24 | 08:55 | 17:15 | present | 8.3 | Lagos Office |
| att-020 | emp-020 | Folake Williams | Finance | 2026-03-24 | 08:38 | 17:00 | present | 8.4 | Lagos Office |

**Empty State (when filters match zero records):**

| Element | Details |
|---------|---------|
| Container | `colSpan={7}`, `p-12 text-center text-muted-foreground` |
| Icon | Clock icon, `w-10 h-10 mx-auto mb-3 opacity-30` |
| Heading | "No attendance records found" (`font-medium`) |
| Subtext | "Try adjusting your search or filters" (`text-xs mt-1`) |

**User Actions:**
- Scroll horizontally on mobile to see all columns (table has `overflow-x-auto`)
- Hover over any row to see hover highlight (`hover:bg-muted/30`)
- View employee initials avatar for quick identification
- View clock-in/out times in monospaced font for alignment
- View hours worked rounded to 1 decimal place
- Identify status by color-coded badge

**Responsive Behavior:**
- Table scrolls horizontally on screens narrower than content width
- Container has `overflow-x-auto` for horizontal scrolling
- Page max width: `max-w-[1400px] mx-auto`
- Overall page spacing: `space-y-6`

---

## Module 2: Leave Management

### US-14: View Leave Policy Summary

**As a** company admin,
**I want to** see the leave policy allocation per leave type at a glance,
**So that** I understand the annual leave entitlements before reviewing requests.

#### Screen: Leave Management (`/leave`)

**Page Header:**

| Element | Content | Style |
|---------|---------|-------|
| Heading | "Leave Management" | `text-xl font-semibold tracking-tight` |
| Subheading | "Review and manage employee leave requests" | `text-sm text-muted-foreground` |
| Export Button | "Export" with Download icon | `variant="outline" size="sm"`, Download icon `w-4 h-4 mr-2` |

**Leave Policy Summary Cards (6 cards):**

Layout: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3`

| Leave Type Key | Label | Total Days/Year | Card Style |
|----------------|-------|-----------------|------------|
| `annual` | Annual Leave | 20 | `rounded-xl border border-border bg-card p-3 text-center` |
| `sick` | Sick Leave | 10 | `rounded-xl border border-border bg-card p-3 text-center` |
| `casual` | Casual Leave | 5 | `rounded-xl border border-border bg-card p-3 text-center` |
| `maternity` | Maternity Leave | 90 | `rounded-xl border border-border bg-card p-3 text-center` |
| `paternity` | Paternity Leave | 10 | `rounded-xl border border-border bg-card p-3 text-center` |
| `compassionate` | Compassionate Leave | 5 | `rounded-xl border border-border bg-card p-3 text-center` |

**Card Internal Structure:**
- Label: `text-xs text-muted-foreground mb-1`
- Value: `text-lg font-semibold`
- Unit: "days/year" (`text-[10px] text-muted-foreground`)

**Leave Policy Data Structure:**
```typescript
export const LEAVE_POLICY_SUMMARY = {
  annual: { total: 20, label: "Annual Leave" },
  sick: { total: 10, label: "Sick Leave" },
  casual: { total: 5, label: "Casual Leave" },
  maternity: { total: 90, label: "Maternity Leave" },
  paternity: { total: 10, label: "Paternity Leave" },
  compassionate: { total: 5, label: "Compassionate Leave" },
};
```

**User Actions:**
- View leave policy allocations (read-only, no interaction)
- Click "Export" button (no-op in mock)

**Responsive Behavior:**
- Mobile (< 640px): 2-column grid
- Tablet (640px - 1023px): 3-column grid
- Desktop (>= 1024px): 6-column single row

---

### US-15: Filter Leave Requests by Status Tabs

**As a** company admin,
**I want to** quickly switch between pending, approved, and rejected leave requests using tabs,
**So that** I can prioritize reviewing pending requests and check historical decisions.

#### Screen: Leave Management (`/leave`)

**Status Tabs Bar:** `flex items-center gap-1 border-b border-border`

| Tab Key | Label | Count Badge Style |
|---------|-------|------------------|
| `all` | "All Requests" | `bg-muted` (neutral) |
| `pending` | "Pending" | `bg-amber-100 text-amber-700` (highlighted) |
| `approved` | "Approved" | `bg-muted` (neutral) |
| `rejected` | "Rejected" | `bg-muted` (neutral) |

**Tab Button Style:**
- Base: `px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px`
- Active: `border-primary text-primary`
- Inactive: `border-transparent text-muted-foreground hover:text-foreground`

**Count Badge Style:**
- Base: `ml-1.5 text-xs px-1.5 py-0.5 rounded-full`
- Pending tab badge: `bg-amber-100 text-amber-700` (draws attention)
- All other badges: `bg-muted`

**Status Counts (from mock data):**

| Tab | Count |
|-----|-------|
| All Requests | 12 |
| Pending | 6 |
| Approved | 5 |
| Rejected | 1 |

Note: The `cancelled` status exists in the type definition but has 0 records in mock data and no corresponding tab.

**Tab Behavior:**
- Clicking a tab sets `statusFilter` state to the tab key
- The table immediately filters to show only matching records
- Active tab has a bottom border in primary color
- Count badges show next to each tab label (only if count > 0)

**User Actions:**
- Click "All Requests" tab to view all 12 leave requests
- Click "Pending" tab to view 6 pending requests
- Click "Approved" tab to view 5 approved requests
- Click "Rejected" tab to view 1 rejected request

**Success Flow:**
1. Admin lands on Leave page (All Requests tab active, showing 12 records)
2. Admin clicks "Pending" tab
3. Tab underline moves to Pending, table filters to show 6 pending requests
4. Admin reviews pending requests and takes approve/reject actions
5. Clicks "All Requests" to return to full view

---

### US-16: Search and Filter Leave Requests

**As a** company admin,
**I want to** search by employee name or department and filter by leave type and department,
**So that** I can quickly locate specific leave requests.

#### Screen: Leave Management (`/leave`)

**Toolbar Row:** `flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between`

**Search Input:**

| Field | Type | Placeholder | Icon | Style |
|-------|------|-------------|------|-------|
| Search | text | "Search by employee or department..." | Search icon (left, `w-4 h-4 text-muted-foreground`) | `pl-9`, container `relative flex-1 max-w-sm` |

**Search Behavior:**
- Filters by `employeeName` (case-insensitive partial match)
- Filters by `department` (case-insensitive partial match)
- Real-time filtering on every keystroke

**Filter Toggle Button:**
- Label: "Filters" with Filter icon (`w-4 h-4 mr-2`)
- `variant="outline" size="sm"`
- Toggles `filterOpen` state on click

**Filter Panel (visible when `filterOpen === true`):**

Container: `grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4`

| Filter | Type | Label | Default | Options |
|--------|------|-------|---------|---------|
| Leave Type | Select dropdown | "Leave Type" (`text-xs font-medium text-muted-foreground`) | "All Types" | All Types, Annual Leave, Sick Leave, Casual Leave, Maternity Leave, Paternity Leave, Compassionate Leave |
| Department | Select dropdown | "Department" (`text-xs font-medium text-muted-foreground`) | "All Departments" | All Departments, Engineering, Finance, Human Resources, Legal, Marketing, Operations, Sales |

**Leave Type Filter Options (from `LEAVE_TYPE_LABELS`):**

| Value | Display Label |
|-------|---------------|
| `all` | All Types |
| `annual` | Annual Leave |
| `sick` | Sick Leave |
| `casual` | Casual Leave |
| `maternity` | Maternity Leave |
| `paternity` | Paternity Leave |
| `compassionate` | Compassionate Leave |

**Department Filter Options (derived dynamically from mock data, sorted alphabetically):**

| Value | Display Label |
|-------|---------------|
| `all` | All Departments |
| `Engineering` | Engineering |
| `Finance` | Finance |
| `Human Resources` | Human Resources |
| `Legal` | Legal |
| `Marketing` | Marketing |
| `Operations` | Operations |
| `Sales` | Sales |

**Combined Filter Logic (all filters use AND):**
```typescript
MOCK_LEAVE_REQUESTS.filter((r) => {
  const q = search.toLowerCase();
  const matchesSearch = !q || r.employeeName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  const matchesStatus = statusFilter === "all" || r.status === statusFilter;
  const matchesType = typeFilter === "all" || r.leaveType === typeFilter;
  const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
  return matchesSearch && matchesStatus && matchesType && matchesDept;
});
```

**State Variables:**

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `search` | `string` | `""` | Search query for employee name or department |
| `statusFilter` | `string` | `"all"` | Selected status tab (controlled by tabs AND filter) |
| `typeFilter` | `string` | `"all"` | Selected leave type filter |
| `departmentFilter` | `string` | `"all"` | Selected department filter |
| `filterOpen` | `boolean` | `false` | Whether filter panel is visible |

**User Actions:**
- Type in search field to filter by employee name or department
- Click "Filters" button to toggle filter panel
- Select a leave type from the Leave Type dropdown
- Select a department from the Department dropdown
- All filters (tabs + search + leave type + department) combine with AND logic

**Error States / Edge Cases:**
- Empty search with "all" filters shows all records
- Combining multiple restrictive filters may yield zero results (shows empty state)
- Status tabs and status filter share the same `statusFilter` state variable
- Department list is computed once with `useMemo` and sorted alphabetically

---

### US-17: View Leave Requests Table and Take Actions

**As a** company admin,
**I want to** view a detailed table of all leave requests with approve/reject actions for pending ones,
**So that** I can review request details and make approval decisions.

#### Screen: Leave Management (`/leave`)

**Table Container:** `rounded-xl border border-border bg-card overflow-x-auto`

**Table:** `w-full text-sm`

**Table Header Row:** `border-b border-border bg-muted/50`

| Column | Header Text | Style |
|--------|-------------|-------|
| Employee | "Employee" | `p-3 text-left font-medium text-muted-foreground` |
| Department | "Department" | `p-3 text-left font-medium text-muted-foreground` |
| Leave Type | "Leave Type" | `p-3 text-left font-medium text-muted-foreground` |
| Duration | "Duration" | `p-3 text-left font-medium text-muted-foreground` |
| Days | "Days" | `p-3 text-left font-medium text-muted-foreground` |
| Applied On | "Applied On" | `p-3 text-left font-medium text-muted-foreground` |
| Status | "Status" | `p-3 text-left font-medium text-muted-foreground` |
| Actions | "Actions" | `p-3 text-left font-medium text-muted-foreground` |

**Table Body Row Style:** `border-b border-border last:border-0 hover:bg-muted/30 transition-colors`

**Column Rendering Details:**

| Column | Rendering | Style |
|--------|-----------|-------|
| Employee | Avatar circle (initials) + full name | Avatar: `w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium`. Name: `font-medium` |
| Department | Plain text | `text-muted-foreground` |
| Leave Type | Colored badge | `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium` + type-specific colors |
| Duration | Start date - end date (formatted) | `text-xs`, formatted as "DD Mon - DD Mon YYYY" using `en-NG` locale |
| Days | Number | `font-medium` |
| Applied On | Formatted date | `text-muted-foreground text-xs`, formatted as "DD Mon YYYY" using `en-NG` locale |
| Status | Colored badge with border | `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border` + status-specific colors |
| Actions | Approve/Reject buttons OR approver name OR "--" | Conditional rendering based on status |

**Leave Type Badge Colors:**

| Leave Type | Background | Text Color | Display Label |
|------------|------------|------------|---------------|
| Annual Leave | `bg-blue-100` | `text-blue-700` | "Annual Leave" |
| Sick Leave | `bg-red-100` | `text-red-700` | "Sick Leave" |
| Casual Leave | `bg-violet-100` | `text-violet-700` | "Casual Leave" |
| Maternity Leave | `bg-pink-100` | `text-pink-700` | "Maternity Leave" |
| Paternity Leave | `bg-cyan-100` | `text-cyan-700` | "Paternity Leave" |
| Compassionate Leave | `bg-amber-100` | `text-amber-700` | "Compassionate Leave" |

**Status Badge Styles:**

| Status | Background & Border | Text Color | Display Label |
|--------|-------------------|------------|---------------|
| Pending | `bg-amber-50 border-amber-200` | `text-amber-700` | "Pending" |
| Approved | `bg-emerald-50 border-emerald-200` | `text-emerald-700` | "Approved" |
| Rejected | `bg-red-50 border-red-200` | `text-red-700` | "Rejected" |
| Cancelled | `bg-gray-50 border-gray-200` | `text-gray-600` | "Cancelled" |

**Actions Column Logic:**

| Condition | Rendering |
|-----------|-----------|
| `status === "pending"` | Approve button (CheckCircle2, green) + Reject button (XCircle, red) |
| `status !== "pending"` AND `approvedBy` exists | "by {approvedBy}" text |
| `status !== "pending"` AND no `approvedBy` | "--" text |

**Approve Button:**
- Icon: CheckCircle2 `w-4 h-4`
- Style: `p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors`
- Title attribute: "Approve"
- On click: `alert("Leave request {id} approved")` (mock action)

**Reject Button:**
- Icon: XCircle `w-4 h-4`
- Style: `p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors`
- Title attribute: "Reject"
- On click: `alert("Leave request {id} rejected")` (mock action)

**Date Formatting:**
- Duration start: `toLocaleDateString("en-NG", { day: "numeric", month: "short" })` -- e.g. "20 Mar"
- Duration end: `toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })` -- e.g. "22 Mar 2026"
- Applied On: `toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })` -- e.g. "10 Mar 2026"

**Complete Mock Data Table (12 records):**

| ID | Employee ID | Employee Name | Department | Leave Type | Start Date | End Date | Days | Status | Reason | Applied On | Approved By |
|----|-------------|---------------|------------|------------|------------|----------|------|--------|--------|------------|-------------|
| lv-001 | emp-001 | Adebayo Ogunlesi | Engineering | annual | 2026-03-20 | 2026-03-22 | 2 | pending | Family vacation | 2026-03-10 | null |
| lv-002 | emp-003 | Oluwaseun Afolabi | Engineering | sick | 2026-03-17 | 2026-03-18 | 2 | pending | Medical appointment and recovery | 2026-03-15 | null |
| lv-003 | emp-009 | Ibrahim Musa | Operations | annual | 2026-03-24 | 2026-03-28 | 5 | approved | Travelling for a family event | 2026-03-05 | Olufunke Adeyemi |
| lv-004 | emp-013 | Kemi Adekunle | Human Resources | maternity | 2026-03-15 | 2026-06-12 | 90 | approved | Maternity leave | 2026-02-28 | Fatima Abdullahi |
| lv-005 | emp-005 | Emeka Okafor | Sales | casual | 2026-03-24 | 2026-03-24 | 1 | pending | Personal errand | 2026-03-21 | null |
| lv-006 | emp-008 | Bukola Adeyemi | Marketing | annual | 2026-04-01 | 2026-04-05 | 5 | pending | Holiday trip | 2026-03-18 | null |
| lv-007 | emp-012 | Ngozi Ibe | Sales | sick | 2026-03-10 | 2026-03-11 | 2 | approved | Flu and fever | 2026-03-10 | Olufunke Adeyemi |
| lv-008 | emp-004 | Fatima Abdullahi | Human Resources | compassionate | 2026-02-20 | 2026-02-22 | 3 | approved | Family bereavement | 2026-02-19 | Olufunke Adeyemi |
| lv-009 | emp-007 | Tochukwu Nwankwo | Engineering | annual | 2026-03-05 | 2026-03-07 | 3 | rejected | Personal time off | 2026-02-25 | null |
| lv-010 | emp-016 | Amara Obi | Marketing | casual | 2026-03-28 | 2026-03-28 | 1 | pending | Attending a workshop | 2026-03-22 | null |
| lv-011 | emp-006 | Aisha Mohammed | Finance | annual | 2026-04-10 | 2026-04-14 | 5 | pending | Annual vacation | 2026-03-20 | null |
| lv-012 | emp-018 | Halima Yusuf | Legal | sick | 2026-03-01 | 2026-03-02 | 2 | approved | Dental procedure | 2026-02-28 | Yetunde Bakare |

**Empty State (when filters match zero records):**

| Element | Details |
|---------|---------|
| Container | `colSpan={8}`, `p-12 text-center text-muted-foreground` |
| Icon | Palmtree icon, `w-10 h-10 mx-auto mb-3 opacity-30` |
| Heading | "No leave requests found" (`font-medium`) |
| Subtext | "Try adjusting your search or filters" (`text-xs mt-1`) |

**User Actions:**
- Scroll horizontally on mobile to see all columns
- Hover over any row to see hover highlight
- View employee initials avatar for quick identification
- Identify leave type by color-coded badge
- Identify status by color-coded status badge
- Click Approve (green check) on pending requests -- triggers alert "Leave request {id} approved"
- Click Reject (red X) on pending requests -- triggers alert "Leave request {id} rejected"
- For approved/rejected requests, see who approved or "--" if no approver recorded

**Success Flow (Approve a Leave Request):**
1. Admin navigates to Leave page
2. Clicks "Pending" tab to filter to 6 pending requests
3. Reviews Adebayo Ogunlesi's annual leave request (2 days, Mar 20-22)
4. Clicks the green Approve button (CheckCircle2 icon)
5. Browser alert appears: "Leave request lv-001 approved"
6. (In production, the record status would update to "approved")

**Success Flow (Reject a Leave Request):**
1. Admin navigates to Leave page
2. Clicks "Pending" tab
3. Reviews a pending request
4. Clicks the red Reject button (XCircle icon)
5. Browser alert appears: "Leave request {id} rejected"
6. (In production, the record status would update to "rejected")

**Error States / Edge Cases:**
- Approve/Reject buttons only visible for pending requests
- Non-pending requests show approver name or "--" in Actions column
- The `reason` field exists in mock data but is NOT displayed in the table (available for future detail view)
- The `cancelled` status is defined in the type system but has no records in mock data
- Mock approve/reject actions only show browser alerts; no state mutation occurs

---

## Data Structures

### Attendance Module

```typescript
// Attendance Status Type
export type AttendanceStatus = "present" | "late" | "absent" | "on-leave" | "half-day";

// Attendance Record Interface
export interface AttendanceRecord {
  id: string;            // Unique record ID, format: "att-XXX"
  employeeId: string;    // Reference to employee, format: "emp-XXX"
  employeeName: string;  // Full name for display
  department: string;    // Department name
  date: string;          // ISO date string, format: "YYYY-MM-DD"
  clockIn: string | null;  // Time string "HH:MM" or null for absent/on-leave
  clockOut: string | null; // Time string "HH:MM" or null for absent/on-leave
  status: AttendanceStatus; // One of 5 statuses
  hoursWorked: number | null; // Decimal hours or null for absent/on-leave
  location: string;      // Office location name
}

// Status Style Configuration
export const ATTENDANCE_STATUS_STYLES: Record<
  AttendanceStatus,
  { label: string; bg: string; color: string }
> = {
  present: { label: "Present", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  late: { label: "Late", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  absent: { label: "Absent", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "on-leave": { label: "On Leave", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "half-day": { label: "Half Day", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
};
```

### Leave Module

```typescript
// Leave Status Type
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

// Leave Type
export type LeaveType = "annual" | "sick" | "casual" | "maternity" | "paternity" | "compassionate";

// Leave Request Interface
export interface LeaveRequest {
  id: string;            // Unique request ID, format: "lv-XXX"
  employeeId: string;    // Reference to employee, format: "emp-XXX"
  employeeName: string;  // Full name for display
  department: string;    // Department name
  leaveType: LeaveType;  // One of 6 leave types
  startDate: string;     // ISO date string, format: "YYYY-MM-DD"
  endDate: string;       // ISO date string, format: "YYYY-MM-DD"
  days: number;          // Total leave days requested
  status: LeaveStatus;   // One of 4 statuses
  reason: string;        // Employee's reason for leave
  appliedOn: string;     // ISO date string when request was submitted
  approvedBy: string | null; // Name of approver or null if pending/rejected
}

// Status Style Configuration
export const LEAVE_STATUS_STYLES: Record<
  LeaveStatus,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  cancelled: { label: "Cancelled", bg: "bg-gray-50 border-gray-200", color: "text-gray-600" },
};

// Leave Type Labels
export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  compassionate: "Compassionate Leave",
};

// Leave Type Badge Colors
export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  annual: "bg-blue-100 text-blue-700",
  sick: "bg-red-100 text-red-700",
  casual: "bg-violet-100 text-violet-700",
  maternity: "bg-pink-100 text-pink-700",
  paternity: "bg-cyan-100 text-cyan-700",
  compassionate: "bg-amber-100 text-amber-700",
};

// Leave Policy Summary
export const LEAVE_POLICY_SUMMARY = {
  annual: { total: 20, label: "Annual Leave" },
  sick: { total: 10, label: "Sick Leave" },
  casual: { total: 5, label: "Casual Leave" },
  maternity: { total: 90, label: "Maternity Leave" },
  paternity: { total: 10, label: "Paternity Leave" },
  compassionate: { total: 5, label: "Compassionate Leave" },
};
```

---

## State Persistence

- **No server persistence**: All data is mock -- attendance records and leave requests are not sent to an API
- **No localStorage usage**: Neither module persists filter/search state across sessions
- **Mock actions**: Approve/Reject in Leave module trigger browser `alert()` only; no state mutation occurs
- **Static mock data**: Attendance records are for a single date (2026-03-24); date navigation does not change displayed records

---

## Complete User Journey Map

```
/attendance
  |
  +-- Summary Cards
  |     |-- View total, present, late, absent, on-leave counts
  |
  +-- Attendance Rate Bar
  |     |-- View stacked progress bar with color-coded segments
  |     |-- View attendance rate percentage (80%)
  |     |-- View color legend
  |
  +-- Date Navigation + Search + Filters
  |     |-- Navigate between dates (chevron buttons + date picker)
  |     |-- Search by employee name or department
  |     |-- Toggle filter panel
  |     |-- Filter by status (Present/Late/Absent/On Leave/Half Day)
  |     |-- Filter by department (8 departments)
  |
  +-- Attendance Table
        |-- View 20 employee records with 7 columns
        |-- See initials avatars, clock times, hours, status badges
        |-- Empty state when no records match filters

/leave
  |
  +-- Leave Policy Summary
  |     |-- View 6 leave type allocations (days/year)
  |
  +-- Status Tabs
  |     |-- All Requests (12)
  |     |-- Pending (6)
  |     |-- Approved (5)
  |     |-- Rejected (1)
  |
  +-- Search + Filters
  |     |-- Search by employee name or department
  |     |-- Toggle filter panel
  |     |-- Filter by leave type (6 types)
  |     |-- Filter by department (7 departments)
  |
  +-- Leave Requests Table
        |-- View 12 leave requests with 8 columns
        |-- See leave type badges, duration, status badges
        |-- Approve/Reject pending requests (mock alerts)
        |-- View approver name for decided requests
        |-- Empty state when no requests match filters
```

---

## Lucide Icons Used

### Attendance Module
| Icon | Import | Usage |
|------|--------|-------|
| Search | `lucide-react` | Search input prefix |
| Filter | `lucide-react` | Filter toggle button |
| Download | `lucide-react` | Export Report button |
| Clock | `lucide-react` | Present summary card + empty state |
| Users | `lucide-react` | Total + Absent summary cards |
| AlertTriangle | `lucide-react` | Late summary card |
| CalendarDays | `lucide-react` | On Leave summary card |
| ChevronLeft | `lucide-react` | Date navigator previous button |
| ChevronRight | `lucide-react` | Date navigator next button |

### Leave Module
| Icon | Import | Usage |
|------|--------|-------|
| Search | `lucide-react` | Search input prefix |
| Filter | `lucide-react` | Filter toggle button |
| Download | `lucide-react` | Export button |
| Palmtree | `lucide-react` | Empty state icon |
| CheckCircle2 | `lucide-react` | Approve action button |
| XCircle | `lucide-react` | Reject action button |

---

## UI Component Dependencies

Both modules use the following shared components from the project's component library:

| Component | Import Path | Usage |
|-----------|-------------|-------|
| Button | `@/components/ui/button` | Export, Filter toggle buttons |
| Input | `@/components/ui/input` | Search field, Date input |
| Select | `@/components/ui/select` | Status, Department, Leave Type dropdowns |
| SelectContent | `@/components/ui/select` | Dropdown content container |
| SelectItem | `@/components/ui/select` | Individual dropdown option |
| SelectTrigger | `@/components/ui/select` | Dropdown trigger button |
| SelectValue | `@/components/ui/select` | Selected value display |
| cn | `@/lib/utils` | Conditional class name merging (clsx/tailwind-merge) |
