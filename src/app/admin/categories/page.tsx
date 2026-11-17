"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/modules/catalog/queries";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/modules/catalog/actions";
import AdminNav from "@/components/admin/AdminNav";
import AdminLoading from "../loading";
import {
  FolderKanban,
  Tag,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [createName, setCreateName] = useState("");

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await createCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setCreateName("");
      await loadCategories();
    } else {
      setError(result.message || "Failed to create category.");
    }
  }

  async function handleUpdate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await updateCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setEditingId(null);
      setEditName("");
      await loadCategories();
    } else {
      setError(result.message || "Failed to update category.");
    }
  }

  async function handleDelete(formData: FormData) {
    setMessage("");
    setError("");
    const result = await deleteCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      await loadCategories();
    } else {
      setError(result.message || "Failed to delete category.");
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Catalog Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Delicacy Categories Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage product groupings (Pies & Pastries, Native Kakanin, Laguna Coffee, Pasalubong) across the marketplace.
        </p>
      </div>

      <AdminNav />

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Create Form Card */}
      <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          <span>Add New Delicacy Category</span>
        </h2>
        <form action={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Tag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="name"
              defaultValue={createName}
              required
              placeholder="e.g. Traditional Pies, Native Kakanin, Laguna Coffee..."
              className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-7 rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Create Category
          </button>
        </form>
      </div>

      {/* Categories Table Card */}
      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <div className="p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-primary" />
            <span>Active Categories ({categories.length})</span>
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold text-foreground">No categories created yet.</p>
            <p>Use the form above to add your first delicacy category.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {categories.map((cat) => {
              const isEditing = editingId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                >
                  {isEditing ? (
                    <form action={handleUpdate} className="flex items-center gap-2 w-full">
                      <input type="hidden" name="id" value={cat.id} />
                      <input
                        type="text"
                        name="name"
                        defaultValue={editName}
                        required
                        className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="h-10 px-5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 active:scale-95 cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="h-10 px-4 rounded-full border border-border/70 bg-card text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-foreground">{cat.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">ID: {cat.id.slice(0, 8)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <form action={handleDelete} className="inline-block">
                          <input type="hidden" name="id" value={cat.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95"
                            onClick={(e) => {
                              if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
