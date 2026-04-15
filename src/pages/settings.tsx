import { useState } from "react";
import {
  Building2,
  Shield,
  Settings2,
  Bell,
  Lock,
  CreditCard,
  Puzzle,
  ScrollText,
  Upload,
  Check,
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  EyeOff,
  Globe,
  Calendar,
  Clock,
  Mail,
  ChevronRight,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ───
type SettingsTab =
  | "company"
  | "roles"
  | "general"
  | "notifications"
  | "security"
  | "billing"
  | "integrations"
  | "audit";

const TABS: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: "company", label: "Company Profile", icon: Building2 },
  { key: "roles", label: "Roles & Permissions", icon: Shield },
  { key: "general", label: "General", icon: Settings2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Lock },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "integrations", label: "Integrations", icon: Puzzle },
  { key: "audit", label: "Audit Logs", icon: ScrollText },
];

// ─── Mock Data ───
const COMPANY_INFO = {
  name: "TechVentures Nigeria Ltd",
  email: "admin@techventures.ng",
  phone: "+234 801 234 5678",
  rcNumber: "RC-1234567",
  tinNumber: "TIN-9876543",
  address: "42 Marina Road, Victoria Island",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  industry: "Technology",
  employeeCount: "156",
  website: "https://techventures.ng",
  logo: null as string | null,
};

const MOCK_ROLES = [
  { id: "role-1", name: "Super Admin", description: "Full system access", users: 2, isSystem: true },
  { id: "role-2", name: "HR Admin", description: "Manage employees, payroll, leave, and attendance", users: 3, isSystem: true },
  { id: "role-3", name: "HR Staff", description: "View and basic editing of HR records", users: 5, isSystem: false },
  { id: "role-4", name: "Manager", description: "Approve leave, view team reports", users: 12, isSystem: false },
  { id: "role-5", name: "Payroll Admin", description: "Process and manage payroll", users: 2, isSystem: false },
  { id: "role-6", name: "Viewer", description: "Read-only access to dashboards and reports", users: 4, isSystem: false },
];

const ROLE_MODULES = [
  "Dashboard", "Employees", "Departments", "Attendance", "Leave", "Payroll",
  "Performance", "Benefits", "Loans", "Assets", "Documents", "Announcements",
  "Surveys", "Requisitions", "Disciplinary", "Exit Management", "Settings",
];

const NOTIFICATION_SETTINGS = [
  { category: "Leave", items: [
    { id: "leave-request", label: "New leave request submitted", email: true, inApp: true },
    { id: "leave-approved", label: "Leave request approved/rejected", email: true, inApp: true },
    { id: "leave-balance", label: "Low leave balance alerts", email: false, inApp: true },
  ]},
  { category: "Payroll", items: [
    { id: "payroll-processed", label: "Payroll run completed", email: true, inApp: true },
    { id: "payroll-deadline", label: "Payroll deadline approaching", email: true, inApp: true },
    { id: "remittance-due", label: "Statutory remittance due", email: true, inApp: false },
  ]},
  { category: "Attendance", items: [
    { id: "attendance-anomaly", label: "Attendance anomaly detected", email: false, inApp: true },
    { id: "absent-alert", label: "Absent employee alerts", email: true, inApp: true },
    { id: "clock-in-issue", label: "Clock-in/out issues", email: false, inApp: true },
  ]},
  { category: "Employee", items: [
    { id: "new-hire", label: "New employee added", email: true, inApp: true },
    { id: "probation-ending", label: "Probation period ending", email: true, inApp: true },
    { id: "contract-expiry", label: "Contract expiring soon", email: true, inApp: true },
  ]},
];

const INTEGRATIONS = [
  { id: "paystack", name: "Paystack", description: "Payment processing for subscriptions and payroll", status: "connected" as const, icon: "💳" },
  { id: "biometric", name: "Biometric Devices", description: "Fingerprint and facial recognition clock-in", status: "not_connected" as const, icon: "🔒" },
  { id: "google", name: "Google Workspace", description: "SSO and calendar sync", status: "not_connected" as const, icon: "🔗" },
  { id: "microsoft", name: "Microsoft 365", description: "SSO and email integration", status: "not_connected" as const, icon: "📧" },
  { id: "slack", name: "Slack", description: "Notifications and alerts via Slack channels", status: "not_connected" as const, icon: "💬" },
  { id: "bank", name: "Bank Transfer API", description: "Direct bank disbursement for payroll", status: "connected" as const, icon: "🏦" },
];

const MOCK_AUDIT_LOGS = [
  { id: "log-1", user: "Adebayo Ogunlesi", action: "Updated payroll configuration", module: "Payroll", timestamp: "2026-04-15 10:32 AM", ip: "192.168.1.45" },
  { id: "log-2", user: "Fatima Hassan", action: "Approved leave request for John Doe", module: "Leave", timestamp: "2026-04-15 09:15 AM", ip: "192.168.1.23" },
  { id: "log-3", user: "Chidi Nwankwo", action: "Created new employee record", module: "Employees", timestamp: "2026-04-14 04:48 PM", ip: "192.168.1.12" },
  { id: "log-4", user: "Adebayo Ogunlesi", action: "Processed March 2026 payroll", module: "Payroll", timestamp: "2026-04-14 02:30 PM", ip: "192.168.1.45" },
  { id: "log-5", user: "Amara Eze", action: "Updated company profile", module: "Settings", timestamp: "2026-04-14 11:20 AM", ip: "192.168.1.34" },
  { id: "log-6", user: "Fatima Hassan", action: "Assigned asset to employee", module: "Assets", timestamp: "2026-04-13 03:15 PM", ip: "192.168.1.23" },
  { id: "log-7", user: "Chidi Nwankwo", action: "Deactivated terminated employee", module: "Employees", timestamp: "2026-04-13 01:10 PM", ip: "192.168.1.12" },
  { id: "log-8", user: "Adebayo Ogunlesi", action: "Updated security settings", module: "Settings", timestamp: "2026-04-12 05:00 PM", ip: "192.168.1.45" },
];

const BILLING_PLANS = [
  { name: "Starter", price: 5000, employees: "1-25", features: ["Core HR", "Attendance", "Leave", "Basic Reports"] },
  { name: "Professional", price: 15000, employees: "26-100", features: ["Everything in Starter", "Payroll", "Performance", "Assets", "Documents"] },
  { name: "Enterprise", price: 35000, employees: "101-500", features: ["Everything in Professional", "Global Payroll", "Custom Integrations", "Dedicated Support", "API Access"] },
];

// ─── Helpers ───
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
      style={{ backgroundColor: checked ? "#2563EB" : "#cbd5e1" }}>
      <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform", checked ? "translate-x-[18px]" : "translate-x-[3px]")} />
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white">
      <div className="p-5 border-b border-[#efefef]">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
      <label className="text-sm font-medium text-slate-700 pt-2">{label}</label>
      <div>{children}</div>
    </div>
  );
}

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 px-4 py-3 text-sm shadow-lg">
      <Check className="w-4 h-4" />
      {message}
      <button onClick={onDismiss} className="p-0.5 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Tab Content Components ───

function CompanyProfileTab() {
  const [form, setForm] = useState(COMPANY_INFO);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {saved && <Toast message="Company profile updated successfully" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Company Logo" description="Upload your company logo for branding across the platform">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Upload className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <Button variant="outline" size="sm">Upload Logo</Button>
            <p className="text-xs text-slate-500 mt-1">PNG or JPG, max 2MB. Recommended 200x200px.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Company Information" description="Basic information about your organization">
        <div className="space-y-4">
          <FormRow label="Company Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormRow>
          <FormRow label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormRow>
          <FormRow label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormRow>
          <FormRow label="RC Number">
            <Input value={form.rcNumber} onChange={(e) => setForm({ ...form, rcNumber: e.target.value })} />
          </FormRow>
          <FormRow label="TIN Number">
            <Input value={form.tinNumber} onChange={(e) => setForm({ ...form, tinNumber: e.target.value })} />
          </FormRow>
          <FormRow label="Website">
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </FormRow>
          <FormRow label="Industry">
            <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard title="Address" description="Company physical address">
        <div className="space-y-4">
          <FormRow label="Address">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </FormRow>
          <FormRow label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </FormRow>
          <FormRow label="State">
            <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </FormRow>
          <FormRow label="Country">
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} disabled />
          </FormRow>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function RolesPermissionsTab() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filtered = MOCK_ROLES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Role</Button>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Role Name</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Description</th>
              <th className="p-3 text-center text-xs font-medium text-slate-500">Users</th>
              <th className="p-3 text-center text-xs font-medium text-slate-500">Type</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((role) => (
              <tr key={role.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                <td className="p-3 font-medium text-slate-900">{role.name}</td>
                <td className="p-3 text-slate-500">{role.description}</td>
                <td className="p-3 text-center">
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Users className="w-3.5 h-3.5" /> {role.users}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    role.isSystem ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                  )}>
                    {role.isSystem ? "System" : "Custom"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!role.isSystem && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRole && (
        <SectionCard title={`Permissions — ${MOCK_ROLES.find((r) => r.id === selectedRole)?.name}`} description="Module-level access control">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_MODULES.map((mod) => (
              <label key={mod} className="flex items-center gap-2 rounded-lg border border-[#efefef] p-3 hover:bg-[#f8fafc] cursor-pointer">
                <input type="checkbox" defaultChecked={Math.random() > 0.3} className="rounded border-slate-300" />
                <span className="text-sm text-slate-700">{mod}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm">Save Permissions</Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function GeneralTab() {
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("NGN");
  const [language, setLanguage] = useState("en-NG");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [fiscalYear, setFiscalYear] = useState("January");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      {saved && <Toast message="General settings updated" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Localization" description="Date, currency, and language preferences">
        <div className="space-y-4">
          <FormRow label="Date Format">
            <div className="flex gap-2">
              {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((fmt) => (
                <button key={fmt} onClick={() => setDateFormat(fmt)}
                  className={cn("px-3 py-1.5 rounded-lg border text-sm transition-colors",
                    dateFormat === fmt ? "border-blue-600 bg-blue-50 text-blue-700 font-medium" : "border-[#efefef] text-slate-600 hover:bg-[#f8fafc]"
                  )}>
                  {fmt}
                </button>
              ))}
            </div>
          </FormRow>
          <FormRow label="Currency">
            <div className="flex items-center gap-2">
              <span className="text-lg">₦</span>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="max-w-[120px]" />
              <span className="text-xs text-slate-500">Nigerian Naira</span>
            </div>
          </FormRow>
          <FormRow label="Language">
            <div className="flex gap-2">
              {[{ value: "en-NG", label: "English (Nigeria)" }, { value: "en-US", label: "English (US)" }].map((lang) => (
                <button key={lang.value} onClick={() => setLanguage(lang.value)}
                  className={cn("px-3 py-1.5 rounded-lg border text-sm transition-colors",
                    language === lang.value ? "border-blue-600 bg-blue-50 text-blue-700 font-medium" : "border-[#efefef] text-slate-600 hover:bg-[#f8fafc]"
                  )}>
                  {lang.label}
                </button>
              ))}
            </div>
          </FormRow>
          <FormRow label="Timezone">
            <Input value={timezone} disabled className="max-w-[240px]" />
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard title="Fiscal Year" description="Financial year configuration for reports and payroll">
        <FormRow label="Fiscal Year Start">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none">
              {["January", "February", "March", "April", "July", "October"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </FormRow>
      </SectionCard>

      <div className="flex justify-end">
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Save Changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);

  const toggleSetting = (catIndex: number, itemIndex: number, type: "email" | "inApp") => {
    const updated = [...settings];
    const item = { ...updated[catIndex].items[itemIndex] };
    item[type] = !item[type];
    updated[catIndex] = { ...updated[catIndex], items: [...updated[catIndex].items] };
    updated[catIndex].items[itemIndex] = item;
    setSettings(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Email Digest</p>
            <p className="text-xs text-slate-500">Receive a daily summary of all notifications via email</p>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
      </div>

      {settings.map((category, catIdx) => (
        <SectionCard key={category.category} title={category.category} description={`Configure ${category.category.toLowerCase()} notification preferences`}>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-xs font-medium text-slate-500 pb-2 border-b border-[#efefef]">
              <span>Notification</span>
              <span className="text-center">Email</span>
              <span className="text-center">In-App</span>
            </div>
            {category.items.map((item, itemIdx) => (
              <div key={item.id} className="grid grid-cols-[1fr_60px_60px] gap-2 items-center">
                <span className="text-sm text-slate-700">{item.label}</span>
                <div className="flex justify-center">
                  <Toggle checked={item.email} onChange={() => toggleSetting(catIdx, itemIdx, "email")} />
                </div>
                <div className="flex justify-center">
                  <Toggle checked={item.inApp} onChange={() => toggleSetting(catIdx, itemIdx, "inApp")} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function SecurityTab() {
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      {saved && <Toast message="Security settings updated" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Password Policy" description="Set password requirements for all users">
        <div className="space-y-4">
          <FormRow label="Minimum Length">
            <div className="flex items-center gap-2">
              <Input type="number" value={passwordMinLength} onChange={(e) => setPasswordMinLength(e.target.value)} className="max-w-[100px]" />
              <span className="text-sm text-slate-500">characters</span>
            </div>
          </FormRow>
          <FormRow label="Password Expiry">
            <div className="flex items-center gap-2">
              <Input type="number" value={passwordExpiry} onChange={(e) => setPasswordExpiry(e.target.value)} className="max-w-[100px]" />
              <span className="text-sm text-slate-500">days (0 = never expire)</span>
            </div>
          </FormRow>
          <FormRow label="Require Uppercase">
            <Toggle checked={true} onChange={() => {}} />
          </FormRow>
          <FormRow label="Require Numbers">
            <Toggle checked={true} onChange={() => {}} />
          </FormRow>
          <FormRow label="Require Special Chars">
            <Toggle checked={false} onChange={() => {}} />
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Require 2FA for admin accounts">
        <div className="flex items-center gap-4">
          <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          <div>
            <p className="text-sm font-medium text-slate-900">{twoFactor ? "Enabled" : "Disabled"}</p>
            <p className="text-xs text-slate-500">All admin users will be required to set up 2FA on next login</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Session Management" description="Control session timeout and IP restrictions">
        <div className="space-y-4">
          <FormRow label="Session Timeout">
            <div className="flex items-center gap-2">
              <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="max-w-[100px]" />
              <span className="text-sm text-slate-500">minutes of inactivity</span>
            </div>
          </FormRow>
          <FormRow label="IP Whitelist">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle checked={ipWhitelist} onChange={() => setIpWhitelist(!ipWhitelist)} />
                <span className="text-sm text-slate-600">{ipWhitelist ? "Enabled" : "Disabled"}</span>
              </div>
              {ipWhitelist && (
                <div className="mt-2">
                  <Input placeholder="Enter IP addresses (comma-separated)" className="max-w-[400px]" />
                  <p className="text-xs text-slate-500 mt-1">Only users from these IPs can access the admin panel</p>
                </div>
              )}
            </div>
          </FormRow>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Save Security Settings</Button>
      </div>
    </div>
  );
}

function BillingTab() {
  const currentPlan = "Professional";

  return (
    <div className="space-y-6">
      <SectionCard title="Current Plan" description="Your active subscription">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-slate-900">{currentPlan}</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">Active</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">₦15,000/month &middot; Up to 100 employees &middot; Renews May 1, 2026</p>
          </div>
          <Button variant="outline" size="sm">Manage Plan</Button>
        </div>
      </SectionCard>

      <SectionCard title="Available Plans" description="Choose the plan that fits your organization">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BILLING_PLANS.map((plan) => (
            <div key={plan.name} className={cn(
              "rounded-xl border p-4 space-y-3",
              plan.name === currentPlan ? "border-blue-600 bg-blue-50/30" : "border-[#efefef]"
            )}>
              <div>
                <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                <p className="text-xs text-slate-500">{plan.employees} employees</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">₦{plan.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.name === currentPlan ? "default" : "outline"} size="sm" className="w-full" disabled={plan.name === currentPlan}>
                {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Payment History" description="Recent invoices and payments">
        <div className="rounded-xl border border-[#efefef] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Date</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Description</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "Apr 1, 2026", desc: "Professional Plan — Monthly", amount: "₦15,000", status: "Paid" },
                { date: "Mar 1, 2026", desc: "Professional Plan — Monthly", amount: "₦15,000", status: "Paid" },
                { date: "Feb 1, 2026", desc: "Professional Plan — Monthly", amount: "₦15,000", status: "Paid" },
              ].map((inv, i) => (
                <tr key={i} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc]">
                  <td className="p-3 text-slate-600">{inv.date}</td>
                  <td className="p-3 text-slate-900">{inv.desc}</td>
                  <td className="p-3 text-right font-medium text-slate-900">{inv.amount}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{integration.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{integration.name}</h4>
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    integration.status === "connected"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  )}>
                    {integration.status === "connected" ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{integration.description}</p>
                <div className="mt-3">
                  <Button variant={integration.status === "connected" ? "outline" : "default"} size="sm">
                    {integration.status === "connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditLogsTab() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const modules = ["all", ...new Set(MOCK_AUDIT_LOGS.map((l) => l.module))];
  const filtered = MOCK_AUDIT_LOGS.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by user or action..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none">
          {modules.map((m) => (
            <option key={m} value={m}>{m === "all" ? "All Modules" : m}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">User</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Action</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Module</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Timestamp</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                <td className="p-3 font-medium text-slate-900">{log.user}</td>
                <td className="p-3 text-slate-600">{log.action}</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-50 border-slate-200 text-slate-600">
                    {log.module}
                  </span>
                </td>
                <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-3 text-slate-500 font-mono text-xs">{log.ip}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No logs found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filter</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Settings Page ───

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">Manage your organization settings, preferences, and configurations</p>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "company" && <CompanyProfileTab />}
      {activeTab === "roles" && <RolesPermissionsTab />}
      {activeTab === "general" && <GeneralTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "billing" && <BillingTab />}
      {activeTab === "integrations" && <IntegrationsTab />}
      {activeTab === "audit" && <AuditLogsTab />}
    </div>
  );
}
