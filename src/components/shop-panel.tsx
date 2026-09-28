"use client";

import { useState } from "react";
import { Check, CircleHelp, Plus, ShoppingBag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHousehold } from "@/lib/household-context";
import { locationLabel, reasonLabel } from "@/lib/labels";
import type { ListLine } from "@/lib/types";
import { ItemFormSheet } from "./item-form-sheet";

function outcomeTone(line: ListLine) {
  if (line.outcome === "bought") return "border-emerald-300 bg-emerald-50";
  if (line.outcome === "unavailable") return "border-amber-300 bg-amber-50";
  return "";
}

export function ShopPanel() {
  const {
    state,
    addNeededToList,
    removeFromList,
    setLineOutcome,
    finishShop,
  } = useHousehold();
  const [adding, setAdding] = useState(false);

  const openCount = state.currentList.filter((line) => line.outcome === "open").length;
  const boughtCount = state.currentList.filter((line) => line.outcome === "bought").length;
  const missedCount = state.currentList.filter(
    (line) => line.outcome === "unavailable",
  ).length;

  if (state.currentList.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Nothing to buy this week</CardTitle>
            <CardDescription className="text-base">
              Everything in the kitchen is Plenty. Add something you still want,
              or mark food as Low or Out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="h-12 w-full text-base" onClick={() => setAdding(true)}>
              <Plus />
              Add to the shop
            </Button>
          </CardContent>
        </Card>
        <ItemFormSheet
          open={adding}
          onOpenChange={setAdding}
          title="Add to this week's shop"
          description="Use this for extras that are not already in the kitchen."
          confirmLabel="Add to shop"
          showStock={false}
          onSubmit={(input) =>
            addNeededToList({ name: input.name, location: input.location })
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">This week&apos;s shop</h2>
        <p className="mt-1 text-base text-muted-foreground">
          At the store, tap Got it or Shop didn&apos;t have it. Anything missing
          rolls onto next week.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-muted px-2 py-3">
          <p className="text-xl font-semibold">{openCount}</p>
          <p className="text-muted-foreground">To do</p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-2 py-3">
          <p className="text-xl font-semibold">{boughtCount}</p>
          <p className="text-muted-foreground">Got it</p>
        </div>
        <div className="rounded-xl bg-amber-50 px-2 py-3">
          <p className="text-xl font-semibold">{missedCount}</p>
          <p className="text-muted-foreground">Next week</p>
        </div>
      </div>

      <div className="grid gap-3">
        {state.currentList.map((line) => (
          <Card key={line.id} className={`py-4 ${outcomeTone(line)}`}>
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium leading-tight">{line.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locationLabel(line.location)}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {reasonLabel(line.reason)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  className="h-12"
                  onClick={() => removeFromList(line.id)}
                >
                  <X />
                  Take off
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={line.outcome === "bought" ? "default" : "outline"}
                  className="h-14 flex-col gap-0.5 text-base"
                  onClick={() =>
                    setLineOutcome(
                      line.id,
                      line.outcome === "bought" ? "open" : "bought",
                    )
                  }
                >
                  <Check className="size-5" />
                  Got it
                </Button>
                <Button
                  type="button"
                  variant={line.outcome === "unavailable" ? "default" : "outline"}
                  className="h-14 flex-col gap-0.5 whitespace-normal text-sm"
                  onClick={() =>
                    setLineOutcome(
                      line.id,
                      line.outcome === "unavailable" ? "open" : "unavailable",
                    )
                  }
                >
                  <CircleHelp className="size-5" />
                  Shop didn&apos;t have it
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="h-12 w-full text-base" variant="outline" onClick={() => setAdding(true)}>
        <Plus />
        Add something else
      </Button>

      <div className="sticky bottom-24 z-20 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <Button className="h-14 w-full text-base" onClick={() => finishShop()}>
          <ShoppingBag />
          Finish shop and save
        </Button>
      </div>

      <ItemFormSheet
        open={adding}
        onOpenChange={setAdding}
        title="Add to this week's shop"
        description="Use this for extras that are not already in the kitchen."
        confirmLabel="Add to shop"
        showStock={false}
        onSubmit={(input) =>
          addNeededToList({ name: input.name, location: input.location })
        }
      />
    </div>
  );
}
