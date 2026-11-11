# Technische Architektur

## Ausgangslage und Ziel

Stand: 29.10.2026. Die Spezifikation entstand auf Basis eines Repositorys mit nur einer README. Der erste beauftragte Umsetzungsschritt ist nun Home → Mechanics → Kinematics. Uniform Motion ist als erster Rechner implementiert und vorerst vom Nutzer als Referenz akzeptiert. Der verbindliche aktuelle UI-Stand und die gemeinsamen Änderungsstellen stehen in [MODEL_PAGE_STANDARD.md](MODEL_PAGE_STANDARD.md); weitere generische Komponenten bleiben Zielbild.

calcPhysics verbindet Theorie, nach verschiedenen Grössen auflösbare Formeln, automatische Folgeergebnisse und Visualisierungen. Das vom Betreiber beschriebene Konzept von elecalculate.com bleibt erhalten und wird um anspruchsvollere Mathematik erweitert. Die öffentliche [Referenzseite](https://elecalculate.com/) dient als Produktkontext; deren interner Code wurde nicht untersucht.

Bestätigt sind Englisch als Standardsprache mit deutscher Sprachoption im Footer und ein höheres mathematisches Niveau als Lehrlings-Grundformeln. Die Plattform richtet sich sowohl an Lernende als auch an Ingenieurinnen und Ingenieure für einfache Berechnungen in der Industrie. Gestufte Erklärungen reichen von elementarer Umstellung bis zur Differential- und Integralrechnung; mathematische Voraussetzungen werden je Thema benannt. Übungsaufgaben, Quiz, Bewertungen und Lernfortschritt gehören derzeit nicht zum Produktumfang. Zunächst keine Konten, Datenbank, Bezahlfunktionen oder CMS; dafür besteht noch kein bestätigter Bedarf.

## Technische Entscheidungen

| Bereich | Empfehlung | Begründung |
| --- | --- | --- |
| Anwendung | SvelteKit, TypeScript strict | Routing, HTML-Erzeugung und interaktive Komponenten in einem Projekt |
| Auslieferung | Öffentliche Inhalte vorab rendern; offizieller Netlify-Adapter | Schnelle, indexierbare Seiten; später gezielt Serverfunktionen möglich |
| Inhalte | Redaktionelle Svelte-Komponenten plus typisierte Metadaten | Formeln und didaktische Sonderfälle ohne eigenes CMS oder Markup-System |
| Mathematikdarstellung | KaTeX, statische Formeln beim Rendern | Theorie benötigt kein nachträgliches Browser-Rendering |
| Skizzen | SVG | Responsive, präzise und unmittelbar an Ergebnisse bindbar |
| Wissenschaftliche Diagramme | SVG für aktuelle Geraden; Plotly bei konkretem Mehrbedarf | Gemeinsames Achsenlayout ohne zusätzliche Laufzeit im Pilot |
| 3D | Three.js erst bei fachlichem Mehrwert | Keine zusätzliche 3D-Laufzeit für gewöhnliche 2D-Aufgaben |
| Prüfungen | Node-Testläufer für vorhandene Fachtests; Browserprüfungen soweit verfügbar | Keine zusätzliche Testabhängigkeit für reine TypeScript-Funktionen; Browser-Abnahme bleibt separat |

Keine Microservices, kein Monorepo und kein generischer Gleichungslöser im Einstieg. Stabile kompatible Versionen und Node-Version beim späteren Setup festlegen, Lockdatei einchecken. Die Dokumentation schreibt keine ungeprüften Paketversionen oder versionsabhängigen Konfigurationsdateien fest.

## Zielstruktur für spätere Erweiterungen

```text
AGENTS.md
docs/
src/
  lib/
    content/
      topics.ts                 # Stabile IDs, sprachabhängige Slugs und Metadaten
      en/                       # Englische Theorie; de/ erst mit Übersetzungen
      mechanics/kinematics/     # Redaktionelle Theorie-Komponenten
    i18n/                       # Locale-Regeln und UI-Wörterbücher (en und de)
    physics/
      quantities.ts             # Grössen, Dimensionen, SI-Konventionen
      units.ts                  # Umrechnung, einschliesslich Offsets
      constants.ts
      mechanics/kinematics/     # Reine fachliche Funktionen und deren Tests
      numerics/                 # Erst mit numerischen Anwendungsfällen
    calculators/
      types.ts
      registry.ts               # Metadaten und explizite lazy Loader
      mechanics/kinematics/     # Modi, Validierung, Ablauf, Rechenschritte
    components/
      layout/                   # Header, Navigation, Breadcrumbs
      ui/                       # Felder, Hinweise, Theme-Auswahl
      math/                     # KaTeX-Ausgabe
      calculator/               # Gemeinsame Rechneroberfläche
      topic/                    # Übersichts- und Themenseitenvorlage
    visualization/
      types.ts                  # Bibliotheksneutrale Datenmodelle
      svg/
      charts/                   # Plotly-Adapter
      three/                    # Erst bei erster echter 3D-Anwendung
    styles/                     # Tokens, Basis, Typografie
  routes/
    +layout.svelte
    +page.svelte
    [...topic]/+page.ts          # Registry-Auflösung und Prerender-Einträge
    [...topic]/+page.svelte      # Auswahl Übersicht oder Thema
    sitemap.xml/+server.ts
static/                         # Lokale Assets und robots.txt
tests/e2e/
```

Leere Zukunftsverzeichnisse müssen nicht vorab angelegt werden. Inhalts-, Physik- und Rechnerdateien werden thematisch gruppiert; kein npm-Paket pro Thema.

## Themen und Routing

Ein Themenbaum führt stabile ID, Eltern-ID, Slug-Segment, Titel, Kurzbeschreibung, Seitentyp und Publikationsstatus. Alle Eltern sind echte Übersichten. Englische Standardseiten erhalten URLs ohne Sprachpräfix. Aktuell liegen die Modellkarten unter `/mechanics/kinematics`; eigene Modellrouten sind kein Bestandteil der akzeptierten Referenz. Deutsche Seiten liegen unter `/de/` und verwenden dieselben sprachneutralen Themenpfade. Deutsche Umlaute werden für Slugs ausgeschrieben, sichtbare Titel behalten korrekte Schreibweise. Gross-/Kleinschreibung und abschliessende Slashes erhalten eine einheitliche Regel.

Oscillations & Waves führt Doppler Effect mit dem akustischen Dopplermodell. Der reine SI-Solver bestimmt aus drei Angaben eine der vier Grössen fₛ, fₒ, vₛ oder vₒ; c ist ein anpassbarer Mediumparameter. Der SVG-Wellenfrontenadapter verwendet dieselben validierten Ergebnisse.

Optics führt Total Internal Reflection mit einem Vorwärtsmodell für zwei positive Brechungsindizes und optionalen Einfallswinkel. Grenzwinkel und Strahlenskizze verwenden denselben reinen Solver; gleiche Indizes und der Grenzfall werden gesondert behandelt.

Modern Physics führt die Unterseite Quantum mit dem Qubit-Modell. Die interaktive Blochkugel wird separat im Browser geladen und nutzt eine eigene Perspektivprojektion von 3D-Koordinaten in SVG; für diesen begrenzten Fall ist keine 3D-Bibliothek nötig.

Der Baum umfasst Mechanik mit Kinematik und Dynamik sowie Thermodynamik, Elektrizität und Magnetismus, Schwingungen und Wellen, Optik und Moderne Physik. Die vom Auftrag genannten Unterthemen werden in der Roadmap geführt. Home zeigt alle sechs Hauptthemen als Kacheln; unveröffentlichte Themen erhalten deaktivierte Buttons mit «Coming soon». Mechanics enthält Kinematics und Dynamics. Electricity & Magnetism enthält neun Unterthemen aus der Elektrotechnik-Referenz mit 44 Modellen; Three-Phase Systems bündelt Stern, Dreieck und Generator. Definitionen liegen in `content/electricity.ts`, reine SI-Berechnung in `physics/electricity.ts`. Der gemeinsame `ElectricalCalculator` nutzt die vorhandenen Feld-, Einheiten- und Ergebnisbausteine. Die Kinematics-Seite enthält Uniform Motion, Uniformly Accelerated Motion, Vertical Throw und Horizontal Throw, die Dynamics-Seite Inclined Plane; alle verwenden die gemeinsame ausklappbare `ModelCard`. Ein Info-Button blendet die Theory mit KaTeX-Formel ein; Calculate enthält den ersten Rechner mit vier Feldern (s₀, s, v, t), direkter Präfixeingabe per Tastatur, automatischer Berechnung und drei signifikanten Ausgabestellen. Unveröffentlichte Themen erzeugen keine leeren indexierbaren Seiten. Unbekannte Pfade liefern HTTP 404; umbenannte veröffentlichte Pfade erhalten Weiterleitungen.

Registry und Routing sind getrennt: gemeinsame Vorlagen rendern alle Themen; explizite Lazy-Imports laden nur benötigte Theorie und Rechner. Die Catch-all-Route liefert vollständige Einträge für alle veröffentlichten Pfade an den Prerenderer. Navigation, Breadcrumbs und Sitemap entstehen aus demselben Baum. Build-Prüfungen erkennen doppelte Slugs, fehlende Eltern und ungültige Referenzen.

## Sprache und Lokalisierung

Englisch (`en`) bleibt die Standardsprache. Deutsch (`de`) ist über English / Deutsch im Footer verfügbar. Die URL bestimmt die Sprache; keine automatische Browser-Sprachumleitung. Beide Fassungen nutzen dieselben Seitenvorlagen, Themen-IDs, Solver und Einheiten. `/de` und `/de/<Themenpfad>` werden von derselben Catch-all-Route explizit als deutsche Seiten geladen und vorgerendert.

`lib/i18n/en.ts` enthält die englischen Bedienungstexte, `de.ts` die deutschen Übersetzungen und `text-de.ts` redaktionelle Inhaltsübersetzungen. Komponenten lesen über `runtime.ts` reaktiv die Sprache der aktuellen Anfrage; es gibt keinen veränderlichen globalen Sprachzustand. Reine Fachmodule importieren keine Svelte-Zustände. Noch fehlende Fachübersetzungen bleiben englisch und werden durch einen zentralen Hinweis auf deutschen Seiten kenntlich gemacht. Die vollständige Fachübersetzung ist offen.

Der Footer verlinkt die entsprechende Themenseite in der anderen Sprache. Beim Wechsel innerhalb der Themenroute bleiben Rechnerkomponenten und ihre lokalen Eingaben erhalten. Die deutsche Darstellung ändert keine Berechnungswerte. Punkt und Komma bleiben als Dezimaltrennzeichen zulässig; die mathematische Ausgabe bleibt vorerst sprachneutral.

HTML erhält das passende `lang`; Titel, Beschreibung, Breadcrumbs und zugängliche Beschriftungen folgen derselben Sprache. Jede Sprachfassung hat eine eigene kanonische URL. Sobald Übersetzungen veröffentlicht sind, verweisen reziproke `hreflang`-Alternativen für `en` und `de` auf vorhandene Fassungen; `x-default` zeigt auf die englische Standardfassung. Die Sitemap bildet die veröffentlichten Sprachfassungen ab.

## Komponenten und Datenfluss

Die folgenden Komponentenbezeichnungen beschreiben ein späteres Zielbild; die aktuellen Implementierungen und noch vorhandenen Bindungen nennt der Modellseitenstandard. `AppShell` enthält Navigation, Theme und Hauptbereich. `OverviewPage` zeigt Einordnung und Unterthemen. `TopicPage` enthält genau zwei Hauptbereiche: «Theory» mit Grundlagen, Formeln, Herleitungen und Modellgrenzen sowie «Calculate» mit Eingaben, Resultaten, Rechenweg und dynamischen Visualisierungen. `CalculatorPanel` setzt sich aus `ModeSelect`, `QuantityInput`, `UnitSelect`, `ResultList` und `CalculationSteps` zusammen. Spezielle Eingaben oder Skizzen kommen über typisierte Komponentenreferenzen hinzu.

Der lokale Controller verarbeitet: Rohtext → Parsing → Einheitenkonversion → Validierung → reine Berechnung → abhängige Berechnungen → Ergebnis- und Visualisierungsmodell → formatierte Darstellung. Die Physik importiert keine höheren Schichten. Komponenten enthalten keine Formelumstellungen. Gleichungen bleiben redaktionell erklärt; ein kleiner typisierter Rechnervertrag ersetzt keine allgemeine Formularsprache.

Zustand bleibt pro Rechnerinstanz. Keine nutzerspezifischen Daten in serverweiten Stores. Einheitenwechsel erhält die physikalische Grösse, ausser einer explizit konfigurierten Neueinlesung wie derzeit beim Geschwindigkeitsfeld v. Beim Zielgrössenwechsel wird ein früheres Ergebnis nicht stillschweigend zur Nutzereingabe.

## Zwei Nutzungswege: Nachschlagen und direkt berechnen

Beide Hauptbereiche liegen auf derselben indexierbaren Themenseite. Aktuell wird die Theorie innerhalb der Modellkarte unabhängig über ⓘ geöffnet; der Rechner ist ohne vorheriges Lesen oder Durcharbeiten der Theorie erreichbar. Eine zusätzliche Abschnittsnavigation ist nicht implementiert. Ein eigener Übungsbereich ist nicht vorgesehen. Erläuterte Beispiele und vorbelegte Demonstrationswerte sind Hilfen und keine zu lösenden Aufgaben; sie sind eindeutig als Beispiele erkennbar und lassen sich zurücksetzen.

Für den industriellen Alltag stehen schnelle Zielgrössenwahl, explizite Einheiten, nachvollziehbare Resultate und Folgewerte im Vordergrund. Modellannahmen und Gültigkeitsgrenzen sind auch direkt im Berechnungsbereich sichtbar. Vereinfachungen wie konstante Beschleunigung oder fehlender Luftwiderstand werden nicht erst in einer langen Herleitung genannt. Es entstehen keine getrennten Physikimplementierungen oder obligatorischen Lernabläufe für unterschiedliche Zielgruppen. Branchenspezifische Normen, Werkstoffdatenbanken und umfassende Auslegungsverfahren sind damit nicht automatisch zugesagt.

## Rechnervertrag und Folgeergebnisse

Ein `CalculatorDefinition` beschreibt ID, Modellversion, Eingabegrössen, Einheiten, Modi, Standardbeispiel und Resolver. Jeder Modus benennt Zielgrösse, erforderliche Eingaben und zulässige Ergebniszweige. Die konkrete Resolver-Funktion bleibt normales TypeScript und wird separat getestet.

Ein Resultat ist eine diskriminierte Union: `success`, `incomplete`, `invalid`, `no-solution`, `multiple-solutions` oder bei Numerik `non-convergent`. Erfolg enthält SI-Werte, Herkunft, Modellannahmen, strukturierte Rechenschritte und optionale Diagrammdaten. Fehlermeldungen verwenden stabile Codes und Feldbezüge; lokalisierte Texte entstehen in der Darstellung. `0` ist ein Wert, kein fehlendes Feld.

Beispiel gleichförmige Bewegung: Modi für `s = v · t`, `v = s / t` und `t = s / v`, jeweils mit eigenen Definitionsbereichen. Folgeergebnisse innerhalb eines Rechners werden als explizite gerichtete Abhängigkeiten beschrieben und topologisch berechnet. Zyklen sind Definitionsfehler. Gleichungssysteme werden später als eigener fachlicher Solver modelliert und nicht durch wiederholtes Durchlaufen eines Zyklus angenähert.

Jeder Wert ist entweder eine direkte Eingabe, eine dokumentierte Konstante oder abgeleitet. Ableitungen referenzieren Ursprungswerte, Berechnungsmodus und Modellversion. Ändert sich eine Quelle, wird der abhängige Teil neu berechnet; bei ungültigen Quellen werden alle Nachfolger ungültig. Konfligierende manuelle und berechnete Werte werden nicht still überschrieben.

Im MVP funktionieren Folgeergebnisse innerhalb eines Themas. Themenübergreifende Übergaben folgen als explizite Aktion «Als Eingabe übernehmen»: nur bei kompatibler Dimension und physikalischer Bedeutung, mit Herkunftsanzeige. Gleiche Dimension allein genügt nicht, etwa bei Energie und Drehmoment. Keine automatische Kopplung allein über Symbolnamen. Ein seitenübergreifender Arbeitsbereich mit persistenten Verknüpfungen ist eine spätere Produktentscheidung.

## Differential- und Integralrechnung

Zuerst bekannte analytische Modelle: `x(t) = x₀ + v₀t + ½at²`, `v(t) = dx/dt`, `a(t) = dv/dt`; Ortsänderung aus dem bestimmten Integral der Geschwindigkeit. Herleitung und numerische Auswertung sind getrennt, aber fachlich gemeinsam getestet.

Später werden ausgewählte numerische Verfahren hinter kleinen reinen Funktionen ergänzt: bestimmte Integration, Nullstellensuche und erst bei Bedarf Differentialgleichungen. Jeder Algorithmus erhält Grenzen, Toleranzen, Abbruchbedingungen und Konvergenzstatus. Details stehen in den Physikstandards. Ein allgemeines symbolisches Differenzieren oder Integrieren beliebiger Eingaben ist kein MVP-Ziel. Falls freie Funktionen später benötigt werden, folgt zuerst eine Produktentscheidung über erlaubte Syntax und Funktionsumfang.

## Visualisierungsarchitektur

Rechner liefern SI-Datensätze mit Grössen-IDs, Dimensionen, Achsenbereichen und Ereignissen. Adapter übersetzen diese in SVG- beziehungsweise Plotly-Eigenschaften. Darstellungs-Sampling ersetzt nicht die fachliche Lösung und rundet keine Berechnungswerte.

SVG verwendet `viewBox`, mathematisch dokumentierte Koordinaten, explizite Einheiten und einen gegebenenfalls als schematisch gekennzeichneten Massstab. Plotly wird erst beim benötigten Diagramm im Browser importiert; ein Basisbundle für kartesische Kurven ist der Startpunkt. Theorie und Seiten-SSR bleiben aktiv. Resize-Beobachtung und Aufräumen von Diagrammen gehören in den Adapter.

Ein gemeinsamer lokaler Zeitparameter synchronisiert Skizze, Diagrammcursor und Werte. Animation verwendet `requestAnimationFrame`, pausiert ausserhalb des Sichtbereichs und hat Start, Pause und Zurücksetzen. Keine automatische Bewegung bei reduzierter Bewegung. Three.js kommt nur bei räumlichem Lernziel hinzu, ebenfalls lazy, mit Ressourcenfreigabe und 2D-/Textalternative. Numerik kann später bei nachgewiesenem Hauptthread-Problem in einen Worker verschoben werden; veraltete Antworten werden über Request-IDs verworfen.

## SEO, Performance und Sicherheit

Theorie, Formeln, Seitentitel und Navigation stehen im vorgerenderten HTML. Pro Seite: eindeutiger Titel, Beschreibung, kanonische URL, genau eine H1, sinnvolle Überschriften und Breadcrumbs. Canonical-Basis ist zentral auf `https://calcphysics.com` festgelegt; Umsetzung und mobile Messung siehe [SEO.md](SEO.md). Rechnerparameter erzeugen keine eigenen indexierbaren Varianten. Sitemap enthält nur veröffentlichte kanonische URLs. Strukturierte Daten nur passend zum tatsächlichen Inhalt, keine erfundenen Bewertungen.

Keine vollständige Plotly-/Three-Laufzeit im globalen Layout. Fonts und KaTeX-Assets lokal bereitstellen, Layoutflächen reservieren. Planungsziele: initiales JavaScript ohne optionale Visualisierungen höchstens 150 kB gzip; optionales Diagrammchunk separat messen und vor MVP-Freigabe budgetieren. Kernrechner reagieren auf Zielgeräten innerhalb von 100 ms; teure Aufgaben begrenzen und abbrechen. Feldziele am 75. Perzentil: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Vor ausreichendem Traffic dienen reproduzierbare mobile Labormessungen als Näherung.

Kein `eval` und keine Ausführung von Formeleingaben. KaTeX mit deaktiviertem Vertrauen in gefährliche Befehle; Renderingfehler sichtbar behandeln. URL-Eingaben validieren und begrenzen. Redaktionelle Inhalte sind vertrauenswürdiger Repository-Code; ungeprüftes HTML aus fremden Quellen wird nicht übernommen. Persistenz und Analytics sind nicht vorausgesetzt.

## Entwicklung und Auslieferung

Ein GitHub-Repository, überschaubare Branches und überprüfbare Pull Requests. CI prüft später Typen, Fachtests und Produktionsbuild. Netlify stellt Vorschauen und nach Freigabe die Produktionsauslieferung bereit. Vorschauen werden nicht indexiert. Für öffentliche Theorie reicht statische Ausgabe; Serverfunktionen werden nur für konkrete spätere Anforderungen verwendet. Keine Veröffentlichung im Spezifikationsauftrag.

## Referenzen

- [SvelteKit: Rendering und Prerendering](https://svelte.dev/docs/kit/page-options)
- [SvelteKit: Adapter](https://svelte.dev/docs/kit/adapters) und [offizieller Netlify-Adapter](https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/80-adapter-netlify.md)
- [KaTeX: Ausgabeoptionen und MathML](https://katex.org/docs/options.html)
- [Plotly: wissenschaftliche Diagramme](https://plotly.com/javascript/scientific-charts/) und [Teilbundles](https://github.com/plotly/plotly.js)

Die Entscheidungen sind projektspezifische Empfehlungen; vor dem Setup sind aktuelle kompatible Versionen und die zugehörige Konfiguration erneut zu prüfen.

## Implementierter Pilot und gemeinsame Weiterentwicklung

Der [Modellseitenstandard](MODEL_PAGE_STANDARD.md) dokumentiert die aktuelle Referenz einschliesslich Zahlen-/Einheitenverhalten, Rechenschritten, Diagrammen und zentraler Änderungsstellen. Die [Quellcode-Arbeitsregeln](../src/AGENTS.md) schreiben deren Wiederverwendung vor. Keine Seitenkopien und keine doppelten Einheitenlisten, Parser oder Achsenformatierer anlegen.

Aktuell gemeinsam nutzbar sind unter anderem `Formula`, `UnitSelect`, `ThemeToggle`, `MotionChart`, der Einheitenkatalog, Zahl-/Präfixformatter sowie der Achsen- und Dauerformatter. Die Bindung von `ModelCard` an den Pilot ist gelöst: `ModelHost` ordnet Rechner zu, typisierte Modelldaten und Snippets füllen die Karte. `QuantityField`, `CalculatorShell`, `CalculatorTools`, `EquationBlock` und `styles/calculator.css` führen Feld-/Ergebnisdarstellung samt Styles gemeinsam. Neue Modellinhalte, Solver und Datenadapter bleiben separat. Kein allgemeiner Gleichungslöser oder Formularframework ist dafür erforderlich.

Uniform Motion löst `s = s₀ + v · t` mit drei bekannten Werten nach dem vierten auf. Bei zwei Eingaben aus s/v/t gilt sichtbar s₀ = 0. Manuelle Rohwerte, validierte SI-Werte und reine Anzeigeformatierung sind getrennt. Nur Ergebnisse werden auf drei signifikante Stellen gerundet dargestellt; auch die Anzeige der Einsetzung und Konversion nutzt drei Stellen, ohne Zwischenrundung im Solver.

Die SVG-Diagramme s(t) und v(t) nutzen ungerundete Solver-Endpunkte. Ihre schematischen Kurven bleiben bei fehlendem Ergebnis sichtbar, die numerische Skala erscheint nur bei gültigen Werten. Es gibt keine Diagrammtabelle. Für diese Geraden genügt SVG; eine umfangreiche Diagrammbibliothek wird erst durch konkrete zusätzliche Anforderungen begründet.

## SI-Referenz

`/si-units-and-constants` ist eine Referenzseite ohne Rechner und der erste Einstieg auf Home. Die Themenregistry liefert Route, Navigation und SEO. `SiReference.svelte` stellt sieben Basiseinheiten, 22 benannte abgeleitete Einheiten, wichtige weitere Einheitenbeziehungen und ausgewählte Konstanten aus `content/si-reference.ts` mit dem gemeinsamen KaTeX-Baustein dar. Diese Anzeigedaten sind keine zweite Umrechnungsregistry; Rechner verwenden weiterhin `physics/units.ts`. Quellen: BIPM SI Brochure v4.01 und NIST CODATA 2022, direkt auf der Seite verlinkt.
