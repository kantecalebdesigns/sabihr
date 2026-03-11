import { RedeploymentForm } from "@/components/employee-self-service/redeployment-form";
import { RedeploymentTracker } from "@/components/employee-self-service/redeployment-tracker";

export default function EmployeeRedeploymentPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Redeployment</h1>
        <p className="text-sm text-muted-foreground">
          Request a transfer to a different department and track your requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RedeploymentForm inline />
        <RedeploymentTracker />
      </div>
    </div>
  );
}
