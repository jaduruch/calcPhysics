# Formelbuch: vollständiges Physikkapitel

Stand: 11.11.2026. Auftrag: alle Formeln im Kapitel **Physik, S. 44–72**, fachlich prüfen, den entsprechenden Themen zuordnen und nach sämtlichen variablen Grössen auflösen. S. 73 beginnt das separate Kapitel Elektrotechnik / Elektronik und gehört nicht zu diesem Auftrag.

Die Seiten wurden lokal als PDF-Text erschlossen und die Formelabbildungen visuell geprüft. Die privaten PDFs, Seitenbilder und Auslesedateien bleiben ausserhalb des Repositories. Es werden keine Scans, Stoffwerttabellen oder längeren Quellentexte veröffentlicht.

## Ergebnis und Bedienung

**138 zusätzliche Rechnerbeziehungen mit 496 expliziten inversen Zielgrössen** ergänzen die vorhandenen Modelle. Gleichwertige Schreibweisen verwenden dieselben Beziehungen; bereits vollständig inverse Rechner wie gleichförmige/gleichmässig beschleunigte Bewegung, Druck, hydraulische Presse, Dichte, Boyle–Mariotte, Wärmemenge, Wärmeausdehnung, Brechkraft und Brechzahl bleiben erhalten. Neue Unterthemen: Rotation; Work, Energy & Power; Light & Photometry; Fiber Optics. Die übrigen Modelle liegen unter den vorhandenen Themen.

Jede neue Beziehung besitzt für **jedes angezeigte Feld** eine explizite TypeScript-Umstellung und eine passende KaTeX-Gleichung. Eine Grösse bleibt leer, die übrigen werden eingegeben; Ergebnisse werden nicht in Eingabefelder geschrieben. G, R, c₀ und π sind Konstanten, keine unbekannten Material-/Messgrössen. g ist in den neuen Beziehungen dagegen eine auflösbare Eingabe ohne stillen Standardwert.

Nicht eindeutige Umstellungen liefern sämtliche zulässigen diskreten Lösungen: beide Zeitpunkte eines Höhenwerts, beide Vorzeichen einer Winkelgeschwindigkeit, komplementäre Wurfwinkel und ggf. zwei Winkel beim Heben auf einer rauen Ebene. Definitionsbereiche stehen an jeder Karte. Spezielle Identitäten wie 0 = 0 führen zu „underdetermined“, Widersprüche und ausgeschlossene Definitionsbereiche zu einer eigenen Fehlermeldung. Es gibt keinen Anspruch, bei mathematisch unmöglicher oder nicht eindeutiger Datenlage einen einzigen Wert zu erfinden.

Die fünf Temperaturskalen K, °C, °F, °Ra und °Ré verwenden die zentrale affine Einheitenregistry. Jeder der 25 Skalenwechsel ist möglich; Kelvin erscheint als SI-Konversion. Reine Einheiten-/Symboltabellen, Materialtabellen, das elektromagnetische Spektrum, Faserbauarten, Dispersion und Phasenzustände sind keine zusätzlichen unabhängigen Rechnergleichungen.

## Seitenweise Abdeckung

| Quellseite | Abdeckung |
|---|---|
| 44–45 | Grössen-/SI-/Präfixtabellen: gemeinsame Einheitenregistry und vorhandene SI-Referenz; keine eigenständigen Modellgleichungen. |
| 46–47 | Materialtabellen: keine Umstellungsformeln; keine kopierte Stoffwertdatenbank. |
| 48 | Physikalische Konstanten: vorhandene SI-Referenz; gleichförmige Bewegung: bestehender Uniform-Motion-Rechner, alle vier Zielgrössen. Der Winkel einer gezeichneten Kurve ist ohne Achsenmassstab keine weitere physikalische Messgrösse. |
| 49 | Bestehender Sechsgrössen-Solver Uniformly Accelerated Motion: sämtliche Formelketten mit und ohne Anfangsgeschwindigkeit, inklusive negativer Geschwindigkeitszweige, Zeiten und degenerierter Fälle. |
| 50–51 | Rotation: Winkel/Zeit/Bogen/Revolutionen/Frequenz/Periode/Tangentialgeschwindigkeit; konstante Winkelbeschleunigung mit und ohne Anfangswert, Durchschnitts- und Energiebeziehung. |
| 51–52 | Freier Fall, vertikaler, horizontaler und schräger Wurf: bestehende animierte Modelle plus inverse Positions-, Geschwindigkeits-, Höhen-, Richtungs-, Bahn-, Komponenten-, Scheitel- und Reichweitenbeziehungen. Vorzeichenkonventionen stehen direkt an den Karten. |
| 53–54 | Newton, Gewicht, orthogonale Kräfte, Gravitation, kinetische Reibung, Normalkraft, Hangkraft, Geometrie, Heben/Senken, Beschleunigung und Arbeit. |
| 55 | Feste/lose Rolle und allgemeiner Flaschenzug als F = F_G/n und s = nh, n = 1 bzw. 2 für die Spezialfälle. Hubarbeit F_G h wird durch Potential Energy from Weight abgedeckt. n zählt tragende Seilabschnitte. |
| 56 | Arbeit, potentielle/kinetische Energie und alle Leistungsgleichungen W/t, Fv, Fs/t, Mω und UI. |
| 57 | Bestehende Druck-/Boyle-/pV=nRT-Modelle plus kombinierte, isobare und isochore Gasgesetze, Massen-/Molmassenform und Oberflächenenergie/-spannung. |
| 58 | Statischer Druck, Kolbendruck, hydraulische Kraftwandlung, alle Schweredruckformen, Über-/Unterdruck und korrigierter Auftrieb mit Volumen. |
| 59 | Volumenstrom V/t und Av, bestehende Kontinuität, dynamischer Druck, horizontale und allgemeine Bernoulli-Gleichung. |
| 60 | Reynolds, Stokes mit Radius und Durchmesser, quadratischer Widerstand inklusive c_w und Hagen–Poiseuille inklusive vierter Wurzel für r. |
| 61 | Zuordnung radiometrischer/fotometrischer Grössen und Spektrum: keine zusätzliche unabhängige Formel. Keine pauschale Umrechnung von W in lm ohne Spektralinformation. |
| 62–63 | Lichtstärke/-strom/-menge, Beleuchtungsstärke, Kosinus- und Abstandsgesetz, Leuchtdichte, Raumwinkel und voller Raumwinkel 4π; Linsengleichung, Bild-/Gegenstandsgrössen, signierte Vergrösserung, positive reelle Bildgrössenverhältnisse, Auszug und Belichtungsfaktor. Bestehende Brechkraftkarte deckt Dioptrien ab. |
| 64 | Bestehende Brechzahl und Strahlenskizze; Snellius nach beiden Winkeln und beiden Indizes bzw. Phasengeschwindigkeiten; Grenzwinkel nach beiden Indizes bzw. Phasengeschwindigkeiten. Der Luft-/Vakuum-Spezialfall folgt mit n₂ = 1 bzw. c₂ = c₀. |
| 65–66 | Faserprinzip/-bauarten: qualitative und numerische Beispiele ohne eigenständige neue Modellformel. |
| 67 | P₂/P₁, 10 log₁₀(P₂/P₁) und absolute Leistung in dBm, jeweils mit sämtlichen inversen Grössen. |
| 68 | Reparatur-/Dispersionsbeschreibungen ohne weitere Formel. Prozentverluste sind keine universelle Konstante einer Reparatur; aufeinanderfolgende Übertragungsverhältnisse multiplizieren sich. |
| 69 | Geometrische Solarprojektion nach E/E₀/α; fünf Temperaturskalen; bestehende lineare Änderung plus vollständig inverse Endlängen- und Summenbeziehung. |
| 70 | Bestehende Flächen-/Volumenänderung, alle Endgrössen und Summen, γ ≈ 3α, Mischung bei verschiedenen und gleichen spezifischen Wärmekapazitäten, Q = CΔT, bestehende Beziehungen C = mc und Q = mcΔT. |
| 71 | Φ = Q/t; korrigierter advektiver Wärmestrom ṁcΔT; Wärmeleitung als Rate und Wärmemenge inklusive λ; Wärmeübergang inklusive α. |
| 72 | Schichtleitwert λ/ℓ; Wärmedurchgang Q = kAΔTt; Gesamtkoeffizient mit beiden Filmwiderständen und ℓ/λ. Phasendiagramm/-übergänge sind qualitativ und erzeugen keine erfundene quantitative Formel. |

## Fachliche Korrekturen und Konventionen

- **S. 48/53:** aktueller empfohlener Wert G = 6.67430 × 10⁻¹¹ m³/(kg s²); Konstantenwerte werden nicht als zu lösende Unbekannte behandelt.
- **S. 49–52:** gerichtete Geschwindigkeiten können beide Quadratwurzelzweige besitzen; Zeiten sind nichtnegativ. Beim schrägen Wurf sind Reichweite R = v₀² sin(2α)/g und maximale Steighöhe Δh = v₀² sin²α/(2g) verschieden. Die falsche Gleichsetzung in der Quelle wird nicht übernommen.
- **S. 53–55:** FR = √(FA²+FB²) gilt nur bei orthogonalen Komponenten. Reibung ist Gleitreibung für bereits gleitende Körper. Der mechanische Vorteil eines Flaschenzugs wird durch tragende Seilsegmente bestimmt.
- **S. 57:** in pV = m(R/M)T ist R die universelle molare Gaskonstante, R/M die spezifische Gaskonstante. Oberflächenenergie und -spannung haben äquivalente Einheiten J/m² = N/m.
- **S. 58:** eine Kraft benötigt F_A = ρgV bzw. F_net = ΔρgV. Δρgh hat Druckeinheiten und darf nicht als Auftriebskraft ausgegeben werden.
- **S. 62:** lokal dΦ = I dΩ statt eines Produkts unabhängiger Änderungen ΔI·ΔΩ. Das einfache Leuchtdichteverhältnis L = E/Ω setzt eine passende Projektion bzw. paraxiale Anordnung voraus.
- **S. 63:** die Quelle verwendet positive reelle Bildgrössen. Die allgemeine signierte Vergrösserung ist m = −b/g; gesonderte Grössenverhältnis-Karten erhalten B/G = b/g für reelle Bilder. Der Belichtungsfaktor ist V = (1 + ext/f)².
- **S. 64–68:** Faserführung benötigt einen höheren Brechungsindex im Kern als im Mantel; Massendichte allein bestimmt den Index nicht. Die Quelle verwendet negative dB-Werte für Dämpfung (Gain-Konvention). dBm ist dagegen ein absoluter Pegel mit 0 dBm = 1 mW; auch positive Pegel sind zulässig. Reparaturverluste werden nicht pauschal als 50 % angenommen.
- **S. 69:** Celsius/Kelvin-Offset exakt 273.15, Fahrenheit/Rankine exakt 459.67; Réaumur 80 °Ré = 100 °C. Historische Rundungen und der falsche 273.16-Offset werden ersetzt. Die Solarprojektion erhält E₀ als Eingabe statt eines unveränderlichen historischen Solarwerts.
- **S. 71:** advektiver Wärmestrom Φ = ṁcΔT statt der dimensionswidrigen gedruckten Formel m·t·c·T. Stationäre Wärmeflüsse durch Serienschichten sind gleich; Widerstände und Temperaturabfälle addieren sich, nicht die Wärmemengen jeder Schicht.
- **S. 72:** λ/ℓ beschreibt nur die Wand. Für zwei Fluide mit Wand gilt 1/k = 1/α₁ + ℓ/λ + 1/α₂; die fehlende Wanddicke wird ergänzt.

## Quellenabgleich

Die Beziehungsauswahl stammt vollständig aus dem privaten Formelbuch. Öffentliche Fachreferenzen unterstützen die Prüfung und sind an den betreffenden Karten verlinkt: [OpenStax Rotation](https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration), [Bernoulli](https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation), [Viskosität und Poiseuille](https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence), [Linsen](https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses), [Wärmeleitung](https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer), [BIPM Fotometrie](https://www.bipm.org/en/si-base-units/candela), [NIST Gravitation](https://www.nist.gov/how-do-you-measure-it/how-do-you-measure-strength-gravity) und [RP Photonics Encyclopedia, Decibel](https://www.rp-photonics.com/decibel.html).

## Implementierung und Prüfvertrag

- `content/formula-book.ts`: typisierte Felder, jede inverse KaTeX-Formel, Annahmen und Quellseiten; eingebunden in den vorhandenen Resource-Katalog.
- `physics/resources/formula-book.ts`: explizite reine SI-Funktionen für alle 496 neuen Zielgrössen; kein eval, keine Skriptauswertung und kein CAS.
- `physics/resources/formula-book-math.ts`: domainbewusste Wurzeln und inverse Winkelfunktionen; stabile quadratische Umstellung nutzt den vorhandenen Kinematikalgorithmus.
- `calculators/formula-book-equations.ts`: wählt den algebraischen Anzeigezweig aus bereits validierten Ergebnissen und behandelt lineare Grenzfälle ohne eine zweite Physikberechnung.
- Der bestehende Resource-Solver liefert bei Bedarf mehrere diskrete Lösungen und prüft auch die unveränderten vollständigen Eingaben auf Konsistenz. ResourceCalculator zeigt alle Lösungen mit den gemeinsamen Feldern, Tools und Gleichungsbausteinen.
- Tests besitzen für jede Beziehung unabhängige SI-Referenzwerte. Jede Zielgrösse wird einzeln entfernt, zurückgerechnet und gegen die Originalbeziehung geprüft; auch alle allgemeinen und eingesetzten Formeln werden durch KaTeX geprüft. Weitere Tests decken Singularitäten, ausgeschlossene Winkel, signierte/virtuelle Ergebnisse, Mehrfachlösungen, nichtendliche Werte und alle Temperaturskalen ab.

## Register der neuen Beziehungen

| Quellseite | Modell-ID | Rechner |
|---|---|---|
| 50 | `book-angular-motion` | Angular Displacement and Time |
| 50 | `book-arc-length` | Arc Length |
| 50 | `book-revolutions` | Angle and Revolutions |
| 50 | `book-angular-frequency` | Angular Velocity and Frequency |
| 50 | `book-rotation-period` | Rotation Period |
| 50 | `book-rotation-count` | Revolution Count and Time |
| 50 | `book-tangential-speed` | Tangential Velocity |
| 50 | `book-angular-path` | Arc Displacement During Rotation |
| 51 | `book-angular-velocity` | Angular Velocity Under Constant Acceleration |
| 51 | `book-angular-average` | Angular Displacement from Mean Velocity |
| 50, 51 | `book-angular-displacement` | Angular Displacement Under Acceleration |
| 50, 51 | `book-angular-energy` | Angular Velocity and Displacement |
| 53 | `book-force` | Newton’s Second Law |
| 53 | `book-weight` | Weight |
| 53 | `book-gravitation` | Universal Gravitation |
| 53 | `book-orthogonal-force` | Orthogonal Force Resultant |
| 53 | `book-kinetic-friction` | Kinetic Friction |
| 53, 54 | `book-friction-work` | Energy Dissipated by Sliding Friction |
| 54, 56 | `book-work-force` | Work of a Constant Force |
| 54, 56 | `book-potential-energy` | Gravitational Potential Energy |
| 56 | `book-weight-energy` | Potential Energy from Weight |
| 54, 56 | `book-kinetic-energy` | Kinetic Energy |
| 56 | `book-kinetic-weight` | Kinetic Energy from Weight |
| 56 | `book-power-time` | Work, Power and Time |
| 56 | `book-mechanical-power` | Translational Power |
| 56 | `book-rotational-power` | Rotational Power |
| 56 | `book-electrical-power` | Electrical Power |
| 54 | `book-acceleration-work` | Work and Change in Kinetic Energy |
| 54 | `book-acceleration-distance-work` | Work Under Constant Acceleration |
| 55 | `book-pulley-force` | Ideal Pulley Force |
| 55 | `book-pulley-distance` | Ideal Pulley Travel |
| 57 | `book-combined-gas` | Combined Gas Law |
| 57 | `book-isobaric-gas` | Isobaric Gas Law |
| 57 | `book-isochoric-gas` | Isochoric Gas Law |
| 57 | `book-mass-gas` | Ideal Gas Law with Molar Mass |
| 57 | `book-surface-energy` | Surface Energy |
| 57 | `book-surface-force` | Surface Tension Force |
| 58 | `book-static-pressure` | Static Pressure Contributions |
| 58 | `book-gauge-pressure` | Gauge and Absolute Pressure |
| 58 | `book-underpressure` | Underpressure Magnitude |
| 58 | `book-buoyancy` | Buoyant Force |
| 58 | `book-net-buoyancy` | Net Buoyancy of a Fully Immersed Body |
| 59 | `book-volume-rate` | Volume Flow Rate |
| 59 | `book-flow-speed` | Flow Rate and Mean Speed |
| 59 | `book-dynamic-pressure` | Dynamic Pressure |
| 60 | `book-reynolds` | Reynolds Number |
| 60 | `book-stokes-radius` | Stokes Drag on a Sphere |
| 60 | `book-stokes-diameter` | Stokes Drag Using Diameter |
| 60 | `book-drag` | Quadratic Drag |
| 60 | `book-poiseuille` | Hagen–Poiseuille Flow |
| 62 | `book-luminous-flux` | Luminous Flux and Intensity |
| 62 | `book-luminous-energy` | Luminous Energy |
| 62 | `book-illuminance-area` | Illuminance and Received Flux |
| 62 | `book-inverse-square-light` | Inverse-Square Illuminance |
| 62 | `book-oblique-illuminance` | Illuminance at Oblique Incidence |
| 62 | `book-light-distance-comparison` | Illuminance at Two Distances |
| 63 | `book-luminance-area` | Luminance and Projected Area |
| 63 | `book-luminance-solid` | Luminance and Illuminance |
| 63 | `book-solid-angle` | Solid Angle on a Sphere |
| 63 | `book-thin-lens` | Thin-Lens Imaging Equation |
| 63 | `book-image-magnification` | Transverse Magnification |
| 63 | `book-image-size` | Image and Object Size |
| 63 | `book-real-image-ratio` | Real-Image Size Ratio |
| 63 | `book-image-extension` | Lens Extension |
| 63 | `book-extension-magnification` | Magnification from Lens Extension |
| 63 | `book-bellows-factor` | Bellows Exposure Factor |
| 64 | `book-snell` | Snell’s Law — Inverse Quantities |
| 64 | `book-speed-refraction` | Refraction from Phase Speeds |
| 64 | `book-critical-index` | Critical Angle and Refractive Indices |
| 64 | `book-critical-speed` | Critical Angle and Phase Speeds |
| 67 | `book-fiber-ratio` | Optical Power Transmission Ratio |
| 67 | `book-fiber-db` | Optical Power Gain in Decibels |
| 67 | `book-fiber-dbm` | Absolute Optical Power in dBm |
| 69 | `book-solar-projection` | Solar Irradiance Projection |
| 70 | `book-expansion-coefficients` | Isotropic Expansion Coefficients |
| 70 | `book-heat-capacity-quantity` | Heat and Heat Capacity |
| 71 | `book-heat-rate` | Heat Transfer Rate |
| 71 | `book-advected-heat` | Heat Carried by a Flow |
| 71 | `book-conduction-rate` | Conduction Through a Plane Layer |
| 71 | `book-conduction-heat` | Heat Conducted Through a Plane Layer |
| 71, 72 | `book-convection-heat` | Heat Transfer at a Surface |
| 72 | `book-layer-conductance` | Conductance per Unit Area of a Layer |
| 72 | `book-overall-heat` | Heat Through an Overall Conductance |
| 72 | `book-overall-coefficient` | Overall Heat Transfer Coefficient |
| 59 | `book-bernoulli` | Bernoulli’s Equation |
| 53 | `book-normal-force` | Normal Force on an Incline |
| 54 | `book-slope-component` | Gravity Component Along an Incline |
| 54 | `book-slope-geometry` | Inclined-Plane Geometry |
| 53 | `book-slope-raising` | Raising Force Along a Rough Incline |
| 53 | `book-slope-lowering` | Lowering Force Along a Rough Incline |
| 53 | `book-slope-acceleration` | Downhill Acceleration with Kinetic Friction |
| 51, 52 | `book-vertical-position` | Vertical Position — Inverse Quantities |
| 51, 52 | `book-vertical-velocity` | Vertical Velocity — Inverse Quantities |
| 51, 52 | `book-projectile-energy` | Projectile Speed and Height |
| 51 | `book-free-fall-height` | Drop Distance from Rest |
| 51 | `book-free-fall-speed` | Speed After Falling from Rest |
| 51 | `book-average-fall-speed` | Drop Distance from Final Speed |
| 52 | `book-maximum-height` | Maximum Height of a Vertical Launch |
| 52 | `book-vertical-apex-time` | Time to the Vertical Apex |
| 52 | `book-horizontal-trajectory` | Horizontal-Launch Trajectory |
| 52 | `book-speed-components` | Speed from Orthogonal Velocity Components |
| 52 | `book-falling-direction` | Direction of a Horizontal-Launch Velocity |
| 52 | `book-launch-cos` | Launch Velocity — Horizontal Component |
| 52 | `book-launch-sin` | Launch Velocity — Vertical Component |
| 52 | `book-oblique-flight-time` | Oblique Flight Time to Launch Level |
| 52 | `book-oblique-range` | Oblique Range at Equal Heights |
| 52 | `book-oblique-apex-height` | Oblique Maximum Rise |
| 52 | `book-oblique-trajectory` | Oblique Trajectory — Inverse Quantities |
| 70 | `book-thermal-mixing` | Thermal Mixing — Inverse Quantities |
| 58 | `book-hydrostatic` | Hydrostatic Pressure — Including Gravity |
| 58 | `book-hydrostatic-mass` | Pressure of a Uniform Fluid Column |
| 54 | `book-horizontal-friction-work` | Frictional Dissipation on a Horizontal Surface |
| 56 | `book-power-force-distance` | Power from Force and Travel |
| 54 | `book-incline-work` | Work Against Gravity Along an Incline |
| 69 | `book-total-length-expansion` | Final Length After Expansion |
| 69 | `book-additive-length-expansion` | Length Change and Final Size |
| 70 | `book-total-area-expansion` | Final Area After Expansion |
| 70 | `book-additive-area-expansion` | Area Change and Final Size |
| 70 | `book-total-volume-expansion` | Final Volume After Expansion |
| 70 | `book-additive-volume-expansion` | Volume Change and Final Size |
| 63 | `book-magnification-focal-image` | Real-Image Magnification from Image Distance |
| 63 | `book-magnification-focal-object` | Real-Image Magnification from Object Distance |
| 50 | `book-angular-period` | Angular Speed and Period |
| 50 | `book-tangential-period` | Tangential Speed and Period |
| 50 | `book-tangential-frequency` | Tangential Speed and Rotation Frequency |
| 50 | `book-angular-acceleration-rest` | Angular Acceleration from Rest |
| 50 | `book-angular-rest-position` | Angular Displacement from Rest |
| 50 | `book-angular-rest-average` | Mean Angular Velocity from Rest |
| 70 | `book-equal-heat-mixing` | Thermal Mixing with Equal Specific Heats |
| 50 | `book-angular-rest-energy-angle` | Angular Acceleration from Angular Displacement |
| 50 | `book-angular-rest-energy-revolutions` | Angular Acceleration from Revolutions |
| 51 | `book-free-fall-speed-time` | Free-Fall Speed and Time |
| 52 | `book-horizontal-speed-time` | Horizontal-Launch Speed at a Given Time |
| 52 | `book-falling-direction-depth` | Horizontal-Launch Direction from Drop Depth |
| 52 | `book-oblique-vertical-velocity` | Vertical Velocity of an Oblique Launch |
| 52 | `book-oblique-apex-time` | Time to the Oblique Apex |
| 63 | `book-real-magnification-distance` | Real-Image Magnification from Distances |
| 63 | `book-image-focal-sizes` | Focal Length from Image Size and Distance |

Verifikation: 345 fachliche und Darstellungs-Tests, `npm run check` und Produktionsbuild erfolgreich. Gezielte Browserprüfung von elf repräsentativen Rechnern mit Mehrfachlösungen, Invalidierung, Einheitenwechsel und leeren Zielfeldern; Laptop/Mobil in beiden Themes, Tastaturbedienung des erweiterten Temperaturmenüs, Reset, deutsche Route und bestehende Optikskizzen geprüft.

`book-orthogonal-force`, `book-kinetic-friction` und `book-weight` bleiben als geprüfte Quellbeziehungen erhalten, sind jedoch auf ausdrücklichen Nutzerwunsch nicht mehr als Karten registriert und erscheinen weder in Dynamics noch in der Seitensuche. Die Formelbuch-Abdeckungszahlen zählen weiterhin Quellbeziehungen.
