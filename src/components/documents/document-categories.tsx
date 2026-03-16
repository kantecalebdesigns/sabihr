import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  color: string
  documentCount: number
}

const PRESET_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#6B7280",
]

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Personal",
    description: "Personal identification and background documents",
    color: "#3B82F6",
    documentCount: 12,
  },
  {
    id: "2",
    name: "Employment",
    description: "Employment contracts, offer letters, and agreements",
    color: "#10B981",
    documentCount: 8,
  },
  {
    id: "3",
    name: "Compliance",
    description: "Regulatory and compliance-related documents",
    color: "#F59E0B",
    documentCount: 5,
  },
  {
    id: "4",
    name: "Financial",
    description: "Payroll, tax, and financial records",
    color: "#EF4444",
    documentCount: 15,
  },
  {
    id: "5",
    name: "Legal",
    description: "Legal agreements, NDAs, and policy documents",
    color: "#8B5CF6",
    documentCount: 3,
  },
  {
    id: "6",
    name: "Training",
    description: "Training certifications and course completions",
    color: "#EC4899",
    documentCount: 7,
  },
  {
    id: "7",
    name: "Other",
    description: "Miscellaneous and uncategorized documents",
    color: "#6B7280",
    documentCount: 2,
  },
]

export function DocumentCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleAdd = () => {
    if (!newName.trim()) return
    const category: Category = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDescription.trim(),
      color: newColor,
      documentCount: 0,
    }
    setCategories((prev) => [...prev, category])
    setNewName("")
    setNewDescription("")
    setNewColor(PRESET_COLORS[0])
    setShowAddForm(false)
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditDescription(category.description)
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) return
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, name: editName.trim(), description: editDescription.trim() }
          : c
      )
    )
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Document Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage categories for organizing documents
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus />
          Add Category
        </Button>
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <h3 className="text-sm font-medium">New Category</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                placeholder="Category name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-desc">Description</Label>
              <Input
                id="new-desc"
                placeholder="Brief description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "size-8 rounded-full border-2 transition-all",
                    newColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddForm(false)
                setNewName("")
                setNewDescription("")
                setNewColor(PRESET_COLORS[0])
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
              Add Category
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {categories.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No categories yet. Add one to get started.
          </div>
        )}
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-4 px-4 py-3"
          >
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />

            {editingId === category.id ? (
              <div className="flex flex-1 items-center gap-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="max-w-[200px]"
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => saveEdit(category.id)}
                  disabled={!editName.trim()}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingId(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {category.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {category.documentCount}{" "}
                  {category.documentCount === 1 ? "doc" : "docs"}
                </span>

                {deleteConfirmId === category.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-destructive">Delete?</span>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => handleDelete(category.id)}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      No
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => startEdit(category)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteConfirmId(category.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
