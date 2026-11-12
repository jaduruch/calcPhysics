# Physikalische und mathematische Standards

## Fachlicher Vertrag

Jedes Modell dokumentiert Grössen und Symbole, Annahmen, Koordinatensystem, Definitionsbereich, Gleichungen, mögliche Lösungszweige, Quellen und Referenzbeispiele. Die Modelle dienen sowohl dem Verständnis als auch einfachen Berechnungen im industriellen Alltag. Ein lernfreundliches Idealmodell darf nicht als universell gültig dargestellt werden. Voraussetzungen, vernachlässigte Effekte und Gültigkeitsgrenzen müssen auch unmittelbar im Bereich «Calculate» erkennbar sein; Ergebnisse dürfen keine höhere Genauigkeit behaupten, als Modell und Eingaben rechtfertigen. Themenübergreifend gleiche Symbole sind keine eindeutigen technischen IDs.

Die fachliche Ausführung besteht aus reinen deterministischen TypeScript-Funktionen. Eingaben und Ausgaben sind typisiert und unabhängig von Browser, Svelte, KaTeX und Visualisierung. Auch bei direktem Funktionsaufruf werden verletzte Definitionsbereiche als fachlicher Fehler behandelt.

## Grössen, Einheiten und Zahlen

Intern SI verwenden. Grössen-IDs, Dimensionen und erlaubte Einheiten werden zentral geführt; öffentliche Rechnergrenzen erhalten Grössenmetadaten, lokale Fachfunktionen dürfen klar benannte Zahlenparameter wie `velocityMps` nutzen. Einheitenkonversion prüft zur Laufzeit die Kompatibilität. Kein vollständiges symbolisches Einheitensystem im MVP.

Skalenfaktoren und Offsets unterscheiden: Celsius zu Kelvin ist keine reine Multiplikation. Temperatur und Temperaturdifferenz sind verschiedene Grössen. Winkel intern in Radiant, Eingabe in Grad mit expliziter Konversion. Dimensionslos bedeutet nicht beliebig austauschbar. Energie und Drehmoment sind trotz gleicher Dimension semantisch getrennt.

Parsing akzeptiert unabhängig von der Seitensprache Dezimalpunkt oder -komma und definierte Exponentenschreibweise. Die Ausgabe verwendet Englisch mit Dezimalpunkt und später Deutsch mit Dezimalkomma, zunächst jeweils ohne Tausendergruppierung. Ein Sprachwechsel formatiert Werte neu, verändert aber weder SI-Wert noch Genauigkeit. Fachfehler und Rechenschritte verwenden sprachneutrale IDs; ihre Erklärungen werden lokalisiert. Keine stillen Teilkonversionen wie `12abc` zu `12`; `NaN`, Unendlich und überlange Eingaben ablehnen. Gruppierungszeichen sind zunächst unzulässig, um Mehrdeutigkeiten zu vermeiden. Betragsschranken müssen pro Modell begründet werden.

IEEE-754-Zahlen sind der Startpunkt. Intern keine Zwischenrundung. Standardausgabe für Uniform Motion drei signifikante Stellen, umschaltbare Präzision später möglich. Dies behauptet keine entsprechende Messgenauigkeit. Signifikante Messstellen und Unsicherheitsfortpflanzung sind eigene spätere Funktionen. Angezeigtes negatives Null bei Rundung als Null normalisieren, ohne den internen Wert zu verändern.

Tests vergleichen mit dimensions- und grössenbezogenen absoluten/relativen Toleranzen, etwa `|Ist − Soll| ≤ atol + rtol · |Soll|`. Kein globales Epsilon für alle Grössen oder Nenner. Exakt null, numerisch nahe null und fachlich vernachlässigbar werden unterschieden. Abbruch- und Stabilitätsgrenzen erhalten Einheiten und Begründungen.

## Konventionen für Mechanik

- Zeitintervalle sind nicht negativ; ein frei gewählter Zeitursprung darf negative Zeitkoordinaten haben.
- Position, Ortsänderung und zurückgelegte Strecke sind verschiedene Grössen. Geschwindigkeit mit Vorzeichen und Geschwindigkeitsbetrag werden getrennt.
- Für vertikale Bewegung zeigt die positive Achse standardmässig nach oben; die Erdbeschleunigung wirkt dann als `a = −g`.
- Schulmodell zunächst mit `g = 9,81 m/s²`, ausdrücklich als angenäherter Modellparameter angezeigt. Abweichende Eingabe ist möglich, wenn der Rechner das anbietet.
- Freier Fall und schiefer Wurf zunächst ohne Luftwiderstand und mit konstanter Erdbeschleunigung. Anfangsbedingungen und Bodenhöhe werden explizit angegeben.
- Gleichmässige Beschleunigung gilt nur für konstantes `a`. Bei `a = 0` wird der lineare Sonderfall behandelt.

## Umstellungen und Lösbarkeit

Jede unterstützte Zielgrösse erhält eine explizit implementierte Umstellung. Im akzeptierten Uniform-Motion-Rechner bleiben alle vier Eingaben editierbar; die fehlende Grösse bestimmt automatisch die Umstellung. Ein zusätzliches Modus-Dropdown ist dafür nicht vorgesehen. Genügend bekannte Werte und der Rang der konkreten Gleichungen entscheiden über Lösbarkeit; Anzahl der Felder allein reicht nicht.

Für `Δx = v · Δt`: `Δt = 0` und `Δx ≠ 0` ist unlösbar; `Δt = 0` und `Δx = 0` bestimmt `v` nicht eindeutig. Für quadratische Zeitgleichungen werden alle reellen Zweige bestimmt und anhand der Modellbedingungen, etwa `t ≥ 0` und erster Bodenkontakt, eingeordnet. Negative Diskriminanten ergeben keine reelle Lösung; kleine Rundungsreste dürfen nur mit dokumentierter skalierter Toleranz behandelt werden.

Zu wenige Werte → unvollständig. Widersprüchliche Werte → ungültig mit Konflikthinweis. Keine physikalisch zulässige Lösung → expliziter Status. Mehrere oder unendlich viele Lösungen → als solche benennen, keine erfundene Einzelzahl. Resultate ausserhalb des Modellbereichs werden nicht als gültige Lösung weitergereicht.

## Herkunft und Berechnungsketten

Jeder abgeleitete Wert führt seine Quellen und verwendete Annahmen. Ein Beispiel darf aus `Δx = 120 m` und `Δt = 10 s` zunächst `v = 12 m/s` bestimmen und daraus für ein anderes Zeitintervall eine weitere Ortsänderung berechnen. Der Zeitparameter des Folgeschritts ist eine eigene Eingabe; die Gleichung darf keinen zyklischen Selbstbezug erzeugen.

Werteübernahmen erhalten volle interne Präzision und die ursprüngliche Einheit als Darstellungsinformation. Wird eine Quelle ungültig, sind auch Nachfolger ungültig. Bei eingefrorenen, explizit kopierten Werten muss erkennbar sein, dass keine lebende Verknüpfung besteht. Die erste Version bietet lokale Abhängigkeiten; ein globaler Formelgraph ist kein notwendiger Einstieg.

## Rechenweg und LaTeX

Für spätere umfangreiche Herleitungen sind strukturierte Rechenschritte vorgesehen: Regel-/Gleichungs-ID, symbolische Umstellung, eingesetzte SI-Werte, Ergebnis, Einheit und Erläuterung. Der aktuelle Pilot erzeugt seine KaTeX-Gleichungen im separaten Calculator-Adapter aus validierten Werten. Die UI rendert diese mit KaTeX. Fachfunktionen berechnen Zahlen und keine HTML-Zeichenketten. Der Calculator-Resolver verbindet Resultate mit redaktionell geprüften Schritten; Tests prüfen, dass angezeigte Einsetzungen zum selben Eingabesatz gehören.

Vektoren und Beträge unterscheiden; Einheiten aufrecht setzen, beispielsweise `\mathrm{m\,s^{-1}}`. Variablen erklären und Grössen mit Einheiten angeben. Gerundete Umrechnungen und Endergebnisse mit `\approx` kennzeichnen; zwischen allgemeiner Formel und Zahleneinsetzung steht gemäss bestätigter UI-Vorgabe stets `=`. Ungültige Formeln beim Build beziehungsweise in Tests erkennen. Es wird keine automatische symbolische Beweisführung versprochen.

Messwerte werden in Zahleneinsetzung und Resultat mit drei signifikanten Stellen und einem passenden Engineering-Präfix dargestellt; diese Darstellung verändert niemals den ungerundeten SI-Wert der Berechnung. Dimensionslose Grössen bleiben präfixfrei, gewählte Nicht-SI-Einheiten erhalten keinen zusätzlichen Präfix. Positive Einzelwerte stehen ohne dekorative Klammern. Klammern werden nur für Vorzeichen, Potenzen, Funktionsargumente oder zur Vermeidung echter Mehrdeutigkeit gesetzt. Implizite Produkte in numerischen Einsetzungen werden mit `\cdot` explizit gemacht.

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

## Globale Einheiten des ersten Rechners

Die gemeinsame Registry definiert m/AE/Lj für Länge, m/s und km/h für Geschwindigkeit sowie s/min/h/d für Zeit. AE wird mit exakt 149 597 870 700 m verwendet; ein Lj mit 299 792 458 m/s × 365,25 × 86 400 s = 9 460 730 472 580 800 m. Ein Tag entspricht hier einer Dauer von exakt 86 400 s, keinem lokalen Kalendertag mit Sommerzeitwechsel. Quellen: [NASA/JPL-Konstanten](https://ssd.jpl.nasa.gov/astro_par.html) und [IAU-Einheitenempfehlungen](https://iauarchive.eso.org/publications/proceedings_rules/units/). Die vom Nutzer gewünschten UI-Kürzel AE und Lj bleiben auch auf der englischen Oberfläche erhalten.

Wird in Uniform Motion die Zeit berechnet, folgt hinter dem Ergebnis mit `=` zusätzlich die Dauer als `Nd, HH:MM:SS.s`; bei null Tagen entfällt `0d,` (beispielsweise `≈ 13.7 ks = 03:48:00.0`). Grundlage ist der ungerundete SI-Zeitwert; nur diese Zusatzanzeige rundet auf Zehntelsekunden mit Übertrag über Minuten, Stunden und Tage. Für andere Zielgrössen erscheint keine Daueranzeige.

Die Zeit-Zusatzanzeige entfällt für t < 60 SI-Sekunden. Ab 60 s erscheint `MM:SS.s`, ab 3600 s `HH:MM:SS.s`, ab einem Tag zusätzlich `Nd,`. Zehntelsekunden werden mit korrektem Übertrag gerundet. Die Schwelle ist unabhängig von der gewählten Ergebniseinheit.

## Inclined Plane (03.11.2026)

Zweite Modellimplementierung: Kräfte an einem Körper auf einer geraden starren Ebene. Eingaben m > 0, 0 <= α <= π/2 rad, μₖ >= 0 (Standard 0), g > 0 (Standard 9.81 m/s²). Winkel werden bei Gradwahl zuerst in rad umgerechnet. Gewicht Fg = mg, Normalkraft FN = mg cosα, Hangkomponente F∥ = mg sinα, Gleitreibung Ff = μₖ FN, resultierende Kraft Fnet = F∥ − Ff und a = g(sinα − μₖ cosα). Positive Richtung hangabwärts. Winkelgrenzen 0 und π/2 werden mit korrekten trigonometrischen Grenzwerten behandelt.

Mit Reibung gilt das Modell für einen bereits hangabwärts gleitenden Körper. Negative Beschleunigung ist Abbremsen, keine Vorhersage über Losrutschen aus Ruhe oder spätere Bewegung bergauf. Haftreibung, Losbrechbedingungen, Rollbewegung, zusätzliche Kräfte und Luftwiderstand sind nicht enthalten. Diese Annahmen bleiben direkt beim Rechner sichtbar. Der aktuelle Solver gibt unabhängig bestimmbare Teilresultate frei und unterstützt inverse Geometrie aus Endgeschwindigkeit; Kraftbeträge benötigen zusätzlich die Masse.

Die Skizze zeigt Gewicht und Normalkraft sowie die Hangkomponente und optional Reibung. Die Hangkomponente ist gestrichelt als Zerlegung des Gewichts gekennzeichnet und darf nicht zusätzlich zur vollständigen Gewichtskraft summiert werden. Kräfte nutzen eine gemeinsame Pfeilskala; bei ungültigen/unvollständigen Eingaben bleibt nur eine schematische Darstellung. Referenz: [OpenStax, University Physics 1, 6.2 Friction](https://openstax.org/books/university-physics-volume-1/pages/6-2-friction).

Die dynamische Skizze übernimmt einen gültigen eingegebenen Winkel bereits ohne vollständiges Ergebnis. In diesem Vorschauzustand liefert derselbe Solver mit Einheitsmasse und Einheitsgravitation die korrekten Kraftverhältnisse; es werden keine tatsächlichen Kraftbeträge behauptet. Alle Pfeile verwenden einen gemeinsamen automatisch angepassten Massstab. Pfeilspitzen enden exakt am Vektorende und schrumpfen bei kleinen Kräften mit. Nullkräfte werden nicht gezeichnet. Senkrechte Ebene: Normalkraft und Reibung exakt null.

### Geometrie und Endgeschwindigkeit

Optional L > 0 und h >= 0, mit h <= L. Beliebige zwei aus α, L und h bestimmen die dritte über h = L sinα. Drei angegebene Werte müssen übereinstimmen (absolute Toleranz 1e-12 im dimensionslosen Verhältnis h/L). Bei α = 0, h = 0 bleibt L unbestimmt. Masse bleibt für den vollständigen Kraftrechner erforderlich. Ergebnisse erscheinen nur im Rechenweg, nicht im leeren Eingabefeld.

Endgeschwindigkeit für Start aus Ruhe: v_end = sqrt(2 a L), konstante Beschleunigung. Mit Gleitreibung wird ein einsetzendes hangabwärtiges Gleiten vorausgesetzt; die Haftreibungsgrenze wird weiterhin nicht bestimmt. Bei a < 0 oder a = 0 mit Reibung wird keine Endgeschwindigkeit ausgegeben, sondern ein Hinweis. Ohne Reibung bei horizontaler Ebene bleibt v_end = 0; dies behauptet kein Erreichen des Endpunkts. Die Endgeschwindigkeit ist auch Eingabe: ohne Reibung h = v_end²/(2g), mit Winkel L = v_end²/[2g(sinα−μₖcosα)], mit Länge α = arctan μₖ + arcsin[v_end²/(2gL√(1+μₖ²))]. Mit v_end und h bei μₖ > 0 folgt L = √{h² + [(h−v_end²/(2g))/μₖ]²}; dazu muss h ≥ v_end²/(2g) gelten. Alle Zusatzangaben werden gegengeprüft. Die Masse blockiert diese Berechnungen nicht. Eine Anfangsgeschwindigkeit wird weiterhin nicht modelliert.


## Gemeinsame Spulenberechnungen

Lineare ideale Spule mit konstanter Permeabilität und homogenem Fluss, ohne Sättigung, Streufluss oder Verluste. N, L, A_L, μᵣ, A, magnetische Weglänge l, bewegte Leiterlänge l_c und Δt sind positiv; W ist nichtnegativ. I, B, Φ, ΔI, ΔΦ, v und beide EMF sind vorzeichenbehaftet. Φ ist Fluss je Windung, NΦ die Flussverkettung. Der Flussorientierung entspricht bei positivem N/L die Stromorientierung. L = A_L N², A_L = μ₀μᵣA/l, Φ = BA = LI/N, ΔΦ = L ΔI/N und W = LI²/2. Die induzierte EMF ist −L ΔI/Δt beziehungsweise −N ΔΦ/Δt; passive Klemmenspannung hat das entgegengesetzte Vorzeichen. Bewegungsinduktion U_mot = B l_c v setzt zueinander senkrechte Richtung von Leiter, Feld und Bewegung voraus. Sie verwendet eigene Leiterlänge und Spannung.

Umstellungen sind explizit. Nullnenner bestimmen keine eindeutige inverse Grösse; mögliche Vorzeichen- und Nullwertwidersprüche werden zusätzlich aus den positiven Faktoren erkannt. Energie legt das Stromvorzeichen nicht fest; eine inverse Stromberechnung benötigt eine Flussorientierung oder den eindeutigen Fall W = 0. Teilresultate sind möglich, manuelle Eingaben bleiben unverändert. Tests prüfen jede unterstützte Umstellung sowie SI-Umrechnungen, Rechenwege, Vorzeichen, Nullfälle, Inkonsistenz und nichtendliche Werte.

## Ideal Gas Law (04.11.2026)

Thermodynamics → Ideal Gases enthält pV = nRT mit p > 0 (absolut), V > 0, n > 0 und T > 0 in Kelvin. R = N_A k_B = 8.31446261815324 J/(mol K) aus den exakten SI-Konstanten. Jede der vier Grössen wird aus den übrigen drei explizit bestimmt; vier Eingaben werden mit einer dimensionslosen logarithmischen Residualtoleranz von 1e-10 auf Konsistenz geprüft. Logarithmische Auswertung vermeidet überlaufende Zwischenprodukte; nicht darstellbare Ergebnisse werden verworfen. SI-Startwerte: Pa, m³, mol und K; zusätzlich bar, atm und L. Celsius und Fahrenheit werden über die gemeinsame affine Einheitenquelle unterstützt und vor der Einsetzung sichtbar nach Kelvin umgerechnet.

Voraussetzungen: Algebra und SI-Umrechnung. Gas im thermodynamischen Gleichgewicht, vernachlässigbares Teilchenvolumen und keine intermolekularen Wechselwirkungen. Reale Gase werden bei niedriger Dichte fern von Kondensation angenähert. Keine Prozessrechnung oder Phasenwechsel. Theoriequelle: [OpenStax, University Physics 2, 2.1](https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas). Referenzfall: 1 mol bei 300 K und 100000 Pa hat V = 0.02494338785445972 m³. Fachtests prüfen alle Umstellungen, Konsistenz, Definitionsbereiche, numerische Grenzen und Einheitenwechsel.

## Quantum: Qubit (04.11.2026)

Modern Physics → Quantum enthält einen reinen einzelnen Qubit, Start |0⟩, mit idealen unitären Gattern. `physics/quantum/qubit.ts` berechnet komplexe Amplituden, Z-Messwahrscheinlichkeiten und Blochkoordinaten aus demselben ungerundeten Zustand. Keine Messung, Dekohärenz, gemischten Zustände oder Verschränkung. Voraussetzungen: komplexe Zahlen, Vektoren und Matrizenmultiplikation.

Gatterauswahl und Konventionen entsprechen `Qubit_Demo/main/portal.html`: X, Y, Z, √X, √Z (= S), H, Rx, Ry, Rz und U(θ, φ, λ). Die UI unterstützt γ ∈ [−2π, 2π] für Rotationen und θ ∈ [0, π], φ/λ ∈ [0, 2π) für U (IBM-Konvention). Leere Felder verwenden explizit angezeigte Standardannahmen γ = θ = π/2 und φ = λ = 0; die Eingabefelder bleiben leer. Winkel intern in rad, optional ° über gemeinsame Felder und Einheitenquellen. Globale Phase bleibt in den Amplituden erhalten und ist auf der Kugel unsichtbar. Bei den Polen ist der Azimut unbestimmt, statt einen physikalischen Phasenwert zu behaupten.

Animation: kontinuierliche unitäre Transformation aus demselben Solver. X/Y/Z/H rotieren um π, √X/√Z um π/2; globale Phasen werden mitgeführt. Bei U werden alle Eulerparameter gemeinsam kontinuierlich skaliert. Dies ist ein illustrativer Weg ohne Aussage über Hardware-Pulsform oder physikalische Dauer. Zwischenzustände bleiben normiert; keine lineare Interpolation durch das Kugelinnere bei antipodischen Endpunkten. Reduzierte Bewegung wendet Gatter sofort an. Animationen enden beim Schliessen der Karte oder Verbergen des Dokuments; beim Entfernen wird requestAnimationFrame aufgeräumt.

Die räumliche Visualisierung verwendet eigene 3D-Koordinaten mit Perspektivprojektion in `visualization/bloch.ts` und SVG in `BlochSphere.svelte`, ohne zusätzliche Bibliothek. Die Kamerabasis ist rechtshändig: Bildschirm-rechts × Bildschirm-oben = zum Betrachter; erst anschliessend wird die SVG-y-Achse invertiert. In der Startansicht zeigt +x nach links unten, +y nach rechts unten und +z nach oben. Gatter und Zustandskoordinaten verwenden x × y = z. Hilfslinien projizieren den Zustandsvektor auf die xy-Ebene; θ wird von +z zum Vektor, φ in der xy-Ebene von +x in Richtung +y gezeichnet. Alle Bögen und Beschriftungen sind räumlich an den aktuellen Zustand gebunden. Am Südpol |1⟩ zeigt ein Halbkreis in der exemplarisch gewählten xz-Ebene θ = 180°. φ bleibt an beiden Polen unbestimmt und wird dort nicht eingezeichnet; am Nordpol entfällt der degenerierte θ-Bogen. Die Kamera lässt sich mit Maus/Touch oder Pfeiltasten drehen, Home setzt sie zurück. Der Browser lädt die interaktive Darstellung separat; Theorie bleibt vorgerendert lesbar. Fachtests vergleichen alle zehn Matrizen mit unabhängigen Referenzmatrizen und prüfen komplexe U-Phasen, Normerhaltung, Gatterfolgen, vollständige und halbe Rotationen, globale Phase, Parametergrenzen und KaTeX. Fachquelle: [IBM Quantum Learning](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits).

## Acoustic Doppler Effect (04.11.2026)

Oscillations & Waves → Doppler Effect enthält das klassische Schallmodell fₒ = fₛ(c + vₒ)/(c − vₛ). Alle Geschwindigkeiten beziehen sich auf ein homogenes ruhendes Medium; Quelle und Beobachter bewegen sich mit konstanten Geschwindigkeiten auf einer Geraden und passieren einander im betrachteten Intervall nicht. Die Quelle liegt in der Skizze links, der Beobachter rechts. Positives vₛ zeigt nach rechts zum Beobachter, positives vₒ nach links zur Quelle; negative Werte bedeuten Entfernung. c > 0, fₛ > 0, fₒ > 0, |vₛ| < c und |vₒ| < c. Kein Wind, keine Reflexion, kein Überschall und keine relativistische Lichtformel. Voraussetzungen: Algebra und Wellenzusammenhang c = fλ.

Explizite Umstellungen: fₛ = fₒ(c − vₛ)/(c + vₒ), vₛ = c − fₛ(c + vₒ)/fₒ und vₒ = fₒ(c − vₛ)/fₛ − c. Drei von vier Angaben bestimmen die fehlende Grösse; stationäre Geschwindigkeiten benötigen eine explizite 0. Vier Angaben werden anhand des dimensionslosen logarithmischen Gleichungsresiduums mit Toleranz 1e-10 auf Konsistenz geprüft. Ein berechneter Wert ausserhalb des Unterschallbereichs ergibt keine Lösung im Modell. Unvollständige, ungültige, widersprüchliche und numerisch nicht darstellbare Ergebnisse werden unterschieden. c ist kein inverses Ziel; ein leeres Feld verwendet die sichtbare Näherung 343 m/s für Luft bei ungefähr 20 °C. SI-Startwerte sind Hz und m/s, alternativ km/h für Geschwindigkeiten, Präfixe nach gemeinsamer Registry.

Die Zusatzresultate sind Wellenlänge zum Beobachter λ = (c − vₛ)/fₛ und Verschiebung Δf = fₒ − fₛ. Ausgabe mit drei signifikanten Stellen, intern ungerundet. Die SVG-Skizze in `DopplerWavefronts.svelte` nutzt `visualization/doppler.ts`: Längen in c/fₛ, Zeit in Quellperioden. Jede Wellenfront behält ihren Emissionsmittelpunkt vₛtₑ und wächst mit Radius c(t − tₑ). Die Kameraskalierung gilt gleich für Positionen und Radien. Das dargestellte Intervall endet vor dem Vorbeifahren, der Loop setzt dann zurück. Ohne gültige Lösung bleibt eine statische, ausdrücklich schematische Vorschau ohne behauptete Messwerte. Start nur per Play; Pause bei geschlossener Karte, verborgenem Dokument, ausserhalb des Sichtbereichs, geänderten Eingaben und reduzierter Bewegung. Animationen werden beim Entfernen aufgeräumt.

Referenz: fₛ = 1000 Hz, c = 340 m/s, vₛ = 20 m/s, vₒ = 10 m/s ergeben fₒ = 1093.75 Hz, λ = 0.32 m und Δf = 93.75 Hz. Tests prüfen alle vier Umstellungen, stationäre und gegenläufige Fälle, gemeinsam bewegte Quelle/Beobachter, Quellen-/Beobachter-Asymmetrie, Sonic-Grenzen, Nulleingaben, Konsistenz, numerische Grenzen, SI-Umrechnung, KaTeX und Emissionsgeometrie. Quelle: [OpenStax, University Physics 1, 17.7 The Doppler Effect](https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect).

## Total Internal Reflection (04.11.2026)

Optics → Total Internal Reflection beschreibt geometrische Strahlwege an einer ebenen Grenzfläche zweier homogener, isotroper, nichtmagnetischer, transparenter Medien. Positive reelle Brechungsindizes n₁ und n₂ für dieselbe Wellenlänge; kein Modell für Absorption, Polarisation, Fresnel-Intensitäten oder das evaneszente Feld. Licht fällt von Medium 1 nach Medium 2 ein. Alle Winkel werden zum Lot gemessen; 0 ≤ θ₁ < π/2 rad. Streifender Einfall bei exakt 90° ist ausserhalb dieses Modells, statt als normaler Grenzflächendurchtritt dargestellt zu werden. Voraussetzungen: Trigonometrie und Arkussinus.

Vorwärtsmodell: n₁ sin θ₁ = n₂ sin θ₂, θᵣ = θ₁. Bei n₁ > n₂ gilt θc = asin(n₂/n₁). Unterhalb θc gibt es einen gebrochenen Strahl, am Grenzwinkel θ₂ = π/2 als tangentialen Grenzstrahl, oberhalb θc Totalreflexion ohne propagierenden Strahl in Medium 2. Kritisch wird nur innerhalb einer relativen Winkel-Rundungszone von 8 × Number.EPSILON × max(θ₁, θc) klassifiziert; dies ist keine Messunsicherheit. Bei n₁ ≤ n₂ existiert kein Totalreflexions-Grenzwinkel in dieser Richtung. Bei n₁ = n₂ läuft der Strahl unverändert weiter, ohne Reflexion in diesem idealen Modell. Nicht darstellbare Indexverhältnisse werden als numerisch ungültig verworfen.

Beide Indizes reichen für den Grenzwinkel; θ₁ ist optional. Ungültige Angaben verwerfen die abhängigen Resultate, fehlende Indizes bleiben unvollständig. Interne Winkel in rad, Startauswahl Grad (°) und dimensionslos 1; rad bleibt im Dropdown. ° werden zuerst nach rad umgerechnet. Winkel und Indizes erhalten keine Engineering-Präfixe; Ausgabe mit drei signifikanten Stellen, Winkelresultate in rad und °. Rechenweg und Skizze verwenden dieselben ungerundeten Ergebnisse.

`visualization/total-reflection.ts` überführt die Solverwinkel in eine gemeinsame 2D-Skizze mit Medium 1 unterhalb der horizontalen Grenze und Medium 2 oberhalb. Einfallender Strahl zur Grenzfläche, reflektierter Strahl bleibt in Medium 1, gebrochener Strahl in Medium 2. Linienfarbe/-stärke ist keine Intensitätsangabe. Ohne vollständige Strahlberechnung bleibt eine klar schematische Vorschau ohne numerische Diagrammwerte; die Winkeleinzeichnungen werden bei sehr kleinen Winkeln aus Platzgründen unterdrückt.

Referenzen: n₁ = 1.5, n₂ = 1 ergeben θc = 41.8103148958°; θ₁ = 30° ergibt θ₂ = 48.5903778907°, θ₁ = 45° ergibt Totalreflexion. n₁ = √2 und n₂ = 1 ergeben θc = 45°. Tests prüfen kritische Nachbarschaft und Rundung, sehr kleine kritische Winkel, normale Inzidenz, gleiche und umgekehrte Indizes, Definitionsbereiche und numerische Grenzen, Einheiten, KaTeX und Strahlrichtung. Fachquelle: [OpenStax, University Physics 3, 1.4 Total Internal Reflection](https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection).

## Erweiterung aus Physik1/Physik2 (10.11.2026)

Die vollständige Auswahl, Quellenzuordnung und korrigierten Notizfehler stehen in [RESOURCE_CONTENT.md](RESOURCE_CONTENT.md). Die 32 neuen Modelle verwenden explizite Inversen und dokumentierte Eingabedomänen. Vorwärtsmodelle (Mischung, Temperatur, Wärmeleitung, Platte, Prisma, Schwebungen) berechnen nur fachlich eindeutige Resultate. Nullnenner unterscheiden unterbestimmte und unlösbare Angaben. Vier beziehungsweise vollständig überbestimmte relationale Angaben werden mit relativem Residuum 1e-10 geprüft; dies ist keine Messunsicherheit.

Absolute Temperatur unterstützt zentral K, °C und °F: K = °C + 273.15 und K = (°F + 459.67)·5/9. Präfixe auf °C/°F sind nicht zugelassen; Temperaturdifferenzen verwenden eine eigene lineare Einheitengruppe. Das bestehende Ideal-Gas-Modell zeigt ebenfalls affine Umrechnungen korrekt. Neue SI-Gruppen: Dichte, Wärme-/spezifische Wärmekapazität, spezifische Energie, Ausdehnungskoeffizient, thermischer Widerstand, Schallintensität und optische Brechkraft.

Vorzeichen: Wärme positiv zum Körper, Expansion und Temperaturintervalle dürfen negativ sein, Spiegel/Linsenbrennweiten sind für sammelnd positiv und zerstreuend negativ. Ein positives Rth liefert P=(T₁−T₂)/Rth; negative Leistung beschreibt die Gegenrichtung. Platte und Prisma gelten für Luft aussen und Index n ≥ 1, ohne Absorption oder Dispersion. Pfeifen und Saiten berechnen Grundmoden ohne Endkorrektur, Dämpfung oder Biegesteifigkeit. Die Festkörperausdehnung ist erster Ordnung und verlangt kleine relative Änderungen. Die Solver erzwingen positive Endgrössen, ohne eine willkürliche lineare Genauigkeitsgrenze zu erfinden.

## Kinematics: konstante Beschleunigung und Wurf

- `accelerated-motion.ts`: sechs Grössen s₀, s, v₀, v₁, a, t mit s = s₀ + v₀t + ½at² und v₁ = v₀ + at. Alle Orte, Geschwindigkeiten und Beschleunigungen sind gerichtet; t ≥ 0. Das UI-Feld v₁ wird intern als `v` geführt. Vier unabhängige Angaben bestimmen die fehlenden Grössen. Bei drei Angaben ohne s₀ gilt s₀ = 0. Sind s₀ und v₀ leer, genügen zwei Angaben aus s, v₁, a, t für die Annahme beider Anfangswerte als null. Die Felder bleiben leer und markieren die Annahme; Nullterme entfallen im Rechenweg. Bei drei Angaben s, a, t wird v₀ weiterhin berechnet, nicht vorausgesetzt.
- Alle Formelfamilien aus dem privaten Formelbuch, S. 49, sind als explizite Relationen und Inversen enthalten: Ort/Zeit, Geschwindigkeitsänderung, mittlere Geschwindigkeit und zeitfreie Energiebeziehung v₁² − v₀² = 2aΔs. Das s der Quelle wird als Δs = s − s₀ interpretiert. Quotienten benötigen nichtverschwindende Nenner; Nullnenner unterscheiden unbestimmte und unmögliche Fälle. Quadratwurzeln prüfen den Definitionsbereich und beide Geschwindigkeitsvorzeichen; nur mit t ≥ 0 verträgliche Lösungen bleiben erhalten. Zusätzliche Eingaben werden mit relativem Residuum 1e-10 auf Konsistenz geprüft, ohne sie zu überschreiben. Diese Toleranz beschreibt keine Messunsicherheit. Rechner, Rechenweg und Diagramme nutzen denselben validierten Zustand.
- Die quadratische Zeitinversion normalisiert Koeffizienten, nutzt die stabile q-Formel und behält alle verschiedenen nichtnegativen Wurzeln. Nur negative Diskriminanten innerhalb 8ε·(b² + |4ac|) werden als Rundungsrest auf null gesetzt. Unterlauf der normierten Koeffizienten/Produkte und nichtendliche Ergebnisse werden als numerischer Fehler ausgegeben. Referenz: s₀ = 10 m, v₀ = 2 m/s, a = 3 m/s², t = 4 s → s = 42 m, v = 14 m/s. s₀ = 0, v₀ = 20 m/s, a = −10 m/s², s = 15 m → t = 1 s und 3 s.
- `projectiles.ts`, vertikaler Wurf: y nach oben, a = −g, y₀ ≥ 0, g > 0. v₀ darf negativ sein. Flug endet beim ersten zukünftigen Bodenkontakt y = 0; beim Aufwärtswurf vom Boden zählt t = 0 nicht als Landung. Vom Boden bei v₀ ≤ 0 gilt t_f = 0. Maximum nach Start: t_peak = max(0, v₀/g). Fehlendes y₀ setzt 0 m, fehlendes g setzt 9.81 m/s² voraus. Referenz v₀ = 10 m/s, g = 10 m/s², y₀ = 0 → t_f = 2 s, y_peak = 5 m, v_impact = −10 m/s.
- Horizontaler Wurf: x₀ = 0, y₀ = h ≥ 0, v_y0 = 0. t_f = √(2h/g), R = vₓt_f, v_y,impact = −gt_f. R ist die vorzeichenbehaftete horizontale Verschiebung. vₓ = 0 ist ein senkrechter Fall, h = 0 ein Nullintervall. Referenz h = 20 m, vₓ = 5 m/s, g = 10 m/s² → t_f = 2 s, R = 10 m, v_y,impact = −20 m/s.
- Beide Würfe sind Punktmassenmodelle ohne Luftwiderstand mit konstantem g und ebenem Boden; kein Rückprall, keine Fortsetzung unter Boden. `visualization/kinematics.ts` verwendet `motionAt` desselben Solvers und die validierten Endwerte, einschliesslich exaktem y = 0 am Boden. Diagramme enthalten den Scheitelpunkt und bleiben bei t = 0 echte Nullintervalle.

Quellen: [OpenStax – Motion with Constant Acceleration](https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration), [Projectile Motion](https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion).

## Schiefer Wurf (11.11.2026)

`solveObliqueThrow` in `projectiles.ts` zerlegt v₀ ≥ 0 mit −π ≤ α ≤ π in vₓ = v₀ cos α und vᵧ₀ = v₀ sin α. α wird gegen den Uhrzeigersinn ab +x gemessen. y₀ ≥ 0 (leer: 0 m), g > 0 (leer: 9.81 m/s²). Keine Luftreibung, x₀ = 0, Boden y = 0. Die stabile Zeit- und Scheitelberechnung verwendet denselben vertikalen Solver wie der senkrechte Wurf. Exakte Achsenwinkel erzeugen exakt verschwindende Komponenten; kleine benachbarte Winkel werden nicht auf null geklemmt.

Ausgaben: Geschwindigkeitskomponenten, Flugzeit, Zeit und Höhe des höchsten Punktes nach Abwurf, vorzeichenbehaftete horizontale Verschiebung sowie vertikale und gesamte Aufprallgeschwindigkeit. Abwurf vom Boden mit vᵧ₀ ≤ 0 hat Flugdauer null; senkrechter Wurf hat R = 0. Winkel starten in rad und können in ° umgerechnet werden. Die vier Diagramme y(x), x(t), y(t), vᵧ(t) verwenden dieselben ungerundeten Daten und enden beim ersten Bodenkontakt. Referenz: v₀ = 20 m/s, α = π/4, y₀ = 0, g = 10 m/s² → t_f = 2√2 s, R = 40 m, y_peak = 10 m, v_impact = 20 m/s.

Quelle: [OpenStax – Projectile Motion](https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion).

## Vollständiges Physikkapitel des Formelbuchs

Die 138 ergänzten Beziehungen und 496 expliziten Inversen verwenden SI und deklarierte Domains. Der [seitenweise Fachvertrag](FORMULA_BOOK.md) dokumentiert jede Modellzuordnung und alle Quellkorrekturen. Physikalische Konstanten bleiben fest, g ist in den ergänzten Beziehungen eine vollständig inverse Eingabe. Geschwindigkeit kann je Modell eine signierte Komponente oder ein nichtnegativer Betrag sein; dies ist ausdrücklich beschriftet. Mehrere zulässige diskrete Lösungen werden vollständig ausgegeben; 0/0 wird nicht als einzelner Zahlenwert interpretiert. Temperaturumrechnung umfasst K, °C, °F, °Ra und °Ré mit exakten Offsets und positivem bzw. null absolutem Temperaturbereich.

Dynamics bündelt die bestehenden 14 Definitionen in vier Karten; die zugrunde liegenden expliziten Inversen bleiben erhalten. Geometrie allein und Kraftgrössen allein können Teilresultate liefern. Ohne Masse bleibt die Kraftzeichnung schematisch, während ein bekannter oder berechneter Winkel bereits übernommen wird.

Die Gruppierung wird auf vollständige, eindeutige Erreichbarkeit aller ursprünglichen Definitionen und unveränderte Solver-/Theoriedaten geprüft. Fachtests decken massenfreie Geometrie, Geschwindigkeits-Inversen, überbestimmte Widersprüche, Reibungsgleichgewicht, ungültige Eingaben und SI-Konversionen ab. Browserprüfungen berücksichtigen Variantenwechsel, erhaltene Eingaben, aktive Theorie, Tastatur/Touch, beide Themes, Laptop/Mobil und Deutsch.

## Keplersche Gesetze

Mechanics → Kepler’s Laws umfasst inverse Ellipsengeometrie, Flächensatz und Umlaufzeit im gebundenen Newtonschen Zweikörperproblem. a > 0, 0 ≤ e < 1, T > 0 und M_tot > 0; a bezeichnet die Halbachse der Relativbahn und M_tot beide Massen. Der Flächensatz ist auf den Brennpunkt bezogen. Die Desmos-inspirierte Kegelschnittkonstruktion und die physikalische Bahnebene werden ausdrücklich unterschieden. Der Zeitregler löst M = E−e sin E statt eine konstante Winkelgeschwindigkeit anzunehmen. Vollständige Voraussetzungen, Geometrie, Referenzen und Prüfvertrag: [KEPLER.md](KEPLER.md).
