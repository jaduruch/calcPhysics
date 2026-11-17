# Projektstand und weitere Arbeit

Stand: 17.11.2026, lokaler Repositoryzustand. Diese Übersicht ersetzt die veraltete Phasenplanung aus dem anfänglichen Spezifikationsauftrag. Implementierte Funktionen, offene Prüfungen und mögliche spätere Vorhaben sind getrennt. Neue Inhalte oder Veröffentlichung benötigen weiterhin einen Auftrag.

## Bereits umgesetzt

| Bereich | Stand |
| --- | --- |
| Technische Basis | SvelteKit/Svelte, TypeScript strict, Vite, KaTeX, Netlify-Adapter; Node-Version in `.nvmrc` |
| Seiten | Home, sechs aktive Hauptthemen und veröffentlichte Unterthemen aus der Registry; englische und deutsche Routen |
| Gemeinsame UI | ModelCard/ModelHost/ModelTheory, gemeinsame Eingabefelder, Einheitenmenüs, Rechner-/Ergebnisflächen, Theme, responsive Navigation |
| Eingaben | Zentraler Ausdrucksparser und Präfixe; Grad als Winkelstandard; Rohtexte bleiben beim Einheitenwechsel erhalten |
| Physik | Explizite inverse Solver, Teilresultate und modellgebundene Grafiken; unterschiedliche fachliche Vollständigkeit im Bestand, keine pauschale Erfüllungsbehauptung |
| Inhaltserweiterungen | Physik1/Physik2, Formelbuch-Physikkapitel, Elektrotechnik, Kepler, Hookesches Gesetz/Federpendel, Impuls/Stösse/Rakete |
| Recherche/Navigation | Lokale Vollseitensuche mit Hierarchie-Linkpillen; SI-Einheiten/Konstantenreferenz |
| Informationsseiten | Rechnerhilfe, About und Haftungsausschluss, ohne „Subject overview“ und ohne Physik-Themenkachel |
| Footer | Gruppierte Projekt-, Hilfe-/Referenz- und Rechtslinks; E-Mail, Instagram, GitHub mit Logos ohne Pfeile; Sprachwechsel |
| Prüfwerkzeuge | Fach-/Inhalts-/Registrytests mit Node, Svelte-/Typprüfung, Produktionsbuild; gezielte Browserprüfungen separat |

Die aktuelle Themenliste steht in [AGENTS.md](../AGENTS.md); die Registry bleibt die ausführbare Quelle. Quellumfang und sichtbare Karten nicht verwechseln: Elektrotechnik enthält 44 zugrunde liegende Rechendefinitionen, 29 registrierte Definitionen und 22 Karten. Die Formelbuch-Zahlen beschreiben Quellbeziehungen, keine Zahl zusätzlicher Karten.

## Aktuelle verbindliche Modellstruktur

- Kinematics: fünf Karten (Uniform Motion, Uniformly Accelerated Motion, Projectile Motion, Free Fall, Velocity Components). Wurfbewegung ist ein kombinierter Rechner mit 17 Eingaben; keine separaten vertikalen/waagrechten Wurfkarten und keine Sonderfall-Schnellwahl. Negative Abwurfwinkel liefern keine Scheitelgrössen.
- Dynamics: vier Karten; kombinierte schiefe Ebene mit 14 Eingaben und massenunabhängigen Teilresultaten. Gleitreibung für bereits hangabwärts gleitende Körper, keine Haftreibung. Dynamische Flaschenzugskizze.
- Hooke’s Law: Hookesches Gesetz, Federpendel und kreisendes Federpendel als drei Karten.
- Kepler: drei Karten; erstes Gesetz mit 15 Eingaben, drittes mit neun. ε, eigene Kegelschnittkonstruktion, Phasen-/Zeitregler und Play/Pause. Kein öffentlicher Link zum nutzereigenen Desmos-Modell.
- Momentum: vier eigenständige aufklappbare Karten in der Reihenfolge Momentum Conservation, Inelastic Collision, Elastic Collision, Rocket Equation. Keine Auswahl innerhalb der Impulskarte und keine separaten Stoss-Unterthemen.
- Transformator: Ideal/Real-Umschaltung; Wirkungsgradfeld im Idealmodus vollständig entfernt, Eingaben für den Realmodus bleiben erhalten.

Fachverträge: [Physik1/Physik2](RESOURCE_CONTENT.md), [Formelbuch](FORMULA_BOOK.md), [Elektrotechnik](ELECTRICITY.md), [Kepler](KEPLER.md), [Impuls/Rakete](MOMENTUM.md), [Stösse](COLLISIONS.md). Private Quellen/Renderdateien bleiben ausserhalb des Repositories. Externe Instagram-Icons sind Download-Artefakte, keine Website-Assets.

## Laufende Pflege im beauftragten Umfang

1. Vollständige deutsche Katalogabdeckung erhalten. `tests/localization.test.mjs` prüft UI, Fach-/SI-Inhalte, dynamische Feldnamen und Quelltextliterale. Der frühere Teilübersetzungshinweis ist entfernt; neue englische Resttexte sind Fehler.
2. Unterstützte Inversen, minimale Eingabekombinationen, Lösungszweige, Singularitäten, Widersprüche und unabhängige Teilresultate fachlich prüfen. Bestehende Lücken konkret benennen und im bearbeiteten Umfang beheben.
3. Gemeinsame Gestaltung zentral pflegen; Modellseiten nicht kopieren. Explizit bestätigte Kartenstrukturen erhalten.
4. Bei UI-/Grafikänderungen Mobil/Laptop, beide Themes, Tastatur/Pointer/Touch, Fokus/Ausgrauung und Rückkehr zum Normalzustand prüfen. Screenreader- oder Kontrastprüfungen nicht als erledigt behaupten, wenn sie nicht durchgeführt wurden.
5. Für Implementierungsänderungen `npm test`, `npm run check`, `npm run build`; für reine Dokumentänderungen Konsistenz und Links prüfen.

## Offen beziehungsweise nur bei neuem Auftrag

Keine freie Funktionseingabe, kein allgemeines CAS, keine persistenten Berechnungsketten oder globale Wertübernahme zwischen Themen. Konten, Datenbank, CMS, Bezahlung, Quiz, Übungen und Lernfortschritt sind nicht vorgesehen. Zusätzliche Fachmodelle nicht aus einer historischen Phasenliste ableiten.

Modellgebundene Numerik und eigene 3D-Projektionen sind vorhanden. Allgemeine Integrations-/ODE-Werkzeuge, Plotly, Three.js und Worker benötigen einen konkreten fachlichen oder gemessenen technischen Bedarf. Die Plattform bleibt nicht auf eine einzelne Schulstufe beschränkt; Voraussetzungen und Tiefe sind je Modell festzulegen.

CI ist noch nicht eingerichtet; die Fachtests verwenden den eingebauten Node-Testläufer, kein Vitest. Automatisierung separat beauftragen. Performanceziele und Accessibility-Ziele sind Prüfaufgaben, keine durch den bisherigen Funktionsumfang nachgewiesenen Erfüllungen.

## Veröffentlichungsreife

Canonical-Origin `https://calcphysics.com`, lokalisierte Metadaten, Sitemap/robots, Preview-Sperren und Netlify-Konfiguration sind im Repository vorhanden. Daraus folgt weder ein Deployment noch ein überprüfter aktueller Live-Zustand. Eine Veröffentlichung nur auf ausdrücklichen Auftrag.

Vor Veröffentlichung: Fachreview und relevante Prüfungen, mobile Performance, Tastatur/Screenreader und Theme-Kontraste; Canonical-/Sprachlinks, 404 und Weiterleitungen prüfen. Domain-/Weiterleitungsdetails und datierte frühere Messungen: [SEO.md](SEO.md). Der letzte erfolgreiche Deploy soll als Rückfallstand verfügbar sein; keine unbestätigte Betriebssicherheit versprechen.

Bei Zweifeln zu Umfang, Begriffen oder Produktentscheidungen nachfragen, bevor abhängige Änderungen erfolgen. Keine Termine, neuen Features oder Veröffentlichungsfreigaben aus dieser Übersicht ableiten.
