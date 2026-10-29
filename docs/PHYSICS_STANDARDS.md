# Physikalische und mathematische Standards

## Fachlicher Vertrag

Jedes Modell dokumentiert Grössen und Symbole, Annahmen, Koordinatensystem, Definitionsbereich, Gleichungen, mögliche Lösungszweige, Quellen und Referenzbeispiele. Die Modelle dienen sowohl dem Verständnis als auch einfachen Berechnungen im industriellen Alltag. Ein lernfreundliches Idealmodell darf nicht als universell gültig dargestellt werden. Voraussetzungen, vernachlässigte Effekte und Gültigkeitsgrenzen müssen auch unmittelbar im Bereich «Calculate» erkennbar sein; Ergebnisse dürfen keine höhere Genauigkeit behaupten, als Modell und Eingaben rechtfertigen. Themenübergreifend gleiche Symbole sind keine eindeutigen technischen IDs.

Die fachliche Ausführung besteht aus reinen deterministischen TypeScript-Funktionen. Eingaben und Ausgaben sind typisiert und unabhängig von Browser, Svelte, KaTeX und Visualisierung. Auch bei direktem Funktionsaufruf werden verletzte Definitionsbereiche als fachlicher Fehler behandelt.

## Grössen, Einheiten und Zahlen

Intern SI verwenden. Grössen-IDs, Dimensionen und erlaubte Einheiten werden zentral geführt; öffentliche Rechnergrenzen erhalten Grössenmetadaten, lokale Fachfunktionen dürfen klar benannte Zahlenparameter wie `velocityMps` nutzen. Einheitenkonversion prüft zur Laufzeit die Kompatibilität. Kein vollständiges symbolisches Einheitensystem im MVP.

Skalenfaktoren und Offsets unterscheiden: Celsius zu Kelvin ist keine reine Multiplikation. Temperatur und Temperaturdifferenz sind verschiedene Grössen. Winkel intern in Radiant, Eingabe in Grad mit expliziter Konversion. Dimensionslos bedeutet nicht beliebig austauschbar. Energie und Drehmoment sind trotz gleicher Dimension semantisch getrennt.

Parsing akzeptiert unabhängig von der Seitensprache Dezimalpunkt oder -komma und definierte Exponentenschreibweise. Die Ausgabe verwendet Englisch mit Dezimalpunkt und später Deutsch mit Dezimalkomma, zunächst jeweils ohne Tausendergruppierung. Ein Sprachwechsel formatiert Werte neu, verändert aber weder SI-Wert noch Genauigkeit. Fachfehler und Rechenschritte verwenden sprachneutrale IDs; ihre Erklärungen werden lokalisiert. Keine stillen Teilkonversionen wie `12abc` zu `12`; `NaN`, Unendlich und überlange Eingaben ablehnen. Gruppierungszeichen sind zunächst unzulässig, um Mehrdeutigkeiten zu vermeiden. Betragsschranken müssen pro Modell begründet werden.

IEEE-754-Zahlen sind der Startpunkt. Intern keine Zwischenrundung. Standardausgabe zunächst sechs signifikante Stellen, umschaltbare Präzision später möglich. Dies behauptet keine entsprechende Messgenauigkeit. Signifikante Messstellen und Unsicherheitsfortpflanzung sind eigene spätere Funktionen. Angezeigtes negatives Null bei Rundung als Null normalisieren, ohne den internen Wert zu verändern.

Tests vergleichen mit dimensions- und grössenbezogenen absoluten/relativen Toleranzen, etwa `|Ist − Soll| ≤ atol + rtol · |Soll|`. Kein globales Epsilon für alle Grössen oder Nenner. Exakt null, numerisch nahe null und fachlich vernachlässigbar werden unterschieden. Abbruch- und Stabilitätsgrenzen erhalten Einheiten und Begründungen.

## Konventionen für Mechanik

- Zeitintervalle sind nicht negativ; ein frei gewählter Zeitursprung darf negative Zeitkoordinaten haben.
- Position, Ortsänderung und zurückgelegte Strecke sind verschiedene Grössen. Geschwindigkeit mit Vorzeichen und Geschwindigkeitsbetrag werden getrennt.
- Für vertikale Bewegung zeigt die positive Achse standardmässig nach oben; die Erdbeschleunigung wirkt dann als `a = −g`.
- Schulmodell zunächst mit `g = 9,81 m/s²`, ausdrücklich als angenäherter Modellparameter angezeigt. Abweichende Eingabe ist möglich, wenn der Rechner das anbietet.
- Freier Fall und schiefer Wurf zunächst ohne Luftwiderstand und mit konstanter Erdbeschleunigung. Anfangsbedingungen und Bodenhöhe werden explizit angegeben.
- Gleichmässige Beschleunigung gilt nur für konstantes `a`. Bei `a = 0` wird der lineare Sonderfall behandelt.

## Umstellungen und Lösbarkeit

Jede unterstützte Zielgrösse erhält einen expliziten Modus, statt jeden sichtbaren Wert gleichzeitig frei editierbar zu machen. Genügend bekannte Werte und der Rang der konkreten Gleichungen entscheiden über Lösbarkeit; Anzahl der Felder allein reicht nicht.

Für `Δx = v · Δt`: `Δt = 0` und `Δx ≠ 0` ist unlösbar; `Δt = 0` und `Δx = 0` bestimmt `v` nicht eindeutig. Für quadratische Zeitgleichungen werden alle reellen Zweige bestimmt und anhand der Modellbedingungen, etwa `t ≥ 0` und erster Bodenkontakt, eingeordnet. Negative Diskriminanten ergeben keine reelle Lösung; kleine Rundungsreste dürfen nur mit dokumentierter skalierter Toleranz behandelt werden.

Zu wenige Werte → unvollständig. Widersprüchliche Werte → ungültig mit Konflikthinweis. Keine physikalisch zulässige Lösung → expliziter Status. Mehrere oder unendlich viele Lösungen → als solche benennen, keine erfundene Einzelzahl. Resultate ausserhalb des Modellbereichs werden nicht als gültige Lösung weitergereicht.

## Herkunft und Berechnungsketten

Jeder abgeleitete Wert führt seine Quellen und verwendete Annahmen. Ein Beispiel darf aus `Δx = 120 m` und `Δt = 10 s` zunächst `v = 12 m/s` bestimmen und daraus für ein anderes Zeitintervall eine weitere Ortsänderung berechnen. Der Zeitparameter des Folgeschritts ist eine eigene Eingabe; die Gleichung darf keinen zyklischen Selbstbezug erzeugen.

Werteübernahmen erhalten volle interne Präzision und die ursprüngliche Einheit als Darstellungsinformation. Wird eine Quelle ungültig, sind auch Nachfolger ungültig. Bei eingefrorenen, explizit kopierten Werten muss erkennbar sein, dass keine lebende Verknüpfung besteht. Die erste Version bietet lokale Abhängigkeiten; ein globaler Formelgraph ist kein notwendiger Einstieg.

## Rechenweg und LaTeX

Rechenschritte sind strukturierte Daten: Regel-/Gleichungs-ID, symbolische Umstellung, eingesetzte SI-Werte, Ergebnis, Einheit und Erläuterung. Die UI rendert diese mit KaTeX. Fachfunktionen berechnen Zahlen und keine HTML-Zeichenketten. Der Calculator-Resolver verbindet Resultate mit redaktionell geprüften Schritten; Tests prüfen, dass angezeigte Einsetzungen zum selben Eingabesatz gehören.

Vektoren und Beträge unterscheiden; Einheiten aufrecht setzen, beispielsweise `\mathrm{m\,s^{-1}}`. Variablen erklären und Grössen mit Einheiten angeben. Näherungen mit `\approx` kennzeichnen. Ungültige Formeln beim Build beziehungsweise in Tests erkennen. Es wird keine automatische symbolische Beweisführung versprochen.

## Differential- und Integralrechnung: kontrollierter Ausbau

### Stufe 1 – analytische Modelle

Bekannte Funktionen werden explizit implementiert und hergeleitet. Beispiel: `x(t) = x₀ + v₀t + ½at²`, daraus `v(t) = v₀ + at` und `a(t) = a`. Bestimmte Integration liefert `x(t₁) − x(t₀) = ∫ v(t) dt` über das angegebene Intervall; zur absoluten Position gehört die Anfangsbedingung. Strecke ist dagegen das Integral des Geschwindigkeitsbetrags. Nullstellenwechsel müssen dabei berücksichtigt werden.

### Stufe 2 – numerische bestimmte Integrale und Nullstellen

Erst mit konkretem Thema ergänzen. Empfehlung für glatte Funktionen: adaptive Simpson-Integration mit absoluten und relativen Fehlerschranken, maximaler Rekursion und Auswertungsbudget. Diskontinuitäten und Singularitäten müssen erkannt beziehungsweise durch deklarierte Teilintervalle behandelt werden; kein vorgetäuschtes Ergebnis für divergente Integrale. Nullstellen zunächst über abgesicherte Intervallschachtelung bei stetiger Funktion und geprüftem Vorzeichenwechsel. Dieses Verfahren findet nicht automatisch jede Nullstelle oder berührende Nullstellen.

Rückgabe enthält Näherung, Fehlerschätzung soweit methodisch verfügbar, verwendetes Intervall, Iterationen und Konvergenzstatus. Fehlerschätzungen sind keine garantierten Messunsicherheiten. Grenzwertüberschreitung und Nichtkonvergenz sind reguläre fachliche Ergebnisse.

### Stufe 3 – Differentialgleichungen und freie Funktionen

Erst bei Bedarf, etwa Bewegung mit Widerstand. Methode, Schrittweitenkontrolle, Anfangsbedingungen und Ereigniserkennung werden je Modell spezifiziert. Landungen müssen zwischen Zeitschritten lokalisiert werden; der erste Punkt unter dem Boden ist kein exakter Aufprall. Energie- oder andere Erhaltungsgrössen dienen als Plausibilitätskontrolle, soweit das Modell sie besitzt.

Freie Funktionseingaben benötigen eine begrenzte Parser-Grammatik, erlaubte Funktionen, Komplexitätsgrenzen und definierte Einheiten. Kein JavaScript aus Nutzereingaben und kein allgemeines CAS im MVP. Symbolische und numerische Ergebnisse bleiben sichtbar unterscheidbar.

## Teststandard

Jeder Modus erhält Referenzfälle, Null- und Grenzfälle sowie ungültige Eingaben. Beispiele für den ersten Rechner: `120 m / 10 s = 12 m/s`, `36 km/h = 10 m/s`, negative gerichtete Geschwindigkeit, fehlender Wert, Nulldivision und unterbestimmte Gleichung. Weitere Prüfungen: Einheiten-Rundreise, Hin-/Rückumstellung, dimensionale Konsistenz, Zweige quadratischer Lösungen und Verwerfen abhängiger Werte.

Numerik wird gegen bekannte analytische Integrale/Lösungen und mit engeren Toleranzen geprüft; eine einzelne plausible Kurve genügt nicht. Fachliche Referenzwerte unabhängig von der getesteten Implementierung herleiten. Für Diagramme stimmen markierte Anfangs-/Endpunkte mit Fachresultaten überein. Quellen mit Werk, Ausgabe beziehungsweise Link und Modellbezug je Thema führen; fremde Inhalte nicht ungeprüft übernehmen.
