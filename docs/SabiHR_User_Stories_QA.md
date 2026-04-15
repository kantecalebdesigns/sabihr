# SabiHR - Comprehensive User Stories for QA Testing

**Document Version:** 1.0
**Date:** April 15, 2026
**Prepared For:** QA Team
**Platform:** Web Application (React + Vite + TypeScript)

---

## User Roles

| Role | Description | Key Difference |
|------|-------------|----------------|
| **Super Admin** | Full system access. Can manage roles, permissions, and grant HR Admin rights. Has access to all settings including billing, integrations, and audit logs. |  Only role that can create/edit/delete roles and assign permissions. |
| **HR Admin** | Manages employees, payroll, leave, attendance, and day-to-day HR operations. Cannot modify roles/permissions or billing. | Operational HR access without system-level configuration. |
| **Employee** | Self-service portal. Can view own data, submit requests, and manage personal settings. | Read-only on company data; write on own profile and requests. |

---

# MODULE 1: AUTHENTICATION & ONBOARDING

---

## US-001: Company Registration

| Field | Value |
|-------|-------|
| **Story ID** | US-001 |
| **Epic/Feature** | Authentication & Onboarding |
| **Screen/Flow** | `/register` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story
**As a** new company Super Admin,
**I want to** register my company through a multi-step wizard,
**So that** I can set up my SabiHR workspace and begin managing HR operations.

### User Context
- **Persona:** Company founder or HR director setting up SabiHR for the first time
- **Context of Use:** Desktop browser, first-time setup
- **User Goal:** Complete registration and access the admin dashboard
- **Pain Point:** Complex registration forms that lose progress

### Acceptance Criteria

**AC-1: Email Verification (Happy Path)**
- **Given** the user is on the registration page
- **When** they enter a valid company name and email, then click "Send verification code"
- **Then** a 6-digit OTP is sent to the email, the UI advances to the OTP entry screen, and a 30-second resend cooldown begins

**AC-2: OTP Entry**
- **Given** the user is on the OTP verification screen
- **When** they enter the correct 6-digit code
- **Then** the code is validated, a green checkmark appears, and the UI advances to the password step

**AC-3: OTP — Invalid Code**
- **Given** the user enters an incorrect OTP
- **When** they submit the code
- **Then** an error message "Invalid verification code" appears, and the input fields are cleared

**AC-4: OTP — Resend Cooldown**
- **Given** the resend cooldown is active
- **When** the user tries to click "Resend code"
- **Then** the button is disabled and shows "Resend in Xs" countdown

**AC-5: OTP — Paste Support**
- **Given** the user copies a 6-digit code to clipboard
- **When** they paste into the first OTP input field
- **Then** all 6 digits are distributed across the 6 input boxes automatically

**AC-6: Create Password**
- **Given** the user has verified their email
- **When** they enter a password meeting minimum requirements (8+ characters)
- **Then** the password strength indicator updates in real-time, and clicking "Continue" advances to company info

**AC-7: Password — Mismatch**
- **Given** the user enters mismatched password and confirm password
- **When** they attempt to continue
- **Then** an error "Passwords do not match" is displayed

**AC-8: Company Information**
- **Given** the user is on the company info step
- **When** they fill in company name, email (pre-filled), phone, state (required), and industry (required)
- **Then** they can optionally upload a logo (PNG/JPG, max 5MB), enter RC/TIN numbers, and proceed

**AC-9: Company Info — Logo Upload**
- **Given** the user clicks "Upload Logo"
- **When** they select a valid image file under 5MB
- **Then** a preview is shown with options to change or remove the logo

**AC-10: Plan Selection**
- **Given** the user is on the plan selection step
- **When** they see the three plans (Starter ₦2,500/mo, Professional ₦4,500/mo, Enterprise ₦7,500/mo)
- **Then** they can toggle billing cycle (Quarterly 0%, Bi-Annually 10% off, Annually 20% off) and the prices update accordingly

**AC-11: Payment via Paystack**
- **Given** the user has selected a plan
- **When** they enter card details (number, expiry MM/YY, CVV) and submit
- **Then** Paystack processes the payment, and on success the user sees a registration success screen

**AC-12: Payment — Failure**
- **Given** the payment fails (invalid card, insufficient funds)
- **When** Paystack returns an error
- **Then** an error message is displayed, and the user can retry with different card details

**AC-13: Registration Success**
- **Given** payment is successful
- **When** the success screen loads
- **Then** the user sees a green checkmark, "Registration Successful" message, and two options: "Set Up Your Workspace" and "Skip setup, go to dashboard"

### Design Notes
- 5-step wizard: Email Verification → OTP → Password → Company Info → Plan → Payment → Success
- All form state is managed locally (lost on refresh)
- Nigerian states dropdown includes all 36 states + FCT
- Industry dropdown: 18 options (Agriculture through Other)

---

## US-002: Workspace Onboarding Setup

| Field | Value |
|-------|-------|
| **Story ID** | US-002 |
| **Epic/Feature** | Authentication & Onboarding |
| **Screen/Flow** | `/onboarding` |
| **Priority** | High |
| **Status** | Implemented |

### The Story
**As a** newly registered Super Admin,
**I want to** set up my workspace by creating departments and inviting employees,
**So that** my organization structure is ready before using the platform.

### Acceptance Criteria

**AC-1: Department Setup — Quick Add**
- **Given** the user is on the onboarding departments step
- **When** they click a pre-built department button (Engineering, Finance, HR, Marketing, Operations, Sales, Legal, IT)
- **Then** a department card is added with the name pre-filled and a count badge updates

**AC-2: Department Setup — Custom Department**
- **Given** the user wants to add a department not in the presets
- **When** they type a custom name, head, and description in the card
- **Then** the custom department is added to the list with inline editing

**AC-3: Department Setup — Remove**
- **Given** a department card exists
- **When** the user clicks the X button on the card
- **Then** the department is removed and the count updates

**AC-4: Employee Invitation**
- **Given** the user is on the employee invitation step
- **When** they enter an email, select a department, and choose a role (Employee, Manager, HR Admin, Department Head)
- **Then** an invite card is created showing the email, department, and role

**AC-5: Employee Invitation — First Employee Restricted**
- **Given** no employees have been added yet
- **When** the user adds the first employee
- **Then** the role is forced to "HR Staff" and cannot be changed

**AC-6: Employee Invitation — Bulk Paste**
- **Given** the user clicks "Paste Emails"
- **When** they paste multiple emails separated by commas or newlines
- **Then** individual invite cards are created for each valid email

**AC-7: Complete Setup**
- **Given** the user has added at least one department
- **When** they complete the setup
- **Then** `onboardingComplete = "true"` is saved to localStorage and they are redirected to `/dashboard`

---

## US-003: Login

| Field | Value |
|-------|-------|
| **Story ID** | US-003 |
| **Epic/Feature** | Authentication & Onboarding |
| **Screen/Flow** | `/login` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** log in with my email or Employee ID and password,
**So that** I can access the admin dashboard.

### The Story — Employee
**As an** Employee,
**I want to** log in with my email or Employee ID,
**So that** I can access my self-service portal.

### Acceptance Criteria

**AC-1: Login — Happy Path**
- **Given** the user is on `/login`
- **When** they enter valid email/Employee ID and password, then click "Sign In"
- **Then** they are authenticated and redirected to `/dashboard` (admin) or `/employee/dashboard` (employee)

**AC-2: Login — Invalid Credentials**
- **Given** the user enters incorrect credentials
- **When** they attempt to sign in
- **Then** an error message "Invalid email or password" is displayed

**AC-3: Login — Empty Fields**
- **Given** one or both fields are empty
- **When** the user clicks "Sign In"
- **Then** validation messages appear below the empty fields

**AC-4: Forgot Password Link**
- **Given** the user is on the login page
- **When** they click "Forgot Password?"
- **Then** they are navigated to `/forgot-password`

**AC-5: Register Link**
- **Given** the user is on the login page
- **When** they click the registration link
- **Then** they are navigated to `/register`

---

## US-004: Forgot & Reset Password

| Field | Value |
|-------|-------|
| **Story ID** | US-004 |
| **Epic/Feature** | Authentication & Onboarding |
| **Screen/Flow** | `/forgot-password`, `/reset-password` |
| **Priority** | High |
| **Status** | Implemented |

### The Story
**As a** user (any role),
**I want to** reset my password if I forget it,
**So that** I can regain access to my account.

### Acceptance Criteria

**AC-1: Request Reset**
- **Given** the user is on `/forgot-password`
- **When** they enter their registered email and submit
- **Then** a success message confirms a reset link has been sent

**AC-2: Reset Password**
- **Given** the user follows the reset link to `/reset-password`
- **When** they enter a new password and confirm it
- **Then** the password is updated and they are redirected to `/login`

**AC-3: Invalid Email**
- **Given** the user enters an unregistered email
- **When** they submit the form
- **Then** an appropriate error message is shown

---

## US-005: Employee Onboarding Wizard

| Field | Value |
|-------|-------|
| **Story ID** | US-005 |
| **Epic/Feature** | Authentication & Onboarding |
| **Screen/Flow** | `/employee/onboarding` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Employee
**As a** newly invited Employee,
**I want to** complete my profile through an onboarding wizard,
**So that** my personal information is captured in the system.

### Acceptance Criteria

**AC-1: Basic Details Step**
- **Given** the employee starts onboarding
- **When** they are on Step 1
- **Then** they fill in first name, last name, date of birth, gender, marital status

**AC-2: Contact Info Step**
- **Given** the employee completes Step 1
- **When** they advance to Step 2
- **Then** they fill in phone number, personal email, address, city, state

**AC-3: Emergency Contacts Step**
- **Given** the employee completes Step 2
- **When** they advance to Step 3
- **Then** they fill in emergency contact name, phone, and relationship

**AC-4: Family & Dependents Step**
- **Given** the employee completes Step 3
- **When** they advance to Step 4
- **Then** they can add family members/dependents with name, relationship, date of birth

**AC-5: Documents Step**
- **Given** the employee completes Step 4
- **When** they advance to Step 5
- **Then** they can upload required documents (ID, certificates, etc.)

**AC-6: Completion**
- **Given** the employee completes all steps
- **When** they submit the wizard
- **Then** they are redirected to `/employee/dashboard` with a profile completion tracker showing progress

---

# MODULE 2: DASHBOARD & NAVIGATION

---

## US-006: Admin Dashboard

| Field | Value |
|-------|-------|
| **Story ID** | US-006 |
| **Epic/Feature** | Dashboard & Navigation |
| **Screen/Flow** | `/dashboard` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin
**As a** Super Admin,
**I want to** see a summary of key HR metrics, attendance, activity, and alerts,
**So that** I can monitor the health of my organization and take action on urgent items.

### The Story — HR Admin
**As an** HR Admin,
**I want to** see the same dashboard overview,
**So that** I can manage day-to-day HR operations efficiently.

### User Context
- **Context:** First screen after login, daily starting point
- **Goal:** Quick health check of the organization

### Acceptance Criteria

**AC-1: Greeting Header**
- **Given** the admin is logged in
- **When** the dashboard loads
- **Then** a personalized greeting appears: "Good morning/afternoon/evening, [Name]" with today's date formatted in en-NG locale

**AC-2: KPI Cards Display**
- **Given** the dashboard loads
- **When** the KPI section renders
- **Then** 4 cards display: Total Employees (156, +5.2%), Payroll Cost (₦45.2M, +2.1%), Attendance Rate (94.2%, +1.3%), Turnover Rate (3.1%, -0.8%) — each with month-over-month change arrows

**AC-3: Attendance Overview**
- **Given** the dashboard loads
- **When** the attendance section renders
- **Then** a stacked progress bar shows: Present (82.1% green), Late (7.7% orange), Absent (5.1% red), On Leave (5.1% blue) — with 4 stat cards showing the counts (128, 12, 8, 8)

**AC-4: Recent Activity Feed**
- **Given** the dashboard loads
- **When** the activity section renders
- **Then** the 6 most recent activities display with icon, employee name, description, and timestamp (types: new_hire, leave_approved, leave_requested, payroll_processed, document_generated, probation_ending)

**AC-5: Alerts Panel**
- **Given** the dashboard loads
- **When** the alerts section renders
- **Then** alerts display with severity (info=blue, warning=amber, urgent=red), title, description, and a dismiss (X) button

**AC-6: Dismiss Alert**
- **Given** an alert is displayed
- **When** the admin clicks the X button
- **Then** the alert is removed from the panel immediately (reappears on page refresh since state is not persisted)

**AC-7: Complete Account Setup Section**
- **Given** the admin has not completed profile setup
- **When** the dashboard loads
- **Then** a dismissible setup section shows two expandable cards: "Admin Profile" (first name, last name, phone) and "Set Password" (password with strength meter, confirm password)

**AC-8: Admin/Employee View Toggle**
- **Given** the admin is on the dashboard
- **When** they use the view toggle in the topbar
- **Then** the interface switches between admin view and employee view

---

## US-007: Employee Dashboard

| Field | Value |
|-------|-------|
| **Story ID** | US-007 |
| **Epic/Feature** | Dashboard & Navigation |
| **Screen/Flow** | `/employee/dashboard` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** see my personal dashboard with attendance, leave, pay info, and quick actions,
**So that** I can manage my work life and stay informed.

### Acceptance Criteria

**AC-1: Welcome Banner**
- **Given** the employee is logged in
- **When** the dashboard loads
- **Then** a personalized welcome banner shows their name and a greeting

**AC-2: Clock In/Out Widget**
- **Given** the dashboard loads
- **When** the clock widget renders
- **Then** it shows a live clock, current clock-in status, and a prominent "Clock In" / "Clock Out" button

**AC-3: Stat Cards**
- **Given** the dashboard loads
- **When** the stat cards render
- **Then** they display: Leave Balance (remaining days), Attendance Rate (this month %), Next Pay Date

**AC-4: Profile Completion Tracker**
- **Given** the employee has an incomplete profile
- **When** the dashboard loads
- **Then** a progress bar shows profile completion percentage with a prompt to complete missing sections

**AC-5: Attendance Overview**
- **Given** the dashboard loads
- **When** the attendance section renders
- **Then** this week's attendance summary shows days present, late, absent with visual indicators

**AC-6: Leave Summary**
- **Given** the dashboard loads
- **When** the leave section renders
- **Then** leave balances by type (annual, sick, casual) are displayed with days remaining

**AC-7: Quick Actions**
- **Given** the dashboard loads
- **When** the quick actions panel renders
- **Then** buttons for "Clock In", "Request Leave", "View Payslip", and other common actions are available

**AC-8: Recent Payslips**
- **Given** the dashboard loads
- **When** the payslips section renders
- **Then** links to the last 2-3 payslips are shown with period and net pay amount

**AC-9: Upcoming Events**
- **Given** the dashboard loads
- **When** the events section renders
- **Then** upcoming holidays, birthdays, and company events are listed

---

## US-008: Sidebar Navigation

| Field | Value |
|-------|-------|
| **Story ID** | US-008 |
| **Epic/Feature** | Dashboard & Navigation |
| **Screen/Flow** | All pages |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As an** admin user,
**I want to** navigate between all admin modules via a sidebar,
**So that** I can quickly access any part of the system.

### The Story — Employee
**As an** Employee,
**I want to** navigate my self-service portal via a sidebar,
**So that** I can access my attendance, pay, leave, and other personal sections.

### Acceptance Criteria

**AC-1: Admin Sidebar — Section Groups**
- **Given** an admin is on any admin page
- **When** the sidebar renders
- **Then** it displays grouped sections: Main, People, Time, Payroll, Performance, Benefits, Loans, Operations, Engagement, Compliance, More — each with a section title label

**AC-2: Sidebar — Collapsible**
- **Given** the sidebar is expanded (260px)
- **When** the admin clicks the collapse button
- **Then** the sidebar collapses to icon-only mode (64px) and items show only icons in square tiles

**AC-3: Sidebar — Dropdown Items (No Icons on Children)**
- **Given** a nav item has children (e.g., Attendance with sub-pages)
- **When** the admin clicks the parent item
- **Then** the dropdown expands showing child items with dot indicators only (no icons), and a chevron rotates on the parent

**AC-4: Sidebar — Active State**
- **Given** the admin navigates to a page
- **When** the page loads
- **Then** the corresponding nav item is highlighted (blue text, blue-50 background), and if it's a child item, the parent dropdown auto-expands

**AC-5: Sidebar — Mobile Drawer**
- **Given** the user is on a mobile viewport
- **When** they tap the hamburger menu
- **Then** the sidebar slides in as a drawer overlay with a dark backdrop

**AC-6: Employee Sidebar — Section Groups**
- **Given** an employee is on any employee page
- **When** the sidebar renders
- **Then** it displays grouped sections: Main, Time, Pay & Finance, Performance, Benefits, Self Service, Company, Compliance, Account

**AC-7: Sidebar — User Card**
- **Given** the sidebar is expanded
- **When** the user card at the bottom renders
- **Then** it shows the user's avatar initials, name, role title, and a logout icon

---

# MODULE 3: EMPLOYEE MANAGEMENT

---

## US-009: View Employee List

| Field | Value |
|-------|-------|
| **Story ID** | US-009 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employees` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view all employees with summary stats, search, filter, and navigate to profiles,
**So that** I can manage the workforce and find employee information quickly.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the employee list loads
- **When** the summary section renders
- **Then** 4 cards display: Total Employees (20), Active (17), On Leave (1), Terminated (0)

**AC-2: Status Tabs**
- **Given** the employee list loads
- **When** the status tabs render
- **Then** tabs show: All (20), Active (17), On Leave (1), Suspended (1), Terminated (0) — clicking a tab filters the table

**AC-3: Search**
- **Given** the employee list is displayed
- **When** the admin types in the search box
- **Then** the table filters in real-time by first name + last name, employee ID, email, job title, or department (case-insensitive)

**AC-4: Filter Panel**
- **Given** the admin clicks the filter button
- **When** the filter panel opens
- **Then** dropdowns for Department (8 options), Employment Type (Full-time, Part-time, Contract, Intern), and Location (Lagos, Abuja, Kano) are available — filters apply with AND logic

**AC-5: Employee Table**
- **Given** the table renders
- **When** the admin views the data
- **Then** columns show: Employee (avatar + name + email), Employee ID, Department, Job Title, Type, Status (color-coded badge), Location, Start Date, Actions

**AC-6: Row Click Navigation**
- **Given** the table is displayed
- **When** the admin clicks an employee row (not the actions column)
- **Then** they navigate to `/employees/{id}`

**AC-7: Empty State**
- **Given** no employees match the current filters
- **When** the table renders
- **Then** an empty state shows a user icon, "No employees found", and "Try adjusting your search or filters"

**AC-8: Add Employee Button**
- **Given** the employee list page loads
- **When** the admin clicks "Add Employee"
- **Then** they navigate to `/employees/create`

---

## US-010: Create New Employee

| Field | Value |
|-------|-------|
| **Story ID** | US-010 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employees/create` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** add a new employee through a step-by-step form,
**So that** I can onboard new hires with all required information.

### Acceptance Criteria

**AC-1: Step 1 — Personal Information**
- **Given** the admin is on Step 1
- **When** the form renders
- **Then** fields display: First Name (required), Last Name (required), Middle Name, Date of Birth, Gender (select), Marital Status (select), Nationality, State of Origin

**AC-2: Step 2 — Contact Details**
- **Given** the admin advances to Step 2
- **When** the form renders
- **Then** fields display: Personal Email (required), Work Email (required), Phone (required), Alternate Phone, Address (required), City, State, Country

**AC-3: Step 3 — Employment Information**
- **Given** the admin advances to Step 3
- **When** the form renders
- **Then** fields display: Job Title (required), Department (required, 8 options), Employment Type (required), Contract Type, Start Date (required), Work Location (required), Supervisor, Pay Grade

**AC-4: Step 4 — Review & Submit**
- **Given** the admin advances to Step 4
- **When** the review page renders
- **Then** all entered data is displayed in 3 read-only panels (Personal, Contact, Employment) with edit links to jump back to each step — empty fields show "--"

**AC-5: Step Navigation**
- **Given** the admin is on any step
- **When** they click a step indicator
- **Then** they can jump to any step directly (non-linear navigation)

**AC-6: Save Draft**
- **Given** the admin clicks "Save Draft" on any step
- **When** the save completes
- **Then** form data is saved to localStorage key "employee-draft", a success toast appears, and data persists across page refreshes

**AC-7: Submit**
- **Given** the admin clicks "Add Employee" on Step 4
- **When** submission completes
- **Then** the draft is removed from localStorage, a success toast appears, and the user is redirected to `/employees` after 1 second

**AC-8: Validation**
- **Given** required fields are empty
- **When** the admin tries to advance
- **Then** red validation messages appear below each empty required field

---

## US-011: View Employee Detail

| Field | Value |
|-------|-------|
| **Story ID** | US-011 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employees/:id` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view an employee's complete profile with employment details,
**So that** I can review and manage their information.

### Acceptance Criteria

**AC-1: Header Display**
- **Given** the detail page loads
- **When** the header renders
- **Then** it shows: avatar initials, full name, employment status badge, employment type badge, employee ID (monospace), job title + department, work location

**AC-2: Work Location Section**
- **Given** the detail page loads
- **When** the work location section renders
- **Then** it shows the employee's current work location with an option to update

**AC-3: Pay Grade Section**
- **Given** the detail page loads
- **When** the pay grade section renders
- **Then** it shows the assigned pay grade with salary range details

**AC-4: Probation Tracking**
- **Given** the employee is within probation period
- **When** the detail page loads
- **Then** a probation timeline section shows start date, end date, and current status

**AC-5: Contract Details**
- **Given** the employee has contract information
- **When** the detail page loads
- **Then** contract type, start/end dates, and renewal status are displayed

**AC-6: Admin Actions**
- **Given** the admin views the employee detail
- **When** the admin actions section renders
- **Then** actions available include: Reset Password, Request Leave, View Attendance — with confirmation dialogs for destructive actions

**AC-7: Back Navigation**
- **Given** the admin is on the detail page
- **When** they click the back arrow
- **Then** they return to the employee list (`/employees`)

---

## US-012: Employee Profile (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-012 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employee/profile` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view and request edits to my profile,
**So that** I can keep my information up to date.

### Acceptance Criteria

**AC-1: Profile Tabs**
- **Given** the profile page loads
- **When** the tab navigation renders
- **Then** tabs show: Personal Info, Employment, Documents

**AC-2: Personal Info Tab**
- **Given** the Personal Info tab is active
- **When** the section renders
- **Then** it displays: name, DOB, gender, marital status, nationality, contact info, address — fields are read-only with an "Edit Request" option

**AC-3: Employment Tab**
- **Given** the Employment tab is active
- **When** the section renders
- **Then** it displays: job title, department, manager, hire date, work location, pay grade, employment history

**AC-4: Documents Tab**
- **Given** the Documents tab is active
- **When** the section renders
- **Then** it lists uploaded documents with download and upload options

**AC-5: Edit Request**
- **Given** the employee wants to update a field
- **When** they click the edit request button
- **Then** a modal opens where they can propose changes that require HR approval

---

## US-013: Employee Directory

| Field | Value |
|-------|-------|
| **Story ID** | US-013 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employee/directory` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** search and browse the employee directory,
**So that** I can find colleague contact information.

### Acceptance Criteria

**AC-1: Directory Search**
- **Given** the directory page loads
- **When** the employee types in the search box
- **Then** results filter by name, title, or department

**AC-2: Colleague Cards**
- **Given** the directory renders
- **When** colleague cards display
- **Then** each card shows: avatar, name, job title, department, phone, email

**AC-3: Department Filter**
- **Given** the directory is displayed
- **When** the employee selects a department filter
- **Then** only colleagues from that department are shown

**AC-4: Organization Chart**
- **Given** the directory page has an org chart view
- **When** the employee switches to org chart
- **Then** a hierarchical visualization of the organization is displayed

---

## US-014: Employee Notifications

| Field | Value |
|-------|-------|
| **Story ID** | US-014 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employee/notifications` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view all my notifications in one place,
**So that** I don't miss important updates.

### Acceptance Criteria

**AC-1: Notification List**
- **Given** the notifications page loads
- **When** the list renders
- **Then** notifications appear in chronological order with read/unread status indicators

**AC-2: Mark as Read**
- **Given** an unread notification exists
- **When** the employee clicks it
- **Then** it is marked as read and the visual indicator updates

**AC-3: Categories**
- **Given** the notifications page loads
- **When** notifications render
- **Then** they are categorized (leave, payroll, announcements, attendance, etc.)

---

## US-015: Employee Redeployment

| Field | Value |
|-------|-------|
| **Story ID** | US-015 |
| **Epic/Feature** | Employee Management |
| **Screen/Flow** | `/employee/redeployment` |
| **Priority** | Low |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** request a redeployment to another department,
**So that** I can explore internal career opportunities.

### Acceptance Criteria

**AC-1: Redeployment Form**
- **Given** the redeployment page loads
- **When** the form renders
- **Then** fields include: desired department, reason for redeployment, preferred start date

**AC-2: Request Tracker**
- **Given** a redeployment request has been submitted
- **When** the tracker renders
- **Then** status, submission date, and approval chain are visible

---

# MODULE 4: DEPARTMENT MANAGEMENT

---

## US-016: View Department List

| Field | Value |
|-------|-------|
| **Story ID** | US-016 |
| **Epic/Feature** | Department Management |
| **Screen/Flow** | `/departments` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view all departments with stats, search, and manage the org structure,
**So that** I can understand team distribution and resource allocation.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the department list loads
- **When** the summary renders
- **Then** 4 cards show: Total Departments (8), Total Employees (156), Total Budget (₦63.5M), Active Locations (3)

**AC-2: Grid View (Default)**
- **Given** the grid view is active
- **When** department cards render
- **Then** each card shows: name, code, status badge, description (2-line clamp), employee count, on-leave count, budget, and "Reassign Employees" link

**AC-3: Table View**
- **Given** the table view is toggled
- **When** the table renders
- **Then** columns show: Department, Code, Head, Employees, Location, Budget (right-aligned), Status, Actions

**AC-4: View Toggle**
- **Given** the toolbar is visible
- **When** the admin clicks the grid/table toggle
- **Then** the view switches between grid and table without losing search/filter state

**AC-5: Department Search**
- **Given** the department list is visible
- **When** the admin types in the search box
- **Then** results filter by department name, code, or head of department

**AC-6: Card Click Navigation**
- **Given** the grid view is active
- **When** the admin clicks a department card
- **Then** they navigate to the employee list filtered by that department

---

## US-017: Create New Department

| Field | Value |
|-------|-------|
| **Story ID** | US-017 |
| **Epic/Feature** | Department Management |
| **Screen/Flow** | `/departments/create` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** create a new department,
**So that** I can expand the organizational structure.

### Acceptance Criteria

**AC-1: Form Fields**
- **Given** the create page loads
- **When** the form renders
- **Then** fields display: Department Name (required), Code (required, auto-uppercased, max 5 chars), Description, Head of Department (select), Title, Location (required, select), Annual Budget

**AC-2: Validation**
- **Given** required fields are empty
- **When** the admin clicks "Create Department"
- **Then** validation errors appear for name, code, and location

**AC-3: Code Auto-Uppercase**
- **Given** the admin types in the code field
- **When** they type lowercase letters
- **Then** the input is automatically converted to uppercase

**AC-4: Submission**
- **Given** all required fields are filled
- **When** the admin clicks "Create Department"
- **Then** a loading state shows "Creating...", followed by navigation to `/departments`

---

## US-018: Reassign Employees Between Departments

| Field | Value |
|-------|-------|
| **Story ID** | US-018 |
| **Epic/Feature** | Department Management |
| **Screen/Flow** | `/departments` (modal) |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** move employees between departments,
**So that** I can handle restructuring and team changes.

### Acceptance Criteria

**AC-1: Open Reassign Modal**
- **Given** the admin is on the department list
- **When** they click "Reassign Employees" on a department card
- **Then** a modal opens showing the source department name

**AC-2: Target Department Selection**
- **Given** the modal is open
- **When** the admin opens the target dropdown
- **Then** all departments except the source department are listed

**AC-3: Employee Selection**
- **Given** the target department is selected
- **When** the employee checklist renders
- **Then** only active employees from the source department are shown with checkboxes, avatar, name, and job title

**AC-4: Select All/Deselect All**
- **Given** the employee checklist is visible
- **When** the admin clicks "Select all"
- **Then** all employees are checked, and the button text changes to "Deselect all"

**AC-5: Reassign Action**
- **Given** employees are selected and a target department is chosen
- **When** the admin clicks "Reassign"
- **Then** a success message shows "{count} employee(s) reassigned" with a green checkmark, and the modal auto-closes after 1.5 seconds

**AC-6: Disabled State**
- **Given** no target department or no employees are selected
- **When** the admin views the Reassign button
- **Then** the button is disabled

---

## US-019: Department Detail

| Field | Value |
|-------|-------|
| **Story ID** | US-019 |
| **Epic/Feature** | Department Management |
| **Screen/Flow** | `/departments/:id` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view detailed information about a department and its team members,
**So that** I can understand the department's composition and performance.

### Acceptance Criteria

**AC-1: Department KPIs**
- **Given** the detail page loads
- **When** the KPI section renders
- **Then** cards show: Total Employees, Present Today, Absent, On Leave

**AC-2: Employee List**
- **Given** the detail page loads
- **When** the team section renders
- **Then** all employees in this department are listed with their status

**AC-3: Status Breakdown**
- **Given** the detail page loads
- **When** the status section renders
- **Then** a breakdown by active, on-leave, and suspended employees is shown

---

# MODULE 5: ATTENDANCE & TIME TRACKING

---

## US-020: View Daily Attendance

| Field | Value |
|-------|-------|
| **Story ID** | US-020 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view, search, and filter employee attendance records by date,
**So that** I can track who is present, late, or absent and export reports.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the attendance page loads
- **When** the summary renders
- **Then** 5 cards show: Total (20), Present (12, emerald), Late (3, amber), Absent (2, red), On Leave (2, blue)

**AC-2: Attendance Rate Bar**
- **Given** the attendance page loads
- **When** the rate bar renders
- **Then** a stacked progress bar shows percentage breakdown by status with color legend below — rate formula: `((present + late + halfDay) / total) × 100`

**AC-3: Date Navigation**
- **Given** the attendance page is displayed
- **When** the admin clicks Previous/Next day arrows or selects a date from the picker
- **Then** the date updates and the attendance records filter to that date

**AC-4: Search**
- **Given** the attendance table is visible
- **When** the admin types in the search box
- **Then** records filter by employee name OR department (case-insensitive)

**AC-5: Filter Panel**
- **Given** the admin clicks the filter button
- **When** the panel opens
- **Then** dropdowns for Status (Present, Late, Absent, On Leave, Half Day) and Department (8 options) are available — all filters apply with AND logic

**AC-6: Attendance Table**
- **Given** the table renders
- **When** the admin views the data
- **Then** 7 columns display: Employee (avatar + name), Department, Clock In (time or "—"), Clock Out (time or "—"), Hours Worked (decimal or "—"), Status (color-coded badge), Location

**AC-7: Status Badge Colors**
- **Given** a record has a status
- **When** the badge renders
- **Then** colors are: present=emerald, late=amber, absent=red, on-leave=blue, half-day=violet

**AC-8: Empty State**
- **Given** no records match filters
- **When** the table renders
- **Then** a clock icon, "No attendance records found", and "Try adjusting your search or filters" appear

**AC-9: Export**
- **Given** the attendance table has data
- **When** the admin clicks "Export"
- **Then** the attendance data exports as a file

---

## US-021: Department Attendance View

| Field | Value |
|-------|-------|
| **Story ID** | US-021 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/department` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view attendance summarized by department,
**So that** I can compare department-level attendance rates.

### Acceptance Criteria

**AC-1: Department Summary**
- **Given** the page loads
- **When** the department rows render
- **Then** each department shows: name, attendance rate, present/late/absent/on-leave counts

**AC-2: Collapsible Rows**
- **Given** a department row is displayed
- **When** the admin clicks to expand
- **Then** individual employee attendance records for that department are shown

---

## US-022: Attendance Corrections Queue

| Field | Value |
|-------|-------|
| **Story ID** | US-022 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/corrections` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** review and approve/reject attendance correction requests,
**So that** I can ensure attendance records are accurate.

### Acceptance Criteria

**AC-1: Corrections List**
- **Given** the corrections page loads
- **When** the list renders
- **Then** correction requests show: employee name, date, original record, requested change, reason, status

**AC-2: Status Tabs**
- **Given** the page loads
- **When** the tabs render
- **Then** tabs show: All, Pending, Approved, Rejected with count badges

**AC-3: Approval Workflow**
- **Given** a pending correction exists
- **When** the admin expands the row
- **Then** a workflow timeline shows: Employee → Line Manager → Admin with approval status at each step

**AC-4: Approve/Reject Actions**
- **Given** a pending correction is displayed
- **When** the admin clicks Approve or Reject
- **Then** the status updates and the record moves to the appropriate tab

---

## US-023: Manual Attendance Entry

| Field | Value |
|-------|-------|
| **Story ID** | US-023 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/manual-entry` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manually enter attendance records or bulk upload via CSV,
**So that** I can handle cases where automated tracking wasn't used.

### Acceptance Criteria

**AC-1: Manual Entry Tab**
- **Given** the Manual Entry tab is active
- **When** the form renders
- **Then** fields show: Employee (select), Date, Clock In time, Clock Out time, Status, Location

**AC-2: Bulk Upload Tab**
- **Given** the Bulk Upload tab is active
- **When** the upload area renders
- **Then** a CSV upload zone with template download link is shown

**AC-3: CSV Validation**
- **Given** a CSV file is uploaded
- **When** validation runs
- **Then** a preview of records is shown with any validation errors highlighted

---

## US-024: GPS & Geofencing

| Field | Value |
|-------|-------|
| **Story ID** | US-024 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/geofencing` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage GPS geofence zones for clock-in validation,
**So that** employees can only clock in from approved locations.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the geofencing page loads
- **When** summary renders
- **Then** cards show: Total Zones, Active Zones, Employees Covered, Average Radius

**AC-2: Zone List**
- **Given** the page loads
- **When** the zone list renders
- **Then** each zone shows: name, address, latitude, longitude, radius, status toggle, employee count

**AC-3: Create Zone**
- **Given** the admin clicks "Add Zone"
- **When** the form opens
- **Then** fields include: Zone Name, Address, Latitude, Longitude, Radius (meters), Assigned Employees

**AC-4: Activate/Deactivate**
- **Given** a zone exists
- **When** the admin toggles the status
- **Then** the zone switches between active and inactive

---

## US-025: Break Management

| Field | Value |
|-------|-------|
| **Story ID** | US-025 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/breaks` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** configure break policies and monitor compliance,
**So that** break rules are enforced consistently.

### Acceptance Criteria

**AC-1: Break Policy List**
- **Given** the page loads
- **When** break policies render
- **Then** each policy shows: name, duration, max per day, paid/unpaid flag, applicable departments

**AC-2: Create Policy**
- **Given** the admin clicks "Add Policy"
- **When** the form opens
- **Then** fields include: Policy Name, Break Duration, Max Breaks Per Day, Paid/Unpaid toggle, Applies To (department selection)

**AC-3: Compliance Monitoring**
- **Given** break policies are configured
- **When** the compliance section renders
- **Then** employee break compliance rates are displayed

---

## US-026: Attendance Reports

| Field | Value |
|-------|-------|
| **Story ID** | US-026 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/daily-report`, `/attendance/monthly-report`, `/attendance/analytics`, `/attendance/anomalies`, `/attendance/work-hours`, `/attendance/overtime` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** access detailed attendance reports and analytics,
**So that** I can identify trends, anomalies, and optimize workforce management.

### Acceptance Criteria

**AC-1: Daily Report**
- **Given** the admin navigates to `/attendance/daily-report`
- **When** the page loads
- **Then** it shows: date selector, department filter, summary cards (present, late, absent, on-leave, attendance rate), employee table, export button

**AC-2: Monthly Report**
- **Given** the admin navigates to `/attendance/monthly-report`
- **When** the page loads
- **Then** it shows: month selector, summary cards (avg attendance, work days, total overtime, top performer), monthly table, department comparison, export button

**AC-3: Analytics**
- **Given** the admin navigates to `/attendance/analytics`
- **When** the page loads
- **Then** it shows: top absentees, lateness by day of week, repeat offenders, attendance trends, department analytics

**AC-4: Anomalies**
- **Given** the admin navigates to `/attendance/anomalies`
- **When** the page loads
- **Then** it shows: anomaly type filter (duplicate entries, impossible times, missing data), severity filter (high, medium, low), summary cards, anomaly table with resolve actions

**AC-5: Work Hours**
- **Given** the admin navigates to `/attendance/work-hours`
- **When** the page loads
- **Then** it shows: total regular hours, overtime hours, average daily hours, undertime tracking, employee table with status (Normal, Overtime, Undertime)

**AC-6: Overtime**
- **Given** the admin navigates to `/attendance/overtime`
- **When** the page loads
- **Then** it shows: overtime requests list, status tabs (all, pending, approved, rejected), approval workflow, hours & payment calculation, approve/reject actions

---

## US-027: Attendance-Payroll Integration

| Field | Value |
|-------|-------|
| **Story ID** | US-027 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/attendance/payroll-sync`, `/attendance/deduction-preview`, `/attendance/overtime-preview`, `/attendance/leave-reconciliation` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** sync attendance data with payroll for deductions and overtime payments,
**So that** salary calculations reflect actual attendance.

### Acceptance Criteria

**AC-1: Payroll Sync**
- **Given** the admin navigates to `/attendance/payroll-sync`
- **When** the page loads
- **Then** it shows: period overview, sync status (pending/synced), overtime & deduction aggregation, sync action button

**AC-2: Deduction Preview**
- **Given** the admin navigates to `/attendance/deduction-preview`
- **When** the page loads
- **Then** it shows: absence deductions, late deductions, per-employee impact, "Apply to Payroll" button

**AC-3: Overtime Preview**
- **Given** the admin navigates to `/attendance/overtime-preview`
- **When** the page loads
- **Then** it shows: overtime payment calculations, rate multipliers, per-employee breakdown, "Sync to Payroll" button

**AC-4: Leave Reconciliation**
- **Given** the admin navigates to `/attendance/leave-reconciliation`
- **When** the page loads
- **Then** it shows: leave-attendance mismatches (on-leave-clocked-in, absent-no-leave, leave-mismatch, partial-day), resolution status, resolve actions

---

## US-028: Employee Attendance (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-028 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/employee/attendance`, `/employee/attendance/dashboard`, `/employee/attendance/history`, `/employee/attendance/correction` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my attendance records and request corrections,
**So that** I can track my attendance and fix any discrepancies.

### Acceptance Criteria

**AC-1: Attendance Overview**
- **Given** the employee navigates to `/employee/attendance`
- **When** the page loads
- **Then** a 2-week attendance summary displays with daily status (present, late, absent, half-day), hours worked, and an option to request corrections

**AC-2: Attendance Dashboard**
- **Given** the employee navigates to `/employee/attendance/dashboard`
- **When** the page loads
- **Then** monthly KPIs (attendance rate, days present, days late, days absent), status breakdown, and trend charts are shown

**AC-3: Attendance History**
- **Given** the employee navigates to `/employee/attendance/history`
- **When** the page loads
- **Then** a detailed table shows: date, clock-in, clock-out, hours worked, status for each day with export option

**AC-4: Correction Request**
- **Given** the employee navigates to `/employee/attendance/correction`
- **When** the form renders
- **Then** fields include: date, original clock-in/out, corrected clock-in/out, reason — with a submit button

---

## US-029: Employee Clock-In/Out

| Field | Value |
|-------|-------|
| **Story ID** | US-029 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/employee/clock-in`, `/employee/mobile/clock-in` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** clock in and out of work,
**So that** my attendance is recorded accurately.

### Acceptance Criteria

**AC-1: Clock Display**
- **Given** the clock-in page loads
- **When** the page renders
- **Then** a live clock is displayed with the current time updating every second

**AC-2: Clock In**
- **Given** the employee has not clocked in today
- **When** they click "Clock In"
- **Then** the clock-in time is recorded, the button changes to "Clock Out", and today's status updates to "Present" or "Late" depending on the time

**AC-3: Clock Out**
- **Given** the employee is clocked in
- **When** they click "Clock Out"
- **Then** the clock-out time is recorded, hours worked are calculated, and the status is finalized

**AC-4: Recent History**
- **Given** the clock page loads
- **When** the history section renders
- **Then** the last 5 days of clock-in/out records are displayed with status

**AC-5: Mobile Clock-In**
- **Given** the employee is on a mobile device at `/employee/mobile/clock-in`
- **When** the page loads
- **Then** a mobile-optimized clock-in interface is shown with large touch-friendly buttons

---

## US-030: Employee Work Hours & Overtime

| Field | Value |
|-------|-------|
| **Story ID** | US-030 |
| **Epic/Feature** | Attendance & Time Tracking |
| **Screen/Flow** | `/employee/work-hours` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my work hours summary and overtime,
**So that** I can track my working time and overtime payments.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the page loads
- **When** the summary renders
- **Then** cards show: Total Hours (this month), Regular Hours, Overtime Hours, Average Daily Hours

**AC-2: Weekly Breakdown**
- **Given** the page loads
- **When** the breakdown table renders
- **Then** a weekly view shows daily hours with regular vs overtime classification

---

# MODULE 6: SHIFT MANAGEMENT

---

## US-031: Shift Configuration

| Field | Value |
|-------|-------|
| **Story ID** | US-031 |
| **Epic/Feature** | Shift Management |
| **Screen/Flow** | `/shifts` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** create and manage shift definitions,
**So that** I can configure work schedules for different teams.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the shift config page loads
- **When** summary renders
- **Then** cards show: Total Shifts, Active Shifts, Draft Shifts, Night Shifts

**AC-2: Shift List**
- **Given** the page loads
- **When** the shift list renders
- **Then** each shift shows: name, code, start time, end time, break duration, night shift flag, allowance amount, status

**AC-3: Create Shift**
- **Given** the admin clicks "Add Shift"
- **When** the form opens
- **Then** fields include: Shift Name, Code, Start Time, End Time, Break Duration, Night Shift toggle, Allowance Amount

---

## US-032: Shift Roster

| Field | Value |
|-------|-------|
| **Story ID** | US-032 |
| **Epic/Feature** | Shift Management |
| **Screen/Flow** | `/shifts/roster` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** assign employees to shifts on a weekly roster,
**So that** everyone knows their schedule.

### Acceptance Criteria

**AC-1: Weekly View**
- **Given** the roster page loads
- **When** the grid renders
- **Then** an employee × day-of-week grid shows shift assignments with color coding

**AC-2: Week Navigation**
- **Given** the roster is displayed
- **When** the admin clicks Previous/Today/Next week
- **Then** the roster updates to show the selected week

---

## US-033: Shift Swap Queue

| Field | Value |
|-------|-------|
| **Story ID** | US-033 |
| **Epic/Feature** | Shift Management |
| **Screen/Flow** | `/shifts/swap-queue` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** review and approve shift swap requests,
**So that** employees can swap shifts when needed.

### Acceptance Criteria

**AC-1: Swap Request List**
- **Given** the page loads
- **When** the list renders
- **Then** each request shows: requesting employee, swap partner, original shift, desired shift, date, reason, status

**AC-2: Approve/Reject**
- **Given** a pending swap request exists
- **When** the admin clicks Approve or Reject
- **Then** the request status updates accordingly

---

## US-034: Shift Calendar & Allowance

| Field | Value |
|-------|-------|
| **Story ID** | US-034 |
| **Epic/Feature** | Shift Management |
| **Screen/Flow** | `/shifts/calendar`, `/shifts/allowance` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view a monthly shift calendar and manage shift allowances,
**So that** I can oversee scheduling and compensation.

### Acceptance Criteria

**AC-1: Calendar View**
- **Given** the admin navigates to `/shifts/calendar`
- **When** the page loads
- **Then** a monthly calendar shows shift assignments by date with department filter and color-coded shifts

**AC-2: Allowance Summary**
- **Given** the admin navigates to `/shifts/allowance`
- **When** the page loads
- **Then** summary cards show: Total Allowances, Night Premium, Afternoon Premium — with per-employee shift allowance table and payroll sync status

---

## US-035: Employee Shifts (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-035 |
| **Epic/Feature** | Shift Management |
| **Screen/Flow** | `/employee/shifts`, `/employee/shifts/swap`, `/employee/shifts/change` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my shift schedule and request swaps or changes,
**So that** I can manage my work schedule.

### Acceptance Criteria

**AC-1: Shift Schedule**
- **Given** the employee navigates to `/employee/shifts`
- **When** the page loads
- **Then** today's shift is shown prominently with upcoming 2-week schedule, and quick actions for swap/change

**AC-2: Swap Request**
- **Given** the employee navigates to `/employee/shifts/swap`
- **When** the form renders
- **Then** fields include: date to swap, colleague to swap with, reason

**AC-3: Change Request**
- **Given** the employee navigates to `/employee/shifts/change`
- **When** the form renders
- **Then** fields include: date, desired shift, reason

---

# MODULE 7: LEAVE MANAGEMENT

---

## US-036: View and Manage Leave Requests

| Field | Value |
|-------|-------|
| **Story ID** | US-036 |
| **Epic/Feature** | Leave Management |
| **Screen/Flow** | `/leave` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** view all leave requests, filter by status, and approve or reject pending requests,
**So that** I can manage employee time-off and maintain adequate staffing.

### Acceptance Criteria

**AC-1: Leave Policy Summary**
- **Given** the leave page loads
- **When** the policy section renders
- **Then** 6 cards show allocations: Annual (20 days), Sick (10), Casual (5), Maternity (90), Paternity (10), Compassionate (5)

**AC-2: Status Tabs**
- **Given** the leave page loads
- **When** the tabs render
- **Then** tabs show: All Requests (12), Pending (6, amber badge), Approved (5), Rejected (1) — clicking filters the table

**AC-3: Search & Filter**
- **Given** the leave table is visible
- **When** the admin uses search and filters
- **Then** results filter by employee name/department AND leave type AND department (AND logic)

**AC-4: Leave Table**
- **Given** the table renders
- **When** the admin views data
- **Then** 8 columns show: Employee (avatar + name), Department, Leave Type (color badge), Duration (formatted dates), Days, Applied On, Status (color badge), Actions

**AC-5: Leave Type Badge Colors**
- **Given** leave types are displayed
- **When** badges render
- **Then** colors are: Annual=blue, Sick=red, Casual=violet, Maternity=pink, Paternity=cyan, Compassionate=amber

**AC-6: Approve Action**
- **Given** a pending leave request exists
- **When** the admin clicks the Approve (green checkmark) button
- **Then** the request status changes to Approved

**AC-7: Reject Action**
- **Given** a pending leave request exists
- **When** the admin clicks the Reject (red X) button
- **Then** the request status changes to Rejected

**AC-8: Approved/Rejected Display**
- **Given** a non-pending request exists
- **When** the actions column renders
- **Then** it shows "by {approverName}" text instead of action buttons

---

## US-037: Employee Leave (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-037 |
| **Epic/Feature** | Leave Management |
| **Screen/Flow** | `/employee/leave` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my leave balances, request leave, and see my leave history,
**So that** I can manage my time off.

### Acceptance Criteria

**AC-1: Leave Balances**
- **Given** the leave page loads
- **When** the balance section renders
- **Then** remaining days are displayed by type: Annual, Sick, Casual, Maternity/Paternity, Compassionate

**AC-2: Request Leave**
- **Given** the employee wants to request leave
- **When** they fill in: leave type, start date, end date, reason
- **Then** the request is submitted and appears in the history with "Pending" status

**AC-3: Leave History**
- **Given** the page loads
- **When** the history section renders
- **Then** all leave requests show with: type, dates, days, status (pending/approved/rejected) — with status tabs for filtering

**AC-4: Leave Calendar**
- **Given** the page loads
- **When** the calendar view renders
- **Then** approved and pending leave days are highlighted on a calendar

---

# MODULE 8: WORK SCHEDULES

---

## US-038: Work Schedule Management

| Field | Value |
|-------|-------|
| **Story ID** | US-038 |
| **Epic/Feature** | Work Schedules |
| **Screen/Flow** | `/schedules`, `/employee/schedule` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage work schedule definitions,
**So that** employees have clear working hour expectations.

### The Story — Employee
**As an** Employee,
**I want to** view my assigned work schedule,
**So that** I know my expected working hours.

### Acceptance Criteria

**AC-1: Schedule List (Admin)**
- **Given** the admin navigates to `/schedules`
- **When** the page loads
- **Then** all work schedules are listed with: name, working days, hours, employee count, status

**AC-2: Create Schedule (Admin)**
- **Given** the admin clicks "Create Schedule"
- **When** the form opens
- **Then** they can define: name, working days, start time, end time, and applicable employees

**AC-3: Employee Schedule View**
- **Given** the employee navigates to `/employee/schedule`
- **When** the page loads
- **Then** their assigned schedule details are shown with working days, hours, and any exceptions

---

# MODULE 9: PAYROLL & COMPENSATION

---

## US-039: Payroll Processing

| Field | Value |
|-------|-------|
| **Story ID** | US-039 |
| **Epic/Feature** | Payroll & Compensation |
| **Screen/Flow** | `/payroll` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** process payroll through a multi-step workflow,
**So that** employees are paid accurately and on time.

### Acceptance Criteria

**AC-1: Summary Cards**
- **Given** the payroll page loads
- **When** the summary renders
- **Then** cards show: Last Gross Pay, Last Net Pay, Total Deductions, Employees Paid

**AC-2: Payroll Runs Tab**
- **Given** the Payroll Runs tab is active
- **When** the table renders
- **Then** columns show: Period (Month Year), Status (draft/processing/completed/failed with color badges), Gross Pay (₦), Deductions (₦), Net Pay (₦), Employees, Processed Date, Approved By

**AC-3: Process Draft Payroll**
- **Given** a draft payroll run exists
- **When** the admin clicks "Process"
- **Then** the status changes from "draft" to "processing", then to "completed"

**AC-4: Payslips Tab**
- **Given** the Payslips tab is active
- **When** the table renders
- **Then** individual payslips show: Employee, Department, Basic Salary, Allowances (Housing, Transport, Other), Gross Pay, Deductions (Tax, Pension, Other), Net Pay, Status, Bank

**AC-5: Input Review Tab**
- **Given** the Input Review tab is active
- **When** the data renders
- **Then** salary inputs can be verified and adjusted before processing

**AC-6: Computation Tab**
- **Given** the Computation tab is active
- **When** the data renders
- **Then** calculated breakdowns of gross, deductions, and net are shown per employee

**AC-7: Approval Tab**
- **Given** a processed payroll needs approval
- **When** the Approval tab is active
- **Then** the admin can approve or reject the payroll run with comments

**AC-8: Off-Cycle Tab**
- **Given** the Off-Cycle tab is active
- **When** the admin creates an off-cycle run
- **Then** bonus or ad-hoc payments can be processed outside the regular cycle

**AC-9: Adjustments Tab**
- **Given** the Adjustments tab is active
- **When** the admin creates an adjustment
- **Then** retroactive corrections with type (bonus/deduction/correction), amount, and reason are recorded

**AC-10: Auto-Payroll Tab**
- **Given** the Auto-Payroll tab is active
- **When** the admin views settings
- **Then** automatic monthly processing can be enabled/disabled with schedule configuration

---

## US-040: Payroll Configuration

| Field | Value |
|-------|-------|
| **Story ID** | US-040 |
| **Epic/Feature** | Payroll & Compensation |
| **Screen/Flow** | `/payroll/config` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** configure pay grades, salary structures, and allowance templates,
**So that** employee compensation is standardized.

### Acceptance Criteria

**AC-1: Pay Grades Tab**
- **Given** the Pay Grades tab is active
- **When** the table renders
- **Then** grades show: Grade Name, Level (1-7), Min Salary (₦), Mid Salary (₦), Max Salary (₦), Employees, Status (active/inactive)

**AC-2: Salary Structures Tab**
- **Given** the Salary Structures tab is active
- **When** the table renders
- **Then** structures show: Name, Components (Basic 40%, Housing 20%, Transport 15%, etc.), Employee Count, Status

**AC-3: Allowances & Deductions Tab**
- **Given** the Templates tab is active
- **When** the table renders
- **Then** templates show: Name, Type (allowance/deduction), Category (statutory/voluntary/benefit), Calculation (fixed/percentage), Amount/Rate, Taxable flag

**AC-4: Payroll Calendar Tab**
- **Given** the Calendar tab is active
- **When** the calendar renders
- **Then** processing dates, cutoff dates, and payment dates are displayed

**AC-5: Assignments Tab**
- **Given** the Assignments tab is active
- **When** the table renders
- **Then** employee-to-grade mappings are shown with effective dates

**AC-6: Create/Edit Operations**
- **Given** the admin clicks "Add" on any tab
- **When** the form opens
- **Then** appropriate fields render for the selected entity type with validation

---

## US-041: Statutory Compliance

| Field | Value |
|-------|-------|
| **Story ID** | US-041 |
| **Epic/Feature** | Payroll & Compensation |
| **Screen/Flow** | `/payroll/compliance` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage Nigerian statutory compliance settings,
**So that** the company meets all regulatory requirements.

### Acceptance Criteria

**AC-1: PAYE Tax Tab**
- **Given** the PAYE tab is active
- **When** the table renders
- **Then** 6 tax bands display: 0-100K (0%), 100K-500K (5%), 500K-1M (10%), 1M-2M (15%), 2M-3.2M (20%), 3.2M+ (24%) — plus CRA settings

**AC-2: Pension Tab**
- **Given** the Pension tab is active
- **When** the section renders
- **Then** it shows: Employee contribution rate (8%), Employer rate (10%), and a list of registered PFAs

**AC-3: Statutory Bodies Tab**
- **Given** the Statutory Bodies tab is active
- **When** the section renders
- **Then** it shows: NHF (2.5% of basic), ITF (1% of annual payroll), NSITF (1% of monthly payroll), NHIS (10% employer, 5% employee)

**AC-4: Compliance Overview Tab**
- **Given** the Overview tab is active
- **When** the section renders
- **Then** payment status per statutory body per month is tracked with due dates, remittance status (overdue/pending/completed), and amounts

---

## US-042: Extended Payroll Features

| Field | Value |
|-------|-------|
| **Story ID** | US-042 |
| **Epic/Feature** | Payroll & Compensation |
| **Screen/Flow** | `/payroll/payslips`, `/payroll/disbursement`, `/payroll/remittance`, `/payroll/global`, `/payroll/reports`, `/payroll/audit`, `/payroll/pay-grades`, `/payroll/roster` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** access payslip management, disbursement, remittance, reports, and audit trails,
**So that** I have complete payroll lifecycle coverage.

### Acceptance Criteria

**AC-1: Payslip Management** (`/payroll/payslips`)
- **Given** the admin navigates to payslip management
- **When** the page loads
- **Then** tabs show: Template Designer, Batch Processing, Distribution, Security Settings

**AC-2: Payment Disbursement** (`/payroll/disbursement`)
- **Given** the admin navigates to disbursement
- **When** the page loads
- **Then** tabs show: Bank Integration, Payment Files, Payment Tracking, Reconciliation

**AC-3: Statutory Remittance** (`/payroll/remittance`)
- **Given** the admin navigates to remittance
- **When** the page loads
- **Then** tabs show: PAYE Filing, Pension Remittance, NHF/NHIS/ITF/NSITF, Remittance Calendar

**AC-4: Cross-Border Payroll** (`/payroll/global`)
- **Given** the admin navigates to global payroll
- **When** the page loads
- **Then** tabs show: Multi-Currency Config, International Payments, Tax & Compliance, Employee Wallets

**AC-5: Payroll Reports** (`/payroll/reports`)
- **Given** the admin navigates to reports
- **When** the page loads
- **Then** tabs show: Standard Reports, Report Builder, Analytics, GL Integration

**AC-6: Payroll Audit** (`/payroll/audit`)
- **Given** the admin navigates to audit
- **When** the page loads
- **Then** tabs show: History & Archive, Audit Trail, Year-End Closure

---

## US-043: Employee Pay & Finance (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-043 |
| **Epic/Feature** | Payroll & Compensation |
| **Screen/Flow** | `/employee/payslips`, `/employee/tax`, `/employee/payments`, `/employee/wallet` |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my payslips, tax info, payment history, and wallet,
**So that** I can understand my compensation and manage my finances.

### Acceptance Criteria

**AC-1: Payslips** (`/employee/payslips`)
- **Given** the employee navigates to payslips
- **When** the page loads
- **Then** tabs show: Current Payslip (summary cards for gross/net/deductions + detailed breakdown), Payslip History (downloadable archive), Salary Breakdown (component percentages), Revision History

**AC-2: Tax** (`/employee/tax`)
- **Given** the employee navigates to tax
- **When** the page loads
- **Then** tax information, reliefs, annual summary, and payment status are displayed

**AC-3: Payments** (`/employee/payments`)
- **Given** the employee navigates to payments
- **When** the page loads
- **Then** payment history with amounts, dates, bank details, and status is displayed

**AC-4: Wallet** (`/employee/wallet`)
- **Given** the employee navigates to wallet
- **When** the page loads
- **Then** wallet balance, transaction history, and transfer/withdrawal options are available

---

# MODULE 10: LOAN MANAGEMENT

---

## US-044: Loan Management

| Field | Value |
|-------|-------|
| **Story ID** | US-044 |
| **Epic/Feature** | Loan Management |
| **Screen/Flow** | `/loans`, `/loans/apply`, `/loans/:id` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage employee loans including products, applications, and repayment,
**So that** loan operations are tracked and compliant.

### The Story — Employee
**As an** Employee,
**I want to** apply for loans, view my active loans, and track repayments,
**So that** I can access financial support when needed.

### Acceptance Criteria

**AC-1: Loan Dashboard (Admin)**
- **Given** the admin navigates to `/loans`
- **When** the page loads
- **Then** tabs show: Loan Products, Active Loans, Applications, Salary Advances — with summary cards

**AC-2: Loan Application (Admin)**
- **Given** a loan application is pending
- **When** the admin reviews it
- **Then** they can approve or reject with comments

**AC-3: Loan Detail (Admin)** (`/loans/:id`)
- **Given** the admin views a loan detail
- **When** the page loads
- **Then** it shows: loan overview (product, principal, balance, rate), repayment schedule (month-by-month), payment history, outstanding balance

**AC-4: Employee Loans** (`/employee/loans`)
- **Given** the employee navigates to loans
- **When** the page loads
- **Then** active loans, balances, next payment, and repayment history are displayed

**AC-5: Apply for Loan (Admin)** (`/loans/apply`)
- **Given** an admin processes a loan application
- **When** the form renders
- **Then** fields include: employee, loan product, amount, tenure (3-36 months), with a repayment schedule preview

---

# MODULE 11: BENEFITS & ENROLLMENT

---

## US-045: Benefits Management

| Field | Value |
|-------|-------|
| **Story ID** | US-045 |
| **Epic/Feature** | Benefits & Enrollment |
| **Screen/Flow** | `/benefits`, `/benefits/enrollments`, `/employee/benefits` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage benefits plans and track employee enrollments,
**So that** employees have access to appropriate benefits.

### The Story — Employee
**As an** Employee,
**I want to** view available benefits and my enrollment status,
**So that** I can take advantage of company benefits.

### Acceptance Criteria

**AC-1: Benefits Plans (Admin)**
- **Given** the admin navigates to `/benefits`
- **When** the page loads
- **Then** plans are categorized (health, life insurance, meal, transport, wellness) with creation form and enrollment count tracking

**AC-2: Enrollments (Admin)**
- **Given** the admin navigates to `/benefits/enrollments`
- **When** the page loads
- **Then** employee enrollments are listed with search, filter (by plan, department, status), and summary cards

**AC-3: Employee Benefits** (`/employee/benefits`)
- **Given** the employee navigates to benefits
- **When** the page loads
- **Then** active enrollments (by category), enrollment status, start dates, and available plans are shown

---

# MODULE 12: ASSET MANAGEMENT

---

## US-046: Asset Management (Admin)

| Field | Value |
|-------|-------|
| **Story ID** | US-046 |
| **Epic/Feature** | Asset Management |
| **Screen/Flow** | `/assets`, `/assets/create`, `/assets/:id`, and sub-pages |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage the full asset lifecycle from procurement through disposal,
**So that** company assets are tracked and accounted for.

### Acceptance Criteria

**AC-1: Asset List** (`/assets`)
- **Given** the admin navigates to assets
- **When** the page loads
- **Then** assets are listed with: search, category filter (laptops, monitors, phones, furniture, vehicles), status filter (active, inactive, maintenance, disposed), location filter, condition filter, bulk selection

**AC-2: Create Asset** (`/assets/create`)
- **Given** the admin clicks "Add Asset"
- **When** the form renders
- **Then** fields include: name, category, serial number, model, purchase value, condition, depreciation info

**AC-3: Bulk Upload** (`/assets/bulk-upload`)
- **Given** the admin wants to add many assets
- **When** they navigate to bulk upload
- **Then** CSV template download, file upload, validation, and batch import are available

**AC-4: Asset Detail** (`/assets/:id`)
- **Given** the admin views an asset
- **When** the page loads
- **Then** it shows: overview, assignment history, maintenance records, depreciation details, audit trail

**AC-5: Assignment** (`/assets/assign`)
- **Given** the admin wants to assign assets
- **When** the assignment page loads
- **Then** bulk assignment with employee and asset selection is available

**AC-6: Approval Queue** (`/assets/approvals`)
- **Given** pending asset requests exist
- **When** the page loads
- **Then** requests are listed with approve/reject actions

**AC-7: Return Queue** (`/assets/returns`)
- **Given** asset returns are pending
- **When** the page loads
- **Then** return requests with condition assessment on return are shown

**AC-8: Maintenance** (`/assets/maintenance`)
- **Given** the admin navigates to maintenance
- **When** the page loads
- **Then** maintenance schedules, history, service providers, and costs are managed

**AC-9: Disposal** (`/assets/disposal`)
- **Given** the admin navigates to disposal
- **When** the page loads
- **Then** disposal requests, methods, residual values, and final accounting are managed

**AC-10: Asset Reports**
- **Given** the admin navigates to any asset report
- **When** the page loads
- **Then** Inventory Dashboard (`/assets/reports/inventory`), Assignment Report (`/assets/reports/assignments`), Utilization (`/assets/reports/utilization`), Missing (`/assets/reports/missing`), Depreciation (`/assets/reports/depreciation`) are available

---

## US-047: Employee Assets (Self-Service)

| Field | Value |
|-------|-------|
| **Story ID** | US-047 |
| **Epic/Feature** | Asset Management |
| **Screen/Flow** | `/employee/assets`, `/employee/assets/:id`, `/employee/assets/request`, `/employee/assets/report-issue`, `/employee/assets/return` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** view my assigned assets, request new ones, report issues, and return assets,
**So that** I can manage the equipment I need to do my job.

### Acceptance Criteria

**AC-1: My Assets** (`/employee/assets`)
- **Given** the employee navigates to assets
- **When** the page loads
- **Then** assigned assets are listed by category with serial number, condition, and value

**AC-2: Asset Detail** (`/employee/assets/:id`)
- **Given** the employee views an asset
- **When** the page loads
- **Then** detailed info, condition, maintenance history, and actions (report issue, return) are shown

**AC-3: Request Asset** (`/employee/assets/request`)
- **Given** the employee wants a new asset
- **When** the form renders
- **Then** fields include: category, asset type, reason, urgency level

**AC-4: Report Issue** (`/employee/assets/report-issue`)
- **Given** the employee has an issue with an asset
- **When** the form renders
- **Then** fields include: asset selection, issue description, photo attachment

**AC-5: Return Asset** (`/employee/assets/return`)
- **Given** the employee needs to return an asset
- **When** the form renders
- **Then** fields include: asset selection, return reason, condition assessment

---

# MODULE 13: DOCUMENTS & TEMPLATES

---

## US-048: Document Management

| Field | Value |
|-------|-------|
| **Story ID** | US-048 |
| **Epic/Feature** | Documents & Templates |
| **Screen/Flow** | `/documents`, `/documents/templates/new`, `/documents/templates/:id`, `/documents/templates/:id/view`, `/documents/library` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage document templates, generate documents, and maintain a document library,
**So that** HR documents are standardized and accessible.

### The Story — Employee
**As an** Employee,
**I want to** view, upload, and sign my documents,
**So that** I can manage my employment paperwork.

### Acceptance Criteria

**AC-1: Documents Dashboard (Admin)**
- **Given** the admin navigates to `/documents`
- **When** the page loads
- **Then** tabs show: Templates (library of document templates), Generated Documents (list of generated docs), Activity (document action log)

**AC-2: Template Builder** (`/documents/templates/new`)
- **Given** the admin creates a new template
- **When** the builder loads
- **Then** a block-based editor supports: header, paragraph, variable, signature, date, spacer, divider, logo, table blocks — with variable insertion (employee, company, manager, date, custom)

**AC-3: Template Preview** (`/documents/templates/:id/view`)
- **Given** the admin views a template
- **When** the page loads
- **Then** a rendered preview shows with metadata, and options to generate, clone, or edit

**AC-4: Document Library** (`/documents/library`)
- **Given** the admin navigates to the library
- **When** the page loads
- **Then** all documents are searchable and filterable with sensitivity classification, expiry tracking, and watermark settings

**AC-5: Employee Documents** (`/employee/documents`)
- **Given** the employee navigates to documents
- **When** the page loads
- **Then** personal documents are listed with upload (drag-and-drop), download, viewer, access request, and signature pad for e-signing

---

# MODULE 14: PERFORMANCE MANAGEMENT

---

## US-049: Performance Management

| Field | Value |
|-------|-------|
| **Story ID** | US-049 |
| **Epic/Feature** | Performance Management |
| **Screen/Flow** | `/performance`, `/performance/goals`, `/performance/reviews`, `/performance/reviews/:id`, `/performance/360/:id`, `/performance/okrs`, `/performance/balanced-scorecard` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage performance through goals, reviews, 360 feedback, OKRs, and balanced scorecard,
**So that** employee performance is tracked and developed.

### The Story — Employee
**As an** Employee,
**I want to** view my goals, submit self-assessments, and participate in feedback,
**So that** I can track and improve my performance.

### Acceptance Criteria

**AC-1: Performance Hub (Admin)**
- **Given** the admin navigates to `/performance`
- **When** the page loads
- **Then** system selection cards show: OKRs, Balanced Scorecard, Goals & Reviews, 360 Feedback — with quick access to each

**AC-2: Goals Management (Admin)**
- **Given** the admin navigates to `/performance/goals`
- **When** the page loads
- **Then** goals are listed by level (company, team, individual) with search, filter, progress visualization, and summary cards (total, on-track, at-risk, completed)

**AC-3: Reviews Management (Admin)**
- **Given** the admin navigates to `/performance/reviews`
- **When** the page loads
- **Then** review templates, calibration sessions, self/manager review tracking, and status monitoring are available

**AC-4: Review Detail (Admin)** (`/performance/reviews/:id`)
- **Given** the admin views a specific review
- **When** the page loads
- **Then** detailed review data with ratings, feedback, and calibration info is shown

**AC-5: 360 Feedback (Admin)** (`/performance/360/:id`)
- **Given** the admin views 360 feedback
- **When** the page loads
- **Then** peer nominee selection, feedback request tracking, competency ratings, and anonymous aggregation are available

**AC-6: OKRs (Admin)** (`/performance/okrs`)
- **Given** the admin navigates to OKRs
- **When** the page loads
- **Then** company, team, and individual OKRs are manageable with objective tracking, key results, and alignment

**AC-7: Balanced Scorecard (Admin)** (`/performance/balanced-scorecard`)
- **Given** the admin navigates to balanced scorecard
- **When** the page loads
- **Then** four perspectives (Financial, Customer, Internal Process, Learning & Growth) are configured with objectives, KPIs, and score tracking

**AC-8: Employee Performance** (`/employee/performance`)
- **Given** the employee navigates to performance
- **When** the page loads
- **Then** current cycle, assigned goals with progress, self-appraisal status, review status, and rating are displayed

---

# MODULE 15: COMMUNICATIONS & ENGAGEMENT

---

## US-050: Announcements

| Field | Value |
|-------|-------|
| **Story ID** | US-050 |
| **Epic/Feature** | Communications & Engagement |
| **Screen/Flow** | `/announcements`, `/announcements/create`, `/announcements/:id`, `/employee/announcements` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** create and manage company announcements,
**So that** I can communicate important information to employees.

### The Story — Employee
**As an** Employee,
**I want to** view company announcements,
**So that** I stay informed about company news and updates.

### Acceptance Criteria

**AC-1: Announcement List (Admin)**
- **Given** the admin navigates to `/announcements`
- **When** the page loads
- **Then** announcements are listed chronologically with: title, priority (high/medium/low), pin status, read count, publication date, author

**AC-2: Create Announcement** (`/announcements/create`)
- **Given** the admin clicks "Create"
- **When** the form renders
- **Then** fields include: title, content (rich editor), priority, pin toggle, target recipients, schedule option

**AC-3: Announcement Detail** (`/announcements/:id`)
- **Given** the admin views an announcement
- **When** the page loads
- **Then** full content, comments, and read status tracking are shown

**AC-4: Employee Announcements** (`/employee/announcements`)
- **Given** the employee navigates to announcements
- **When** the page loads
- **Then** company announcements are listed with pinned items first and read status indicators

---

## US-051: Surveys

| Field | Value |
|-------|-------|
| **Story ID** | US-051 |
| **Epic/Feature** | Communications & Engagement |
| **Screen/Flow** | `/surveys`, `/surveys/create`, `/surveys/:id/results`, `/employee/surveys` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** create surveys and analyze results,
**So that** I can gather employee feedback.

### The Story — Employee
**As an** Employee,
**I want to** participate in company surveys,
**So that** I can provide my feedback.

### Acceptance Criteria

**AC-1: Survey List (Admin)**
- **Given** the admin navigates to `/surveys`
- **When** the page loads
- **Then** surveys are listed with tabs (active, drafts, completed), response rate progress, anonymous flag

**AC-2: Survey Builder** (`/surveys/create`)
- **Given** the admin creates a survey
- **When** the builder loads
- **Then** form includes: title, description, questions (text, multiple choice, rating), target audience, scheduling

**AC-3: Survey Results** (`/surveys/:id/results`)
- **Given** the admin views results
- **When** the page loads
- **Then** response aggregation, question-wise analytics, breakdown, and export are available

**AC-4: Employee Surveys** (`/employee/surveys`)
- **Given** the employee navigates to surveys
- **When** the page loads
- **Then** active surveys to complete and previously completed surveys are listed

---

## US-052: Requisitions

| Field | Value |
|-------|-------|
| **Story ID** | US-052 |
| **Epic/Feature** | Communications & Engagement |
| **Screen/Flow** | `/requisitions`, `/requisitions/:id`, `/employee/requisitions` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage and approve employee requisitions,
**So that** purchase and expense requests are properly authorized.

### The Story — Employee
**As an** Employee,
**I want to** submit and track my requisitions,
**So that** I can request items and track approvals.

### Acceptance Criteria

**AC-1: Requisition List (Admin)**
- **Given** the admin navigates to `/requisitions`
- **When** the page loads
- **Then** requisitions are listed with: type filter (expense, procurement), status tabs (all, pending, approved, rejected), approval workflow timeline, amounts, approve/reject actions

**AC-2: Requisition Detail** (`/requisitions/:id`)
- **Given** the admin views a requisition
- **When** the page loads
- **Then** full details, workflow timeline, attachments, and approver comments are shown

**AC-3: Employee Requisitions** (`/employee/requisitions`)
- **Given** the employee navigates to requisitions
- **When** the page loads
- **Then** they can submit new requisitions (expense, procurement) and track existing ones

---

# MODULE 16: COMPLIANCE & GOVERNANCE

---

## US-053: Disciplinary Management

| Field | Value |
|-------|-------|
| **Story ID** | US-053 |
| **Epic/Feature** | Compliance & Governance |
| **Screen/Flow** | `/disciplinary`, `/disciplinary/cases/:id`, `/employee/disciplinary` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage disciplinary cases with full process tracking,
**So that** employee conduct issues are handled fairly and documented.

### The Story — Employee
**As an** Employee,
**I want to** view any disciplinary actions against me and submit appeals,
**So that** I can respond to cases and exercise my rights.

### Acceptance Criteria

**AC-1: Disciplinary Dashboard (Admin)**
- **Given** the admin navigates to `/disciplinary`
- **When** the page loads
- **Then** tabs show: Cases (active & historical), Offences Library, Sanctions Library — with search, filtering, severity levels, and summary cards (open cases, under investigation, sanctioned, appeals)

**AC-2: Case Detail** (`/disciplinary/cases/:id`)
- **Given** the admin views a case
- **When** the page loads
- **Then** case overview, event timeline, evidence, hearing records, sanctions, and appeal info are displayed

**AC-3: Employee Disciplinary** (`/employee/disciplinary`)
- **Given** the employee navigates to disciplinary
- **When** the page loads
- **Then** any cases involving them are listed with status, timeline, and appeal submission option

---

## US-054: Exit Management

| Field | Value |
|-------|-------|
| **Story ID** | US-054 |
| **Epic/Feature** | Compliance & Governance |
| **Screen/Flow** | `/exit`, `/exit/:id`, `/exit/initiate` |
| **Priority** | Medium |
| **Status** | Implemented |

### The Story — Super Admin / HR Admin
**As a** Super Admin or HR Admin,
**I want to** manage the employee exit process from initiation through final settlement,
**So that** offboarding is complete and compliant.

### Acceptance Criteria

**AC-1: Exit Pipeline** (`/exit`)
- **Given** the admin navigates to exit management
- **When** the page loads
- **Then** a pipeline view shows exits by stage: Initiated → Clearance → Final Settlement → Completed — with counts and "Initiate Exit" button

**AC-2: Initiate Exit** (`/exit/initiate`)
- **Given** the admin clicks "Initiate Exit"
- **When** the form renders
- **Then** fields include: employee selection, exit reason, exit type, notice period, expected exit date

**AC-3: Exit Detail** (`/exit/:id`)
- **Given** the admin views an exit
- **When** the page loads
- **Then** it shows: employee details, exit reason/type, notice period tracking, clearance checklist (equipment, access, documents), final settlement (gratuity, outstanding pay), offboarding tasks

---

# MODULE 17: SETTINGS

---

## US-055: Admin Settings — Company Profile, General, Notifications

| Field | Value |
|-------|-------|
| **Story ID** | US-055 |
| **Epic/Feature** | Settings |
| **Screen/Flow** | `/settings` (Company Profile, General, Notifications tabs) |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin
**As a** Super Admin,
**I want to** configure company profile, general preferences, and notification settings,
**So that** the platform is tailored to my organization.

### The Story — HR Admin
**As an** HR Admin,
**I want to** view company settings and configure notification preferences,
**So that** I receive relevant alerts for my workflow.

### Acceptance Criteria

**AC-1: Company Profile Tab**
- **Given** the admin navigates to Settings
- **When** the Company Profile tab is active
- **Then** forms display: Logo upload (PNG/JPG, max 2MB), Company Name, Email, Phone, RC Number, TIN Number, Website, Industry, Address, City, State, Country (disabled) — with "Save Changes" button

**AC-2: General Tab**
- **Given** the General tab is active
- **When** the section renders
- **Then** settings include: Date Format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD toggle buttons), Currency (₦ NGN), Language (English Nigeria/US), Timezone (Africa/Lagos), Fiscal Year Start (month select)

**AC-3: Notifications Tab**
- **Given** the Notifications tab is active
- **When** the section renders
- **Then** categories (Leave, Payroll, Attendance, Employee) show individual notification items with Email and In-App toggle switches — plus an Email Digest master toggle

---

## US-056: Admin Settings — Roles & Permissions (Super Admin Only)

| Field | Value |
|-------|-------|
| **Story ID** | US-056 |
| **Epic/Feature** | Settings |
| **Screen/Flow** | `/settings` (Roles & Permissions tab) |
| **Priority** | Critical |
| **Status** | Implemented |

### The Story — Super Admin
**As a** Super Admin,
**I want to** create, edit, and manage roles with module-level permissions,
**So that** I can control what each user type can access.

**Note:** This tab is the key differentiator between Super Admin and HR Admin. Only Super Admin can access this functionality.

### Acceptance Criteria

**AC-1: Role Table**
- **Given** the Roles & Permissions tab is active
- **When** the table renders
- **Then** columns show: Role Name, Description, Users (count with icon), Type (System/Custom badge), Actions (View/Edit/Delete)

**AC-2: System vs Custom Roles**
- **Given** system roles exist (Super Admin, HR Admin)
- **When** the admin views them
- **Then** system roles have a blue "System" badge and cannot be edited or deleted — only custom roles show Edit and Delete buttons

**AC-3: Search Roles**
- **Given** the role table is visible
- **When** the admin types in the search box
- **Then** roles filter by name or description

**AC-4: Create Role**
- **Given** the admin clicks "Create Role"
- **When** the form opens
- **Then** fields include: Role Name, Description

**AC-5: View Permissions**
- **Given** the admin clicks the View (eye) icon on a role
- **When** the permissions panel expands
- **Then** a grid of 17 module checkboxes displays: Dashboard, Employees, Departments, Attendance, Leave, Payroll, Performance, Benefits, Loans, Assets, Documents, Announcements, Surveys, Requisitions, Disciplinary, Exit Management, Settings

**AC-6: Save Permissions**
- **Given** the admin modifies permission checkboxes
- **When** they click "Save Permissions"
- **Then** the permissions are updated for that role

**AC-7: Delete Custom Role**
- **Given** a custom role exists
- **When** the admin clicks the Delete (trash) icon
- **Then** a confirmation is required before deletion

**AC-8: HR Admin Cannot Access**
- **Given** the user is logged in as HR Admin (not Super Admin)
- **When** they navigate to Settings
- **Then** the Roles & Permissions tab is either hidden or displays an "Access Denied" message

---

## US-057: Admin Settings — Security, Billing, Integrations, Audit

| Field | Value |
|-------|-------|
| **Story ID** | US-057 |
| **Epic/Feature** | Settings |
| **Screen/Flow** | `/settings` (Security, Billing, Integrations, Audit Logs tabs) |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Super Admin
**As a** Super Admin,
**I want to** manage security policies, billing, integrations, and view audit logs,
**So that** the platform is secure, properly licensed, and auditable.

### Acceptance Criteria

**AC-1: Security Tab**
- **Given** the Security tab is active
- **When** the section renders
- **Then** settings include: Password Policy (min length input, expiry days, uppercase/numbers/special char toggles), Two-Factor Authentication (enable/disable with info banner), Session Management (timeout minutes, IP whitelist toggle with IP input field)

**AC-2: Billing Tab**
- **Given** the Billing tab is active
- **When** the section renders
- **Then** it shows: Current Plan card (name, status badge, price, renewal date), Available Plans grid (Starter ₦5,000/mo, Professional ₦15,000/mo, Enterprise ₦35,000/mo — current plan highlighted with blue border), Payment History table (Date, Description, Amount, Status)

**AC-3: Integrations Tab**
- **Given** the Integrations tab is active
- **When** the section renders
- **Then** 6 integration cards display in a 2-column grid: Paystack (Connected), Biometric Devices (Not Connected), Google Workspace (Not Connected), Microsoft 365 (Not Connected), Slack (Not Connected), Bank Transfer API (Connected) — each with status badge and Connect/Configure button

**AC-4: Audit Logs Tab**
- **Given** the Audit Logs tab is active
- **When** the section renders
- **Then** a searchable, filterable table shows: User, Action, Module (badge), Timestamp, IP Address — with module filter dropdown and search by user/action

**AC-5: Audit Log Empty State**
- **Given** no logs match the filter
- **When** the table renders
- **Then** a scroll icon, "No logs found", and "Try adjusting your search or filter" appear

---

## US-058: Employee Settings

| Field | Value |
|-------|-------|
| **Story ID** | US-058 |
| **Epic/Feature** | Settings |
| **Screen/Flow** | `/employee/settings` |
| **Priority** | High |
| **Status** | Implemented |

### The Story — Employee
**As an** Employee,
**I want to** manage my account preferences, security, and notifications,
**So that** my account is configured to my needs and secure.

### Acceptance Criteria

**AC-1: Profile Settings Tab**
- **Given** the Profile Settings tab is active
- **When** the section renders
- **Then** editable forms show: Personal Information (first name, last name, phone, personal email), Address (address, city, state), Emergency Contact (name, phone, relationship) — with "Save Changes" button

**AC-2: Password & Security Tab**
- **Given** the Security tab is active
- **When** the section renders
- **Then** it shows: Change Password (current, new with strength meter showing Weak/Medium/Strong bars, confirm), Two-Factor Authentication toggle (with info banner when enabled), Active Sessions list (device, location, time, current badge, revoke button for non-current sessions)

**AC-3: Password Strength Meter**
- **Given** the employee types a new password
- **When** the strength indicator updates
- **Then** 3 bars fill with colors: <6 chars = 1 bar red (Weak), 6-9 chars = 2 bars amber (Medium), 10+ chars = 3 bars green (Strong)

**AC-4: Update Password Disabled State**
- **Given** required fields are empty or passwords don't match
- **When** the employee views the button
- **Then** "Update Password" is disabled

**AC-5: Notifications Tab**
- **Given** the Notifications tab is active
- **When** the section renders
- **Then** categories (Leave, Payroll, Attendance, Company, Performance) show individual items with Email and Push toggle switches

**AC-6: Display Tab**
- **Given** the Display tab is active
- **When** the section renders
- **Then** settings include: Theme selection (Light/Dark/System with icon buttons), Date Format toggle (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD), Language toggle (English Nigeria/US)

**AC-7: Bank & Payment Tab**
- **Given** the Bank & Payment tab is active
- **When** the section renders
- **Then** Salary Account form shows: Bank Name, Account Number (editable), Account Name (disabled), BVN (masked, disabled) — with "Request Update" button (changes require HR approval) — plus Payment Method card showing primary bank

**AC-8: Privacy Tab**
- **Given** the Privacy tab is active
- **When** the section renders
- **Then** Profile Visibility toggles show: Show in Directory, Phone Number, Email Address, Birthday — plus a "Download My Data" request export button

**AC-9: Devices Tab**
- **Given** the Devices tab is active
- **When** the section renders
- **Then** connected devices list shows: device icon (desktop/mobile), name, location, IP, last active time, current badge (green), revoke button — plus "Sign Out All Other Devices" button (red outline)

---

# CROSS-CUTTING: ROLE-BASED ACCESS SUMMARY

---

## US-059: Role-Based Access Control

| Field | Value |
|-------|-------|
| **Story ID** | US-059 |
| **Epic/Feature** | Cross-Cutting |
| **Screen/Flow** | All pages |
| **Priority** | Critical |
| **Status** | Specification |

### The Story
**As the** QA team,
**I want to** verify that each role can only access their authorized features,
**So that** data security and privacy are maintained.

### Acceptance Criteria

**AC-1: Super Admin — Full Access**
- **Given** a user is logged in as Super Admin
- **When** they navigate the system
- **Then** they can access ALL admin features including: Roles & Permissions management, Billing & Subscription, Integrations configuration, Audit Logs, and all HR operational features

**AC-2: Super Admin — Role Management**
- **Given** a Super Admin is on the Roles & Permissions tab
- **When** they create a new role and assign permissions
- **Then** users assigned that role can only access the permitted modules

**AC-3: Super Admin — Grant HR Admin Rights**
- **Given** a Super Admin is managing roles
- **When** they assign the "HR Admin" role to a user
- **Then** that user gains access to all HR operational features but NOT Roles & Permissions, Billing, or system-level Settings

**AC-4: HR Admin — Operational Access**
- **Given** a user is logged in as HR Admin
- **When** they navigate the system
- **Then** they can access: Dashboard, Employees, Departments, Attendance, Leave, Payroll, Performance, Benefits, Loans, Assets, Documents, Announcements, Surveys, Requisitions, Disciplinary, Exit Management, and Settings (Company Profile, General, Notifications, Security only)

**AC-5: HR Admin — Restricted Settings**
- **Given** an HR Admin navigates to Settings
- **When** the page loads
- **Then** Roles & Permissions, Billing, Integrations, and Audit Logs tabs are NOT accessible

**AC-6: Employee — Self-Service Only**
- **Given** a user is logged in as Employee
- **When** they navigate the system
- **Then** they can ONLY access the employee portal (`/employee/*` routes) and cannot access any admin routes (`/dashboard`, `/employees`, `/attendance`, etc.)

**AC-7: Employee — Own Data Only**
- **Given** an employee is on any self-service page
- **When** they view data
- **Then** they can only see their own records (attendance, payslips, leave, assets, etc.) and cannot view other employees' data except what's in the directory

**AC-8: URL Direct Access Prevention**
- **Given** an employee or HR Admin tries to directly access a restricted URL
- **When** the page loads
- **Then** they are redirected to their appropriate dashboard or shown an access denied message

---

# APPENDIX A: MODULE COVERAGE MATRIX

| Module | Super Admin | HR Admin | Employee |
|--------|:-----------:|:--------:|:--------:|
| Registration & Onboarding | Full | — | Onboarding Wizard |
| Dashboard | Full | Full | Employee Dashboard |
| Employee Management | Full | Full (no role mgmt) | Profile, Directory |
| Department Management | Full | Full | — |
| Attendance | Full | Full | Self-Service |
| Shift Management | Full | Full | View & Request |
| Leave Management | Full | Full | Request & Balance |
| Work Schedules | Full | Full | View Only |
| Payroll Processing | Full | Full | Payslips Only |
| Payroll Configuration | Full | Full | — |
| Statutory Compliance | Full | Full | Tax View Only |
| Loans | Full | Full | Apply & Track |
| Benefits | Full | Full | Enroll & View |
| Asset Management | Full | Full | Request & View |
| Documents | Full | Full | View & Upload |
| Performance | Full | Full | Self-Assessment |
| Announcements | Full | Full | View Only |
| Surveys | Full | Full | Participate |
| Requisitions | Full | Full | Submit & Track |
| Disciplinary | Full | Full | View & Appeal |
| Exit Management | Full | Full | — |
| **Settings — Company Profile** | Full | View/Edit | — |
| **Settings — Roles & Permissions** | **Full** | **No Access** | — |
| **Settings — General** | Full | Full | — |
| **Settings — Notifications** | Full | Full | Own Prefs |
| **Settings — Security** | Full | View Only | Own Password |
| **Settings — Billing** | **Full** | **No Access** | — |
| **Settings — Integrations** | **Full** | **No Access** | — |
| **Settings — Audit Logs** | **Full** | **No Access** | — |
| **Employee Settings** | — | — | Full |

---

# APPENDIX B: COMPLETE ROUTE MAP

## Admin Routes (Super Admin + HR Admin)
```
/login                              → Login
/register                           → Registration Wizard
/forgot-password                    → Forgot Password
/reset-password                     → Reset Password
/onboarding                         → Workspace Setup

/dashboard                          → Admin Dashboard
/employees                          → Employee List
/employees/create                   → Create Employee
/employees/:id                      → Employee Detail
/departments                        → Department List
/departments/create                 → Create Department
/departments/:id                    → Department Detail

/attendance                         → Attendance Overview
/attendance/department              → Department View
/attendance/corrections             → Corrections Queue
/attendance/manual-entry            → Manual Entry
/attendance/geofencing              → GPS & Geofencing
/attendance/breaks                  → Break Management
/attendance/daily-report            → Daily Report
/attendance/monthly-report          → Monthly Report
/attendance/analytics               → Analytics
/attendance/anomalies               → Anomalies
/attendance/work-hours              → Work Hours
/attendance/overtime                → Overtime
/attendance/payroll-sync            → Payroll Sync
/attendance/deduction-preview       → Deduction Preview
/attendance/overtime-preview        → Overtime Preview
/attendance/leave-reconciliation    → Leave Reconciliation

/shifts                             → Shift Configuration
/shifts/roster                      → Shift Roster
/shifts/swap-queue                  → Swap Queue
/shifts/calendar                    → Shift Calendar
/shifts/allowance                   → Shift Allowance
/leave                              → Leave Management
/schedules                          → Work Schedules

/payroll                            → Payroll Processing
/payroll/config                     → Payroll Configuration
/payroll/compliance                 → Statutory Compliance
/payroll/payslips                   → Payslip Management
/payroll/disbursement               → Payment Disbursement
/payroll/remittance                 → Statutory Remittance
/payroll/global                     → Cross-Border Payroll
/payroll/reports                    → Payroll Reports
/payroll/audit                      → Payroll Audit
/payroll/pay-grades                 → Pay Grades
/payroll/roster                     → Payroll Roster

/loans                              → Loan Management
/loans/apply                        → Loan Application
/loans/:id                          → Loan Detail
/benefits                           → Benefits Plans
/benefits/enrollments               → Benefits Enrollments

/performance                        → Performance Hub
/performance/goals                  → Goals
/performance/reviews                → Reviews
/performance/reviews/:id            → Review Detail
/performance/360/:id                → 360 Feedback
/performance/okrs                   → OKRs
/performance/balanced-scorecard     → Balanced Scorecard

/documents                          → Documents Dashboard
/documents/templates/new            → Template Builder
/documents/templates/:id            → Template Editor
/documents/templates/:id/view       → Template Preview
/documents/library                  → Document Library

/assets                             → Asset List
/assets/create                      → Create Asset
/assets/bulk-upload                 → Bulk Upload
/assets/:id                         → Asset Detail
/assets/assign                      → Asset Assignment
/assets/approvals                   → Approval Queue
/assets/employee-portfolio/:id      → Employee Portfolio
/assets/returns                     → Return Queue
/assets/maintenance                 → Maintenance
/assets/disposal                    → Disposal
/assets/reports/inventory           → Inventory Dashboard
/assets/reports/assignments         → Assignment Report
/assets/reports/utilization         → Utilization Report
/assets/reports/missing             → Missing Report
/assets/reports/depreciation        → Depreciation Report

/announcements                      → Announcement List
/announcements/create               → Create Announcement
/announcements/:id                  → Announcement Detail
/surveys                            → Survey List
/surveys/create                     → Create Survey
/surveys/:id/results                → Survey Results
/requisitions                       → Requisition List
/requisitions/:id                   → Requisition Detail
/disciplinary                       → Disciplinary Dashboard
/disciplinary/cases/:id             → Case Detail
/exit                               → Exit Pipeline
/exit/:id                           → Exit Detail
/exit/initiate                      → Initiate Exit
/settings                           → Admin Settings
```

## Employee Routes
```
/employee/onboarding                → Employee Onboarding
/employee/dashboard                 → Employee Dashboard
/employee/profile                   → My Profile
/employee/directory                 → Employee Directory
/employee/redeployment              → Redeployment
/employee/notifications             → Notifications

/employee/attendance                → Attendance Overview
/employee/attendance/dashboard      → Attendance Dashboard
/employee/attendance/history        → Attendance History
/employee/attendance/correction     → Correction Request
/employee/clock-in                  → Clock In/Out
/employee/work-hours                → Work Hours & Overtime
/employee/shifts                    → Shift Schedule
/employee/shifts/swap               → Shift Swap Request
/employee/shifts/change             → Shift Change Request
/employee/leave                     → Leave Management
/employee/schedule                  → Work Schedule

/employee/payslips                  → My Payslips
/employee/tax                       → Tax & Statutory
/employee/payments                  → Payments & Banking
/employee/loans                     → Loans & Advances
/employee/wallet                    → My Wallet

/employee/performance               → My Performance
/employee/benefits                  → My Benefits
/employee/documents                 → My Documents

/employee/assets                    → My Assets
/employee/assets/:id                → Asset Detail
/employee/assets/request            → Request Asset
/employee/assets/report-issue       → Report Issue
/employee/assets/return             → Return Asset

/employee/announcements             → Announcements
/employee/surveys                   → Surveys
/employee/requisitions              → Requisitions
/employee/disciplinary              → Disciplinary
/employee/settings                  → Employee Settings

/employee/mobile/clock-in           → Mobile Clock In
/employee/mobile/attendance         → Mobile Attendance
/employee/mobile/shift              → Mobile Shift
/employee/mobile/payslip            → Mobile Payslip
/employee/mobile/salary             → Mobile Salary
/employee/mobile/wallet             → Mobile Wallet
```

---

**Total User Stories:** 59
**Total Acceptance Criteria:** 250+
**Modules Covered:** 17
**Routes Covered:** 120+

---

*Document generated for SabiHR QA Team — April 15, 2026*
