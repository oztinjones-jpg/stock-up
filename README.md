# Household kitchen

A shared kitchen stock and weekly shopping list for one household. Track food in the **cupboards**, **fridge**, and **freezer**, keep staples on a buy list, finish a shop on your phone, and keep a history of what came home — including items the shop did not have, which roll onto next week.

Built phone-first so kids and grown-ups can tap large buttons with a thumb. Desktop still works; it is not the main layout.

No paid accounts. Four household names (Austin, Monica, Alex, Lara) share **one kitchen** on the server. Who is using this phone stays on that phone. Other phones refresh the same stock and shop list every few seconds.

Stock, this week's list, and past shops are stored in **Postgres** when a database URL is set (`DATABASE_URL` or `POSTGRES_URL`). If it is missing, the app still runs using memory (fine on your computer; on Vercel it forgets after a restart).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

You do **not** need a database on your laptop. To keep the live site's kitchen forever:

1. Open the Vercel project that is actually live (`stock-up-no7t`).
2. Go to **Storage** and create or connect **Neon** (free Postgres).
3. Wait until Vercel shows a `POSTGRES_URL` (or `DATABASE_URL`) on the project.
4. **Redeploy** Production (Deployments → ⋯ → Redeploy).

That is the whole hook-up. No extra code on your phone.

## What you can do

- Switch who is using the app (same household kitchen).
- Add or remove food in cupboards, fridge, or freezer.
- Set stock to Plenty, Low, or Out. Low and Out go on this week's shop.
- Add extra items to the list, then at the store mark **Got it** or **Shop didn't have it**.
- Finish the shop: bought food becomes Plenty, missing items move to the next list, and the trip is saved under Past shops.

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Optional Neon Postgres via `@neondatabase/serverless`.
