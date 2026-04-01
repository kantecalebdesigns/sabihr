# SabiHR - Company Onboarding: User Stories & Use Cases

## Overview

This document details the complete company onboarding flow for SabiHR, covering every screen, input field, validation rule, user action, and edge case from initial registration through workspace setup.

The onboarding is split into two phases:
1. **Registration** (`/register`) — Company account creation, plan selection, payment
2. **Workspace Setup** (`/onboarding`) — Departments and employee invitations

---

## Phase 1: Registration Flow

### US-1: Email Verification

**As a** new company admin,
**I want to** verify my email before registering,
**So that** SabiHR can confirm my identity and prevent spam accounts.

#### Screen: Get Started (Phase 1 - Email Entry)

| Field | Type | Placeholder | Required | Validation |
|-------|------|-------------|----------|------------|
| Company name | text | e.g. Acme Technologies Ltd | Yes | Must be non-empty after trimming |
| Email address | email | you@company.com | Yes | Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |

**User Actions:**
- Fill in company name and email
- Click "Send verification code" to submit
- Click "Back to login" to return to `/login`

**Success Flow:**
1. User enters company name and email
2. Clicks "Send verification code"
3. Loading spinner appears on button ("Sending code...")
4. System sends OTP to email (mock: 1s delay)
5. Screen transitions to OTP entry phase
6. 30-second cooldown starts for resend

**Error States:**
- Empty company name → "Please enter your company name"
- Empty email → "Please enter your email address"
- Invalid email format → "Please enter a valid email address"
- Errors display in red alert box above form

---

#### Screen: OTP Verification (Phase 2)

| Field | Type | Details | Required |
|-------|------|---------|----------|
| 6-digit code | 6 individual numeric inputs | Single digit each, auto-advance on entry | Yes (all 6 digits) |

**User Actions:**
- Enter 6-digit code (one digit per box)
- Paste a full code (auto-fills all boxes)
- Press Backspace to navigate to previous input
- Click "Verify & continue" to submit
- Click "Click to resend" (available after cooldown)
- Click "Use a different email" to go back

**Success Flow:**
1. User enters or pastes 6-digit OTP
2. Clicks "Verify & continue"
3. Loading spinner ("Verifying...")
4. System verifies code (mock: 1s delay, any code accepted)
5. Transitions to Company Info step
6. Company name and email carry forward to next step

**Edge Cases:**
- Paste handling: extracts only digits, fills up to 6 boxes
- Backspace on empty box: focuses previous box
- Non-digit input: rejected silently
- Resend cooldown: "Resend in Xs" shown, counts down from 30
- After cooldown expires: "Click to resend" becomes clickable

---

### US-2: Company Information

**As a** company admin,
**I want to** enter my company details,
**So that** SabiHR can set up my organization profile correctly.

#### Screen: Company Information (Registration Step 1)

| Field | Type | Placeholder | Required | Options/Details |
|-------|------|-------------|----------|-----------------|
| Company Logo | File upload | Drop or browse | No | PNG/JPG, max 5MB |
| RC Number | text | e.g. RC123456 | No | |
| TIN Number | text | e.g. 12345678-0001 | No | |
| Company Email | email | info@company.com | Yes* | Pre-filled from verification |
| Phone Number | text | e.g. 08012345678 | Yes* | |
| Address | text | Street address | No | |
| City | text | e.g. Lagos | No | |
| State | select | Select state | Yes* | 37 Nigerian states + FCT |
| Industry | select | Select industry | Yes* | 18 industries |
| Employee Count | select | Select range | No | 7 ranges (1-10 to 1000+) |

**Nigerian States (37):**
Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT - Abuja, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara

**Industries (18):**
Agriculture, Banking & Finance, Construction, Consulting, Education, Energy & Oil/Gas, Healthcare, Hospitality, Information Technology, Legal Services, Logistics & Transportation, Manufacturing, Media & Entertainment, Non-Profit, Real Estate, Retail & E-Commerce, Telecommunications, Other

**Employee Count Ranges (7):**
1 - 10, 11 - 50, 51 - 100, 101 - 250, 251 - 500, 501 - 1000, 1000+

**Logo Upload Behavior:**
1. Click upload zone or drag file
2. File validated: must be image (PNG/JPG), under 5MB
3. Preview shown with filename and size
4. "Change" button to replace, "X" to remove
5. Preview URL created via `URL.createObjectURL` and revoked on change

**User Actions:**
- Fill in company details
- Upload/change/remove company logo
- Click "Continue" to advance to Plan Selection
- Click "Sign in instead" to go back to `/login`

**Error States:**
- Missing required fields show red error text below the field
- Errors clear when the field is modified

---

### US-3: Plan Selection

**As a** company admin,
**I want to** choose a subscription plan and billing cycle,
**So that** I can pay for the features my organization needs.

#### Screen: Plan Selection (Registration Step 2)

**Billing Cycle Toggle:**

| Cycle | Duration | Discount | Badge |
|-------|----------|----------|-------|
| Quarterly | 3 months | 0% | None |
| Bi-Annually | 6 months | 10% | "Save 10%" |
| Annually | 12 months | 20% | "Save 20%" |

**Plans:**

| Plan | Monthly Price (NGN) | Max Employees | Key Features |
|------|-------------------|---------------|--------------|
| **Starter** | 2,500 | 25 | Employee records, leave management, basic attendance, self-service portal, email support |
| **Professional** (Most Popular) | 4,500 | 250 | Everything in Starter + payroll with PAYE, performance management, document management, onboarding workflows, multi-branch, priority support |
| **Enterprise** | 7,500 | Unlimited | Everything in Professional + multi-subsidiary, custom approvals, advanced analytics, biometric integration, API access, dedicated account manager, custom integrations |

**Price Calculation:**
`Total = monthlyPrice x months x (1 - discount/100)`

Example: Professional + Annually = 4,500 x 12 x 0.80 = NGN 43,200

**User Actions:**
- Select billing cycle (toggle buttons)
- Click plan card to select (radio-style, one at a time)
- Click "Continue to Payment" to advance
- Click "Back" to return to Company Info

**Validation:**
- A plan must be selected before continuing

---

### US-4: Payment

**As a** company admin,
**I want to** make a payment via Paystack,
**So that** I can activate my subscription.

#### Screen: Paystack Payment (Registration Step 3)

**Order Summary (read-only):**
- Company email
- Plan name + billing cycle
- Total amount in NGN

| Field | Type | Placeholder | Max Length | Format |
|-------|------|-------------|-----------|--------|
| Card Number | text | 0000 0000 0000 0000 | 19 chars (16 digits + 3 spaces) | Auto-spaced every 4 digits |
| Expiry | text | MM/YY | 5 chars | Auto-formatted as MM/YY |
| CVV | password | 123 | 3 chars | Digits only, masked |

**User Actions:**
- Enter card details
- Click "Pay [amount]" to process payment
- Click "Cancel Payment" to return to plan selection

**Success Flow:**
1. User fills in card details
2. Clicks "Pay NGN XX,XXX"
3. Loading state ("Processing...")
4. Payment processes (mock: 2s delay)
5. Transitions to registration success screen

**Edge Cases:**
- Card number: only digits allowed, auto-formatted with spaces
- Expiry: only digits allowed, auto-formatted as MM/YY
- CVV: only digits allowed, max 3
- All actions disabled during payment processing

---

### US-5: Registration Success

**As a** newly registered company admin,
**I want to** see confirmation that my account is ready,
**So that** I can proceed to set up my workspace.

#### Screen: Registration Complete

**Display:**
- Green checkmark icon
- "Registration complete!" heading
- "Your company [name] has been registered successfully. Next, let's configure your HR workspace."
- Confirmation email notice: "A confirmation email has been sent to [email]"

**User Actions:**
- Click "Set Up Your Workspace" → navigates to `/onboarding`
- Click "Skip setup, go to dashboard" → sets `onboardingComplete` flag, navigates to `/dashboard`

---

## Phase 2: Workspace Setup Flow

### US-6: Set Up Departments

**As a** company admin,
**I want to** create departments for my organization,
**So that** employees can be organized by team.

#### Screen: Set Up Departments (Onboarding Step 1)

**Quick Add Section:**
Pre-built department buttons for one-click adding:

| Department | Click Action |
|-----------|-------------|
| Engineering | Adds with blank head/description |
| Finance | Adds with blank head/description |
| Human Resources | Adds with blank head/description |
| Marketing | Adds with blank head/description |
| Operations | Adds with blank head/description |
| Sales | Adds with blank head/description |
| Legal | Adds with blank head/description |
| Information Technology | Adds with blank head/description |

**Button States:**
- Available: white background, slate border, clickable
- Already added: blue background, white text, disabled

**Department Card Fields (per department):**

| Field | Type | Placeholder | Required |
|-------|------|-------------|----------|
| Department name | text | Department name | Yes |
| Department head | text | Department head (optional) | No |
| Description | text | Description (optional) | No |

**User Actions:**
- Click Quick Add buttons to add preset departments
- Click "Add Custom Department" to add a blank department
- Edit department name, head, or description inline
- Click "X" (on hover) to remove a department
- Click "Continue" to advance to Employees step

**Display:**
- "Your Departments" label with count badge
- 2-column grid on large screens, 1-column on mobile
- New blank departments auto-focus on the name field

**Edge Cases:**
- Quick Add button disabled if department already added (case-insensitive match)
- Can add multiple custom departments with same name (no uniqueness check)
- At least 1 department should be added before continuing

---

### US-7: Add Employees

**As a** company admin,
**I want to** invite employees to join my workspace,
**So that** they can access the HR platform.

#### Screen: Add Your Employees (Onboarding Step 2)

**Empty State:**
- UserPlus icon with Mail badge
- "Start with your HR staff" heading
- "Add your HR administrator first, then invite the rest of your team."
- Two buttons: "Add Employee" and "Paste Emails"

**Employee Card Fields (per invite):**

| Field | Type | Placeholder | Required | Details |
|-------|------|-------------|----------|---------|
| Email address | email | Email address | Yes | Auto-focus on newest blank entry |
| Department | select | Department (optional) | No | Options from departments added in Step 1. Shows "No departments added" if none exist |
| Role | select | HR Staff / Role (optional) | Conditional | **First employee: only "HR Staff" available.** Subsequent: Employee, Manager, HR Admin, Department Head |

**Available Roles (4):**
- Employee
- Manager
- HR Admin
- Department Head

**First Employee Restriction:**
The first employee added (index 0) is forced to be HR Staff. The role dropdown only shows "HR Staff" as an option. This ensures every organization starts with an HR administrator.

**Bulk Add (Paste Emails):**

| Field | Type | Placeholder | Details |
|-------|------|-------------|---------|
| Email textarea | textarea | john@company.com, jane@company.com (or one per line) | Accepts comma or newline separated emails |

- Click "Add All" to parse and create invites (blank department/role)
- Click "Cancel" to dismiss
- Parsing: splits by commas and newlines, trims whitespace, filters empties

**User Actions:**
- Click "Add Employee" to add a single blank invite
- Click "Paste Emails" to open bulk textarea
- Edit email, department, role per invite
- Click "X" (on hover) to remove an invite
- Click "Add Another" to add more after the first
- Click "Complete Setup" to finish onboarding
- Click "Back" to return to Departments step

**Edge Cases:**
- Department dropdown shows departments from Step 1 only
- If no departments were added, dropdown shows disabled "No departments added"
- Bulk add creates invites with blank department and role
- Avatar circle shows first letter of email (uppercase) or index number if no email

---

### US-8: Workspace Setup Complete

**As a** company admin,
**I want to** see that my workspace is fully configured,
**So that** I can start using the dashboard.

#### Screen: Your workspace is ready!

**Display:**
- Green checkmark in light green circle (`bg-[#f4fcf1]`)
- "Your workspace is ready!" (24px, semibold)
- "You've successfully configured your HR workspace. You can always adjust these settings later from the admin panel." (14px, slate-500)
- "Go to Dashboard" button (blue, 362px wide)

**User Actions:**
- Click "Go to Dashboard" → sets `onboardingComplete = "true"` in localStorage, navigates to `/dashboard`

---

## Complete User Journey Map

```
/register
  |
  +-- Email Verification
  |     |-- Enter company name + email
  |     |-- Receive & enter 6-digit OTP
  |     |-- [Resend OTP if needed]
  |
  +-- Company Information
  |     |-- Upload logo (optional)
  |     |-- Enter RC/TIN numbers (optional)
  |     |-- Enter email*, phone*, address, city
  |     |-- Select state*, industry*
  |     |-- Select employee count (optional)
  |
  +-- Plan Selection
  |     |-- Choose billing cycle (quarterly/bi-annually/annually)
  |     |-- Select plan (Starter/Professional/Enterprise)
  |
  +-- Payment
  |     |-- Enter card number, expiry, CVV
  |     |-- Process payment via Paystack
  |
  +-- Registration Success
        |-- "Set Up Your Workspace" → /onboarding
        |-- "Skip setup" → /dashboard

/onboarding
  |
  +-- Departments
  |     |-- Quick Add preset departments
  |     |-- Add custom departments
  |     |-- Edit name, head, description per dept
  |
  +-- Employees
  |     |-- Add HR Staff first (role restricted)
  |     |-- Add more employees (all roles available)
  |     |-- Bulk add via email paste
  |     |-- Assign department + role per employee
  |
  +-- Success
        |-- "Go to Dashboard" → /dashboard
```

---

## Data Structures

### Registration Data

```typescript
// Company Information
{
  companyName: string       // from email verification
  rcNumber: string          // optional
  tinNumber: string         // optional
  email: string             // required, from verification
  phone: string             // required
  address: string           // optional
  city: string              // optional
  state: string             // required (Nigerian state)
  industry: string          // required
  employeeCount: string     // optional (range)
  logo: File | null         // optional (PNG/JPG, max 5MB)
  logoPreview: string       // blob URL for preview
}

// Plan Selection
{
  planId: string                                        // "starter" | "professional" | "enterprise"
  billingCycle: "quarterly" | "bi-annually" | "annually"
}
```

### Onboarding Data

```typescript
// Department
{
  id: string          // auto-generated
  name: string        // required
  head: string        // optional
  description: string // optional
}

// Employee Invite
{
  id: string          // auto-generated
  email: string       // required
  department: string  // optional (from added departments)
  role: string        // "HR Staff" (first), or Employee/Manager/HR Admin/Department Head
}
```

---

## State Persistence

- **localStorage `userRole`**: Set to "admin" on login
- **localStorage `onboardingComplete`**: Set to "true" when workspace setup finishes or is skipped
- **No server persistence yet**: All data is mock — registration and onboarding data are not sent to an API
