"use client";

import { History, Refrigerator, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHousehold } from "@/lib/household-context";
import { MEMBERS } from "@/lib/types";
import { HistoryPanel } from "./history-panel";
import { KitchenPanel } from "./kitchen-panel";
import { ShopPanel } from "./shop-panel";

type Tab = "kitchen" | "shop" | "history";

export function AppShell() {
  const { status, errorMessage, state, setCurrentMember, restoreDemo } =
    useHousehold();
  const [tab, setTab] = useState<Tab>("kitchen");
  const shopCount = state.currentList.length;

  if (status === "error") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Could not load the kitchen</CardTitle>
            <CardDescription className="text-base">
              {errorMessage ??
                "Saved data on this phone looks broken. You can start again with the sample kitchen."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="h-12 w-full text-base" onClick={restoreDemo}>
              Restore sample kitchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <p className="text-sm font-medium text-muted-foreground">Household kitchen</p>
        <h1 className="text-lg font-semibold tracking-tight">Who is using this?</h1>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {MEMBERS.map((member) => (
            <Button
              key={member.id}
              variant={state.currentMemberId === member.id ? "default" : "outline"}
              className="h-12 min-w-[5.5rem] shrink-0 px-3 text-base font-semibold"
              onClick={() => setCurrentMember(member.id)}
            >
              {member.name}
            </Button>
          ))}
        </div>
      </header>

      <main className={`flex-1 px-4 py-4 ${tab === "shop" ? "pb-44" : "pb-28"}`}>
        {tab === "kitchen" ? <KitchenPanel /> : null}
        {tab === "shop" ? <ShopPanel /> : null}
        {tab === "history" ? <HistoryPanel /> : null}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 px-2">
          <Button
            variant={tab === "kitchen" ? "default" : "ghost"}
            className="h-16 flex-col gap-1 text-xs"
            onClick={() => setTab("kitchen")}
          >
            <Refrigerator className="size-5" />
            Kitchen
          </Button>
          <Button
            variant={tab === "shop" ? "default" : "ghost"}
            className="h-16 flex-col gap-1 text-xs"
            onClick={() => setTab("shop")}
          >
            <ShoppingCart className="size-5" />
            Shop{shopCount ? ` (${shopCount})` : ""}
          </Button>
          <Button
            variant={tab === "history" ? "default" : "ghost"}
            className="h-16 flex-col gap-1 text-xs"
            onClick={() => setTab("history")}
          >
            <History className="size-5" />
            Past shops
          </Button>
        </div>
      </nav>
    </div>
  );
}
