# Gemeinsame Rechner statt Formelauswahl

## Verbindliche Bedienregel

Zusammengehörige Formeln werden bevorzugt in einer Eingabefläche mit automatischen Teilresultaten und Umstellungen verbunden. Unterschiedliche Annahmen, Prozesse oder Körperformen bleiben eigenständige aufklappbare Modellkarten. Keine innere Modellwahl mit mehr als zwei Optionen. Echte binäre Konfigurationen wie Serie/Parallel, Hochpass/Tiefpass, Stern/Dreieck und offene/geschlossene Rohre dürfen umgeschaltet werden. Die Auswahl eines mathematischen Lösungszweigs oder einer Grafikansicht ist keine Modellwahl.

Die vier Impulskarten bleiben unverändert. Die schiefe Ebene und die Wurfbewegung behalten ihre bereits integrierten Rechner. Die neun Körper-/Steinermodelle unter Rotation sind eigene Karten; die frühere Körperauswahl entfällt.

## Umgesetzte Zusammenführungen

`content/combined-models.ts` legt 32 Familien mit expliziten Feldzuordnungen fest:

- Mechanische Arbeit, Reibungsarbeit, potentielle Energie, kinetische Energie und mechanische Leistung.
- Freier Fall, Geschwindigkeitskomponenten, idealer Flaschenzug, Frequenz/Periodendauer, tangentiale Bewegung und Umlaufgeschwindigkeit/Periodendauer und die beiden Beschleunigungsmodelle mit beziehungsweise ohne Anfangsgeschwindigkeit.
- Hydrostatischer Druck, Oberflächenspannung sowie Volumenstrom/Kontinuität.
- Längen-, Flächen- und Festkörper-Volumenausdehnung sowie Flüssigkeitsausdehnung/Dichte.
- Wärmekapazität, allgemeine thermische Mischung, Brennstoffenergie, Wärmeleitung und Wärmedurchgang.
- Vorzeichenbehaftete Linsenabbildung, reelle Grössenverhältnisse und Auszug/Belichtungsfaktor.
- Saitengeschwindigkeit/Grundfrequenz, Lichtstrom/Lichtenergie/Raumwinkel, Leuchtdichte sowie optische Transmission/dB.

Gemeinsame Symbole werden nur bei gleicher physikalischer Bedeutung verbunden. Die vorzeichenbehaftete Linsenvergrösserung bleibt beispielsweise vom positiven Grössenverhältnis reeller Bilder getrennt. Vorzeichenbehaftete Winkel-/Weggrössen bleiben von positiven Perioden-/Frequenzgrössen getrennt. Mittlere und momentane Geschwindigkeiten werden nicht gleichgesetzt. Die Quellbeziehung `book-average-fall-speed` verwendet trotz ihrer internen ID die Endgeschwindigkeit: `h = vt/2`.

Druckarten, unterschiedliche Gasprozesse, viskose Strömung gegenüber Reynolds-Zahl, unterschiedliche Widerstandsregime, Strahlungsprojektion gegenüber Wärmetransport, verschiedene elektrische Wellenformen und unterschiedliche Körpergeometrien behalten eigene Karten. Sie werden nicht allein wegen gleicher Variablennamen zu einem gemeinsamen Gleichungssystem gemacht. Einzelne verbleibende Spezialmodelle bleiben eigenständig, wenn ihre Voraussetzungen oder ihre Ergebnisgrössen von den integrierten Familien abweichen.

## Brennstoff: genau fünf Eingaben

Die Karte **Fuel Energy / Brennstoffenergie** hat in dieser Reihenfolge Q, ρ, V, m und H. Es gelten `Q = mH`, `m = ρV` und die expliziten Inversen der zusammengesetzten Beziehung `Q = ρVH`.

Q, m und V sind nichtnegativ, ρ und H positiv. Beispielsweise:

- ρ und V bestimmen m, auch ohne Heizwert.
- Q und m bestimmen H; zusammen mit ρ wird zusätzlich V bestimmbar.
- Q, ρ und V bestimmen m und H.
- Q = 0 bestimmt m = V = 0; ρ und H bleiben dabei unbestimmt.
- Zusätzliche Angaben werden auf Widersprüche geprüft. Ungültiger Heizwert sperrt die Energieberechnung, lässt eine unabhängige Dichte-/Massenrechnung aber bestehen.

Die Modellgrenzen der ursprünglichen Quellen bleiben sichtbar: vollständige Verbrennung, konsistenter oberer oder unterer massenspezifischer Heizwert, keine implizite Heizungswirkungsgradannahme.

## Berechnung und Darstellung

`physics/resources/combined.ts` ruft ausschliesslich vorhandene explizite inverse Fachfunktionen auf. Es gibt keinen Ausdrucksparser für Formeln und kein CAS. Jeder Auswertungsdurchgang ergänzt mindestens eine vorher fehlende Grösse; die Anzahl der Durchgänge ist durch die Feldanzahl begrenzt. Diskrete Zweige werden getrennt gehalten. Gültige vollständige Zweige haben Vorrang vor widersprüchlichen Alternativen. Keine berechneten Werte werden in Eingabefelder geschrieben.

Jede Relation hat ihre eigenen Abhängigkeiten. Unvollständige oder ungültige Angaben verhindern nur die davon betroffenen Rechnungen. Nach der vollständigen Auswertung werden alle prüfbaren Relationen validiert. Widersprüchliche, unmögliche oder numerisch unbrauchbare Ergebnisse und ihre Folgeschritte werden entfernt. Singularitäten bleiben ausdrücklich unterbestimmt. Gekoppelte optische Inversen für Brennweite/Vergrösserung und Belichtungsfaktor/Bildweite sind zusätzlich explizit implementiert. Exakte Nullintervalle und verschwindende Beschleunigung erhalten ihre bestimmbaren Teilresultate ohne erfundene Parameter. Bei null Ausgangsleistung bleibt die lineare Transmission null erhalten; nur der nicht endliche dB-Wert wird verworfen. Die Brennstoff-Nullfälle und die exakt waagrechten/senkrechten Geschwindigkeitskomponenten sind explizit ergänzt; numerisches `cos(π/2)` erzeugt keinen kleinen erfundenen Horizontalanteil.

Alle SI-Konversionen, Rohtexte, Präfixe und Ausgabeformate verwenden die vorhandenen gemeinsamen Quellen. Der bestehende Formelbuch-Adapter wählt zur tatsächlich berechneten Lösung den passenden algebraischen Zweig im Rechenweg, auch bei quadratischen Zeiten und verschwindender Beschleunigung. Die Fachfunktionen kennen keine Darstellungssprache.

`CombinedCalculator`, `QuantityField`, `CalculatorTools` und `EquationBlock` bilden die gemeinsame Oberfläche. Die abstrakten SVG-Beziehungsgrafiken sind auf ausdrücklichen Nutzerwunsch aus allen gemeinsamen Rechnern entfernt. Die dynamische Seilführung des Flaschenzugs bleibt in Kraft- und Wegansicht erhalten.

`integratedModels` erhält die alten IDs und Suchbeziehungen. Alte Hashlinks öffnen die richtige gemeinsame Karte. Nicht zusammengeführte Quellen bleiben direkt auf ihren eigenen Karten erreichbar. Englische und deutsche Theorie-/Metadaten und Texte werden gemeinsam gepflegt.

## Prüfung und verbleibende Grenzen

`tests/combined-models.test.mjs` prüft Referenzzustände aller 32 Familien, jede zugängliche inverse Zielgrösse und sämtliche Teilmengen eines konsistenten bekannten Eingabesatzes auf Erhalt mindestens eines gültigen Zweigs. Hinzu kommen Brennstoff-Nullfälle, unabhängige Teilresultate, Invalidierung, Karten-/Direktlinkabdeckung und die geschlossenen Winkelendpunkte. Bestehende Fachtests bleiben erhalten.

Die Teilmengenprüfung ist kein Beweis, dass jede algebraisch gemeinsam lösbare Mehrgleichungskombination bereits unterstützt wird: Der Adapter löst ausdrücklich implementierte Inversen und verkettet sie. Er führt keine simultane symbolische Elimination mehrerer unbekannter Grössen ein. Die vorhandenen Fachsolvereinschränkungen gelten weiter und werden nicht als allgemeines Gleichungssystem beworben.

Typ-/Svelte-Prüfung, gesamte Testsuite und Produktionsbuild sind erforderlich. Eine interaktive Browserprüfung für Mobil/Laptop, beide Themes und Eingabemethoden bleibt in dieser Sitzung wegen nicht verfügbarem Browser-Zugriff offen.
