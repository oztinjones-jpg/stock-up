import { isSharedKitchen } from "./kitchen-shape";
import type { SharedKitchen } from "./types";

export async function fetchKitchen(): Promise<SharedKitchen> {
  const response = await fetch("/api/kitchen", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not open the shared kitchen.");
  }
  const data: unknown = await response.json();
  if (!isSharedKitchen(data)) {
    throw new Error("The shared kitchen looks wrong.");
  }
  return data;
}

export async function saveKitchen(kitchen: SharedKitchen) {
  const response = await fetch("/api/kitchen", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(kitchen),
  });
  if (!response.ok) {
    throw new Error("Could not save the shared kitchen.");
  }
}
