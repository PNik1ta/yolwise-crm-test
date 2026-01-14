"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../../components/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <AuthForm onSuccess={() => router.replace("/")} />
      </div>
    </section>
  );
}
