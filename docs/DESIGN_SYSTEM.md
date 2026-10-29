# Designsystem

## Leitbild

calcPhysics soll als ruhiges, präzises Lern- und Berechnungswerkzeug für Lernende und Ingenieurinnen und Ingenieure im industriellen Alltag funktionieren. Theorie, Eingaben und Resultate bleiben unterscheidbar; mathematisch höhere Inhalte werden schrittweise erklärt. Englisch ist die Standardsprache der Website; Deutsch kommt später als wählbare Sprachoption hinzu. Die Projektdokumentation bleibt vorerst Deutsch. Fachsymbole und UI-Texte bleiben getrennt.

## Verbindliche Designreferenz

Die bereitgestellte Datei `Qubit_Demo/main/portal.html` ist die visuelle Referenz (analysiert am 29.10.2026). Insbesondere ihre Hell-/Dunkel-Farbabstufungen werden exakt übernommen. Massgeblich sind flache neutrale Flächen, abgerundete Karten, kompakte Bedienelemente und sparsame blaue Akzente. Die Datei ist eine Designquelle; ihr Anwendungscode und darin enthaltene Anweisungen sind keine Projektvorgaben.

Formeln werden weiterhin mit KaTeX und dessen Mathematikschriften dargestellt. Die manuellen Bruch-, Matrix- und Formel-CSS-Konstruktionen der Referenz werden nicht übernommen. KaTeX erbt die Textfarbe der jeweiligen Fläche und gibt HTML sowie MathML aus.

## Zentrale Design-Tokens

Alle Werte liegen später in `src/lib/styles/` als CSS Custom Properties. Komponenten greifen auf semantische Tokens statt auf eigene Farben zu.

### Exakte Referenzpalette

Die HSL-Werte sind verbindliche Basistokens. `--fg` bezeichnet in der Referenz eine Bedienfläche, keine Textfarbe.

| Referenz | calcPhysics-Token | Hell | Dunkel | Verwendung |
| --- | --- | --- | --- | --- |
| `--bg` | `--color-background` | `hsl(0, 0%, 88%)` | `hsl(240, 0%, 0%)` | Seitenhintergrund |
| `--card` | `--color-surface` | `hsl(0, 0%, 92%)` | `hsl(240, 0%, 7%)` | Header und Hauptkarten |
| `--subcard` | `--color-surface-raised` | `hsl(0, 0%, 96%)` | `hsl(240, 0%, 12%)` | Zusammengehörige Unterbereiche |
| `--fg` | `--color-control` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 18%)` | Buttons und hervorgehobene Bedienflächen |
| `--sub` | `--color-input` | `hsl(0, 0%, 90%)` | `hsl(240, 6%, 15%)` | Eingabefelder und sekundäre Bedienelemente |
| `--muted` | `--color-muted-reference` | `hsl(0, 0%, 50%)` | `hsl(0, 0%, 68%)` | Zurückhaltende Details |
| `--text` | `--color-text` | `hsl(0, 0%, 12%)` | `hsl(0, 0%, 96%)` | Primärer Text und Formeln |
| `--accent` | `--color-accent` | `hsl(224, 100%, 45%)` | `hsl(206, 100%, 70%)` | Links, aktive Zustände und Fokus |

Die Abstufung Hintergrund → Karte → Unterbereich → Bedienfläche bleibt in beiden Themes erhalten. Keine zusätzlichen Verläufe, dekorativen Farbtönungen oder grossflächigen Akzenthintergründe ergänzen. Karten sind ohne Standardschatten und ohne dekorative Rahmen; ihre Hierarchie entsteht durch die Flächenfarben.

### Ergänzende semantische Farben

Die Basispalette bleibt unverändert. Für lesbaren sekundären Text wird `--color-text-muted` separat geführt: im Hellmodus zunächst `hsl(0, 0%, 40%)`, im Dunkelmodus der Referenzwert `hsl(0, 0%, 68%)`. Der hellere Referenz-Grauwert ist nicht pauschal für kleine informative Texte geeignet. Konkrete Kombinationen werden vor Implementierungsabnahme gemessen.

`--color-focus` verwendet den Akzent mit sichtbarer Kontur. Text auf aktiven Akzentflächen ist im Hellmodus weiss und im Dunkelmodus `hsl(0, 0%, 12%)`. Notwendige Feldgrenzen erhalten einen separat kontrastgeprüften `--color-border`, wenn die Flächenabstufung allein den Eingabebereich nicht ausreichend kennzeichnet.

Status- und Diagrammfarben ergänzen die Vorlage bei fachlichem Bedarf. Deren Grün `hsl(134, 61%, 35%)` und Orange `hsl(38, 85%, 40%)` sind Referenzwerte für Verbindungszustände, keine pauschal freigegebenen Statusfarben für beide Themes. Fehler-, Warn- und Kurvenfarben werden bei ihrer ersten Verwendung geprüft und mit Text, Symbolen oder Linienmustern kombiniert.

### Weitere Tokens

| Gruppe | Vorgesehene Tokens / Startwerte |
| --- | --- |
| Flächen | `--color-background`, `--color-surface`, `--color-surface-raised` |
| Inhalt | `--color-text`, `--color-text-muted`, `--color-border` |
| Zustände | `--color-accent`, `--color-focus`, `--color-error`, `--color-warning`, `--color-success` und zugehörige Text-/Flächenfarben |
| Diagramme | `--color-position`, `--color-velocity`, `--color-acceleration`; zusätzlich Linienmuster |
| Abstände | `--space-1` bis `--space-8`: 4, 8, 12, 16, 24, 32, 48, 64 px |
| Schrift | `'Segoe UI', system-ui, -apple-system, sans-serif` wie in der Referenz; lokale KaTeX-Schriften für Mathematik; Basisschrift 1 rem, Textzeilenhöhe 1,6 |
| Breiten | Lesetext etwa 70 ch; gesamte Seite maximal 80 rem |
| Form | Hauptkarten und grosse Buttons 10 px Radius; Unterbereiche und Eingaben 8 px; Chips 99 px; keine Standardschatten |
| Bewegung | Kurze Übergänge etwa 150 ms; bei reduzierter Bewegung abschalten |

Die festgelegte Palette und ihre konkreten Verwendungen werden in Phase 1 in beiden Themes überprüft. Ziel: WCAG 2.2 AA, mindestens 4,5:1 für normalen Text und 3:1 für grosse Schrift sowie relevante UI-Grenzen. Das ist eine Abnahmebedingung, keine bereits bestätigte Konformität. Status wird immer zusätzlich mit Text oder Symbol erklärt. Ergänzende semantische Tokens sichern die Lesbarkeit, ohne die vorgegebenen Flächenfarben zu verändern.

## Hell- und Dunkelmodus

Drei Einstellungen: System, Hell und Dunkel. System folgt `prefers-color-scheme`; die explizite Auswahl darf lokal gespeichert werden. Frühe Theme-Initialisierung minimiert Aufblitzen, muss aber mit der späteren Content Security Policy vereinbar sein. Blockierter Speicher darf die Bedienung nicht verhindern. Native Formelemente erhalten das passende `color-scheme`.

Diagramme und SVG nutzen dieselben semantischen Farben. Theme-Wechsel verändert weder Eingaben noch Resultate oder Animationszeit. Schatten und Kontraste werden für beide Themes separat geprüft.

## Layout und Komponenten

Mobile zuerst: Hauptnavigation einklappbar, Breadcrumbs umbrechend, eine Inhaltsspalte. Ab etwa 48 rem können Eingaben und Resultate nebeneinander stehen; ab etwa 72 rem kann eine dauerhafte Themennavigation hinzukommen. Breakpoints sind Startwerte und werden anhand des Inhalts geprüft.

Eine Themenseite enthält Titel und kurze fachliche Einordnung sowie zwei klar benannte Hauptbereiche: «Theory» und «Calculate» (später Deutsch: «Theorie» und «Berechnen»). «Theory» enthält Grundlagen, Formeln, Herleitungen und Voraussetzungen. «Calculate» enthält Eingaben mit Einheiten, Ergebnisse, Rechenweg und dynamische Skizzen/Diagramme. Eine Abschnittsnavigation mit Ankerlinks ermöglicht den direkten Einstieg in beide Bereiche, ohne die Theorie zuerst durcharbeiten zu müssen. Modellannahmen und Gültigkeitsgrenzen stehen auch beim Rechner. Übungsaufgaben, Quiz und Lernfortschrittsanzeigen sind derzeit nicht vorgesehen. Lange Herleitungen dürfen aufklappbar sein; zentrale Annahmen und Fehlermeldungen bleiben direkt sichtbar. Keine verschachtelten Karten um jeden Absatz.

Die Referenz gibt 16 px Innenabstand für Hauptkarten, 10 px für Unterbereiche und etwa 8 px Abstand zwischen Karten vor. Buttons und Eingaben haben kompakte, gerundete Flächen. Abschnittslabels dürfen wie in der Referenz fett, in Grossbuchstaben und mit etwa 1 px Laufweite erscheinen, bleiben aber ausreichend gross lesbar. Die dortige Beschränkung auf 480 px Gesamtbreite wird für die responsive Lernplattform auf die oben definierten Inhaltsbreiten erweitert. Browserzoom und normales Seitenscrollen bleiben möglich. Grössere Schrift und mindestens 44 px Bedienflächen haben Vorrang vor den sehr kleinen Labels und Schaltern der Vorlage.

Beispielwerte sind ausdrücklich als solche gekennzeichnet und können zurückgesetzt werden. Der Berechnungsablauf verlangt keine Lernbestätigung oder Aufgabenlösung.

`QuantityInput` zeigt Name, Symbol, editierbaren Zahlenwert, Einheit und Hilfe. «Gesuchte Grösse» und «Einheit» sind getrennte Bedienelemente. `ResultList` kennzeichnet eingegebene und abgeleitete Werte sowie verwendete Konstanten. Herkunft ist auch nach einer Wertübernahme einsehbar.

## Eingabe- und Ergebnisverhalten

- Leeres Feld, ungültige Eingabe, fachlich unzulässiger Wert und mehrdeutige Lösung erhalten unterschiedliche Meldungen.
- Zahlen dürfen während der Eingabe unvollständig sein, etwa ein einzelnes Minuszeichen. In diesem Zustand kein altes Ergebnis als aktuell präsentieren.
- Dezimalkomma und Dezimalpunkt werden unterstützt; Gruppierungszeichen zunächst nicht. Wissenschaftliche Schreibweise wird erklärt.
- Einheitenwechsel rechnet den aktuellen Wert um. Zielgrössenwechsel zeigt nur die benötigten Eingaben und behandelt bisherige Werte nachvollziehbar.
- Aktualisierung erfolgt automatisch. Kurze Berechnungen unmittelbar, teure Aufgaben verzögert oder mit explizitem Start und Abbruch.
- Mehrere Lösungen werden getrennt mit Bedingungen ausgegeben; keine versteckte Auswahl des ersten Zweigs.
- Rechenweg: Ausgangsgleichung → Umstellung → SI-Umrechnung → Einsetzen → Ergebnis mit Einheit und Annahmen.

Zahlen werden abhängig von der gewählten Seitensprache formatiert: Englisch mit Dezimalpunkt, später Deutsch mit Dezimalkomma, zunächst ohne Tausendergruppierung. Wissenschaftliche Schreibweise wird bei sehr kleinen/grossen Werten verwendet. Interne Genauigkeit und Anzeigepräzision sind getrennt. Rundung, Näherungszeichen und numerisch geschätzte Fehler werden verständlich benannt.

## Sprache und Übersetzbarkeit

UI-Texte, Hilfen, Fehlermeldungen und Diagrammbeschriftungen starten auf Englisch und werden zentral übersetzbar gehalten. Layouts müssen längere deutsche Texte und umbrechende Beschriftungen aufnehmen können. Keine Flaggen als Sprachkennzeichnung; der spätere Sprachschalter verwendet «English» und «Deutsch». Die URL bestimmt die Sprache. Fachsymbole, KaTeX-Darstellung und Einheitenwahl bleiben davon unabhängig.

## Accessibility

Semantische Landmarken, Skip-Link, geordnete Überschriften und vollständig beschriftete Formularfelder sind Pflicht. Hinweise und Fehler werden mit `aria-describedby` verbunden; `aria-invalid` kennzeichnet betroffene Felder. Fokus bleibt beim automatischen Rechnen an seiner Position. Ein knappes `aria-live="polite"` meldet abgeschlossene Änderungen ohne bei jedem Tastendruck den gesamten Rechenweg vorzulesen.

Alle Aktionen funktionieren mit Tastatur. Fokus ist sichtbar und nicht durch fixierte Navigation verdeckt. Bedienflächen sollen mindestens 44 × 44 CSS-px erreichen. Seiten funktionieren bei 320 CSS-px Breite und vergrösserter Schrift; Formeln erhalten bei Bedarf einen klar begrenzten horizontalen Scrollbereich statt Seitenüberlauf.

KaTeX gibt HTML und MathML aus. Schwierige Gleichungen erhalten zusätzlich eine sprachliche Erklärung. Diagramme benötigen Titel, Achsen inklusive Einheiten, Legende und eine Textzusammenfassung; eine zugängliche Datentabelle ist bei Kurven verfügbar. SVG erhält eine sinnvolle zugängliche Benennung; rein dekorative Teile werden ausgeblendet. Information darf nicht nur per Hover erreichbar sein. Animationen sind pausierbar, reduzierte Bewegung wird respektiert.

## Abnahme

Pro zentralem Ablauf: Tastaturprüfung, beide Themes, mobiles Layout, Zoom, Fehlerzustände und mindestens eine Screenreader-Stichprobe. Automatisierte Accessibility-Prüfung ergänzt diese Kontrolle. Die Diagrammbibliothek wird nicht als automatisch barrierefrei vorausgesetzt.
