import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  MOCK_TEMPLATES,
  TEMPLATE_VARIABLES,
  TEMPLATE_TYPE_CONFIGS,
  DEFAULT_TEMPLATE_BLOCKS,
} from "@/lib/document-mock-data";
import type {
  TemplateBlock,
  TemplateVariable,
  DocumentTemplateType,
  TemplateStatus,
} from "@/types/document";
import {
  ArrowLeft,
  Eye,
  Save,
  Upload,
  GripVertical,
  X,
  Plus,
  Type,
  AlignLeft,
  PenLine,
  Calendar,
  Minus,
  Image,
  Table2,
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
  Layers,
  Variable,
  Lock,
  History,
  Sparkles,
} from "lucide-react";

const VARIABLE_CATEGORY_STYLES: Record<string, string> = {
  employee: "bg-blue-100 text-blue-700 border-blue-200",
  company: "bg-emerald-100 text-emerald-700 border-emerald-200",
  manager: "bg-violet-100 text-violet-700 border-violet-200",
  date: "bg-amber-100 text-amber-700 border-amber-200",
  custom: "bg-gray-100 text-gray-700 border-gray-200",
};

const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "variable", label: "Variable", icon: Variable },
  { type: "signature", label: "Signature", icon: PenLine },
  { type: "date", label: "Date", icon: Calendar },
  { type: "spacer", label: "Spacer", icon: Minus },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "logo", label: "Company Logo", icon: Image },
  { type: "table", label: "Table", icon: Table2 },
];

const STATUS_STYLES: Record<TemplateStatus, string> = {
  draft: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  archived: "bg-gray-100 text-gray-700",
};

type SidebarTab = "blocks" | "variables" | "settings";

function generateId() {
  return "blk-" + Math.random().toString(36).substring(2, 9);
}

function replaceVariablesWithSample(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_match, key) => {
    const trimmed = key.trim();
    const variable = TEMPLATE_VARIABLES.find((v) => v.key === trimmed);
    return variable ? variable.sampleValue : `{{${trimmed}}}`;
  });
}

function renderContentWithChips(content: string) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, i) => {
    const varMatch = part.match(/^\{\{([^}]+)\}\}$/);
    if (varMatch) {
      const key = varMatch[1].trim();
      const variable = TEMPLATE_VARIABLES.find((v) => v.key === key);
      const category = variable?.category || "custom";
      return (
        <span
          key={i}
          className={cn(
            "inline-block px-1.5 py-0.5 rounded text-xs font-medium border mx-0.5",
            VARIABLE_CATEGORY_STYLES[category]
          )}
        >
          {variable?.label || key}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function DocumentTemplateBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";

  const existingTemplate = isNew
    ? null
    : MOCK_TEMPLATES.find((t) => t.id === id) || null;

  const [templateName, setTemplateName] = useState(
    existingTemplate?.name || "Untitled Template"
  );
  const [templateDescription, setTemplateDescription] = useState(
    existingTemplate?.description || ""
  );
  const [templateType, setTemplateType] = useState<DocumentTemplateType>(
    existingTemplate?.type || "CUSTOM"
  );
  const [templateStatus] = useState<TemplateStatus>(
    existingTemplate?.status || "draft"
  );
  const [templateTags, setTemplateTags] = useState<string[]>(
    existingTemplate?.tags || []
  );
  const [tagInput, setTagInput] = useState("");

  const initialBlocks: TemplateBlock[] = existingTemplate
    ? DEFAULT_TEMPLATE_BLOCKS[existingTemplate.type] || []
    : [];
  const [blocks, setBlocks] = useState<TemplateBlock[]>(initialBlocks);

  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("blocks");
  const [variableSearch, setVariableSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    employee: true,
    company: true,
    manager: true,
    date: true,
    custom: true,
  });

  const [permissionLevel, setPermissionLevel] = useState<string>(
    existingTemplate?.permissions.level || "all"
  );
  const [canGenerate, setCanGenerate] = useState<string[]>(
    existingTemplate?.permissions.canGenerate || ["hr", "admin"]
  );
  const [canEdit, setCanEdit] = useState<string[]>(
    existingTemplate?.permissions.canEdit || ["hr"]
  );
  const [canDelete, setCanDelete] = useState<string[]>(
    existingTemplate?.permissions.canDelete || ["admin"]
  );

  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"template" | "sample">(
    "template"
  );

  const [editingNameInline, setEditingNameInline] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const lastFocusedParagraphRef = useRef<string | null>(null);

  const versions = existingTemplate?.versions || [
    {
      id: "v-new",
      version: 1,
      changelog: "Initial draft",
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      status: "draft" as TemplateStatus,
    },
  ];

  const typeConfig = TEMPLATE_TYPE_CONFIGS.find((c) => c.type === templateType);

  // --- Block management ---
  function addBlock(type: TemplateBlock["type"]) {
    const newBlock: TemplateBlock = {
      id: generateId(),
      type,
      content:
        type === "header"
          ? "Heading"
          : type === "paragraph"
          ? "Enter text here..."
          : type === "variable"
          ? "{{employee.fullName}}"
          : type === "signature"
          ? "Signature\nName: _______________\nDate: _______________"
          : type === "date"
          ? "{{currentDate}}"
          : type === "table"
          ? "Table placeholder"
          : type === "logo"
          ? "{{company.logo}}"
          : "",
      style:
        type === "header"
          ? { fontSize: "xl", bold: true, alignment: "left" }
          : type === "logo"
          ? { alignment: "center" }
          : undefined,
    };
    setBlocks((prev) => [...prev, newBlock]);
  }

  function deleteBlock(blockId: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }

  function updateBlockContent(blockId: string, content: string) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
  }

  function handleDragStart(blockId: string) {
    setDraggedBlockId(blockId);
  }

  function handleDragOver(
    e: React.DragEvent<HTMLDivElement>,
    blockId: string
  ) {
    e.preventDefault();
    if (draggedBlockId && draggedBlockId !== blockId) {
      setDragOverBlockId(blockId);
    }
  }

  function handleDrop(targetBlockId: string) {
    if (!draggedBlockId || draggedBlockId === targetBlockId) {
      setDraggedBlockId(null);
      setDragOverBlockId(null);
      return;
    }
    setBlocks((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === draggedBlockId);
      const toIndex = prev.findIndex((b) => b.id === targetBlockId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  }

  function handleDragEnd() {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  }

  function insertVariableIntoBlock(variable: TemplateVariable) {
    const targetId = lastFocusedParagraphRef.current;
    if (targetId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === targetId
            ? { ...b, content: b.content + `{{${variable.key}}}` }
            : b
        )
      );
    } else {
      // Append a new paragraph block with the variable
      const newBlock: TemplateBlock = {
        id: generateId(),
        type: "paragraph",
        content: `{{${variable.key}}}`,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
  }

  function toggleRole(
    _list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    role: string
  ) {
    setList((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !templateTags.includes(tag)) {
      setTemplateTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTemplateTags((prev) => prev.filter((t) => t !== tag));
  }

  // --- Variable filtering ---
  const filteredVariables = TEMPLATE_VARIABLES.filter(
    (v) =>
      !variableSearch ||
      v.label.toLowerCase().includes(variableSearch.toLowerCase()) ||
      v.key.toLowerCase().includes(variableSearch.toLowerCase())
  );

  const variablesByCategory = filteredVariables.reduce<
    Record<string, TemplateVariable[]>
  >((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    employee: "Employee",
    company: "Company",
    manager: "Manager",
    date: "Date",
    custom: "Custom",
  };

  // --- Block rendering ---
  function renderBlock(block: TemplateBlock, isPreview = false, useSample = false) {
    const content = useSample
      ? replaceVariablesWithSample(block.content)
      : block.content;
    const alignment = block.style?.alignment || "left";
    const textAlign =
      alignment === "center"
        ? "text-center"
        : alignment === "right"
        ? "text-right"
        : "text-left";

    switch (block.type) {
      case "header": {
        const sizeClass =
          block.style?.fontSize === "2xl"
            ? "text-2xl"
            : block.style?.fontSize === "xl"
            ? "text-xl"
            : block.style?.fontSize === "lg"
            ? "text-lg"
            : block.style?.fontSize === "base"
            ? "text-base"
            : "text-sm";
        return (
          <div
            className={cn(
              textAlign,
              sizeClass,
              block.style?.bold && "font-bold",
              block.style?.italic && "italic"
            )}
          >
            {isPreview ? content : renderContentWithChips(block.content)}
          </div>
        );
      }
      case "paragraph":
        return (
          <div
            className={cn(
              textAlign,
              "text-sm leading-relaxed whitespace-pre-wrap",
              block.style?.bold && "font-bold",
              block.style?.italic && "italic"
            )}
          >
            {isPreview ? content : renderContentWithChips(block.content)}
          </div>
        );
      case "variable":
        return (
          <div className={cn(textAlign, "text-sm")}>
            {isPreview ? (
              <span>{content}</span>
            ) : (
              renderContentWithChips(block.content)
            )}
          </div>
        );
      case "signature":
        return (
          <div className={cn(textAlign, "py-4")}>
            <div className="border-b border-gray-400 w-48 mb-1 inline-block" />
            <div className="text-xs text-gray-500 whitespace-pre-wrap">
              {isPreview ? content : renderContentWithChips(block.content)}
            </div>
          </div>
        );
      case "date":
        return (
          <div className={cn(textAlign, "text-sm text-gray-600")}>
            {isPreview ? content : renderContentWithChips(block.content)}
          </div>
        );
      case "spacer":
        return <div className="h-6" />;
      case "divider":
        return <hr className="border-gray-300 my-2" />;
      case "logo":
        return (
          <div className={cn(textAlign, "py-2")}>
            <div className="inline-flex items-center justify-center w-24 h-12 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400">
              {isPreview && useSample ? "[Logo]" : "Company Logo"}
            </div>
          </div>
        );
      case "table":
        return (
          <div className={cn(textAlign, "py-2")}>
            <div className="border border-dashed border-gray-300 rounded p-4 text-center text-xs text-gray-400">
              <Table2 className="w-6 h-6 mx-auto mb-1 text-gray-300" />
              Table Block
            </div>
          </div>
        );
      default:
        return <div className="text-sm">{content}</div>;
    }
  }

  // --- Sidebar Tabs ---
  const SIDEBAR_TABS: { key: SidebarTab; label: string; icon: React.ElementType }[] = [
    { key: "blocks", label: "Blocks", icon: Layers },
    { key: "variables", label: "Variables", icon: Variable },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="h-14 border-b bg-white flex items-center px-4 gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Documents
        </Button>

        <div className="w-px h-6 bg-gray-200" />

        {editingNameInline ? (
          <Input
            autoFocus
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onBlur={() => setEditingNameInline(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingNameInline(false);
            }}
            className="h-8 w-64 text-sm font-semibold"
          />
        ) : (
          <button
            onClick={() => setEditingNameInline(true)}
            className="text-sm font-semibold hover:text-primary truncate max-w-[250px]"
          >
            {templateName}
          </button>
        )}

        {typeConfig && (
          <Badge variant="outline" className={cn("text-xs", typeConfig.color)}>
            {typeConfig.label}
          </Badge>
        )}

        <Badge className={cn("text-xs", STATUS_STYLES[templateStatus])}>
          {templateStatus.charAt(0).toUpperCase() + templateStatus.slice(1)}
        </Badge>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button size="sm" className="gap-1.5">
            <Upload className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Canvas (60%) */}
        <div className="w-[60%] overflow-y-auto p-6">
          <div className="max-w-[800px] mx-auto">
            {/* A4 Paper */}
            <div className="bg-white shadow-lg rounded-sm border border-gray-200 min-h-[1000px] p-12">
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Layers className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No blocks yet</p>
                  <p className="text-xs mt-1">
                    Add blocks from the sidebar to build your template
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(block.id)}
                      onDragOver={(e) => handleDragOver(e, block.id)}
                      onDrop={() => handleDrop(block.id)}
                      onDragEnd={handleDragEnd}
                      onMouseEnter={() => setHoveredBlockId(block.id)}
                      onMouseLeave={() => setHoveredBlockId(null)}
                      className={cn(
                        "group relative rounded px-3 py-2 transition-all",
                        hoveredBlockId === block.id &&
                          "ring-1 ring-primary/30 bg-primary/[0.02]",
                        draggedBlockId === block.id && "opacity-40",
                        dragOverBlockId === block.id &&
                          "border-t-2 border-primary"
                      )}
                    >
                      {/* Block controls */}
                      {hoveredBlockId === block.id && (
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                          <button
                            className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-gray-100 text-gray-400"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {hoveredBlockId === block.id && (
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="absolute -right-3 -top-2 p-0.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      {/* Editable content */}
                      {editingBlockId === block.id &&
                      (block.type === "header" ||
                        block.type === "paragraph" ||
                        block.type === "variable" ||
                        block.type === "signature" ||
                        block.type === "date") ? (
                        <textarea
                          autoFocus
                          value={block.content}
                          onChange={(e) =>
                            updateBlockContent(block.id, e.target.value)
                          }
                          onBlur={() => setEditingBlockId(null)}
                          onFocus={() => {
                            if (block.type === "paragraph") {
                              lastFocusedParagraphRef.current = block.id;
                            }
                          }}
                          className="w-full text-sm border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                          rows={Math.max(
                            2,
                            block.content.split("\n").length
                          )}
                        />
                      ) : (
                        <div
                          onDoubleClick={() => {
                            if (
                              block.type !== "spacer" &&
                              block.type !== "divider" &&
                              block.type !== "logo" &&
                              block.type !== "table"
                            ) {
                              setEditingBlockId(block.id);
                              if (block.type === "paragraph") {
                                lastFocusedParagraphRef.current = block.id;
                              }
                            }
                          }}
                          className="cursor-text"
                        >
                          {renderBlock(block)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Sidebar (40%) */}
        <div className="w-[40%] border-l bg-white flex flex-col overflow-hidden">
          {/* Sidebar Tab Buttons */}
          <div className="flex border-b shrink-0">
            {SIDEBAR_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSidebarTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
                  sidebarTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Blocks Tab */}
            {sidebarTab === "blocks" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-3">
                  Click a block to add it to your template
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {BLOCK_TYPES.map((bt) => (
                    <button
                      key={bt.type}
                      onClick={() =>
                        addBlock(bt.type as TemplateBlock["type"])
                      }
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-gray-600 hover:text-primary"
                    >
                      <bt.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{bt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Templates
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Load default blocks for a template type
                  </p>
                  <div className="space-y-1.5">
                    {TEMPLATE_TYPE_CONFIGS.filter(
                      (c) => c.type !== "CUSTOM"
                    ).map((config) => (
                      <button
                        key={config.type}
                        onClick={() => {
                          const defaultBlocks =
                            DEFAULT_TEMPLATE_BLOCKS[config.type];
                          if (defaultBlocks) {
                            setBlocks(
                              defaultBlocks.map((b) => ({
                                ...b,
                                id: generateId(),
                              }))
                            );
                            setTemplateType(config.type);
                          }
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-left text-sm transition-colors"
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded flex items-center justify-center",
                            config.bgColor
                          )}
                        >
                          <config.icon
                            className={cn("w-3.5 h-3.5", config.color)}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            {config.label}
                          </p>
                        </div>
                        <Sparkles className="w-3 h-3 ml-auto text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Variables Tab */}
            {sidebarTab === "variables" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search variables..."
                    value={variableSearch}
                    onChange={(e) => setVariableSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Click a variable to insert into the last focused paragraph
                  block
                </p>

                {Object.entries(variablesByCategory).map(
                  ([category, vars]) => (
                    <div key={category}>
                      <button
                        onClick={() =>
                          setExpandedCategories((prev) => ({
                            ...prev,
                            [category]: !prev[category],
                          }))
                        }
                        className="flex items-center gap-1.5 w-full text-left py-1"
                      >
                        {expandedCategories[category] ? (
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {categoryLabels[category] || category}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] px-1.5 py-0"
                        >
                          {vars.length}
                        </Badge>
                      </button>
                      {expandedCategories[category] && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 ml-5 mb-2">
                          {vars.map((v) => (
                            <button
                              key={v.key}
                              onClick={() => insertVariableIntoBlock(v)}
                              className={cn(
                                "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity",
                                VARIABLE_CATEGORY_STYLES[v.category]
                              )}
                              title={`Sample: ${v.sampleValue}`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Settings Tab */}
            {sidebarTab === "settings" && (
              <div className="space-y-6">
                {/* Template Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Settings className="w-4 h-4" />
                    Template Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <textarea
                        value={templateDescription}
                        onChange={(e) =>
                          setTemplateDescription(e.target.value)
                        }
                        className="w-full border border-gray-200 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                        rows={3}
                        placeholder="Describe this template..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={templateType}
                        onValueChange={(val) =>
                          setTemplateType(val as DocumentTemplateType)
                        }
                      >
                        <SelectTrigger className="h-8 text-sm mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_TYPE_CONFIGS.map((c) => (
                            <SelectItem key={c.type} value={c.type}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
                        {templateTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs gap-1"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          placeholder="Add tag..."
                          className="h-7 text-xs flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addTag}
                          className="h-7 px-2"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    Permissions
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Permission Level</Label>
                      <Select
                        value={permissionLevel}
                        onValueChange={setPermissionLevel}
                      >
                        <SelectTrigger className="h-8 text-sm mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="hr_only">HR Only</SelectItem>
                          <SelectItem value="managers">Managers</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Role Checkboxes */}
                    {(["hr", "admin", "manager"] as const).map((role) => (
                      <div key={role} className="space-y-1.5">
                        <p className="text-xs font-medium text-gray-600 capitalize">
                          {role}
                        </p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={canGenerate.includes(role)}
                              onChange={() =>
                                toggleRole(
                                  canGenerate,
                                  setCanGenerate,
                                  role
                                )
                              }
                              className="rounded border-gray-300"
                            />
                            Can Generate
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={canEdit.includes(role)}
                              onChange={() =>
                                toggleRole(canEdit, setCanEdit, role)
                              }
                              className="rounded border-gray-300"
                            />
                            Can Edit
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={canDelete.includes(role)}
                              onChange={() =>
                                toggleRole(canDelete, setCanDelete, role)
                              }
                              className="rounded border-gray-300"
                            />
                            Can Delete
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Version History */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    Version History
                  </h3>
                  <div className="space-y-2">
                    {versions.map((v) => {
                      const isCurrent =
                        v.version ===
                        (existingTemplate?.version || 1);
                      return (
                        <div
                          key={v.id}
                          className={cn(
                            "p-2.5 rounded-lg border text-xs",
                            isCurrent
                              ? "border-primary/30 bg-primary/5"
                              : "border-gray-200"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-800">
                                v{v.version}
                              </span>
                              {isCurrent && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <Badge
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                STATUS_STYLES[v.status]
                              )}
                            >
                              {v.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{v.changelog}</p>
                          <div className="flex items-center justify-between mt-1.5 text-gray-400">
                            <span>{v.createdBy}</span>
                            <span>
                              {new Date(v.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Template Preview
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setPreviewMode("template")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium transition-colors",
                      previewMode === "template"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    Template View
                  </button>
                  <button
                    onClick={() => setPreviewMode("sample")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium transition-colors",
                      previewMode === "sample"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    Sample Data
                  </button>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
              <div className="max-w-[800px] mx-auto bg-white shadow-lg rounded-sm border border-gray-200 p-12 min-h-[700px]">
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="text-sm">No blocks to preview</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {blocks.map((block) => (
                      <div key={block.id} className="py-1">
                        {renderBlock(
                          block,
                          true,
                          previewMode === "sample"
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
