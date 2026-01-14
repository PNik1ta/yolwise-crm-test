"use client";

interface User {
  id: number;
  email: string;
  fullName: string | null;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
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
            <td>{u.fullName}</td>
            <td>{new Date(u.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
