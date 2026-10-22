import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthView } from "@/components/maddad/AuthView";

export const metadata: Metadata = {
  title: "Create Account · Maddadgaar Lahore",
  description: "Create an account on Maddadgaar Lahore to post plumbing & electrical jobs or bid as an independent technician.",
};

export default async function SignUpPage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div style={{ padding: "16px 0 32px" }}>
      <AuthView
        currentUser={null}
        initialMode="signup"
      />
    </div>
  );
}
