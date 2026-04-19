import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ENROLLMENTS,
  MOCK_BENEFIT_PLANS,
  ENROLLMENT_STATUS_STYLES,
  formatBenefitCurrency,
} from "@/lib/benefits-mock-data";

const CURRENT_EMPLOYEE_ID = "emp-001";

export default function EmployeeBenefitsPage() {
  const myEnrollments = useMemo(
    () =>
      MOCK_ENROLLMENTS.filter((e) => e.employeeId === CURRENT_EMPLOYEE_ID),
    []
  );

  const enrolledPlanIds = useMemo(
    () => new Set(myEnrollments.map((e) => e.planId)),
    [myEnrollments]
  );

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Benefits</h1>
      </div>

      {/* Section 1: My Enrollments */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">My Enrollments</h2>
        {myEnrollments.length === 0 ? (
          <p className="text-sm text-slate-500">
            You are not enrolled in any benefit plans.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myEnrollments.map((enrollment) => {
              const style = ENROLLMENT_STATUS_STYLES[enrollment.status];
              return (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-[#efefef] bg-white p-4 space-y-2"
                >
                  <p className="font-medium">{enrollment.planName}</p>
                  <p className={cn("text-sm font-medium", style.color)}>
                    {style.label}
                  </p>
                  <p className="text-sm text-slate-500">
                    Start: {formatDate(enrollment.startDate)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Dependents: {enrollment.dependentsCovered}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Available Plans */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Available Plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_BENEFIT_PLANS.map((plan) => {
            const isEnrolled = enrolledPlanIds.has(plan.id);
            return (
              <div
                key={plan.id}
                className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3"
              >
                <p className="font-medium">{plan.name}</p>
                <p className="text-sm text-slate-500">
                  Provider: {plan.provider}
                </p>
                <p className="text-sm text-slate-500">
                  {plan.coverageSummary}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">
                    {formatBenefitCurrency(plan.employerContribution + plan.employeeContribution)}
                  </span>
                  <span className="text-slate-500">
                    /{plan.frequency === "monthly" ? "mo" : "yr"}
                  </span>
                </p>
                {isEnrolled ? (
                  <p className="text-sm font-medium text-emerald-700">
                    Enrolled
                  </p>
                ) : (
                  <Button size="sm" onClick={() => {}}>
                    Enroll
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
