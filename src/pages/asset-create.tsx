import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Upload,
  FileText,
  X,
  Check,
  Package,
  DollarSign,
  Settings,
  Camera,
  Paperclip,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { MOCK_ASSET_CATEGORIES } from "@/lib/asset-mock-data";

type Section = "general" | "category" | "purchase" | "specs" | "photos" | "documents" | "review";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "general", label: "General Info", icon: <Package className="w-4 h-4" /> },
  { key: "category", label: "Category", icon: <Settings className="w-4 h-4" /> },
  { key: "purchase", label: "Purchase Details", icon: <DollarSign className="w-4 h-4" /> },
  { key: "specs", label: "Specifications", icon: <Settings className="w-4 h-4" /> },
  { key: "photos", label: "Photos", icon: <Camera className="w-4 h-4" /> },
  { key: "documents", label: "Documents", icon: <Paperclip className="w-4 h-4" /> },
  { key: "review", label: "Review", icon: <FileText className="w-4 h-4" /> },
];

interface CustomField {
  key: string;
  value: string;
}

export default function AssetCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Section>("general");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    tag: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    purchaseDate: "",
    purchasePrice: "",
    vendor: "",
    warrantyExpiry: "",
    warrantyProvider: "",
    model: "",
    serialNumber: "",
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { key: "", value: "" },
  ]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ name: string; type: string }[]>([]);

  const stepIndex = SECTIONS.findIndex((s) => s.key === step);

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedCategory = MOCK_ASSET_CATEGORIES.find(
    (c) => c.id === form.categoryId
  );

  const addCustomField = () =>
    setCustomFields((prev) => [...prev, { key: "", value: "" }]);

  const updateCustomField = (i: number, field: "key" | "value", val: string) =>
    setCustomFields((prev) =>
      prev.map((cf, idx) => (idx === i ? { ...cf, [field]: val } : cf))
    );

  const removeCustomField = (i: number) =>
    setCustomFields((prev) => prev.filter((_, idx) => idx !== i));

  const goNext = () => {
    if (stepIndex < SECTIONS.length - 1) setStep(SECTIONS[stepIndex + 1].key);
  };
  const goPrev = () => {
    if (stepIndex > 0) setStep(SECTIONS[stepIndex - 1].key);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(
        "asset-draft",
        JSON.stringify({ form, customFields, photos, documents, step })
      );
      setSaving(false);
      showToast("Draft saved successfully");
    }, 800);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      localStorage.removeItem("asset-draft");
      showToast("Asset created successfully");
      setTimeout(() => navigate("/assets"), 1000);
    }, 1200);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => navigate("/assets")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assets
        </button>
        <h1 className="text-xl font-semibold tracking-tight">Add New Asset</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to register a new asset
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              step === s.key
                ? "bg-primary text-primary-foreground"
                : i < stepIndex
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
              {i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section: General Info */}
      {step === "general" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Package className="w-4 h-4" /> General Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                placeholder="e.g. MacBook Pro 16&quot;"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tag">Asset Tag</Label>
              <Input
                id="tag"
                placeholder="e.g. SHR-LAP-001"
                value={form.tag}
                onChange={(e) => updateForm("tag", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Brief description of the asset..."
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
            />
          </div>
        </div>
      )}

      {/* Section: Category */}
      {step === "category" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" /> Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => {
                  updateForm("categoryId", v);
                  updateForm("subCategoryId", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ASSET_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sub-Category</Label>
              <Select
                value={form.subCategoryId}
                onValueChange={(v) => updateForm("subCategoryId", v)}
                disabled={!selectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subCategories.map((sc) => (
                    <SelectItem key={sc.id} value={sc.id}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedCategory && (
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
              <p>
                Default depreciation:{" "}
                <span className="font-medium text-foreground">
                  {selectedCategory.defaultDepreciationMethod}
                </span>
              </p>
              <p>
                Default useful life:{" "}
                <span className="font-medium text-foreground">
                  {selectedCategory.defaultUsefulLife} months
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section: Purchase */}
      {step === "purchase" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Purchase Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={(e) => updateForm("purchaseDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchasePrice">Purchase Price (NGN)</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="0"
                value={form.purchasePrice}
                onChange={(e) => updateForm("purchasePrice", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                placeholder="Vendor name"
                value={form.vendor}
                onChange={(e) => updateForm("vendor", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={form.warrantyExpiry}
                onChange={(e) => updateForm("warrantyExpiry", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="warrantyProvider">Warranty Provider</Label>
              <Input
                id="warrantyProvider"
                placeholder="e.g. Apple, Dell"
                value={form.warrantyProvider}
                onChange={(e) =>
                  updateForm("warrantyProvider", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Section: Specs */}
      {step === "specs" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" /> Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Model name/number"
                value={form.model}
                onChange={(e) => updateForm("model", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="Serial number"
                value={form.serialNumber}
                onChange={(e) => updateForm("serialNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Custom Fields</Label>
              <Button variant="outline" size="sm" onClick={addCustomField}>
                + Add Field
              </Button>
            </div>
            {customFields.map((cf, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="Field name"
                  value={cf.key}
                  onChange={(e) => updateCustomField(i, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={cf.value}
                  onChange={(e) =>
                    updateCustomField(i, "value", e.target.value)
                  }
                  className="flex-1"
                />
                <button
                  onClick={() => removeCustomField(i)}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Photos */}
      {step === "photos" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Camera className="w-4 h-4" /> Photo Upload
          </h2>
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            onClick={() => {
              setPhotos((prev) => [
                ...prev,
                `photo_${prev.length + 1}.jpg`,
              ]);
            }}
          >
            <div className="rounded-full p-3 bg-muted">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drag & drop photos here</p>
              <p className="text-xs text-muted-foreground">
                or <span className="text-primary font-medium underline underline-offset-2">browse files</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG up to 5MB each
            </p>
          </div>
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground"
                >
                  <Camera className="w-5 h-5" />
                  <button
                    onClick={() =>
                      setPhotos((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section: Documents */}
      {step === "documents" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Paperclip className="w-4 h-4" /> Document Attachments
          </h2>
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            onClick={() => {
              setDocuments((prev) => [
                ...prev,
                {
                  name: `document_${prev.length + 1}.pdf`,
                  type: "invoice",
                },
              ]);
            }}
          >
            <div className="rounded-full p-3 bg-muted">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Upload documents</p>
              <p className="text-xs text-muted-foreground">
                Invoices, warranties, manuals
              </p>
            </div>
          </div>
          {documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <FileText className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                  <button
                    onClick={() =>
                      setDocuments((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                    className="p-1 rounded hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section: Review */}
      {step === "review" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" /> Review & Submit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Asset Name</p>
                <p className="font-medium">{form.name || "--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Asset Tag</p>
                <p className="font-medium">{form.tag || "--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="font-medium">{form.description || "--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">
                  {selectedCategory?.name || "--"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Purchase Date</p>
                <p className="font-medium">{form.purchaseDate || "--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purchase Price</p>
                <p className="font-medium">
                  {form.purchasePrice ? `NGN ${Number(form.purchasePrice).toLocaleString()}` : "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendor</p>
                <p className="font-medium">{form.vendor || "--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Model / Serial</p>
                <p className="font-medium">
                  {form.model || "--"} / {form.serialNumber || "--"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Camera className="w-4 h-4" />
            {photos.length} photo(s) &middot;
            <Paperclip className="w-4 h-4" />
            {documents.length} document(s)
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={stepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {saving ? (
              <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          {step === "review" ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {submitting ? "Submitting..." : "Submit Asset"}
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {toast}
        </div>
      )}
    </div>
  );
}
