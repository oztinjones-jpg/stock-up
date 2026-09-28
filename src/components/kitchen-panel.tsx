"use client";

import { useMemo, useState } from "react";
import { PackagePlus, Pencil, Refrigerator, Snowflake, Warehouse } from "lucide-react";
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
import { LOCATIONS, STOCK_OPTIONS, type KitchenItem, type LocationId } from "@/lib/types";
import { ItemFormSheet } from "./item-form-sheet";

const ICONS = {
  cupboards: Warehouse,
  fridge: Refrigerator,
  freezer: Snowflake,
};

function stockTone(stock: KitchenItem["stock"]) {
  if (stock === "plenty") return "bg-emerald-100 text-emerald-900";
  if (stock === "low") return "bg-amber-100 text-amber-950";
  return "bg-rose-100 text-rose-950";
}

export function KitchenPanel() {
  const { state, setItemStock, addItem, updateItem, removeItem } = useHousehold();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<KitchenItem | null>(null);
  const [filter, setFilter] = useState<LocationId | "all">("all");

  const grouped = useMemo(() => {
    const visible =
      filter === "all"
        ? state.items
        : state.items.filter((item) => item.location === filter);
    return LOCATIONS.map((location) => ({
      ...location,
      items: visible
        .filter((item) => item.location === location.id)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    })).filter((group) => group.items.length > 0 || filter === group.id);
  }, [filter, state.items]);

  const sheets = (
    <>
      <ItemFormSheet
        open={adding}
        onOpenChange={setAdding}
        title="Add a food"
        description="Name it, pick a place, say how much is left."
        confirmLabel="Add to kitchen"
        onSubmit={addItem}
      />
      {editing ? (
        <ItemFormSheet
          key={editing.id}
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
          title={`Edit ${editing.name}`}
          description="Change the name, place, or how much is left."
          confirmLabel="Save"
          initialName={editing.name}
          initialLocation={editing.location}
          initialStock={editing.stock}
          removeLabel="Remove from kitchen"
          onRemove={() => {
            removeItem(editing.id);
            setEditing(null);
          }}
          onSubmit={(input) => {
            updateItem(editing.id, input);
            setEditing(null);
          }}
        />
      ) : null}
    </>
  );

  if (state.items.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Kitchen is empty</CardTitle>
            <CardDescription className="text-base">
              Add the foods you keep at home. Start with pasta, milk, or
              whatever you cook with most weeks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="h-12 w-full text-base" onClick={() => setAdding(true)}>
              <PackagePlus />
              Add first food
            </Button>
          </CardContent>
        </Card>
        {sheets}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Kitchen stock</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Tap how much is left. Low and Out go on this week&apos;s shop.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          className="h-12 text-base"
          onClick={() => setFilter("all")}
        >
          All places
        </Button>
        {LOCATIONS.map((location) => (
          <Button
            key={location.id}
            variant={filter === location.id ? "default" : "outline"}
            className="h-12 text-base"
            onClick={() => setFilter(location.id)}
          >
            {location.label}
          </Button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nothing in this place</CardTitle>
            <CardDescription className="text-base">
              Add food here, or pick another cupboard, fridge, or freezer view.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        grouped.map((group) => {
          const Icon = ICONS[group.id];
          return (
            <section key={group.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="size-5 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium leading-tight">{group.label}</h3>
                  <p className="text-sm text-muted-foreground">{group.hint}</p>
                </div>
              </div>
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <Card key={item.id} className="py-4">
                    <CardContent className="flex flex-col gap-3 px-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-medium leading-tight">{item.name}</p>
                          <Badge className={`mt-2 border-0 ${stockTone(item.stock)}`}>
                            {
                              STOCK_OPTIONS.find((option) => option.id === item.stock)
                                ?.kidLabel
                            }
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="h-12 min-w-12"
                          onClick={() => setEditing(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil />
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {STOCK_OPTIONS.map((option) => (
                          <Button
                            key={option.id}
                            type="button"
                            variant={item.stock === option.id ? "default" : "outline"}
                            className="h-12 text-sm"
                            onClick={() => setItemStock(item.id, option.id)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      )}

      <Button className="h-12 w-full text-base" onClick={() => setAdding(true)}>
        <PackagePlus />
        Add food
      </Button>
      {sheets}
    </div>
  );
}
