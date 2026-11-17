# Vorgaben für Implementierungen in src/

Diese Regeln ergänzen die [Repository-Vorgaben](../AGENTS.md). Vor Änderungen an Themen, Rechnern oder Diagrammen den [verbindlichen Modellseitenstandard](../docs/MODEL_PAGE_STANDARD.md) lesen. Uniform Motion ist die vom Nutzer vorerst akzeptierte Referenz. Diese Referenz weiterverwenden, nicht bei jedem neuen Modell neu gestalten. Bei Zweifeln zu Begriffen, Umfang oder Gestaltung vor der betroffenen Änderung nachfragen; der aktuelle Nutzerauftrag geht älteren Dokumenten vor. Iststand und noch nicht flächendeckend erfüllte Zielvorgaben ausdrücklich trennen.

## Zentral ändern, gemeinsam verwenden

- Farben, Theme, gemeinsame Typografie und Seitennavigation in `lib/styles/app.css` beziehungsweise `routes/+layout.svelte` ändern; keine separaten Farbsätze in Themen anlegen.
- Gemeinsames Verhalten in vorhandenen Komponenten ändern: `ModelCard`, `Formula`, `UnitSelect`, `ThemeToggle`, `MotionChart`. Modellseiten dürfen diese nicht kopieren.
- Einheitenoptionen, SI-Standards und Konversionsfaktoren ausschliesslich in `lib/physics/units.ts` führen; Zahl-/Präfixparsing und Ergebnisformatierung in `lib/calculators/quantities.ts` verwenden.
- Gemeinsame Beschriftungen in den Sprachdateien unter `lib/i18n/`; Fachinhalte und Modellmetadaten über `lib/content/` bereitstellen. Keine Fachtexte anderer Modelle in einem globalen Kartenlayout hart codieren.
- `ModelCard` verwendet `ModelDefinition` und einen Rechner-Snippet, keine direkten Fachrechner-Imports. `ModelHost` steuert Karte und Varianten, `ModelCalculator` ordnet die Rechnerkomponenten zu; `content/topics.ts` liefert themenspezifische Variablen, Formeln, Notizen und Quellen. Neue Modelle dort einordnen, nicht Karten kopieren.
- `QuantityField`, `CalculatorShell`, `CalculatorTools` und `EquationBlock` gemeinsam verwenden; Feld-/Raster-/Ergebnis-Styles liegen einmal in `styles/calculator.css`. Gemeinsame Masse wie `--control-height`, `--control-radius`, `--unit-control-width`, `--calculator-width` und `--theory-width` liegen in `styles/app.css`. Modellabhängige Visualisierungen bleiben separate Komponenten.
- Modellabhängig bleiben Eingabegrössen, Definitionsbereiche, Gleichungen, Annahmen, Datenadapter und nötige Diagrammtypen. Die feste Anzahl vier Felder und die zwei Kurven sind keine allgemeine Modellvorgabe.
- Nur Quelldateien bearbeiten. `build/`, `.svelte-kit/`, `.netlify/` und Dateien mit Hashnamen sind generierte Ausgabe, keine Designvorlage und keine Änderungsstelle.

## SEO zentral halten

`lib/seo.ts` und `components/SeoHead.svelte` erzeugen Metadaten/Canonical-URLs gemeinsam. Themen liefern optionale SEO-Überschreibungen in `lib/content/topics.ts`. Sitemap und robots sind vorgerenderte Endpunkte, keine manuell gepflegten Dateien in `static/`. Neue veröffentlichte Themen automatisch in die Sitemap aufnehmen; Vorschau-Builds nicht indexieren. Domain-/Redirectdetails und letzte mobile Labormessung siehe [SEO.md](../docs/SEO.md).

## Sprache und Ton

- Sachlich und direkt schreiben. Keine Werbung, Slogans, Selbstvermarktung, LinkedIn-artigen Profiltexte oder pauschalen Vertrauensfloskeln. Keine dekorativen Aussagen wie „Physics, formulas and calculation models — developed from electronics experience and physics studies.“ ergänzen. Footer auf Marke, Navigation und nötige Hinweise beschränken. Persönliche Angaben auf der About-Seite konkret und überprüfbar nennen, ohne sie werblich auszuschmücken. Diese Vorgabe gilt für Englisch und Deutsch sowie für neue und überarbeitete Produkttexte. Deutsche Texte natürlich formulieren, statt englische Formulierungen wörtlich zu übersetzen.

## Seiten- und Kartendesign

- Englisch (`en`) bleibt die Standardsprache; Deutsch (`de`) vollständig mitpflegen, einschliesslich Fachinhalten, Feld-/Einheitennamen, Fehlern, Annahmen, Rechenwegen, Grafiken, Hilfen, ARIA-Beschriftungen und SEO-Texten. Übersetzungen in `lib/i18n/de.ts` und `text-de.ts`, zugehörige englische Texte in `en.ts` pflegen; Komponenten nutzen `runtime.ts`, reine Fachlogik bleibt sprachneutral. Keine neuen englischen Resttexte in der deutschen Oberfläche. Die Katalogabdeckung wird mit `tests/localization.test.mjs` geprüft. Neue Fallbacks oder unübersetzte sichtbare/zugängliche Literale sind Fehler. `translate.ts` führt gemeinsame Textauflösung und nummerierte Netzwerkfelder; keine eigene Übersetzungslogik je Modell. Keine Übungen, Quiz oder Lernfortschrittsanzeigen.
- Eine standardmässig eingeklappte Karte je zusammengehörigem Modell, Karten untereinander. Verwandte Formeln/Varianten bündeln und innerhalb derselben Karte umschalten; keine separate Karte pro Umstellung und keine unnötigen verschachtelten Dropdowns. Die ausdrücklich festgelegten vier Impuls-Karten bleiben eigenständig; „Dropdown“ bezeichnet dort die aufklappbare Karte, keine innere Auswahl. Kartenüberschrift ohne blauen Hover-Farbwechsel. Header-Links behalten ihren Hover-Effekt und markieren das aktive Hauptthema auch auf Unterseiten blau und unterstrichen. Breadcrumbs bleiben ohne Unterstreichung.
- Kein zusätzlicher Modellüberschrift-/Zähler-/Hilfetextblock über den Karten.
- Theorie hinter dem linksbündigen, rahmenlosen ⓘ-Button; geöffnet wird daraus ✕. Kein sichtbarer „Theory“-Titel. Theorie und Formeln direkt auf der Kartenfläche, keine zusätzliche Theorie-Karte.
- Wird die gesamte Modellkarte geschlossen, wird auch der geöffnete Theorie-Zustand zurückgesetzt. Beim erneuten Öffnen startet die Theorie geschlossen.
- Theorie mit Variablen, Einheiten, Formeln und kurzen fachlichen Erklärungen. KaTeX mit HTML/MathML und `trust: false`. Zeitliche Ableitungen in Punktnotation, soweit fachlich passend. Die gemeinsame `Formula`-Komponente muss die volle Höhe von Brüchen, Wurzeln und Matrizen aufnehmen; keine kleinen vertikalen Scrollbalken und keine abgeschnittenen Formelteile. Umbruch an =/≈ erhalten; horizontales Scrollen nur als Rückfall bei einem tatsächlich zu breiten unteilbaren Term.
- Calculate enthält Eingaben, Reset, Umrechnungen, Ergebnisgleichungen und Diagramme. Kompakte Breiten/Abstände wie im Referenzmodell bewahren; keine Verteilung weniger Inhalte über die gesamte Laptopbreite.

## Eingaben und Einheiten

- Feldsymbole und Theorievariablen zentral mit `QuantitySymbol` als Inline-KaTeX darstellen. Indizes in Metadaten als `t_{peak}`, `v_{impact}`, `v_{y,impact}` beziehungsweise `R_{12}` kennzeichnen; bestehende Unicode-Indizes werden zentral normalisiert. Keine sichtbaren `_`/geschweiften Klammern, keine entfernten oder nur teilweise tiefgestellten Indizes und keine eigenen Symbol-Renderer je Modell. IDs, Feldschlüssel und Solver-Notation bleiben unverändert.
- Pro Grösse: Textfeld für Zahl mit optionalem Präfix und rechts ein kleineres eigenes `UnitSelect`. Keine Präfix-Dropdowns; kein natives, betriebssystemabhängig gestaltetes Einheitenmenü.
- Eingaben und Reset verwenden dieselbe neutrale Fläche (`--color-control`), 8-px-Rundung und mindestens 44-px-Höhe.
- Zahlenfeld im Fokus: graue 1-px-Kontur direkt am Feld, kein Abstand. Bei ungültiger Eingabe dieselbe Kontur gestrichelt; kein zusätzlicher weisser oder blauer Rahmen und kein Layoutsprung.
- Einheiten-Auslöser entsprechend ausdrücklichem Nutzerwunsch ohne Fokusrahmen und Unterstreichung. Tastaturbedienung, ARIA-Zustände und aktive Optionsfläche in der geöffneten Liste erhalten. Keine pauschale Zusicherung vollständiger WCAG-Konformität daraus ableiten.
- Zahlenfelder unterstützen zentral in `calculators/quantities.ts` mit dem begrenzten Parser `calculators/arithmetic.ts` auch `()`, `+`, `-`, `*`, `/` und `^`. Keine eigenen Parser je Modell, kein `eval`, `Function` oder allgemeines CAS. Potenzen sind rechtsassoziativ und binden stärker als ein führendes Vorzeichen (`-2^2 = -4`, `2^-2 = 0.25`). Präfixe stehen an einzelnen Zahlen (`1k + 1m = 1000.001`); die gewählte Einheit gilt einmal für das gesamte Resultat. Der manuelle Ausdruck bleibt unverändert im Feld. Zwischenwerte und Resultate nicht anzeigen-runden oder zurückschreiben. Division durch null, 0^0, nichtreelle Ergebnisse, Über-/Unterlauf und überlange beziehungsweise zu tiefe Ausdrücke sind ungültig. Reine Zahlen und ihre bisherigen Metadaten/Präfixe bleiben kompatibel.
- Präfixe p/n/u/m/c/d/k/M/G/T, ohne Präfix ebenfalls erlaubt; Gross-/Kleinschreibung beachten. µ/μ werden wie u akzeptiert. Dezimalkomma/-punkt und Exponentialschreibweise unterstützen; keine Tausendertrennzeichen.
- SI ist die Startauswahl jeder Rechnerinstanz, ausser bei Winkeln: Grad (°) ist voreingestellt, Radiant (rad) bleibt im Dropdown; intern wird in rad gerechnet. Länge: m/AE/Lj, Geschwindigkeit: m/s und km/h, Zeit: s/min/h/d; Masse: kg/g, Winkel: °/rad, Beschleunigung: m/s², Kraft: N, dimensionslos: 1. Die Registry gilt überall.
- Ein Einheitenwechsel lässt den manuellen Eingabetext in allen Rechnern exakt unverändert und interpretiert ihn mit der neu gewählten Einheit. Keine automatische Umrechnung oder Neuformatierung des Zahlenfelds; nach dem Wechsel Ergebnisse mit der neuen Einheit neu berechnen beziehungsweise invalidieren.
- Ausschliesslich manuelle Rohwerte in Textfeldern anzeigen. Berechnete und angenommene Werte niemals automatisch hineinsetzen. Keine wieder eingeführten langen Eingabeanleitungen.

## Berechnung und Ergebnisse

- Reiner TypeScript-Solver, intern SI und ungerundet. Darstellung und Diagramme dürfen die Berechnungsquellen nicht verändern.
- Alle fachlich nutzbaren Variablen des Modells als manuelle Eingabe beziehungsweise Zielgrösse zugänglich machen, einschliesslich bisher nur ausgegebener Grössen. Jede zulässige Inverse explizit implementieren; fixe Konstanten von variablen Parametern unterscheiden. Standardwerte sind sichtbar und dürfen eine bewusst gesuchte Grösse nicht verdecken.
- Automatisch alle bestimmbaren Ergebnisse und deren fachlich zulässige Folgeergebnisse auswerten. Teilresultate nicht hinter einem einzigen globalen „alle Eingaben vollständig“-Zustand sperren. Abhängigkeiten je Grösse deklarieren beziehungsweise in reinen Funktionen explizit berücksichtigen; kein allgemeines CAS und keine zyklische Berechnung durch wiederholtes Raten.
- Fehlende, ungültige, widersprüchliche, unlösbare und unterbestimmte Angaben unterscheiden; `0` ist eine Eingabe. Nur abhängige Resultate invalidieren. Unabhängig gültige Resultate bleiben sichtbar. Beispiele: h aus L und α ohne m; v aus h und g ohne m; F erst bei bestimmbarer Masse und Beschleunigung.
- Alle zulässigen diskreten Lösungen zeigen; keine willkürliche Wahl eines Wurzel- oder Winkelzweigs. Zusätzliche Angaben gegen dieselben Modellgleichungen prüfen und betroffene Grössen kennzeichnen.
- Ergebnis nur unter den Feldern als KaTeX-Kette: Zielgrösse = allgemeine umgestellte Formel = Zahleneinsetzung =/≈ Ergebnis. Zwischen allgemeiner Formel und Einsetzung immer `=`.
- Nicht-SI-Eingaben zunächst sichtbar in SI umrechnen; danach die konvertierten Werte einsetzen. Messwerte in Umrechnung, Einsetzung und Resultat mit drei signifikanten Stellen zeigen; exakte Einheitenfaktoren exakt lassen. Intern mit ungerundeten Werten weiterrechnen. Passende Präfixe aus dem gemeinsamen Formatter nutzen.
- Widerstände, Kapazitäten, Ströme und weitere Messgrössen auch innerhalb der Zahleneinsetzung mit passenden Engineering-Präfixen darstellen. Dimensionslose Werte erhalten keinen Präfix; bei bereits gewählten Nicht-SI-Einheiten keine doppelten Präfixe erzeugen.
- Einzelne positive Messwerte nicht pauschal einklammern. Klammern nur bei Vorzeichen, Potenzen, Funktionsargumenten oder sonstiger mathematischer Mehrdeutigkeit setzen. Implizite Multiplikation zwischen eingesetzten Grössen beziehungsweise Faktoren sichtbar mit `\cdot` schreiben.
- Nur berechnetes t bekommt eine zusätzliche Uhrdarstellung aus dem ungerundeten SI-Wert: unter 60 s keine; ab 60 s MM:SS.s; ab 3600 s HH:MM:SS.s; ab einem Tag zusätzlich Nd,. Darstellung hinter `=`, nicht in Klammern; Zehntelsekunden korrekt übertragen.

## Diagramme

- Jede Modellkarte erhält eine fachlich geeignete Grafik, die die relevanten Eingabe- und Ergebnisgrössen veranschaulicht. Diagramme stehen unter den Ergebnissen, auf breiten Bildschirmen nebeneinander, mobil untereinander. Keine Datentabelle hinzufügen. Eigene responsive SVG-Komponenten und vorhandene Darstellungsbausteine wiederverwenden; 3D nur bei fachlichem Mehrwert.
- Grafiken verwenden dieselben validierten ungerundeten Solver- und Teilresultate wie die Formeln. Modelllogik nicht in Svelte oder SVG erneut implementieren. Eine bekannte Geometrie bereits ohne Masse zeigen; tatsächliche Kraftbeträge erst bei vorhandenen erforderlichen Angaben. Schaubilder dürfen keine vollständige Berechnung vortäuschen.
- Diagrammflächen und schematische Kurven bleiben auch ohne gültige Eingaben sichtbar; dann keine numerischen Skalen oder vermeintlichen Messergebnisse. Beschreibungen müssen schematische und berechnete Darstellung unterscheiden. Sonderfall t = 0 nicht als Bewegung über ein erfundenes Intervall zeichnen.
- Bei gültigen Eingaben ungerundete Solver-Daten verwenden. Kurven ohne Kreismarkierungen an Anfang/Ende.
- Achsenlabels als s [m], v [m/s], t [s]; keine doppelte Einheitenangabe rechts oben. Y-Label direkt über der obersten Skalenangabe.
- Rasterlinien dezent, auch die unterste; die horizontale Nullachse kräftig (2 px), durchgezogen und mit 0 beschriftet. Ohne Daten liegt sie unten, ohne numerische Skala. Positive Achsenenden erhalten Pfeile. Überlappende Ticktexte vermeiden.
- Tickwerte mit drei signifikanten Stellen; bei Betrag >= 1000 oder 0 < Betrag <= 0.001 als Koeffizient × 10 mit hochgestelltem Exponenten. Null bleibt 0. Gemeinsamen `formatAxisLabel` verwenden.
- SVG reicht für die jetzigen Geraden; keine zusätzliche Diagrammbibliothek ohne konkreten Bedarf. Spätere komplexere Modelle dürfen denselben visuellen Rahmen mit einem passenden Renderer nutzen.
- Elektrotechnische Schaltungen dynamisch mit eigenen SVG-/Svelte-Komponenten erzeugen; keine lokalen Referenzbilder als Ersatz für modellgebundene Diagramme. Widerstandsrechtecke verwenden zentral dieselbe dünne Kontur, leicht gerundete Ecken und gleich dünne Anschlussleitungen.
- **Alle Grafiken reagieren auf Eingabefokus und Zielauswahl:** Zur aktiven Grösse gehörende Elemente bleiben kontrastreich; die übrigen werden mit `--color-diagram-muted` ausgegraut (Hellmodus hellgrau, Dunkelmodus dunkelgrau). Dies gilt für Mechanik, Optik, Schaltungen und 3D gleichermassen, einschliesslich zugehöriger Beschriftungen, Pfeile, Linien und Flächen. Bereits akzeptierte neutrale Schaltungsauswahl und blaue Geometriemarkierungen verwenden ihre gemeinsamen Theme-Tokens weiter.
- Fokus über die gemeinsame `QuantityField`-/Einheitenmenü-Anbindung melden, nicht durch je Modell kopierte DOM-Suchen. Die aktive Feldgruppe umfasst Zahlenfeld und Einheitenmenü; eine Einheitenauswahl darf die Hervorhebung nicht ungewollt beenden. Tastatur und Touch gleich behandeln. Priorität: aktives Eingabefeld, sonst aktive Zielauswahl, sonst Normalzustand.
- Eine Grössen-ID kann mehrere Grafikelemente zuordnen, z. B. L zur gesamten geneigten Strecke, h zur vertikalen Höhe, v zum Geschwindigkeitsvektor, μₖ zur Reibung. Kein einzelnes willkürliches Teilstück hervorheben. Beim Stern–Dreieck-Diagramm gehören Leitungen, Knoten, Widerstände und Beschriftungen zur jeweiligen Schaltung.
- Ausgrauen verändert weder Daten noch Physik und ersetzt keine Beschriftung. Relevante Elemente müssen erkennbar bleiben; keine gesamte Grafik pauschal abdunkeln. Bei Fokusverlust beziehungsweise aufgehobener Auswahl korrekt zurücksetzen. Null- und unbekannte Grössen dürfen durch Auswahl keinen erfundenen Zahlenwert oder Pfeil erhalten.
- Bei kombinierten Richtungs-/Topologie-Rechnern bleiben manuelle Eingaben beim Umschalten erhalten. Quell- und Zielzeichnung wechseln ihre Reihenfolge so, dass die gewählte Ausgangsschaltung zuerst steht; Feldsymbole und Diagrammwerte folgen demselben Modus.

## Verifikation

Für neue Rechner und gemeinsame Komponentenänderungen `npm test`, `npm run check` und `npm run build` ausführen. Alle inversen Zielgrössen und unterstützten Eingabekombinationen, Teilresultate ohne unnötige Masse/Parameter, Folgeergebnisse, Mehrfachlösungen, Widersprüche, Solver-Grenzfälle, Umrechnungen, reine Anzeige-Rundung und abhängige Invalidierung gezielt prüfen. Bei Layout-/Interaktionsänderungen beide Themes, Laptop/Mobilansicht, Tastatur und Pointer/Touch sowie Grafikzuordnung, Ausgrauen und Rücksetzen bei Feld-/Zielauswahl prüfen, soweit Browserwerkzeuge verfügbar sind; fehlende Browserprüfung benennen. Reine Dokumentänderungen benötigen Link-/Konsistenzprüfung, keinen erneuten Produktionsbuild.

## Gruppierung und Zustand

`content/model-groups.ts` bündelt verwandte Formeln; `integratedModels` erhält alte IDs als Direktlinks auf einen kombinierten Rechner. `variants` bedeutet eine tatsächliche Modellauswahl innerhalb einer Karte. `ModelHost` nutzt dafür `ModelVariantSwitch`: zwei Varianten als `ToggleSwitch`, mehr Varianten als kompakte Radioauswahl. Das sind keine numerischen Range-Slider. Nur besuchte Varianten werden instanziiert, ihre Rohwerte und Einheiten bleiben erhalten; verdeckte Varianten sind nicht fokussierbar. Ohne JavaScript bleibt die Theorie aller Varianten zugänglich.

Keine automatische Gruppierung gegen eine ausdrückliche Nutzervorgabe. Auf der Impulsseite werden vier eigene Karten dargestellt, ohne innere Variantenwahl. Modell-IDs für Hashlinks und Suche stabil halten; alte Unterseiten erhalten lokalisierte Weiterleitungen auf die passende Karte.

## Kombinierter Rechner: Schiefe Ebene

Dynamics bündelt 14 Quellbeziehungen in vier Karten. Inclined Plane integriert sieben Quellen ohne Variantenwahl in einer Eingabefläche mit 14 Grössen: L, h, α, v_end, m, μ_k, g, Gewichtskraft, Normalkraft, Hangabtriebskraft, Reibungskraft, resultierende Kraft, Hebekraft und Beschleunigung. Die Oberfläche nutzt `physics/mechanics/incline-combined.ts`; `inclined-plane.ts` ist nicht der vollständige Vertrag des kombinierten Rechners.

Geometrie, Beschleunigung und Endgeschwindigkeit sind ohne Masse bestimmbar; Kräfte benötigen Masse. Bekannte Werte vor den sichtbaren Standardannahmen μ_k = 0 und g = 9.81 m/s² auswerten. Endgeschwindigkeit gilt aus Ruhe. Negative Beschleunigung bedeutet Abbremsen; keine erreichbare positive Endgeschwindigkeit aus Ruhe erfinden. Gleitreibung wirkt auf bereits hangabwärts gleitende Körper bergauf; keine Haftreibungs-/Losbrechberechnung. Die Hebekraft gilt für gleichförmiges Hinaufgleiten und ist nicht die resultierende Kraft beim freien Hinabgleiten. Zulässige Winkelzweige und unabhängige Teilresultate erhalten. Ohne Masse nur ausdrücklich schematische Kraftverhältnisse, keine erfundenen Kraftbeträge. Alte Quell-IDs öffnen dieselbe Karte.

## Wurfbewegung

`content/oblique-throw.ts`, `physics/mechanics/oblique-throw.ts` und `calculators/oblique-throw.ts` definieren gemeinsam den einen Rechner mit 17 Eingabemöglichkeiten. Die Karte heisst Projectile Motion / Wurfbewegung und ersetzt auch Vertical Motion sowie Horizontal Throw. Keine getrennten Wurfkarten, Varianten oder Schnellwahl für diese Sonderfälle wieder einführen; α = 0° beziehungsweise ±90° wird regulär eingegeben. `integratedModels` in der zentralen Gruppierung bewahrt die alten Formelbuch-IDs als Direktlinks auf denselben Rechner. Beobachtungszeit und gesamte Flugzeit, relative Steighöhe und absolute Scheitelhöhe fachlich unterscheiden. Mehrdeutige Winkel und Zeiten erhalten; nur zulässige Beobachtungen bis zum ersten Bodenkontakt darstellen. Bei negativen Abwurfwinkeln keine Scheitelzeit, Steig- oder Scheitelhöhe berechnen/ausgeben; alte Scheiteleingaben in dieser Richtung nicht auswerten. Details und Annahmen: `docs/PHYSICS_STANDARDS.md` (vom Repository-Stamm).

## Federpendel im Bereich Hooke’s Law

`content/spring-models.ts` liefert Federpendel und kreisendes Federpendel; `physics/mechanics/spring-models.ts` verbindet ausschliesslich explizite Relationen und Inversen. Keine allgemeine Formelauswertung ergänzen. `SpringCalculator` nutzt die gemeinsamen Felder, Einheiten, Reset und Rechenwege. Das normale Federpendel beschreibt ungedämpfte Schwingung um die Gleichgewichtslage; ohne Amplitude bleibt die Kurve ausdrücklich normiert. Das kreisende Federpendel entspricht einer schräg aufgehängten Feder mit horizontaler Kreisbahn (Aufgabe 1 der privat bereitgestellten Lösung 5), nicht einem horizontalen Feder-Masse-System auf einer Unterlage. Unbelastete Länge, rotierende Länge und Dehnung trennen. Winkel gegen die Vertikale, Winkelgeschwindigkeit als Betrag mit beiden möglichen Drehrichtungen. Nur g darf nach erfolgloser Inferenz sichtbar angenommen werden; keine Masse oder Federlänge voraussetzen. Fachvertrag und Grenzfälle stehen in den Physikstandards.

## Erstes Keplersches Gesetz

Die Karte `kepler-ellipse` verwendet `KeplerEllipseCalculator` und den expliziten Relationssolver `physics/mechanics/kepler-ellipse.ts` mit 15 Eingabefeldern. Auch c, p, Peri-/Apoapsisabstand, Fläche sowie sämtliche Theoriekoordinaten, Polarwinkel und Hilfshöhe müssen Eingabegrössen bleiben. X/Y sind auf den Ellipsenmittelpunkt bezogen; x/y auf den Brennpunkt, mit Periapsis auf +x. Die Konstruktion verwendet z = r > 0. Mehrere zulässige Punktlösungen nicht verwerfen; φ modulo 2π behandeln. Bei bestimmtem Punkt steuert dieser die Grafik; ein freier Phasenregler darf nicht widersprüchlich dazu weiterwirken. Beim Kreis keinen Winkel aus dem Radius allein erfinden. Teilresultate und Grenzen: [KEPLER.md](../docs/KEPLER.md). Exzentrizität als ε anzeigen. Regler auf Grafikbreite begrenzen; Play/Pause direkt bei der Bahnphase. Kein Rand an der Schnittebene, keine markierbaren Achsenbeschriftungen beim Drehen und kein öffentlicher Link zum nutzereigenen Desmos-Modell.

## Drittes Keplersches Gesetz

`KeplerPeriodCalculator` verbindet beide Umlaufbahnen, ihre Verhältnisse und die Aufteilung M_tot = M + m in einer Karte mit neun Eingaben. Die feste Gravitationskonstante bleibt lesbar in der Theorie/Annahme; keine fehlende Einzelmasse voraussetzen. Bahnverhältnisse sind unabhängig von einer Massenangabe bestimmbar. Alle expliziten Umstellungen und Teilresultate kommen aus `physics/mechanics/kepler-period.ts`; Grafik und Rechenweg verwenden diese Werte. Die normierte Kurve darf keinen unbekannten absoluten Zeit- oder Längenmassstab vortäuschen. Fachvertrag: [KEPLER.md](../docs/KEPLER.md).

## Impulserhaltung und Rakete

`MomentumCalculator` verbindet Impulsbilanz beziehungsweise ideale Raketengleichung ohne Variantenwahl. Beide nutzen `physics/mechanics/momentum.ts`, gemeinsame Eingaben und ein responsives SVG mit Fokus-Ausgrauung. Raketengleichung ohne äussere Kräfte und mit konstantem u relativ zur Rakete; M enthält verbleibenden Treibstoff. Anfangsgeschwindigkeit und momentanen Massenstrom nicht voraussetzen. Δv und Schub bleiben unabhängig voneinander bestimmbar. Gasgeschwindigkeit im Beobachtersystem ist v − u. Fachvertrag, Quelle und Grenzen: [MOMENTUM.md](../docs/MOMENTUM.md).

## Zentrale Stösse

Die Seite Momentum zeigt vier eigene aufklappbare Karten: Momentum Conservation, Inelastic Collision, Elastic Collision, Rocket Equation. Keine Variantenwahl innerhalb der Impulskarte und keine separaten Stoss-Unterthemen. Sie verwenden die gemeinsame `MomentumCalculator`-Oberfläche und `MomentumDiagram`. Keine eigenen kopierten Seiten-/Feldlayouts. Bei elastischen Stössen ist e = 1 fest; im inelastischen Rechner bleibt e eine manuelle Eingabe oder ein Ergebnis, ohne Standardannahme. Impuls-, Energie- und Vorzeichenkonventionen sowie alle zulässigen diskreten Geschwindigkeitszweige erhalten. Keine anfängliche Ruhe eines Körpers voraussetzen. Fachvertrag: [COLLISIONS.md](../docs/COLLISIONS.md).

## Transformator

`ElectricalCalculator` verwendet für `transformer` einen Ideal/Real-`ToggleSwitch`. `transformerDefinition(real)` liefert die passenden Gleichungen. Im Idealmodus gilt η = 1; das Wirkungsgradfeld vollständig ausblenden, nicht nur deaktivieren. Im Realmodus ist η Eingabe oder Ergebnis; fehlt eine Bestimmungsgrundlage, bleiben davon abhängige Grössen offen. Rohwerte und Einheiten beim Moduswechsel erhalten. Keine zweite Physikimplementierung für die Darstellung.

## Numerische Schieberegler

`RangeSlider.svelte` zeichnet die sichtbare Schiene und den Griff zentral. Referenz ist ausschliesslich der Sensitivity-Slider aus `portal_hyalarm.html`: 2-px-Schiene, blauer Füllanteil, 16-px-Griff in `--color-slider-thumb` (Hintergrundfarbe der Rechnerfläche), kein weisser oder pinker Griff. Die Bedienfläche bleibt mindestens 44 px hoch. `ToggleSwitch` für binäre Varianten nicht mit dieser Range-Gestaltung überschreiben.

## Suche, Informationsseiten und Footer

- `SiteSearch` und `search/site-search.ts` leiten den zweisprachigen Index aus Registry und Fachinhalten ab. Treffer als Linkpillen mit vollständiger Hierarchie; originale Modell-IDs öffnen die richtige Karte beziehungsweise integrierte Quelle.
- `Overview` unterscheidet Physikthemen und `kind: 'guide' | 'info'`. Rechnerhilfe, About und Disclaimer erhalten keine „Subject overview“-Kennzeichnung und keine Physik-Themenkarte. Sie bleiben über Footer, Suche, Sitemap und Sprachwechsel erreichbar.
- About nennt nur bestätigte Qualifikationen und Projektgeschichte; keine Bedienungsanleitung, Werbung, erfundenen Abschlüsse oder institutionelle Empfehlung.
- `SiteFooter.svelte` mit zentralem CSS: Marke/Rechtliches in einem fliessenden Block, Projekt und Hilfe/Referenz als deutlich begrenzte Gruppen. Kein grosser Leerraum oberhalb von Legal. Auf zweispaltigen Breiten darf auch der Kontakttext nur eine Spalte belegen; unter 40 rem stehen die beiden Hilfelinks untereinander, unter 24 rem die Gruppen in einer Spalte. Keine Inhalte manuell in einzelne Seitenfooter kopieren.
- GitHub `https://github.com/jaduruch/calcPhysics` und Instagram `https://www.instagram.com/calcphysics/` als Links mit Logo und ohne ausgehenden Pfeil. `calcphysics@outlook.com` und der Hinweis auf Vorschläge/Formelfehler/Bugs bilden einen eng gesetzten Kontaktblock. Keine Social-Media-Widgets.
- Instagram-Downloadicons unter `output/instagram-icons/` nicht importieren, nicht nach `static/` übernehmen und nicht als Website-Themenicons verwenden.
