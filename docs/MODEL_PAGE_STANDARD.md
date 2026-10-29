# Verbindlicher Standard für Modellseiten

## Status und Geltung

Uniform Motion wurde vom Nutzer vorerst als Referenz für Aufbau, Gestaltung und Bedienung akzeptiert. Dieser Stand ist die Grundlage für neue Modelle, keine Aufforderung, bereits weitere Themen zu implementieren oder zu veröffentlichen. Die Arbeitsregeln für künftige Implementierungen stehen in [src/AGENTS.md](../src/AGENTS.md); die Farbpalette steht im [Designsystem](DESIGN_SYSTEM.md), die fachlichen Regeln in den [Physikstandards](PHYSICS_STANDARDS.md).

Neue Modelle übernehmen die gemeinsame Oberfläche. Ihre Physik, Eingabegrössen und Visualisierungen dürfen fachlich anders sein. Uniform Motion hat vier Eingabegrössen und zwei Diagramme; das ist kein Zwang für jedes künftige Modell. Die nachfolgende Zuordnung unterscheidet bereits gemeinsame Implementierung und noch nötige Wiederverwendung.

## Wo Änderungen für alle Seiten erfolgen sollen

| Änderung | Gemeinsame Quelle / Änderungsstelle |
| --- | --- |
| Farbpalette, Theme-Farben, Basis-Typografie, Seitengrössen | [app.css](../src/lib/styles/app.css) |
| Header, Logo und aktive Hauptnavigation | [+layout.svelte](../src/routes/+layout.svelte), Navigation-CSS in app.css |
| Theme-Verhalten und Morph-Symbol | [ThemeToggle.svelte](../src/lib/components/ThemeToggle.svelte); frühe Initialisierung in [app.html](../src/app.html) |
| Favicon und Logo-Geometrie | [favicon.svg](../static/favicon.svg); Header nutzt es als Maske |
| Hierarchie, verfügbare Themen und aktuelle Modelldaten | [topics.ts](../src/lib/content/topics.ts) |
| Übersichten und Breadcrumb-Aufbau | [Overview.svelte](../src/lib/components/Overview.svelte) |
| Modellkartenrahmen, Theorie-Layout und Info-Button | [ModelCard.svelte](../src/lib/components/ModelCard.svelte) |
| KaTeX-Ausgabe | [Formula.svelte](../src/lib/components/Formula.svelte) |
| Einheitenoptionen und SI-Konversionsfaktoren | [units.ts](../src/lib/physics/units.ts) |
| Präfixe, Parsing, drei signifikante Ergebnisstellen | [quantities.ts](../src/lib/calculators/quantities.ts) |
| Einheitenmenü samt Tastaturbedienung | [UnitSelect.svelte](../src/lib/components/ui/UnitSelect.svelte) |
| Achsen, Raster, Kurven und Pfeile | [MotionChart.svelte](../src/lib/components/calculator/MotionChart.svelte) |
| Wissenschaftliche Achsenbeschriftung | [axis-label.ts](../src/lib/visualization/axis-label.ts) |
| Zeit-Zusatzformat | [duration.ts](../src/lib/calculators/duration.ts) |
| Gemeinsame englische UI-Texte | [en.ts](../src/lib/i18n/en.ts) |

Gemeinsame Komponenten importieren, nicht kopieren. Nur Eigenschaften, die bewusst pro Modell variieren, werden als typisierte Props/Definitionen/Snippets übergeben. Keine themenspezifischen CSS-Überschreibungen für dieselben Felder, Menüs oder Diagrammachsen anlegen.

## Was vor einem zweiten Modell noch zu lösen ist

Der aktuelle Pilot ist nicht bereits vollständig generisch: `ModelCard.svelte` importiert direkt `UniformMotionCalculator`, nutzt dessen Modelldaten und enthält den Text zur konstanten Ableitung. Die Feld-, Ergebnis- und Berechnungsflächen-Styles liegen teilweise noch in `UniformMotionCalculator.svelte`. Diese Bindungen sind beim nächsten Modell zuerst zu lösen:

1. Kartenhülle und Theorie-Layout einmal beibehalten. Modelle liefern Daten für Variablen/Formeln, optionale Erklärung und ihren Rechner als Inhalt. Keine Uniform-Motion-Erklärung für fachfremde Modelle rendern.
2. Zahlenfeld plus Einheitenauswahl als gemeinsamen Baustein extrahieren; Name, Symbol, Grössenart, Rohwert, Einheit, Fehler und Einheitenwechsel-Verhalten übergeben. Die bestehende Einheitenregistry und `UnitSelect` verwenden.
3. Eingaberaster, Reset, Umrechnungs-/Ergebnisbereich und zugehörige Styles einmal gemeinsam führen. Allgemeine Abstände, Feldhöhen, Radien und Inhaltsbreiten in zentrale semantische CSS-Tokens überführen; Farbwerte bleiben im vorhandenen Token-System. Nicht sämtliche Physik in ein Formularschema pressen.
4. Diagrammrahmen und Achsenformatierung weiterverwenden; den Datenadapter je Modell separat halten. Plotly oder Three.js erst bei tatsächlich benötigten Funktionen ergänzen.
5. Uniform Motion vor und nach der Extraktion mit denselben Fach- und UI-Fällen überprüfen. Keine sichtbare Neugestaltung zusammen mit der Extraktion einführen.

Damit ändern spätere Anpassungen an gemeinsamem Rahmen, Feldern, Formeln oder Achsen alle verwendenden Seiten an derselben Stelle. Aktuell vorhandene lokale Styles werden hier nicht fälschlich als bereits zentralisierte Tokens beschrieben.

## Akzeptierter Aufbau

```text
Gemeinsamer Header mit Logo, aktiver Hauptnavigation und Sonne/Mond
Breadcrumbs ohne Unterstreichung
Seitentitel und kurze Themenbeschreibung
Modellkarte (anfangs geschlossen, kein blauer Überschriften-Hover)
  Modellname und Aufklapppfeil
  ⓘ linksbündig → ✕ bei geöffneter Theorie
  Theorie (ohne sichtbaren Titel und ohne eigene Karte)
    Variables mit Symbolen/Einheiten | Key Formulas (KaTeX)
    Kurze modellabhängige Erklärung, wo sinnvoll
  Calculate (eigene dezente Fläche)
    Zahlenfelder + kleinere eigene Einheitenmenüs
    Präfix-/Präzisionshinweis und Reset
    Umrechnung in SI, falls benötigt
    Allgemeine Formel = Einsetzung =/≈ Ergebnis
    Diagramme
```

Keine zusätzliche Überschrift „Theory & calculation models“, kein „01 MODEL“-Zähler und keine lange Eingabeanleitung über der Karte beziehungsweise den Feldern. Die kleine Nummer innerhalb des Kartenheaders bleibt davon unberührt. Keine Übungen, keine Diagrammtabelle. Theorie und Berechnen liegen derzeit in derselben Modellkarte auf der Kinematics-Seite; keine separaten Modellrouten allein zur Erfüllung eines älteren Architekturentwurfs anlegen.

## Konkrete Gestaltungswerte

Die Seitenpalette aus `portal.html` bleibt exakt erhalten; keine neuen Farbsysteme je Thema. Modellkarte: 10-px-Radius, 20-px-Innenabstand, mobil 16 px. Theorie ohne zusätzliche Hintergrundfläche. Theorie-Inhalt maximal 48 rem, zwei Spalten mit 24 px Abstand; unter 56 rem eine Spalte. Rechner maximal 52 rem; zwei Eingabespalten, unter 40 rem eine. Einheitenmenü 88 px breit, 8 px Abstand zum Zahlenfeld. Diagramme unter 44 rem untereinander. Diese Werte beschreiben den akzeptierten Stand; spätere gemeinsame Änderungen an den zentralen Bausteinen sind ausdrücklich erwünscht.

Eingaben, Reset und Einheiten-Auslöser: `--color-control`, 8-px-Radius, mindestens 44-px-Höhe, keine normalen Rahmen. Zahlenfeld: grauer 1-px-Fokusrahmen ohne Abstand; ungültig derselbe Rahmen gestrichelt, kein zusätzlicher heller Rand. Einheitenauslöser: weder Fokusrahmen noch Unterstreichung; Optionsliste mit Theme-Fläche, 10-px-Radius, dezentem Schatten, Häkchen für aktuelle Einheit und neutraler aktiver Fläche. Menü bleibt per Pfeiltasten, Home/End, Buchstabensuche, Enter/Leertaste, Escape und Tab bedienbar. Pfeilabstand rechts 14 px.

Header-Links behalten blauen Hover sowie blaue Unterstreichung des aktiven Hauptthemas einschliesslich Unterseiten. Breadcrumbs bleiben einheitlich hoch, auf einer Grundlinie und ohne Unterstreichung. Der Theme-Schalter hat weder Hintergrundrechteck noch Hover-Farbwechsel: Sonne/Mond morphen über einen gemeinsamen Kreis in etwa 400 ms. Beim ersten Besuch gilt die Systemeinstellung, danach die gespeicherte manuelle Wahl; keine „System“-Auswahl. Reduzierte Bewegung respektieren.

## Zahlen und Resultate

Zahl samt Präfix direkt tippen, etwa `1.5k` oder `250m`. Einheiten im separaten gemeinsamen Menü wählen; SI ist Standard. `m` und `M` unterscheiden sich. Rechnen intern mit ungerundeten SI-Werten. Eingabefelder zeigen ausschliesslich manuelle Rohwerte, Resultate nur unten.

Nicht-SI-Eingaben zuerst sichtbar umrechnen, dann in SI einsetzen. Messwerte in Umrechnung, Einsetzung und Resultat auf drei signifikante Stellen runden; Definitionsfaktoren bleiben exakt. Allgemeine umgestellte Formel und numerische Einsetzung werden immer mit `=` verbunden. Wo Rundung erfolgt, kann bei Konversion beziehungsweise Endergebnis `≈` erscheinen. Ergebnispräfixe kommen aus dem gemeinsamen Formatter, der Tausenderschritte bevorzugt. Durch die Anzeige gerundete Werte niemals als nächste Berechnungsquelle verwenden.

## Uniform-Motion-Verhalten, das nicht versehentlich verloren gehen darf

- Gleichung `s = s₀ + v · t`. Drei manuelle Werte bestimmen den vierten. Zwei Werte aus s/v/t setzen s₀ = 0 voraus; zwei Werte einschliesslich s₀ reichen nicht. Annahme sichtbar anzeigen, ohne das leere Feld zu füllen.
- Vier manuelle Werte: ein Feld muss geleert werden. Keine stillen Überschreibungen. Null zählt als Eingabe; negative Position/Geschwindigkeit sind möglich, verstrichene Zeit ist nicht negativ.
- Einheiten: s₀/s → m, AE, Lj; v → m/s, km/h; t → s, min, h, d. Die Auswahl am fehlenden Feld steuert die Ergebniseinheit.
- Bei v ändert ein Einheitenwechsel nur die Interpretation, nicht den Eingabetext. Bei s₀/s/t bleibt derzeit die physikalische Grösse erhalten und die Zahl wird umgerechnet. Das ist eine bestätigte Ausnahme, keine versehentliche Inkonsistenz, die ungefragt zu beheben wäre.
- Theorie enthält Variablen, Positions-/Geschwindigkeits-/Beschleunigungsformel und die Erklärung `v(t) = dot(s)(t) = constant` mit echter KaTeX-Punktnotation.
- Nur bei berechnetem t: zusätzliche Dauer hinter `=` aus dem ungerundeten SI-Ergebnis. t < 60 s: keine; ab 60 s MM:SS.s; ab 3600 s HH:MM:SS.s; ab einem Tag Nd, HH:MM:SS.s. Keine Klammern oder „0d,“. Zehntelsekunden mit Überträgen runden.

## Diagrammstandard

s(t) und v(t) stehen unter den Resultaten, immer sichtbar innerhalb der geöffneten Modellkarte. Ohne gültige Berechnung: schematische Kurven ohne Skalenwerte; bei Uniform Motion eine steigende Positionsgerade und eine horizontale Geschwindigkeitslinie. Keine alten Ergebniswerte weiterzeigen. Bei gültigen Werten den echten Verlauf aus ungerundeten Solverdaten verwenden. t = 0 ist ein Nullintervall, kein erfundener Bewegungsverlauf.

Raster dezent, auch die unterste Linie. Nullachse 2 px dick und durchgezogen, mit numerischen Daten links durch 0 beschriftet; ohne Daten liegt sie unten. Positive Achsenenden haben Pfeile. Keine Kreise an Kurvenanfang/-ende. Kurven verwenden die zentrale Akzentfarbe.

Achsenlabel „Grösse [Einheit]“, Y-Label direkt über der obersten Skalenangabe, keine doppelte Beschriftung oben rechts. Tickwerte mit drei signifikanten Stellen; für Betrag >= 1000 oder 0 < Betrag <= 0.001: Koeffizient × 10 mit echtem hochgestellten Exponenten. Null als 0. Kollisionen mit der Nullbeschriftung vermeiden.

SVGs haben Titel und Beschreibungen, die schematische Darstellung erkennbar benennen. Keine Datentabelle neu einführen. Eine visuell akzeptierte Referenz ersetzt keinen Nachweis vollständiger Accessibility oder Browserkompatibilität.

## Änderungen und Prüfung

Bei gemeinsamen Designänderungen die gemeinsame Quelle bearbeiten und mehrere Ansichten prüfen, nicht jede Seite einzeln nachziehen. Akzeptierte neue Entscheidungen hier beziehungsweise im passenden Fach-/Designdokument aktualisieren, alte widersprüchliche Aussagen ersetzen. Arbeitsregeln bleiben über die AGENTS-Dateien auffindbar.

Für neue Modelle: Fachtests für alle Zielgrössen, Einheiten, Präfixe, Grenzfälle, Rundung und Invalidierung; `npm test`, `npm run check`, `npm run build`. Für gemeinsame UI: Laptop/Mobil, beide Themes, leere/ungültige/gültige Zustände, Tastatur und Fokus prüfen, soweit Browserwerkzeuge vorhanden sind. Dokumentationsänderungen allein benötigen Konsistenz- und Linkprüfung.
