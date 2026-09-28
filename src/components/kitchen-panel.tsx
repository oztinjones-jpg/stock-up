"use client";

import { useMemo, useState } from "react";
import { PackagePlus, Pencil, Refrigerator, Snowflake, Trash2, Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useHousehold } from "@/lib/household-context";
import { locationLabel } from "@/lib/labels";
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
  const [addingLocation, setAddingLocation] = useState<LocationId | null>(null);
  const [editing, setEditing] = useState<KitchenItem | null>(null);
  const [removing, setRemoving] = useState<KitchenItem | null>(null);
  const [filter, setFilter] = useState<LocationId | "all">("all");

  const grouped = useMemo(() => {
    const visible =
      filter === "all"
        ? state.items
        : state.items.filter((item) => item.location === filter);
    return LOCATIONS.filter((location) => filter === "all" || filter === location.id).map(
      (location) => ({
        ...location,
        items: visible
          .filter((item) => item.location === location.id)
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name)),
      }),
    );
  }, [filter, state.items]);

  const sheets = (
    <>
      <ItemFormSheet
        key={addingLocation ?? "add"}
        open={addingLocation !== null}
        onOpenChange={(open) => {
          if (!open) setAddingLocation(null);
        }}
        title={
          addingLocation
            ? `Add food to the ${locationLabel(addingLocation).toLowerCase()}`
            : "Add a food"
        }
        description="Name it and say how much is left. Kids can do this too."
        confirmLabel="Add this food"
        initialLocation={addingLocation ?? "cupboards"}
        lockLocation={addingLocation !== null}
        onSubmit={(input) => {
          addItem({
            ...input,
            location: addingLocation ?? input.location,
          });
        }}
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
          removeLabel={`Remove from ${locationLabel(editing.location).toLowerCase()}`}
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
      <Sheet
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="gap-0 rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          {removing ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">Remove {removing.name}?</SheetTitle>
                <SheetDescription className="text-base">
                  This takes it out of the{" "}
                  {locationLabel(removing.location).toLowerCase()} and off this
                  week&apos;s shop. You can add it again later.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button
                  className="h-12 w-full text-base"
                  variant="destructive"
                  onClick={() => {
                    removeItem(removing.id);
                    setRemoving(null);
                  }}
                >
                  Yes, remove it
                </Button>
                <Button
                  className="h-12 w-full text-base"
                  variant="outline"
                  onClick={() => setRemoving(null)}
                >
                  Keep it
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Kitchen stock</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Add or remove food in each place. Tap Plenty, Low, or Out. Low and Out
          go on this week&apos;s shop.
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

      {grouped.map((group) => {
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
            {group.items.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Nothing in the {group.label.toLowerCase()} yet</CardTitle>
                  <CardDescription className="text-base">
                    Add the foods you keep here.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <Card key={item.id} className="py-4">
                    <CardContent className="flex flex-col gap-3 px-4">
                      <div>
                        <p className="text-lg font-medium leading-tight">{item.name}</p>
                        <Badge className={`mt-2 border-0 ${stockTone(item.stock)}`}>
                          {
                            STOCK_OPTIONS.find((option) => option.id === item.stock)
                              ?.kidLabel
                          }
                        </Badge>
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
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="h-12"
                          onClick={() => setEditing(item)}
                        >
                          <Pencil />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="h-12"
                          onClick={() => setRemoving(item)}
                        >
                          <Trash2 />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="h-12 w-full text-base"
              onClick={() => setAddingLocation(group.id)}
            >
              <PackagePlus />
              Add to {group.label.toLowerCase()}
            </Button>
          </section>
        );
      })}
      {sheets}
    </div>
  );
}
