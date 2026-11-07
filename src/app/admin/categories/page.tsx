"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/modules/catalog/queries";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/modules/catalog/actions";

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
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-muted-foreground">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-muted-foreground">
          Manage product categories (admin only)
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md bg-success/10 border border-success/50 p-3 text-sm text-success">
          {message}
        </div>
      )}

      {/* Create form */}
      <form action={handleCreate} className="space-y-4 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Add category</h2>
        <div className="flex gap-2">
          <input
            type="text"
            name="name"
            defaultValue={createName}
            required
            placeholder="Category name (e.g., kakanin, coffee, pastries)"
            className="flex-1 rounded-md border input bg-background text-foreground"
          />
          <button
            type="submit"
            className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      </form>

      {/* List */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Existing categories</h2>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories yet.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="border-b">
                    {isEditing ? (
                      <>
                        <td className="p-2">
                          <form action={handleUpdate} className="flex gap-2">
                            <input
                              type="hidden"
                              name="id"
                              value={cat.id}
                            />
                            <input
                              type="text"
                              name="name"
                              defaultValue={editName}
                              required
                              className="rounded-md border input bg-background text-foreground"
                            />
                            <button
                              type="submit"
                              className="rounded-md border border-transparent bg-success px-3 py-1 text-xs font-semibold text-success-foreground shadow hover:bg-success/90"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditName("");
                              }}
                              className="rounded-md border border-transparent bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground shadow hover:bg-muted/80"
                            >
                              Cancel
                            </button>
                          </form>
                        </td>
                        <td className="p-2"></td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{cat.name}</td>
                        <td className="p-2 text-right space-x-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <form action={handleDelete} className="inline">
                            <input type="hidden" name="id" value={cat.id} />
                            <button
                              type="submit"
                              className="text-xs font-medium text-destructive hover:underline"
                              onClick={(e) => {
                                if (!confirm("Delete this category?")) e.preventDefault();
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </>
                    )}
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
