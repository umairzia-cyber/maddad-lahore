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
  searchParams?: { mode?: string };
}) {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  const initialMode = searchParams?.mode === "signup" ? "signup" : "signin";

  return (
    <div style={{ padding: "16px 0 32px" }}>
      <AuthView
        currentUser={null}
        initialMode={initialMode}
        onNavigateMarketplace={() => {
          if (typeof window !== "undefined") window.location.href = "/";
        }}
        showToast={() => {}}
      />
    </div>
  );
}
