# Starre Körper: Rotationsenergie und Trägheitsmomente

## Einordnung und Quelle

Die Vorlesungsnotizen `Physik1_VL19_HS26.pdf` vom 17.11.2026 liefern den neuen Stoff ab Abschnitt 5.3.1 auf PDF-Seite 3 bis Seite 5. Der als Wiederholung markierte Teil über Schwerpunkt, Kräfte, Statik und Schwimmstabilität ist ausdrücklich nicht beauftragt. Die private PDF und ihre Renderdateien bleiben ausserhalb des Repositorys.

Unter `/mechanics/rotation` und `/de/mechanics/rotation` ergänzen Energie, Drehimpuls und neun eigenständige Trägheitsmoment-/Steinerkarten die sechs Kinematikkarten:

1. **Rigid-Body Energy / Energie starrer Körper**
2. **Angular Momentum & Torque / Drehimpuls und Drehmoment**
3. **Parallel-Axis Theorem / Steinerscher Satz** sowie je eine Karte für Ring, Vollzylinder, Hohlzylinder, Vollkugel, Kugelschale, Vollkegel, Stab und Quader.

Die Registry liefert Navigation, lokale Suche, Theorie und stabile Direktlinks `#model-rigid-energy`, `#model-rigid-momentum` und `#model-rigid-inertia`. Gemeinsame Karten, Felder, Einheitenmenüs, Variantenwahl und Ergebnisgleichungen bleiben erhalten. Englische und deutsche Inhalte sind vollständig gepflegt.

## Fachvertrag

`physics/mechanics/rigid-body.ts` enthält ausschliesslich explizite Relationen und Umstellungen; keine symbolische Formelauswertung. SI-Werte bleiben ungerundet. Jeder Auswertungsschritt ergänzt eine tatsächlich bestimmbare Grösse; die Zahl der Durchgänge ist durch die Anzahl der Grössen beschränkt. Quadratische Geschwindigkeitsinversen verzweigen ausdrücklich in beide Vorzeichen. Weitere bekannte Angaben prüfen diese Zweige auf Widersprüche. Bei ungültigen oder widersprüchlichen Angaben werden die betroffenen Ergebnisse und davon abhängige Schritte verworfen; unabhängige Beziehungen bleiben auswertbar.

### Energie

`E_rot = I ω²/2`, `E_trans = m v_S²/2`, `E_kin = E_trans + E_rot`.

Alle sieben Grössen sind manuell zugänglich. Masse und Trägheitsmoment sind positiv, Energien nichtnegativ, Geschwindigkeiten vorzeichenbehaftet. `I` bezieht sich auf die Schwerpunktachse. Translation und Rotation sind unabhängig: keine implizite Rollbedingung, kein angenommener Radius. Auch ohne Masse ist die Rotationsenergie bestimmbar; auch ohne Trägheitsmoment bleibt die Translationsenergie bestimmbar. Energie null bestimmt die entsprechende Geschwindigkeit null; Geschwindigkeit null bestimmt die Energie null, aber weder Masse noch Trägheitsmoment. Negative Restenergien sind unlösbar.

### Drehimpuls und Drehmoment

`L_z = I ω`, `M_z = I α = dL_z/dt` bei konstantem positivem Trägheitsmoment und fester Hauptträgheitsachse. Alle fünf Grössen sind manuell zugänglich. Axiale Komponenten dürfen Vorzeichen haben. Ein bekanntes Paar kann `I` bestimmen und dadurch die zweite Relation auswertbar machen. Nullkomponenten werden ohne erfundene Massen- oder Trägheitswerte behandelt.

Die Theorie enthält zusätzlich die Zerlegung in Bahn- und Eigendrehimpuls sowie die allgemeine Vektorbeziehung zwischen Drehmoment und Drehimpulsänderung. Das Drehstuhl-Experiment wird über die Richtungsänderung erklärt. Der numerische Rechner ist auf die genannten axialen Beziehungen beschränkt; allgemeine räumliche Kreiselbewegung, Trägheitstensoren und eine Kreisel-Zeitintegration sind nicht implementiert und werden im Rechner nicht behauptet.

### Körperformen und Steinerscher Satz

Die Körperformen sind eigene aufklappbare Modellkarten ohne innere Körperwahl. Jede Karte besitzt unabhängige manuelle Eingaben und Einheiten. Keine automatische Übernahme berechneter Grössen in Eingabefelder.

| Homogener idealer Körper | Schwerpunktachse | Trägheitsmoment |
| --- | --- | --- |
| Dünner Ring / dünnwandiger Hohlzylinder | Symmetrieachse | `m R²` |
| Vollzylinder / Scheibe | Symmetrieachse | `m R²/2` |
| Dickwandiger Hohlzylinder | Symmetrieachse | `m (R²+r²)/2` |
| Vollkugel | Durchmesser | `2 m R²/5` |
| Dünne Kugelschale | Durchmesser | `2 m R²/3` |
| Vollkegel | Symmetrieachse | `3 m R²/10` |
| Dünner Stab | Senkrecht zum Stab durch die Mitte | `m l²/12` |
| Quader / rechteckige Platte | Durch Schwerpunkt, senkrecht zur a-b-Fläche | `m (a²+b²)/12` |

Der Würfel ist im Quadermodell durch gleiche Kanten abgedeckt. Die Kante parallel zur Drehachse tritt in der Formel nicht auf. Dünne Wände und Stäbe vernachlässigen ihre Dicke. Aussenradius, Stablänge, Querseiten, Masse und Trägheitsmomente sind positiv; `0 ≤ r < R`.

Jede verwendete Körperabmessung, Masse und jedes Trägheitsmoment ist eine inverse Zielgrösse. Zusätzlich gilt `I_A = I_0 + m d²`, wobei die Ausgangsachse durch den Schwerpunkt verlaufen und die zweite Achse parallel sein muss. `d ≥ 0`. Auch `I_0`, `I_A`, Masse und Achsabstand sind inverse Zielgrössen. Für den Stab mit Achse durch das Ende liefert `d = l/2` den Wert `m l²/3`. Ohne bekannte Verschiebung wird keine solche Achse angenommen. `I_A < I_0` ist unlösbar. Bei `d = 0` bleibt die Masse unbestimmt, falls sie nicht aus der Körperform folgt.

## SVG-Darstellung

`visualization/rigid-body.ts` erzeugt die Projektion entlang der Drehachse und den gemeinsamen Längenmassstab. Bekannte Abmessungen und Achsabstände verwenden denselben Massstab; fehlende Abmessungen sind ausdrücklich schematisch. Die Körperprojektion ist bereits ohne Masse sichtbar. Die SVGs erhalten dieselben validierten Solverwerte wie die Rechenwege.

Die Referenzmarkierung lässt sich per Range-Regler mit Tastatur, Pointer und Touch einstellen. Sie ändert weder Eingaben noch Solverwerte. Keine automatische Animation; reduzierte Bewegung erfordert keine Sonderbehandlung. Energieanteile werden nur bei bekanntem, positivem Gesamtnenner dargestellt. Richtungspfeile und axiale Punkt-/Kreuzsymbole erscheinen nur für bekannte von null verschiedene Grössen; Längen sind ausdrücklich normiert.

Feldfokus hat Vorrang vor einer auswählbaren Grössenhervorhebung und umfasst das Einheitenmenü. Nicht zugehörige Linien, Beschriftungen und Ergebnislegenden verwenden `--color-diagram-muted`. Aufgehobene Auswahl stellt den Normalzustand wieder her. Beide Themes verwenden vorhandene Tokens.

## Prüfung und Grenzen

`tests/rigid-body.test.mjs` prüft die inversen Zielgrössen, alle acht Körperformen, Vorzeichenzweige, Verkettung, unabhängige Teilresultate, Nullfälle, Definitionsbereiche, Widersprüche, nichtendliche Resultate, gültige KaTeX-Formeln und den Grafikmassstab. Die Gruppierungsprüfung erwartet siebzehn Rotationskarten.

Typ-/Svelte-Prüfung, vollständige Testsuite und Produktionsbuild gehören zur Abnahme. Eine interaktive Browserprüfung für Mobil/Laptop, beide Themes und Eingabemethoden konnte in dieser Sitzung wegen nicht verfügbarem Browser-Zugriff nicht durchgeführt werden; sie bleibt offen.

Ergänzende öffentliche Fachreferenzen: [Rotationsenergie](https://openstax.org/books/university-physics-volume-1/pages/10-4-moment-of-inertia-and-rotational-kinetic-energy), [Trägheitsmomente und parallele Achsen](https://openstax.org/books/university-physics-volume-1/pages/10-5-calculating-moments-of-inertia), [Drehimpuls](https://openstax.org/books/university-physics-volume-1/pages/11-2-angular-momentum).
