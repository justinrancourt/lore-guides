"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site-url";

export interface AuthFormState {
  error: string | null;
}

function emailFrom(formData: FormData): string | null {
  const raw = formData.get("email");
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
}

export async function sendLoginLink(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = emailFrom(formData);
  if (!email) return { error: "Please enter a valid email." };

  const next = (formData.get("next") as string | null) ?? "/home";
  const supabase = await createClient();
  const origin = await siteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // Existing users only — don't create a profile on sign-in attempts
      // for unknown emails (signup is its own flow).
      shouldCreateUser: false,
    },
  });

  if (error) return { error: error.message };

  redirect(`/login?sent=${encodeURIComponent(email)}`);
}

export async function sendSignupLink(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = emailFrom(formData);
  if (!email) return { error: "Please enter a valid email." };

  const displayNameRaw = formData.get("display_name");
  const displayName =
    typeof displayNameRaw === "string" ? displayNameRaw.trim() : "";
  if (displayName.length < 1) {
    return { error: "Tell us your name so guides have a byline." };
  }

  const next = (formData.get("next") as string | null) ?? "/home";
  const supabase = await createClient();
  const origin = await siteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
      // The handle_new_user trigger reads display_name out of this metadata.
      data: { display_name: displayName },
    },
  });

  if (error) return { error: error.message };

  redirect(`/signup?sent=${encodeURIComponent(email)}`);
}
