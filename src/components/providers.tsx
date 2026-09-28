"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { HouseholdProvider } from "@/lib/household-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <HouseholdProvider>
        {children}
        <Toaster position="top-center" />
      </HouseholdProvider>
    </ThemeProvider>
  );
}
