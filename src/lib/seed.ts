import { MEMBERS, type AppState, type KitchenItem, type ListLine } from "./types";

export function listLineForItem(kitchenItem: KitchenItem): ListLine {
  const reason =
    kitchenItem.stock === "out"
      ? "out"
      : kitchenItem.stock === "low"
        ? "low"
        : "needed";
  return {
    id: `line-${kitchenItem.id}`,
    name: kitchenItem.name,
    itemId: kitchenItem.id,
    location: kitchenItem.location,
    reason,
    outcome: "open",
  };
}

export function createSeedState(): AppState {
  return {
    version: 1,
    currentMemberId: MEMBERS[0].id,
    items: [],
    currentList: [],
    history: [],
  };
}
