import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Palette,
  CreditCard,
  EyeOff,
  Monitor,
  Check,
  X,
  Smartphone,
  Moon,
  Sun,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ───
type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "display"
  | "bank"
  | "privacy"
  | "devices";

const TABS: { key: SettingsTab; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile Settings", icon: User },
  { key: "security", label: "Password & Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "display", label: "Display", icon: Palette },
  { key: "bank", label: "Bank & Payment", icon: CreditCard },
  { key: "privacy", label: "Privacy", icon: EyeOff },
  { key: "devices", label: "Devices", icon: Monitor },
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
    <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
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
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
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

// ─── Tab Components ───

function ProfileSettingsTab() {
  const [form, setForm] = useState({
    firstName: "Adebayo",
    lastName: "Ogunlesi",
    phone: "+234 801 234 5678",
    personalEmail: "adebayo.personal@gmail.com",
    address: "15 Allen Avenue, Ikeja",
    city: "Lagos",
    state: "Lagos",
    emergencyName: "Funke Ogunlesi",
    emergencyPhone: "+234 802 345 6789",
    emergencyRelationship: "Spouse",
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      {saved && <Toast message="Profile updated successfully" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Personal Information" description="Update your contact details. Changes may require HR approval.">
        <div className="space-y-4">
          <FormRow label="First Name">
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </FormRow>
          <FormRow label="Last Name">
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </FormRow>
          <FormRow label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormRow>
          <FormRow label="Personal Email">
            <Input type="email" value={form.personalEmail} onChange={(e) => setForm({ ...form, personalEmail: e.target.value })} />
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard title="Address" description="Your current residential address">
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
        </div>
      </SectionCard>

      <SectionCard title="Emergency Contact" description="Person to contact in case of emergency">
        <div className="space-y-4">
          <FormRow label="Full Name">
            <Input value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
          </FormRow>
          <FormRow label="Phone">
            <Input value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
          </FormRow>
          <FormRow label="Relationship">
            <Input value={form.emergencyRelationship} onChange={(e) => setForm({ ...form, emergencyRelationship: e.target.value })} />
          </FormRow>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Save Changes</Button>
      </div>
    </div>
  );
}

function PasswordSecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const passwordStrength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Medium", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"];

  return (
    <div className="space-y-6">
      {saved && <Toast message="Password updated successfully" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Change Password" description="Update your account password">
        <div className="space-y-4">
          <FormRow label="Current Password">
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
          </FormRow>
          <FormRow label="New Password">
            <div className="space-y-2">
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
              {newPassword.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1 max-w-[160px]">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className={cn("h-1.5 flex-1 rounded-full", level <= passwordStrength ? strengthColors[passwordStrength] : "bg-slate-200")} />
                    ))}
                  </div>
                  <span className={cn("text-xs font-medium", passwordStrength === 1 ? "text-red-600" : passwordStrength === 2 ? "text-amber-600" : "text-emerald-600")}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>
          </FormRow>
          <FormRow label="Confirm Password">
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          </FormRow>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
            Update Password
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
        <div className="flex items-center gap-4">
          <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          <div>
            <p className="text-sm font-medium text-slate-900">{twoFactor ? "Enabled" : "Disabled"}</p>
            <p className="text-xs text-slate-500">
              {twoFactor ? "Your account is protected with 2FA" : "Enable to require a verification code on each login"}
            </p>
          </div>
        </div>
        {twoFactor && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Shield className="w-4 h-4" />
              <span className="font-medium">2FA is active.</span>
              <span>Use your authenticator app to generate codes.</span>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Active Sessions" description="Manage devices where you're currently logged in">
        <div className="space-y-3">
          {[
            { device: "Chrome on MacOS", location: "Lagos, Nigeria", time: "Current session", current: true },
            { device: "Safari on iPhone", location: "Lagos, Nigeria", time: "2 hours ago", current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-[#efefef] p-3">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{session.device}</p>
                  <p className="text-xs text-slate-500">{session.location} &middot; {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">Current</span>
              ) : (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState([
    { category: "Leave", items: [
      { id: "leave-status", label: "Leave request approved or rejected", email: true, push: true },
      { id: "leave-balance", label: "Low leave balance reminder", email: false, push: true },
    ]},
    { category: "Payroll", items: [
      { id: "payslip-ready", label: "New payslip available", email: true, push: true },
      { id: "salary-credit", label: "Salary credited to account", email: true, push: true },
    ]},
    { category: "Attendance", items: [
      { id: "clock-reminder", label: "Clock-in/out reminder", email: false, push: true },
      { id: "shift-change", label: "Shift schedule change", email: true, push: true },
      { id: "overtime-alert", label: "Overtime hours approaching limit", email: false, push: true },
    ]},
    { category: "Company", items: [
      { id: "announcement", label: "New company announcement", email: true, push: true },
      { id: "survey", label: "New survey to complete", email: true, push: false },
      { id: "event", label: "Upcoming company event", email: true, push: true },
    ]},
    { category: "Performance", items: [
      { id: "review-due", label: "Performance review due", email: true, push: true },
      { id: "goal-reminder", label: "Goal deadline approaching", email: false, push: true },
      { id: "feedback-request", label: "New feedback request", email: true, push: true },
    ]},
  ]);

  const toggleSetting = (catIndex: number, itemIndex: number, type: "email" | "push") => {
    const updated = [...settings];
    const item = { ...updated[catIndex].items[itemIndex] };
    item[type] = !item[type];
    updated[catIndex] = { ...updated[catIndex], items: [...updated[catIndex].items] };
    updated[catIndex].items[itemIndex] = item;
    setSettings(updated);
  };

  return (
    <div className="space-y-6">
      {settings.map((category, catIdx) => (
        <SectionCard key={category.category} title={category.category} description={`${category.category} notification preferences`}>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-xs font-medium text-slate-500 pb-2 border-b border-[#efefef]">
              <span>Notification</span>
              <span className="text-center">Email</span>
              <span className="text-center">Push</span>
            </div>
            {category.items.map((item, itemIdx) => (
              <div key={item.id} className="grid grid-cols-[1fr_60px_60px] gap-2 items-center">
                <span className="text-sm text-slate-700">{item.label}</span>
                <div className="flex justify-center">
                  <Toggle checked={item.email} onChange={() => toggleSetting(catIdx, itemIdx, "email")} />
                </div>
                <div className="flex justify-center">
                  <Toggle checked={item.push} onChange={() => toggleSetting(catIdx, itemIdx, "push")} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function DisplayTab() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [language, setLanguage] = useState("en-NG");

  return (
    <div className="space-y-6">
      <SectionCard title="Theme" description="Choose your preferred appearance">
        <div className="flex gap-3">
          {[
            { key: "light" as const, label: "Light", icon: Sun },
            { key: "dark" as const, label: "Dark", icon: Moon },
            { key: "system" as const, label: "System", icon: Monitor },
          ].map((opt) => {
            const Icon = opt.icon;
            return (
              <button key={opt.key} onClick={() => setTheme(opt.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-colors",
                  theme === opt.key
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-[#efefef] text-slate-600 hover:bg-[#f8fafc]"
                )}>
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Date & Language" description="Regional preferences">
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
        </div>
      </SectionCard>
    </div>
  );
}

function BankPaymentTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bankName: "Guaranty Trust Bank",
    accountNumber: "0123456789",
    accountName: "Adebayo Ogunlesi",
    bvn: "••••••••5678",
  });

  return (
    <div className="space-y-6">
      {saved && <Toast message="Bank details updated successfully" onDismiss={() => setSaved(false)} />}

      <SectionCard title="Salary Account" description="Bank account for salary payments. Changes require HR approval.">
        <div className="space-y-4">
          <FormRow label="Bank Name">
            <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          </FormRow>
          <FormRow label="Account Number">
            <Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
          </FormRow>
          <FormRow label="Account Name">
            <Input value={form.accountName} disabled className="bg-slate-50" />
          </FormRow>
          <FormRow label="BVN">
            <Input value={form.bvn} disabled className="bg-slate-50" />
          </FormRow>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Request Update</Button>
        </div>
      </SectionCard>

      <SectionCard title="Payment Method" description="How you receive your salary">
        <div className="flex items-center justify-between rounded-lg border border-[#efefef] p-3">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">Bank Transfer</p>
              <p className="text-xs text-slate-500">GTBank &middot; ****6789</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">Primary</span>
        </div>
      </SectionCard>
    </div>
  );
}

function PrivacyTab() {
  const [showInDirectory, setShowInDirectory] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showBirthday, setShowBirthday] = useState(true);

  return (
    <div className="space-y-6">
      <SectionCard title="Profile Visibility" description="Control what colleagues can see in the employee directory">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Show in Directory</p>
              <p className="text-xs text-slate-500">Allow colleagues to find you in the employee directory</p>
            </div>
            <Toggle checked={showInDirectory} onChange={() => setShowInDirectory(!showInDirectory)} />
          </div>
          <div className="border-t border-[#efefef] pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700">Phone Number</p>
                <p className="text-xs text-slate-500">Show your phone number to colleagues</p>
              </div>
              <Toggle checked={showPhone} onChange={() => setShowPhone(!showPhone)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700">Email Address</p>
                <p className="text-xs text-slate-500">Show your work email to colleagues</p>
              </div>
              <Toggle checked={showEmail} onChange={() => setShowEmail(!showEmail)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700">Birthday</p>
                <p className="text-xs text-slate-500">Show your birthday on the company calendar</p>
              </div>
              <Toggle checked={showBirthday} onChange={() => setShowBirthday(!showBirthday)} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Data & Privacy" description="Manage your personal data">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[#efefef] p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Download My Data</p>
              <p className="text-xs text-slate-500">Get a copy of all your personal data stored in the system</p>
            </div>
            <Button variant="outline" size="sm">Request Export</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function DevicesTab() {
  const devices = [
    { id: "dev-1", name: "Chrome on MacOS", type: "Desktop", location: "Lagos, Nigeria", ip: "192.168.1.45", lastActive: "Now (current session)", isCurrent: true },
    { id: "dev-2", name: "Safari on iPhone 15", type: "Mobile", location: "Lagos, Nigeria", ip: "192.168.1.78", lastActive: "2 hours ago", isCurrent: false },
    { id: "dev-3", name: "SabiHR Mobile App", type: "Mobile", location: "Lagos, Nigeria", ip: "10.0.0.5", lastActive: "Yesterday, 6:30 PM", isCurrent: false },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Connected Devices" description="Devices and browsers where your account is currently active">
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between rounded-lg border border-[#efefef] p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  device.isCurrent ? "bg-blue-50" : "bg-slate-50"
                )}>
                  {device.type === "Desktop" ? (
                    <Monitor className={cn("w-5 h-5", device.isCurrent ? "text-blue-600" : "text-slate-400")} />
                  ) : (
                    <Smartphone className={cn("w-5 h-5", device.isCurrent ? "text-blue-600" : "text-slate-400")} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{device.name}</p>
                    {device.isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{device.location} &middot; {device.ip} &middot; {device.lastActive}</p>
                </div>
              </div>
              {!device.isCurrent && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out All Other Devices
        </Button>
      </div>
    </div>
  );
}

// ─── Main Employee Settings Page ───

export default function EmployeeSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account preferences, security, and notifications</p>
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
      {activeTab === "profile" && <ProfileSettingsTab />}
      {activeTab === "security" && <PasswordSecurityTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "display" && <DisplayTab />}
      {activeTab === "bank" && <BankPaymentTab />}
      {activeTab === "privacy" && <PrivacyTab />}
      {activeTab === "devices" && <DevicesTab />}
    </div>
  );
}
