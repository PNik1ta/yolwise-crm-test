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
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("currentUserFullName");
      if (stored) {
        setCurrentUserName(stored);
      }
    }
  }, []);

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

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUserFullName");
    }

    router.replace("/login");
  }

  return (
    <section className="users-page">
      <div className="users-page-header">
        <p className="welcome-text">
          Welcome {currentUserName ?? "User"}! To logout click{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              void handleLogout();
            }}
          >
            here
          </a>
          .
        </p>
      </div>

      <UsersTable users={users} />
    </section>
  );
}
