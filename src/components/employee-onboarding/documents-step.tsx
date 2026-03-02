import { Plus, Trash2, Upload, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/employee-mock-data";
import type { DocumentsData } from "@/types/employee-onboarding";
import type { EmployeeDocument, DocumentType } from "@/types/employee";
import type { ValidationErrors } from "@/lib/validators";
import { useRef } from "react";

interface Props {
  data: DocumentsData;
  errors: ValidationErrors<DocumentsData>;
  onChange: (updates: DocumentsData) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function createEmptyDocument(): EmployeeDocument {
  return {
    id: generateId(),
    type: "",
    name: "",
    fileName: "",
    uploadDate: "",
    expiryDate: "",
    status: "uploaded",
  };
}

export function DocumentsStep({ data, errors, onChange }: Props) {
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  function addDocument() {
    onChange({ documents: [...data.documents, createEmptyDocument()] });
  }

  function removeDocument(id: string) {
    onChange({ documents: data.documents.filter((d) => d.id !== id) });
  }

  function updateDocument(id: string, updates: Partial<EmployeeDocument>) {
    onChange({
      documents: data.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    });
  }

  function handleFileSelect(id: string, file: File) {
    const typeLabel = DOCUMENT_TYPE_OPTIONS.find(
      (opt) => opt.value === data.documents.find((d) => d.id === id)?.type
    )?.label;

    updateDocument(id, {
      fileName: file.name,
      name: typeLabel || file.name,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "uploaded",
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Documents</h3>
        <p className="text-sm text-muted-foreground">
          Upload copies of your important documents. At least one document is required.
          Add expiry dates for documents like passports and IDs so you get renewal reminders.
        </p>
      </div>

      {errors.documents && (
        <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {errors.documents}
        </div>
      )}

      {data.documents.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-3">No documents uploaded yet</p>
          <Button type="button" variant="outline" onClick={addDocument}>
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.documents.map((doc, index) => (
              <div
                key={doc.id}
                className="border border-border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Document {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeDocument(doc.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Document Type <span className="text-destructive">*</span></Label>
                    <Select
                      value={doc.type}
                      onValueChange={(v) => {
                        const label = DOCUMENT_TYPE_OPTIONS.find((opt) => opt.value === v)?.label || "";
                        updateDocument(doc.id, { type: v as DocumentType, name: label });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={doc.expiryDate}
                      onChange={(e) => updateDocument(doc.id, { expiryDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>File <span className="text-destructive">*</span></Label>
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current.set(doc.id, el);
                      }}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(doc.id, file);
                      }}
                    />
                    {doc.fileName ? (
                      <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/50">
                        {doc.status === "verified" ? (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm truncate flex-1">{doc.fileName}</span>
                        <button
                          type="button"
                          className="text-xs text-primary hover:text-primary/80"
                          onClick={() => fileInputRefs.current.get(doc.id)?.click()}
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRefs.current.get(doc.id)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addDocument} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Document
          </Button>
        </>
      )}
    </div>
  );
}
