# Verbindlicher Standard für Modellseiten

## Status und Geltung

Uniform Motion wurde vom Nutzer vorerst als Referenz für Aufbau, Gestaltung und Bedienung akzeptiert. Dieser Stand ist die Grundlage für neue Modelle, keine Aufforderung, bereits weitere Themen zu implementieren oder zu veröffentlichen. Die Arbeitsregeln für künftige Implementierungen stehen in [src/AGENTS.md](../src/AGENTS.md); die Farbpalette steht im [Designsystem](DESIGN_SYSTEM.md), die fachlichen Regeln in den [Physikstandards](PHYSICS_STANDARDS.md).

Electricity & Magnetism verwendet für neun Unterthemen und 44 Modelle in 22 Karten ebenfalls dieselben Modellkarten, Felder, Einheitenmenüs und Ergebnisbausteine. Der modellabhängige Elektrotechnik-Rechner steuert explizite SI-Funktionen an; Details siehe [ELECTRICITY.md](ELECTRICITY.md).

Seit 03.11.2026 verwendet auch Inclined Plane unter Mechanics → Dynamics die gemeinsame Oberfläche. Ihre Physik, Eingabegrössen und Visualisierungen dürfen fachlich anders sein. Uniform Motion hat vier Eingabegrössen und zwei Diagramme; das ist kein Zwang für jedes künftige Modell. Die nachfolgende Zuordnung unterscheidet bereits gemeinsame Implementierung und noch nötige Wiederverwendung.

## Wo Änderungen für alle Seiten erfolgen sollen

| Änderung | Gemeinsame Quelle / Änderungsstelle |
| --- | --- |
| Farbpalette, Theme-Farben, Basis-Typografie, Seitengrössen | [app.css](../src/lib/styles/app.css) |
| Header, Logo und aktive Hauptnavigation | [+layout.svelte](../src/routes/+layout.svelte), Navigation-CSS in app.css |
| Theme-Verhalten und Morph-Symbol | [ThemeToggle.svelte](../src/lib/components/ThemeToggle.svelte); frühe Initialisierung in [app.html](../src/app.html) |
| Favicon und Logo-Geometrie | [favicon.svg](../static/favicon.svg); Header nutzt es als Maske |
| Hierarchie, verfügbare Themen und aktuelle Modelldaten | [topics.ts](../src/lib/content/topics.ts); Elektrotechnik-Inhalte in [electricity.ts](../src/lib/content/electricity.ts) |
| Startseitensuche, Suchindex und Trefferpillen | [SiteSearch.svelte](../src/lib/components/SiteSearch.svelte), [site-search.ts](../src/lib/search/site-search.ts) |
| Übersichten und Breadcrumb-Aufbau | [Overview.svelte](../src/lib/components/Overview.svelte) |
| Modellkartenrahmen und Theorie-Layout | [ModelCard.svelte](../src/lib/components/ModelCard.svelte) |
| Gemeinsamer Info-Button (ⓘ/✕) | [InfoButton.svelte](../src/lib/components/ui/InfoButton.svelte) |
| Feldsymbole und Indizes (Eingaben/Theorie) | [QuantitySymbol.svelte](../src/lib/components/ui/QuantitySymbol.svelte), [quantity-symbol.ts](../src/lib/calculators/quantity-symbol.ts) |
| KaTeX-Ausgabe | [Formula.svelte](../src/lib/components/Formula.svelte) |
| Einheitenoptionen und SI-Konversionsfaktoren | [units.ts](../src/lib/physics/units.ts) |
| Präfixe, Parsing, drei signifikante Ergebnisstellen | [quantities.ts](../src/lib/calculators/quantities.ts) |
| Gemeinsame SVG-Schaltungsstyles | [circuit-diagram.css](../src/lib/styles/circuit-diagram.css), eigene Schaltungen in `OhmsLawDiagram.svelte` und `VoltageDividerDiagram.svelte` |
| Zahlenfelder und gemeinsames Rechnerlayout | [QuantityField.svelte](../src/lib/components/calculator/QuantityField.svelte), [CalculatorShell.svelte](../src/lib/components/calculator/CalculatorShell.svelte), [calculator.css](../src/lib/styles/calculator.css) |
| Reset und Ergebnisgleichungen | [CalculatorTools.svelte](../src/lib/components/calculator/CalculatorTools.svelte), [EquationBlock.svelte](../src/lib/components/calculator/EquationBlock.svelte) |
| Rechner-Zuordnung und Modellvertrag | [ModelHost.svelte](../src/lib/components/ModelHost.svelte), [model-types.ts](../src/lib/content/model-types.ts) |
| Numerische Schieberegler | [RangeSlider.svelte](../src/lib/components/ui/RangeSlider.svelte), Farb-Tokens in app.css |
| Einheitenmenü samt Tastaturbedienung | [UnitSelect.svelte](../src/lib/components/ui/UnitSelect.svelte) |
| Achsen, Raster, Kurven und Pfeile | [MotionChart.svelte](../src/lib/components/calculator/MotionChart.svelte) |
| Wissenschaftliche Achsenbeschriftung | [axis-label.ts](../src/lib/visualization/axis-label.ts) |
| Zeit-Zusatzformat | [duration.ts](../src/lib/calculators/duration.ts) |
| Gemeinsame UI-Texte und Sprachwahl | [en.ts](../src/lib/i18n/en.ts), [de.ts](../src/lib/i18n/de.ts), [runtime.ts](../src/lib/i18n/runtime.ts); Footer in `+layout.svelte` |

Gemeinsame Komponenten importieren, nicht kopieren. Nur Eigenschaften, die bewusst pro Modell variieren, werden als typisierte Props/Definitionen/Snippets übergeben. Keine themenspezifischen CSS-Überschreibungen für dieselben Felder, Menüs oder Diagrammachsen anlegen.

## Gemeinsame Basis seit dem zweiten Modell

Die vorherige direkte Bindung an Uniform Motion ist gelöst. `ModelCard` erhält eine typisierte `ModelDefinition` und einen Rechner-Snippet. `ModelHost` ordnet den Rechner zu. Variablen, Formeln, Erklärung und Quellen stammen aus den jeweiligen Modelldaten. Uniform Motions Ableitungstext wird nicht auf Dynamics angezeigt.

Beide Rechner verwenden `QuantityField`, `CalculatorShell`, `CalculatorTools` und `EquationBlock`. Deren Styles liegen einmal in `styles/calculator.css`; gemeinsame Feldhöhen, Radien, Inhaltsbreiten und Abstände sind semantische CSS-Tokens in `styles/app.css`. Neue Rechner benutzen diese Bausteine und liefern eigene Solver und Ergebnisadapter. Einheitenoptionen bleiben in der globalen Registry. Für weitere Änderungen keine Kopien der Komponenten oder Styles anlegen.

Die Umstellung wurde mit den vorhandenen Fachtests sowie Browserabläufen für beide Modelle geprüft. Kein allgemeines Formularframework oder symbolischer Gleichungslöser wurde eingeführt.

Unterthemen werden zentral in `childrenOf` nach ihrer Themenummer numerisch aufsteigend sortiert (z. B. 02.2 vor 02.10), unabhängig von der Reihenfolge in der Registry. Auf Home steht SI Units & Physical Constants als eigene breite Referenzkarte oberhalb von Explore physics. Die Karte belegt die volle Inhaltsbreite und zählt nicht zu den sechs Physik-Hauptthemen im Raster. In der Header-Navigation bleibt Units am Anfang der Themenlinks.

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

Im Rechenweg entfallen additiv wirkende, als null angenommene Anfangswerte sowohl in der allgemeinen Formel als auch in der Zahleneinsetzung (z. B. s = v·t bei angenommenem s₀ = 0). Die Annahme bleibt am Eingabefeld beziehungsweise im Annahmenhinweis sichtbar. Explizit eingegebene Nullwerte und tatsächliche Nullergebnisse bleiben erhalten. Die Darstellung verändert weder Solverwerte noch Diagramme.

Keine zusätzliche Überschrift „Theory & calculation models“, kein „01 MODEL“-Zähler und keine lange Eingabeanleitung über der Karte beziehungsweise den Feldern. Die kleine Nummer innerhalb des Kartenheaders bleibt davon unberührt. Keine Übungen, keine Diagrammtabelle. Theorie und Berechnen liegen in derselben Modellkarte auf der jeweiligen Unterthemenseite; keine separaten Modellrouten allein zur Erfüllung eines älteren Architekturentwurfs anlegen.

Das Schliessen der gesamten Modellkarte setzt einen geöffneten Theorie-Bereich zurück. Beim erneuten Öffnen der Karte ist die Theorie wieder geschlossen; ihr Zustand wird nicht unsichtbar über den Kartenwechsel hinweg beibehalten.

## Konkrete Gestaltungswerte

Die Seitenpalette aus `portal.html` bleibt exakt erhalten; keine neuen Farbsysteme je Thema. Modellkarte: 10-px-Radius, 20-px-Innenabstand, mobil 16 px. Theorie ohne zusätzliche Hintergrundfläche. Theorie-Inhalt maximal 48 rem, zwei Spalten mit 24 px Abstand; unter 56 rem eine Spalte. Rechner maximal 52 rem; zwei Eingabespalten, unter 40 rem eine. Einheitenmenü 88 px breit, 8 px Abstand zum Zahlenfeld. Diagramme unter 44 rem untereinander. Diese Werte beschreiben den akzeptierten Stand; spätere gemeinsame Änderungen an den zentralen Bausteinen sind ausdrücklich erwünscht.

Eingaben, Reset und Einheiten-Auslöser: `--color-control`, 8-px-Radius, mindestens 44-px-Höhe, keine normalen Rahmen. Zahlenfeld: grauer 1-px-Fokusrahmen ohne Abstand; ungültig derselbe Rahmen gestrichelt, kein zusätzlicher heller Rand. Einheitenauslöser: weder Fokusrahmen noch Unterstreichung; Optionsliste mit Theme-Fläche, 10-px-Radius, dezentem Schatten, Häkchen für aktuelle Einheit und neutraler aktiver Fläche. Menü bleibt per Pfeiltasten, Home/End, Buchstabensuche, Enter/Leertaste, Escape und Tab bedienbar. Pfeilabstand rechts 14 px.

Unter 80 rem bündelt ein natives aufklappbares Menü die Hauptnavigation; Logo und Theme-Schalter bleiben direkt erreichbar. Ab 80 rem werden die Links direkt angezeigt. Die Navigation funktioniert auch ohne JavaScript und verwendet für beide Ansichten dieselbe Linkquelle. Header-Links behalten blauen Hover sowie blaue Unterstreichung des aktiven Hauptthemas einschliesslich Unterseiten. Breadcrumbs bleiben einheitlich hoch, auf einer Grundlinie und ohne Unterstreichung. Der Theme-Schalter hat weder Hintergrundrechteck noch Hover-Farbwechsel: Im Dark Mode zeigt der Schalter die Sonne, im Light Mode den Mond als Symbol des Zielmodus. Sonne/Mond morphen über einen gemeinsamen Kreis in etwa 400 ms. Beim ersten Besuch gilt die Systemeinstellung, danach die gespeicherte manuelle Wahl; keine „System“-Auswahl. Reduzierte Bewegung respektieren.

## Zahlen und Resultate

Zahl samt Präfix direkt tippen, etwa `1.5k` oder `250m`, oder einen skalaren Rechenausdruck mit `()`, `+`, `-`, `*`, `/` und `^`. Der zentrale Parser in `quantities.ts`/`arithmetic.ts` gilt für alle Zahlenfelder. Präfixe beziehen sich auf einzelne Zahlen: `1k + 1m = 1000.001`. Punkt-vor-Strich gilt, Potenzen sind rechtsassoziativ (`2^3^2 = 512`) und stärker als ein führendes Minus (`-2^2 = -4`); negative Exponenten sind möglich. Die gewählte Einheit wird erst nach der skalaren Rechnung auf das gesamte Ergebnis angewendet. Ausdrücke bleiben als manuelle Rohtexte erhalten und werden bei Einheitenwechsel neu interpretiert. Keine Funktionen, Bezeichner, impliziten Produkte oder eingegebenen Einheitensymbole; Präfixe an geklammerten Ausdrücken sind nicht vorgesehen. `0^0`, Division durch null, nichtreelle Werte und Über-/Unterlauf sind ungültig. Grenzen: 4096 Zeichen, 512 Parser-Tokens, Rekursionstiefe 128. Bei Offset-Temperaturskalen und dBm bleiben Präfixe auch in Ausdrücken unzulässig; die bisherigen Skalenregeln ändern sich nicht. Einheiten im separaten gemeinsamen Menü wählen; SI ist Standard; Winkeleingaben starten mit Grad (°), Radiant (rad) bleibt auswählbar. Intern bleiben Winkel in rad. `m` und `M` unterscheiden sich. Rechnen intern mit ungerundeten SI-Werten. Eingabefelder zeigen ausschliesslich manuelle Rohwerte, Resultate nur unten.

Nicht-SI-Eingaben zuerst sichtbar umrechnen, dann in SI einsetzen. Messwerte in Umrechnung, Einsetzung und Resultat auf drei signifikante Stellen runden; Definitionsfaktoren bleiben exakt. Allgemeine umgestellte Formel und numerische Einsetzung werden immer mit `=` verbunden. Wo Rundung erfolgt, kann bei Konversion beziehungsweise Endergebnis `≈` erscheinen. Ergebnispräfixe kommen aus dem gemeinsamen Formatter, der Tausenderschritte bevorzugt. Durch die Anzeige gerundete Werte niemals als nächste Berechnungsquelle verwenden.

Auch die numerische Einsetzung verwendet passende Engineering-Präfixe, etwa `12.3 kΩ`, `4.57 µF` oder `1.00 mA`. Einzelwerte werden nicht pauschal geklammert: Klammern bleiben Vorzeichen, Potenzen, Funktionsargumenten und anderen mathematisch notwendigen Fällen vorbehalten. Multiplikationen zwischen eingesetzten Werten beziehungsweise Faktoren werden mit `\cdot` sichtbar gemacht. Dimensionslose Grössen erhalten keinen Präfix, ausgewählte Nicht-SI-Einheiten keinen doppelten Präfix.

## Uniform-Motion-Verhalten, das nicht versehentlich verloren gehen darf

- Gleichung `s = s₀ + v · t`. Drei manuelle Werte bestimmen den vierten. Zwei Werte aus s/v/t setzen s₀ = 0 voraus; zwei Werte einschliesslich s₀ reichen nicht. Annahme sichtbar anzeigen, ohne das leere Feld zu füllen.
- Vier manuelle Werte: ein Feld muss geleert werden. Keine stillen Überschreibungen. Null zählt als Eingabe; negative Position/Geschwindigkeit sind möglich, verstrichene Zeit ist nicht negativ.
- Einheiten: s₀/s → m, AE, Lj; v → m/s, km/h; t → s, min, h, d. Die Auswahl am fehlenden Feld steuert die Ergebniseinheit.
- In allen Rechnern ändert ein Einheitenwechsel nur die Interpretation, niemals den manuellen Eingabetext. Zahl, Präfix, Dezimaltrennzeichen und Schreibweise bleiben exakt erhalten. Die neue Einheit wird beim erneuten Validieren und Umrechnen nach SI berücksichtigt; Ergebnisse werden aktualisiert oder verworfen.
- Theorie enthält Variablen, Positions-/Geschwindigkeits-/Beschleunigungsformel und die Erklärung `v(t) = dot(s)(t) = constant` mit echter KaTeX-Punktnotation.
- Nur bei berechnetem t: zusätzliche Dauer hinter `=` aus dem ungerundeten SI-Ergebnis. t < 60 s: keine; ab 60 s MM:SS.s; ab 3600 s HH:MM:SS.s; ab einem Tag Nd, HH:MM:SS.s. Keine Klammern oder „0d,“. Zehntelsekunden mit Überträgen runden.

## Diagrammstandard

s(t) und v(t) stehen unter den Resultaten, immer sichtbar innerhalb der geöffneten Modellkarte. Ohne gültige Berechnung: schematische Kurven ohne Skalenwerte; bei Uniform Motion eine steigende Positionsgerade und eine horizontale Geschwindigkeitslinie. Keine alten Ergebniswerte weiterzeigen. Bei gültigen Werten den echten Verlauf aus ungerundeten Solverdaten verwenden. t = 0 ist ein Nullintervall, kein erfundener Bewegungsverlauf.

Raster dezent, auch die unterste Linie. Nullachse 2 px dick und durchgezogen, mit numerischen Daten links durch 0 beschriftet; ohne Daten liegt sie unten. Positive Achsenenden haben Pfeile. Keine Kreise an Kurvenanfang/-ende. Kurven verwenden die zentrale Akzentfarbe.

Achsenlabel „Grösse [Einheit]“, Y-Label direkt über der obersten Skalenangabe, keine doppelte Beschriftung oben rechts. Tickwerte mit drei signifikanten Stellen; für Betrag >= 1000 oder 0 < Betrag <= 0.001: Koeffizient × 10 mit echtem hochgestellten Exponenten. Null als 0. Kollisionen mit der Nullbeschriftung vermeiden.

SVGs haben Titel und Beschreibungen, die schematische Darstellung erkennbar benennen. Keine Datentabelle neu einführen. Eine visuell akzeptierte Referenz ersetzt keinen Nachweis vollständiger Accessibility oder Browserkompatibilität.

Elektrotechnische Schaltungen werden als eigene dynamische SVG-Komponenten aus demselben validierten Zustand wie Formeln und Resultate erzeugt; statische Referenzbilder sind keine Laufzeitabhängigkeit. Rechteckige Widerstände haben zentral eine dünne, leicht gerundete Kontur; Anschlussleitungen verwenden dieselbe Strichstärke. Bei Auswahlzuständen nutzt nicht Gewähltes `--color-diagram-muted` (Light Mode hellgrau, Dark Mode dunkelgrau), die gewählte Grösse bleibt neutral kontrastreich. Stern–Dreieck dimmt dabei die gesamte nicht gewählte Darstellung einschliesslich Leitungen, Knoten, Widerständen und Text. Bei Richtungswechsel steht die Ausgangsschaltung zuerst, Feldsymbole, Werte und Zeichnungsreihenfolge wechseln gemeinsam, manuelle Eingaben bleiben erhalten.

## Änderungen und Prüfung

Bei gemeinsamen Designänderungen die gemeinsame Quelle bearbeiten und mehrere Ansichten prüfen, nicht jede Seite einzeln nachziehen. Akzeptierte neue Entscheidungen hier beziehungsweise im passenden Fach-/Designdokument aktualisieren, alte widersprüchliche Aussagen ersetzen. Arbeitsregeln bleiben über die AGENTS-Dateien auffindbar.

Für neue Modelle: Fachtests für alle Zielgrössen, Einheiten, Präfixe, Grenzfälle, Rundung und Invalidierung; `npm test`, `npm run check`, `npm run build`. Für gemeinsame UI: Laptop/Mobil, beide Themes, leere/ungültige/gültige Zustände, Tastatur und Fokus prüfen, soweit Browserwerkzeuge vorhanden sind. Dokumentationsänderungen allein benötigen Konsistenz- und Linkprüfung.

## Zweites Modell: Inclined Plane

Dynamics liegt unter `/mechanics/dynamics`; die zugehörige Karte enthält die schiefe Ebene. Masse ist nur für Kraftbeträge erforderlich; Geometrie, Beschleunigung und Geschwindigkeit erscheinen unabhängig davon. μₖ und g sind optional mit sichtbaren Standardannahmen. Ausgegeben werden Gewichtskraft, Normalkraft, Hangabtriebskraft, Gleitreibungskraft, resultierende Kraft und Beschleunigung als vollständige KaTeX-Rechenwege. Bei Nicht-SI-Eingaben werden Masse und Winkel zuerst konvertiert. Eine SVG-Kraftskizze ersetzt fachgerecht die Zeitdiagramme von Uniform Motion. Details und Modellgrenzen stehen in den Physikstandards; die gemeinsame Gestaltung wird davon nicht dupliziert.

Die Inclined-Plane-Skizze wird über `src/lib/visualization/inclined-plane.ts` aufgebaut. Eingegebener Winkel und Reibungskoeffizient wirken bereits vor vollständiger Berechnung auf Geometrie/Kraftverhältnisse; die Vorschau bleibt als schematisch benannt. Alle Pfeile sind proportional mit gemeinsamem, automatisch angepasstem Massstab, einschliesslich bis zum Vektorende passender Pfeilspitzen.

Pfeilschäfte enden an der Basis der Pfeilspitze, damit kein Strich über die Spitze hinausragt. Bei sehr kurzen Pfeilen schrumpft auch die Strichbreite. Die Spitzenposition bleibt das physikalische Vektorende.

Ergebnis- und Umrechnungsgleichungen verwenden den gemeinsamen `Formula`-Baustein mit aktiviertem automatischem Zeilenumbruch (`EquationBlock`). KaTeX rendert dafür Inline-Markup mit Display-Mathematikgrösse; Umbrüche liegen vor = und ≈, damit das Zeichen am Beginn der neuen Zeile steht und bei seinem folgenden Term bleibt. Brüche und geklammerte Terme bleiben zusammen; nur wenn ein unteilbarer Term breiter als die Fläche ist, bleibt horizontales Scrollen als Rückfall. Der KaTeX-HTML-Container beteiligt sich als Inline-Block mit vertikalem Innenabstand an der Höhenberechnung. Auch tiefe Brüche und hohe Matrizen müssen vollständig im Formelbereich liegen; sie dürfen keine kleinen vertikalen Scrollbalken erzeugen. Keine festen Zeilenumbrüche je Modell oder Bildschirmbreite in den Solver einbauen.

Fokusbezug zur Skizze: `QuantityField` meldet den Fokus seines Zahlenfelds über den optionalen Callback `onfocuschange`. Inclined Plane markiert bei fokussiertem α-Feld Winkelbogen, Winkelfläche und Beschriftung mit der gemeinsamen Akzentfarbe. Bei Fokus auf L wird die gesamte geneigte Strecke samt L markiert, bei h die senkrechte Höhendifferenz samt h. Die Markierung endet bei Fokusverlust, funktioniert auch per Tastatur und verändert weder Geometrie noch Rechenwerte. Keine modellspezifische Fokuslogik in `QuantityField` einbauen.

Inclined Plane bietet zusätzlich L und h als Längenfelder mit derselben globalen Einheitenliste. Zwei Werte aus L, h und α bestimmen die dritte Grösse; widersprüchliche Dreifachangaben sind ungültig. v_end ist eine manuelle Eingabe oder ein berechnetes Resultat aus Ruhe. Es gilt v_end² = 2aL bzw. ohne Reibung v_end² = 2gh. Damit sind auch inverse Geometrierechnungen möglich; kein v₀-Feld. Geometrie- und Geschwindigkeitsresultate bleiben unterhalb der Eingaben im gemeinsamen Rechenweg. Dynamics zeigt vier thematisch gebündelte Karten statt 14 einzelner Akkordeons; verwandte Rechnungen werden innerhalb der Karten umgeschaltet. Fachliche Sonderfälle siehe Physikstandards.

## Quantum: Qubit

Modern Physics → Quantum verwendet dieselbe standardmässig geschlossene Modellkarte für Qubit. Fachlich abweichend enthält der Rechner Gatteraktionen statt eines klassischen fehlenden Messwerts. Winkel verwenden `QuantityField`, Resultate `EquationBlock` und Theorie KaTeX. Gatterauswahl wie in `Qubit_Demo/main/portal.html`: X/Y/Z, √X/√Z, H, Rx/Ry/Rz und U. Jede der fünf Gattergruppen besitzt einen Info-Button mit den zugehörigen KaTeX-Matrizen aus derselben Inhaltsquelle. Die Gruppeninformationen starten geschlossen und werden beim Schliessen der Qubit-Karte zurückgesetzt. Eine eigene perspektivische 3D-Blochkugel zeigt den aktuellen, auch während der Animation konsistent berechneten Zustand. Die Kamera bleibt per Drag oder Tastatur drehbar und kann mit Reset view zurückgesetzt werden. Gatterverlauf, letzte Gattermatrix, Statusmeldungen sowie Reset qubit, Undo und Animationsschalter entfallen; Gatter werden animiert angewendet, sofern keine reduzierte Bewegung eingestellt ist. Die Darstellung verwendet gemeinsame Theme-Tokens und wird separat im Browser geladen. Reduzierte Bewegung unterdrückt die Gatteranimation. Fachvertrag und Quellen stehen in den Physikstandards.

## Waves: Doppler Effect

Oscillations & Waves ist eine Übersicht; Doppler Effect liegt unter `/oscillations-and-waves/doppler-effect`. Die Modellkarte Acoustic Doppler Effect verwendet gemeinsame Felder, Einheitenmenüs, Reset und Ergebnisgleichungen. Drei Angaben aus fₛ, fₒ, vₛ und vₒ bestimmen die vierte; ein leeres c verwendet die sichtbare Annahme 343 m/s. Manuelle Felder bleiben unverändert. Die SVG-Wellenfronten stehen unter den Ergebnissen, bei unvollständigen oder ungültigen Eingaben als klar schematische statische Vorschau. Play/Pause steuert eine zeitlich skalierte Animation; reduzierte Bewegung unterbindet die Wiedergabe. Vorzeichenkonvention und Modellgrenzen stehen direkt am Rechner. Der physikalische Vertrag steht in den Physikstandards.

## Optics: Total Internal Reflection

Optics ist eine Übersicht mit der Unterseite `/optics/total-internal-reflection`. Die Modellkarte verwendet gemeinsame Felder für n₁, n₂ und θ₁, Einheitenmenüs, Reset, Theorie und Ergebnisgleichungen. Zwei Indizes reichen für den Grenzwinkel beziehungsweise die Aussage, dass Totalreflexion in dieser Richtung nicht möglich ist. θ₁ ergänzt Brechungs-/Reflexionswinkel und die Einordnung. Winkel starten in rad, optional °; Ergebnisse zeigen beide Darstellungen ohne SI-Präfix. Die SVG-Skizze steht unter den Resultaten, unterscheidet schematische und berechnete Geometrie und zeigt bei Totalreflexion keinen propagierenden gebrochenen Strahl. Gleiche Indizes erzeugen keinen reflektierten Strahl. Kein zusätzliches Farbsystem, keine neue Bibliothek.

## Formelthemen aus Physik1 und Physik2

15 zusätzliche Unterthemen verwenden dieselben Modellkarten mit typisierten ResourceDefinition-Daten und ResourceCalculator. Nur fachliche Inhalte, Einheiten, explizite Solver und Adapter kommen hinzu. Bei relationalen Rechnern bestimmt eine fehlende Primärgrösse die inverse Rechnung; Vorwärtsmodelle zeigen ihre abgeleiteten Ergebnisse unter den manuellen Feldern. Die zusätzliche Abdeckung des vollständigen Formelbuch-Physikkapitels steht in [FORMULA_BOOK.md](FORMULA_BOOK.md). Jede dortige Eingabe ist eine inverse Zielgrösse. Mehrere zulässige Lösungen stehen als getrennte Rechenwege unter den Eingaben; der Adapter zeigt jeweils den zutreffenden algebraischen Zweig. Die genaue Abdeckung steht in [RESOURCE_CONTENT.md](RESOURCE_CONTENT.md). Die Brechungsseite nutzt den vorhandenen Totalreflexions-/Snell-Rechner erneut. Keine PDF-Bilder oder leeren öffentlichen Themen.

## Kinematics: Acceleration and Throws

Unter `/mechanics/kinematics` stehen Uniform Motion, Uniformly Accelerated Motion, Projectile Motion, Free Fall und Velocity Components. Vertical Motion und Horizontal Throw sind keine eigenen Karten mehr. `content/kinematics.ts` liefert Fachinhalte/Felder, `KinematicsCalculator` verwendet die gemeinsamen Felder, Tools und Gleichungsbausteine. Vier bekannte Grössen bestimmen die fünfte im Beschleunigungsmodell; bei drei Angaben und leerem s₀ gilt sichtbar s₀ = 0. Zwei zulässige Zeiten werden beide ausgegeben; der gemeinsame Tastatur-bedienbare Umschalter wählt das Diagrammintervall. Projectile Motion verwendet den gemeinsamen inversen Wurfrechner mit sichtbaren Standardannahmen und 17 Eingabemöglichkeiten. Es gibt keine Schnellwahl für Sonderfälle.

`KinematicsCharts` nutzt `MotionChart` auch für die Bahnkurve y(x), mit optionalem vorzeichenbehaftetem x-Bereich. Das gemeinsame Diagrammraster liegt in `calculator.css` und wird auch von Uniform Motion verwendet. Ohne gültige Eingaben werden normierte Beispiele desselben Solvers ohne Zahlenachsen gezeigt. Nullintervalle bleiben ohne erfundene Kurve. Solver-Verträge und Grenzen stehen in den Physikstandards.

## Dynamics: Flaschenzug-Grafik

Beide Teilrechnungen des Flaschenzugs zeigen dieselbe responsive SVG-Seilführung aus `visualization/pulley.ts` und `PulleyDiagram.svelte`. n bestimmt bis acht tragende Seilabschnitte die tatsächliche Zeichnung, einschliesslich ungerader n mit Seilbefestigung am beweglichen Block. Grössere n bleiben als exakte Anzahl sichtbar und erhalten eine ausdrücklich vereinfachte Skizze. Die Kraftansicht zeigt proportional normierte F/F_G-Pfeile, die Wegansicht die Richtungen von s und h. Gültige Solverwerte liefern die Beschriftungen; bei unvollständigen/ungültigen Eingaben bleiben nur eine schematische Seilführung und gegebenenfalls die gültige manuelle Seilanzahl. Keine Animation oder zusätzliche Bilddatei.

## Mechanics: Kepler’s Laws

Drei normale Modellkarten nutzen ResourceCalculator und die gemeinsamen Felder/Einheiten/Rechenwege. Ergänzende Theoriedaten liegen beim jeweiligen Modell. Die ersten beiden Karten verwenden eine eigene responsive SVG-Ansicht: drehbarer Kegel-/Ebenenschnitt mit horizontaler Ellipsenprojektion beziehungsweise Flächensektoren. Kamera per Pointer/Pfeiltasten/Home, Bahnphase per beschriftetem Range-Regler; keine automatische Animation und keine externe 3D-Laufzeit. Das bereitgestellte Desmos-Original ist verlinkt. Geometrie und Grenzen: [KEPLER.md](KEPLER.md).

## Zusammengehörige Formeln bündeln

`src/lib/content/model-groups.ts` legt die Karten für alle Unterthemen zentral fest. Einzelne Beziehungen mit zwei oder drei Eingabegrössen erhalten innerhalb eines verwandten Themenblocks keine zusätzliche ausklappbare Karte. Im Zweifel zusammenfassen. Eigenständige Modelle bleiben getrennt, wenn Voraussetzungen und Rechenablauf dies fachlich begründen. Alle bisherigen IDs, expliziten Inversen und Fachtests bleiben erhalten.

`ModelHost` steuert die aktive Variante und deren Theorie; `ModelCalculator` ordnet nur die vorhandenen Rechner zu. `ModelVariantSwitch` nutzt bei zwei Varianten den bestehenden Serie-/Parallel-Slider (`ToggleSwitch`), bei mehreren Varianten eine kompakte, tastaturbedienbare Radioauswahl. Keine verschachtelten Dropdowns. Nur besuchte Rechner werden instanziiert; ihre manuellen Eingaben und Einheiten bleiben beim Wechsel erhalten. Verdeckte Rechner sind weder sichtbar noch per Tastatur erreichbar. `ModelTheory` teilt die Theoriegestaltung zwischen interaktiver Ansicht und der vollständigen Ansicht ohne JavaScript.

Beispiele: Rotation 20 → 4 Karten, optische Abbildung 13 → 3, Wärmeausdehnung 12 → 3, Fluidstatik 13 → 5 und Kinematik 27 → 5. Dynamics umfasst vier Karten mit insgesamt 14 unveränderten Rechnerdefinitionen.

## Suche auf der Startseite

Die Startseite bietet eine lokale Suche über alle veröffentlichten Themen, ursprünglichen Rechner samt zusammengefassten Varianten, Variablen, Formeln, Modellhinweise sowie die SI- und Konstantenreferenz. Der Index wird aus den vorhandenen Inhaltsquellen erstellt; keine zweite manuelle Rechnerliste und kein externer Suchdienst. Deutsche und englische Begriffe, Akzente und zusammengeschriebene Modellnamen werden berücksichtigt.

Treffer erscheinen direkt unter dem Suchfeld als Linkpillen mit vollständigem Themenpfad. Zunächst zwölf anzeigen, weitere über den gemeinsamen Mehr-Treffer-Button erreichbar machen. Status und Leerzustand sind übersetzt und für Screenreader angekündigt. Links zu Rechnern nutzen stabile ursprüngliche IDs (`#model-…`); `ModelHost` öffnet die richtige Karte, aktiviert die gefundene Variante und fokussiert deren Zusammenfassung. Ein unbekannter oder ungültig kodierter Hash öffnet keine fremde Karte.

Die Karte Projectile Motion (deutsch: Wurfbewegung) integriert die 18 bisherigen Quellen des schiefen, senkrechten und waagerechten Wurfs: eine Eingabefläche mit 17 Grössen und ein gemeinsamer inverser Solver. Sonderfälle werden durch normale Eingaben wie α = 0° oder 90° bestimmt; keine zusätzliche Schnellwahl. `integratedModels` bewahrt die ursprünglichen Inhalts-IDs für Suche und Direktlinks; alle öffnen dieselbe Karte. Die einzige verbleibende Auswahl betrifft tatsächlich unterschiedliche physikalische Lösungen für die Diagramme.

## Indizes in Feldsymbolen

`QuantityField` und `ModelTheory` nutzen gemeinsam `QuantitySymbol` für Inline-KaTeX. Tiefstellungen gelten für Zahlen und Wörter gleichermassen: `R_{12}`, `t_{f}`, `t_{peak}`, `y_{peak}`, `v_{impact}` und `v_{y,impact}`. Die Klammern gruppieren den gesamten Index. Vorhandene Unicode-Tiefstellungen und getrennte `subscript`-Metadaten werden zentral in dieselbe Notation überführt. Beschriftungen zeigen weder rohe Unterstriche noch TeX-Klammern; Indexmarkierungen dürfen nicht zur vermeintlichen Bereinigung entfernt werden.

Die Metadaten dürfen TeX-Indexnotation enthalten; Eingabe-IDs, URLs und sprachneutrale Solver-Schlüssel ändern sich dadurch nicht. Keine modellabhängigen HTML-/CSS-Ersatzlösungen ergänzen. Symbole bleiben mit dem zugehörigen Eingabefeld verknüpft und werden mit HTML/MathML und `trust: false` ausgegeben.

## Kombinierter Rechner: Schiefe Ebene (13.11.2026)

Inclined Plane integriert die sieben bisherigen Quellen ohne Variantenwahl in einer Eingabefläche mit 14 Grössen: L, h, α, v_end, m, μ_k, g, Gewichtskraft, Normalkraft, Hangabtriebskraft, Reibungskraft, resultierende Kraft, Hebekraft und Beschleunigung. `physics/mechanics/incline-combined.ts` verbindet explizite Fachrelationen; bekannte Werte werden vor den sichtbaren Standardannahmen μ_k = 0 und g = 9.81 m/s² ausgewertet. Die Hebekraft gilt für gleichförmiges Hinaufgleiten und ist nicht die resultierende Kraft beim freien Hinabgleiten. Alle zulässigen Winkelzweige bleiben erhalten. Endgeschwindigkeit gilt weiterhin aus Ruhe; bei negativer Beschleunigung keine solche Geschwindigkeit erfinden. Ungültige Eingaben sperren nur abhängige Ergebnisse. Alte Inhalts-IDs öffnen über `integratedModels` dieselbe Karte; keine separate Schnellwahl für die bisherigen Formeln.

## Kurze Rechnerhilfe

`/calculator-help` und `/de/calculator-help` erklären die Bedienung knapp in fünf Punkten. Quelle ist `content/calculator-help.ts`, Darstellung `CalculatorHelp.svelte` innerhalb des vorhandenen Seitenrahmens. `CalculatorTools` verlinkt die Hilfe zentral unter allen Eingaben; ein zusätzlicher Footer-Link macht sie von jeder Seite erreichbar. Die Hilfe ist als `kind: 'guide'` im Seitenkatalog veröffentlicht und dadurch in Sitemap, Sprachwechsel und Suche enthalten, erscheint aber nicht als Physik-Hauptthema. Der Inhalt bleibt ohne JavaScript lesbar. Keine Hilfetexte in einzelne Fachrechner kopieren.

## About-Seite

`/about` und `/de/about` stellen den fachlichen Hintergrund hinter calcPhysics vor: Elektronik-Ausbildung, aktuelles Physikstudium und Erfahrung mit elecalculate. Die Seite soll Vertrauen über konkrete Qualifikationen und fachliche Arbeitsweise schaffen; keine Bedienungsanleitung und keine unbelegten Abschlüsse oder institutionellen Empfehlungen behaupten. Die Eingabehilfe bleibt eine eigene Seite. Biografische Angaben stammen ausschliesslich aus ausdrücklichen Angaben der Person: Physikstudium an der ETH Zürich, elecalculate während der Ausbildung und calcPhysics als Nachfolgeseite, deren Inhalte mit dem Studium wachsen. Keine Namen, Abschlüsse, Ausbildungsbetriebe oder weiteren persönlichen Daten ergänzen, die nicht bestätigt wurden. Inhalt: `content/about.ts`; deutsche Fassung in `i18n/text-de.ts`; Darstellung: `About.svelte`. Als `kind: 'info'` bleibt die Seite ausserhalb der Physiknavigation, wird aber im Footer verlinkt sowie in Suche, Sitemap und Sprachwechsel berücksichtigt.

## Gemeinsamer Footer und Haftungsausschluss

`SiteFooter.svelte` bietet Projekt (About und Instagram @calcphysics), Hilfe/Referenz, rechtliche Hinweise sowie den kontexttreuen Sprachwechsel. Die Gestaltung liegt zentral in `styles/app.css`: beschriftete Bereiche im bisherigen Spaltendesign. Marke und rechtliche Hinweise stehen gemeinsam in einem unabhängig fliessenden Block; Legal folgt mit kurzem Abstand direkt unter der Marke und wartet nicht auf die Höhe anderer Spalten. Projekt und Hilfe/Referenz bleiben separate Bereiche. Mobil werden diese Blöcke auf zwei Spalten verteilt. Keine zeilenhohen Grid-Lücken oberhalb von Legal erzeugen. Bestehende Theme-Tokens und 44-px-Linkziele verwenden. Instagram wird nur als externer Link eingebunden, nicht als nachladendes Widget. `/disclaimer` und `/de/disclaimer` sind Informationsseiten mit Inhalt aus `content/disclaimer.ts`, deutscher Fassung in `text-de.ts`, Suche und Sitemap; keine Themenüberschrift und kein Eintrag als Physik-Hauptthema. Inhalt: Modellgrenzen, Sorgfalt/Ergebnisprüfung, Haftungsbeschränkung im gesetzlich zulässigen Umfang mit Vorbehalt zwingender Haftung sowie externe Links. Keine uneingeschränkte Haftungsfreiheit oder Garantie rechtlicher Wirksamkeit behaupten.
