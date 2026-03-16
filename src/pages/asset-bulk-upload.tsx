import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Upload,
  Edit3,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DragDropUpload } from "@/components/documents/drag-drop-upload";

type Stage = "upload" | "processing" | "validation" | "preview" | "confirm";

interface ValidationRow {
  row: number;
  name: string;
  tag: string;
  category: string;
  status: "pass" | "fail";
  errors: string[];
}

const MOCK_VALIDATION: ValidationRow[] = [
  { row: 1, name: "Dell Latitude 5540", tag: "SHR-LAP-020", category: "Laptops", status: "pass", errors: [] },
  { row: 2, name: "HP Monitor 24\"", tag: "SHR-MON-015", category: "Monitors", status: "pass", errors: [] },
  { row: 3, name: "iPhone 14", tag: "", category: "Phones", status: "fail", errors: ["Asset tag is required"] },
  { row: 4, name: "", tag: "SHR-FRN-025", category: "Furniture", status: "fail", errors: ["Asset name is required"] },
  { row: 5, name: "Samsung Galaxy S24", tag: "SHR-PHN-010", category: "Phones", status: "pass", errors: [] },
  { row: 6, name: "Cisco Router 4431", tag: "SHR-NET-005", category: "Networking", status: "pass", errors: [] },
  { row: 7, name: "Standing Desk Pro", tag: "SHR-FRN-030", category: "Invalid Category", status: "fail", errors: ["Invalid category: 'Invalid Category'"] },
];

export default function AssetBulkUploadPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<ValidationRow[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setStage("processing");
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setValidationResults(MOCK_VALIDATION);
          setStage("validation");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const passCount = validationResults.filter((r) => r.status === "pass").length;
  const failCount = validationResults.filter((r) => r.status === "fail").length;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Bulk Asset Upload
        </h1>
        <p className="text-sm text-muted-foreground">
          Import multiple assets from a spreadsheet file
        </p>
      </div>

      {/* Template Download */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Download Template</p>
            <p className="text-xs text-muted-foreground">
              Use this template to ensure your data matches the required format
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Excel (.xlsx)
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Upload Stage */}
      {stage === "upload" && (
        <DragDropUpload
          onFilesSelected={handleFilesSelected}
          accept=".xlsx,.xls,.csv"
          maxFiles={1}
          multiple={false}
        />
      )}

      {/* Processing Stage */}
      {stage === "processing" && (
        <div className="rounded-xl border border-border bg-card p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm font-medium">Processing file...</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progress}% complete — Validating rows...
          </p>
        </div>
      )}

      {/* Validation Results */}
      {(stage === "validation" || stage === "preview") && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold">
                {validationResults.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Rows</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{passCount}</p>
              <p className="text-xs text-green-600">Passed</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{failCount}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
          </div>

          {/* Validation Table */}
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground w-16">
                    Row
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Tag
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Errors
                  </th>
                  {stage === "preview" && (
                    <th className="p-3 w-16"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {validationResults.map((row) => (
                  <tr
                    key={row.row}
                    className={cn(
                      "border-b border-border last:border-0",
                      row.status === "fail" && "bg-red-50/50"
                    )}
                  >
                    <td className="p-3 font-mono text-xs">{row.row}</td>
                    <td className="p-3">
                      {row.status === "pass" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </td>
                    <td className="p-3">
                      {editingRow === row.row ? (
                        <Input
                          defaultValue={row.name}
                          className="h-7 text-xs"
                          onBlur={() => setEditingRow(null)}
                        />
                      ) : (
                        <span
                          className={cn(!row.name && "text-red-500 italic")}
                        >
                          {row.name || "(empty)"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {editingRow === row.row ? (
                        <Input
                          defaultValue={row.tag}
                          className="h-7 text-xs"
                          onBlur={() => setEditingRow(null)}
                        />
                      ) : (
                        <span
                          className={cn(!row.tag && "text-red-500 italic")}
                        >
                          {row.tag || "(empty)"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{row.category}</td>
                    <td className="p-3">
                      {row.errors.length > 0 ? (
                        <div className="space-y-0.5">
                          {row.errors.map((err, i) => (
                            <p
                              key={i}
                              className="text-xs text-red-600 flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              {err}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-green-600">Valid</span>
                      )}
                    </td>
                    {stage === "preview" && (
                      <td className="p-3">
                        <button
                          onClick={() => setEditingRow(row.row)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setStage("upload");
                setValidationResults([]);
              }}
            >
              Upload Different File
            </Button>
            <div className="flex items-center gap-2">
              {stage === "validation" && (
                <Button onClick={() => setStage("preview")}>
                  Preview Assets
                </Button>
              )}
              {stage === "preview" && (
                <Button onClick={() => setConfirmOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import {passCount} Assets
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl border border-border bg-card p-6 w-full max-w-md space-y-4 shadow-xl mx-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Confirm Import</h3>
              <button
                onClick={() => setConfirmOpen(false)}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              You are about to import{" "}
              <span className="font-semibold text-foreground">
                {passCount} assets
              </span>{" "}
              into the register.
              {failCount > 0 && (
                <>
                  {" "}
                  <span className="text-red-600">{failCount} rows</span> with
                  errors will be skipped.
                </>
              )}
            </p>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  setStage("upload");
                  setValidationResults([]);
                }}
              >
                Confirm Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
