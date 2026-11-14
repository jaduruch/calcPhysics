# Elastische und inelastische Stösse

## Auftrag und Quellen

Auf `/mechanics/momentum` beziehungsweise `/de/mechanics/momentum` stehen vier eigenständige aufklappbare Modellkarten in dieser Reihenfolge: Momentum Conservation, Inelastic Collision, Elastic Collision, Rocket Equation. Keine Variantenwahl innerhalb der Impulskarte und keine separaten Stoss-Unterthemen. Alte Themenadressen leiten auf die passende Stosskarte der Impulsseite weiter.

Grundlage ist das privat bereitgestellte Physik-I-Skript: Kapitel 3.7.2 (gedruckte S. 49) sowie Kapitel 6.8.2–6.8.3.2 (gedruckte S. 149–153, PDF-S. 164–168). Der zentrale elastische Stoss wird auf beide bewegten Körper erweitert. Die Stosszahl beschreibt zusätzlich den zentralen teilinelastischen Fall; sie ist eine ergänzende explizite Modellannahme und keine aus dem Skript übernommene Eingabe. Keine PDF-/Renderdateien im Repository.

## Physikalischer Vertrag

Zwei konstante positive Massen, ein zentraler nichtrelativistischer Stoss auf einer Achse, kein resultierender äusserer Kraftstoss. Geschwindigkeiten sind vorzeichenbehaftete Komponenten im selben Inertialsystem. Keine ruhende zweite Masse voraussetzen.

- Impuls: m₁v₁ + m₂v₂ = m₁v′₁ + m₂v′₂. Einzelimpulse und ihre entgegengesetzten Änderungen bleiben Eingaben und Ergebnisse.
- Stosszahl: v′₂ − v′₁ = e(v₁ − v₂), 0 ≤ e ≤ 1.
- Elastisch: e = 1 ist eine feste Modellbedingung, kein editierbares Feld. Impuls und kinetische Energie bleiben erhalten. Der wechselwirkungsfreie Durchflugzweig der reinen Energie-/Impulsbilanz ist durch die umgekehrte Relativgeschwindigkeit ausgeschlossen.
- Teilinelastisch: 0 < e < 1. Vollkommen inelastisch: e = 0; beide Endgeschwindigkeiten sind gleich. e = 1 bleibt als elastische Randbedingung der inelastischen Seite zulässig. Keine unsichtbare Annahme für e.
- E₀ und E₁ sind die gesamten kinetischen Energien vorher und nachher. E_loss = E₀ − E₁ ≥ 0 wird in innere Energie umgewandelt. Keine Energievernichtung behaupten. E_loss ist der negative Q-Wert in der Skriptkonvention.
- E_loss = m₁m₂(1−e²)(v₁−v₂)² / [2(m₁+m₂)]. Energiefreisetzende/superelastische Stösse sind ausgeschlossen.
- Ohne relative Annäherung ist die Stosszahl nicht aus dem Geschwindigkeitsverhältnis bestimmbar. Keine Null durch null als Messwert ausgeben. Bei e = 0 sind beide Anfangsgeschwindigkeiten aus den gleichen Endgeschwindigkeiten und Massen allein nicht eindeutig rückrechenbar.

## Implementierung

`content/collisions.ts` liefert die beiden Stosskarten. Sie bleiben in `model-groups.ts` ungruppiert. `ModelHost` stellt jede Karte eigenständig dar; jeder Rechner behält seine eigenen Eingaben und Einheiten. Die elastische Karte hat 16 Eingaben, die inelastische 17 einschliesslich Stosszahl. Die bestehende gemeinsame `MomentumCalculator`-Komponente wird erweitert; keine kopierte Rechneroberfläche. Gemeinsame Felder, Parser, Einheitenmenüs, Reset und KaTeX bleiben zentral.

`physics/mechanics/collisions.ts` verwendet die expliziten Impulsregeln und `solveMomentumRelations` aus `momentum.ts`. Vorwärtsgeschwindigkeiten, inverse Anfangsgeschwindigkeiten, Massen, Stosszahl und Energien sind explizite Formeln. Kinetische Energiemessungen erzeugen bei Bedarf beide Vorzeichen einer Geschwindigkeit; mit bekanntem Gesamtimpuls werden die beiden expliziten Schwerpunktzweige berechnet. Energieverlust und Stosszahl erlauben ebenfalls beide relativen Geschwindigkeitszweige, sofern eine absolute Geschwindigkeit bekannt ist. Keine beliebige Wahl eines Vorzeichens. Unterbestimmte kontinuierliche Lösungsfamilien werden nicht durch erfundene Werte ersetzt.

Alle diskreten Lösungen erhalten Rechenwege. Die vorhandene tastaturbedienbare Lösungsauswahl steuert nur die Diagrammlösung; sie ist keine Modellauswahl. Handgeschriebene Rohwerte bleiben leer beziehungsweise unverändert. Berechnungen verwenden ungerundete Werte und gespeicherte Abhängigkeiten. Ungültige Angaben sperren nur betroffene Ergebnisse; zusätzliche Angaben werden auf Widersprüche geprüft.

Rundungsreste an den Grenzen e = 0/1 und bei verschwindendem Energieverlust werden in den jeweiligen Relationen abgefangen. Singuläre inverse Gleichungen werden nicht zur Prüfung einer bereits anderweitig bestimmten Grösse verwendet; die zugehörige Vorwärtsbilanz bleibt geprüft. Nichtendliche Ergebnisse sind ungültig.

`MomentumDiagram` zeigt vorzeichenbehaftete Impulse auf derselben relativen Skala sowie drei Energiebalken auf einer gemeinsamen Energieskala. Körperpositionen und -grössen sind schematisch. Fokus und Einheitenmenü grauen nicht zugehörige Linien, Körper, Beschriftungen und Balken über `--color-diagram-muted` aus. Nullimpulse erzeugen keinen Pfeil.

## Prüfung und Grenzen

Tests decken die drei Massenverhältnisse des Skripts, gleiche Massen mit Geschwindigkeitstausch, beide bewegten Körper, e = 0/0.4/1, alle einzelnen inversen Zielgrössen, Rückrechnung, zwei Energiezweige, Energieverlustzweige, Ruhe, ungültige Angaben und Widersprüche ab. Alle nichtleeren Teilmengen der Kernmesswerte der Referenzfälle werden geprüft (2557 Kombinationen). KaTeX und Übersetzungen werden ebenfalls geprüft; Browserprüfungen ergänzen Mobil/Laptop, beide Themes, Fokus, Einheiten und Lösungsauswahl.

Keine schiefen Stösse, Streuwinkel, Fragmentation, Teilchenumwandlung, relativistische Energien, Kontakt-/Verformungsdauer oder Mehrkörperkollisionen. Massen und Stosszahl allein bestimmen keine Geschwindigkeiten; Energie ohne Richtungsinformation kann mehrere oder kontinuierlich viele Lösungen erlauben. Seiten für Materialelastizität wären ein eigener Auftrag.
