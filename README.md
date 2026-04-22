# High Ridge Lead Finder

A Next.js app for finding and qualifying local service-business leads (roofers, landscapers, painters, plumbing, flooring, etc.), scoring opportunity quality, and preparing outreach.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Core workflow

1. Go to **/new** and run a search by business type, city, state, radius, and optional keyword.
2. Results are deduped, scored, classified, and saved.
3. Review pipeline in **/dashboard**, **/leads**, and **/clients**.
4. Open lead details and use AI tools to generate:
   - lead summary
   - score explanation
   - outreach draft

## Environment variables

Copy `.env.example` to `.env.local` and fill what you have. The app remains usable with missing integrations.

- `AI_GATEWAY_API_KEY` (optional): enables Vercel AI Gateway in AI tools.
- `GOOGLE_PLACES_API_KEY` (optional): enables live Google Places discovery. If missing, search uses mock provider.
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (optional): enables Supabase persistence. If missing, app stores leads in `.data/leads.json` locally.
- `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_PHONE_NUMBER` (optional): enables missed-call follow-up SMS webhook route.

## Build and checks

```bash
npm run lint
npm run build
```

## Deployment notes

- Deploy as a standalone Vercel project.
- Do not attach unrelated custom domains.
- Keep secrets in Vercel environment variables only.
