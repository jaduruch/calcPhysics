# Keplersche Gesetze

Stand: 14.11.2026. Unter Mechanics → Kepler’s Laws (`/mechanics/keplers-laws`, Deutsch unter `/de/mechanics/keplers-laws`) stehen drei Modellkarten im gemeinsamen Seitenstandard.

## Rechner und Voraussetzungen

1. **First Law — Elliptical Orbits**: Ein kombinierter Rechner mit 15 Eingaben: a, b, ε, c, p, r_p, r_a, A, X, Y, x, y, r, φ und z. Alle Theoriebeziehungen sind zugänglich, einschliesslich kartesischer Ellipse, Polargleichung, Koordinatenverschiebung und Kegel-/Ebenenschnitt. Jede unabhängige Kombination aus zwei der acht Ellipsenkenngrössen bestimmt die gesamte Geometrie; ε = c = 0 allein bestimmt beim Kreis keine Länge. Punkte können bei fehlenden Koordinaten mehrere Lösungen besitzen. X = x + c, Y = y; Periapsis auf +x, positiver oberer Kegel z = r. φ ist modulo 2π gleichwertig. Keine Winkel-/Längenvorgaben in den Rohfeldern. Der explizite Solver `physics/mechanics/kepler-ellipse.ts` berechnet unabhängige Teilgrössen, prüft ursprüngliche Modellgleichungen und erhält zulässige Vorzeichen-/Winkelzweige. Widersprüchliche Punktangaben sperren die Punktdarstellung; unabhängig gültige Ellipsengeometrie bleibt erhalten. Numerisch nicht darstellbare Flächen sperren keine endlichen Längenresultate. Eine einzelne Ellipsenkenngrösse zusammen mit beiden Koordinaten eines Bahnpunkts wird ebenfalls invers ausgewertet; dabei können mehrere Ellipsenformen zulässig sein. Die Flächen-/Punktbeziehung sowie Peri-/Apoapsis plus Mittelpunktkoordinaten nutzen explizite, festgelegte Gleichungen mit monotonen Teilintervallen. `root` im Rechenweg bezeichnet deren numerisch bestimmte Nullstelle im angegebenen Bereich; bei mehreren Nullstellen wird der Zweig nummeriert. Keine allgemeine Gleichungsinterpretation. Der bisherige Dreigrössen-Solver bleibt als interne Referenz erhalten; die Oberfläche verwendet ausschliesslich den kombinierten Rechner.
2. **Second Law — Equal Areas in Equal Times**: Jede der vier Grössen A₁, t₁, A₂ und t₂ ist aus den übrigen drei berechenbar. Alle sind positiv. Flächengeschwindigkeit A₁/t₁ = A₂/t₂ = ℓ/2, wobei ℓ der spezifische Drehimpuls ist. Der Flächensatz gilt bezüglich des Brennpunkts, nicht bezüglich des Ellipsenmittelpunkts.
3. **Third Law — Orbital Period**: Ein kombinierter Rechner mit neun Eingaben: T₁, a₁, T₂, a₂, M_tot, M, m, q_T = T₂/T₁ und q_a = a₂/a₁. Die Umlaufzeit-/Halbachsenbeziehung ist für beide Bahnen vollständig invers verfügbar, ebenso der direkte Vergleich T₂ = T₁(a₂/a₁)^(3/2), die beiden Verhältnisse und M_tot = M + m. G = 6.67430 × 10⁻¹¹ m³/(kg s²) bleibt eine feste Modellkonstante, kein Eingabefeld. Beide verglichenen Bahnen müssen dieselbe Gesamtmasse haben. a₁/a₂ bezeichnen jeweils die grosse Halbachse der Relativbahn. Keine fehlende Begleitmasse als null voraussetzen. Aus Perioden beziehungsweise Halbachsen allein können bereits Verhältnisse bestimmt werden; Massen werden dafür nicht benötigt. Ein ungültiges Gesamtmassenfeld sperrt die direkte Beziehung mit gültigen Einzelmassen nicht. Widersprüchliche Einzelmassen sperren keine unabhängig gültigen Bahnresultate. Die Darstellung zeigt T ∝ a^(3/2) normiert auf die grössere Referenzbahn; eine bekannte Massenaufteilung wird proportional gezeigt. Rechenlogik: `physics/mechanics/kepler-period.ts`; UI: `KeplerPeriodCalculator`. Der bisherige Dreigrössen-Solver bleibt eine interne Referenz.

Die Modelle beschreiben gebundene Newtonsche Zweikörperbewegung ohne Störungen oder relativistische Korrekturen. Parabeln ε = 1 und Hyperbeln ε > 1 sind nicht Teil dieses Kapitels. Fehlende/ungültige/widersprüchliche Eingaben liefern keine veralteten Ergebnisse. Nur manuelle Rohwerte stehen in den Feldern; SI-Konversion und drei signifikante Anzeigestellen bleiben zentral.

## Übernommene Desmos-Konstruktion

Das vom Nutzer selbst erstellte Modell Elipse3d wurde anhand seines öffentlich ausgelieferten Gleichungszustands geprüft. Es verwendet

- r₁(φ) = p/(1+ε cos φ), p = 3.15, ε = 0.533,
- die Orientierung (x,y) = (r cos φ, r sin φ),
- den Doppelkegel x²+y²=z² und die Ebene z=−εx+p.

Die eigene SVG-Darstellung übernimmt diese Geometrie und Orientierung mit Exzentrizität ε. Der anziehende Brennpunkt ist (0,0), der Ellipsenmittelpunkt (−aε,0), der zweite Brennpunkt (−2aε,0); Periapsis liegt auf +x. Der Kreis ist ebenfalls korrekt enthalten. Der Schnitt auf der schrägen Ebene ist eine **Konstruktion**, deren horizontale Projektion die Polargleichung erfüllt; die dargestellte Keplerbahn bewegt sich nicht über den Kegel. Diese Unterscheidung steht auch in der Oberfläche.

Ein aus Eingaben bestimmter Bahnpunkt steuert die Grafik und ersetzt den freien Phasenregler; bei mehreren Punktlösungen wählt die gemeinsame Lösungsauswahl die Darstellung. Ein bekannter Polarwinkel wirkt auch auf eine ausdrücklich schematische Vorschau ohne bekannten Ellipsenmassstab. Ohne bestimmte Punktlage bleibt der Phasenregler verfügbar. Eingabefokus einschliesslich Einheitenmenü hebt Punkt-/Koordinatenelemente beziehungsweise Ellipsenform hervor; nicht zugehörige Elemente verwenden `--color-diagram-muted`.

Die erste Karte bietet eine per Maus, Touch und Pfeiltasten drehbare Konstruktion sowie eine ebene Bahnansicht. Home und Reset view setzen die Kamera zurück. Gültige Ellipsenwerte steuern die Form; ein gültiges ε wirkt bereits vor vollständigen Eingaben auf die ausdrücklich schematische Vorschau. Die Zeichnung ist auf a normiert, ihre Grösse ist keine numerische Koordinatenskala. Das Desmos-Modell stammt vom Nutzer und wird in der Oberfläche nicht als externe Quelle verlinkt. Es gibt kein externes Skript, iframe, 3D-Paket oder stilles Laden von Desmos beim Seitenaufruf.

Der Phasenregler verwendet gleichmässige Zeit t/T. Die Keplergleichung M = E−e sin E wird mit einer monotonen Klammerung gelöst, sodass die Geschwindigkeit am Perizentrum grösser ist. Die zweite Karte zeigt zwei Sektoren nahe Peri-/Apoapsis; ihre Winkel werden über M und E bestimmt. Bei gültigen Rechnerwerten sind die gezeichneten Flächen im Verhältnis A₁:A₂ skaliert, die Bahngrösse und Exzentrizität bleiben dafür schematisch. Kein automatischer Animationsstart; reduzierte Bewegung wird daher nicht umgangen.

## Änderungsstellen und Prüfungen

- `content/kepler.ts`: typisierte Rechner, zusätzliche Theorie, Variablen und Quellen.
- `physics/mechanics/kepler.ts`: SI-Inversen, Ellipsengeometrie, Umlaufzeiten und Keplergleichung.
- `visualization/kepler.ts`: normierte Kegel-/Ebenen-/Bahngeometrie und Kameraprojektion.
- `KeplerDiagram.svelte`: interaktive SVG-Ansicht, Phasenregler und Desmos-Link.
- `ResourceCalculator` nutzt diese Diagramme beim ersten und zweiten Gesetz. Felder, Einheiten, Reset und Rechenwege bleiben gemeinsame Komponenten. Das dritte Gesetz benötigt keine frei angenommene Ellipsengeometrie.

Tests prüfen alle zehn inversen Zielgrössen und KaTeX-Rechenwege, den Kreis, ausgeschlossene Exzentrizitäten, Widersprüche, den Erde–Sonne-Periodenwert, Grössen-/Massenskalierung, die Gleichungen von Kegel und Ebene, die Brennpunktdefinition, die Keplergleichung auch nahe ε = 1 sowie die schnellere Bewegung nahe Periapsis. Browserprüfung: drei Karten, ungültig gewordene Ergebnisse, leere Zielfelder, Kameratastatur/Home, Phasenregler, entfernte Originalverknüpfung, Flächensektoren, Deutsch, Laptop/Mobil und beide Themes.

## Öffentliche Fachreferenzen

- [OpenStax — University Physics 1, 13.5 Kepler’s Laws](https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion): Ellipsen, Flächensatz, Zweikörperbezug und Umlaufzeit.
- [NASA Science — Orbits and Kepler’s Laws](https://science.nasa.gov/solar-system/orbits-and-keplers-laws/): Einordnung der drei Gesetze.
- Vom Nutzer erstelltes Desmos-Modell Elipse3d: beauftragte Kegel-/Ebenenkonstruktion. Kein öffentlicher Quellenlink in der Oberfläche.

## Überarbeitete Darstellung vom 14.11.2026

Das aktualisierte Nutzermodell orientiert die Periapsis auf +x. Es gelten x = r cos φ, y = r sin φ, z = −εx + p, X = x + aε und der zweite Brennpunkt (−2aε,0). Diese Konvention gilt gleichzeitig für Solver, Theorie, Inversen und Grafik. Die sichtbare Exzentrizität heisst überall ε (`\varepsilon`); der interne stabile Schlüssel `e` bleibt erhalten.

Die Grafik bietet zusätzlich zwei zeitlich getrennte Punkte P₀/P₁, Fahrstrahlen und die während Δt überstrichene Fläche. t₀ = t₁ − Δt; auch ein Intervall über die Periapsis beziehungsweise über die Periodengrenze bleibt korrekt. Bei Δt = 0 wird keine Fläche erfunden, bei Δt/T = 1 wird die gesamte Ellipse überstrichen. Die Steuerung verwendet t₁/T und Δt/T sowie M/E/φ als Zustandsanzeigen. Die in Desmos verwendete Gleichung T = 2πa^(3/2) setzt normierte Gravitationsparameter voraus; calcPhysics übernimmt deshalb keine absolute Umlaufzeit aus der Ellipsengeometrie. Dafür bleibt das dritte Keplersche Gesetz zuständig.

Die optionale Animation startet nur über die Schaltfläche, pausiert bei einem durch Eingaben bestimmten Punkt, beim Schliessen der Grafik und bei Hintergrund-Tabs. Reduzierte Bewegung deaktiviert die Animation; Zeit-/Intervallregler und Darstellung bleiben verfügbar. Der feste Eingabepunkt wird nicht von der Animation überschrieben. Die monotone Lösung der Keplergleichung bleibt gegenüber einer festen Zahl Newton-Schritte auch bei grosser Exzentrizität stabil. Kein Desmos-Link, keine externe Laufzeit und kein eingebettetes Widget.
