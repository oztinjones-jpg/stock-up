import { MEMBERS, type AppState, type KitchenItem, type ListLine } from "./types";

function item(
  id: string,
  name: string,
  location: KitchenItem["location"],
  stock: KitchenItem["stock"],
): KitchenItem {
  return { id, name, location, stock };
}

export function listLineForItem(kitchenItem: KitchenItem): ListLine {
  const reason =
    kitchenItem.stock === "out"
      ? "out"
      : kitchenItem.stock === "low"
        ? "low"
        : "needed";
  return {
    id: `line-${kitchenItem.id}`,
    itemId: kitchenItem.id,
    name: kitchenItem.name,
    location: kitchenItem.location,
    reason,
    outcome: "open",
  };
}

export function createSeedState(): AppState {
  const items: KitchenItem[] = [
    item("pasta", "Pasta", "cupboards", "low"),
    item("rice", "Rice", "cupboards", "plenty"),
    item("oats", "Porridge oats", "cupboards", "plenty"),
    item("tinned-tomatoes", "Tinned tomatoes", "cupboards", "out"),
    item("olive-oil", "Olive oil", "cupboards", "low"),
    item("beans", "Baked beans", "cupboards", "plenty"),
    item("cereal", "Cereal", "cupboards", "low"),
    item("milk", "Milk", "fridge", "low"),
    item("butter", "Butter", "fridge", "plenty"),
    item("eggs", "Eggs", "fridge", "out"),
    item("cheese", "Cheddar", "fridge", "plenty"),
    item("yogurt", "Yogurt", "fridge", "low"),
    item("peas", "Frozen peas", "freezer", "plenty"),
    item("bread", "Sliced bread", "freezer", "out"),
    item("berries", "Frozen berries", "freezer", "low"),
    item("fish-fingers", "Fish fingers", "freezer", "plenty"),
  ];

  const currentList: ListLine[] = items
    .filter((entry) => entry.stock !== "plenty")
    .map(listLineForItem);

  currentList.push({
    id: "line-rolled-hummus",
    itemId: null,
    name: "Hummus",
    location: "fridge",
    reason: "rolled",
    outcome: "open",
  });

  return {
    version: 1,
    currentMemberId: MEMBERS[0].id,
    items,
    currentList,
    history: [
      {
        id: "shop-last-sunday",
        finishedAt: "2026-09-21T16:40:00.000Z",
        finishedById: "monica",
        lines: [
          {
            name: "Milk",
            location: "fridge",
            reason: "low",
            outcome: "bought",
          },
          {
            name: "Bananas",
            location: "cupboards",
            reason: "needed",
            outcome: "bought",
          },
          {
            name: "Hummus",
            location: "fridge",
            reason: "needed",
            outcome: "unavailable",
          },
          {
            name: "Frozen berries",
            location: "freezer",
            reason: "out",
            outcome: "bought",
          },
        ],
      },
    ],
  };
}
