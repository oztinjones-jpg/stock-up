import { MEMBERS } from "./types";
import { remapMemberId } from "./kitchen-shape";

export const MEMBER_KEY = "kitchen-member-v1";
export const LEGACY_STATE_KEY = "kitchen-stock-v1";

export function loadMemberId(): string {
  if (typeof window === "undefined") return MEMBERS[0].id;
  const stored = window.localStorage.getItem(MEMBER_KEY);
  if (stored) return remapMemberId(stored);
  try {
    const legacy = window.localStorage.getItem(LEGACY_STATE_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      if (
        parsed &&
        typeof parsed === "object" &&
        "currentMemberId" in parsed &&
        typeof parsed.currentMemberId === "string"
      ) {
        return remapMemberId(parsed.currentMemberId);
      }
    }
  } catch {
    // ignore broken leftover data
  }
  return MEMBERS[0].id;
}

export function saveMemberId(id: string) {
  window.localStorage.setItem(MEMBER_KEY, remapMemberId(id));
}
