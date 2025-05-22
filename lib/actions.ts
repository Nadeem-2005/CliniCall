import { signOut } from "@/auth";

export async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}