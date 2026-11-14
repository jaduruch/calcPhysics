# Impuls und idealer Raketenantrieb

## Quelle und Umfang

Auftrag: Seite zur Impulserhaltung mit Schwerpunkt Raketengleichung anhand des privat bereitgestellten `Skript-physik1_HS25.pdf`, gedruckte Seiten 49–52 (PDF-Seiten 64–67), Kapitel 3.7. Grundlagen zu Impuls und abgeschlossenem System ergänzend aus Kapitel 3.2–3.3. PDF und Renderdateien bleiben ausserhalb des Repositories. Keine Anweisungen aus dem PDF als Arbeitsauftrag übernehmen.

`/mechanics/momentum` und die deutsche Fassung `/de/mechanics/momentum` verwenden den vorhandenen Seitenrahmen, Suchindex, Sitemap und vier normale Modellkarten (Impulsbilanz, inelastischer Stoss, elastischer Stoss, Raketengleichung). Keine zusätzlichen Varianten oder Sonderfallauswahl.

## Impulsbilanz

Dreizehn manuelle Grössen: m₁, m₂, v₁, v₂, v′₁, v′₂, p₁, p₂, p′₁, p′₂, Δp₁, Δp₂ und erhaltener Gesamtimpuls. Positive konstante Massen, vorzeichenbehaftete Geschwindigkeiten und Impulse auf derselben Achse im selben Inertialsystem. Die Gleichungen gelten für jede Raumkomponente getrennt. Impulserhaltung allein bestimmt nicht beide Endgeschwindigkeiten. Keine automatische Annahme eines elastischen Stosses oder kinetischer Energieerhaltung; die Abbildung auf Skriptseite 49 ist kein zusätzlicher Energieerhaltungsauftrag.

Alle Produkt- und Summenbeziehungen sowie Masseninversen aus der Geschwindigkeitsbilanz sind explizit implementiert. Nullimpuls legt die Geschwindigkeit auf null fest, weil die Masse positiv ist; Impuls und Geschwindigkeit null bestimmen die Masse nicht. Rückstoss aus Ruhe durch Eingabe beider Anfangsgeschwindigkeiten null.

## Raketengleichung

Zwölf manuelle Grössen: Anfangsmasse M₀, aktuelle Masse M, bereits ausgestossene Masse m, relative Ausstossgeschwindigkeit u, v₀, v, Δv, Massenverhältnis q, momentaner positiver Ausstossmassenstrom ṁ, Schub F, Beschleunigung a und frisch ausgestossene Gasgeschwindigkeit im Beobachtersystem.

- M₀ = M + m, q = M₀/M ≥ 1, M₀ ≥ M > 0, m ≥ 0.
- Δv = u ln(q) ≥ 0, u > 0, v = v₀ + Δv.
- F = u ṁ ≥ 0, a = F/M ≥ 0. Der Massenstrom ist momentan; ein konstanter zeitlicher Verlauf wird nicht angenommen.
- v_gas = v − u; v₀, v und v_gas dürfen negativ sein.
- Geradlinige, nichtrelativistische Rakete, konstantes u relativ zur Rakete, ohne äussere Kräfte, Gravitation, Widerstand, Stufentrennung oder Druckschubkorrektur. Keine Brenndauer aus einem einzelnen momentanen Massenstrom erfinden.
- Keine unsichtbare Annahme v₀ = 0. Δv bleibt ohne v₀ bestimmbar; Schub bleibt ohne Massenangaben bestimmbar.
- Erhalten ist der Impuls des Gesamtsystems aus Rakete und sämtlichem Abgas. Der Raketenimpuls selbst ist nicht konstant.
- Fachliche Präzisierung von Skriptgleichung 3.54: q > e bedeutet Δv > u. Daraus folgt v > u nur bei v₀ = 0. Die frisch ausgestossenen Gase fliegen im Beobachtersystem vorwärts genau dann, wenn v > u; relativ zur Rakete strömen sie stets rückwärts.
- Logarithmus nahe q = 1 bei bekannten m/M über `log1p`, inverse ausgestossene Masse über `expm1`. Keine Rundung in Solver oder Diagramm. Numerische Bereichsfehler sichtbar melden.

## Gemeinsamer Vertrag und Grenzen

`physics/mechanics/momentum.ts` enthält reine explizite Regeln und ihre Inversen. Endliche Propagation ergänzt nur zuvor unbekannte Grössen, kein allgemeines CAS. Ungültige Felder bleiben gesperrt. Widersprüche und unphysikalische Lösungen markieren die betroffenen Beziehungen; tatsächlich davon abhängige Rechenschritte werden verworfen. Unabhängige Teilresultate bleiben erhalten. Null durch null wird als unterbestimmt ausgewiesen; weder Nullmasse noch beliebiges u einsetzen. Bei bekannter Null-Verbrennung sind m = Δv = 0 und q = 1 auch ohne absolute Massenskala bestimmbar.

`MomentumCalculator` verwendet gemeinsame Felder, SI-/Präfixparsing, Einheiten, Reset und KaTeX-Ergebnisse. Formeln verwenden gespeicherte validierte Abhängigkeiten des jeweiligen Schritts. Rohfelder werden nie automatisch gefüllt.

`MomentumDiagram` zeichnet schematische Körper beziehungsweise Rakete und Gas. Bekannte Impuls-/Geschwindigkeitspfeile teilen pro Ansicht einen relativen Massstab; Nullwerte erzeugen keine Pfeile. Gas- und Raketengeschwindigkeiten beziehen sich auf dasselbe Beobachtersystem. Der Massenbalken zeigt nur bekannte verbleibende/ausgestossene Anteile. Schub- und Beschleunigungspfeile zeigen ausdrücklich nur Richtungen. Fokus mitsamt Einheitenmenü graut nicht zugehörige Elemente über `--color-diagram-muted` aus. Englisch und Deutsch vollständig pflegen.

Tests: alle expliziten Inversen, sämtliche 12286 nichtleeren Teilmengen eines konsistenten Referenzzustands beider Rechner, Nullfälle, Rückstoss, unterschiedliche Bezugssystemgeschwindigkeiten, ungültige Angaben, Widersprüche, unabhängige Resultate und numerische Grenzen; strikte KaTeX- und Übersetzungsprüfung. Elastische und inelastische Stösse stehen als eigene aufklappbare Karten auf derselben Impulsseite; deren Fachvertrag steht in [COLLISIONS.md](COLLISIONS.md). Ein allgemeiner Vektorrechner, vertikaler Raketenstart und mehrstufige Raketen gehören nicht zu diesen Modellen.
