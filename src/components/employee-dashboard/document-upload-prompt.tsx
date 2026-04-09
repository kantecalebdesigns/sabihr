import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentType } from "@/types/employee";

interface RequiredDocument {
  type: DocumentType;
  label: string;
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { type: "school-cert", label: "School Certificate" },
  { type: "national-id", label: "National ID Card / NIN Slip" },
  { type: "birth-certificate", label: "Birth Certificate" },
  { type: "passport", label: "International Passport" },
  { type: "offer-letter", label: "Signed Offer Letter" },
];

const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export function DocumentUploadPrompt() {
  const [pending, setPending] = useState<RequiredDocument[]>(REQUIRED_DOCUMENTS);
  const [submittingType, setSubmittingType] = useState<DocumentType | null>(null);
  const [expanded, setExpanded] = useState(true);
  const fileInputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  const totalCount = REQUIRED_DOCUMENTS.length;
  const remainingCount = pending.length;
  const uploadedCount = totalCount - remainingCount;

  // All done — remove the whole card from the dashboard
  if (remainingCount === 0) return null;

  async function handleFileSelect(type: DocumentType, _file: File) {
    setSubmittingType(type);

    // Mock API upload
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Remove the submitted document from the list
    setPending((prev) => prev.filter((doc) => doc.type !== type));
    setSubmittingType(null);
  }

  const progressPercent = Math.round((uploadedCount / totalCount) * 100);

  return (
    <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="w-10 h-10 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Required Documents</h3>
            <span className="text-xs text-slate-500">
              {remainingCount} remaining
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Please upload the following documents to complete your profile setup.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-[#f8fafc] transition-colors shrink-0"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 sm:px-5 pb-3">
        <div className="h-1.5 w-full bg-[#f0f4f8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-blue-600"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Document list — only shows pending docs */}
      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-2">
          {pending.map((doc) => {
            const isSubmitting = submittingType === doc.type;

            return (
              <div
                key={doc.type}
                className="flex items-center gap-3 rounded-lg border border-[#efefef] bg-white px-3 py-2.5"
              >
                <div className="w-8 h-8 rounded-[8px] bg-[#f0f4f8] flex items-center justify-center shrink-0 text-slate-400">
                  <AlertCircle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{doc.label}</p>
                  <p className="text-xs text-slate-500">
                    PDF, JPG, PNG or DOC — max 5MB
                  </p>
                </div>

                <div className="shrink-0">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <input
                        ref={(el) => {
                          fileInputRefs.current.set(doc.type, el);
                        }}
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(doc.type, file);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current.get(doc.type)?.click()}
                        className="h-8 text-xs gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
