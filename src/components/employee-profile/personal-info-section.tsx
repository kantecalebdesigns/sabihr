import { useState } from "react";
import { Pencil, AlertTriangle, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";
import { EditRequestModal } from "./edit-request-modal";
import type { EmployeeDocument } from "@/types/employee";

interface PersonalInfoSectionProps {
  view?: "personal" | "documents";
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function getExpiryStatus(doc: EmployeeDocument): { label: string; className: string; urgent: boolean } | null {
  if (!doc.expiryDate) return null;
  const expiry = new Date(doc.expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/20", urgent: true };
  }
  if (daysUntilExpiry <= 30) {
    return { label: `${daysUntilExpiry}d left`, className: "bg-destructive/10 text-destructive border-destructive/20", urgent: true };
  }
  if (daysUntilExpiry <= 90) {
    return { label: `${daysUntilExpiry}d left`, className: "bg-amber-100 text-amber-700 border-amber-200", urgent: false };
  }
  return null;
}

const STATUS_ICON = {
  verified: { icon: CheckCircle2, color: "text-success" },
  uploaded: { icon: Clock, color: "text-amber-600" },
  rejected: { icon: XCircle, color: "text-destructive" },
};

export function PersonalInfoSection({ view = "personal" }: PersonalInfoSectionProps) {
  const employee = MOCK_EMPLOYEE_PROFILE;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("");

  function openEdit(section: string) {
    setEditSection(section);
    setEditModalOpen(true);
  }

  if (view === "documents") {
    const alertDocs = employee.documents.filter((doc) => getExpiryStatus(doc));

    return (
      <>
        {/* Expiry Alert Banner */}
        {alertDocs.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {alertDocs.length} document{alertDocs.length > 1 ? "s" : ""} need{alertDocs.length === 1 ? "s" : ""} attention
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Some documents are expiring soon or have already expired. Please upload renewed copies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Uploaded Documents</CardTitle>
              <Badge variant="outline" className="text-xs">
                {employee.documents.length} document{employee.documents.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.documents.map((doc) => {
                const expiryStatus = getExpiryStatus(doc);
                const statusConfig = STATUS_ICON[doc.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      expiryStatus?.urgent
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    {/* Document icon with status */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card flex items-center justify-center border border-border">
                        <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">{doc.fileName}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-xs text-muted-foreground">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Right: Expiry + Status */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={
                          doc.status === "verified"
                            ? "bg-success/10 text-success border-success/20"
                            : doc.status === "rejected"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                        }
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                      {doc.expiryDate && (
                        <span className={`text-[11px] ${expiryStatus ? (expiryStatus.urgent ? "text-destructive font-medium" : "text-amber-600 font-medium") : "text-muted-foreground"}`}>
                          {expiryStatus
                            ? expiryStatus.label
                            : `Expires ${new Date(doc.expiryDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}`
                          }
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <EditRequestModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          section={editSection}
        />
      </>
    );
  }

  // Default: personal view
  return (
    <>
      {/* Basic Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Basic Details</CardTitle>
            <Button variant="outline" size="sm" onClick={() => openEdit("Basic Details")}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Request Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6">
            <InfoItem label="First Name" value={employee.basicDetails.firstName} />
            <InfoItem label="Middle Name" value={employee.basicDetails.middleName} />
            <InfoItem label="Last Name" value={employee.basicDetails.lastName} />
            <InfoItem label="Date of Birth" value={new Date(employee.basicDetails.dateOfBirth).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })} />
            <InfoItem label="Gender" value={employee.basicDetails.gender.charAt(0).toUpperCase() + employee.basicDetails.gender.slice(1)} />
            <InfoItem label="Marital Status" value={employee.basicDetails.maritalStatus.charAt(0).toUpperCase() + employee.basicDetails.maritalStatus.slice(1)} />
            <InfoItem label="Nationality" value={employee.basicDetails.nationality} />
            <InfoItem label="State of Origin" value={employee.basicDetails.stateOfOrigin} />
          </div>

          {/* Statutory Identification Numbers */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Statutory Identification Numbers
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6">
              <InfoItem label="NIN" value={employee.basicDetails.nin} />
              <InfoItem label="Tax ID (TIN)" value={employee.basicDetails.taxId} />
              <InfoItem label="Pension ID (PenCom)" value={employee.basicDetails.pensionId} />
              <InfoItem label="BVN" value={employee.basicDetails.bvn} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Contact Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => openEdit("Contact Information")}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Request Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
            <InfoItem label="Personal Email" value={employee.contactInfo.personalEmail} />
            <InfoItem label="Work Email" value={employee.contactInfo.workEmail} />
            <InfoItem label="Phone" value={employee.contactInfo.phone} />
            <InfoItem label="Alternate Phone" value={employee.contactInfo.alternatePhone} />
            <InfoItem label="Address" value={employee.contactInfo.address} />
            <InfoItem label="City / State" value={`${employee.contactInfo.city}, ${employee.contactInfo.state}`} />
            <InfoItem label="Country" value={employee.contactInfo.country} />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts & Family side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Emergency Contacts</CardTitle>
              <Button variant="outline" size="sm" onClick={() => openEdit("Emergency Contacts")}>
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Request Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <Badge variant="outline" className="text-[10px]">{contact.relationship}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family & Dependents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Family &amp; Dependents</CardTitle>
              <Button variant="outline" size="sm" onClick={() => openEdit("Family & Dependents")}>
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Request Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {employee.familyDependents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No dependents on record.</p>
            ) : (
              <div className="space-y-3">
                {employee.familyDependents.map((dep) => (
                  <div key={dep.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-violet-700">
                        {dep.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{dep.name}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {dep.relationship.charAt(0).toUpperCase() + dep.relationship.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {dep.gender ? `${dep.gender.charAt(0).toUpperCase() + dep.gender.slice(1)} · ` : ""}
                        Born {new Date(dep.dateOfBirth).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EditRequestModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        section={editSection}
      />
    </>
  );
}
