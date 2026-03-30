import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import DashboardPage from "@/pages/dashboard";
import EmployeeListPage from "@/pages/employee-list";
import EmployeeCreatePage from "@/pages/employee-create";
import EmployeeDetailPage from "@/pages/employee-detail";
import DepartmentListPage from "@/pages/department-list";
import AttendancePage from "@/pages/attendance";
import LeavePage from "@/pages/leave";
import PayrollPage from "@/pages/payroll";
import PayrollConfigPage from "@/pages/payroll-config";
import StatutoryCompliancePage from "@/pages/statutory-compliance";
import PayslipManagementPage from "@/pages/payslip-management";
import PaymentDisbursementPage from "@/pages/payment-disbursement";
import StatutoryRemittancePage from "@/pages/statutory-remittance";
import CrossBorderPayrollPage from "@/pages/cross-border-payroll";
import PayrollReportsPage from "@/pages/payroll-reports";
import PayrollAuditPage from "@/pages/payroll-audit";
import OnboardingPage from "@/pages/onboarding";
import EmployeeOnboardingPage from "@/pages/employee-onboarding";
import EmployeeDashboardPage from "@/pages/employee-dashboard";
import EmployeeProfilePage from "@/pages/employee-profile";
import EmployeeDirectoryPage from "@/pages/employee-directory";
import EmployeeRedeploymentPage from "@/pages/employee-redeployment";
import EmployeeNotificationsPage from "@/pages/employee-notifications";
import EmployeePayslipsPage from "@/pages/employee-payslips";
import EmployeeTaxPage from "@/pages/employee-tax";
import EmployeePaymentsPage from "@/pages/employee-payments";
import EmployeeLoansPage from "@/pages/employee-loans";
import EmployeeWalletPage from "@/pages/employee-wallet";
import EmployeeMobilePayslipPage from "@/pages/employee-mobile-payslip";
import EmployeeMobileSalaryPage from "@/pages/employee-mobile-salary";
import EmployeeMobileWalletPage from "@/pages/employee-mobile-wallet";
import DocumentsPage from "@/pages/documents";
import DocumentTemplateBuilderPage from "@/pages/document-template-builder";
import DocumentTemplateDetailPage from "@/pages/document-template-detail";
import DocumentLibraryPage from "@/pages/document-library";
import EmployeeDocumentsPage from "@/pages/employee-documents";
// Asset Management - Admin
import AssetListPage from "@/pages/asset-list";
import AssetCreatePage from "@/pages/asset-create";
import AssetBulkUploadPage from "@/pages/asset-bulk-upload";
import AssetDetailPage from "@/pages/asset-detail";
import AssetAssignPage from "@/pages/asset-assign";
import AssetApprovalQueuePage from "@/pages/asset-approval-queue";
import AssetEmployeePortfolioPage from "@/pages/asset-employee-portfolio";
import AssetReturnQueuePage from "@/pages/asset-return-queue";
import AssetMaintenancePage from "@/pages/asset-maintenance";
import AssetDisposalPage from "@/pages/asset-disposal";
import AssetInventoryDashboardPage from "@/pages/asset-inventory-dashboard";
import AssetAssignmentReportPage from "@/pages/asset-assignment-report";
import AssetUtilizationPage from "@/pages/asset-utilization";
import AssetMissingReportPage from "@/pages/asset-missing-report";
import AssetDepreciationReportPage from "@/pages/asset-depreciation-report";
// Asset Management - Employee
import EmployeeAssetsPage from "@/pages/employee-assets";
import EmployeeAssetDetailPage from "@/pages/employee-asset-detail";
import EmployeeAssetRequestPage from "@/pages/employee-asset-request";
import EmployeeAssetReportIssuePage from "@/pages/employee-asset-report-issue";
import EmployeeAssetReturnPage from "@/pages/employee-asset-return";
import { AppLayout } from "@/components/layout/app-layout";
import { EmployeeLayout } from "@/components/layout/employee-layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Admin app shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/create" element={<EmployeeCreatePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/payroll/config" element={<PayrollConfigPage />} />
          <Route path="/payroll/compliance" element={<StatutoryCompliancePage />} />
          <Route path="/payroll/payslips" element={<PayslipManagementPage />} />
          <Route path="/payroll/disbursement" element={<PaymentDisbursementPage />} />
          <Route path="/payroll/remittance" element={<StatutoryRemittancePage />} />
          <Route path="/payroll/global" element={<CrossBorderPayrollPage />} />
          <Route path="/payroll/reports" element={<PayrollReportsPage />} />
          <Route path="/payroll/audit" element={<PayrollAuditPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/templates/new" element={<DocumentTemplateBuilderPage />} />
          <Route path="/documents/templates/:id" element={<DocumentTemplateBuilderPage />} />
          <Route path="/documents/templates/:id/view" element={<DocumentTemplateDetailPage />} />
          <Route path="/documents/library" element={<DocumentLibraryPage />} />
          {/* Asset Management */}
          <Route path="/assets" element={<AssetListPage />} />
          <Route path="/assets/create" element={<AssetCreatePage />} />
          <Route path="/assets/bulk-upload" element={<AssetBulkUploadPage />} />
          <Route path="/assets/:id" element={<AssetDetailPage />} />
          <Route path="/assets/assign" element={<AssetAssignPage />} />
          <Route path="/assets/approvals" element={<AssetApprovalQueuePage />} />
          <Route path="/assets/employee-portfolio/:id" element={<AssetEmployeePortfolioPage />} />
          <Route path="/assets/returns" element={<AssetReturnQueuePage />} />
          <Route path="/assets/maintenance" element={<AssetMaintenancePage />} />
          <Route path="/assets/disposal" element={<AssetDisposalPage />} />
          <Route path="/assets/reports/inventory" element={<AssetInventoryDashboardPage />} />
          <Route path="/assets/reports/assignments" element={<AssetAssignmentReportPage />} />
          <Route path="/assets/reports/utilization" element={<AssetUtilizationPage />} />
          <Route path="/assets/reports/missing" element={<AssetMissingReportPage />} />
          <Route path="/assets/reports/depreciation" element={<AssetDepreciationReportPage />} />
        </Route>

        {/* Employee onboarding (standalone, no layout) */}
        <Route path="/employee/onboarding" element={<EmployeeOnboardingPage />} />

        {/* Employee app shell */}
        <Route element={<EmployeeLayout />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
          <Route path="/employee/profile" element={<EmployeeProfilePage />} />
          <Route path="/employee/directory" element={<EmployeeDirectoryPage />} />
          <Route path="/employee/redeployment" element={<EmployeeRedeploymentPage />} />
          <Route path="/employee/notifications" element={<EmployeeNotificationsPage />} />
          <Route path="/employee/payslips" element={<EmployeePayslipsPage />} />
          <Route path="/employee/tax" element={<EmployeeTaxPage />} />
          <Route path="/employee/payments" element={<EmployeePaymentsPage />} />
          <Route path="/employee/loans" element={<EmployeeLoansPage />} />
          <Route path="/employee/wallet" element={<EmployeeWalletPage />} />
          <Route path="/employee/mobile/payslip" element={<EmployeeMobilePayslipPage />} />
          <Route path="/employee/mobile/salary" element={<EmployeeMobileSalaryPage />} />
          <Route path="/employee/mobile/wallet" element={<EmployeeMobileWalletPage />} />
          <Route path="/employee/documents" element={<EmployeeDocumentsPage />} />
          {/* Employee Assets */}
          <Route path="/employee/assets" element={<EmployeeAssetsPage />} />
          <Route path="/employee/assets/:id" element={<EmployeeAssetDetailPage />} />
          <Route path="/employee/assets/request" element={<EmployeeAssetRequestPage />} />
          <Route path="/employee/assets/report-issue" element={<EmployeeAssetReportIssuePage />} />
          <Route path="/employee/assets/return" element={<EmployeeAssetReturnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
