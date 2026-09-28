export type LocationId = "cupboards" | "fridge" | "freezer";

export type StockLevel = "plenty" | "low" | "out";

export type ListReason = "low" | "out" | "needed" | "rolled";

export type LineOutcome = "open" | "bought" | "unavailable";

export type MemberKind = "adult" | "kid";

export interface HouseholdMember {
  id: string;
  name: string;
  kind: MemberKind;
}

export interface KitchenItem {
  id: string;
  name: string;
  location: LocationId;
  stock: StockLevel;
}

export interface ListLine {
  id: string;
  itemId: string | null;
  name: string;
  location: LocationId;
  reason: ListReason;
  outcome: LineOutcome;
}

export interface ShopLineRecord {
  name: string;
  location: LocationId;
  reason: ListReason;
  outcome: "bought" | "unavailable";
}

export interface ShopRecord {
  id: string;
  finishedAt: string;
  finishedById: string;
  lines: ShopLineRecord[];
}

export interface AppState {
  version: 1;
  currentMemberId: string;
  items: KitchenItem[];
  currentList: ListLine[];
  history: ShopRecord[];
}

export const LOCATIONS: { id: LocationId; label: string; hint: string }[] = [
  { id: "cupboards", label: "Cupboards", hint: "Dry food, tins, snacks" },
  { id: "fridge", label: "Fridge", hint: "Cold food that spoils" },
  { id: "freezer", label: "Freezer", hint: "Frozen food" },
];

export const MEMBERS: HouseholdMember[] = [
  { id: "austin", name: "Austin", kind: "adult" },
  { id: "monica", name: "Monica", kind: "adult" },
  { id: "alex", name: "Alex", kind: "kid" },
  { id: "lara", name: "Lara", kind: "kid" },
];

export const STOCK_OPTIONS: {
  id: StockLevel;
  label: string;
  kidLabel: string;
}[] = [
  { id: "plenty", label: "Plenty", kidLabel: "We have enough" },
  { id: "low", label: "Low", kidLabel: "Almost gone" },
  { id: "out", label: "Out", kidLabel: "None left" },
];
