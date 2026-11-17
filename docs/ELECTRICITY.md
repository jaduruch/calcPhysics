# Electricity & Magnetism

Stand 14.11.2026: neun Unterthemen mit 44 zugrunde liegenden Rechendefinitionen, 29 registrierten Definitionen und 22 sichtbaren Karten im bestehenden Modellkartenstandard. Three-Phase Systems enthält Stern, Dreieck und Generator gemeinsam. Englisch bleibt die Standardsprache. Die Themen sind lokal implementiert; kein Hosting oder Deployment wurde beauftragt.

## Umfang und Referenz

Referenz ist die aktuelle [Elecalculate-Elektrotechnik](https://elecalculate.com/Elektrotechnik/elektrotechnik/) und ihr öffentlich verlinkter [Quellcode](https://github.com/jaduruch/elecalculate), am 03.11.2026 abgerufen. Die aktuelle Quelle enthält zusätzlich zu den neun älteren Navigationspunkten Drehstrom und die Dreiphasen-Simulation. Die öffentliche Übersicht enthält keinen externen PDF-Quellenlink.

| Unterthema | Modelle und Darstellungen |
| --- | --- |
| Direct Current | Ohmsches Gesetz und Leistung in einer Karte mit U/I/R/P und allen sechs Eingabepaaren, unbelasteter/belasteter Spannungsteiler, erweiterbare Widerstandsliste in Serie/parallel, Stern-/Dreieckumrechnung |
| Alternating Current | Sinus-/Rechteck-/Dreieck-Effektivwerte, zeitabhängiger Sinus, unipolares PWM mit Tastgrad und Kurve, Wirk-/Blind-/Scheinleistung |
| Magnetism | Durchflutung, Feldstärke, Flussdichte, Fluss, magnetischer Widerstand; mittlere induzierte EMK |
| Capacitors | Erweiterbare Kondensatorliste in einer Serie-/Parallelkarte, Ladung/Energie, Plattengeometrie und Feld, Ladungstransport und Kraft, kreisförmige Fläche, gemeinsame RC-Serie-/Parallelkarte an AC mit Impedanzdreiecken, Laden/Entladen mit Kurven |
| Inductors | Transformator mit 14 Primär-/Sekundärgrössen und vorwärts/inverser Berechnung; erweiterbare Spulenliste in einer Serie-/Parallelkarte ohne Kopplung, gemeinsame Spulenberechnungen für Induktivität, Energie, Fluss, Selbst- und Bewegungsinduktion, RL-Serie/parallel an AC mit Impedanzdreiecken, Ein-/Ausschalten mit Kurven |
| Resonant Circuits | Serien-/Parallel-RLC bei expliziter Anregungsfrequenz, Resonanzfrequenz, Güte, Bandbreite, Impedanz und Strom |
| Gain & Attenuation | Amplituden- und Leistungsfaktoren sowie logarithmische Verstärkung/Dämpfung |
| Filters | RC-/RL-Hoch-/Tiefpass mit den Referenzfeldern für Phase, Widerstand, Reaktanz, Dämpfung, Bauteil, Ein-/Ausgangsspannung, Grenzfrequenz und Frequenz; RC-Hochpass zusätzlich mit Kondensatorspannung; immer mit eigenem Schema sowie Bode-Magnitude- und Bode-Phasendiagramm |
| Three-Phase Systems | Symmetrische Stern-/Dreiecksysteme mit Strang-/Leitergrössen und Leistung sowie zeitabhängige Generator-Phasenspannungen, drei Kurven und normierte rotierende Zeiger |

Ohm’s Law verwendet eine eigene SVG-Schaltung (`OhmsLawDiagram.svelte`) mit Quelle, Widerstand, Strom-/Spannungspfeil und absorbierter Leistung. Beim Fokus auf U/I/R/P bleibt die betreffende Grösse samt Einheit farbig, die übrigen werden grau. Sobald kein Zahlenfeld mehr fokussiert ist, erscheinen wieder alle Grössen farbig; Tastaturfokus funktioniert genauso. Farben kommen aus zentralen Theme-Tokens. Das frühere Elecalculate-Bild ist entfernt.

Der Spannungsteiler nutzt ebenfalls eine eigene SVG-Grafik und dieselben Schaltungsstyles in `styles/circuit-diagram.css`. Eine gemeinsame Karte schaltet zwischen unbelastetem und belastetem Modell um. R_L und die beiden Zweigströme erscheinen nur im belasteten Modus. Vorwärts- und Rückwärtsrechnungen nutzen dieselben expliziten Beziehungen; gemeinsame manuelle Eingaben bleiben beim Umschalten erhalten, ausgeblendete Lastangaben sind im unbelasteten Modus nicht wirksam. Fokusverlust setzt die Hervorhebung zurück. Die Theorie der Karte enthält beide Varianten.

Alle Schaltungen und Wellenformen werden aus validierten Rechenergebnissen mit eigenen Svelte-/SVG-Komponenten dynamisch erzeugt; statische Electricity-Diagramme werden nicht mehr benötigt. Die externen Quellenlinks wurden auf Wunsch aus allen Modelltheorien entfernt; fremder React-/DOM-/Controller-Code wird nicht ausgeführt oder eingebettet.

## Umsetzung und fachliche Grenzen

- `content/electricity.ts`: englische Metadaten, Eingabe-/Ausgabegrössen, Formeln, Theorie, Voraussetzungen, Quellen, Diagrammzuordnung.
- `physics/electricity.ts`: explizite reine SI-Funktionen, Definitionsbereiche und Endlichkeitsprüfung; kein CAS. `physics/electrical-relations.ts` ergänzt für Ohm, Transformator, Spannungsteiler und Filter explizite Umstellungen mit begrenzter Weiterberechnung und Konsistenzprüfung. Ohm benötigt genau zwei manuelle Werte; degenerierte Nullwertpaare werden als unterbestimmt oder unlösbar behandelt. Der Transformator und die Filter liefern nur eindeutig bestimmbare Teilresultate; zwei Eingaben bestimmen nicht notwendigerweise alle Grössen.
- `calculators/electrical-equations.ts`: drei signifikante Stellen, sichtbare SI-Umrechnung, allgemeine Formel, Zahleneinsetzung und Ausgabe aus denselben ungerundeten Resultaten.
- `ElectricalCalculator.svelte`: gemeinsame `QuantityField`, `UnitSelect`, `CalculatorShell`, `CalculatorTools`, `EquationBlock` und zentrale Rechnerstyles. Kein zweites Formular-/Styling-System.
- `visualization/electrical.ts`: Sampling derselben Solver; ungültige/unvollständige Eingaben erzeugen nur unskalierte schematische Vorschauen. `MotionChart` erhält optionale X-Achsenbeschriftung und einen schematischen Modus; sein bisheriges Standardverhalten bleibt erhalten.

Feldgrössen, Flussänderungen und EMK sind vorzeichenbehaftet, andere Grössen folgen den pro Modell dokumentierten Bereichen. Reaktive Leistung und Impedanzphase sind für kapazitive Lasten negativ, für induktive positiv. AC-Spannung/Strom sind RMS, ausser ausdrücklich als Peak/Momentanwert gekennzeichnet. RC-Entladestrom und RL-Abschaltspannung haben die Gegenrichtung zum Einschaltfall. `expm1` erhält kleine Anstiegswerte nahe t = 0.

Magnetische Modelle sind linear und homogen; keine Sättigung, Hysterese oder Streufelder. Plattenkondensator ohne Randeffekte/Durchschlag. Transformator mit idealem Spannungsverhältnis und ohmscher Last. Im Idealmodus gilt sichtbar η = 1; im Realmodus wird η eingegeben oder aus unabhängigen Grössen bestimmt. Ist dies im Realmodus nicht möglich, bleiben davon abhängige Grössen unbestimmt. Die Annahme und abgeleitete Werte werden nicht in Textfelder geschrieben. Widersprüchliche Angaben verwerfen das gesamte Resultat. Filter sind unbelastet und ideal. RLC-Verlustwiderstand liegt jeweils in Serie beziehungsweise parallel. Drehstromberechnungen gelten für symmetrische Systeme, keine unsymmetrischen Lasten und keine Sternpunktverschiebung. Die Generator-Darstellung folgt dem manuell eingegebenen Zeitpunkt, ohne automatische Animation.

μ₀ = 1.25663706127 × 10⁻⁶ H/m und ε₀ = 8.8541878188 × 10⁻¹² F/m stammen aus [NIST CODATA 2022](https://physics.nist.gov/cuu/Constants/), sind gemessene Konstanten und werden nicht als exakt bezeichnet. Die Einheitengruppe `area` behandelt mm²/cm² explizit; das Textpräfix skaliert wie bisher den Zahlenwert, nicht den Exponenten einer Einheit. Prozent wird zuerst nach 1 konvertiert; Winkel intern nach rad. Keine von Anzeige-Rundung abhängigen Folgewerte.

## Verifikation

`tests/electricity.test.mjs` prüft alle Modellformeln mit KaTeX, Modellzuordnung, unabhängige Referenzfälle, Bereiche, fehlende Werte, Überlauf, Vorzeichen, t = 0, PWM-Grenzen, Resonanz, Filterfelder und Filter am −3-dB-Punkt, Einheiten und Solver-/Kurvenübereinstimmung. Bestehende Mechaniktests bleiben bestehen. Die SEO-Prüfung berücksichtigt die erweiterten veröffentlichten Routen aus der zentralen Registry.

Browserprüfung: Themen und Rechner, Theorieformeln, beide Themes, Laptop und Mobilbreite, Invalidierung, Reset, Prozentwechsel, Tastaturbedienung des Einheitenmenüs und Theorie ohne JavaScript. Die zusammengeführte Spannungsteiler-Karte wurde zusätzlich auf Moduswechsel, bedingte Lastfelder/-grafik, Vorwärts-/Rückwärtsrechnungen, isolierte ungültige Lastangaben, Fokus/Fokusverlust und Tastaturbedienung des Schalters geprüft. Produktionsbuild und Svelte-/Typprüfung bestehen ebenfalls.

## Abgleich Ohm und Transformator (03.11.2026)

Erneuter Abgleich mit `src/lib/basic-solvers.ts` und `src/lib/passive-models.ts` im aktuellen Elecalculate-Repository: Die vorhandenen vorwärts/inversen Umstellungen bestätigen den gewünschten Ablauf bereits; ein Rückgriff auf Sommer 2025 war nicht nötig. Die getrennten Ohm-Eingabekombinationen und die separate Transformator-Lastreflexionskarte sind in die jeweiligen vollständigen Karten zusammengeführt.

Zusätzliche Tests in `tests/electrical-relations.test.mjs`: alle sechs Ohm-Paare, Null-/Überbestimmungsfälle, Vorwärts-/Rückwärtsfälle auf beiden Transformatorseiten, Wirkungsgrad aus Leistung und aus Spannung/Strom, ideale Annahme, partielle Bestimmbarkeit, Konflikte, KaTeX und Invalidierung. Kein Runden im Solver; relative Konsistenzschranke 1e-9 für unabhängig eingegebene redundante Werte.

`tests/voltage-divider.test.mjs` prüft beide Varianten, Kirchhoff-Knoten-/Maschenbeziehungen, inverse Quellen-/Widerstands-/Lastberechnung, fehlende Grössen, Nullwerte, widersprüchliche Angaben und KaTeX. Die Differenz-Umstellungen werden bei bereits bekannter Zielgrösse nicht erneut zur Konsistenzprüfung verwendet; die jeweiligen Vorwärtsbeziehungen prüfen die Bedingung ohne Auslöschung kleiner Zweigströme beziehungsweise grosser Lastwiderstände.

Serie- und Parallelwiderstände liegen ebenfalls in einer gemeinsamen Karte. Derselbe `ToggleSwitch` schaltet Berechnung, Ergebnisformel und die eigene SVG-Schaltung (`ComponentNetworkDiagram.svelte`) um; die manuell eingegebenen Widerstände bleiben erhalten. Die Theorie enthält beide Formeln.

Die Serie-/Parallelkarten für Widerstände, Kondensatoren und Spulen verwenden die gemeinsame Layoutoption `input-grid--single`: ihre Eingaben stehen auch auf breiten Bildschirmen untereinander. Die SVG-Grafik verwendet die gemeinsamen Schaltungsstyles und markiert beim Feldfokus den betreffenden Widerstand; ohne Feldfokus erscheinen beide farbig.

Die Serie-/Parallel-Widerstandsliste startet mit R₁ und einem ausgegrauten leeren R₂. Sind alle sichtbaren Werte gültig und positiv, kommt ein weiteres leeres Feld hinzu. Leere Folgefelder bleiben als Platzhalter ausgegraut und per Tastatur erreichbar. Ein leeres Schlussfeld zählt nicht zur Rechnung; Lücken vor bereits eingegebenen späteren Widerständen verwerfen das Resultat, ohne manuelle Werte zu löschen. Reset führt auf zwei Felder zurück. Die eigene Grafik wächst mit den eingetragenen Widerständen; bei vielen Parallelzweigen scrollt nur die Grafik horizontal. `physics/resistor-network.ts` summiert in SI und normalisiert parallele Leitwerte gegen den kleinsten Widerstand, um 1/R-Überlauf zu vermeiden.


Die Kondensator-Reihen- und Parallelschaltung verwendet denselben Umschalter, Feldablauf und SVG-Baustein wie die Widerstandskarte. C₁ … Cₙ bleiben beim Umschalten erhalten; Reset stellt zwei leere Felder her. Die gemeinsame Grafik zeichnet bei Kondensatoren zwei getrennte Platten ohne durchgehenden Draht im Plattenzwischenraum. Skalierung, Zweigabstände, Fokusmarkierung und optionale Platzhalter entsprechen der Widerstandszeichnung. Theorie und dynamische Rechenwege enthalten die reziproke Summe für Serie und die direkte Summe für Parallel. `solveCapacitorNetwork` und `solveResistorNetwork` verwenden dieselbe validierte Summenberechnung in `physics/resistor-network.ts`, mit fachlich unterschiedlicher Zuordnung der Schaltungsart. Nur positive endliche Bauteilwerte sind gültig; Innenlücken verwerfen Ergebnisse, das leere Schlussfeld bleibt optional.

Prüfung dieser Erweiterung: 69 Tests einschliesslich Kondensator-Grenzfällen und KaTeX-Rechenwegen; Browserabläufe für dynamische Felder, Präfixe, Tastatur-Umschaltung, Fokusmarkierung, Invalidierung, Reset, beide Themes, Mobil-/Laptopbreite und Widerstandsregression erfolgreich.


Auch Spulen verwenden die gemeinsame Serie-/Parallelkarte mit L₁ … Lₙ, dynamischen Folgefeldern, Reset und Fokusmarkierung. `ComponentNetworkDiagram.svelte` zeichnet alle drei Bauteilarten zentral; bei Spulen zeigt es Wicklungsbögen ohne durchgehenden Kurzschlussdraht. Die kompakte Skalierung und die Zweigabstände bleiben gemeinsam. Voraussetzung sind positive ideale Induktivitäten ohne gegenseitige magnetische Kopplung. `solveInductorNetwork` verwendet die vorhandene Summenlogik: direkte Summe in Serie, reziproke Summe parallel. Die Annahme wird an der Karte angezeigt und gilt auch für die Theorieformeln. Die Tests prüfen beliebig viele Eingaben, Präfixe, Lücken, ungültige Werte, numerische Grenzfälle und KaTeX-Rechenwege.

Transformator ist eine standardmässig eingeklappte Modellkarte auf `/electromagnetism/inductors`, kein eigenes Unterthema. Seine spezifische Theorie bleibt über die Modell-ID zugeordnet. Die bisherige URL `/electromagnetism/transformers` wird dauerhaft auf die Spulenseite weitergeleitet; Navigation und Sitemap enthalten nur die aktuelle Themenstruktur.

Der Transformator startet im Modus Ideal. Der gemeinsame Umschalter Ideal/Real aktiviert im Realmodus das Wirkungsgradfeld samt Einheitenwahl. Im Idealmodus werden Wirkungsgradfeld und Einheitenwahl vollständig weggelassen; η = 1 (100 %) wird als feste Modellannahme angezeigt. Manuelle Realwerte und ihre Einheit bleiben beim Umschalten gespeichert, wirken im Idealmodus jedoch weder auf Validierung noch auf Berechnung oder Umrechnungszeilen. Reset löscht auch diese gespeicherten Eingaben.

Die Oberfläche ruft den Solver mit explizitem Modus auf. Ideal verwendet P₂ = P₁, I₂ = nI₁ und R₁ = n²R₂ mit n = N₁/N₂ = U₁/U₂; die Rechenwege enthalten keinen unnötigen Verlustfaktor. Real verwendet P₂ = ηP₁, I₂ = ηnI₁ und R₁ = ηn²R₂. η kann aus unabhängigen Leistungs-, Strom- oder Widerstandsangaben ermittelt werden. Ohne bestimmbaren Wirkungsgrad gibt es im Realmodus keinen Rückfall auf η = 1; unabhängige Teilresultate bleiben verfügbar. Beide Modi verwenden ein ideales Spannungsverhältnis und eine ohmsche Last. Der Realmodus ist ein zusammengefasstes Wirkungsgradmodell ohne Magnetisierungsstrom, Sättigung oder Wicklungsspannungsabfall. Die Theorie enthält beide Modi ausdrücklich beschriftet.



### Gemeinsame Spulenberechnungen

„Inductance & Stored Energy“, „Self-Induction“ und „Motional EMF“ sind in der Karte „Inductor Calculations“ (`inductor`) zusammengeführt. Grundlage ist ausdrücklich das Unterthema [Spulenberechnungen](https://elecalculate.com/Elektrotechnik/Spule/), abgeglichen mit `inductorRules` in `src/lib/passive-models.ts` des auf der Live-Seite angegebenen Builds `5f458c24d6c29850b952c1bacfeefebae125993e`. Die Regeln umfassen L = A_L N², Φ = BA = LI/N, A_L = μ₀μᵣA/l, U_ind = −L ΔI/Δt = −N ΔΦ/Δt und Bewegungsinduktion. Die bisherige Energiebeziehung W = LI²/2 bleibt integriert.

Die Vorlage verwendet I/Φ sowohl für Zustandswerte als auch für Änderungen und l für zwei verschiedene Längen. calcPhysics trennt I/ΔI, Φ/ΔΦ, magnetische Weglänge l/bewegte Leiterlänge l_c sowie U_ind/U_mot fachlich ausdrücklich. Alle 17 Felder können manuell angegeben werden; fehlende Grössen werden nur bei eindeutiger Bestimmbarkeit abgeleitet und ausschliesslich als Rechenweg dargestellt. W und L allein legen das Vorzeichen von I nicht fest. Mit einer Flussorientierung lässt sich auch dieser inverse Fall lösen. Keine stillschweigende Annahme I = ΔI, Φ = ΔΦ oder gleicher Längen; keine erfundene zusätzliche Geschwindigkeit oder magnetische Kopplung. Eine vollständige symbolische Lösung beliebiger Gleichungssysteme ist nicht Bestandteil des Rechners.

Die expliziten Regeln liegen in `physics/electrical-relations.ts` und verwenden die bestehende begrenzte Ergebnisfortpflanzung. Quellenzuordnung bleibt in der Projektdokumentation; die auf Wunsch entfernten sichtbaren Quellenlinks wurden nicht wieder eingeführt.

„Series RC at AC“ und „Parallel RC at AC“ erscheinen als gemeinsame Karte „RC at AC: Series & Parallel“. Die kompakte Auswahlleiste schaltet Solver, allgemeine Formeln, numerische Ergebnisse, Schaltungsbild und Zeigerdiagramm gemeinsam um. R, C, f und U bleiben beim Wechsel erhalten; Reset leert die Werte, ohne die gewählte Schaltungsart still zu ändern. Beide expliziten SI-Modelle bleiben getrennt geprüft, da Impedanz, Strom und Leistungen fachlich unterschiedliche Gleichungen verwenden.

Die Kartenstruktur wird zentral in `src/lib/content/model-groups.ts` zusammengefasst: Signalformen und Effektivwerte in einer Karte, Serien-/Parallelresonanz in einer Karte, Filter in je einer RC- und RL-Karte, Stern/Dreieck in einer Karte. Varianten verwenden den gemeinsamen Umschalter; jeder vorhandene Rechner behält seine Eingaben, Formeln und Grafik.
