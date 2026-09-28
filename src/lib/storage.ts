import { createSeedState } from "./seed";
import type { AppState } from "./types";
import { MEMBERS } from "./types";

export const STORAGE_KEY = "kitchen-stock-v1";

const MEMBER_ID_ALIASES: Record<string, string> = {
  maya: "monica",
  leo: "alex",
  nina: "lara",
};

function remapMemberId(id: string) {
  return MEMBER_ID_ALIASES[id] ?? id;
}

export function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const state = value as AppState;
  return (
    state.version === 1 &&
    typeof state.currentMemberId === "string" &&
    Array.isArray(state.items) &&
    Array.isArray(state.currentList) &&
    Array.isArray(state.history)
  );
}

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return createSeedState();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createSeedState();
  }
  const parsed: unknown = JSON.parse(raw);
  if (!isAppState(parsed)) {
    throw new Error("Saved kitchen data looks wrong.");
  }
  parsed.currentMemberId = remapMemberId(parsed.currentMemberId);
  parsed.history = parsed.history.map((shop) => ({
    ...shop,
    finishedById: remapMemberId(shop.finishedById),
  }));
  if (!MEMBERS.some((member) => member.id === parsed.currentMemberId)) {
    parsed.currentMemberId = MEMBERS[0].id;
  }
  return parsed;
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
