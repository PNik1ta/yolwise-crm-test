"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
			<h2>Users</h2>
			<button className="secondary-btn" onClick={handleLogout}>
				Logout
			</button>
			{users.length === 0 ? (
				<p>No users found.</p>
			) : (
				<table className="users-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Email</th>
							<th>Full name</th>
							<th>Created at</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id}>
								<td>{u.id}</td>
								<td>{u.email}</td>
								<td>{u.fullName ?? "—"}</td>
								<td>{new Date(u.createdAt).toLocaleString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</section>
	);
}
