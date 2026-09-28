import { LOCATIONS, MEMBERS, type ListReason, type LocationId } from "./types";

export function locationLabel(id: LocationId) {
  return LOCATIONS.find((location) => location.id === id)?.label ?? id;
}

export function memberName(id: string) {
  return MEMBERS.find((member) => member.id === id)?.name ?? "Someone";
}

export function reasonLabel(reason: ListReason) {
  switch (reason) {
    case "low":
      return "Almost gone";
    case "out":
      return "None left";
    case "needed":
      return "We need this";
    case "rolled":
      return "Shop didn't have it last time";
  }
}

export function formatShopDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
