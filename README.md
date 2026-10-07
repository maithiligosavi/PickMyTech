# PickMyTech

Tech hardware recommendation app. Pick a category, set a budget, choose a use
case and the features you care about, and get your top 3 matching devices with
a "Why this fits you" note and a side-by-side comparison matrix.

Authored by **Maithili Gosavi**.

## Stack

- Frontend: React + Vite + TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- Auth + database: Firebase Authentication and Cloud Firestore
- Backend: to be rebuilt (see below)

## Run the frontend

```bash
npm install
cp .env.example .env     # fill in your Firebase web config
npm run dev
npm run build
npm run typecheck
```

## Backend integration point

`src/App.tsx` calls `POST /api/recommend` with:

```json
{
  "category": "Laptops",
  "budget": "₹1,50,000",
  "use_case": "Gaming",
  "priorities": ["Performance", "Display Quality"]
}
```

and expects `{ "recommendations": [ { name, price, image_url, specs, why_fits_you }, ... ] }`
with at least 3 items. If the call fails or returns fewer, the app falls back to
the local catalog and scoring in `src/lib/catalog.ts`.

## Firestore

- `users/{uid}`: profile document created at signup (`Login.tsx`)
- `recommendations`: one document per completed query (`App.tsx`)
- Security rules: `firestore.rules`
