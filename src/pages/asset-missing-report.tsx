import { useState } from "react";
import {
  AlertTriangle,
  Search,
  Flag,
  ClipboardList,
  MapPin,
  ShieldAlert,
  Plus,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS } from "@/lib/asset-mock-data";

interface InvestigationNote {
  id: string;
  assetId: string;
  note: string;
  author: string;
  date: string;
}

interface MissingAssetEntry {
  id: string;
  name: string;
  tag: string;
  lastLocation: string;
  lastAssignee: string;
  dateFlagged: string;
  investigationStatus: "open" | "in-progress" | "escalated" | "resolved";
}

const INVESTIGATION_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  "in-progress": { label: "In Progress", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  escalated: { label: "Escalated", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  resolved: { label: "Resolved", color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

const ESCALATION_RULES = [
  { day: "Day 1-3", action: "IT team performs initial investigation and checks tracking records." },
  { day: "Day 4-7", action: "Department head notified. Physical search of last-known location." },
  { day: "Day 8-14", action: "HR and Security involved. Formal incident report filed." },
  { day: "Day 15+", action: "Executive management notified. Insurance claim initiated if applicable." },
];

// Simulated missing asset data (since mock data may not have missing status)
const missingFromMock: MissingAssetEntry[] = MOCK_ASSETS.filter(
  (a) => a.status === "missing"
).map((a) => ({
  id: a.id,
  name: a.name,
  tag: a.tag,
  lastLocation: a.location,
  lastAssignee: a.assignedToName ?? "Unassigned",
  dateFlagged: a.updatedAt.split("T")[0],
  investigationStatus: "open" as const,
}));

// Add a simulated entry so the page is not empty
const INITIAL_MISSING: MissingAssetEntry[] =
  missingFromMock.length > 0
    ? missingFromMock
    : [
        {
          id: "missing-sim-1",
          name: "Dell Latitude 5540",
          tag: "SHR-LAP-099",
          lastLocation: "Abuja Office",
          lastAssignee: "Emeka Okafor",
          dateFlagged: "2026-03-05",
          investigationStatus: "in-progress",
        },
        {
          id: "missing-sim-2",
          name: "Samsung Galaxy Tab S9",
          tag: "SHR-TAB-003",
          lastLocation: "Lagos Office",
          lastAssignee: "Aisha Mohammed",
          dateFlagged: "2026-02-28",
          investigationStatus: "escalated",
        },
      ];

const INITIAL_NOTES: InvestigationNote[] = [
  {
    id: "note-1",
    assetId: INITIAL_MISSING[0]?.id ?? "",
    note: "Checked with last assignee. Claims device was left in meeting room B2.",
    author: "Amina Bello",
    date: "2026-03-06",
  },
  {
    id: "note-2",
    assetId: INITIAL_MISSING[0]?.id ?? "",
    note: "Meeting room B2 searched, device not found. Checking CCTV footage.",
    author: "Security Team",
    date: "2026-03-07",
  },
];

// Physical audit: expected vs actual per location
const AUDIT_DATA = [
  { location: "Lagos Office", expected: 7, actual: 6 },
  { location: "Abuja Office", expected: 2, actual: 1 },
  { location: "Server Room", expected: 1, actual: 1 },
];

export default function AssetMissingReport() {
  const [missingAssets, setMissingAssets] = useState<MissingAssetEntry[]>(INITIAL_MISSING);
  const [notes, setNotes] = useState<InvestigationNote[]>(INITIAL_NOTES);
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    INITIAL_MISSING[0]?.id ?? null
  );
  const [newNote, setNewNote] = useState("");

  // Flag form state
  const [flagName, setFlagName] = useState("");
  const [flagTag, setFlagTag] = useState("");
  const [flagLocation, setFlagLocation] = useState("");
  const [flagAssignee, setFlagAssignee] = useState("");

  const handleFlag = () => {
    if (!flagName.trim() || !flagTag.trim()) return;
    const entry: MissingAssetEntry = {
      id: `missing-${Date.now()}`,
      name: flagName,
      tag: flagTag,
      lastLocation: flagLocation || "Unknown",
      lastAssignee: flagAssignee || "Unknown",
      dateFlagged: new Date().toISOString().split("T")[0],
      investigationStatus: "open",
    };
    setMissingAssets((prev) => [entry, ...prev]);
    setFlagName("");
    setFlagTag("");
    setFlagLocation("");
    setFlagAssignee("");
    setShowFlagForm(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedAssetId) return;
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        assetId: selectedAssetId,
        note: newNote,
        author: "Current User",
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewNote("");
  };

  const selectedNotes = notes.filter((n) => n.assetId === selectedAssetId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Missing Assets Report</h1>
          <p className="text-sm text-muted-foreground">
            Track, investigate, and resolve missing asset cases.
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowFlagForm(!showFlagForm)}>
          {showFlagForm ? <X className="size-4" /> : <Flag className="size-4" />}
          {showFlagForm ? "Cancel" : "Flag as Missing"}
        </Button>
      </div>

      {/* Flag Form */}
      {showFlagForm && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Flag Asset as Missing</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="flag-name" className="text-sm">
                Asset Name
              </Label>
              <Input
                id="flag-name"
                placeholder="e.g. MacBook Pro 14"
                value={flagName}
                onChange={(e) => setFlagName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="flag-tag" className="text-sm">
                Asset Tag
              </Label>
              <Input
                id="flag-tag"
                placeholder="e.g. SHR-LAP-020"
                value={flagTag}
                onChange={(e) => setFlagTag(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="flag-location" className="text-sm">
                Last Known Location
              </Label>
              <Input
                id="flag-location"
                placeholder="e.g. Lagos Office"
                value={flagLocation}
                onChange={(e) => setFlagLocation(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="flag-assignee" className="text-sm">
                Last Assignee
              </Label>
              <Input
                id="flag-assignee"
                placeholder="e.g. John Doe"
                value={flagAssignee}
                onChange={(e) => setFlagAssignee(e.target.value)}
              />
            </div>
          </div>
          <Button size="sm" className="mt-4 gap-2" onClick={handleFlag}>
            <Plus className="size-4" />
            Submit Flag
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Flagged Assets List */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Search className="size-4" />
            Flagged Assets
            <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {missingAssets.length}
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Asset</th>
                  <th className="pb-2 pr-4 font-medium">Last Location</th>
                  <th className="pb-2 pr-4 font-medium">Last Assignee</th>
                  <th className="pb-2 pr-4 font-medium">Date Flagged</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {missingAssets.map((asset) => {
                  const badge = INVESTIGATION_BADGES[asset.investigationStatus];
                  return (
                    <tr
                      key={asset.id}
                      className={cn(
                        "cursor-pointer border-b border-border last:border-0 transition hover:bg-accent",
                        selectedAssetId === asset.id && "bg-accent"
                      )}
                      onClick={() => setSelectedAssetId(asset.id)}
                    >
                      <td className="py-2.5 pr-4">
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.tag}</p>
                      </td>
                      <td className="py-2.5 pr-4">{asset.lastLocation}</td>
                      <td className="py-2.5 pr-4">{asset.lastAssignee}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{asset.dateFlagged}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            badge.color,
                            badge.bg
                          )}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investigation Notes */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="size-4" />
            Investigation Notes
          </h2>
          {!selectedAssetId ? (
            <p className="text-sm text-muted-foreground">Select an asset to view notes.</p>
          ) : (
            <>
              <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
                {selectedNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                ) : (
                  selectedNotes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-border bg-muted/40 p-3"
                    >
                      <p className="text-sm">{n.note}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {n.author} &middot; {n.date}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                />
                <Button size="sm" onClick={handleAddNote}>
                  Add
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Physical Audit */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="size-4" />
            Physical Audit — Expected vs Actual
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">
                    <MapPin className="mr-1 inline size-3" />
                    Location
                  </th>
                  <th className="pb-2 pr-4 text-center font-medium">Expected</th>
                  <th className="pb-2 pr-4 text-center font-medium">Actual</th>
                  <th className="pb-2 text-center font-medium">Discrepancy</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_DATA.map((row) => {
                  const diff = row.expected - row.actual;
                  return (
                    <tr key={row.location} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{row.location}</td>
                      <td className="py-2.5 pr-4 text-center">{row.expected}</td>
                      <td className="py-2.5 pr-4 text-center">{row.actual}</td>
                      <td className="py-2.5 text-center">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            diff > 0
                              ? "bg-red-50 border border-red-200 text-red-700"
                              : "bg-green-50 border border-green-200 text-green-700"
                          )}
                        >
                          {diff > 0 ? `-${diff}` : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-800">
              Total Discrepancy: {AUDIT_DATA.reduce((s, r) => s + (r.expected - r.actual), 0)} asset(s) unaccounted
            </p>
          </div>
        </div>

        {/* Escalation Rules */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="size-4 text-amber-500" />
            Escalation Rules
          </h2>
          <div className="space-y-3">
            {ESCALATION_RULES.map((rule, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                    {i + 1}
                  </div>
                  {i < ESCALATION_RULES.length - 1 && (
                    <div className="mt-1 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium">{rule.day}</p>
                  <p className="text-xs text-muted-foreground">{rule.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
