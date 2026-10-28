import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthView } from "@/components/maddad/AuthView";

export const metadata: Metadata = {
  title: "Sign In & Sign Up · Maddadgaar Lahore",
  description: "Sign in or register for Maddadgaar Lahore to post plumbing & electrical jobs or bid as an independent technician.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { mode?: string; next?: string; role?: string };
}) {
  const user = await getUser();

  if (user) {
    const next = searchParams?.next;
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
    redirect(safeNext);
  }

  const initialMode = searchParams?.mode === "signup" ? "signup" : "signin";
  const initialRole = searchParams?.role === "worker" ? "worker" : "customer";

  return (
    <div style={{ padding: "16px 0 32px" }}>
      <AuthView
        currentUser={null}
        initialMode={initialMode}
        initialRole={initialRole}
      />
    </div>
  );
}
