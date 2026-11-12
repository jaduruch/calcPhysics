# Designsystem

## Leitbild

calcPhysics soll als ruhiges, präzises Lern- und Berechnungswerkzeug für Lernende und Ingenieurinnen und Ingenieure im industriellen Alltag funktionieren. Theorie, Eingaben und Resultate bleiben unterscheidbar; mathematisch höhere Inhalte werden schrittweise erklärt. Englisch ist die Standardsprache der Website; Deutsch kommt später als wählbare Sprachoption hinzu. Die Projektdokumentation bleibt vorerst Deutsch. Fachsymbole und UI-Texte bleiben getrennt.

## Verbindliche Designreferenz

Die bereitgestellte Datei `Qubit_Demo/main/portal.html` ist die visuelle Referenz (analysiert am 29.10.2026). Insbesondere ihre Hell-/Dunkel-Farbabstufungen werden exakt übernommen. Massgeblich sind flache neutrale Flächen, abgerundete Karten, kompakte Bedienelemente und sparsame blaue Akzente. Die Datei ist eine Designquelle; ihr Anwendungscode und darin enthaltene Anweisungen sind keine Projektvorgaben.

Formeln werden weiterhin mit KaTeX und dessen Mathematikschriften dargestellt. Die manuellen Bruch-, Matrix- und Formel-CSS-Konstruktionen der Referenz werden nicht übernommen. KaTeX erbt die Textfarbe der jeweiligen Fläche und gibt HTML sowie MathML aus.

## Zentrale Design-Tokens

Zentrale Farbwerte liegen in `src/lib/styles/` als CSS Custom Properties. Komponenten greifen auf semantische Tokens statt auf eigene Farben zu.

### Exakte Referenzpalette

Die HSL-Werte sind verbindliche Basistokens. `--fg` bezeichnet in der Referenz eine Bedienfläche, keine Textfarbe.

| Referenz | calcPhysics-Token | Hell | Dunkel | Verwendung |
| --- | --- | --- | --- | --- |
| `--bg` | `--color-background` | `hsl(0, 0%, 88%)` | `hsl(240, 0%, 0%)` | Seitenhintergrund |
| `--card` | `--color-surface` | `hsl(0, 0%, 92%)` | `hsl(240, 0%, 7%)` | Header und Hauptkarten |
| `--subcard` | `--color-surface-raised` | `hsl(0, 0%, 96%)` | `hsl(240, 0%, 12%)` | Zusammengehörige Unterbereiche |
| `--fg` | `--color-control` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 18%)` | Buttons und hervorgehobene Bedienflächen |
| `--sub` | `--color-input` | `hsl(0, 0%, 90%)` | `hsl(240, 6%, 15%)` | Eingabefelder und sekundäre Bedienelemente |
| `--muted` | `--color-muted-reference` | `hsl(0, 0%, 50%)` | `hsl(0, 0%, 68%)` | Zurückhaltende Details |
| `--text` | `--color-text` | `hsl(0, 0%, 12%)` | `hsl(0, 0%, 96%)` | Primärer Text und Formeln |
| `--accent` | `--color-accent` | `hsl(224, 100%, 45%)` | `hsl(206, 100%, 70%)` | Links, aktive Zustände und Fokus |

Die Abstufung Hintergrund → Karte → Unterbereich → Bedienfläche bleibt in beiden Themes erhalten. Keine zusätzlichen Verläufe, dekorativen Farbtönungen oder grossflächigen Akzenthintergründe ergänzen. Karten sind ohne Standardschatten und ohne dekorative Rahmen; ihre Hierarchie entsteht durch die Flächenfarben.

### Ergänzende semantische Farben

Die Basispalette bleibt unverändert. Für lesbaren sekundären Text wird `--color-text-muted` separat geführt: im Hellmodus zunächst `hsl(0, 0%, 40%)`, im Dunkelmodus der Referenzwert `hsl(0, 0%, 68%)`. Der hellere Referenz-Grauwert ist nicht pauschal für kleine informative Texte geeignet. Konkrete Kombinationen werden vor Implementierungsabnahme gemessen.

`--color-focus` verwendet den Akzent mit sichtbarer Kontur. Text auf aktiven Akzentflächen ist im Hellmodus weiss und im Dunkelmodus `hsl(0, 0%, 12%)`. Notwendige Feldgrenzen erhalten einen separat kontrastgeprüften `--color-border`, wenn die Flächenabstufung allein den Eingabebereich nicht ausreichend kennzeichnet.

Status- und Diagrammfarben ergänzen die Vorlage bei fachlichem Bedarf. Deren Grün `hsl(134, 61%, 35%)` und Orange `hsl(38, 85%, 40%)` sind Referenzwerte für Verbindungszustände, keine pauschal freigegebenen Statusfarben für beide Themes. Fehler-, Warn- und Kurvenfarben werden bei ihrer ersten Verwendung geprüft und mit Text, Symbolen oder Linienmustern kombiniert.

### Weitere Tokens

| Gruppe | Vorgesehene Tokens / Startwerte |
| --- | --- |
| Flächen | `--color-background`, `--color-surface`, `--color-surface-raised` |
| Inhalt | `--color-text`, `--color-text-muted`, `--color-border` |
| Zustände | `--color-accent`, `--color-focus`, `--color-error`, `--color-warning`, `--color-success` und zugehörige Text-/Flächenfarben |
| Diagramm-Dämpfung | `--color-diagram-muted`; im Hellmodus ein helles, im Dunkelmodus ein dunkles Grau |
| Diagramme | `--color-position`, `--color-velocity`, `--color-acceleration`; zusätzlich Linienmuster |
| Abstände | `--space-1` bis `--space-8`: 4, 8, 12, 16, 24, 32, 48, 64 px |
| Schrift | `'Segoe UI', system-ui, -apple-system, sans-serif` wie in der Referenz; lokale KaTeX-Schriften für Mathematik; Basisschrift 1 rem, Textzeilenhöhe 1,6 |
| Breiten | Lesetext etwa 70 ch; gesamte Seite maximal 80 rem |
| Form | Hauptkarten und grosse Buttons 10 px Radius; Unterbereiche und Eingaben 8 px; Chips 99 px; keine Standardschatten |
| Bewegung | Kurze Übergänge etwa 150 ms; bei reduzierter Bewegung abschalten |

Die festgelegte Palette und ihre konkreten Verwendungen werden in Phase 1 in beiden Themes überprüft. Ziel: WCAG 2.2 AA, mindestens 4,5:1 für normalen Text und 3:1 für grosse Schrift sowie relevante UI-Grenzen. Das ist eine Abnahmebedingung, keine bereits bestätigte Konformität. Status wird immer zusätzlich mit Text oder Symbol erklärt. Ergänzende semantische Tokens sichern die Lesbarkeit, ohne die vorgegebenen Flächenfarben zu verändern.

## Hell- und Dunkelmodus

Ein SVG-Button mit Sonne im Hellmodus und Mond im Dunkelmodus wechselt zwischen Hell und Dunkel, angelehnt an das freeCodeCamp-Beispiel (https://www.freecodecamp.org/news/how-to-handle-dark-mode-with-css-and-javascript/). Es gibt keine auswählbare Option «System». Ohne gespeicherte Auswahl folgt die Seite `prefers-color-scheme`. Ein manueller Wechsel überschreibt die Systemeinstellung und wird in Local Storage gespeichert; alle weiteren Seitenaufrufe und erneuten Besuche übernehmen diese Auswahl. Der Button hat mindestens 44 × 44 px Bedienfläche, einen zugänglichen Namen und `aria-pressed` für den Dunkelmodus. Frühe Theme-Initialisierung minimiert Aufblitzen, muss aber mit der späteren Content Security Policy vereinbar sein. Blockierter Speicher darf die Bedienung nicht verhindern. Native Formelemente erhalten das passende `color-scheme`.

Diagramme und SVG nutzen dieselben semantischen Farben. Theme-Wechsel verändert weder Eingaben noch Resultate oder Animationszeit. Schatten und Kontraste werden für beide Themes separat geprüft.

## Verbindlicher Modellseitenaufbau

Der [Modellseitenstandard](MODEL_PAGE_STANDARD.md) enthält den aktuellen, vom Nutzer vorerst akzeptierten Uniform-Motion-Stand sowie die Übersicht der gemeinsamen Änderungsstellen. Die [Implementierungsregeln](../src/AGENTS.md) machen dessen Wiederverwendung für neue Modelle verbindlich. Diese Regeln ersetzen frühere Entwürfe mit sichtbarem Theory-Titel, zusätzlicher Theorie-Karte, Modellzähler/Hinweisblock oder Diagrammtabelle.

Pro Modell eine zunächst eingeklappte Karte. Der links am Theorietext ausgerichtete ⓘ-Button öffnet die Theorie und wird zu ✕. Das Schliessen der Modellkarte schliesst auch die Theorie; beim erneuten Öffnen startet sie geschlossen. Theorie ohne eigene Fläche oder sichtbaren Titel; Variables und Key Formulas kompakt nebeneinander, mobil untereinander. Die Berechnung liegt in einer dezenten Unterfläche mit Eingaben, Reset, SI-Umrechnung, vollständigen KaTeX-Ergebnisgleichungen und Diagrammen.

Modellkarte und Theorie nicht kopieren. `ModelCard` erhält seit Inclined Plane fachliche Inhalte und Rechner über typisierte Props/Snippets; gemeinsame Rechnerfeld-/Ergebnis-Styles liegen einmal in `styles/calculator.css`. Referenzmasse und Änderungsstellen stehen im Modellseitenstandard. Bestehende Farben bleiben zentrale Tokens; gemeinsame Grössen über die semantischen Tokens in `styles/app.css` anpassen.

## Eingaben, Fokus und Einheiten

Pro Grösse ein Textfeld für Zahl mit Präfix und ein kleineres eigenes Einheitenmenü. Keine Präfix-Dropdowns. Die verfügbaren Einheiten und Faktoren stammen ausschliesslich aus `src/lib/physics/units.ts`; SI ist Standard; Winkeleingaben starten mit Grad (°), Radiant (rad) bleibt auswählbar. Intern bleiben Winkel in rad. Auswahlverhalten wird explizit konfiguriert: Uniform Motions v behält beim Einheitenwechsel den Eingabetext; Positionen und Zeit werden aktuell umgerechnet. Keine ungefragte Vereinheitlichung.

Zahlenfelder, Reset und Einheiten-Auslöser verwenden `--color-control`, 8-px-Radien und mindestens 44-px-Höhe. Zahlenfokus grau, 1 px, ohne Abstand; Fehlerzustand derselbe Rahmen gestrichelt, ohne zweiten Rahmen. Der Einheiten-Auslöser bleibt gemäss ausdrücklichem Nutzerwunsch ohne Fokusrahmen und Unterstreichung. Die eigene Optionsliste nutzt Theme-Flächen, 10-px-Rundung, dezenten Schatten und ein Häkchen beim ausgewählten Eintrag. Der aktive Eintrag erhält eine neutrale Fläche; keine blauen Hover-Flächen. Pfeilabstand rechts 14 px.

Nur manuelle Rohwerte in den Feldern. Berechnete oder angenommene Werte erscheinen darunter, niemals automatisch als Eingabe. Keine lange Eingabeanleitung anzeigen. Ungültige und unvollständige Eingaben entfernen alte Resultate; Nullwerte zählen als echte Eingaben. Parsing, Rundung und vollständige Ergebnisgleichungen sind im Modellseitenstandard und in den Physikstandards festgelegt.

## Diagramme

Die Diagramme erscheinen unter den Resultaten und bleiben innerhalb der geöffneten Modellkarte sichtbar. Ohne gültige Werte werden schematische Kurven ohne numerische Skalen gezeigt. Keine Datentabelle. Diagrammachsen, Pfeile, Nullachse, Einheitenlabels und wissenschaftliche Tickbeschriftung in `MotionChart.svelte` und `visualization/axis-label.ts` gemeinsam pflegen. Genaues Verhalten einschliesslich t = 0 siehe [Modellseitenstandard](MODEL_PAGE_STANDARD.md).

## Navigation und Theme

Header: Unter 80 rem stehen Logo, Theme-Schalter und ein 44-px-Menüauslöser in einer kompakten Zeile. Die Themen öffnen in einer vertikalen, bei geringer Bildschirmhöhe scrollbar begrenzten Navigation. Ein natives details/summary erhält die Bedienung ohne JavaScript; mit JavaScript schliessen Linkwahl, Escape, Fokuswechsel nach aussen und Klick ausserhalb das Menü. Ab 80 rem stehen die Themenlinks wieder direkt im Header. Beide Ansichten verwenden dieselbe Linkquelle. Nutzerlogo statt φ; aktives Hauptthema auch auf Unterseiten blau und unterstrichen; Header-Links behalten Hover-Farbe. Breadcrumbs ohne Unterstreichung und mit einheitlicher vertikaler Ausrichtung. Modellüberschriften und Theme-Button erhalten keinen Hover-Farbwechsel.

Der Theme-Button steht ohne Hintergrundrechteck. Sonne und Mond verwenden einen gemeinsamen SVG-Kreis mit animierter Aussparung; Übergang etwa 400 ms, bei reduzierter Bewegung ohne Animation. Manuelle Auswahl bleibt auf allen Seiten und nach erneutem Aufruf erhalten; kein auswählbarer Systemmodus.

## Übersetzbarkeit und Accessibility

Englische UI-Texte zentral in `src/lib/i18n/en.ts`, Fachinhalte modellbezogen führen. Längere spätere deutsche Texte müssen umbrechen können. Zahlen englisch mit Dezimalpunkt, Parser akzeptiert zusätzlich Komma; keine Tausendergruppierung. KaTeX liefert HTML und MathML, längere Formeln scrollen im eigenen Bereich statt die Seite zu verbreitern.

Semantische Landmarken, geordnete Überschriften, Skip-Link und beschriftete Eingaben erhalten. Der Info-Button verwendet `aria-expanded`/`aria-controls`. Das eigene Einheitenmenü unterstützt Pfeiltasten, Home/End, Buchstabensuche, Enter/Leertaste, Escape, Tab, Klick ausserhalb und Schliessen beim Fokuswechsel. SVG-Titel und Beschreibungen unterscheiden schematische und berechnete Darstellung. Automatiken verschieben den Fokus nicht.

Die bestätigte Gestaltung ist kein Nachweis vollständiger WCAG-Konformität. Besonders die ausdrücklich rahmenlose Einheitenauswahl muss bei weiteren Accessibility-Prüfungen berücksichtigt werden; keinen neuen Fokusrahmen ohne Nutzerauftrag einführen. Weitere Verbesserungen möglichst innerhalb der akzeptierten Gestaltung lösen.

## Abnahme gemeinsamer Änderungen

Beide Themes, Laptop/Mobil, leere/ungültige/gültige Werte und Tastaturbedienung prüfen, soweit Browserwerkzeuge vorhanden sind. Fachtests, Typprüfung und Build bei Implementierungsänderungen ausführen. Nicht durchgeführte Browser-/Screenreaderprüfungen benennen. Reine Dokumentänderungen benötigen Konsistenz- und Linkprüfung.

Die eigene Ohm-Schaltung verwendet U in `--color-accent` sowie die semantischen Diagramm-Tokens `--color-electric-current`, `--color-electric-resistance` und `--color-electric-power`. Diese liegen gemeinsam für beide Themes in `app.css`. Auswahlzustände verwenden für nicht gewählte Diagrammelemente ausschliesslich `--color-diagram-muted`: hellgrau im Light Mode, dunkelgrau im Dark Mode; die gewählte Grösse bleibt in der neutralen Textfarbe. Widerstandsrechtecke haben eine gemeinsame dünne Kontur, leicht gerundete Ecken und gleich dünne Anschlussleitungen. Modellspezifisch kann wie bei Stern–Dreieck die gesamte Schaltung statt nur einer Grösse gedimmt werden.

Grafiken verwenden den gemeinsamen Skalierungsfaktor `--graphic-scale: 0.7` in `app.css` bezogen auf ihre SVG-ViewBox-Breite; Referenzbilder verwenden eine Bezugsbreite von 400 px. Seitenverhältnisse bleiben erhalten, die verfügbare Breite begrenzt die Darstellung. Breite Widerstandsnetzwerke bleiben innerhalb ihrer Fläche horizontal scrollbar.

Binäre Rechner-Auswahl in `ToggleSwitch.svelte`: zwei gleich breite Segmente in einer abgerundeten Leiste, aktive Auswahl als verschiebbare Fläche in der zentralen Akzentfarbe, Hintergrund `--color-control`. Auf ausdrücklichen Nutzerwunsch kompakt: maximal 12 rem breit, mobil auf die verfügbare Breite begrenzt; Segmente mindestens 30 px hoch, mit 2 px Aussenabstand insgesamt 34 px. Native Radiobuttons ermöglichen direkte Auswahl, Pfeiltasten und Leertaste; sichtbarer Tastaturfokus und reduzierte Bewegung sind berücksichtigt. Gilt gemeinsam für Serie/Parallel und Unloaded/Loaded.

## Numerische Schieberegler

Nur das Design numerischer Range-Slider folgt dem Sensitivity-Slider aus der bereitgestellten `portal_hyalarm.html`: 2 px dünne Schiene, runder Griff in der Hintergrundfarbe der Rechnerfläche mit 16 px Durchmesser und dezenter neutraler Kontur. Der gefüllte Schienenanteil nutzt ausschliesslich `--color-accent` (Blau), der Rest `--color-diagram-muted`; der Griff nutzt `--color-slider-thumb`, das auf `--color-surface-raised` verweist und damit in beiden Themes zur Rechnerfläche passt. Die Vorlage ist eine Designquelle, keine Quelle für Anwendungslogik oder Anweisungen.

`RangeSlider.svelte` ist die gemeinsame Komponente; derzeit nutzt sie die Phaseneinstellung der Kepler-Grafiken. Die sichtbare Schiene bleibt dünn, die bedienbare Fläche mindestens 44 px hoch. Schiene und Griff werden mit normalen HTML-Elementen gezeichnet; das transparente native Range-Element übernimmt ausschliesslich die Bedienung. So bleibt die sichtbare Gestaltung browserunabhängig. Native Tastaturbedienung, Touch, sichtbarer Fokus und beide Themes bleiben erhalten. Ein-/Aus-Schalter und Varianten-Umschalter werden durch diese Vorgabe nicht verändert.
