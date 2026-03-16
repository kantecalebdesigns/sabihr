import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

export interface DocumentFilters {
  documentType: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  uploadedBy: string;
  sensitivity: string;
}

const DEFAULT_FILTERS: DocumentFilters = {
  documentType: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
  uploadedBy: "",
  sensitivity: "all",
};

const DOCUMENT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "personal", label: "Personal" },
  { value: "employment", label: "Employment" },
  { value: "compliance", label: "Compliance" },
  { value: "financial", label: "Financial" },
  { value: "legal", label: "Legal" },
  { value: "training", label: "Training" },
];

const STATUSES = [
  { value: "all", label: "All" },
  { value: "uploaded", label: "Uploaded" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

const SENSITIVITIES = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "internal", label: "Internal" },
  { value: "confidential", label: "Confidential" },
  { value: "restricted", label: "Restricted" },
];

interface DocumentSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: DocumentFilters) => void;
}

export function DocumentSearchFilter({
  onSearch,
  onFilter,
}: DocumentSearchFilterProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DocumentFilters>(DEFAULT_FILTERS);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => {
      if (key === "dateFrom" || key === "dateTo" || key === "uploadedBy")
        return value !== "";
      return value !== "all";
    }
  ).length;

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  const updateFilter = useCallback(
    (key: keyof DocumentFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  }, [onFilter]);

  return (
    <div className="space-y-3">
      {/* Search bar row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative gap-2"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="size-5 p-0 text-[10px] justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Document Type */}
            <div className="space-y-1.5">
              <Label>Document Type</Label>
              <Select
                value={filters.documentType}
                onValueChange={(v) => updateFilter("documentType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(v) => updateFilter("status", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sensitivity */}
            <div className="space-y-1.5">
              <Label>Sensitivity</Label>
              <Select
                value={filters.sensitivity}
                onValueChange={(v) => updateFilter("sensitivity", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENSITIVITIES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <Label>Date From</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <Label>Date To</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
              />
            </div>

            {/* Uploaded By */}
            <div className="space-y-1.5">
              <Label>Uploaded By</Label>
              <Input
                placeholder="Enter name..."
                value={filters.uploadedBy}
                onChange={(e) => updateFilter("uploadedBy", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
