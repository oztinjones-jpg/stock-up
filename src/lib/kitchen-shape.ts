import type { AppState, SharedKitchen } from "./types";
import { MEMBERS } from "./types";

const MEMBER_ALIASES: Record<string, string> = {
  maya: "monica",
  leo: "alex",
  nina: "lara",
};

export function remapMemberId(id: string) {
  const mapped = MEMBER_ALIASES[id] ?? id;
  return MEMBERS.some((member) => member.id === mapped) ? mapped : MEMBERS[0].id;
}

export function isSharedKitchen(value: unknown): value is SharedKitchen {
  if (!value || typeof value !== "object") return false;
  const kitchen = value as SharedKitchen;
  return (
    kitchen.version === 1 &&
    Array.isArray(kitchen.items) &&
    Array.isArray(kitchen.currentList) &&
    Array.isArray(kitchen.history)
  );
}

export function toSharedKitchen(state: AppState): SharedKitchen {
  return {
    version: 1,
    items: state.items,
    currentList: state.currentList,
    history: state.history.map((shop) => ({
      ...shop,
      finishedById: remapMemberId(shop.finishedById),
    })),
  };
}

export function withMember(
  kitchen: SharedKitchen,
  currentMemberId: string,
): AppState {
  return {
    ...kitchen,
    currentMemberId: remapMemberId(currentMemberId),
  };
}
