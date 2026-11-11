# Inhalte aus den privaten Physik-Unterlagen

Stand: 10.11.2026. Auftrag: Physik1 und Physik2 vollständig sichten und Formelthemen als vollständige Modellkarten mit Rechnern einbauen. Alle 12 bzw. 14 PDF-Seiten wurden lokal gerendert, visuell geprüft und zusätzlich per OCR erschlossen. Original-PDFs, Renderbilder und OCR bleiben ausserhalb des Repositories; keine privaten Dateipfade oder Dokumentdownloads werden in der Website angeboten.

## Auswahl und Abdeckung

Zusammenhängende Formeln werden pro fachlichem Unterthema gebündelt. Unterschiedliche explizite Umstellungen werden als Rechnerzugänge berücksichtigt; wiederholte Aufgaben erzeugen keine eigenen Seiten. Einzelne qualitative Lernziele ohne ausreichenden Formelinhalt erhalten keine leeren Themenseiten. Grenzfälle wie Spiegel-/Linsenbrennweite werden gemeinsam unter Mirrors & Lenses gebündelt. Ergebnis: **15 neue Unterseiten, 32 neue Rechner und eine zusätzliche Snell-Modellkarte mit bestehendem Solver**. Boyle–Mariotte erweitert die bestehende Ideal-Gases-Seite; Doppler und Totalreflexion bleiben erhalten.

Die Seitenzahlen unten sind PDF-Seiten, nicht die handschriftlichen P-Nummern. Keine gescannten Abbildungen, Aufgabentexte oder Stofftabellen werden kopiert. Fachtexte sind neu auf Englisch formuliert; klassische Gleichungen wurden geprüft und mit öffentlichen Physikreferenzen verknüpft.

| Dokument | PDF-Seiten | Inhalt | Umsetzung |
|---|---|---|---|
| Physik1 | 1–2 | Druck, Einheiten, Kolben- und Schweredruck | Mechanics → Fluid Statics: Pressure and Force, Hydraulic Press, Hydrostatic Pressure; dazu Mass, Density and Volume (Bezug auch S. 10) |
| Physik1 | 3 | Boyle–Mariotte | Thermodynamics → Ideal Gases: zusätzliche Karte |
| Physik1 | 4 | Strömungsvolumen, Kontinuität | Mechanics → Fluid Flow: Transported Volume, Incompressible Continuity |
| Physik1 | 5 | Celsius, Kelvin, Fahrenheit | Thermodynamics → Temperature: vollständige Skalenumrechnung |
| Physik1 | 6 | Längen-, Flächen-, Volumen- und Dichteänderung | Thermodynamics → Thermal Expansion: fünf Karten |
| Physik1 | 7 | Beispiele zu Temperatur und Expansion, NTC-Kennlinie | Bestehende neue Modelle decken die Rechnungen ab; keine zusätzliche NTC-Karte ohne mathematisch spezifizierte Kennlinie |
| Physik1 | 8 | Wärmekapazität und Wärmemenge | Heat & Calorimetry: Heat Capacity, Sensible Heat |
| Physik1 | 9 | Mischtemperatur | Heat & Calorimetry: Thermal Mixing |
| Physik1 | 10 | Heizwert, Masse/Volumen und Energie | Fuels & Heating: zwei Karten; Dichtebeziehung auch unter Fluid Statics |
| Physik1 | 11 | Schmelzen/Verdampfen, qualitative Heizkurve | Keine eigenständige Karte: keine zwei quantitativ spezifizierten Formeln. Phase Change bleibt ausserhalb des Auftragskriteriums. |
| Physik1 | 12 | Thermischer Widerstand, Temperaturdifferenz und Wärmeleistung | Heat Transfer: Thermal Resistance |
| Physik2 | 1 | Strahlenbündel, Schatten | Qualitativ, keine neue Formelkarte |
| Physik2 | 2 | Reflexionsgesetz, diffuse Reflexion | Reflexionsgesetz bereits in Snell-/Totalreflexionsmodell; keine doppelte Seite für nur eine Beziehung |
| Physik2 | 3 | Ebene, konkave und konvexe Spiegel; r und f | Mirrors & Lenses: Spherical Mirror Focus |
| Physik2 | 4 | Brechzahl, Lichtgeschwindigkeit, Snell | Refraction: Optical Medium und Snell’s Law (bestehender Solver) |
| Physik2 | 5 | Totalreflexion | Bestehende Total-Internal-Reflection-Seite |
| Physik2 | 6 | Planparallele Platte, Versatz, scheinbare Dicke | Parallel Plates: vollständiges Vorwärtsmodell |
| Physik2 | 7 | Prisma und Ablenkungswinkel | Prisms: zwei Snell-Schritte, innere Winkel und Gesamtablenkung; Totalreflexion am Austritt gesondert |
| Physik2 | 8 | Konvex-/Konkavlinsen, Brechkraft | Mirrors & Lenses: Thin Lens Power |
| Physik2 | 9 | Wellenbegriffe, Schallformen | Theorie unter Wave Propagation; keine isolierte Begriffskarte |
| Physik2 | 10 | Ausbreitung, Wellenlänge, Frequenz | Wave Propagation: alle drei expliziten Umstellungen und Periode |
| Physik2 | 11 | Saite, offene/geschlossene Pfeife, Interferenz | Sound Sources: vier Karten; Interference & Beats: zusätzliche Karte |
| Physik2 | 12 | Dopplereffekt | Bestehende Doppler-Effect-Seite |
| Physik2 | 13 | Schalldruckpegel, Schallintensität, Schallleistung | Sound Levels: zwei Karten. Keine erfundene Umrechnung zu phon oder Hörschädigungsbewertung. |
| Physik2 | 14 | Mikrofone und Medienwandler | Qualitativ ohne zwei spezifizierte Formeln; keine neue Rechnerkarte |

## Korrigierte Punkte

- Druck: 1 bar = 100000 Pa; der umgekehrte handschriftliche Zusammenhang ist falsch.
- Temperatur: Celsius und Fahrenheit benötigen affine Offsets. Temperaturintervalle bleiben davon getrennt. Die exakten Skalenbeziehungen gelten auch bei absolut null.
- Flächen-/Volumenausdehnung isotroper Festkörper sind Näherungen erster Ordnung (2α und 3α); positive Endgrössen sind erforderlich. Flüssigkeits-β wird separat eingegeben.
- Mischtemperaturen folgen der Energieerhaltung bei positiven Wärmekapazitäten, ohne Wärmeverluste oder Phasenwechsel. Eine Aussage über momentanen Wärmewiderstand ist keine Bedingung für die Gleichgewichtstemperatur.
- Schwebungen: Die Frequenz des vorzeichenbehafteten Amplitudenumschlags beträgt |f₁−f₂|/2; die Wiederholfrequenz der Lautstärkemaxima ist |f₁−f₂|. Beide werden getrennt angezeigt.
- Prisma: eindeutige Bezeichnungen r₁+r₂=A und δ=i+e−A statt uneinheitlicher handschriftlicher Winkelbezeichnungen. Kein Austrittswinkel bei Totalreflexion.
- Scheinbare Plattendicke d/n gilt nahe normaler Beobachtung. Sie wird nicht als beliebig-winklige Tiefenformel ausgegeben.
- Schallpegel verwenden RMS-Druck und eine explizite Bezugsgrösse (standardmässig 20 µPa für Luft). Exakte Stille hätte −∞ dB und wird nicht als endliche Zahl ausgegeben.

## Implementierung und Prüfvertrag

`content/resource-catalog.ts` enthält englische Inhalte und Gleichungsvorlagen. `physics/resources/models.ts` enthält explizite TypeScript-Funktionen und Inversen; `solver.ts` prüft die jeweiligen Domains, fehlende Angaben, Nullnenner, Widersprüche und endliche Ergebnisse. Kein eval, kein CAS und keine zyklische automatische Gleichungssuche. Vorwärtsmodelle benötigen alle aufgeführten Eingaben; relationale Modelle bestimmen genau eine fehlende Primärgrösse. Standardparameter werden sichtbar gekennzeichnet und nie in Rohfelder geschrieben.

Der gemeinsame ResourceCalculator verwendet ModelCard, QuantityField, CalculatorShell, CalculatorTools und EquationBlock. Alle neuen Formeln besitzen fachliche Referenztests; jede explizite Inverse wird hin- und rückwärts geprüft. Weitere Prüfungen: Null- und Grenzfälle, Celsius/Fahrenheit und SI-Rundreisen, unveränderte manuelle Eingaben, Konsistenz, KaTeX, öffentliche Routen, Typprüfung, Produktionsbuild und gezielte Browserabläufe.

## Formelbuch, Seite 49 (11.11.2026)

Die bestehende Karte Uniformly Accelerated Motion wurde auf sechs Eingabe-/Zielgrössen erweitert: s₀, s, v₀, v₁, a und t. Die gesamte Seite «Gleichmässige Bewegung», mit und ohne Anfangsgeschwindigkeit, wurde lokal als Text und gerendertes Seitenbild geprüft. Alle dortigen Formelketten für Ortsänderung, Anfangs-/Endgeschwindigkeit, Zeit und Beschleunigung sind abgedeckt. Die Quelle verwendet s für Ortsänderung; die Plattform verwendet Δs = s − s₀. Positive Wurzelzweige der Quelle wurden für gerichtete Geschwindigkeiten um zulässige negative Zweige ergänzt und mit den übrigen Angaben sowie t ≥ 0 geprüft. Original, Seitenbilder und private Dateipfade bleiben ausserhalb des Repositories und werden nicht als Website-Download angeboten.
