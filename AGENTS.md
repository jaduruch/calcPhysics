# calcPhysics – Arbeitsregeln

## Auftrag und Stand

calcPhysics ist eine standardmässig englischsprachige Physik-Lern- und Berechnungsplattform mit späterer deutscher Sprachoption. Das Bedienkonzept von elecalculate.com wird auf mathematisch anspruchsvollere Physik erweitert: gesuchte Grössen wählen, Einheiten umrechnen und Ergebnisse für weitere Rechnungen verwenden. Fachliche Herleitungen gehören zum Produkt. Zielgruppen sind Lernende auf höherem mathematischem Niveau sowie Ingenieurinnen und Ingenieure, die einfache physikalische Berechnungen im industriellen Alltag durchführen. Themenseiten haben die zwei Hauptbereiche «Theory» und «Calculate». Übungsaufgaben, Quiz und Lernfortschrittsfunktionen sind derzeit nicht vorgesehen.

Stand 29.10.2026: Das Repository enthielt vor der Spezifikation nur `README.md`. Der anschliessende Implementierungsauftrag umfasst das lokale SvelteKit-Grundgerüst sowie Home → Mechanics → Kinematics. Home zeigt alle Hauptthemen, Mechanics zunächst nur Kinematics und Kinematics vier geplante Theorie-/Rechnen-Modelle. Nicht verfügbare Themen und Rechner sind als «Coming soon» gekennzeichnet. Eine Veröffentlichung ist nicht beauftragt.

## Verbindliche Grundlagen

- [Architektur](docs/ARCHITECTURE.md)
- [Designsystem](docs/DESIGN_SYSTEM.md)
- [Physikalische Standards](docs/PHYSICS_STANDARDS.md)
- [Roadmap](docs/PROJECT_ROADMAP.md)

Die dort beschriebenen Verzeichnisse, Komponenten und Schnittstellen sind Zielstruktur, keine bereits vorhandenen Dateien. Abweichungen begründen und betroffene Dokumentation aktualisieren. Keine zusätzliche Infrastruktur ohne konkreten Bedarf.

## Entwicklung nach Freigabe der Implementierung

- Englisch (`en`) ist die Standardsprache; Deutsch (`de`) folgt später. UI-Texte zentral übersetzbar halten, Fachlogik sprachneutral und Inhalte über stabile Themen-IDs verknüpfen. Projektdokumentation darf Deutsch bleiben.
- SvelteKit und TypeScript im Strict-Modus; zentrale CSS-Tokens statt paralleler Styling-Systeme.
- Visuelle Referenz ist die bereitgestellte `Qubit_Demo/main/portal.html`: exakte Hell-/Dunkel-Flächenfarben und blaue Akzente gemäss `docs/DESIGN_SYSTEM.md`. Formeln weiterhin mit KaTeX, nicht mit manuellen HTML-/CSS-Brüchen.
- Physik und numerische Verfahren als reine TypeScript-Funktionen ohne Svelte, DOM, KaTeX oder Diagrammbibliotheken. Kein veränderlicher globaler Rechnerzustand.
- Eingaben an der Grenze parsen, validieren und nach SI konvertieren. Intern ungerundet rechnen; erst zur Ausgabe formatieren.
- Jede Formel hat dokumentierte Voraussetzungen, Definitionsbereiche, Einheiten und fachliche Tests. Nichtendliche Zahlen niemals als gültige Ergebnisse ausgeben.
- Formelumstellungen explizit implementieren. Kein `eval`, keine willkürliche Skriptausführung und zunächst kein allgemeines CAS.
- Rechner über typisierte Definitionen und gemeinsame UI ergänzen. Neue Themen sollen keine kopierten Seiten benötigen.
- Formeln, Rechenweg und Visualisierungen verwenden dieselben validierten Ergebnisse. Keine zweite Physikimplementierung in Komponenten.
- Abhängige Ergebnisse bei Eingabeänderungen neu berechnen oder verwerfen. Keine veralteten Resultate als gültig anzeigen.
- Tastaturbedienung, semantisches HTML, beide Farbschemata und reduzierte Bewegung bei jeder UI-Änderung berücksichtigen.
- Theorie und Navigation bleiben ohne JavaScript lesbar. Browserabhängige Diagramme und 3D isolieren und bedarfsgerecht laden.

## Qualität und Zusammenarbeit

Änderungen klein und nachvollziehbar halten. Bestehende Nutzeränderungen respektieren. Keine Secrets, personenbezogenen Eingaben oder generierten Build-Artefakte committen. Neue Pakete müssen einen belegbaren Bedarf erfüllen.

Später vorgesehene Prüfungen: Typprüfung/Svelte-Prüfung, fachliche Unit-Tests, Produktionsbuild und bei geänderten Nutzerabläufen gezielte Browserprüfungen. Aktuelle Befehle: `npm run check` und `npm run build`; Start mit `npm run dev`. Fachtests folgen mit den ersten Berechnungsfunktionen. Fehlerfälle und fachliche Grenzfälle sind wichtiger als reine Snapshot-Tests.

Bei grundlegenden Produktfragen nachfragen; reversible technische Details selbst entscheiden. Die Plattform ist nicht an eine einzelne Schulstufe gebunden; die konkreten mathematischen Voraussetzungen werden je Thema angegeben. Die bestätigte Richtung ist ein mathematisch höheres Niveau als die bisherige Lehrlingsplattform, kein pauschaler Hochschulvollumfang.
