"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../../components/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (fullName: string | null) => {
    if (typeof window !== "undefined" && fullName) {
      window.localStorage.setItem("currentUserFullName", fullName);
    }
    router.replace("/");
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <AuthForm onSuccess={handleSuccess} />
      </div>
    </section>
  );
}
