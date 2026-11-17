"use client";

import { useState, useEffect, useRef } from "react";
import { getSellerProducts, getCategories } from "@/modules/catalog/queries";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/modules/catalog/actions";
import SellerProductsLoading from "./loading";
import {
  Package,
  Plus,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Tag,
  Layers,
  Image as ImageIcon,
  FileText,
  Loader2,
  Store,
  UploadCloud,
  RefreshCw,
} from "lucide-react";

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

function formatPHP(amount: number) {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [newCat, setNewCat] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImagePreview, setNewImagePreview] = useState<{ url: string; name: string; size: number } | null>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editCat, setEditCat] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImagePreview, setEditImagePreview] = useState<{ url: string; name: string; size: number } | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file selection and preview for Create
  function handleNewFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImagePreview({ url, name: file.name, size: file.size });
    }
  }

  function handleClearNewFile() {
    if (newImagePreview?.url) {
      URL.revokeObjectURL(newImagePreview.url);
    }
    setNewImagePreview(null);
    if (newFileInputRef.current) {
      newFileInputRef.current.value = "";
    }
  }

  // Handle file selection and preview for Edit
  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditImagePreview({ url, name: file.name, size: file.size });
      setRemoveImage(false);
    }
  }

  function handleClearEditFile() {
    if (editImagePreview?.url) {
      URL.revokeObjectURL(editImagePreview.url);
    }
    setEditImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  }

  async function handleCreate(formData: FormData) {
    setSubmitting(true);
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
      handleClearNewFile();
      await loadProducts();
    } else {
      setError(result.message || "Failed to add product.");
    }
    setSubmitting(false);
  }

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    setMessage("");
    setError("");
    const result = await updateProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setEditingId(null);
      setRemoveImage(false);
      handleClearEditFile();
      await loadProducts();
    } else {
      setError(result.message || "Failed to update product.");
    }
    setSubmitting(false);
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
    handleClearEditFile();
  };

  if (loading) {
    return <SellerProductsLoading />;
  }

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Page Title & Controls Banner */}
      <div className="border-b border-border/60 bg-card/60 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Inventory & Products
              </h1>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-black uppercase text-primary">
                Store Catalog
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your San Pablo delicacies, prices, live inventory, and food photos
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setAdding(!adding);
                if (adding) handleClearNewFile();
              }}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95 cursor-pointer"
            >
              {adding ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Delicacy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Products
              </span>
              <p className="text-2xl font-black text-foreground mt-0.5">{products.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                In Stock & Active
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {inStockCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Sold Out / Empty
              </span>
              <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">
                {outOfStockCount}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Notifications */}
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

        {/* Add Product Collapsible Panel */}
        {adding && (
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-md space-y-6 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Add New Delicacy
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Listing will appear on your store page immediately
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  handleClearNewFile();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form action={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      name="category_id"
                      defaultValue={newCat}
                      required
                      className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Delicacy Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Store className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      defaultValue={newName}
                      required
                      placeholder="e.g. Special Buko Pie (Box of 8)"
                      className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description & Ingredients
                  </label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                    <textarea
                      name="description"
                      defaultValue={newDesc}
                      rows={2}
                      placeholder="Ingredients, package size, shelf life, reheating instructions..."
                      className="w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 pt-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price (₱) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      ₱
                    </span>
                    <input
                      type="number"
                      name="price"
                      defaultValue={newPrice}
                      required
                      min="0"
                      step="0.01"
                      placeholder="250.00"
                      className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Stock <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      name="stock"
                      defaultValue={newStock}
                      required
                      min="0"
                      placeholder="20"
                      className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Image Upload with Live UI/UX Preview */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Delicacy Photo
                  </label>

                  {newImagePreview ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl border border-border/80 bg-muted/30 p-4">
                      <div className="relative aspect-video sm:aspect-square w-full sm:w-28 h-28 rounded-2xl overflow-hidden border border-border/70 bg-card shadow-xs shrink-0">
                        <img
                          src={newImagePreview.url}
                          alt="Delicacy Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Photo Ready to Upload</span>
                        </div>
                        <p className="text-xs font-bold text-foreground truncate max-w-sm">
                          {newImagePreview.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatFileSize(newImagePreview.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearNewFile}
                        className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-all shrink-0 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative rounded-3xl border-2 border-dashed border-border/80 bg-muted/30 hover:bg-muted/50 transition-all p-6 text-center cursor-pointer">
                      <input
                        ref={newFileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleNewFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Click to upload or drag food photo here
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            PNG, JPG, or WEBP (up to 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Delicacy...</span>
                    </>
                  ) : (
                    <span>Save Delicacy</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    handleClearNewFile();
                  }}
                  className="rounded-full border border-border/70 bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              Food Listings ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-border/70 bg-card p-12 text-center space-y-3 shadow-xs">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No delicacies listed yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click &quot;Add Delicacy&quot; to list your first buko pie, espasol, or local San Pablo delicacy.
              </p>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Delicacy</span>
              </button>
            </div>
          ) : (
            <>
              {/* ── MOBILE / TABLET CARD VIEW (< 768px) ────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {products.map((p) => {
                  const isEditing = editingId === p.id;
                  const inStock = p.stock > 0;

                  if (isEditing) {
                    return (
                      <div
                        key={p.id}
                        className="rounded-3xl border border-primary/40 bg-card p-5 shadow-sm space-y-4 sm:col-span-2 ring-2 ring-primary/20"
                      >
                        <form action={handleUpdate} className="space-y-4">
                          <input type="hidden" name="id" value={p.id} />
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="font-black text-xs uppercase text-foreground">
                              Edit: {p.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                handleClearEditFile();
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                Category
                              </label>
                              <select
                                name="category_id"
                                defaultValue={editCat}
                                required
                                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                Delicacy Name
                              </label>
                              <input
                                name="name"
                                defaultValue={editName}
                                required
                                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                  Price (₱)
                                </label>
                                <input
                                  name="price"
                                  defaultValue={editPrice}
                                  required
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                  Stock
                                </label>
                                <input
                                  name="stock"
                                  defaultValue={editStock}
                                  required
                                  type="number"
                                  min="0"
                                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                Description
                              </label>
                              <textarea
                                name="description"
                                defaultValue={editDesc}
                                rows={2}
                                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs"
                              />
                            </div>

                            {/* Photo replace / preview */}
                            <div className="space-y-2 pt-1 border-t border-border/50">
                              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                                Update Photo
                              </label>
                              {editImagePreview ? (
                                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-2.5 border border-border">
                                  <img
                                    src={editImagePreview.url}
                                    alt="New Preview"
                                    className="h-12 w-12 rounded-xl object-cover shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-bold text-foreground truncate">
                                      {editImagePreview.name}
                                    </p>
                                    <p className="text-[10px] text-emerald-600 font-bold">New photo selected</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleClearEditFile}
                                    className="p-1 rounded-full text-red-500 hover:bg-red-500/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <input
                                  ref={editFileInputRef}
                                  type="file"
                                  name="image"
                                  accept="image/*"
                                  onChange={handleEditFileChange}
                                  className="block w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                              )}

                              <input
                                type="hidden"
                                name="remove_image"
                                value={removeImage ? "true" : "false"}
                              />

                              {p.image_url && !editImagePreview && (
                                <button
                                  type="button"
                                  onClick={() => setRemoveImage((prev) => !prev)}
                                  className="text-xs font-bold text-red-600 hover:underline block pt-1"
                                >
                                  {removeImage ? "Undo: Keep current photo" : "Remove current photo"}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 h-10 rounded-full bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                handleClearEditFile();
                              }}
                              className="h-10 px-4 rounded-full border border-border bg-card text-xs font-bold text-foreground hover:bg-muted"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-4 shadow-xs space-y-3.5"
                    >
                      {/* Top: Image and Information */}
                      <div className="flex gap-3.5">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-20 w-20 rounded-2xl object-cover border border-border/60 shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/60 border border-border/50 text-2xl shrink-0">
                            🍲
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="inline-block rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                            {catMap.get(p.category_id) ?? "Delicacy"}
                          </span>
                          <h3 className="font-extrabold text-sm text-foreground line-clamp-1 mt-1">
                            {p.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {p.description || "No description provided."}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-black text-foreground">
                              {formatPHP(p.price)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inStock
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 border border-red-500/20"
                              }`}
                            >
                              {inStock ? `${p.stock} in stock` : "Sold Out"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Buttons (Mobile: Clear, Separate, Non-Overlapping) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="flex-1 h-9 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <form action={handleDelete} className="flex-1">
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="w-full h-9 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer"
                            onClick={(e) => {
                              if (!confirm(`Are you sure you want to delete ${p.name}?`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── DESKTOP TABLE VIEW (>= 768px) ──────────────────────────────── */}
              <div className="hidden md:block rounded-3xl border border-border/70 bg-card overflow-hidden shadow-xs">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      <th className="text-left px-5 py-4 w-20">Photo</th>
                      <th className="text-left px-5 py-4">Delicacy Details</th>
                      <th className="text-left px-5 py-4 w-32">Category</th>
                      <th className="text-right px-5 py-4 w-28">Price</th>
                      <th className="text-right px-5 py-4 w-32">Stock</th>
                      <th className="text-right px-6 py-4 w-44 min-w-[170px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {products.map((p) => {
                      const isEditing = editingId === p.id;
                      const inStock = p.stock > 0;

                      if (isEditing) {
                        return (
                          <tr key={p.id} className="bg-primary/5">
                            <td colSpan={6} className="p-6">
                              <form action={handleUpdate} className="space-y-4">
                                <input type="hidden" name="id" value={p.id} />
                                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                                  <span className="font-black text-xs uppercase tracking-wider text-foreground">
                                    Edit Delicacy: {p.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingId(null);
                                      handleClearEditFile();
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                      Category
                                    </label>
                                    <select
                                      name="category_id"
                                      defaultValue={editCat}
                                      required
                                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary"
                                    >
                                      {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                          {c.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                      Delicacy Name
                                    </label>
                                    <input
                                      name="name"
                                      defaultValue={editName}
                                      required
                                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                      Price (₱)
                                    </label>
                                    <input
                                      name="price"
                                      defaultValue={editPrice}
                                      required
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary"
                                    />
                                  </div>

                                  <div className="sm:col-span-3">
                                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      name="description"
                                      defaultValue={editDesc}
                                      rows={2}
                                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-primary"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                                      Stock Count
                                    </label>
                                    <input
                                      name="stock"
                                      defaultValue={editStock}
                                      required
                                      type="number"
                                      min="0"
                                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary"
                                    />
                                  </div>

                                  {/* Photo preview in Edit */}
                                  <div className="sm:col-span-4 flex flex-wrap items-center gap-3 pt-2">
                                    {editImagePreview ? (
                                      <div className="flex items-center gap-2 rounded-xl bg-muted/60 p-1.5 border border-border">
                                        <img
                                          src={editImagePreview.url}
                                          alt="New file preview"
                                          className="h-9 w-9 rounded-lg object-cover"
                                        />
                                        <span className="text-xs font-bold truncate max-w-[150px]">
                                          {editImagePreview.name}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={handleClearEditFile}
                                          className="p-1 text-red-500 hover:text-red-700"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <input
                                        ref={editFileInputRef}
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleEditFileChange}
                                        className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                      />
                                    )}

                                    <input
                                      type="hidden"
                                      name="remove_image"
                                      value={removeImage ? "true" : "false"}
                                    />

                                    {p.image_url && !editImagePreview && (
                                      <button
                                        type="button"
                                        onClick={() => setRemoveImage((prev) => !prev)}
                                        className="text-xs font-semibold text-red-600 hover:underline"
                                      >
                                        {removeImage ? "Keep current photo" : "Remove photo"}
                                      </button>
                                    )}

                                    <div className="ml-auto flex items-center gap-2">
                                      <button
                                        type="submit"
                                        disabled={submitting}
                                        className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingId(null);
                                          handleClearEditFile();
                                        }}
                                        className="rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
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

                      return (
                        <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-4">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-border/60 shadow-xs"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center text-lg">
                                🍲
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-extrabold text-foreground text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {p.description || "No description provided."}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                              {catMap.get(p.category_id) ?? "Delicacy"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-black text-foreground">
                            {formatPHP(p.price)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                inStock
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 border border-red-500/20"
                              }`}
                            >
                              {inStock ? `${p.stock} in stock` : "Sold Out"}
                            </span>
                          </td>
                          {/* Desktop Action Buttons: Non-wrapping, fully responsive */}
                          <td className="px-6 py-4 text-right whitespace-nowrap min-w-[170px]">
                            <div className="inline-flex items-center justify-end gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => startEdit(p)}
                                className="inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer active:scale-95 shrink-0"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <form action={handleDelete} className="inline-block shrink-0">
                                <input type="hidden" name="id" value={p.id} />
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-xs font-extrabold text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
                                  onClick={(e) => {
                                    if (!confirm(`Are you sure you want to delete ${p.name}?`)) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
