"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <form
      action={() => {
        signOut({ redirectTo: "/" });
      }}
    >
      <button>Sign Out</button>
    </form>
  );
}
