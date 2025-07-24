"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button, Input, Typography, Card, CardBody, Chip, Select, Option } from "@material-tailwind/react";
import { getAllAccounts, createStaffAccount, banAccount, unbanAccount, deleteAccount, searchAccounts } from "@/lib/api";

interface Account {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export default function AdminAccountsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ username: string; fullName: string; email: string; password: string }>({ username: "", fullName: "", email: "", password: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "0") {
      // router.replace("/forbidden");
      return;
    }
    getAllAccounts()
      .then(accs => setAccounts(accs.map((a: any) => ({ ...a, role: a.role?.toString() ?? "" }))))
      .catch(() => setError("Failed to load accounts"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      const newAccount = await createStaffAccount(form);
      setAccounts([...accounts, newAccount]);
      setForm({ username: "", fullName: "", email: "", password: "" });
      setSuccess("Staff account created.");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      if (search.trim() === "") {
        const accs = await getAllAccounts();
        setAccounts(accs.map((a: any) => ({ ...a, role: a.role?.toString() ?? "" })));
      } else {
        const results = await searchAccounts(search);
        setAccounts(results);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearch("");
    setSearching(true);
    try {
      const accs = await getAllAccounts();
      setAccounts(accs.map((a: any) => ({ ...a, role: a.role?.toString() ?? "" })));
    } finally {
      setSearching(false);
    }
  };

  const handleBan = async (id: number) => {
    await banAccount(id);
    setAccounts(accounts.map(acc => {
      if (acc.id === id && acc.role !== "0") {
        const newRole = (parseInt(acc.role || "1") + 90).toString();
        return { ...acc, role: newRole };
      }
      return acc;
    }));
  };
  const handleUnban = async (id: number) => {
    await unbanAccount(id);
    setAccounts(accounts.map(acc => {
      if (acc.id === id && acc.role !== "0") {
        const newRole = (parseInt(acc.role || "91") - 90).toString();
        return { ...acc, role: newRole };
      }
      return acc;
    }));
  };
  const handleDelete = async (id: number) => {
    await deleteAccount(id);
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  // Filter accounts by role
  const filteredAccounts = roleFilter === "all"
    ? accounts
    : accounts.filter(acc => {
        if (roleFilter === "staff") return acc.role === "2";
        if (roleFilter === "user") return acc.role === "1";
        if (roleFilter === "banned") return parseInt(acc.role) > 90;
        return true;
      });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Typography variant="h3" className="mb-6">Account Management</Typography>
      {/* Search Bar & Role Filter */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <Input
          label="Search by username, email, or name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          label="Role Filter"
          value={roleFilter}
          onChange={val => setRoleFilter(val || "all")}
          className="min-w-[150px]"
        >
          <Option value="all">All</Option>
          <Option value="staff">Staff</Option>
          <Option value="user">User</Option>
          <Option value="banned">Banned</Option>
        </Select>
        <Button type="submit" color="blue" disabled={searching}>Search</Button>
        {search && <Button type="button" color="gray" onClick={handleClearSearch}>Clear</Button>}
      </form>

      {/* Create Staff Account Form*/}
      <form onSubmit={handleCreate} className="mb-8 space-y-4">
        <Typography variant="h5">Create Staff Account</Typography>
        <Input label="Username" name="username" value={form.username} onChange={handleInputChange} required />
        <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleInputChange} required />
        <Input label="Email" name="email" value={form.email} onChange={handleInputChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleInputChange} required />
        <Button type="submit" color="blue">Create Staff</Button>
        {success && <Typography color="green">{success}</Typography>}
      </form>

      {/* Accounts List */}
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">Accounts</Typography>
          <ul className="space-y-2">
            {filteredAccounts.map(acc => (
              <li key={acc.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <Typography variant="h6">{acc.fullName} ({acc.username})</Typography>
                  <Typography variant="small" color="gray">{acc.email}</Typography>
                </div>
                
                  <div className="flex gap-2 items-center justify-center w-full flex-1 flex-col md:flex-row md:justify-end md:w-auto pr-12">
                    <Chip
                      color={parseInt(acc.role) > 90 ? "gray" : acc.role === "2" ? "blue" : "green"}
                      value={parseInt(acc.role) > 90 ? "Banned" : acc.role === "2" ? "Staff" : acc.role === "1" ? "Author" : "Unknown"}
                      size="sm"
                      className="ml-2"
                    />
                  </div>
                
                <div className="flex gap-2">
                  {acc.role !== "0" && parseInt(acc.role) <= 90 && (
                    <Button size="sm" color="red" onClick={() => handleBan(acc.id)}>Ban</Button>
                  )}
                  {acc.role !== "0" && parseInt(acc.role) > 90 && (
                    <Button size="sm" color="green" onClick={() => handleUnban(acc.id)}>Unban</Button>
                  )}
                  {acc.role !== "0" && (
                    <Button size="sm" color="gray" onClick={() => handleDelete(acc.id)}>Delete</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
} 