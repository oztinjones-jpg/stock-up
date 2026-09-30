import { createSeedState } from "./seed";
import { isSharedKitchen, toSharedKitchen } from "./kitchen-shape";
import type { SharedKitchen } from "./types";

type GlobalKitchen = typeof globalThis & {
  __stockUpKitchen?: SharedKitchen;
};

const memory = globalThis as GlobalKitchen;

export async function readKitchen(): Promise<SharedKitchen> {
  if (memory.__stockUpKitchen && isSharedKitchen(memory.__stockUpKitchen)) {
    return memory.__stockUpKitchen;
  }
  const seeded = toSharedKitchen(createSeedState());
  memory.__stockUpKitchen = seeded;
  return seeded;
}

export async function writeKitchen(kitchen: SharedKitchen) {
  memory.__stockUpKitchen = kitchen;
}
