import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import DashboardPage from "@/pages/dashboard";
import EmployeeDetailPage from "@/pages/employee-detail";
import OnboardingPage from "@/pages/onboarding";
import EmployeeOnboardingPage from "@/pages/employee-onboarding";
import EmployeeDashboardPage from "@/pages/employee-dashboard";
import EmployeeProfilePage from "@/pages/employee-profile";
import EmployeeDirectoryPage from "@/pages/employee-directory";
import EmployeeRedeploymentPage from "@/pages/employee-redeployment";
import EmployeeNotificationsPage from "@/pages/employee-notifications";
import DocumentsPage from "@/pages/documents";
import DocumentTemplateBuilderPage from "@/pages/document-template-builder";
import DocumentTemplateDetailPage from "@/pages/document-template-detail";
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
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/templates/new" element={<DocumentTemplateBuilderPage />} />
          <Route path="/documents/templates/:id" element={<DocumentTemplateBuilderPage />} />
          <Route path="/documents/templates/:id/view" element={<DocumentTemplateDetailPage />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
