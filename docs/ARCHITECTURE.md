# Technische Architektur

## Stand und Geltung

Stand: 17.11.2026, anhand des lokalen Quellcodes. calcPhysics ist eine implementierte SvelteKit-Anwendung mit sechs aktiven Physik-Hauptthemen, Datenregistry, inversen Rechnern, dynamischen Grafiken und englischen/deutschen Routen. Der verbindliche UI-Vertrag steht im [Modellseitenstandard](MODEL_PAGE_STANDARD.md), die Arbeitsregeln in [AGENTS.md](../AGENTS.md) und [src/AGENTS.md](../src/AGENTS.md). Uniform Motion bleibt die akzeptierte Designreferenz. Ältere Pilotentwürfe sind kein Auftrag zur Rückgestaltung.

## Vorhandene technische Grundlage

| Bereich | Implementierung |
| --- | --- |
| Anwendung | SvelteKit und Svelte, TypeScript strict, Vite; Versionen in `package.json`/Lockdatei |
| Laufzeit | Node ≥ 22.17; getestete Version in `.nvmrc` |
| Ausgabe | Vorgerenderte veröffentlichte Seiten, offizieller Netlify-Adapter |
| Inhalte | Typisierte Themen- und Modelldaten in `content/`, redaktionelle Theorie, keine Datenbank/CMS |
| Mathematik | Gemeinsame `Formula` mit KaTeX, HTML/MathML und `trust: false` |
| Fachlogik | Reine TypeScript-Funktionen unter `physics/`, ohne UI-/DOM-Abhängigkeiten |
| Eingaben | Zentraler Zahlen-/Ausdrucksparser, SI-Konversion und Formatter |
| Diagramme | Eigene responsive SVG-Komponenten; Blochkugel und Kepler als eigene perspektivische 3D-Projektionen |
| Prüfungen | Node-Testläufer, Svelte-/Typprüfung, Produktionsbuild, gezielte Browserprüfung |

Plotly, Three.js, allgemeines CAS, Vitest, Worker, Konten und CMS sind keine installierte Grundlage. Zusätzliche Pakete oder Infrastruktur benötigen einen konkreten belegbaren Bedarf. Keine leeren Zukunftsverzeichnisse anlegen.

## Tatsächliche Struktur und zentrale Zuständigkeiten

```text
src/lib/content/          Themen, Modelle, Formeln, Felder und Annahmen
src/lib/i18n/             Locale-Regeln, en/de-UI, redaktionelle Übersetzungen
src/lib/physics/          Reine Fachfunktionen und zentrale Einheitenregistry
src/lib/calculators/      Parsing, Formatierung und Ergebnisadapter
src/lib/components/      Overview, ModelHost, ModelCard, ModelTheory, Footer
src/lib/components/ui/   QuantitySymbol, UnitSelect, RangeSlider, ToggleSwitch
src/lib/components/calculator/  Gemeinsame Rechnerbausteine und Fachansichten
src/lib/visualization/    Projektionen, Sampling und Darstellungsadapter
src/lib/styles/          Theme-/Grössentokens, gemeinsame Seiten-/Rechnerstyles
src/routes/              Layout, Home, Catch-all-Themenroute, Sitemap und robots
static/                  Öffentliche lokale Assets
output/                  Separate Download-Artefakte, keine automatisch eingebundenen Assets
tests/                   Fach-, Inhalts-, Formatierungs- und Registrytests
```

`ModelHost` steuert Öffnungszustand, Varianten und Hashlinks. `ModelCalculator` ordnet Fachrechner zu. `ModelCard` erhält typisierte Inhalte und einen Rechner-Snippet; `ModelTheory` stellt die Theorie dar. `QuantityField`, `CalculatorShell`, `CalculatorTools`, `EquationBlock` und `calculator.css` sind gemeinsame Änderungsstellen. Keine Fachseiten oder Feldlayouts kopieren. Der vorhandene Vertrag ist `ModelDefinition` plus fachabhängige Definitionen/Resultattypen, kein universelles `CalculatorDefinition`-Framework.

## Themen, Routing und Suche

`content/topics.ts` liefert stabile IDs, Eltern, Pfade, Metadaten und veröffentlichten Umfang; `content/model-groups.ts` bestimmt die sichtbaren Karten. Quellbeziehungen, registrierte Definitionen und sichtbare Karten sind unterschiedliche Zähleinheiten. Der aktuelle Themenbestand ist in [AGENTS.md](../AGENTS.md) zusammengefasst; Fachabdeckung steht in den jeweiligen Quellverträgen.

Englische URLs haben kein Sprachpräfix, deutsche liegen unter `/de/` und verwenden dieselben Themenpfade. `routes/[...topic]/+page.ts` löst die Registry auf und liefert Prerender-Einträge. `trailingSlash = 'never'`. Nicht vorhandene Themen liefern 404; frühere veröffentlichte Adressen werden auf passende aktuelle Themen/Karten weitergeleitet. Rechner sind über `#model-<id>` adressierbar, nicht über eigene Modellrouten.

Die Impulsseite enthält **vier eigenständige aufklappbare Karten**: Momentum Conservation, Inelastic Collision, Elastic Collision, Rocket Equation. Keine zusätzliche Modellauswahl innerhalb der Impulskarte, keine eigenen Stoss-Unterthemen. Kinematics enthält die eine kombinierte Wurfkarte statt separater vertikaler/waagrechter Rechner.

Home zeigt die SI-Referenz und sechs Hauptthemen. Die lokale Suche erstellt ihren zweisprachigen Index aus derselben Registry, Modellen, Variablen, Formeln und Referenzinhalten. Treffer sind Linkpillen mit vollständiger Hierarchie; alte integrierte Modell-IDs führen auf die richtige aktuelle Karte. Keine zweite manuelle Suchliste und kein externer Suchdienst.

`/calculator-help`, `/about` und `/disclaimer` sind Informations-/Hilfeseiten. Sie erscheinen in Footer, Suche und Sitemap, nicht im Physik-Themenraster. Keine Kennzeichnung „Subject overview“ auf diesen Seiten.

## Sprache und Seitentexte

Englisch bleibt Standard; Deutsch ist eine gleichwertig zu pflegende Produktsprache. Die URL bestimmt die Sprache. `en.ts`, `de.ts`, `text-de.ts`, `translate.ts`, `locale.ts` und `runtime.ts` trennen Übersetzungen von Fachlogik; keine veränderliche serverweite Sprache. Die UI-Wörterbücher und Fachkataloge sind vollständig mit deutschen Übersetzungen belegt. Der bisherige Hinweis auf eine schrittweise Übersetzung ist entfernt. `tests/localization.test.mjs` prüft Wörterbuchparität, Fach-/SI-Texte, dynamische Netzwerkfelder sowie sichtbare und zugängliche Literale. Ein neuer englischer Resttext gilt als Fehler.

Sprachwechsel verlinkt denselben Themenpfad und erhält Query/Hash. Lokaler Rechnerzustand bleibt bei wiederverwendeten Komponenten erhalten; keine dauerhafte oder seitenübergreifende Speicherung daraus ableiten. Die mathematische Ausgabe nutzt derzeit in beiden Sprachen Dezimalpunkte; Eingaben akzeptieren Punkt und Komma. Eine Umstellung deutscher Ausgaben auf Dezimalkomma ist keine vorhandene Funktion.

HTML-Sprache, Titel, Beschreibungen, Canonicals und `hreflang` werden zentral erzeugt. Keine Werbung oder LinkedIn-artigen Selbstdarstellungen. About nennt bestätigte Ausbildung, Physikstudium an der ETH Zürich und elecalculate als Vorgänger sachlich; die Bedienungsanleitung steht separat in der Rechnerhilfe.

## Datenfluss und Zustand

Pro Rechnerinstanz: manueller Rohtext → begrenztes Parsing → Einheitenkonversion nach SI → fachliche Validierung → reine explizite Berechnung → Folgegrössen → Rechenweg/Grafik → gerundete Anzeige. Die Physik importiert keine UI-Schichten; Komponenten dürfen keine zweite Physikimplementierung enthalten.

Der zentrale Parser unterstützt `() + - * / ^` und Präfixe je Zahl, keine Funktionen, Bezeichner, Einheiten im Ausdruck, `eval` oder CAS. `1k + 1m = 1000.001`; die gewählte Einheit gilt einmal für den gesamten Ausdruck. Einheitenwechsel erhält **jeden manuellen Eingabetext unverändert** und interpretiert ihn neu. Winkel starten in Grad, Radiant bleibt verfügbar; intern SI/rad. Berechnete Werte und Annahmen niemals in leere Eingabefelder zurückschreiben.

Jede variable bekannte Modellgrösse soll zugänglich sein. Alle zulässigen Inversen, diskreten Zweige und eindeutig bestimmbaren Teilgrössen auswerten. Unvollständige/ungültige Angaben sperren nur tatsächliche Abhängigkeiten. Widersprüche, unlösbare, singuläre und unterbestimmte Fälle unterscheiden. `0` ist ein Wert. Keine veralteten oder nichtendlichen Resultate anzeigen. Fachabhängige Resultattypen sind bereits vorhanden; kein einheitlicher globaler Statusvertrag wird behauptet.

Explizite Relationssolver propagieren bekannte Werte endlich weiter; sie interpretieren keine beliebigen Gleichungen und approximieren keine zyklischen Gleichungssysteme durch Raten. Schritt-Abhängigkeiten beziehungsweise validierte Snapshots sichern konsistente Einsetzungen. Lokale Folgeergebnisse sind implementiert; globale Berechnungsketten oder eine Aktion „Als Eingabe übernehmen“ zwischen Themen sind nicht vorhanden.

## Visualisierung und Interaktion

Grafiken verwenden dieselben ungerundeten validierten Werte wie die Rechenwege. `viewBox`, Projektionen, Normierungen und schematische Vereinfachungen müssen fachlich beschrieben sein. Bei fehlenden Angaben keine erfundenen Messwerte, Zahlenachsen oder Kraftpfeile. Bereits bekannte Geometrie und unabhängige Teilgrössen nicht verwerfen.

Fokus auf Zahlenfeld einschliesslich Einheitenmenü hebt zugehörige Grafikteile hervor, andere werden über `--color-diagram-muted` gedämpft. Fokus hat Vorrang vor einer Zielauswahl; danach zum Ziel-/Normalzustand zurückkehren. Kein pauschales Abdunkeln der gesamten Grafik.

Kepler und Blochkugel verwenden eigene SVG-Projektionen ohne externe 3D-Laufzeit. Kepler bietet Phasen-/Zeitintervallregler und manuelles Play/Pause; feste Eingabepunkte, reduzierte Bewegung und Hintergrundzustände begrenzen die Animation. Andere Animationen sind fachabhängig. Keine allgemeine Start/Pause/Reset-Animation für alle Modelle behaupten. Numerische Regler und binäre Modusschalter bleiben unterschiedliche Komponenten.

## SEO, Auslieferung und offene Qualität

Canonical-Origin ist im Repository auf `https://calcphysics.com` festgelegt. Sitemap und robots stammen aus den veröffentlichten Registryeinträgen, Preview-/Branch-Builds sind nicht indexierbar. Domain-Weiterleitungen liegen in `_redirects`; Details und datierte frühere Messungen in [SEO.md](SEO.md). Konfiguration im Repository ist kein Nachweis des aktuellen Live-Zustands oder eines erfolgten Deployments. Dieser Stand beschreibt lokale Implementierung.

KaTeX und Schriften liegen lokal; keine globale Plotly-/Three-Laufzeit. Bisherige Performance-Planungsziele bleiben Prüfziele: initiales JavaScript ohne optionale Diagramme ≤ 150 kB gzip, Kernrechnerreaktion < 100 ms auf Zielgeräten, LCP ≤ 2.5 s, INP ≤ 200 ms und CLS ≤ 0.1 am 75. Perzentil. Das sind keine aktuellen Messwerte oder nachgewiesenen Erfüllungen. Einhaltung bei relevanten Änderungen separat messen.

CI ist im Repository derzeit nicht eingerichtet. Die vorhandenen Befehle sind `npm test`, `npm run check` und `npm run build`; Start mit `npm run dev`. Browser-/Screenreaderprüfungen sind gesondert. Reine Dokumentänderungen brauchen Konsistenz-/Linkprüfung, keinen Build. Eine bestätigte Gestaltung ist kein Nachweis vollständiger WCAG-Konformität.

## Späterer Ausbau – nur nach Auftrag

Neue Fachmodelle, freie Funktionen, allgemeine symbolische Algebra, numerische Integrations-/ODE-Werkzeuge, Plotly/Three.js, Worker, persistente Arbeitsbereiche, Konten, CMS, Bezahlung und Produktionsveröffentlichung folgen nicht automatisch aus dieser Architektur. Modellgebundene numerische Nullstellenverfahren sind bereits vorhanden, beispielsweise bei Kepler; sie sind kein allgemeiner Funktionsrechner. Bei Zweifeln zu Umfang oder Produktentscheidung vor der betroffenen Umsetzung nachfragen. Keine leeren Abstraktionen oder Verzeichnisse für hypothetische Erweiterungen.
