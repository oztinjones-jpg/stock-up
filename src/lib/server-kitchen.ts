import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSeedState } from "./seed";
import { isSharedKitchen, toSharedKitchen } from "./kitchen-shape";
import type { SharedKitchen } from "./types";

type GlobalKitchen = typeof globalThis & {
  __stockUpKitchen?: SharedKitchen;
};

const memory = globalThis as GlobalKitchen;

function filePaths() {
  return [
    path.join(process.cwd(), "data", "kitchen.json"),
    path.join("/tmp", "stock-up-kitchen.json"),
  ];
}

export async function readKitchen(): Promise<SharedKitchen> {
  if (memory.__stockUpKitchen && isSharedKitchen(memory.__stockUpKitchen)) {
    return memory.__stockUpKitchen;
  }
  for (const filePath of filePaths()) {
    try {
      const raw = await readFile(filePath, "utf8");
      const parsed: unknown = JSON.parse(raw);
      if (isSharedKitchen(parsed)) {
        memory.__stockUpKitchen = parsed;
        return parsed;
      }
    } catch {
      // try the next place
    }
  }
  const seeded = toSharedKitchen(createSeedState());
  await writeKitchen(seeded);
  return seeded;
}

export async function writeKitchen(kitchen: SharedKitchen) {
  memory.__stockUpKitchen = kitchen;
  let saved = false;
  for (const filePath of filePaths()) {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, `${JSON.stringify(kitchen, null, 2)}\n`, "utf8");
      saved = true;
      break;
    } catch {
      // try the next place
    }
  }
  if (!saved && process.env.NODE_ENV !== "production") {
    console.warn("Could not write the shared kitchen file; using memory only.");
  }
}
