# SabiHR - Admin Dashboard: User Stories & Use Cases

## Overview

This document details the complete Admin Dashboard for SabiHR, covering every section, component, data point, interaction, and edge case that a company admin encounters after logging in or completing onboarding.

The dashboard is the central hub of SabiHR and is organized into the following sections:

1. **Greeting Header** — Personalized time-based greeting with current date
2. **Complete Account Setup** — Guided setup cards for admin profile and password
3. **KPI Cards** — Four key performance indicator metrics
4. **Today's Attendance Overview** — Visual attendance summary with progress bar
5. **Recent Activity** — Chronological feed of HR events
6. **Alerts Panel** — Actionable business alerts with severity levels

---

## US-1: Dashboard Greeting Header

**As a** company admin,
**I want to** see a personalized greeting when I open the dashboard,
**So that** I feel welcomed and can quickly see today's date for context.

### Screen: Dashboard Header (`/dashboard`)

**Display Elements:**

| Element | Details |
|---------|---------|
| Greeting text | Dynamic based on time of day |
| Date display | Current date in Nigerian English locale (`en-NG`) format |

**Greeting Logic:**

| Time Range | Greeting |
|------------|----------|
| 00:00 – 11:59 | "Good morning" |
| 12:00 – 16:59 | "Good afternoon" |
| 17:00 – 23:59 | "Good evening" |

**Date Format:**
- Uses `Intl.DateTimeFormat("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })`
- Example output: "Wednesday, 1 April 2026"

**User Actions:**
- This section is read-only; no interactive elements

**Edge Cases:**
- Greeting updates only on page load/refresh; it does not auto-update at midnight or noon
- Date reflects the browser's local timezone, not server time

---

## US-2: Complete Account Setup

**As a** newly registered company admin,
**I want to** complete my admin profile and set a password from the dashboard,
**So that** my account is fully secured and personalized before I start managing employees.

### Screen: Complete Account Setup Section (`/dashboard`)

**Section Header:**

| Element | Details |
|---------|---------|
| Title | "Complete Account Setup" |
| Subtitle | "Finish setting up your admin account to get the most out of SabiHR" |
| Dismiss button | "X" icon in top-right corner to hide entire section |

**Section Behavior:**
- The entire section can be permanently dismissed by clicking the "X" button
- Once dismissed, the section does not reappear for the session
- Section contains two expandable/collapsible cards

---

#### Card 1: Admin Profile

| Field | Type | Placeholder | Required | Validation |
|-------|------|-------------|----------|------------|
| First Name | text | Your first name | Yes | Must be non-empty after trimming |
| Last Name | text | Your last name | Yes | Must be non-empty after trimming |
| Phone Number | text | e.g. 08012345678 | Yes | Must be non-empty after trimming |

**Card Display:**
- User icon in a light blue circle
- "Admin Profile" title with "Set up your profile" subtitle
- Chevron icon indicates expand/collapse state (rotates on toggle)
- "Required" badge next to card title

**User Actions:**
- Click card header to expand/collapse the form
- Fill in first name, last name, and phone number
- Click "Save & Continue" to submit

**Success Flow:**
1. User expands the Admin Profile card
2. Fills in all three required fields
3. Clicks "Save & Continue"
4. Button shows loading spinner with "Saving..." text
5. Mock async submission processes (800ms delay)
6. Card collapses and is marked as complete
7. Set Password card auto-expands (if not already completed)

**Error States:**
- Empty First Name → "First name is required"
- Empty Last Name → "Last name is required"
- Empty Phone Number → "Phone number is required"
- Errors display as red text below the respective field
- Errors clear when the user modifies the field

---

#### Card 2: Set Password

| Field | Type | Placeholder | Required | Validation |
|-------|------|-------------|----------|------------|
| Password | password (toggleable) | Enter a strong password | Yes | Minimum 8 characters |
| Confirm Password | password (toggleable) | Confirm your password | Yes | Must match password field |

**Password Strength Indicator:**

| Strength Level | Visual | Label | Color |
|---------------|--------|-------|-------|
| Level 1 | 1 of 5 bars filled | Weak | Red (`bg-red-500`) |
| Level 2 | 2 of 5 bars filled | Fair | Orange (`bg-orange-500`) |
| Level 3 | 3 of 5 bars filled | Good | Yellow (`bg-yellow-500`) |
| Level 4 | 4 of 5 bars filled | Strong | Emerald (`bg-emerald-500`) |
| Level 5 | 5 of 5 bars filled | Very Strong | Emerald (`bg-emerald-600`) |

**Strength Calculation Criteria:**
- Base score starts at 0
- +1 for length ≥ 8 characters
- +1 for containing lowercase letter
- +1 for containing uppercase letter
- +1 for containing a digit
- +1 for containing a special character

**Card Display:**
- Lock icon in a light blue circle
- "Set Password" title with "Secure your account" subtitle
- Chevron icon for expand/collapse
- "Required" badge next to card title
- Eye/EyeOff toggle icon for each password field

**User Actions:**
- Click card header to expand/collapse the form
- Enter password with real-time strength feedback
- Toggle password visibility with the eye icon
- Enter confirmation password
- Click "Save & Continue" to submit

**Success Flow:**
1. User expands the Set Password card
2. Enters a password (strength bar updates in real-time)
3. Enters matching confirmation password
4. Clicks "Save & Continue"
5. Button shows loading spinner with "Saving..." text
6. Mock async submission processes (800ms delay)
7. Card collapses and is marked as complete
8. Entire setup section can now be dismissed or is visually complete

**Error States:**
- Password less than 8 characters → "Password must be at least 8 characters"
- Passwords don't match → "Passwords do not match"
- Errors display as red text below the respective field
- Errors clear when the user modifies the field

---

## US-3: Key Performance Indicators (KPI Cards)

**As a** company admin,
**I want to** see key HR metrics at a glance on my dashboard,
**So that** I can quickly assess the health of my organization without navigating to separate modules.

### Screen: KPI Cards Section (`/dashboard`)

**Layout:**
- Responsive grid: 2 columns on mobile, 4 columns on desktop (`grid-cols-2 sm:grid-cols-2 lg:grid-cols-4`)
- Gap spacing: 16px (`gap-4`)

**KPI Cards (4 total):**

| # | Metric | Value | Change | Direction | Icon | Color Theme |
|---|--------|-------|--------|-----------|------|-------------|
| 1 | Total Employees | 156 | +5.2% | Up (↑) | Users | Blue (`text-blue-600`, `bg-blue-50`) |
| 2 | Payroll Cost | ₦45.2M | +2.1% | Up (↑) | Banknote | Emerald (`text-emerald-600`, `bg-emerald-50`) |
| 3 | Attendance Rate | 94.2% | +1.3% | Up (↑) | Clock | Violet (`text-violet-600`, `bg-violet-50`) |
| 4 | Turnover Rate | 3.1% | -0.8% | Down (↓) | TrendingDown | Amber (`text-amber-600`, `bg-amber-50`) |

**Card Layout (per card):**

| Element | Position | Style |
|---------|----------|-------|
| Icon | Top-left, inside colored circle | 16x16px icon in 32x32px rounded-full container |
| Label | Below icon | 12px, medium weight, muted foreground color |
| Value | Below label | 24px, semibold, foreground color |
| Trend indicator | Bottom row | Colored text with arrow icon and percentage |
| Comparison text | After trend | "vs last month" in muted foreground, 12px |

**Trend Color Logic:**

| Change Type | Arrow | Text Color |
|-------------|-------|------------|
| Up (positive metric) | ↑ (TrendingUp) | Emerald (`text-emerald-600`) |
| Down (negative metric like turnover) | ↓ (TrendingDown) | Emerald (`text-emerald-600`) |

*Note: For turnover rate, a downward trend is positive (green), as lower turnover is desirable.*

**User Actions:**
- This section is read-only; no interactive elements
- Cards are not clickable and do not navigate to detail pages

**Data Source:**
- Mock data from `DASHBOARD_KPI` in `src/lib/dashboard-data.ts`
- No live API integration; values are static

---

## US-4: Today's Attendance Overview

**As a** company admin,
**I want to** see a visual breakdown of today's attendance,
**So that** I can quickly identify attendance issues and take action if needed.

### Screen: Attendance Overview Section (`/dashboard`)

**Section Header:**

| Element | Details |
|---------|---------|
| Title | "Today's Attendance" |
| Style | Full-width card with rounded border |

**Visual Progress Bar:**

A horizontal stacked bar that visually represents the proportion of each attendance status:

| Segment | Color | Percentage | Position |
|---------|-------|------------|----------|
| Present | Green (`#00bc7d`) | 82.1% | Left-most |
| Late | Orange (`#fe9a00`) | 7.7% | Second |
| Absent | Red (`#fb2c36`) | 5.1% | Third |
| On Leave | Blue (`#2b7fff`) | 5.1% | Right-most |

**Bar Rendering:**
- Total bar height: 10px (`h-2.5`)
- Rounded corners on container (`rounded-full`)
- First segment has left rounding, last segment has right rounding
- Minimum width ensured for each segment to remain visible

**Stat Cards (4 total):**

| # | Status | Count | Percentage | Border Color | Dot Color |
|---|--------|-------|------------|-------------|-----------|
| 1 | Present | 128 | 82.1% | Green (`border-[#00bc7d]`) | Green |
| 2 | Late | 12 | 7.7% | Orange (`border-[#fe9a00]`) | Orange |
| 3 | Absent | 8 | 5.1% | Red (`border-[#fb2c36]`) | Red |
| 4 | On Leave | 8 | 5.1% | Blue (`border-[#2b7fff]`) | Blue |

**Stat Card Layout (per card):**

| Element | Details |
|---------|---------|
| Colored left border | 2px left border in status color |
| Status dot | 8px colored circle |
| Status label | 12px, muted foreground |
| Count | 24px, semibold |
| Percentage | 12px, muted foreground, shown next to count |

**Layout:**
- Responsive grid: 2 columns on mobile, 4 columns on desktop (`grid-cols-2 sm:grid-cols-4`)
- Gap spacing: 16px

**Percentage Calculation:**
- `percentage = (statusCount / total) * 100`
- Total employees: 156
- Present (128) + Late (12) + Absent (8) + On Leave (8) = 156

**User Actions:**
- This section is read-only; no interactive elements
- Cards are not clickable

**Data Source:**
- Mock data from `ATTENDANCE_SUMMARY` in `src/lib/dashboard-data.ts`

---

## US-5: Recent Activity Feed

**As a** company admin,
**I want to** see a feed of recent HR events and activities,
**So that** I can stay informed about what's happening across the organization without checking each module individually.

### Screen: Recent Activity Panel (`/dashboard`)

**Section Header:**

| Element | Details |
|---------|---------|
| Title | "Recent Activity" |
| Container | Card with rounded border, left column of two-column layout |

**Activity Items (6 total):**

| # | Type | Icon | Icon Color | Employee | Description | Timestamp |
|---|------|------|------------|----------|-------------|-----------|
| 1 | New Hire | UserPlus | Blue (`text-blue-600`, `bg-blue-50`) | Adebayo Ogunlesi | Joined as Senior Developer | 2 hours ago |
| 2 | Leave Approved | CalendarCheck | Emerald (`text-emerald-600`, `bg-emerald-50`) | Chioma Nwosu | Annual leave approved (Mar 3-7) | 3 hours ago |
| 3 | Payroll Processed | DollarSign | Violet (`text-violet-600`, `bg-violet-50`) | — | February payroll for 156 employees | Yesterday |
| 4 | Leave Requested | CalendarClock | Amber (`text-amber-600`, `bg-amber-50`) | Emeka Eze | Requested 3 days sick leave | Yesterday |
| 5 | Document Generated | FileCheck | Cyan (`text-cyan-600`, `bg-cyan-50`) | Fatima Ibrahim | Confirmation letter generated | 2 days ago |
| 6 | Probation Ending | AlertTriangle | Orange (`text-orange-600`, `bg-orange-50`) | Oluwaseun Adeyemi | Probation ends in 7 days | 2 days ago |

**Activity Types and Icon Mapping:**

| Activity Type | Lucide Icon | Background | Text Color |
|--------------|-------------|------------|------------|
| `new_hire` | UserPlus | `bg-blue-50` | `text-blue-600` |
| `leave_approved` | CalendarCheck | `bg-emerald-50` | `text-emerald-600` |
| `leave_requested` | CalendarClock | `bg-amber-50` | `text-amber-600` |
| `payroll_processed` | DollarSign | `bg-violet-50` | `text-violet-600` |
| `document_generated` | FileCheck | `bg-cyan-50` | `text-cyan-600` |
| `probation_ending` | AlertTriangle | `bg-orange-50` | `text-orange-600` |
| `employee_exit` | UserPlus | `bg-red-50` | `text-red-600` |

**Activity Item Layout:**

| Element | Position | Style |
|---------|----------|-------|
| Icon | Left, inside colored circle | 16x16px icon in 36x36px rounded-full container |
| Employee name | Top-right of icon | 14px, medium weight, foreground color |
| Description | Below employee name | 14px, muted foreground |
| Timestamp | Below description | 12px, muted foreground |

**User Actions:**
- Hover over activity items (subtle hover background effect)
- Activity list is scrollable if content overflows
- Items are not clickable and do not navigate to detail pages

**Data Source:**
- Mock data from `RECENT_ACTIVITIES` in `src/lib/dashboard-data.ts`
- Timestamps are static strings (not computed relative to current time)

**Edge Cases:**
- If the activity type is unrecognized, it falls back to a default icon style
- Activity list does not paginate; all 6 items are rendered

---

## US-6: Alerts Panel

**As a** company admin,
**I want to** see actionable alerts about pending HR tasks and deadlines,
**So that** I can prioritize urgent items and never miss critical compliance deadlines.

### Screen: Alerts Panel (`/dashboard`)

**Section Header:**

| Element | Details |
|---------|---------|
| Title | "Alerts" |
| Container | Card with rounded border, right column of two-column layout |

**Alert Items (4 total):**

| # | Severity | Title | Description | Icon | Color Theme |
|---|----------|-------|-------------|------|-------------|
| 1 | Warning | 3 Probation Reviews Due | Three employees have probation reviews due within 14 days | AlertTriangle | Amber |
| 2 | Info | Payroll Due in 5 Days | March payroll deadline is March 3rd. Ensure attendance data is updated | Info | Blue |
| 3 | Warning | Low Leave Balances | 2 employees have exhausted their annual leave balance | AlertTriangle | Amber |
| 4 | Urgent | Pension Remittance Overdue | February pension contributions have not been remitted. Due date was Feb 20th | AlertCircle | Red |

**Severity Levels and Styling:**

| Severity | Icon | Border Color | Icon Color | Background |
|----------|------|-------------|------------|------------|
| `info` | Info | Blue (`border-blue-200`) | Blue (`text-blue-600`) | Light blue (`bg-blue-50`) |
| `warning` | AlertTriangle | Amber (`border-amber-200`) | Amber (`text-amber-600`) | Light amber (`bg-amber-50`) |
| `urgent` | AlertCircle | Red (`border-red-200`) | Red (`text-red-600`) | Light red (`bg-red-50`) |

**Alert Item Layout:**

| Element | Position | Style |
|---------|----------|-------|
| Icon | Left, inside colored circle | 16x16px icon in styled container |
| Title | Top-right of icon | 14px, medium weight, foreground color |
| Description | Below title | 12px, muted foreground |
| Dismiss button | Far right | "X" icon, appears on each alert |

**User Actions:**
- Click "X" on any alert to dismiss it
- Dismissed alerts are removed from the list immediately
- Dismissed alerts do not reappear during the session

**Success Flow (Dismissing an Alert):**
1. User clicks the "X" button on an alert
2. Alert is removed from the visible list
3. Remaining alerts reflow to fill the space
4. If all alerts are dismissed, empty state is shown

**Empty State:**
- Displayed when all alerts have been dismissed
- Message: "No alerts at this time" (or similar placeholder)
- No action buttons in empty state

**Edge Cases:**
- Alerts are managed via local React state; dismissals are not persisted to localStorage or API
- On page refresh, all 4 alerts reappear
- Alert order is static; urgent alerts are not automatically sorted to the top

**Data Source:**
- Mock data from `DASHBOARD_ALERTS` in `src/lib/dashboard-data.ts`

---

## US-7: Headcount Trend Chart (Available Component)

**As a** company admin,
**I want to** see the employee headcount trend over the past several months,
**So that** I can understand hiring velocity and workforce growth patterns.

### Component: Headcount Chart (`src/components/dashboard/headcount-chart.tsx`)

*Note: This component is built but not currently rendered on the main dashboard page.*

**Chart Type:** Area chart (Recharts library)

**Data Series (6 months):**

| Month | Employee Count |
|-------|---------------|
| Sep | 134 |
| Oct | 139 |
| Nov | 142 |
| Dec | 145 |
| Jan | 150 |
| Feb | 156 |

**Chart Configuration:**

| Property | Value |
|----------|-------|
| Height | 220px |
| Line color | Blue (`#2563eb`) |
| Line width | 2px |
| Fill | Linear gradient from `#2563eb` (15% opacity) to transparent |
| Gradient ID | `headcountGradient` |
| Grid style | Dashed lines (`strokeDasharray: "3 3"`) |
| Margins | Top: 5, Right: 5, Left: -20, Bottom: 0 |
| Y-axis domain | `[dataMin - 10, dataMax + 5]` |

**Visual Elements:**
- Smooth area fill with gradient
- Interactive tooltip on hover showing month and count
- X-axis: month labels
- Y-axis: employee count (auto-scaled)
- Responsive container that adapts to parent width

**User Actions:**
- Hover over chart to see tooltip with exact values
- Chart is not clickable

**Data Source:**
- Mock data from `HEADCOUNT_TREND` in `src/lib/dashboard-data.ts`

---

## US-8: Department Distribution Chart (Available Component)

**As a** company admin,
**I want to** see how employees are distributed across departments,
**So that** I can identify staffing imbalances and plan resource allocation.

### Component: Department Chart (`src/components/dashboard/department-chart.tsx`)

*Note: This component is built but not currently rendered on the main dashboard page.*

**Chart Type:** Horizontal bar chart (Recharts library)

**Department Data (8 departments):**

| # | Department | Employee Count | Bar Color |
|---|-----------|---------------|-----------|
| 1 | Engineering | 42 | Blue (`#2563eb`) |
| 2 | Sales | 28 | Green (`#10b981`) |
| 3 | Marketing | 22 | Amber (`#f59e0b`) |
| 4 | Finance | 18 | Purple (`#8b5cf6`) |
| 5 | HR | 15 | Pink (`#ec4899`) |
| 6 | Operations | 14 | Cyan (`#06b6d4`) |
| 7 | Legal | 9 | Slate (`#64748b`) |
| 8 | IT | 8 | Orange (`#f97316`) |

**Chart Configuration:**

| Property | Value |
|----------|-------|
| Height | 220px |
| Bar size | 16px height |
| Bar radius | `[0, 4, 4, 0]` (rounded right side) |
| Y-axis | Department names, width 85px |
| Layout | Vertical (horizontal bars) |
| Margins | Top: 0, Right: 20, Left: 0, Bottom: 0 |

**Visual Elements:**
- Color-coded horizontal bars, one per department
- Department name label on Y-axis
- Employee count on X-axis
- Interactive tooltip on hover
- Responsive container

**User Actions:**
- Hover over bars to see tooltip with exact count
- Chart is not clickable

**Data Source:**
- Mock data from `DEPARTMENT_BREAKDOWN` in `src/lib/dashboard-data.ts`

---

## US-9: Dashboard Sidebar Navigation

**As a** company admin,
**I want to** navigate between SabiHR modules from a persistent sidebar,
**So that** I can quickly access any feature of the HR platform from any page.

### Component: Sidebar Navigation

**Navigation Sections (5 groups):**

| Section | Items | Icons |
|---------|-------|-------|
| **Main** | Dashboard | LayoutDashboard |
| **People** | Employees, Departments | Users, Building2 |
| **Time & Pay** | Attendance, Leave, Payroll | Clock, CalendarDays, Banknote |
| **Operations** | Documents, Document Library, Assets | FileText, FolderOpen, Package |
| **More** | Announcements, Reports, Settings | Megaphone, BarChart3, Settings |

**Payroll Sub-items (9 total):**

| Sub-item | Path |
|----------|------|
| Run Payroll | /payroll/run |
| Payroll History | /payroll/history |
| Salary Structure | /payroll/salary |
| Tax (PAYE) | /payroll/tax |
| Pension | /payroll/pension |
| NHF | /payroll/nhf |
| NSITF | /payroll/nsitf |
| ITF | /payroll/itf |
| Bonuses & Deductions | /payroll/bonuses |

**Navigation Behavior:**
- Active page is highlighted in the sidebar
- Clicking a nav item navigates to the corresponding route
- Payroll section expands to show sub-items
- Sidebar is persistent across all dashboard pages

**Data Source:**
- Mock data from `NAV_SECTIONS` in `src/lib/dashboard-data.ts`

---

## Complete Dashboard Layout Map

```
/dashboard
  |
  +-- Greeting Header
  |     |-- Dynamic greeting ("Good morning/afternoon/evening")
  |     |-- Current date in Nigerian format
  |
  +-- Complete Account Setup (dismissible)
  |     |-- Admin Profile Card (expandable)
  |     |     |-- First Name, Last Name, Phone Number
  |     |     |-- Save & Continue button
  |     |
  |     |-- Set Password Card (expandable)
  |           |-- Password with strength indicator
  |           |-- Confirm Password
  |           |-- Save & Continue button
  |
  +-- KPI Cards (4-column grid)
  |     |-- Total Employees: 156 (+5.2%)
  |     |-- Payroll Cost: ₦45.2M (+2.1%)
  |     |-- Attendance Rate: 94.2% (+1.3%)
  |     |-- Turnover Rate: 3.1% (-0.8%)
  |
  +-- Today's Attendance Overview (full-width)
  |     |-- Stacked progress bar (Present/Late/Absent/On Leave)
  |     |-- 4 stat cards with counts and percentages
  |
  +-- Activity & Alerts Row (2-column grid)
        |
        +-- Recent Activity (left column)
        |     |-- New Hire: Adebayo Ogunlesi
        |     |-- Leave Approved: Chioma Nwosu
        |     |-- Payroll Processed: February
        |     |-- Leave Requested: Emeka Eze
        |     |-- Document Generated: Fatima Ibrahim
        |     |-- Probation Ending: Oluwaseun Adeyemi
        |
        +-- Alerts Panel (right column)
              |-- ⚠ 3 Probation Reviews Due (warning)
              |-- ℹ Payroll Due in 5 Days (info)
              |-- ⚠ Low Leave Balances (warning)
              |-- 🔴 Pension Remittance Overdue (urgent)
```

---

## Data Structures

### KPI Card Data

```typescript
interface KpiCardData {
  label: string;          // e.g. "Total Employees"
  value: string;          // e.g. "156" or "₦45.2M"
  change: number;         // e.g. 5.2 or -0.8
  changeType: "up" | "down";
  icon: LucideIcon;       // Users, Banknote, Clock, TrendingDown
  color: string;          // Tailwind text color class
  bgColor: string;        // Tailwind background color class
}
```

### Attendance Summary

```typescript
interface AttendanceSummary {
  present: number;   // 128
  absent: number;    // 8
  late: number;      // 12
  onLeave: number;   // 8
  total: number;     // 156
}
```

### Recent Activity

```typescript
type ActivityType =
  | "new_hire"
  | "leave_approved"
  | "leave_requested"
  | "payroll_processed"
  | "document_generated"
  | "probation_ending"
  | "employee_exit";

interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;    // e.g. "Joined as Senior Developer"
  employee: string;       // e.g. "Adebayo Ogunlesi"
  timestamp: string;      // e.g. "2 hours ago"
}
```

### Dashboard Alert

```typescript
type AlertSeverity = "warning" | "info" | "urgent";

interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  title: string;          // e.g. "Pension Remittance Overdue"
  description: string;    // e.g. "February pension contributions have not been remitted..."
}
```

### Headcount Trend

```typescript
interface HeadcountTrend {
  month: string;   // e.g. "Sep"
  count: number;   // e.g. 134
}
```

### Department Breakdown

```typescript
interface DepartmentBreakdown {
  name: string;    // e.g. "Engineering"
  count: number;   // e.g. 42
  color: string;   // e.g. "#2563eb"
}
```

### Navigation

```typescript
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  children?: { label: string; path: string }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}
```

---

## State Management

| State | Scope | Persistence | Details |
|-------|-------|-------------|---------|
| Setup section dismissed | Component (`useState`) | Session only | Reappears on page refresh |
| Setup card expanded/collapsed | Component (`useState`) | Session only | Default: first incomplete card is expanded |
| Setup card completed | Component (`useState`) | Session only | Completion is not saved to localStorage or API |
| Admin profile form data | Component (`useState`) | None | Lost on page navigation or refresh |
| Password form data | Component (`useState`) | None | Lost on page navigation or refresh |
| Dismissed alerts | Component (`useState`) | Session only | All alerts reappear on page refresh |
| Greeting text | Computed on render | N/A | Based on `new Date().getHours()` |
| Current date | Computed on render | N/A | Based on `new Date()` with locale formatting |

---

## Responsive Behavior

| Breakpoint | KPI Grid | Attendance Grid | Activity/Alerts Layout |
|-----------|----------|----------------|----------------------|
| Mobile (< 640px) | 2 columns | 2 columns | Single column (stacked) |
| Tablet (640px – 1023px) | 2 columns | 4 columns | Single column (stacked) |
| Desktop (≥ 1024px) | 4 columns | 4 columns | 2 columns (side by side) |

**Max Width:** All dashboard content is constrained to `max-w-[1400px]` with auto horizontal margins.

---

## Integration Notes

- **No server persistence yet**: All data is mock — KPI values, attendance counts, activities, and alerts are not fetched from an API
- **No real-time updates**: Dashboard does not poll or use WebSockets; data is static until page refresh
- **Charts available but unused**: `headcount-chart.tsx` and `department-chart.tsx` are built components not yet placed in the dashboard layout
- **Sidebar navigation**: Defined in `NAV_SECTIONS` mock data; routing is handled by React Router
