"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UsersTable } from "../components/UserTable";
import { apiFetch } from "../lib/api";

interface User {
  id: number;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      const { data, status } = await apiFetch<User[]>("/api/users");

      if (cancelled) return;

      if (status === 401) {
        router.replace("/login");
        return;
      }

      if (status >= 400) {
        setError("Failed to load users");
      } else if (Array.isArray(data)) {
        setUsers(data);
      }

      setLoading(false);
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  async function handleLogout() {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
    router.replace("/login");
  }

  return (
    <section className="users-page">
      <div className="users-page-header">
        <h2>Users</h2>
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <UsersTable users={users} />
    </section>
  );
}
