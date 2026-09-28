"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LOCATIONS, STOCK_OPTIONS, type LocationId, type StockLevel } from "@/lib/types";

type FormValues = {
  name: string;
  location: LocationId;
  stock: StockLevel;
};

function ItemFormFields({
  title,
  description,
  confirmLabel,
  initialName,
  initialLocation,
  initialStock,
  showStock,
  removeLabel,
  onRemove,
  onSubmit,
  onOpenChange,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  initialName: string;
  initialLocation: LocationId;
  initialStock: StockLevel;
  showStock: boolean;
  removeLabel?: string;
  onRemove?: () => void;
  onSubmit: (input: FormValues) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState<LocationId>(initialLocation);
  const [stock, setStock] = useState<StockLevel>(initialStock);

  return (
    <>
      <SheetHeader className="pb-2">
        <SheetTitle className="text-xl">{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      <form
        className="flex flex-col gap-5 px-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ name, location, stock });
          onOpenChange(false);
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="item-name" className="text-base">
            Food name
          </Label>
          <Input
            id="item-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Pasta"
            className="h-12 text-base"
            autoFocus
          />
        </div>
        <div className="grid gap-2">
          <span className="text-base font-medium">Where it lives</span>
          <div className="grid grid-cols-3 gap-2">
            {LOCATIONS.map((entry) => (
              <Button
                key={entry.id}
                type="button"
                variant={location === entry.id ? "default" : "outline"}
                className="h-14 flex-col gap-0.5 whitespace-normal text-sm"
                onClick={() => setLocation(entry.id)}
              >
                {entry.label}
              </Button>
            ))}
          </div>
        </div>
        {showStock ? (
          <div className="grid gap-2">
            <span className="text-base font-medium">How much is left?</span>
            <div className="grid grid-cols-3 gap-2">
              {STOCK_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={stock === option.id ? "default" : "outline"}
                  className="h-14 flex-col gap-0.5 whitespace-normal"
                  onClick={() => setStock(option.id)}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-[11px] font-normal opacity-80">
                    {option.kidLabel}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
        <SheetFooter className="px-0 pt-2">
          <Button type="submit" className="h-12 w-full text-base">
            {confirmLabel}
          </Button>
          {onRemove ? (
            <Button
              type="button"
              variant="destructive"
              className="h-12 w-full text-base"
              onClick={() => {
                onRemove();
                onOpenChange(false);
              }}
            >
              {removeLabel ?? "Remove"}
            </Button>
          ) : null}
        </SheetFooter>
      </form>
    </>
  );
}

export function ItemFormSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  initialName = "",
  initialLocation = "cupboards",
  initialStock = "plenty",
  showStock = true,
  removeLabel,
  onRemove,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  initialName?: string;
  initialLocation?: LocationId;
  initialStock?: StockLevel;
  showStock?: boolean;
  removeLabel?: string;
  onRemove?: () => void;
  onSubmit: (input: FormValues) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90dvh] gap-0 rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {open ? (
          <ItemFormFields
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            initialName={initialName}
            initialLocation={initialLocation}
            initialStock={initialStock}
            showStock={showStock}
            removeLabel={removeLabel}
            onRemove={onRemove}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
