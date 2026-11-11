# calcPhysics – Arbeitsregeln

## Auftrag und Stand

calcPhysics ist eine standardmässig englischsprachige Physik-Lern- und Berechnungsplattform mit späterer deutscher Sprachoption. Das Bedienkonzept von elecalculate.com wird auf mathematisch anspruchsvollere Physik erweitert: gesuchte Grössen wählen, Einheiten umrechnen und Ergebnisse für weitere Rechnungen verwenden. Fachliche Herleitungen gehören zum Produkt. Zielgruppen sind Lernende auf höherem mathematischem Niveau sowie Ingenieurinnen und Ingenieure, die einfache physikalische Berechnungen im industriellen Alltag durchführen. Modelle bieten Theorie und Berechnung in einer ausklappbaren Karte; die Theorie wird ohne sichtbaren Titel über den Info-Button geöffnet. Übungsaufgaben, Quiz und Lernfortschrittsfunktionen sind derzeit nicht vorgesehen.

Stand 10.11.2026: Home führt alle Hauptthemen; Mechanics enthält Kinematics mit Uniform Motion, Uniformly Accelerated Motion, Vertical Throw, Horizontal Throw und Oblique Throw sowie Dynamics mit Inclined Plane. Uniform Motion bleibt die vorerst akzeptierte Designreferenz. Beide Modelle nutzen gemeinsame Karten, Felder, Einheitenmenüs und Ergebnisflächen. Inclined Plane bestimmt aus zwei Angaben von L, h und α die Geometrie und berechnet die Endgeschwindigkeit aus Ruhe sowie Kraftkomponenten und Beschleunigung, optional mit Gleitreibung für bereits hangabwärts gleitende Körper; keine Haftreibungs-/Losbrechberechnung. Thermodynamics enthält die Unterseite Ideal Gases mit dem ersten Modell Ideal Gas Law (pV = nRT) mit vier inversen Zielgrössen, absolutem Druck und Kelvin. Oscillations & Waves enthält Doppler Effect mit dem akustischen Dopplereffekt für kollineare Unterschallbewegung, vier inversen Zielgrössen und animierten Wellenfronten. Optics enthält Total Internal Reflection mit Grenzwinkel, Brechung und Strahlenskizze. Modern Physics enthält Quantum mit einer Qubit-Karte, allen zehn Gattern der Qubit-Demo und interaktiver animierter 3D-Blochkugel. Electricity & Magnetism enthält neun Unterthemen mit 44 Elektrotechnik-Modellen in 30 Karten nach elecalculate.com; Three-Phase Systems enthält auch den Generator. Umfang und Quellen: `docs/ELECTRICITY.md`. Weitere Modelle und Veröffentlichung nur mit entsprechendem Auftrag.

Erweiterung aus den privaten Unterlagen Physik1/Physik2: 15 zusätzliche Unterthemen und 32 fachlich geprüfte Rechnerdefinitionen sowie Snell’s Law mit bestehendem Solver. Auswahl, genaue Abdeckung und Quellengrenzen: `docs/RESOURCE_CONTENT.md`. Die PDFs und Render-/OCR-Dateien bleiben ausserhalb des Repositories.

## Verbindliche Grundlagen

- [Verbindlicher Modellseitenstandard und zentrale Änderungsstellen](docs/MODEL_PAGE_STANDARD.md)
- [Implementierungsregeln für src/](src/AGENTS.md)
- [Architektur](docs/ARCHITECTURE.md)
- [Designsystem](docs/DESIGN_SYSTEM.md)
- [Physikalische Standards](docs/PHYSICS_STANDARDS.md)
- [Roadmap](docs/PROJECT_ROADMAP.md)

Der Modellseitenstandard hält die zuletzt akzeptierten UI-Entscheidungen fest; ältere Architekturentwürfe dürfen diese nicht stillschweigend zurücksetzen. Die Architektur unterscheidet vorhandene Implementierung und künftiges Zielbild. Bei Änderungen widersprüchliche Aussagen ersetzen, statt weitere historische Varianten anzuhängen. Keine zusätzliche Infrastruktur ohne konkreten Bedarf.

## Änderungen für alle Seiten an einer Stelle

Bestehende gemeinsame Komponenten und Farb-/Einheiten-/Formatierungsquellen wiederverwenden; Modellseiten nicht kopieren. Die Tabelle in `docs/MODEL_PAGE_STANDARD.md` nennt konkrete Änderungsstellen. Für neue Modelle dürfen nur Fachinhalte, Solver, modellabhängige Konfiguration und Datenadapter hinzukommen. Gemeinsame Layout-/Feld-/Menü-/Diagrammgestaltung zentral ändern.

Die gemeinsame Basis ist seit dem zweiten Modell umgesetzt: `ModelCard` erhält Theorie-Daten und einen Rechner-Snippet; `ModelHost` ordnet Rechnerkomponenten zu. `QuantityField`, `CalculatorShell`, `CalculatorTools` und `EquationBlock` samt `styles/calculator.css` werden von beiden Modellen genutzt. Weitere gemeinsame Änderungen dort vornehmen, nicht in jedem Rechner separat. Modellzahl, Feldanzahl und Gleichungen bleiben fachabhängig.

Nur Quellcode ändern: niemals `build/`, `.svelte-kit/`, `.netlify/` oder generierte Dateien mit Hashnamen bearbeiten. Dokumentation darf auf Quellen, nicht auf einen bestimmten Build-Hash verweisen.

## Entwicklung nach Freigabe der Implementierung

- Englisch (`en`) ist die Standardsprache; Deutsch (`de`) folgt später. UI-Texte zentral übersetzbar halten, Fachlogik sprachneutral und Inhalte über stabile Themen-IDs verknüpfen. Projektdokumentation darf Deutsch bleiben.
- SvelteKit und TypeScript im Strict-Modus; zentrale CSS-Tokens statt paralleler Styling-Systeme.
- Visuelle Referenz ist die bereitgestellte `Qubit_Demo/main/portal.html`: exakte Hell-/Dunkel-Flächenfarben und blaue Akzente gemäss `docs/DESIGN_SYSTEM.md`. Formeln weiterhin mit KaTeX, nicht mit manuellen HTML-/CSS-Brüchen.
- Physik und numerische Verfahren als reine TypeScript-Funktionen ohne Svelte, DOM, KaTeX oder Diagrammbibliotheken. Kein veränderlicher globaler Rechnerzustand.
- Eingaben an der Grenze parsen, validieren und nach SI konvertieren. Intern ungerundet rechnen; erst zur Ausgabe formatieren.
- Messwerte in Formeln und Resultaten mit geeigneten SI-Massvorsätzen und drei signifikanten Stellen darstellen. Angezeigte Rundungen niemals zurück in Solver oder Diagramme führen. Numerische Einsetzungen nur mathematisch nötig klammern und implizite Produkte mit `\cdot` eindeutig setzen.
- Jede Formel hat dokumentierte Voraussetzungen, Definitionsbereiche, Einheiten und fachliche Tests. Nichtendliche Zahlen niemals als gültige Ergebnisse ausgeben.
- Formelumstellungen explizit implementieren. Kein `eval`, keine willkürliche Skriptausführung und zunächst kein allgemeines CAS.
- Rechner über typisierte Definitionen und gemeinsame UI ergänzen. Den akzeptierten Modellseitenstandard und die untergeordneten `src/AGENTS.md` beachten. Neue Themen sollen keine kopierten Seiten benötigen.
- Formeln, Rechenweg und Visualisierungen verwenden dieselben validierten Ergebnisse. Keine zweite Physikimplementierung in Komponenten.
- Gemeinsame Schaltungsdiagramme bleiben quelleneigene SVG-Komponenten. Widerstände einheitlich als leicht gerundete Rechtecke mit gleicher Kontur-/Leitungsstärke zeichnen; Auswahlzustände verwenden Theme-Tokens: nicht Gewähltes im Hellmodus hellgrau, im Dunkelmodus dunkelgrau, Gewähltes neutral kontrastreich. Keine statischen Electricity-Referenzbilder wieder einführen.
- Abhängige Ergebnisse bei Eingabeänderungen neu berechnen oder verwerfen. Keine veralteten Resultate als gültig anzeigen.
- Tastaturbedienung, semantisches HTML, beide Farbschemata und reduzierte Bewegung bei jeder UI-Änderung berücksichtigen.
- Theorie und Navigation bleiben ohne JavaScript lesbar. Browserabhängige Diagramme und 3D isolieren und bedarfsgerecht laden.

## Qualität und Zusammenarbeit

Änderungen klein und nachvollziehbar halten. Bestehende Nutzeränderungen respektieren. Keine Secrets, personenbezogenen Eingaben oder generierten Build-Artefakte committen. Neue Pakete müssen einen belegbaren Bedarf erfüllen.

Später vorgesehene Prüfungen: Typprüfung/Svelte-Prüfung, fachliche Unit-Tests, Produktionsbuild und bei geänderten Nutzerabläufen gezielte Browserprüfungen. Aktuelle Befehle: `npm run check` und `npm run build`; Start mit `npm run dev`. `npm test` prüft die Fachlogik und Präfixformatierung mit dem eingebauten Node-Testläufer. Uniform Motion und Inclined Plane sind implementiert; neue Modelle nur im beauftragten Umfang ergänzen. Fehlerfälle und fachliche Grenzfälle sind wichtiger als reine Snapshot-Tests.

Bei grundlegenden Produktfragen nachfragen; reversible technische Details selbst entscheiden. Die Plattform ist nicht an eine einzelne Schulstufe gebunden; die konkreten mathematischen Voraussetzungen werden je Thema angegeben. Die bestätigte Richtung ist ein mathematisch höheres Niveau als die bisherige Lehrlingsplattform, kein pauschaler Hochschulvollumfang.
