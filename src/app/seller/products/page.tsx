"use client";

import { useState } from "react";
import { getSellerProducts } from "@/modules/catalog/queries";
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const data = await getSellerProducts();
      setProducts(data ?? []);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditCat(p.category_id);
    setEditName(p.name);
    setEditDesc(p.description ?? "");
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Products</h1>
        <p className="text-muted-foreground">
          Manage your store&#39;s product listings
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

      {/* Add product form */}
      <div className="rounded-lg border bg-card p-4">
        <button
          type="button"
          onClick={() => setAdding(!adding)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/90 mb-4"
        >
          {adding ? "Hide" : "+"} Add product
        </button>

        {adding && (
          <form action={handleCreate} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category_id"
                  defaultValue={newCat}
                  required
                  placeholder="Category ID"
                  className="block w-full rounded-md border input bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Product name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={newName}
                  required
                  className="block w-full rounded-md border input bg-background text-foreground"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  defaultValue={newDesc}
                  rows={2}
                  className="block w-full rounded-md border input bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price (₱)</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={newPrice}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border input bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={newStock}
                  required
                  min="0"
                  className="block w-full rounded-md border input bg-background text-foreground"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Product image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Add product
            </button>
          </form>
        )}
      </div>

      {/* Product list */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Your products</h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products yet. Add your first product above.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">Stock</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isEditing = editingId === p.id;
                if (isEditing) {
                  return (
                    <tr key={p.id} className="border-b">
                      <td className="p-2">
                        <form action={handleUpdate} className="flex flex-col sm:flex-row gap-2">
                          <input type="hidden" name="id" value={p.id} />
                          <input
                            name="category_id"
                            defaultValue={editCat}
                            className="rounded-md border input bg-background text-foreground text-sm"
                          />
                          <input
                            name="name"
                            defaultValue={editName}
                            required
                            className="rounded-md border input bg-background text-foreground text-sm flex-1"
                          />
                          <input
                            name="price"
                            defaultValue={editPrice}
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            className="rounded-md border input bg-background text-foreground text-sm w-20"
                          />
                          <input
                            name="stock"
                            defaultValue={editStock}
                            required
                            type="number"
                            min="0"
                            className="rounded-md border input bg-background text-foreground text-sm w-16"
                          />
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="text-xs"
                          />
                          <input
                            type="hidden"
                            name="remove_image"
                            value="false"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // toggle remove image - simplified: we don't have a toggle UI here
                            }}
                            className="text-xs text-destructive hover:underline ml-2"
                          >
                            Remove image
                          </button>
                          <button
                            type="submit"
                            className="rounded-md border border-transparent bg-success px-3 py-1 text-xs font-semibold text-success-foreground shadow hover:bg-success/90"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-transparent bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground shadow hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                    </tr>
                  );
                }

                return (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-right">₱{Number(p.price).toFixed(2)}</td>
                    <td className="p-2 text-right">
                      {p.stock === 0 ? (
                        <span className="text-destructive">0</span>
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td className="p-2 text-right space-x-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <form action={handleDelete} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-destructive hover:underline"
                          onClick={(e) => {
                            if (!confirm("Delete this product?")) e.preventDefault();
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
        )}
      </div>
    </div>
  );
}
