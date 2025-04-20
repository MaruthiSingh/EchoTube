// src/components/AuthButtons.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession(); // Get session data using next-auth's `useSession` hook

  if (session) {
    // If the user is logged in, show a "Sign Out" button
    return (
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    );
  }

  // If the user is not logged in, show a "Sign In" button
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "http://localhost:3000" })}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Sign In
    </button>
  );
}
