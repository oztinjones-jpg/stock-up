import { neon } from "@neondatabase/serverless";
import { createSeedState } from "./seed";
import { isSharedKitchen, toSharedKitchen } from "./kitchen-shape";
import type { SharedKitchen } from "./types";

const KITCHEN_ROW_ID = "household";

type GlobalKitchen = typeof globalThis & {
  __stockUpKitchen?: SharedKitchen;
  __stockUpKitchenTableReady?: boolean;
};

const memory = globalThis as GlobalKitchen;

function databaseUrl() {
  const url =
    process.env.POSTGRES_URL?.trim() || process.env.DATABASE_URL?.trim();
  return url || null;
}

function sqlClient() {
  const url = databaseUrl();
  if (!url) return null;
  return neon(url);
}

function seedKitchen(): SharedKitchen {
  return toSharedKitchen(createSeedState());
}

function remember(kitchen: SharedKitchen) {
  memory.__stockUpKitchen = kitchen;
}

async function ensureTable(
  sql: NonNullable<ReturnType<typeof sqlClient>>,
) {
  if (memory.__stockUpKitchenTableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS kitchen_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `;
  memory.__stockUpKitchenTableReady = true;
}

function parseKitchenRow(data: unknown): SharedKitchen | null {
  let value = data;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  return isSharedKitchen(value) ? value : null;
}

async function readFromDatabase(
  sql: NonNullable<ReturnType<typeof sqlClient>>,
): Promise<SharedKitchen | null> {
  await ensureTable(sql);
  const rows = await sql`
    SELECT data FROM kitchen_state WHERE id = ${KITCHEN_ROW_ID} LIMIT 1
  `;
  const row = rows[0] as { data?: unknown } | undefined;
  if (!row) return null;
  return parseKitchenRow(row.data);
}

async function writeToDatabase(
  sql: NonNullable<ReturnType<typeof sqlClient>>,
  kitchen: SharedKitchen,
) {
  await ensureTable(sql);
  const payload = JSON.stringify(kitchen);
  await sql`
    INSERT INTO kitchen_state (id, data)
    VALUES (${KITCHEN_ROW_ID}, CAST(${payload} AS jsonb))
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

export async function readKitchen(): Promise<SharedKitchen> {
  const sql = sqlClient();
  if (sql) {
    try {
      const stored = await readFromDatabase(sql);
      if (stored) {
        remember(stored);
        return stored;
      }
      const seeded = seedKitchen();
      await writeToDatabase(sql, seeded);
      remember(seeded);
      return seeded;
    } catch (error) {
      console.error("Could not read the kitchen from the database.", error);
    }
  }

  if (memory.__stockUpKitchen && isSharedKitchen(memory.__stockUpKitchen)) {
    return memory.__stockUpKitchen;
  }
  const seeded = seedKitchen();
  remember(seeded);
  return seeded;
}

export async function writeKitchen(kitchen: SharedKitchen) {
  remember(kitchen);
  const sql = sqlClient();
  if (!sql) return;
  try {
    await writeToDatabase(sql, kitchen);
  } catch (error) {
    console.error("Could not save the kitchen to the database.", error);
  }
}
