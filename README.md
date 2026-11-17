# calcPhysics

Physikplattform mit Englisch als Standardsprache und deutscher Fassung unter `/de/`. Sechs aktive Hauptthemen, Theorie und inverse Rechner in aufklappbaren Modellkarten, zentrale Einheiten-/Präfix-/Ausdruckseingaben und dynamische SVG-Grafiken. Home bietet eine Suche über die veröffentlichten Inhalte und eine SI-Referenz. Der aktuelle Umfang und verbindliche Entscheidungen stehen in [AGENTS.md](AGENTS.md).

## Lokale Entwicklung

Node.js ab 22.17 verwenden; die getestete Version steht in `.nvmrc`:

```sh
npm ci
npm run dev
```

Die von Vite ausgegebene lokale Adresse öffnen (normalerweise http://localhost:5173).

```sh
npm run check
npm test
npm run build
npm run preview
```

Der Produktionsbuild verwendet den Netlify-Adapter. Canonical-Origin, Sitemap/robots und Preview-Sperren sind konfiguriert; Details und datierte frühere Messungen: [SEO.md](docs/SEO.md). Lokaler Code und Build sind kein Nachweis eines aktuellen Live-Deployments. Keine Veröffentlichung ohne Auftrag.

## Struktur und Arbeitsregeln

- `src/lib/content/`: Themenregistry, Modellinhalte und Gruppierung der sichtbaren Karten.
- `src/lib/physics/`: reine Fachfunktionen; `units.ts` führt Einheiten und SI-Konversionen zentral.
- `src/lib/calculators/`: begrenzter Ausdrucksparser, Zahl-/Präfixformatierung und Ergebnisadapter.
- `src/lib/i18n/`: englische/deutsche UI, redaktionelle Übersetzungen und Locale-Regeln.
- `src/lib/components/`: gemeinsame Seiten-/Karten-/Feldbausteine und Fachansichten.
- `src/lib/styles/`: zentrale Theme-/Grössentokens und gemeinsame Styles.
- `src/routes/`: Home, datengetriebene Themenroute, Sitemap und robots.
- `tests/`: Fach-, Inhalts-, Registry- und Formatierungstests mit Nodes eingebautem Testläufer.
- `output/instagram-icons/`: separate Downloads, nicht auf der Website eingebunden.

[AGENTS.md](AGENTS.md), [src/AGENTS.md](src/AGENTS.md) und der [Modellseitenstandard](docs/MODEL_PAGE_STANDARD.md) halten die bestätigten Regeln fest. Uniform Motion bleibt die Designreferenz. [Architektur](docs/ARCHITECTURE.md) und [Projektstand/Roadmap](docs/PROJECT_ROADMAP.md) trennen implementierten Stand und spätere Vorhaben. Die deutsche UI- und Fachtextabdeckung wird automatisch mitgeprüft. Fachliche Grenzen und Prüfabdeckung der Rechner bleiben modellabhängig.

Für Implementierungsänderungen Fachtests, Svelte-/Typprüfung, Build und relevante Browserprüfungen durchführen. Für reine Dokumentänderungen reichen Konsistenz- und Linkprüfung. Bei Zweifeln vor der betroffenen Änderung nachfragen.
