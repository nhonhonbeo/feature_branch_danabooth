This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Map setup

This repo renders maps with `Mapbox GL JS`.

To enable the map locally:

```bash
cp .env.example .env.local
```

Then set:

- `NEXT_PUBLIC_MAP_STYLE_URL`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

Example:

```env
NEXT_PUBLIC_MAP_STYLE_URL=https://api.mapbox.com/styles/v1/mapbox/standard?optimize=true
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_public_token_here
```

Restart `npm run dev` after changing env vars.

## AI Workflow

Project-local AI workflow files are committed in this repo so the team can use the same structure without a global setup:

- `AGENTS.md`
- `.codex/`
- `.agents/skills/`
- `CODEX_GUIDE.vi.md`
- `docs/ai/feature-extension-prompt.md`

If you use Codex, open the repo and those files are picked up automatically.

If you do not use Codex, use `docs/ai/feature-extension-prompt.md` together with `AGENTS.md`, `DESIGN.md`, and the relevant route or feature files when prompting another assistant.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
