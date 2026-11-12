# Keplersche Gesetze

Stand: 12.11.2026. Unter Mechanics → Kepler’s Laws (`/mechanics/keplers-laws`, Deutsch unter `/de/mechanics/keplers-laws`) stehen drei Modellkarten im gemeinsamen Seitenstandard.

## Rechner und Voraussetzungen

1. **First Law — Elliptical Orbits**: Zwei Werte aus a, b und e bestimmen den dritten. a ≥ b > 0, 0 ≤ e < 1; der Kreis e = 0 ist enthalten. Abgeleitet: Brennpunktabstand c = ae, Halbparameter p = a(1−e²), Peri-/Apoapsisabstand a(1∓e) und Fläche πab. Die kartesischen Koordinaten X/Y sind auf den Ellipsenmittelpunkt bezogen, die Polargleichung r = p/(1+e cos φ) auf den anziehenden Brennpunkt.
2. **Second Law — Equal Areas in Equal Times**: Jede der vier Grössen A₁, t₁, A₂ und t₂ ist aus den übrigen drei berechenbar. Alle sind positiv. Flächengeschwindigkeit A₁/t₁ = A₂/t₂ = ℓ/2, wobei ℓ der spezifische Drehimpuls ist. Der Flächensatz gilt bezüglich des Brennpunkts, nicht bezüglich des Ellipsenmittelpunkts.
3. **Third Law — Orbital Period**: T, a und M_tot sind vollständig invers über T² = 4π²a³/(G M_tot), G = 6.67430 × 10⁻¹¹ m³/(kg s²). M_tot ist die Summe beider Massen und a die grosse Halbachse ihrer **Relativbahn**. Für die individuelle baryzentrische Bahn einer Masse darf deren Halbachse nicht ohne entsprechende Umrechnung eingesetzt werden. Bei m ≪ M ist die zentrale Masse eine gute Näherung für die Gesamtmasse.

Die Modelle beschreiben gebundene Newtonsche Zweikörperbewegung ohne Störungen oder relativistische Korrekturen. Parabeln e = 1 und Hyperbeln e > 1 sind nicht Teil dieses Kapitels. Fehlende/ungültige/widersprüchliche Eingaben liefern keine veralteten Ergebnisse. Nur manuelle Rohwerte stehen in den Feldern; SI-Konversion und drei signifikante Anzeigestellen bleiben zentral.

## Übernommene Desmos-Konstruktion

Das öffentlich geteilte Modell [Elipse3d](https://www.desmos.com/3d/4tmaynvat8) wurde anhand seines öffentlich ausgelieferten Gleichungszustands geprüft. Es verwendet

- r₁(φ) = p/(1+ε cos φ), p = 2.4, ε = 0.624,
- die Orientierung (x,y) = (−r cos φ, r sin φ),
- den Doppelkegel x²+y²=z² und die Ebene z=εx+p.

Die eigene SVG-Darstellung übernimmt diese Geometrie und Orientierung mit e = ε. Der anziehende Brennpunkt ist (0,0), der Ellipsenmittelpunkt (ae,0), der zweite Brennpunkt (2ae,0); Periapsis liegt auf −x. Der Kreis ist ebenfalls korrekt enthalten. Der Schnitt auf der schrägen Ebene ist eine **Konstruktion**, deren horizontale Projektion die Polargleichung erfüllt; die dargestellte Keplerbahn bewegt sich nicht über den Kegel. Diese Unterscheidung steht auch in der Oberfläche.

Die erste Karte bietet eine per Maus, Touch und Pfeiltasten drehbare Konstruktion sowie eine ebene Bahnansicht. Home und Reset view setzen die Kamera zurück. Gültige Ellipsenwerte steuern die Form; ein gültiges e wirkt bereits vor vollständigen Eingaben auf die ausdrücklich schematische Vorschau. Die Zeichnung ist auf a normiert, ihre Grösse ist keine numerische Koordinatenskala. Das Desmos-Original bleibt verlinkt. Es gibt kein externes Skript, iframe, 3D-Paket oder stilles Laden von Desmos beim Seitenaufruf.

Der Phasenregler verwendet gleichmässige Zeit t/T. Die Keplergleichung M = E−e sin E wird mit einer monotonen Klammerung gelöst, sodass die Geschwindigkeit am Perizentrum grösser ist. Die zweite Karte zeigt zwei Sektoren nahe Peri-/Apoapsis; ihre Winkel werden über M und E bestimmt. Bei gültigen Rechnerwerten sind die gezeichneten Flächen im Verhältnis A₁:A₂ skaliert, die Bahngrösse und Exzentrizität bleiben dafür schematisch. Kein automatischer Animationsstart; reduzierte Bewegung wird daher nicht umgangen.

## Änderungsstellen und Prüfungen

- `content/kepler.ts`: typisierte Rechner, zusätzliche Theorie, Variablen und Quellen.
- `physics/mechanics/kepler.ts`: SI-Inversen, Ellipsengeometrie, Umlaufzeiten und Keplergleichung.
- `visualization/kepler.ts`: normierte Kegel-/Ebenen-/Bahngeometrie und Kameraprojektion.
- `KeplerDiagram.svelte`: interaktive SVG-Ansicht, Phasenregler und Desmos-Link.
- `ResourceCalculator` nutzt diese Diagramme beim ersten und zweiten Gesetz. Felder, Einheiten, Reset und Rechenwege bleiben gemeinsame Komponenten. Das dritte Gesetz benötigt keine frei angenommene Ellipsengeometrie.

Tests prüfen alle zehn inversen Zielgrössen und KaTeX-Rechenwege, den Kreis, ausgeschlossene Exzentrizitäten, Widersprüche, den Erde–Sonne-Periodenwert, Grössen-/Massenskalierung, die Gleichungen von Kegel und Ebene, die Brennpunktdefinition, die Keplergleichung auch nahe e = 1 sowie die schnellere Bewegung nahe Periapsis. Browserprüfung: drei Karten, ungültig gewordene Ergebnisse, leere Zielfelder, Kameratastatur/Home, Phasenregler, externe Originalverknüpfung, Flächensektoren, Deutsch, Laptop/Mobil und beide Themes.

## Öffentliche Fachreferenzen

- [OpenStax — University Physics 1, 13.5 Kepler’s Laws](https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion): Ellipsen, Flächensatz, Zweikörperbezug und Umlaufzeit.
- [NASA Science — Orbits and Kepler’s Laws](https://science.nasa.gov/solar-system/orbits-and-keplers-laws/): Einordnung der drei Gesetze.
- [Original Desmos — Elipse3d](https://www.desmos.com/3d/4tmaynvat8): beauftragte Kegel-/Ebenenkonstruktion.
