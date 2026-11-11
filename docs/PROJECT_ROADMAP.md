# Projekt-Roadmap

## Phase 0 – Spezifikation und Produktabgleich

Lieferumfang sind `AGENTS.md` und die vier Dokumente in `docs/`. Noch kein Setup, keine Installation und keine Website. Bestand: nur README, keine technische Migration nötig.

Bestätigt: Englisch ist die Standardsprache; Deutsch folgt später als Sprachoption.

Bestätigt: Das Prinzip von elecalculate.com bleibt – nach unterschiedlichen Grössen auflösen und mit Ergebnissen weiterrechnen. calcPhysics soll mathematisch anspruchsvoller werden und Differential-/Integralrechnung nachvollziehbar einführen.

Bestätigte Zielgruppen: Lernende auf höherem mathematischem Niveau und Ingenieurinnen und Ingenieure für einfache physikalische Berechnungen in der Industrie. Jedes Thema bietet die zwei Hauptbereiche «Theory» und «Calculate». Übungsaufgaben, Quiz und Lernfortschrittsfunktionen sind derzeit nicht vorgesehen. Voraussetzungen und fachliche Tiefe werden je Thema festgelegt, statt die ganze Plattform auf eine einzelne Schulstufe zu begrenzen.

Weitere Entscheidungen erst vor der betreffenden Phase: seitenübergreifende gespeicherte Berechnungsketten, freie Funktionseingaben und Produktionsdomain. Diese Fragen blockieren die technischen Grundlagen nicht. Konten, CMS und Monetarisierung sind nicht eingeplant.

Abnahme: nachvollziehbare Architektur, dokumentierte Annahmen und ein vereinbarter erster vertikaler Anwendungsfall.

## Aktueller Stand und nächster Erweiterungsschritt

Lokales Grundgerüst Home → Mechanics → Kinematics ist vorhanden. Home führt alle Hauptthemen; Mechanics, Thermodynamics, Electricity & Magnetism, Oscillations & Waves, Optics und Modern Physics sind aktiv. Optics führt Total Internal Reflection mit Grenzwinkel und Strahlenskizze. Oscillations & Waves führt Doppler Effect mit einem akustischen Modell und animierten Wellenfronten. Modern Physics führt Quantum mit dem Qubit-Simulator und animierter 3D-Blochkugel. Thermodynamics ist eine Themenübersicht mit der Unterseite Ideal Gases und dem ersten Modell Ideal Gas Law. Mechanics enthält Kinematics mit Uniform Motion, Uniformly Accelerated Motion, Vertical Throw, Horizontal Throw und Oblique Throw sowie Dynamics. Uniform Motion ist mit Theorie, vier Eingaben, Präfix-/Einheitenunterstützung, automatischen Resultaten, KaTeX-Rechenweg und zwei SVG-Diagrammen implementiert und vom Nutzer vorerst als Referenz akzeptiert. Seit 03.11.2026 sind zusätzlich Inclined Plane unter Dynamics sowie neun Elektrotechnik-Unterthemen mit 44 expliziten Rechenmodellen in 30 Karten beauftragt und implementiert. Three-Phase Systems bündelt Stern, Dreieck und Generator. Umfang und Quellen stehen in [ELECTRICITY.md](ELECTRICITY.md). Weitere Modelle und Veröffentlichung bleiben auftragsgebunden.

Mit dem zweiten Modell abgeschlossen: Uniform-Motion-Bindung von `ModelCard` gelöst und gemeinsame Feld-/Ergebnisdarstellung samt Styles extrahiert. Den akzeptierten Aufbau erhalten; Details und Änderungsstellen stehen im [Modellseitenstandard](MODEL_PAGE_STANDARD.md). Die folgenden Phasen beschreiben den weiteren Plan, nicht bereits vollständig erledigte Qualitäts-/Veröffentlichungsprüfungen.

Die Erweiterung vom 10.11.2026 ergänzt die Formelthemen aus Physik1/Physik2 mit 15 Unterseiten und 32 neuen Rechnerdefinitionen sowie einer Snell-Karte über den bestehenden Solver. Details und bewusst ausgelassene qualitative Lernziele stehen in [RESOURCE_CONTENT.md](RESOURCE_CONTENT.md). Dies ersetzt für diese Modelle die bisherige spätere Planung; es ist kein Veröffentlichungsauftrag.

## Phase 1 – Technische und gestalterische Grundlage

Nach Implementierungsauftrag SvelteKit und TypeScript einrichten, kompatible Versionen pinnen, Lockdatei und Node-Version dokumentieren. CSS-Tokens, Hell-/Dunkel-Schalter mit initialer Systemübernahme, Navigation, Übersichts-/Themenseitenvorlagen und KaTeX integrieren. Themenregistry als gemeinsame Quelle für Routen und Navigation etablieren. Englische Inhalte und URLs ohne Sprachpräfix verwenden; UI-Texte in einem englischen Wörterbuch führen und `/de/` für die spätere Erweiterung reservieren.

Vitest, Typ-/Svelte-Prüfung und Produktionsbuild in GitHub CI ergänzen. Netlify-Adapter konfigurieren; Vorschauhosting erst bei entsprechendem Auftrag verbinden. Keine Datenbank oder Anmeldung.

Abnahme: responsive Grundstruktur mit lesbarem vorgerendertem Inhalt, vollständiger Tastaturbedienung und beiden Themes. Unveröffentlichte Themen sind keine leeren öffentlichen Seiten. Theme-Kontraste prüfen, initiales Bundle messen.

## Phase 2 – Vertikaler Pilot: gleichförmige Bewegung

Ein vollständiges Thema mit direkt verlinkbaren Bereichen «Theory» und «Calculate», vier automatisch bestimmte Zielgrössen, SI-/Anzeigeeinheiten, automatischer Berechnung, Rechenweg, SVG und Weg-Zeit-Diagramm. Lokale Folgeergebnisse und Herkunftsanzeige gehören zum Pilot, nicht erst zum späteren Ausbau.

Mit diesem kleinen Thema werden Rechnervertrag, Definitionsbereiche und Invalidierung geprüft. Erst die zweite konkrete Rechneranforderung rechtfertigt zusätzliche Abstraktionen. Für die aktuellen Geraden SVG verwenden. Plotly erst bei weitergehenden wissenschaftlichen Diagrammanforderungen ergänzen und dessen Bundle budgetieren.

Abnahme: alle Modi fachlich getestet; `0`, fehlende Eingaben, Nulldivision, Einheitenwechsel und Folgefehler korrekt; keine veralteten Resultate. Rechenweg und Diagramm stimmen mit den Resultaten überein. Browserprüfung des Hauptablaufs, mobile Performance und zugängliche Diagrammalternative. Zusätzlich wird der schnelle Direkteinstieg in «Calculate» geprüft: Zielgrösse wählen, Beispielwerte durch eigene Werte ersetzen, Einheiten anpassen und Ergebnis samt Modellgrenzen beurteilen, ohne zuvor Theorie durchlaufen zu müssen.

## Phase 3 – Kinematik und analytische Analysis

Gleichmässig beschleunigte Bewegung, vertikaler, horizontaler und schiefer Wurf sind als vier zusätzliche Modellkarten unter Kinematics umgesetzt. Freier Fall ist der Sonderfall v₀ = 0 im vertikalen Modell. Beide Zeitlösungen bei beschleunigter Bewegung werden angezeigt; Koordinaten, Anfangsbedingungen und erster Bodenkontakt sind explizit. Der schiefe Wurf verwendet Abwurfgeschwindigkeit, Winkel und Abwurfhöhe; seine Flugbahn endet ebenfalls beim ersten Bodenkontakt.

Anhand dieser Modelle Ableitungen und bestimmte Integrale vermitteln: Position, Geschwindigkeit, Beschleunigung und Fläche unter der Kurve. Geschwindigkeitsbetrag und gerichtete Geschwindigkeit unterscheiden. Synchronisierte Skizzen und Diagramme, pausierbare Animationen.

Abnahme: neue Themen benötigen Definition, Fachfunktionen, Theorie und gegebenenfalls spezielle Skizzen, jedoch keine kopierten vollständigen Seiten. Grenzfälle wie `a = 0`, unterschiedliche Abwurfhöhen und negative gerichtete Werte sind geprüft. Analytische Zusammenhänge erhalten unabhängige Referenztests.

## Phase 4 – Dynamik und kontrollierte Weiterverwendung

Newtonsche Gesetze, Reibung und schiefe Ebene mit Kraftskizzen ergänzen. Haft-/Gleitreibung und Richtungsannahmen getrennt behandeln. Themenübergreifende explizite Wertübernahme mit Dimensions- und Bedeutungsprüfung hinzufügen, wenn die Produktentscheidung dies bestätigt.

Abnahme: Herkunft bleibt nachvollziehbar; gleiche Einheit führt nicht zu falscher Zuordnung. Keine Zyklen oder still überschriebenen Eingaben. Widersprüchliche Bedingungen werden erklärt.

## Phase 5 – Numerische Verfahren und weitere Fachgebiete

Zuerst einen begrenzten numerischen Lernfall wählen, etwa ein bestimmtes Integral einer unterstützten Funktion. Danach bei fachlichem Bedarf Bewegung mit Widerstand als Differentialgleichung. Numerik erhält Toleranzen, Grenzen, Fehlerschätzung und Nichtkonvergenzstatus. Worker nur nach Messung ergänzen.

Weitere Themen schrittweise priorisieren: Thermodynamik, Elektrizität und Magnetismus, Schwingungen und Wellen, Optik, Moderne Physik. Jedes Gebiet bekommt eine Übersicht und geprüfte Modelle, bevor es öffentlich erscheint. Es besteht keine Zusage, alle Gebiete gleichzeitig fertigzustellen.

3D nur für ausgewählte räumliche Phänomene. Freie Funktionseingaben, CAS, persistente Arbeitsbereiche oder CMS sind separate Entscheidungen mit eigenem Nutzen- und Komplexitätsnachweis.

Abnahme: numerische Beispiele stimmen innerhalb dokumentierter Toleranzen mit Referenzen überein; schwierige Eingaben terminieren kontrolliert. Darstellung unterscheidet analytische Lösung und Näherung.

## Deutsche Sprachoption – schrittweise umgesetzt

Seit 10.11.2026: Sprachwechsel English / Deutsch im Footer, deutsche vorgerenderte Routen unter `/de/`, übersetzte Navigation, Themenbeschreibungen und gemeinsame Bedienung. Die Kinematik-Meldungen und Uniform-Motion-Theorie sind übersetzt. Weitere Fachinhalte werden schrittweise ergänzt; die deutsche Oberfläche weist auf englische Restinhalte hin. Stabile Themen-IDs verbinden die Sprachfassungen. Deutsche Seiten unter `/de/` veröffentlichen; Sprachschalter, lokalisierte Zahlenformate, HTML-Sprache, Metadaten und reziproke Sprachalternativen ergänzen. Fehlende Fachübersetzungen bleiben ausdrücklich als englische Restinhalte erkennbar.

Abnahme: Beide Sprachen verwenden dieselbe Fachlogik; Sprachwechsel verändert keine physikalischen Werte. Längere deutsche Texte, Dezimalkomma/-punkt, fehlende Übersetzungen und SEO-Verknüpfungen sind geprüft. Die vollständige Fachübersetzung ist noch offen.

## Veröffentlichungsreife und laufende Pflege

Schon ab dem Pilot kontinuierlich prüfen, vor jeder Veröffentlichung abschliessen: Fachreview, Typprüfung, Tests, Produktionsbuild, mobile Performance, Tastatur/Screenreader und Theme-Kontraste. Vorhandene Ergebnisse müssen auch bei Renderingfehlern einer optionalen Visualisierung verständlich bleiben.

Vor dem ersten Produktionsstart Domain und Canonical-Basis setzen, Sitemap/robots prüfen, 404 und Weiterleitungen testen sowie Preview-Indexierung verhindern. Produktion erst nach Veröffentlichungsauftrag. Ein letzter erfolgreicher Deploy muss als Rückfallstand verfügbar bleiben.

Danach Abhängigkeiten gezielt pflegen, Fehler mit reproduzierbaren Eingaben dokumentieren und fachliche Änderungen samt Quellen nachführen. Neue Infrastruktur entsteht aus gemessenem Bedarf. Zeitaufwand und Termine werden nach dem ersten Pilot geschätzt, nicht aus einer noch unvalidierten Gesamtplanung abgeleitet.
