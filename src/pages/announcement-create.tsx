import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority } from "@/lib/announcements-mock-data";

type AudienceType = "all" | "departments" | "roles" | "specific";

interface AudienceState {
  type: AudienceType;
  departments: string[];
  roles: string[];
  employees: string[];
}

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Legal", "IT"];
const ROLES = ["Manager", "Team Lead", "Senior", "Junior", "Intern"];
const MOCK_EMPLOYEES = [
  { id: "emp-001", name: "Adebayo Ogunlesi", department: "Engineering" },
  { id: "emp-002", name: "Oluwaseun Afolabi", department: "Engineering" },
  { id: "emp-003", name: "Emeka Okafor", department: "Sales" },
  { id: "emp-004", name: "Fatima Abdullahi", department: "HR" },
  { id: "emp-005", name: "Bukola Adeyemi", department: "Marketing" },
  { id: "emp-006", name: "Aisha Mohammed", department: "Finance" },
  { id: "emp-007", name: "Ibrahim Musa", department: "Operations" },
  { id: "emp-008", name: "Halima Yusuf", department: "Legal" },
];

const DEPT_SIZE: Record<string, number> = {
  Engineering: 25,
  Sales: 18,
  Marketing: 12,
  Finance: 10,
  HR: 8,
  Operations: 15,
  Legal: 6,
  IT: 14,
};

const ROLE_SIZE: Record<string, number> = {
  Manager: 12,
  "Team Lead": 16,
  Senior: 30,
  Junior: 40,
  Intern: 10,
};

const TOTAL_EMPLOYEES = 108;

export default function AnnouncementCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [audience, setAudience] = useState<AudienceState>({
    type: "all",
    departments: [],
    roles: [],
    employees: [],
  });
  const [publishDate, setPublishDate] = useState("");
  const [pinned, setPinned] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!employeeSearch) return MOCK_EMPLOYEES;
    const q = employeeSearch.toLowerCase();
    return MOCK_EMPLOYEES.filter(
      (e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }, [employeeSearch]);

  const recipientCount = useMemo(() => {
    switch (audience.type) {
      case "all":
        return TOTAL_EMPLOYEES;
      case "departments":
        return audience.departments.reduce((sum, d) => sum + (DEPT_SIZE[d] || 0), 0);
      case "roles":
        return audience.roles.reduce((sum, r) => sum + (ROLE_SIZE[r] || 0), 0);
      case "specific":
        return audience.employees.length;
    }
  }, [audience]);

  const toggleDepartment = (dept: string) => {
    setAudience((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  const toggleRole = (role: string) => {
    setAudience((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const toggleEmployee = (empId: string) => {
    setAudience((prev) => ({
      ...prev,
      employees: prev.employees.includes(empId)
        ? prev.employees.filter((id) => id !== empId)
        : [...prev.employees, empId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/announcements"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Announcements
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Create Announcement</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5 max-w-2xl"
      >
        {submitted && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Check className="h-4 w-4" />
            Announcement created successfully.
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Write your announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Priority</label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audience Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Target Audience</label>
          <div className="flex flex-wrap gap-3">
            {([
              { value: "all" as AudienceType, label: "All Employees" },
              { value: "departments" as AudienceType, label: "By Department" },
              { value: "roles" as AudienceType, label: "By Role" },
              { value: "specific" as AudienceType, label: "Specific Employees" },
            ]).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="audienceType"
                  value={opt.value}
                  checked={audience.type === opt.value}
                  onChange={() => setAudience({ ...audience, type: opt.value, departments: [], roles: [], employees: [] })}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Department checkboxes */}
          {audience.type === "departments" && (
            <div className="rounded-lg border border-[#efefef] p-3 space-y-2">
              <p className="text-xs font-medium text-slate-500 mb-2">Select departments</p>
              <div className="grid grid-cols-2 gap-2">
                {DEPARTMENTS.map((dept) => (
                  <label key={dept} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={audience.departments.includes(dept)}
                      onChange={() => toggleDepartment(dept)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{dept}</span>
                    <span className="text-xs text-slate-400">({DEPT_SIZE[dept]})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Role checkboxes */}
          {audience.type === "roles" && (
            <div className="rounded-lg border border-[#efefef] p-3 space-y-2">
              <p className="text-xs font-medium text-slate-500 mb-2">Select roles</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={audience.roles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{role}</span>
                    <span className="text-xs text-slate-400">({ROLE_SIZE[role]})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Specific employees */}
          {audience.type === "specific" && (
            <div className="rounded-lg border border-[#efefef] p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredEmployees.map((emp) => (
                  <label key={emp.id} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={audience.employees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{emp.name}</span>
                    <span className="text-xs text-slate-400">{emp.department}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Recipient count */}
          <p className="text-xs text-slate-500">
            Estimated recipients: <span className="font-medium text-slate-700">{recipientCount}</span> employee{recipientCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="publishDate" className="text-sm font-medium">
            Publish Date
          </label>
          <Input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="pinned"
            checked={pinned}
            onCheckedChange={(v) => setPinned(v === true)}
          />
          <label htmlFor="pinned" className="text-sm">
            Pin this announcement
          </label>
        </div>

        <Button type="submit" disabled={submitted}>
          {submitted ? "Published" : "Publish Announcement"}
        </Button>
      </form>
    </div>
  );
}
