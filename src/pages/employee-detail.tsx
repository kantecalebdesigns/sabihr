import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Palmtree, Clock, Edit } from "lucide-react";
import { EmploymentDetailHeader } from "@/components/admin-employee/employment-detail-header";
import { WorkLocationSection } from "@/components/admin-employee/work-location-section";
import { PayGradeSection } from "@/components/admin-employee/pay-grade-section";
import { ProbationTrackingSection } from "@/components/admin-employee/probation-tracking-section";
import { ContractDetailsSection } from "@/components/admin-employee/contract-details-section";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";
import type { EmployeeProfile, EmploymentInfo } from "@/types/employee";

export default function EmployeeDetailPage() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeProfile>(MOCK_EMPLOYEE_PROFILE);
  const [resetState, setResetState] = useState<"idle" | "confirm" | "success">("idle");

  function handleSave(updates: Partial<EmploymentInfo>) {
    setEmployee((prev) => ({
      ...prev,
      employment: { ...prev.employment, ...updates },
    }));
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <EmploymentDetailHeader employee={employee} onBack={() => navigate("/dashboard")} />

      {/* Admin Actions */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold">Admin Actions</h3>

        {resetState === "confirm" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <p className="text-sm text-amber-800">
              Send password reset email to <span className="font-semibold">{employee.basicDetails.firstName} {employee.basicDetails.lastName}</span>?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setResetState("success");
                  setTimeout(() => setResetState("idle"), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setResetState("idle")}
                className="px-3 py-1.5 rounded-lg border border-[#efefef] bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {resetState === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-800">Password reset email sent successfully.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setResetState("confirm")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#efefef] bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Reset Password
          </button>
          <Link
            to="/leave"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#efefef] bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Palmtree className="w-4 h-4" />
            Request Leave
          </Link>
          <Link
            to="/attendance"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#efefef] bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Clock In for Employee
          </Link>
          <Link
            to="/attendance/corrections"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#efefef] bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Submit Correction
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkLocationSection employment={employee.employment} onSave={handleSave} />
        <PayGradeSection employment={employee.employment} onSave={handleSave} />
        <ProbationTrackingSection employment={employee.employment} onSave={handleSave} />
        <ContractDetailsSection employment={employee.employment} onSave={handleSave} />
      </div>
    </div>
  );
}
