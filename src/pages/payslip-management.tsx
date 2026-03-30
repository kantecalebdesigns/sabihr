import { useState } from "react";
import {
  Download,
  FileText,
  Printer,
  Send,
  Shield,
  Layout,
  Package,
  Mail,
  Lock,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYSLIP_TEMPLATES,
  MOCK_PAYSLIP_BATCHES,
  MOCK_DISTRIBUTIONS,
  MOCK_SECURITY_CONFIG,
  TEMPLATE_STATUS_STYLES,
  BATCH_STATUS_STYLES,
  DISTRIBUTION_STATUS_STYLES,
} from "@/lib/payslip-management-data";

type Tab = "templates" | "batches" | "distribution" | "security";

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: "templates", label: "Template Designer", icon: Layout },
  { key: "batches", label: "Batch Processing", icon: Package },
  { key: "distribution", label: "Distribution", icon: Send },
  { key: "security", label: "Security Settings", icon: Lock },
];

export default function PayslipManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("templates");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payslip Management</h1>
          <p className="text-sm text-muted-foreground">Design templates, generate, and distribute payslips</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert("Payslip data exported successfully.")}><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "batches" && <BatchesTab />}
      {activeTab === "distribution" && <DistributionTab />}
      {activeTab === "security" && <SecurityTab />}
    </div>
  );
}

function TemplatesTab() {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{MOCK_PAYSLIP_TEMPLATES.length} templates configured</p>
        <Button size="sm" onClick={() => alert("New payslip template designer would open here.")}><Plus className="w-4 h-4 mr-2" />New Template</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PAYSLIP_TEMPLATES.map((tpl) => {
          const style = TEMPLATE_STATUS_STYLES[tpl.status];
          return (
            <div key={tpl.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layout className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {tpl.isDefault && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 border-blue-200 text-blue-700">Default</span>}
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
                </div>
              </div>
              <h3 className="font-medium mb-1">{tpl.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{tpl.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Layout: <span className="font-medium text-foreground capitalize">{tpl.layout}</span></div>
                <div>Watermark: <span className="font-medium text-foreground">{tpl.watermark ? "Yes" : "No"}</span></div>
                <div>YTD Totals: <span className="font-medium text-foreground">{tpl.showYtdTotals ? "Yes" : "No"}</span></div>
                <div>QR Code: <span className="font-medium text-foreground">{tpl.showQrCode ? "Yes" : "No"}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => alert("Previewing template: " + tpl.name)}><Eye className="w-3.5 h-3.5 mr-1" />Preview</Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => alert("Editing template: " + tpl.name)}><FileText className="w-3.5 h-3.5 mr-1" />Edit</Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function BatchesTab() {
  const [batches, setBatches] = useState(MOCK_PAYSLIP_BATCHES);

  const handleGenerate = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "generating" as const } : b))
    );
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? { ...b, status: "completed" as const, generated: b.totalPayslips, generatedAt: new Date().toISOString() }
            : b
        )
      );
    }, 1500);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Package} label="Total Batches" value={String(batches.length)} />
        <SummaryCard icon={FileText} label="Total Payslips" value={String(batches.reduce((s, b) => s + b.totalPayslips, 0))} />
        <SummaryCard icon={Printer} label="Generated" value={String(batches.filter((b) => b.status === "completed").length)} />
        <SummaryCard icon={Shield} label="Pending" value={String(batches.filter((b) => b.status === "pending").length)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Template</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Generated</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Failed</th>
              <th className="p-3 text-left font-medium text-muted-foreground">File Size</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Generated By</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => {
              const style = BATCH_STATUS_STYLES[batch.status];
              return (
                <tr key={batch.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{batch.period}</td>
                  <td className="p-3 text-muted-foreground">{batch.templateName}</td>
                  <td className="p-3">{batch.totalPayslips}</td>
                  <td className="p-3">{batch.generated}</td>
                  <td className={cn("p-3", batch.failed > 0 ? "text-red-600" : "")}>{batch.failed}</td>
                  <td className="p-3 text-muted-foreground">{batch.fileSize || "—"}</td>
                  <td className="p-3 text-muted-foreground">{batch.generatedBy}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span></td>
                  <td className="p-3">
                    {batch.status === "pending" && <Button size="sm" className="h-7 text-xs" onClick={() => handleGenerate(batch.id)}>Generate</Button>}
                    {batch.status === "generating" && <Button size="sm" className="h-7 text-xs" disabled>Generating...</Button>}
                    {batch.status === "completed" && <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => alert("Downloading payslip batch for " + batch.period + "...")}><Download className="w-3.5 h-3.5 mr-1" />Download</Button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DistributionTab() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Send} label="Total Distributions" value={String(MOCK_DISTRIBUTIONS.length)} />
        <SummaryCard icon={Mail} label="Email Sent" value={String(MOCK_DISTRIBUTIONS.filter((d) => d.channel === "email" && d.status === "completed").reduce((s, d) => s + d.delivered, 0))} />
        <SummaryCard icon={Shield} label="Completed" value={String(MOCK_DISTRIBUTIONS.filter((d) => d.status === "completed").length)} />
        <SummaryCard icon={FileText} label="Scheduled" value={String(MOCK_DISTRIBUTIONS.filter((d) => d.status === "scheduled").length)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Channel</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Recipients</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Delivered</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Failed</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Scheduled</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Initiated By</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DISTRIBUTIONS.map((dist) => {
              const style = DISTRIBUTION_STATUS_STYLES[dist.status];
              return (
                <tr key={dist.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{dist.period}</td>
                  <td className="p-3 capitalize">{dist.channel}</td>
                  <td className="p-3">{dist.totalRecipients}</td>
                  <td className="p-3">{dist.delivered}</td>
                  <td className={cn("p-3", dist.failed > 0 ? "text-red-600" : "")}>{dist.failed}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(dist.scheduledAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="p-3 text-muted-foreground">{dist.initiatedBy}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SecurityTab() {
  const config = MOCK_SECURITY_CONFIG;

  return (
    <div className="max-w-[800px] space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><Lock className="w-4 h-4" />Payslip Security Settings</h3>
        <div className="space-y-4">
          {[
            { label: "Password Protection", value: config.passwordProtection ? "Enabled" : "Disabled", detail: config.passwordProtection ? `Method: ${config.passwordType === "dob" ? "Date of Birth" : config.passwordType}` : undefined },
            { label: "Watermark", value: config.watermarkEnabled ? "Enabled" : "Disabled", detail: config.watermarkEnabled ? `Text: "${config.watermarkText}"` : undefined },
            { label: "Download Limit", value: `${config.downloadLimit} downloads per payslip` },
            { label: "Expiry", value: `${config.expiryDays} days` },
            { label: "IP Restriction", value: config.ipRestriction ? "Enabled" : "Disabled" },
            { label: "Audit Trail", value: config.auditTrail ? "Enabled" : "Disabled" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
              </div>
              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", item.value.includes("Enabled") || item.value.includes("downloads") || item.value.includes("days") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-700")}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4"><Button variant="outline" size="sm" onClick={() => alert("Payslip security settings editor would open here.")}>Edit Settings</Button></div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-medium">{label}</span></div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

