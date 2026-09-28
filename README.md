# Household kitchen

A shared kitchen stock and weekly shopping list for one household. Track food in the **cupboards**, **fridge**, and **freezer**, keep staples on a buy list, finish a shop on your phone, and keep a history of what came home — including items the shop did not have, which roll onto next week.

Built phone-first so kids and grown-ups can tap large buttons with a thumb. Desktop still works; it is not the main layout.

No accounts or database. One install, four mock household members (Austin, Maya, Leo, Nina). Data stays in this browser.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## What you can do

- Switch who is using the app (same household kitchen).
- Set stock to Plenty, Low, or Out. Low and Out go on this week's shop.
- Add extra items to the list, then at the store mark **Got it** or **Shop didn't have it**.
- Finish the shop: bought food becomes Plenty, missing items move to the next list, and the trip is saved under Past shops.

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
