import { useState } from "react";
import { X } from "lucide-react";
import {
  BasicDetailsCard,
  ContactInfoCard,
  EmergencyContactsCard,
  FamilyDependentsCard,
} from "./profile-setup-cards";
import { DocumentUploadPrompt } from "./document-upload-prompt";

export function CompleteProfileSection() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Complete your profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the sections below to finish setting up your account
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-[#f8fafc] transition-colors shrink-0 -mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <BasicDetailsCard />
        <ContactInfoCard />
        <EmergencyContactsCard />
        <FamilyDependentsCard />
        <DocumentUploadPrompt />
      </div>
    </div>
  );
}
