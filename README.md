# calcPhysics

English physics reference and calculation platform. Available: Home → Mechanics → Kinematics (Uniform Motion) and Dynamics (Inclined Plane), using shared expandable model cards with info buttons for theory. Inclined Plane calculates weight, normal/downhill forces, kinetic friction and acceleration with a force sketch. Other main subjects are visible as unavailable; Uniform Motion now calculates s₀, s, v or t automatically with keyboard-entered SI prefixes (e.g. `1.5k`) and complete KaTeX result equations rounded to three significant figures.

## Local development

Use Node.js 22.17 or newer (the tested version is in `.nvmrc`), then:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

```sh
npm run check
npm test
npm run build
npm run preview
```

The production build uses the Netlify adapter and canonical domain `https://calcphysics.com`. Sitemap and robots.txt are generated automatically from the published topics. Production domain redirects are in `_redirects`; deploy previews are noindex. See [SEO configuration and mobile audit](docs/SEO.md). These repository changes require deployment to take effect on the live site; no deployment was performed in this task.

## Structure

- `src/lib/physics/units.ts`: shared unit catalogue and SI conversion factors for all calculators.
- `src/lib/content/topics.ts`: shared subject hierarchy, publication status and model metadata.
- `src/lib/i18n/en.ts`: English UI strings; German is planned.
- `src/lib/components/`: shared cards, quantity fields, calculator shell/tools, equation blocks, unit menu, theme toggle and KaTeX renderer.
- `src/lib/styles/calculator.css`: shared calculator styling; common sizes are tokens in `app.css`.
- `src/lib/styles/`: exact reference palette and responsive styles.
- `src/routes/`: Home and data-driven published overview routes.

See [AGENTS.md](AGENTS.md), [source implementation rules](src/AGENTS.md) and the [accepted model page standard](docs/MODEL_PAGE_STANDARD.md) for shared change locations and the reference layout. Uniform Motion is the accepted baseline for future models. The physics solver is UI-independent and covered by automated tests. Run `npm test` (Node’s built-in test runner, without additional test dependencies). Browser interaction and visual checks are separate from these unit tests.
