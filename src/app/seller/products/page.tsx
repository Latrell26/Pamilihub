"use client";

import { useState, useEffect } from "react";
import { getSellerProducts, getCategories } from "@/modules/catalog/queries";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/modules/catalog/actions";

type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  sellers: {
    store_name: string | null;
  } | null;
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Create form state
  const [newCat, setNewCat] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // Edit form state
  const [editCat, setEditCat] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getSellerProducts(),
        getCategories(),
      ]);
      setProducts(productsData ?? []);
      setCategories(categoriesData ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await createProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setAdding(false);
      setNewCat("");
      setNewName("");
      setNewDesc("");
      setNewPrice("");
      setNewStock("");
      await loadProducts();
    } else {
      setError(result.message || "Failed to add product.");
    }
  }

  async function handleUpdate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await updateProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setEditingId(null);
      setRemoveImage(false);
      await loadProducts();
    } else {
      setError(result.message || "Failed to update product.");
    }
  }

  async function handleDelete(formData: FormData) {
    setMessage("");
    setError("");
    const result = await deleteProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      await loadProducts();
    } else {
      setError(result.message || "Failed to delete product.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditCat(p.category_id);
    setEditName(p.name);
    setEditDesc(p.description ?? "");
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
    setRemoveImage(false);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading merchant products...</div>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Merchant Store</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Product Listings</h1>
          <p className="text-xs text-muted-foreground">
            Manage your local delicacies, prices, inventory stock, and photos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>{adding ? "✕ Close Form" : "+ Add New Delicacy"}</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-muted-foreground">Total Listings</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium">In Stock</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{inStockCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{outOfStockCount}</p>
        </div>
      </div>

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

      {/* Add Product Collapsible Panel */}
      {adding && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Add New Food Product</h2>
            <span className="text-xs text-muted-foreground">Will appear in public catalog immediately</span>
          </div>

          <form action={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  defaultValue={newCat}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={newName}
                  required
                  placeholder="e.g. Special Buko Pie (Box of 8)"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={newDesc}
                  rows={2}
                  placeholder="Ingredients, shelf-life, package size..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Price (₱) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={newPrice}
                  required
                  min="0"
                  step="0.01"
                  placeholder="250.00"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={newStock}
                  required
                  min="0"
                  placeholder="20"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Photo Upload
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
              >
                Save Delicacy Listing
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-4 py-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Inventory ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-3xl block">📦</span>
            <p className="text-sm font-semibold text-foreground">No delicacies listed yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Click &quot;Add New Delicacy&quot; above to list your first buko pie, espasol, or local food item.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold w-20">Photo</th>
                  <th className="text-left px-5 py-3 font-semibold">Delicacy Name</th>
                  <th className="text-right px-5 py-3 font-semibold">Price</th>
                  <th className="text-right px-5 py-3 font-semibold">Stock</th>
                  <th className="text-right px-5 py-3 font-semibold w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const isEditing = editingId === p.id;

                  if (isEditing) {
                    return (
                      <tr key={p.id} className="bg-muted/20">
                        <td colSpan={5} className="p-5">
                          <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={p.id} />
                            <div className="flex items-center justify-between pb-2 border-b border-border">
                              <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                                Edit Delicacy #{p.id.slice(0, 8)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕ Close
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Category
                                </label>
                                <select
                                  name="category_id"
                                  defaultValue={editCat}
                                  required
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Name
                                </label>
                                <input
                                  name="name"
                                  defaultValue={editName}
                                  required
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Price (₱)
                                </label>
                                <input
                                  name="price"
                                  defaultValue={editPrice}
                                  required
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  defaultValue={editDesc}
                                  rows={2}
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Stock
                                </label>
                                <input
                                  name="stock"
                                  defaultValue={editStock}
                                  required
                                  type="number"
                                  min="0"
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div className="sm:col-span-4 flex flex-wrap items-center gap-3 pt-2">
                                <input
                                  type="file"
                                  name="image"
                                  accept="image/*"
                                  className="text-xs"
                                />
                                <input
                                  type="hidden"
                                  name="remove_image"
                                  value={removeImage ? "true" : "false"}
                                />
                                <button
                                  type="button"
                                  onClick={() => setRemoveImage((prev) => !prev)}
                                  className="text-xs text-red-600 hover:underline"
                                >
                                  {removeImage ? "Keep existing photo" : "Remove photo"}
                                </button>
                                <div className="ml-auto flex gap-2">
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white shadow hover:bg-emerald-700"
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </td>
                      </tr>
                    );
                  }

                  const inStock = p.stock > 0;

                  return (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted/60 border border-border flex items-center justify-center text-sm">
                            🍲
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {p.description || "No description provided."}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-foreground">
                        ₱{Number(p.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {inStock ? `${p.stock} in stock` : "0 (Sold Out)"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          Edit
                        </button>
                        <form action={handleDelete} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                              if (!confirm("Are you sure you want to delete this listing?")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
