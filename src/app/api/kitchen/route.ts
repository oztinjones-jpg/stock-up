import { readKitchen, writeKitchen } from "@/lib/server-kitchen";
import { isSharedKitchen } from "@/lib/kitchen-shape";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const kitchen = await readKitchen();
  return Response.json(kitchen);
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Could not read the kitchen." }, { status: 400 });
  }
  if (!isSharedKitchen(body)) {
    return Response.json({ error: "That kitchen data looks wrong." }, { status: 400 });
  }
  await writeKitchen(body);
  return Response.json(body);
}
