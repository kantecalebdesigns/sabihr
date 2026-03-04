import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  function handleSave(updates: Partial<EmploymentInfo>) {
    setEmployee((prev) => ({
      ...prev,
      employment: { ...prev.employment, ...updates },
    }));
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <EmploymentDetailHeader employee={employee} onBack={() => navigate("/dashboard")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkLocationSection employment={employee.employment} onSave={handleSave} />
        <PayGradeSection employment={employee.employment} onSave={handleSave} />
        <ProbationTrackingSection employment={employee.employment} onSave={handleSave} />
        <ContractDetailsSection employment={employee.employment} onSave={handleSave} />
      </div>
    </div>
  );
}
