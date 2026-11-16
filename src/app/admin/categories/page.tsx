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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Administration</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Food Categories</h1>
        <p className="text-xs text-muted-foreground">
          Manage product taxonomy (pies, pastries, kakanin, coffee, pasalubong)
        </p>
      </div>

      <AdminNav />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Create form card */}
      <form action={handleCreate} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Add New Food Category
        </h2>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            name="name"
            defaultValue={createName}
            required
            placeholder="e.g. Traditional Pies, Native Kakanin, Laguna Coffee"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
          >
            Create Category
          </button>
        </div>
      </form>

      {/* Categories Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Food Categories ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No categories created yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-semibold">Category Name</th>
                <th className="text-right px-5 py-3 font-semibold w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <form action={handleUpdate} className="flex gap-2">
                          <input type="hidden" name="id" value={cat.id} />
                          <input
                            type="text"
                            name="name"
                            defaultValue={editName}
                            required
                            className="flex-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                            }}
                            className="px-3 py-1 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                          >
                            Rename
                          </button>
                          <form action={handleDelete} className="inline">
                            <input type="hidden" name="id" value={cat.id} />
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                              onClick={(e) => {
                                if (!confirm("Delete this category? Any associated products may be affected.")) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
