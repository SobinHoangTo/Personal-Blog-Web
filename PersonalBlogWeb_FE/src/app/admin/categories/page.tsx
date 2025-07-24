"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAllCategories, createCategory, updateCategory } from "@/lib/api";
import { Category } from "@/components/types/category";
import { Button, Input, Typography, Card, CardBody } from "@material-tailwind/react";

export default function AdminCategoriesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; description?: string }>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "0") {
    //   router.replace("/forbidden");
      return;
    }
    getAllCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setCategories(categories.map(cat => cat.id === editingId ? { ...cat, ...form } : cat));
      } else {
        const newCat = await createCategory(form);
        setCategories([...categories, newCat]);
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat.id);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Typography variant="h3" className="mb-6">Category Management</Typography>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
        />
        <Button type="submit" color="blue">
          {editingId ? "Update Category" : "Create Category"}
        </Button>
        {editingId && (
          <Button type="button" color="gray" onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }}>
            Cancel
          </Button>
        )}
      </form>
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">Categories</Typography>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <Typography variant="h6">{cat.name}</Typography>
                  <Typography variant="small" color="gray">{cat.description}</Typography>
                </div>
                <Button size="sm" color="blue" onClick={() => handleEdit(cat)}>Edit</Button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
} 