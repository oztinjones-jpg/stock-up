"use client";

import { Toaster } from "sonner";
import { HouseholdProvider } from "@/lib/household-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      {children}
      <Toaster position="top-center" theme="light" />
    </HouseholdProvider>
  );
}
