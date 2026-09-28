"use client";

import { useState } from "react";
import { Check, CircleHelp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHousehold } from "@/lib/household-context";
import { formatShopDate, locationLabel, memberName } from "@/lib/labels";

export function HistoryPanel() {
  const { state } = useHousehold();
  const [openId, setOpenId] = useState<string | null>(state.history[0]?.id ?? null);

  if (state.history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">No past shops yet</CardTitle>
          <CardDescription className="text-base">
            When someone finishes this week&apos;s shop, it shows up here — what
            we bought, and what the shop did not have.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Past shops</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Tap a shop to see what came home and what rolled to next week.
        </p>
      </div>
      <div className="grid gap-3">
        {state.history.map((shop) => {
          const bought = shop.lines.filter((line) => line.outcome === "bought");
          const missed = shop.lines.filter((line) => line.outcome === "unavailable");
          const expanded = openId === shop.id;
          return (
            <Card key={shop.id} className="py-0">
              <button
                type="button"
                className="flex min-h-16 w-full items-center gap-3 px-4 py-4 text-left"
                onClick={() => setOpenId(expanded ? null : shop.id)}
                aria-expanded={expanded}
              >
                <History className="size-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium leading-tight">
                    {formatShopDate(shop.finishedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Finished by {memberName(shop.finishedById)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary">{bought.length} got</Badge>
                  {missed.length > 0 ? (
                    <Badge className="border-0 bg-amber-100 text-amber-950">
                      {missed.length} next week
                    </Badge>
                  ) : null}
                </div>
              </button>
              {expanded ? (
                <CardContent className="space-y-4 border-t px-4 py-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Came home</p>
                    {bought.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nothing this trip.</p>
                    ) : (
                      <ul className="space-y-2">
                        {bought.map((line, index) => (
                          <li
                            key={`${line.name}-${index}`}
                            className="flex items-start gap-2 text-base"
                          >
                            <Check className="mt-0.5 size-4 shrink-0" />
                            <span>
                              {line.name}
                              <span className="text-muted-foreground">
                                {" "}
                                · {locationLabel(line.location)}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Shop didn&apos;t have it</p>
                    {missed.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Everything on the list was found.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {missed.map((line, index) => (
                          <li
                            key={`${line.name}-miss-${index}`}
                            className="flex items-start gap-2 text-base"
                          >
                            <CircleHelp className="mt-0.5 size-4 shrink-0" />
                            <span>
                              {line.name}
                              <span className="text-muted-foreground">
                                {" "}
                                · rolled to next list
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
