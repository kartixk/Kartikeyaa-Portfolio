# Kartikeya — Portfolio

Next.js (App Router) + React 19 + Three.js (React Three Fiber) + Tailwind CSS + Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Resend / Supabase values
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Structure

- `src/app` — routes, metadata, sitemap/robots, OG image, and `api/contact` route handler
- `src/views` — page UIs (client components) rendered by the route files
- `src/components` — shell (navbar, footer, providers), `fx/` animation + 3D helpers
- `src/lib` — site config, Supabase client, email templates
- `supabase/schema.sql` — run once in the Supabase SQL editor to create `contact_messages`

## Deploy

Deploy to Vercel. Set the environment variables from `.env.example` in the project settings.
