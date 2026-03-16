import { useState, useCallback } from "react";
import {
  X,
  Copy,
  Plus,
  Trash2,
  Link2,
  Users,
  Check,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

type Permission = "view" | "download" | "full";

interface Recipient {
  email: string;
  permission: Permission;
}

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

export function DocumentShareModal({
  isOpen,
  onClose,
  documentName,
}: DocumentShareModalProps) {
  const [activeTab, setActiveTab] = useState<"people" | "link">("people");

  // Share with People state
  const [emailInput, setEmailInput] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [message, setMessage] = useState("");

  // Secure Link state
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [linkExpiry, setLinkExpiry] = useState("7");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const addRecipient = useCallback(() => {
    const trimmed = emailInput.trim();
    if (
      trimmed &&
      trimmed.includes("@") &&
      !recipients.some((r) => r.email === trimmed)
    ) {
      setRecipients((prev) => [
        ...prev,
        { email: trimmed, permission: "view" },
      ]);
      setEmailInput("");
    }
  }, [emailInput, recipients]);

  const removeRecipient = useCallback((email: string) => {
    setRecipients((prev) => prev.filter((r) => r.email !== email));
  }, []);

  const updatePermission = useCallback(
    (email: string, permission: Permission) => {
      setRecipients((prev) =>
        prev.map((r) => (r.email === email ? { ...r, permission } : r))
      );
    },
    []
  );

  const handleGenerateLink = useCallback(() => {
    const mockId = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://sabihr.app/shared/${mockId}`);
    setCopied(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [generatedLink]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addRecipient();
      }
    },
    [addRecipient]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card shadow-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold">Share Document</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {documentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("people")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === "people"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="size-4" />
            Share with People
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === "link"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link2 className="size-4" />
            Secure Link
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {activeTab === "people" ? (
            <div className="space-y-4">
              {/* Add recipient */}
              <div className="space-y-1.5">
                <Label>Add Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="default"
                    onClick={addRecipient}
                    className="gap-1"
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Recipient list */}
              {recipients.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recipients.map((r) => (
                    <div
                      key={r.email}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <span className="flex-1 text-sm truncate">
                        {r.email}
                      </span>
                      <Select
                        value={r.permission}
                        onValueChange={(v) =>
                          updatePermission(r.email, v as Permission)
                        }
                      >
                        <SelectTrigger className="w-[130px] h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="download">Download</SelectItem>
                          <SelectItem value="full">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => removeRecipient(r.email)}
                        className="size-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <Label>Message (optional)</Label>
                <textarea
                  placeholder="Add a message to recipients..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-none"
                />
              </div>

              {/* Share button */}
              <div className="flex justify-end pt-2">
                <Button disabled={recipients.length === 0}>Share</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Link expiry */}
              <div className="space-y-1.5">
                <Label>Link Expiry</Label>
                <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Require password toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Require Password</Label>
                  <button
                    onClick={() => setRequirePassword(!requirePassword)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                      requirePassword ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
                        requirePassword ? "translate-x-[18px]" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
                {requirePassword && (
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                )}
              </div>

              {/* Generate link */}
              <Button className="w-full" onClick={handleGenerateLink}>
                Generate Link
              </Button>

              {/* Generated link display */}
              {generatedLink && (
                <div className="space-y-2">
                  <Label>Generated Link</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground truncate">
                      {generatedLink}
                    </div>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleCopyLink}
                      className="gap-1.5 shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="size-4 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
