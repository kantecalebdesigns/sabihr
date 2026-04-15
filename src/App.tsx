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
import DepartmentCreatePage from "@/pages/department-create";
import DepartmentDetailPage from "@/pages/department-detail";
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
import EmployeeAttendancePage from "@/pages/employee-attendance";
import EmployeeLeavePage from "@/pages/employee-leave";
import EmployeeAnnouncementsPage from "@/pages/employee-announcements";
import EmployeeSurveysPage from "@/pages/employee-surveys";
import EmployeeRequisitionsPage from "@/pages/employee-requisitions";
import EmployeeDisciplinaryPage from "@/pages/employee-disciplinary";
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
// Loans
import LoansPage from "@/pages/loans";
import LoanApplyPage from "@/pages/loan-apply";
import LoanDetailPage from "@/pages/loan-detail";
// Benefits
import BenefitsPage from "@/pages/benefits";
import BenefitsEnrollmentsPage from "@/pages/benefits-enrollments";
import EmployeeBenefitsPage from "@/pages/employee-benefits";
// Pay Grades & Payroll Roster
import PayGradesPage from "@/pages/pay-grades";
import PayrollRosterPage from "@/pages/payroll-roster";
// Performance Management
import PerformancePage from "@/pages/performance";
import PerformanceGoalsPage from "@/pages/performance-goals";
import PerformanceReviewsPage from "@/pages/performance-reviews";
import PerformanceReviewDetailPage from "@/pages/performance-review-detail";
import Performance360Page from "@/pages/performance-360";
import PerformanceOkrsPage from "@/pages/performance-okrs";
import PerformanceBalancedScorecardPage from "@/pages/performance-balanced-scorecard";
import EmployeePerformancePage from "@/pages/employee-performance";
// Announcements & Surveys
import AnnouncementsPage from "@/pages/announcements";
import AnnouncementCreatePage from "@/pages/announcement-create";
import AnnouncementDetailPage from "@/pages/announcement-detail";
import SurveysPage from "@/pages/surveys";
import SurveyResultsPage from "@/pages/survey-results";
import SurveyCreatePage from "@/pages/survey-create";
// Requisitions
import RequisitionsPage from "@/pages/requisitions";
import RequisitionDetailPage from "@/pages/requisition-detail";
// Disciplinary
import DisciplinaryPage from "@/pages/disciplinary";
import DisciplinaryCaseDetailPage from "@/pages/disciplinary-case-detail";
// Work Schedules
import WorkSchedulesPage from "@/pages/work-schedules";
import EmployeeWorkSchedulePage from "@/pages/employee-work-schedule";
// Attendance Extended — Admin
import AttendanceGeofencingPage from "@/pages/attendance-geofencing";
import AttendanceManualEntryPage from "@/pages/attendance-manual-entry";
import AttendanceCorrectionsPage from "@/pages/attendance-corrections";
import AttendanceDepartmentPage from "@/pages/attendance-department";
import AttendanceDailyReportPage from "@/pages/attendance-daily-report";
import AttendanceMonthlyReportPage from "@/pages/attendance-monthly-report";
import AttendanceAnalyticsPage from "@/pages/attendance-analytics";
import AttendanceAnomaliesPage from "@/pages/attendance-anomalies";
import AttendanceWorkHoursPage from "@/pages/attendance-work-hours";
import AttendanceOvertimePage from "@/pages/attendance-overtime";
import AttendanceBreaksPage from "@/pages/attendance-breaks";
import AttendancePayrollSyncPage from "@/pages/attendance-payroll-sync";
import AttendanceDeductionPreviewPage from "@/pages/attendance-deduction-preview";
import AttendanceOvertimePreviewPage from "@/pages/attendance-overtime-preview";
import AttendanceLeaveReconciliationPage from "@/pages/attendance-leave-reconciliation";
// Shift Management — Admin
import ShiftConfigPage from "@/pages/shift-config";
import ShiftRosterPage from "@/pages/shift-roster";
import ShiftSwapQueuePage from "@/pages/shift-swap-queue";
import ShiftCalendarPage from "@/pages/shift-calendar";
import ShiftAllowancePage from "@/pages/shift-allowance";
// Employee Attendance & Clock-In
import EmployeeClockInPage from "@/pages/employee-clock-in";
import EmployeeAttendanceDashboardPage from "@/pages/employee-attendance-dashboard";
import EmployeeAttendanceHistoryPage from "@/pages/employee-attendance-history";
import EmployeeAttendanceCorrectionPage from "@/pages/employee-attendance-correction";
import EmployeeWorkHoursPage from "@/pages/employee-work-hours";
import EmployeeShiftSchedulePage from "@/pages/employee-shift-schedule";
import EmployeeShiftSwapPage from "@/pages/employee-shift-swap";
import EmployeeShiftChangePage from "@/pages/employee-shift-change";
// Employee Mobile — Attendance
import EmployeeMobileClockInPage from "@/pages/employee-mobile-clock-in";
import EmployeeMobileAttendancePage from "@/pages/employee-mobile-attendance";
import EmployeeMobileShiftPage from "@/pages/employee-mobile-shift";
// Exit Management
import ExitPage from "@/pages/exit";
import ExitDetailPage from "@/pages/exit-detail";
import ExitInitiatePage from "@/pages/exit-initiate";
// Settings
import SettingsPage from "@/pages/settings";
import EmployeeSettingsPage from "@/pages/employee-settings";
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
          <Route path="/departments/create" element={<DepartmentCreatePage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/geofencing" element={<AttendanceGeofencingPage />} />
          <Route path="/attendance/manual-entry" element={<AttendanceManualEntryPage />} />
          <Route path="/attendance/corrections" element={<AttendanceCorrectionsPage />} />
          <Route path="/attendance/department" element={<AttendanceDepartmentPage />} />
          <Route path="/attendance/daily-report" element={<AttendanceDailyReportPage />} />
          <Route path="/attendance/monthly-report" element={<AttendanceMonthlyReportPage />} />
          <Route path="/attendance/analytics" element={<AttendanceAnalyticsPage />} />
          <Route path="/attendance/anomalies" element={<AttendanceAnomaliesPage />} />
          <Route path="/attendance/work-hours" element={<AttendanceWorkHoursPage />} />
          <Route path="/attendance/overtime" element={<AttendanceOvertimePage />} />
          <Route path="/attendance/breaks" element={<AttendanceBreaksPage />} />
          <Route path="/attendance/payroll-sync" element={<AttendancePayrollSyncPage />} />
          <Route path="/attendance/deduction-preview" element={<AttendanceDeductionPreviewPage />} />
          <Route path="/attendance/overtime-preview" element={<AttendanceOvertimePreviewPage />} />
          <Route path="/attendance/leave-reconciliation" element={<AttendanceLeaveReconciliationPage />} />
          <Route path="/shifts" element={<ShiftConfigPage />} />
          <Route path="/shifts/roster" element={<ShiftRosterPage />} />
          <Route path="/shifts/swap-queue" element={<ShiftSwapQueuePage />} />
          <Route path="/shifts/calendar" element={<ShiftCalendarPage />} />
          <Route path="/shifts/allowance" element={<ShiftAllowancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/schedules" element={<WorkSchedulesPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/payroll/config" element={<PayrollConfigPage />} />
          <Route path="/payroll/compliance" element={<StatutoryCompliancePage />} />
          <Route path="/payroll/payslips" element={<PayslipManagementPage />} />
          <Route path="/payroll/disbursement" element={<PaymentDisbursementPage />} />
          <Route path="/payroll/remittance" element={<StatutoryRemittancePage />} />
          <Route path="/payroll/global" element={<CrossBorderPayrollPage />} />
          <Route path="/payroll/reports" element={<PayrollReportsPage />} />
          <Route path="/payroll/audit" element={<PayrollAuditPage />} />
          <Route path="/payroll/pay-grades" element={<PayGradesPage />} />
          <Route path="/payroll/roster" element={<PayrollRosterPage />} />
          {/* Loans */}
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/loans/apply" element={<LoanApplyPage />} />
          <Route path="/loans/:id" element={<LoanDetailPage />} />
          {/* Benefits */}
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/benefits/enrollments" element={<BenefitsEnrollmentsPage />} />
          {/* Performance Management */}
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/performance/goals" element={<PerformanceGoalsPage />} />
          <Route path="/performance/reviews" element={<PerformanceReviewsPage />} />
          <Route path="/performance/reviews/:id" element={<PerformanceReviewDetailPage />} />
          <Route path="/performance/360/:id" element={<Performance360Page />} />
          <Route path="/performance/okrs" element={<PerformanceOkrsPage />} />
          <Route path="/performance/balanced-scorecard" element={<PerformanceBalancedScorecardPage />} />
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
          {/* Announcements */}
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/announcements/create" element={<AnnouncementCreatePage />} />
          <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
          {/* Surveys */}
          <Route path="/surveys" element={<SurveysPage />} />
          <Route path="/surveys/create" element={<SurveyCreatePage />} />
          <Route path="/surveys/:id/results" element={<SurveyResultsPage />} />
          {/* Requisitions */}
          <Route path="/requisitions" element={<RequisitionsPage />} />
          <Route path="/requisitions/:id" element={<RequisitionDetailPage />} />
          {/* Disciplinary */}
          <Route path="/disciplinary" element={<DisciplinaryPage />} />
          <Route path="/disciplinary/cases/:id" element={<DisciplinaryCaseDetailPage />} />
          {/* Exit Management */}
          <Route path="/exit" element={<ExitPage />} />
          <Route path="/exit/:id" element={<ExitDetailPage />} />
          <Route path="/exit/initiate" element={<ExitInitiatePage />} />
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
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
          <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
          <Route path="/employee/attendance/dashboard" element={<EmployeeAttendanceDashboardPage />} />
          <Route path="/employee/attendance/history" element={<EmployeeAttendanceHistoryPage />} />
          <Route path="/employee/attendance/correction" element={<EmployeeAttendanceCorrectionPage />} />
          <Route path="/employee/clock-in" element={<EmployeeClockInPage />} />
          <Route path="/employee/work-hours" element={<EmployeeWorkHoursPage />} />
          <Route path="/employee/shifts" element={<EmployeeShiftSchedulePage />} />
          <Route path="/employee/shifts/swap" element={<EmployeeShiftSwapPage />} />
          <Route path="/employee/shifts/change" element={<EmployeeShiftChangePage />} />
          <Route path="/employee/mobile/clock-in" element={<EmployeeMobileClockInPage />} />
          <Route path="/employee/mobile/attendance" element={<EmployeeMobileAttendancePage />} />
          <Route path="/employee/mobile/shift" element={<EmployeeMobileShiftPage />} />
          <Route path="/employee/leave" element={<EmployeeLeavePage />} />
          <Route path="/employee/schedule" element={<EmployeeWorkSchedulePage />} />
          <Route path="/employee/announcements" element={<EmployeeAnnouncementsPage />} />
          <Route path="/employee/surveys" element={<EmployeeSurveysPage />} />
          <Route path="/employee/requisitions" element={<EmployeeRequisitionsPage />} />
          <Route path="/employee/disciplinary" element={<EmployeeDisciplinaryPage />} />
          <Route path="/employee/performance" element={<EmployeePerformancePage />} />
          <Route path="/employee/benefits" element={<EmployeeBenefitsPage />} />
          {/* Employee Assets */}
          <Route path="/employee/assets" element={<EmployeeAssetsPage />} />
          <Route path="/employee/assets/:id" element={<EmployeeAssetDetailPage />} />
          <Route path="/employee/assets/request" element={<EmployeeAssetRequestPage />} />
          <Route path="/employee/assets/report-issue" element={<EmployeeAssetReportIssuePage />} />
          <Route path="/employee/assets/return" element={<EmployeeAssetReturnPage />} />
          {/* Employee Settings */}
          <Route path="/employee/settings" element={<EmployeeSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
