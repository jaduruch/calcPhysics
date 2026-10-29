# calcPhysics

English physics reference and calculation platform. Initial scope: Home → Mechanics → Kinematics, with a catalogue of four planned models. Other main subjects are visible as unavailable; model calculators are not implemented yet.

## Local development

Use Node.js 22.17 or newer (the tested version is in `.nvmrc`), then:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

```sh
npm run check
npm run build
npm run preview
```

The production build uses the Netlify adapter. No production deployment is configured or performed. Do not enable production indexing until the domain, canonical URLs and sitemap are configured.

## Structure

- `src/lib/content/topics.ts`: shared subject hierarchy, publication status and model metadata.
- `src/lib/i18n/en.ts`: English UI strings; German is planned.
- `src/lib/components/`: shared overview, cards, theme selector and KaTeX formula renderer.
- `src/lib/styles/`: exact reference palette and responsive styles.
- `src/routes/`: Home and data-driven published overview routes.

See `AGENTS.md` and `docs/` for the architecture and physical standards. No physics calculation logic is implemented in this first navigation slice.
