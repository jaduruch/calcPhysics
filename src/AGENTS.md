# Vorgaben für Implementierungen in src/

Diese Regeln ergänzen die [Repository-Vorgaben](../AGENTS.md). Vor Änderungen an Themen, Rechnern oder Diagrammen den [verbindlichen Modellseitenstandard](../docs/MODEL_PAGE_STANDARD.md) lesen. Uniform Motion ist die vom Nutzer vorerst akzeptierte Referenz. Diese Referenz weiterverwenden, nicht bei jedem neuen Modell neu gestalten.

## Zentral ändern, gemeinsam verwenden

- Farben, Theme, gemeinsame Typografie und Seitennavigation in `lib/styles/app.css` beziehungsweise `routes/+layout.svelte` ändern; keine separaten Farbsätze in Themen anlegen.
- Gemeinsames Verhalten in vorhandenen Komponenten ändern: `ModelCard`, `Formula`, `UnitSelect`, `ThemeToggle`, `MotionChart`. Modellseiten dürfen diese nicht kopieren.
- Einheitenoptionen, SI-Standards und Konversionsfaktoren ausschliesslich in `lib/physics/units.ts` führen; Zahl-/Präfixparsing und Ergebnisformatierung in `lib/calculators/quantities.ts` verwenden.
- Gemeinsame Beschriftungen in `lib/i18n/en.ts`; Fachinhalte und Modellmetadaten über `lib/content/` bereitstellen. Keine Fachtexte anderer Modelle in einem globalen Kartenlayout hart codieren.
- `ModelCard` verwendet `ModelDefinition` und einen Rechner-Snippet, keine direkten Fachrechner-Imports. `ModelHost` ordnet die Rechner zu; `content/topics.ts` liefert themenspezifische Variablen, Formeln, Notizen und Quellen. Neue Modelle dort einordnen, nicht Karten kopieren.
- `QuantityField`, `CalculatorShell`, `CalculatorTools` und `EquationBlock` gemeinsam verwenden; Feld-/Raster-/Ergebnis-Styles liegen einmal in `styles/calculator.css`. Gemeinsame Masse wie `--control-height`, `--control-radius`, `--unit-control-width`, `--calculator-width` und `--theory-width` liegen in `styles/app.css`. Modellabhängige Visualisierungen bleiben separate Komponenten.
- Modellabhängig bleiben Eingabegrössen, Definitionsbereiche, Gleichungen, Annahmen, Datenadapter und nötige Diagrammtypen. Die feste Anzahl vier Felder und die zwei Kurven sind keine allgemeine Modellvorgabe.
- Nur Quelldateien bearbeiten. `build/`, `.svelte-kit/`, `.netlify/` und Dateien mit Hashnamen sind generierte Ausgabe, keine Designvorlage und keine Änderungsstelle.

## SEO zentral halten

`lib/seo.ts` und `components/SeoHead.svelte` erzeugen Metadaten/Canonical-URLs gemeinsam. Themen liefern optionale SEO-Überschreibungen in `lib/content/topics.ts`. Sitemap und robots sind vorgerenderte Endpunkte, keine manuell gepflegten Dateien in `static/`. Neue veröffentlichte Themen automatisch in die Sitemap aufnehmen; Vorschau-Builds nicht indexieren. Domain-/Redirectdetails und letzte mobile Labormessung siehe [SEO.md](../docs/SEO.md).

## Sprache und Ton

- Sachliche, fachlich konkrete UI-Texte verwenden. Keine Werbesprüche oder motivierenden Schlagwortzeilen; deutsche Texte natürlich formulieren statt englische Slogans wörtlich zu übersetzen.

## Seiten- und Kartendesign

- Englisch ist Standard; Deutsch ist über den Footer unter `/de/` verfügbar. Übersetzungen in `lib/i18n/de.ts` und `text-de.ts` pflegen; Komponenten nutzen `runtime.ts`, reine Fachlogik bleibt sprachneutral. Fehlende Fachübersetzungen erscheinen mit zentralem Hinweis auf Englisch. Keine Übungen, Quiz oder Lernfortschrittsanzeigen.
- Eine standardmässig eingeklappte Karte je Modell, Karten untereinander. Kartenüberschrift ohne blauen Hover-Farbwechsel. Header-Links behalten ihren Hover-Effekt und markieren das aktive Hauptthema auch auf Unterseiten blau und unterstrichen. Breadcrumbs bleiben ohne Unterstreichung.
- Kein zusätzlicher Modellüberschrift-/Zähler-/Hilfetextblock über den Karten.
- Theorie hinter dem linksbündigen, rahmenlosen ⓘ-Button; geöffnet wird daraus ✕. Kein sichtbarer „Theory“-Titel. Theorie und Formeln direkt auf der Kartenfläche, keine zusätzliche Theorie-Karte.
- Wird die gesamte Modellkarte geschlossen, wird auch der geöffnete Theorie-Zustand zurückgesetzt. Beim erneuten Öffnen startet die Theorie geschlossen.
- Theorie mit Variablen, Einheiten, Formeln und kurzen fachlichen Erklärungen. KaTeX mit HTML/MathML und `trust: false`. Zeitliche Ableitungen in Punktnotation, soweit fachlich passend.
- Calculate enthält Eingaben, Reset, Umrechnungen, Ergebnisgleichungen und Diagramme. Kompakte Breiten/Abstände wie im Referenzmodell bewahren; keine Verteilung weniger Inhalte über die gesamte Laptopbreite.

## Eingaben und Einheiten

- Pro Grösse: Textfeld für Zahl mit optionalem Präfix und rechts ein kleineres eigenes `UnitSelect`. Keine Präfix-Dropdowns; kein natives, betriebssystemabhängig gestaltetes Einheitenmenü.
- Eingaben und Reset verwenden dieselbe neutrale Fläche (`--color-control`), 8-px-Rundung und mindestens 44-px-Höhe.
- Zahlenfeld im Fokus: graue 1-px-Kontur direkt am Feld, kein Abstand. Bei ungültiger Eingabe dieselbe Kontur gestrichelt; kein zusätzlicher weisser oder blauer Rahmen und kein Layoutsprung.
- Einheiten-Auslöser entsprechend ausdrücklichem Nutzerwunsch ohne Fokusrahmen und Unterstreichung. Tastaturbedienung, ARIA-Zustände und aktive Optionsfläche in der geöffneten Liste erhalten. Keine pauschale Zusicherung vollständiger WCAG-Konformität daraus ableiten.
- Präfixe p/n/u/m/c/d/k/M/G/T, ohne Präfix ebenfalls erlaubt; Gross-/Kleinschreibung beachten. µ/μ werden wie u akzeptiert. Dezimalkomma/-punkt und Exponentialschreibweise unterstützen; keine Tausendertrennzeichen.
- SI ist die Startauswahl jeder Rechnerinstanz. Länge: m/AE/Lj, Geschwindigkeit: m/s und km/h, Zeit: s/min/h/d; neu Masse: kg/g, Winkel: rad/°, Beschleunigung: m/s², Kraft: N, dimensionslos: 1. Die Registry gilt überall.
- Ein Einheitenwechsel lässt den manuellen Eingabetext in allen Rechnern exakt unverändert und interpretiert ihn mit der neu gewählten Einheit. Keine automatische Umrechnung oder Neuformatierung des Zahlenfelds; nach dem Wechsel Ergebnisse mit der neuen Einheit neu berechnen beziehungsweise invalidieren.
- Ausschliesslich manuelle Rohwerte in Textfeldern anzeigen. Berechnete und angenommene Werte niemals automatisch hineinsetzen. Keine wieder eingeführten langen Eingabeanleitungen.

## Berechnung und Ergebnisse

- Reiner TypeScript-Solver, intern SI und ungerundet. Darstellung und Diagramme dürfen die Berechnungsquellen nicht verändern.
- Automatisch aktualisieren. Fehlende, ungültige, unlösbare und unterbestimmte Eingaben getrennt behandeln; `0` ist eine Eingabe. Veraltete Resultate bei ungültigen Eingaben verwerfen.
- Ergebnis nur unter den Feldern als KaTeX-Kette: Zielgrösse = allgemeine umgestellte Formel = Zahleneinsetzung =/≈ Ergebnis. Zwischen allgemeiner Formel und Einsetzung immer `=`.
- Nicht-SI-Eingaben zunächst sichtbar in SI umrechnen; danach die konvertierten Werte einsetzen. Messwerte in Umrechnung, Einsetzung und Resultat mit drei signifikanten Stellen zeigen; exakte Einheitenfaktoren exakt lassen. Intern mit ungerundeten Werten weiterrechnen. Passende Präfixe aus dem gemeinsamen Formatter nutzen.
- Widerstände, Kapazitäten, Ströme und weitere Messgrössen auch innerhalb der Zahleneinsetzung mit passenden Engineering-Präfixen darstellen. Dimensionslose Werte erhalten keinen Präfix; bei bereits gewählten Nicht-SI-Einheiten keine doppelten Präfixe erzeugen.
- Einzelne positive Messwerte nicht pauschal einklammern. Klammern nur bei Vorzeichen, Potenzen, Funktionsargumenten oder sonstiger mathematischer Mehrdeutigkeit setzen. Implizite Multiplikation zwischen eingesetzten Grössen beziehungsweise Faktoren sichtbar mit `\cdot` schreiben.
- Nur berechnetes t bekommt eine zusätzliche Uhrdarstellung aus dem ungerundeten SI-Wert: unter 60 s keine; ab 60 s MM:SS.s; ab 3600 s HH:MM:SS.s; ab einem Tag zusätzlich Nd,. Darstellung hinter `=`, nicht in Klammern; Zehntelsekunden korrekt übertragen.

## Diagramme

- Diagramme stehen unter den Ergebnissen, auf breiten Bildschirmen nebeneinander, mobil untereinander. Keine Datentabelle hinzufügen.
- Diagrammflächen und schematische Kurven bleiben auch ohne gültige Eingaben sichtbar; dann keine numerischen Skalen oder vermeintlichen Messergebnisse. Beschreibungen müssen schematische und berechnete Darstellung unterscheiden. Sonderfall t = 0 nicht als Bewegung über ein erfundenes Intervall zeichnen.
- Bei gültigen Eingaben ungerundete Solver-Daten verwenden. Kurven ohne Kreismarkierungen an Anfang/Ende.
- Achsenlabels als s [m], v [m/s], t [s]; keine doppelte Einheitenangabe rechts oben. Y-Label direkt über der obersten Skalenangabe.
- Rasterlinien dezent, auch die unterste; die horizontale Nullachse kräftig (2 px), durchgezogen und mit 0 beschriftet. Ohne Daten liegt sie unten, ohne numerische Skala. Positive Achsenenden erhalten Pfeile. Überlappende Ticktexte vermeiden.
- Tickwerte mit drei signifikanten Stellen; bei Betrag >= 1000 oder 0 < Betrag <= 0.001 als Koeffizient × 10 mit hochgestelltem Exponenten. Null bleibt 0. Gemeinsamen `formatAxisLabel` verwenden.
- SVG reicht für die jetzigen Geraden; keine zusätzliche Diagrammbibliothek ohne konkreten Bedarf. Spätere komplexere Modelle dürfen denselben visuellen Rahmen mit einem passenden Renderer nutzen.
- Elektrotechnische Schaltungen dynamisch mit eigenen SVG-/Svelte-Komponenten erzeugen; keine lokalen Referenzbilder als Ersatz für modellgebundene Diagramme. Widerstandsrechtecke verwenden zentral dieselbe dünne Kontur, leicht gerundete Ecken und gleich dünne Anschlussleitungen.
- Ausgegraute Diagrammelemente verwenden `--color-diagram-muted`: helles Grau im Light Mode, dunkles Grau im Dark Mode. Bei einer Grössenauswahl bleibt nur die gewählte Grösse neutral kontrastreich; die übrigen relevanten Schaltungsteile werden grau. Beim Stern–Dreieck-Diagramm betrifft dies die gesamte Schaltung einschliesslich Leitungen, Knoten, Widerständen und Beschriftungen.
- Bei kombinierten Richtungs-/Topologie-Rechnern bleiben manuelle Eingaben beim Umschalten erhalten. Quell- und Zielzeichnung wechseln ihre Reihenfolge so, dass die gewählte Ausgangsschaltung zuerst steht; Feldsymbole und Diagrammwerte folgen demselben Modus.

## Verifikation

Für neue Rechner und gemeinsame Komponentenänderungen `npm test`, `npm run check` und `npm run build` ausführen. Solver-Grenzfälle, Umrechnungen, reine Anzeige-Rundung und Invalidierung gezielt prüfen. Bei Layout-/Interaktionsänderungen beide Themes, Laptop/Mobilansicht und Tastatur prüfen, soweit Browserwerkzeuge verfügbar sind; fehlende Browserprüfung benennen. Reine Dokumentänderungen benötigen Link-/Konsistenzprüfung, keinen erneuten Produktionsbuild.

## Inclined Plane

`physics/mechanics/inclined-plane.ts` erwartet Masse und Winkel, optional μₖ (Standard 0) und g (Standard 9.81 m/s²). Intern Winkel in rad, Masse in kg; m > 0, g > 0, μₖ >= 0, 0 <= α <= π/2. Die UI rechnet alle sechs Ergebnisse vorwärts aus und hat noch keine inversen Zielgrössenmodi. Gleitreibung wirkt beim bereits hangabwärts gleitenden Körper bergauf. Negative resultierende Kraft/Beschleunigung bedeutet Abbremsen, keine Aussage über Losrutschen oder Richtungsumkehr; nicht auf null klemmen. Keine Haftreibung, keine Rollbewegung. Annahmen sichtbar am Rechner lassen. Die SVG-Skizze nutzt dieselben ungerundeten Resultate und `visualization/inclined-plane.ts` für Geometrie und proportional skalierte Kraftpfeile. Winkel und Reibungsverhältnisse aktualisieren sich auch bei unvollständigen Eingaben über eine klar schematische Vorschau desselben Solvers (Einheitsmasse/-gravitation). Keine willkürlichen Pfeillängen oder festen Spitzen, die kurze Pfeile optisch verlängern; Nullkräfte nicht zeichnen. Die Hangkomponente bleibt als Komponente gekennzeichnet.
