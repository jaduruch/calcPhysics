# calcPhysics – Arbeitsregeln

## Auftrag und Stand

calcPhysics ist eine Physik-Lern- und Berechnungsplattform mit Englisch (`en`) als Standardsprache. Deutsch (`de`) ist gleichwertig und bei neuen oder geänderten Inhalten vollständig mitzuführen. Die deutschen UI- und Fachkataloge sind vollständig mit Übersetzungen belegt und werden durch `tests/localization.test.mjs` geprüft. Neu entdeckte Resttexte sind Fehler, keine akzeptierte Ausweichdarstellung. Projektdokumentation bleibt Deutsch.

Das Bedienkonzept von elecalculate wird auf mathematisch anspruchsvollere Physik erweitert: bekannte Grössen eingeben, zulässige Umstellungen und bestimmbare Teilresultate automatisch berechnen, Einheiten wählen und den Rechenweg nachvollziehen. Fachliche Herleitungen gehören zum Produkt. Zielgruppen sind Lernende auf höherem mathematischem Niveau und Ingenieurinnen und Ingenieure für einfache Berechnungen im industriellen Alltag. Keine Festlegung auf eine einzelne Schulstufe oder einen pauschalen Hochschulvollumfang.

### Implementierter Stand – 17.11.2026

Home zeigt die sechs aktiven Hauptthemen, eine hervorgehobene SI-Referenz und eine lokale Suche über die gesamte veröffentlichte Seite. Treffer erscheinen als Linkpillen mit vollständigem Themenpfad. Die Themenregistry und `model-groups.ts` sind die Quelle für den tatsächlichen Umfang; Quellbeziehungen, registrierte Definitionen und sichtbare Karten nicht gleichsetzen.

| Hauptthema | Vorhandene Unterthemen |
| --- | --- |
| Mechanics | Kinematics; Dynamics; Fluid Statics; Fluid Flow; Rotation; Work, Energy & Power; Kepler’s Laws; Hooke’s Law; Momentum Conservation |
| Thermodynamics | Ideal Gases; Temperature; Thermal Expansion; Heat & Calorimetry; Fuels & Heating; Heat Transfer |
| Electricity & Magnetism | Direct Current; Alternating Current; Magnetism; Capacitors; Inductors; Resonant Circuits; Gain & Attenuation; Filters; Three-Phase Systems |
| Oscillations & Waves | Doppler Effect; Wave Propagation; Sound Sources; Interference & Beats; Sound Levels |
| Optics | Total Internal Reflection; Mirrors & Lenses; Refraction; Parallel Plates; Prisms; Light & Photometry; Fiber Optics |
| Modern Physics | Quantum mit Qubit-Simulator und eigener interaktiver 3D-Blochkugel |

Verbindliche aktuelle Entscheidungen:

- Uniform Motion bleibt die akzeptierte Designreferenz. Modellkarten starten geschlossen; Theorie öffnet über ⓘ ohne sichtbaren Theory-Titel. Gemeinsame Komponenten statt kopierter Seiten.
- Kinematics enthält fünf Karten: Uniform Motion, Uniformly Accelerated Motion, Projectile Motion, Free Fall, Velocity Components. Die eine Wurfkarte integriert die früheren Wurfmodelle; keine Vertical-/Horizontal-Throw-Karten und keine Schnellwahl für Sonderfälle. Bei negativen Abwurfwinkeln keine Scheitelgrössen berechnen oder ausgeben.
- Dynamics enthält vier Karten. Inclined Plane ist ein kombinierter Rechner mit 14 Eingaben; Geometrie, Beschleunigung und Geschwindigkeit bleiben unabhängig von einer Masse bestimmbar. Reibung gilt für bereits hangabwärts gleitende Körper, keine Haftreibung. Der Flaschenzug besitzt eine dynamische Seilführungsskizze.
- Hooke’s Law enthält Hookesches Gesetz, Federpendel und kreisendes Federpendel. Letzteres ist das schräge Federpendel mit horizontaler Kreisbahn aus der bereitgestellten Aufgabe 1.
- Die Seite `/mechanics/momentum` enthält in genau dieser Reihenfolge vier eigenständige aufklappbare Karten: **Momentum Conservation, Inelastic Collision, Elastic Collision, Rocket Equation**. Kein Dropdown innerhalb der Impulskarte und keine separaten Stoss-Unterthemen. Die alten Stossadressen leiten auf die entsprechende Karte weiter.
- Kepler’s Laws enthält drei Karten. Das erste Gesetz hat 15 Eingaben, das dritte neun. Exzentrizität als ε; drehbare eigene Kegelschnitt-/Ellipsengrafik, Zeitintervall und Bahnphase, Play/Pause bei der Phase. Regler höchstens so breit wie die Grafik; Schnittebene ohne Rand und Achsenbeschriftungen beim Drehen nicht markierbar. Das Desmos-Modell stammt vom Nutzer; keinen öffentlichen „Original model“-Link hinzufügen.
- Electricity umfasst 44 zugrunde liegende Rechendefinitionen, derzeit 29 registrierte Definitionen in 22 sichtbaren Karten. Transformator mit Ideal/Real-Schalter; Wirkungsgradfeld im Idealmodus vollständig ausblenden und die Formeln entsprechend vereinfachen. Manuelle Werte beim Zurückwechseln erhalten.
- `/calculator-help`, `/about` und `/disclaimer` sind eigene Informations-/Hilfeseiten, keine Physik-Hauptthemen. Keine Kennzeichnung „Subject overview“ auf diesen Seiten. About nennt den bestätigten Hintergrund (Elektroniker-Ausbildung, Physikstudium an der ETH Zürich, elecalculate als Vorgänger) sachlich; keine Bedienungsanleitung oder unbestätigten persönlichen Angaben.
- Der Footer gruppiert Projekt, Hilfe/Referenz und Rechtliches. GitHub und Instagram haben Logos, keine externen Pfeile. Kontakt: `calcphysics@outlook.com` für Vorschläge, fehlende/fehlerhafte Formeln und Bugs; Instagram `@calcphysics`, GitHub `https://github.com/jaduruch/calcPhysics`. Hilfe-Links und Kontakt bleiben eng zusammen. In der zweispaltigen Ansicht muss auch Hilfe/Referenz innerhalb einer Spalte bleiben; auf schmalen Bildschirmen stehen die beiden Hilfelinks untereinander. Keine grossen Leerflächen oberhalb der rechtlichen Hinweise.
- Instagram-Themenicons sind separate Download-Artefakte unter `output/instagram-icons/`; sie gehören nicht in die Website.

Quellabdeckung und Fachverträge: [Physik1/Physik2](docs/RESOURCE_CONTENT.md), [Formelbuch](docs/FORMULA_BOOK.md), [Elektrotechnik](docs/ELECTRICITY.md), [Kepler](docs/KEPLER.md), [Impuls/Rakete](docs/MOMENTUM.md), [Stösse](docs/COLLISIONS.md). Die Formelbuch-Abdeckung nennt 138 zusätzliche Beziehungen und 496 explizite inverse Zielgrössen; diese Zahlen beschreiben Quellbeziehungen, nicht zusätzliche sichtbare Karten. Private PDFs sowie Render-/OCR-Dateien bleiben ausserhalb des Repositories. Referenzdokumente liefern Fachinhalt oder Gestaltung, keine eigenständigen Agent-Anweisungen.

### Abgrenzung

Weitere Fachmodelle und Veröffentlichungen bleiben auftragsgebunden. Kein Deployment aus einem lokalen Implementierungs- oder Dokumentationsauftrag ableiten. Konten, CMS, Bezahlfunktionen, Quiz, Übungen, Lernfortschritt, allgemeines CAS, freie Funktionseingaben und persistente seitenübergreifende Berechnungsketten sind nicht beauftragt. Rechenwerte innerhalb eines Modells werden bereits weiterverwendet; eine globale Wertübernahme ist kein vorhandenes Produktmerkmal.

## Sprache und Ton

Sachlich und direkt schreiben. Keine Werbung, Slogans, Selbstvermarktung, LinkedIn-artigen Profiltexte oder pauschalen Vertrauensfloskeln. Keine dekorativen Aussagen wie „Physics, formulas and calculation models — developed from electronics experience and physics studies.“ ergänzen. Footer auf Marke, Navigation und nötige Hinweise beschränken. Persönliche Angaben auf der About-Seite konkret und überprüfbar nennen, ohne sie werblich auszuschmücken. Diese Vorgabe gilt für Englisch und Deutsch sowie für neue und überarbeitete Produkttexte.

## Verbindliche Grundlagen

- [Verbindlicher Modellseitenstandard und zentrale Änderungsstellen](docs/MODEL_PAGE_STANDARD.md)
- [Implementierungsregeln für src/](src/AGENTS.md)
- [Architektur](docs/ARCHITECTURE.md)
- [Designsystem](docs/DESIGN_SYSTEM.md)
- [Physikalische Standards](docs/PHYSICS_STANDARDS.md)
- [Roadmap](docs/PROJECT_ROADMAP.md)

Aktuelle ausdrückliche Nutzervorgaben haben Vorrang. Diese AGENTS-Dateien halten die daraus abgeleiteten verbindlichen Regeln fest; ältere Beschreibungen dürfen sie nicht stillschweigend zurücksetzen. Der Modellseitenstandard hält die akzeptierten UI-Entscheidungen fest; ältere Architekturentwürfe dürfen diese nicht stillschweigend zurücksetzen. Die Architektur unterscheidet vorhandene Implementierung und künftiges Zielbild. Bei Änderungen widersprüchliche Aussagen ersetzen, statt weitere historische Varianten anzuhängen. Keine zusätzliche Infrastruktur ohne konkreten Bedarf.

## Änderungen für alle Seiten an einer Stelle

Bestehende gemeinsame Komponenten und Farb-/Einheiten-/Formatierungsquellen wiederverwenden; Modellseiten nicht kopieren. Die Tabelle in `docs/MODEL_PAGE_STANDARD.md` nennt konkrete Änderungsstellen. Für neue Modelle dürfen nur Fachinhalte, Solver, modellabhängige Konfiguration und Datenadapter hinzukommen. Gemeinsame Layout-/Feld-/Menü-/Diagrammgestaltung zentral ändern.

Die gemeinsame Basis ist seit dem zweiten Modell umgesetzt: `ModelCard` erhält Theorie-Daten und einen Rechner-Snippet; `ModelHost` ordnet Rechnerkomponenten zu. `QuantityField`, `CalculatorShell`, `CalculatorTools` und `EquationBlock` samt `styles/calculator.css` werden modellübergreifend genutzt. Weitere gemeinsame Änderungen dort vornehmen, nicht in jedem Rechner separat. Modellzahl, Feldanzahl und Gleichungen bleiben fachabhängig.

Nur Quellcode ändern: niemals `build/`, `.svelte-kit/`, `.netlify/` oder generierte Dateien mit Hashnamen bearbeiten. Dokumentation darf auf Quellen, nicht auf einen bestimmten Build-Hash verweisen.

## Verbindlicher Umfang jedes Rechners

Diese Anforderungen gelten für neue und geänderte Rechner. Sie beschreiben den verbindlichen Zielstand; daraus darf nicht abgeleitet werden, dass alle bestehenden Modelle bereits vollständig entsprechen. Bestehende Lücken im bearbeiteten Umfang beheben und verbleibende Grenzen konkret benennen. Neue Fachmodelle und Veröffentlichungen bleiben auftragsgebunden.

- **Alle möglichen Eingabegrössen:** Jede im beauftragten Modell fachlich als bekannte Grösse verwendbare Variable muss als manuelle Eingabe beziehungsweise wählbare Zielgrösse zugänglich sein. Eine bisher nur ausgegebene Geschwindigkeit, Höhe, Kraft oder andere Modellgrösse darf nicht allein deshalb von der Eingabe ausgeschlossen bleiben. Feste mathematische/physikalische Konstanten von veränderlichen Modellparametern unterscheiden; keine zusätzlichen physikalischen Effekte ohne Auftrag erfinden.
- **Alle zulässigen Umstellungen:** Nach jeder variablen Grösse explizit auflösen, soweit mathematisch und physikalisch möglich. Zulässige positive/negative Zweige und mehrere Lösungen berücksichtigen. Nicht eindeutige, unmögliche oder singuläre Fälle sichtbar unterscheiden; keinen beliebigen Wert einsetzen. Sichtbare Standardannahmen dürfen eine ausdrücklich gesuchte Grösse nicht blockieren.
- **Alles berechnen, was bestimmbar ist:** Aus den vorhandenen validierten Angaben sämtliche eindeutig bestimmbaren Grössen und zulässigen Lösungszweige berechnen, einschliesslich weiterer dadurch bestimmbarer Grössen. Jedes Teilergebnis benötigt nur seine eigenen Abhängigkeiten. Fehlende Masse darf beispielsweise Geometrie, Beschleunigung oder Geschwindigkeit nicht sperren, wenn sie darin nicht vorkommt.
- **Teilresultate erhalten:** Unvollständige oder ungültige Angaben sperren nur Ergebnisse, die davon tatsächlich abhängen. Andere fachlich gültige Teilresultate bleiben sichtbar; betroffene Resultate und ihre Grafikteile neu berechnen oder verwerfen. Zusätzliche Angaben auf Widersprüche prüfen und die betroffenen Grössen kennzeichnen. Keine veralteten oder widersprüchlichen Resultate als gültig anzeigen.
- **Bekannte und gesuchte Werte trennen:** Nur manuelle Rohwerte in Eingabefeldern. Berechnete Werte und Annahmen gehören in den Rechenweg beziehungsweise an die sichtbare Parameterannahme, nicht automatisch in leere Felder. Einheiten- und Moduswechsel erhalten die manuellen Eingaben.
- **Zusammengehörendes bündeln:** Gleichwertige Formeln und eng verwandte Berechnungen in einer Modellkarte zusammenfassen. Gemeinsame Felder und Zustände nutzen; sinnvolle Varianten innerhalb der Karte umschalten. Keine eigene aufklappbare Karte pro Umstellung und keine zusätzlichen verschachtelten Dropdowns ohne fachlichen Bedarf. Ausdrücklich bestätigte Kartenstrukturen wie die vier Karten auf der Impulsseite haben Vorrang vor dieser allgemeinen Bündelungsregel.

## Grafiken und Bezug zu Eingaben

- Jede Modellkarte erhält eine fachlich passende Grafik zur Geometrie, zu Kräften, Zusammenhängen oder Verläufen. Sie gehört unter die Ergebnisse und verwendet dieselben validierten ungerundeten Solverwerte. Bevorzugt eigenes responsives SVG; 3D nur mit fachlichem Mehrwert, wie beim Kepler-Kegelschnitt. Keine dekorativen Bilder als Ersatz für modellgebundene Darstellungen.
- Grafiken reagieren auf alle zugehörigen Eingaben, auch auf bereits bestimmbare Teilgrössen. Fehlende Angaben dürfen eine bekannte Geometrie nicht unnötig auf eine beliebige Standardzeichnung zurücksetzen. Tatsächlich unbekannte Werte bleiben ausdrücklich schematisch; keine erfundenen Messwerte, Zahlenachsen oder Kraftbeträge.
- **Auswahl/Fokus:** Bei einem aktiven Eingabefeld oder einer bewusst ausgewählten Zielgrösse bleibt das zugehörige Grafikelement kontrastreich hervorgehoben; nicht zugehörige Elemente werden ausgegraut. Dafür zentral `--color-diagram-muted` verwenden: im Hellmodus hellgrau, im Dunkelmodus dunkelgrau. Zugehörige Linien, Flächen, Pfeile, Symbole und Beschriftungen gemeinsam behandeln. Keine zweite Palette und keine pauschale Transparenz auf der gesamten Grafik.
- Eingabefokus hat Vorrang vor einer vorhandenen Zielauswahl. Die Zuordnung gilt bei Tastatur, Maus und Touch, auch während der Bedienung des zugehörigen Einheitenmenüs. Nach Verlassen des Felds folgt die Darstellung wieder der Zielauswahl oder dem normalen Diagrammzustand. Hervorhebung verändert keine Rechenwerte oder physikalischen Proportionen.
- Auswahl nicht ausschliesslich über Farbe erklären; eindeutige Beschriftungen und bei Bedarf Kontur/Linienart sowie zugängliche Beschreibungen beibehalten. Nullkräfte nicht als Pfeile erfinden. Verhältnis, Normierung, Projektion und schematische Vereinfachung korrekt benennen.

## Entwicklung nach Freigabe der Implementierung

- Englisch (`en`) bleibt die Standardsprache. Deutsch (`de`) ist eine vollständig gepflegte Produktsprache, keine spätere Zusatzoption. Neue und geänderte Bedienung, Fachtexte, Variablen-/Einheitennamen, Fehler, Annahmen, Ergebnisbeschriftungen, Grafiken, ARIA-Texte und Metadaten vollständig auf Deutsch pflegen; die englische Fassung (`en`) konsistent halten. Fachlogik sprachneutral und Inhalte über stabile Themen-IDs verknüpfen. Vorhandene Übersetzungslücken benennen und im bearbeiteten Umfang schliessen; der bestehende englische Fallback rechtfertigt keine neuen unübersetzten Texte. Projektdokumentation bleibt Deutsch.
- SvelteKit und TypeScript im Strict-Modus; zentrale CSS-Tokens statt paralleler Styling-Systeme.
- Visuelle Referenz ist die bereitgestellte `Qubit_Demo/main/portal.html`: exakte Hell-/Dunkel-Flächenfarben und blaue Akzente gemäss `docs/DESIGN_SYSTEM.md`. Formeln weiterhin mit KaTeX, nicht mit manuellen HTML-/CSS-Brüchen.
- Physik und numerische Verfahren als reine TypeScript-Funktionen ohne Svelte, DOM, KaTeX oder Diagrammbibliotheken. Kein veränderlicher globaler Rechnerzustand.
- Eingaben an der Grenze zentral parsen, validieren und nach SI konvertieren. Zahlenfelder akzeptieren auch begrenzte skalare Ausdrücke mit `() + - * / ^` und Präfixen je Zahl; `1k + 1m` bedeutet `1000.001`. Rohtexte bleiben erhalten. Die gewählte Einheit gilt für den ausgewerteten Ausdruck; keine modellabhängigen Ausdrucksparser und kein `eval`. Winkeleingaben starten standardmässig mit Grad (°); Radiant (rad) bleibt im Einheiten-Dropdown verfügbar. Die zentrale Eingabevoreinstellung ist von der internen SI-Einheit rad getrennt. Intern ungerundet rechnen; erst zur Ausgabe formatieren.
- Messwerte in Formeln und Resultaten mit geeigneten SI-Massvorsätzen und drei signifikanten Stellen darstellen. Angezeigte Rundungen niemals zurück in Solver oder Diagramme führen. Numerische Einsetzungen nur mathematisch nötig klammern und implizite Produkte mit `\cdot` eindeutig setzen.
- Jede Formel hat dokumentierte Voraussetzungen, Definitionsbereiche, Einheiten und fachliche Tests. Nichtendliche Zahlen niemals als gültige Ergebnisse ausgeben.
- Formelumstellungen und fachliche Abhängigkeiten explizit in reinen Funktionen implementieren. Kein `eval`, keine willkürliche Skriptausführung und kein allgemeines CAS.
- Rechner über typisierte Definitionen und gemeinsame UI ergänzen. Den akzeptierten Modellseitenstandard und die untergeordneten `src/AGENTS.md` beachten. Neue Themen sollen keine kopierten Seiten benötigen.
- Indizes in Eingabefeldern und Theorievariablen werden zentral über `QuantitySymbol` als Inline-KaTeX tiefgestellt. In Metadaten `t_{peak}` oder `v_{y,impact}` verwenden; sichtbare Unterstriche und das Entfernen von Indexmarkierungen sind unzulässig. Interne IDs und Solver-Schlüssel bleiben davon unabhängig.
- Formeln, Rechenweg und Visualisierungen verwenden dieselben validierten Ergebnisse. Keine zweite Physikimplementierung in Komponenten.
- Gemeinsame Schaltungsdiagramme bleiben quelleneigene SVG-Komponenten. Widerstände einheitlich als leicht gerundete Rechtecke mit gleicher Kontur-/Leitungsstärke zeichnen; Auswahlzustände verwenden Theme-Tokens: nicht Gewähltes im Hellmodus hellgrau, im Dunkelmodus dunkelgrau, Gewähltes neutral kontrastreich. Keine statischen Electricity-Referenzbilder wieder einführen.
- Bei Eingabeänderungen betroffene Abhängigkeiten vollständig neu auswerten. Gültige unabhängige Teilresultate bleiben verfügbar; veraltete Resultate verwerfen.
- Tastaturbedienung, semantisches HTML, beide Farbschemata und reduzierte Bewegung bei jeder UI-Änderung berücksichtigen.
- Theorie und Navigation bleiben ohne JavaScript lesbar. Browserabhängige Diagramme und 3D isolieren und bedarfsgerecht laden.

## Qualität und Zusammenarbeit

Änderungen klein und nachvollziehbar halten. Bestehende Nutzeränderungen respektieren. Keine Secrets, personenbezogenen Eingaben oder generierten Build-Artefakte committen. Neue Pakete müssen einen belegbaren Bedarf erfüllen.

Verbindliche Prüfungen bei Rechner- und gemeinsamen Komponentenänderungen: Typprüfung/Svelte-Prüfung, fachliche Unit-Tests, Produktionsbuild und bei geänderten Nutzerabläufen gezielte Browserprüfungen. Aktuelle Befehle: `npm run check` und `npm run build`; Start mit `npm run dev`. `npm test` prüft die Fachlogik und Präfixformatierung mit dem eingebauten Node-Testläufer. Neue Modelle nur im beauftragten Umfang ergänzen. Alle zugänglichen Zielgrössen, zulässigen minimalen Eingabekombinationen, massenunabhängigen Teilresultate, Mehrfachlösungen, Widersprüche und Invalidierung prüfen. Bei Grafikänderungen zusätzlich Eingabefokus/Zielauswahl, Ausgrauung und Rückkehr zum Normalzustand mit Tastatur, Maus/Touch sowie beide Themes und Mobil/Laptop prüfen. Fehlerfälle und fachliche Grenzfälle sind wichtiger als reine Snapshot-Tests. Reine Dokumentänderungen benötigen Konsistenz- und Linkprüfung, keinen Produktionsbuild.

Bei Unklarheiten oder Zweifeln immer nachfragen, bevor die davon abhängige Änderung umgesetzt wird. Das gilt besonders für Begriffe, fachlichen Umfang und die Unterscheidung von Hauptthema, Unterseite, aufklappbarer Modellkarte und Auswahl innerhalb einer Karte. Nicht stillschweigend aus „Dropdown“ eine Variantenwahl oder aus einem mehrdeutigen Begriff ein neues Fachgebiet ableiten. Eindeutig beauftragte, davon unabhängige Arbeiten können weiterlaufen. Gesicherte Angaben aus Code und bestätigten Nutzervorgaben erfordern keine erneute Bestätigung.
