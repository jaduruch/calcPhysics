/** German UI. Complete UI dictionaries; tests require parity with English. */
export const ui = {
  stepByStepSolution: 'Schritt-für-Schritt-Lösungsweg',
  homeTitle: 'Physikrechner und Theorie',
  homeDescription: 'Rechner, Formeln und Modellannahmen zu Mechanik, Thermodynamik, Elektrotechnik, Wellen, Optik und Quantenphysik.',
  mainNavigation: 'Hauptnavigation', menu: 'Hauptmenü', home: 'Startseite', subjects: 'Physik entdecken', subjectLabel: 'Themenübersicht',
  openReference: 'Referenz öffnen', subtopics: 'Unterthemen', models: 'Theorie und Rechenmodelle', planned: 'Demnächst', open: 'Entdecken', theme: 'Darstellung',
  toggleDarkMode: 'Dunkelmodus', switchToLight: 'Zum Hellmodus wechseln', switchToDark: 'Zum Dunkelmodus wechseln', skip: 'Zum Inhalt springen', theory: 'Theorie', calculate: 'Berechnen',
  modelNotice: 'Öffne ein Modell. Über den Info-Button findest du Formeln und Voraussetzungen.', variables: 'Grössen', keyFormulas: 'Wichtige Formeln',
  velocityDerivative: 'Die Geschwindigkeit v(t) ist die erste zeitliche Ableitung des Ortes s(t). Ein Punkt über s bezeichnet die Ableitung nach der Zeit. Bei gleichförmiger Bewegung ist diese Ableitung konstant.',
  showTheory: 'Theorie anzeigen', hideTheory: 'Theorie ausblenden', modelAssumptions: 'Modellannahmen', calculatorPending: 'Rechner und Visualisierungen sind für dieses Modell noch nicht verfügbar.',
};
export const calculatorUi = {
  help: 'Eingabehilfe',
  initialPosition: 'Anfangsort', position: 'Ort', velocity: 'Geschwindigkeit', time: 'Zeit',
  invalidNumber: 'Gib eine Zahl oder einen Ausdruck mit (), +, -, *, / und ^ ein. Präfixe p, n, u, m, c, d, k, M, G und T unterscheiden Gross- und Kleinschreibung. Beispiel: (1k + 2m) / 2.',
  'non-finite': 'Diese Werte überschreiten den unterstützten Zahlenbereich.', 'negative-time': 'Die verstrichene Zeit muss null oder positiv sein.',
  'too-many': 'Lass ein Feld frei, um seinen Wert zu berechnen.', noSolution: 'Für diese Werte existiert keine Lösung mit nichtnegativer Zeit.',
  underdetermined: 'Diese Werte bestimmen kein eindeutiges Ergebnis (Division durch null).', unitConversion: 'In SI-Einheiten umrechnen', unitFor: 'Einheit für', calculated: 'Berechnet', assumed: 'Angenommen: 0',
  precision: 'Zahlen oder Ausdrücke: (), +, -, *, /, ^. Präfixe: 1,5k, 250m, 20u. Ergebnisse: 3 signifikante Stellen.', reset: 'Zurücksetzen', assumption: 'Angenommener Anfangsort: s₀ = 0 m.', working: 'Rechenweg'
};
export const chartUi = {
 title: 'Bewegungsdiagramme', positionDescription: 'Ort über der Zeit. Die Steigung der Geraden entspricht der Geschwindigkeit.', velocityDescription: 'Konstante Geschwindigkeit über der Zeit. Die vorzeichenbehaftete Fläche unter der Geraden entspricht der Ortsänderung.', zeroInterval: 'Das Zeitintervall ist null; nur der Anfangspunkt wird dargestellt.', empty: 'Schematische Kurve ohne Zahlenskala. Berechnete Werte erscheinen, sobald eine Berechnung möglich ist.'
};
export const idealGasUi = {
 p: 'Absolutdruck', V: 'Volumen', n: 'Stoffmenge', T: 'absolute Temperatur', assumptions: 'Ideales Gas im Gleichgewicht; alle Grössen müssen positiv sein. Absolutdruck und Temperatur in Kelvin verwenden. Realgaseffekte und Phasenübergänge sind ausgeschlossen.', invalid: 'Endliche positive Werte innerhalb des Zahlenbereichs eingeben.', conflict: 'Die vier Werte widersprechen dem idealen Gasgesetz.', consistent: 'Die vier Werte erfüllen das ideale Gasgesetz.', incomplete: 'Gib drei Grössen ein, um die vierte zu berechnen.'
};
export const resourceUi = {
  solution: 'Lösung',
 incomplete: 'Gib die Eingangsgrössen des Modells ein.', incompleteRelation: 'Lass eine Modellgrösse frei und gib die anderen ein, um sie zu berechnen.', invalid: 'Prüfe die markierten Eingaben anhand der angegebenen Definitionsbereiche.', conflict: 'Diese Eingaben widersprechen der Modellgleichung.', underdetermined: 'Diese Eingaben bestimmen keinen eindeutigen Wert (0 geteilt durch 0).', 'no-solution': 'Im angegebenen Definitionsbereich existiert keine Lösung.', numerical: 'Das Ergebnis liegt ausserhalb des endlichen Zahlenbereichs.', consistent: 'Die eingegebenen Werte erfüllen die Modellgleichung.', defaultValue: 'Standard:', prismReflection: 'Totalreflexion an der zweiten Prismenfläche: kein austretender gebrochener Strahl und keine Gesamtablenkung eines durchgehenden Strahls.'
};
export const kinematicsUi = {
 conflict: "Diese Eingaben widersprechen den Gleichungen der konstanten Beschleunigung. Prüfe die gegebenen Werte.",
 consistent: "Die eingegebenen Werte erfüllen beide Gleichungen der konstanten Beschleunigung.",
 acceleratedInputHint: "Gib vier Grössen ein, oder drei bei leerem s₀. Sind s₀ und v₀ leer, genügen zwei Angaben aus s, v₁, a und t. Fehlende Grössen werden berechnet; zusätzliche Angaben werden auf Widersprüche geprüft.",

 restAssumption: 'Für die leeren Anfangswert-Felder gelten s₀ = 0 m und v₀ = 0 m/s.',
 launchSpeed: "Abwurfgeschwindigkeit",
 launchAngle: "Abwurfwinkel",
 obliqueConvention: "Die positive x-Achse zeigt nach rechts, die positive y-Achse nach oben. Der Abwurfwinkel α wird gegen den Uhrzeigersinn ab +x gemessen: 0 nach rechts, π/2 nach oben, ±π nach links und −π/2 nach unten. R ist die vorzeichenbehaftete horizontale Verschiebung.",
 obliqueDomain: "Endliche Werte mit v₀ ≥ 0, y₀ ≥ 0, g > 0 und −π ≤ α ≤ π rad (−180° bis 180°) eingeben. Ohne y₀ gilt 0 m, ohne g gilt 9,81 m/s².",
 obliqueTheory: "Vorausgesetzt werden Trigonometrie und quadratische Gleichungen. Die Abwurfgeschwindigkeit wird in eine horizontale und eine vertikale Komponente zerlegt. Die Flugbahn endet beim ersten zukünftigen Bodenkontakt bei y = 0. Ein Wurf vom Boden nach oben kehrt später zurück; bei waagerechtem oder abwärts gerichtetem Abwurf vom Boden ist die Flugdauer null. Die maximale Höhe bezieht sich auf die Zeit nach dem Abwurf. Bei Würfen nach unten wird die Flugzeit numerisch stabil berechnet.",

 initialVelocity: 'Anfangsgeschwindigkeit', initialVerticalVelocity: 'vertikale Anfangsgeschwindigkeit', acceleration: 'konstante Beschleunigung', launchHeight: 'Abwurfhöhe', horizontalVelocity: 'horizontale Geschwindigkeit', gravity: 'Fallbeschleunigung',
 acceleratedAssumptions: 'Geradlinige Bewegung mit konstanter, vorzeichenbehafteter Beschleunigung. Orte und Geschwindigkeiten sind gerichtete Grössen; die verstrichene Zeit t muss nichtnegativ sein. Die Ortsänderung ist nicht unbedingt die zurückgelegte Strecke.',
 projectileAssumptions: 'Punktmasse, konstantes g > 0, kein Luftwiderstand und horizontaler Boden bei y = 0. Die Bewegung endet beim ersten Bodenkontakt; kein Rückprall und keine Fortsetzung unter dem Boden.',
 verticalConvention: 'Die positive y-Achse zeigt nach oben. Positives v₀ bedeutet einen Wurf nach oben, negatives v₀ nach unten. Die Abwurfhöhe y₀ muss nichtnegativ sein.', horizontalConvention: 'Positives x zeigt nach rechts, positives y nach oben. Negatives vₓ bedeutet einen Wurf nach links; R ist eine vorzeichenbehaftete Verschiebung. Die Abwurfhöhe h muss nichtnegativ sein.',
 incompleteAccelerated: 'Gib vier Grössen ein; bei leerem s₀ genügen drei. Sind s₀ und v₀ leer, genügen zwei Angaben aus s, a und t; beide Anfangswerte werden als null angenommen.', incompleteProjectile: 'Gib die Abwurfbedingungen ein; ohne Angabe für g gilt 9,81 m/s².', domain: 'Endliche Werte eingeben. Zeit und Abwurfhöhe müssen nichtnegativ sein; g muss positiv sein.', numerical: 'Die Bewegung liegt ausserhalb des endlichen Zahlenbereichs.', 'too-many': 'Lass eine Grösse frei, um die Berechnung auszuwählen.', 'no-solution': 'Für nichtnegative Zeit existiert keine Lösung.', underdetermined: 'Diese Eingaben bestimmen keine eindeutige Lösung.', parseError: 'Gib gültige endliche Zahlen in die ausgefüllten Felder ein.', initialAssumption: 'Für das leere Anfangsort-Feld wird s₀ = 0 m verwendet.', defaultValue: 'Standard:', multipleTimes: 'Es gibt zwei physikalisch zulässige Lösungen. Wähle das Bewegungsintervall für die Diagramme.', diagramInterval: 'Diagrammintervall', timeSolution: 'Zeitlösung', velocity: 'Endgeschwindigkeit', displacement: 'Ortsänderung', flight: 'Zeit bis zum Boden', peakTime: 'Zeit der maximalen Höhe', peakHeight: 'maximale Höhe nach dem Start', impactVelocity: 'vertikale Aufprallgeschwindigkeit', range: 'horizontale Verschiebung', vyImpact: 'vertikale Aufprallgeschwindigkeit', speedImpact: 'Betrag der Aufprallgeschwindigkeit', charts: 'Bewegungsdiagramme', positionDescription: 'Ort im gewählten Zeitintervall, berechnet mit demselben Modell konstanter Beschleunigung.', velocityDescription: 'Vorzeichenbehaftete Geschwindigkeit im gewählten Zeitintervall.', heightDescription: 'Höhe über dem Boden bis zum ersten Kontakt; keine Fortsetzung unter dem Boden.', horizontalDescription: 'Vorzeichenbehafteter horizontaler Ort bis zum ersten Bodenkontakt.', trajectoryDescription: 'Flugbahn in der x–y-Ebene bis zum ersten Bodenkontakt. Negative horizontale Geschwindigkeit führt nach links.', schematic: 'Schematische Vorschau ohne Zahlenskalen.'
};
export const inclinedPlaneUi = {
 combinedAssumptions: 'Die Hebekraft beschreibt gleichförmiges Hinaufgleiten und ist von der resultierenden Kraft hangabwärts getrennt. Die Endgeschwindigkeit gilt aus Ruhe; negative Beschleunigung beschreibt nur Abbremsen. Leere Reibung und Erdbeschleunigung werden erst nach Auswertung der bekannten Angaben angenommen.',
 endVelocity: 'Endgeschwindigkeit (aus Ruhe)',
 speedInvalid: 'Die Geschwindigkeit widerspricht der Geometrie oder Reibung. Prüfe die eingegebenen Werte.',
 length: 'Länge der Ebene', height: 'Höhenunterschied', mass: 'Masse', angle: 'Neigungswinkel', friction: 'Gleitreibungskoeffizient', gravity: 'Fallbeschleunigung',
 geometryInvalid: 'Widersprüchliche Geometrie. Es gilt h = L sin α mit L > 0 und 0 ≤ h ≤ L. Lösche einen Wert, um ihn zu berechnen.', noStart: 'Keine Endgeschwindigkeit aus Ruhe: Das Modell sagt mit diesen Reibungs- und Neigungswerten keine Bewegung hangabwärts voraus. Haftreibung wird nicht modelliert.',
 assumptions: 'Starrer Körper auf einer geraden Ebene, ohne Luftwiderstand oder äussere Antriebskräfte. Positiv ist hangabwärts. Bei Reibung gleitet der Körper bereits hangabwärts; Gleitreibung wirkt bergauf. Haftreibung und das Losrutschen werden nicht modelliert.',
 braking: 'Negative Beschleunigung bedeutet, dass ein hangabwärts gleitender Körper langsamer wird. Sie sagt weder eine Bewegung bergauf noch das Losrutschen aus Ruhe voraus.',
 defaults: 'Ohne μₖ gilt 0, ohne g gilt 9,81 m/s². Die Geschwindigkeit gehört zum Ende von L, aus Ruhe. Geometrie, Beschleunigung und Geschwindigkeit benötigen keine Masse; nur Kräfte benötigen sie. Bekannte Werte eingeben und gesuchte Grössen frei lassen.',
 invalid: 'Gültige Zahlen eingeben. Masse, Ebenenlänge und g müssen positiv sein; Höhe, Endgeschwindigkeit und μₖ nichtnegativ. Der Winkel muss zwischen 0 und π/2 rad (0–90°) liegen.', range: 'Diese Werte überschreiten den unterstützten Zahlenbereich.',
 angleHighlight: 'Der Winkel ist hervorgehoben, weil sein Eingabefeld fokussiert ist.', lengthHighlight: 'Die Ebenenlänge L ist hervorgehoben, weil ihr Eingabefeld fokussiert ist.', heightHighlight: 'Der Höhenunterschied h ist hervorgehoben, weil sein Eingabefeld fokussiert ist.', sketch: 'Schiefe Ebene – Kräfteskizze', schematic: 'Schematische Vorschau: Winkel und Reibung bestimmen Geometrie und Kräfteverhältnisse. Kräftebeträge erscheinen bei gültiger Berechnung.', sketchDescription: 'Die Gewichtskraft wirkt senkrecht nach unten, die Normalkraft senkrecht zur Fläche, die Hangkomponente entlang der Ebene und die Gleitreibung bergauf. Die Hangkomponente ist keine zusätzliche unabhängige Kraft.', diagramNote: 'Der Winkel ist massstäblich. Die Kraftpfeile verwenden einen gemeinsamen, automatisch angepassten Massstab. Die Hangkomponente ist gestrichelt gezeichnet.', source: 'Theoriequelle: OpenStax, University Physics, Friction and the Inclined Plane.'
};
export const electricalUi = {
 transformerMode: 'Transformatormodell', ideal: 'Ideal', real: 'Real', fixedEfficiency: 'Fest: η = 1 (100 %)',
 series: 'Reihe', parallel: 'Parallel', resistorConnection: 'Widerstandsschaltung', capacitorConnection: 'Kondensatorschaltung', inductorConnection: 'Spulenschaltung', rcConnection: 'RC-Schaltung', rlConnection: 'RL-Schaltung',
 charging: 'Aufladen', discharging: 'Entladen', rcProcess: 'RC-Vorgang', rlProcess: 'RL-Vorgang', stepResponse: 'Sprungantwort',
 starDeltaConversion: 'Netzumwandlung', deltaToStar: 'Dreieck → Stern', starToDelta: 'Stern → Dreieck', deltaNetwork: 'Dreieckschaltung', starNetwork: 'Sternschaltung',
 unloaded: 'Unbelastet', loaded: 'Belastet', dividerLoad: 'Last am Spannungsteiler', conflict: 'Diese Eingaben widersprechen den Modellgleichungen. Prüfe die gegebenen Grössen.', underdetermined: 'Diese Werte bestimmen kein eindeutiges Ergebnis. Ergänze eine unabhängige Grösse oder ändere das Eingabepaar.', twoInputs: 'Gib genau zwei Grössen ein; lass die übrigen Felder frei.', incomplete: 'Gib die erforderlichen Eingangsgrössen ein.', invalid: 'Prüfe die markierten Eingaben und die unten angegebenen Modellgrenzen.', range: 'Diese Werte überschreiten den Zahlenbereich des Modells. Verwende weniger extreme Eingaben.',
 input: 'Eingabe', output: 'Ergebniseinheit', conversion: 'SI-Umrechnungen', schematic: 'Schematische Kurve ohne Zahlenskala.', calculated: 'Aus den validierten SI-Eingaben berechnet.', diagram: 'Schaltbild.', zero: 'Null ist eine gültige Eingabe, sofern das Modell sie erlaubt.', phase: 'Phase', phasor: 'Impedanzdreieck', idealTransformer: 'Annahme: idealer Transformator, η = 1.', highPassCircuit: 'Hochpassschaltung', lowPassCircuit: 'Tiefpassschaltung', bodeMagnitudeDiagram: 'Bode-Amplitudengang', bodePhaseDiagram: 'Bode-Phasengang', seriesResonator: 'RLC-Reihenschwingkreis', parallelResonator: 'RLC-Parallelschwingkreis',

"seriesResistorDiagram":"Widerstände in Reihe",
"parallelResistorDiagram":"Widerstände parallel",
"seriesResistorDescription":"Die Widerstände R1 bis Rn liegen in einem Strompfad zwischen den beiden Anschlüssen. Ihre Widerstände addieren sich. Ein gestrichelter Widerstand steht für ein leeres Anfangsfeld.",
"parallelResistorDescription":"Die Widerstände R1 bis Rn bilden getrennte Zweige zwischen denselben Anschlüssen. Ihre Leitwerte addieren sich. Ein gestrichelter Widerstand steht für ein leeres Anfangsfeld.",
"seriesCapacitorDiagram":"Kondensatoren in Reihe",
"parallelCapacitorDiagram":"Kondensatoren parallel",
"capacitorNetworkDescription":"Ideale Kondensatoren C1 bis Cn zwischen zwei Anschlüssen. In Reihe addieren sich die Kehrwerte ihrer Kapazitäten, parallel ihre Kapazitäten. Ein gestrichelter Kondensator steht für ein leeres Feld.",
"seriesInductorDiagram":"Spulen in Reihe",
"parallelInductorDiagram":"Spulen parallel",
"inductorNetworkDescription":"Ideale Spulen L1 bis Ln ohne magnetische Kopplung zwischen zwei Anschlüssen. In Reihe addieren sich ihre Induktivitäten, parallel deren Kehrwerte. Eine gestrichelte Spule steht für ein leeres Feld.",
"seriesRlDiagram":"RL-Reihenschaltung",
"parallelRlDiagram":"RL-Parallelschaltung",
"rlDiagramDescription":"Automatisch erzeugte Wechselstromschaltung mit Widerstand R und Spule L in der gewählten Reihen- oder Parallelschaltung.",
"rlStepDiagram":"RL-Schaltung zur Sprungantwort",
"rlDischargeDiagram":"RL-Schaltung beim Ausschalten",
"rlTransientDescription":"Der automatische Schalter wählt die ideale RL-Sprungantwort oder den quellenfreien Entladekreis durch Widerstand R und Spule L.",
"automaticRlTransientHint":"Schaltung und Schalterstellung folgen automatisch dem gewählten Vorgang.",
"rcChargeDiagram":"RC-Ladeschaltung",
"rcDischargeDiagram":"RC-Entladeschaltung",
"rcChargeDescription":"Der automatische Schalter verbindet die Gleichspannungsquelle zum Laden mit Widerstand R und Kondensator C.",
"rcDischargeDescription":"Der automatische Schalter trennt die Gleichspannungsquelle und schliesst den Entladekreis durch Widerstand R und Kondensator C.",
"automaticRcTransientHint":"Schaltung und Schalterstellung folgen automatisch dem gewählten Lade- oder Entladevorgang.",
"seriesRcDiagram":"RC-Reihenschaltung",
"parallelRcDiagram":"RC-Parallelschaltung",
"seriesRcDescription":"Automatisch erzeugte Wechselstromschaltung mit Widerstand R und Kondensator C in einem Strompfad.",
"parallelRcDescription":"Automatisch erzeugte Wechselstromschaltung mit Widerstand R und Kondensator C in getrennten Zweigen an derselben Spannung.",
"automaticRcDiagramHint":"Die Schaltung wird aus der gewählten Verbindungsart erzeugt. Eine Eingabe auswählen, um die zugehörige Grösse hervorzuheben.",
"starDeltaDiagrams":"Widerstandsnetzwerke in Dreieck und Stern",
"dividerDiagram":"Unbelasteter Spannungsteiler",
"loadedDividerDiagram":"Belasteter Spannungsteiler",
"dividerDescription":"Eine Gleichspannungsquelle versorgt die Reihenwiderstände R1 und R2. Die Ausgangsspannung wird über R2 gemessen. Der Versorgungsstrom I fliesst durch beide Widerstände.",
"loadedDividerDescription":"Eine Gleichspannungsquelle versorgt R1 in Reihe mit der Parallelschaltung aus R2 und Lastwiderstand RL. Der Versorgungsstrom I teilt sich am Ausgangsknoten in IR2 und IL auf.",
"ohmDiagram":"Gleichstromkreis: Spannung, Strom, Widerstand und Leistung",
"ohmDiagramDescription":"Eine Gleichspannungsquelle treibt den Strom I durch den Widerstand R. U wird am Widerstand gemessen; P bezeichnet die aufgenommene elektrische Leistung. Einheiten: V, A, Ω und W.",
"ohmDiagramHint":"Eine Eingabe auswählen, um ihre Grösse und Einheit in der Schaltung hervorzuheben. Die übrigen Grössen werden ausgegraut.",
"partialInductor":"Nur eindeutig bestimmbare Grössen werden angezeigt. Für weitere Ergebnisse unabhängige bekannte Werte ergänzen. Berechnete Werte bleiben unter den Eingaben.",
"partialTransformer":"Nur eindeutig bestimmbare fehlende Grössen werden angezeigt. Für die übrigen Grössen können weitere unabhängige Eingaben nötig sein.",
"generator":"Dreiphasengenerator: normierte Phasenzeiger",
"generatorNote":"Die senkrechten Projektionen ergeben die momentanen Phasenspannungen geteilt durch ihre Scheitelamplitude. Die verstrichene Zeit ändern, um die Zeiger zu drehen. Die Auswahlkästchen steuern nur die Sichtbarkeit der Zeiger.",
"phasorNote":"Normierte Impedanzrichtung; die horizontale Komponente ist ohmsch, die vorzeichenbehaftete vertikale Komponente reaktiv.",
"diagramNote":"Quellendarstellung; die hier genannten Annahmen bestimmen diese Rechnung.",
"filterCircuitDescription":"Automatisch erzeugte ideale passive Filterschaltung erster Ordnung.",
"resonatorCircuitDescription":"Automatisch erzeugter idealer RLC-Schwingkreis.",
};
export const qubitUi = {
 sphere: 'Blochkugel', orbitLabel: '3D-Blochkugel drehen', orbitHelp: 'Zum Drehen ziehen. Bei fokussierter Ansicht mit den Pfeiltasten drehen und mit Home die Kamera zurücksetzen.', resetView: 'Ansicht zurücksetzen', loading: 'Interaktive 3D-Ansicht wird geladen…', viewError: 'Die interaktive Ansicht konnte nicht geladen werden. Zustandsamplituden und Wahrscheinlichkeiten bleiben verfügbar.', showMatrices: 'Matrizen anzeigen', hideMatrices: 'Matrizen ausblenden', pauli: 'Pauli-Gatter', squareRoot: 'Wurzelgatter', hadamard: 'Hadamard', rotations: 'Rotationsgatter', general: 'Allgemeines Gatter', rotationAngle: 'Drehwinkel', theta: 'Polardrehung', phi: 'Ausgangsphase', lambda: 'Eingangsphase', currentState: 'Aktueller Zustand', probabilities: 'Wahrscheinlichkeiten in der Z-Basis', coordinates: 'Blochkoordinaten', start: 'Anfangszustand', undefinedPhase: 'an den Polen undefiniert', defaultHalfPi: 'Standard π/2', defaultZero: 'Standard 0', rotationHint: 'Positive Drehungen folgen der Rechte-Hand-Regel.', reducedMotion: 'Reduzierte Bewegung: Gatter werden ohne Animation angewendet.',

"sphereDescription":"Perspektivische 3D-Ansicht des reinen Qubits. Der blaue Pfeil ist der Bloch-Vektor; die gepunktete blaue Kurve zeigt den letzten Gatterpfad. Der +z-Pol ist |0⟩, der −z-Pol |1⟩. Gestrichelte Hilfslinien projizieren den Vektor auf die xy-Ebene; θ wird ab +z gemessen, φ ab +x in Richtung +y. Bei |1⟩ zeigt ein Halbkreis in der xz-Ebene θ = 180°. Der Azimut ist an beiden Polen undefiniert.",
"defaults":"Leere Winkelfelder verwenden γ = π/2, θ = π/2 und φ = λ = 0. U verwendet die IBM-Konvention: θ ∈ [0, π], φ, λ ∈ [0, 2π).",
"invalidAngle":"Endliche Winkel eingeben. Für U gilt θ ∈ [0, π] und φ, λ ∈ [0, 2π). Rotationswinkel γ müssen zwischen −2π und 2π liegen.",
"assumptions":"Ein reines, isoliertes Qubit; ideale Gatter ohne Rauschen, Verschränkung oder Messkollaps. Die Wahrscheinlichkeiten sind Vorhersagen in der Z-Basis. Die globale Phase ist auf der Blochkugel unsichtbar. Die Animationszeit dient nur der Veranschaulichung.",
};
export const dopplerUi = {
 fs: 'gesendete Frequenz', fo: 'beobachtete Frequenz', vs: 'Quellengeschwindigkeit', vo: 'Beobachtergeschwindigkeit', c: 'Schallgeschwindigkeit', incomplete: 'Gib drei von fₛ, fₒ, vₛ und vₒ ein; verwende 0 für eine ruhende Quelle oder einen ruhenden Beobachter.', conflict: 'Die vier Eingaben widersprechen der Dopplergleichung.', 'no-solution': 'In diesem Unterschallmodell existiert keine Lösung.', domain: 'Frequenzen und Schallgeschwindigkeit müssen positiv sein; beide Geschwindigkeitsbeträge müssen unter der Schallgeschwindigkeit liegen.', numerical: 'Das Ergebnis liegt ausserhalb des endlichen Zahlenbereichs.', parseError: 'Gib gültige endliche Zahlen in die ausgefüllten Felder ein.', consistent: 'Die vier Eingaben erfüllen die Dopplergleichung.', defaultSpeed: 'Standard 343 m/s', assumedSpeed: 'Es gilt c = 343 m/s (Luft bei etwa 20 °C).', wavelength: 'Wellenlänge zum Beobachter', shift: 'Frequenzverschiebung', source: 'Quelle', observer: 'Beobachter', diagramTitle: 'Doppler-Wellenfronten', schematic: 'Schematische Vorschau; gib gültige Werte für dein Modell ein.', play: 'Animation starten', pause: 'Animation pausieren', reducedMotion: 'Reduzierte Bewegung: statische Wellenfronten werden angezeigt.',

"signConvention":"Positives vₛ bedeutet Bewegung der Quelle zum Beobachter, positives vₒ Bewegung des Beobachters zur Quelle. Negative Werte bedeuten Entfernung voneinander. Beide Geschwindigkeiten gelten relativ zum Medium.",
"assumptions":"Homogenes ruhendes Medium, konstante Schallgeschwindigkeit und kollineare Bewegung mit |vₛ| < c und |vₒ| < c, bevor Quelle und Beobachter einander passieren. Kein Wind, Überschallknall, keine Reflexion und kein relativistischer Licht-Dopplereffekt.",
"diagramDescription":"Querschnitt kugelförmiger Schallwellenfronten. Jeder Kreis breitet sich von seinem festen Aussendepunkt im ruhenden Medium aus. Quelle und Beobachter bewegen sich auf der horizontalen Linie.",
"scaled":"Die Wellenfronten liegen eine Quellenperiode auseinander. Raum und Zeit sind für die Darstellung skaliert; die Schleife beginnt neu, bevor Quelle und Beobachter einander passieren.",
};
export const reflectionUi = {
 n1: 'Brechungsindex des Einfallsmediums', n2: 'Brechungsindex des zweiten Mediums', angle: 'Einfallswinkel', criticalAngle: 'Grenzwinkel', reflectedAngle: 'Reflexionswinkel', transmittedAngle: 'Brechungswinkel', incomplete: 'Gib beide Brechungsindizes ein, um zu prüfen, ob Totalreflexion möglich ist.', addAngle: 'Gib einen Einfallswinkel ein, um die Strahlwege zu bestimmen.', noCritical: 'In dieser Richtung existiert kein Grenzwinkel für Totalreflexion, da n₁ ≤ n₂.', 'total-reflection': 'Totalreflexion: θ₁ > θc. Kein propagierender gebrochener Strahl tritt in Medium 2 ein.', critical: 'Am Grenzwinkel gilt θ₂ = 90°. Der Grenzstrahl verläuft entlang der Grenzfläche.', refraction: 'Brechung: Das Snelliussche Gesetz erlaubt einen gebrochenen Strahl.', matched: 'Gleiche Brechungsindizes: Der Strahl läuft im idealen Modell gerade und ohne Reflexion weiter.', domain: 'Brechungsindizes müssen endlich und positiv sein. Für den Einfallswinkel gilt 0 ≤ θ₁ < 90° (π/2 rad).', numerical: 'Das Ergebnis liegt ausserhalb des endlichen Zahlenbereichs.', parseError: 'Gib gültige endliche Zahlen in die ausgefüllten Felder ein.', convention: 'Licht tritt von Medium 1 in Medium 2 ein. Alle Winkel werden zum Lot gemessen.', medium1: 'Medium 1', medium2: 'Medium 2', normal: 'Lot', incident: 'Einfallend', reflected: 'Reflektiert', transmitted: 'Gebrochen', diagramTitle: 'Brechung und Totalreflexion', schematic: 'Schematische Vorschau; gib beide Indizes und einen Einfallswinkel für deine Strahlwege ein.', calculated: 'Strahlgeometrie aus den berechneten Winkeln; die Linienhelligkeit stellt keine Lichtintensität dar.',

"assumptions":"Ebene Grenzfläche zwischen homogenen, isotropen, nichtmagnetischen, transparenten Medien mit positiven reellen Brechungsindizes bei derselben Wellenlänge. Nur Strahlwege: Polarisation, reflektierte/übertragene Intensitäten und evaneszentes Feld werden nicht berechnet.",
"diagramDescription":"Medium 1 liegt unterhalb, Medium 2 oberhalb der waagrechten Grenzfläche. Der einfallende Strahl läuft zur Grenzfläche; der reflektierte bleibt darunter. Ein gebrochener Strahl wird nur gezeichnet, wenn eine Ausbreitung in Medium 2 möglich ist.",
};

export const opticsDiagramUi = {
  'mirror-focus':'Kugelspiegel: Brennpunkt und Krümmungsmittelpunkt',
  'lens-power':'Dünne Linse: sammelnde und zerstreuende Strahlen',
  'optical-medium':'Lichtausbreitung im Vakuum und in einem Medium',
  'parallel-plate':'Planparallele Platte: Brechung und seitlicher Versatz',
  'prism-deviation':'Prisma: Brechung an beiden Flächen',
  description:'Blaue Pfeile zeigen die Lichtausbreitung. Gestrichelte Linien zeigen Lote oder geometrische Strahlverlängerungen.',
  schematic:'Schematisches Beispiel ohne Darstellung von Eingabewerten.',
  calculated:'Die Geometrie folgt den berechneten Winkeln, dem Brechungsindex oder dem Vorzeichen der Brennweite; Längen sind normiert.',
  legend:'Gestrichelt: Lote oder Strahlverlängerungen.',
  focusLegend:'F: Brennpunkt; C: Krümmungsmittelpunkt; S: Spiegelscheitel; O: Linsenmitte.'
};

export const pulleyUi = {
 title:'Idealer Flaschenzug',load:'Last',
 description:'Ein durchgehendes Seil läuft um feste Umlenkrollen und den beweglichen Lastblock. Nummerierte senkrechte Seilabschnitte tragen die Last. Das freie Seilende wird nach unten gezogen, während die Last steigt.',
 schematic:'Schematische Vorschau ohne gemessene Kräfte oder Wege.',
 calculated:'Die Seilführung folgt der berechneten Anzahl tragender Seilabschnitte.',
 compact:'Vereinfachte Seilführung bei mehr als acht tragenden Seilabschnitten; die genaue Anzahl steht darunter.',
 legend:'n zählt tragende Seilabschnitte, nicht Rollen. Feste Rollen können die Zugrichtung umlenken.',
 forces:'F: Zugkraft; F_G: Gewichtskraft der Last. Die Kraftpfeile haben einen gemeinsamen normierten Massstab.',
 travel:'s: nach unten gezogener Seilweg; h: Hubhöhe. Richtungspfeile sind schematisch; s = n·h.'
};

export const keplerUi={
 play:'Bahn animieren',pause:'Animation pausieren',interval:'Zeitintervall Δt/T',reducedMotion:'Die Animation ist durch die Einstellung für reduzierte Bewegung deaktiviert.',timeHelp:'P₀ und P₁ markieren t₀ = t₁ − Δt und t₁. Die schattierte Fläche wird während Δt überstrichen; ΔA/A = Δt/T. Zeiten sind Bruchteile einer Umlaufzeit. M ist die mittlere Anomalie, E die exzentrische Anomalie und ε die Exzentrizität. Die Umlaufzeit wird nicht aus der Ellipsengrösse allein angenommen.',
 pointFromInputs: 'Der dargestellte Punkt folgt den eingegebenen Punktgrössen. Ändere Polarwinkel oder Koordinaten, um ihn zu verschieben.',
 view:'Ellipsenansicht',section:'3D-Kegelschnitt',orbit:'Bahnebene',resetView:'Ansicht zurücksetzen',
 viewport:'Drehbare Ellipsenkonstruktion',phase:'Bahnphase t₁/T',
 controls:'Zum Drehen ziehen oder die fokussierte Zeichnung mit den Pfeiltasten bedienen. Home setzt die Ansicht zurück.',
 phaseHelp:'Der Regler verschiebt die Zeit gleichmässig. In der Nähe des anziehenden Brennpunkts bewegt sich der Bahnpunkt schneller.',
 description3d:'Eine Ebene schneidet einen Doppelkegel. Die Schnittkurve wird auf die Ellipse in der horizontalen Bahnebene projiziert; F₁ und F₂ markieren ihre Brennpunkte.',
 description2d:'Ellipsenbahn mit anziehendem Brennpunkt F₁, Fahrstrahl und einem über die Keplergleichung bestimmten Bahnpunkt.',
 schematic:'Schematische Bahn, auf die grosse Halbachse normiert; keine numerische Koordinatenskala.',
 calculated:'Die Ellipsenform folgt den validierten Rechnerwerten; die Zeichnung ist auf a normiert.',
 constructionNote:'Kegel und schräger Schnitt sind eine geometrische Konstruktion. Die dargestellte Bahn ist ihre horizontale Projektion, keine Bewegung auf dem Kegel.',
 areaHelp:'Die Flächensektoren beginnen in der Nähe von Periapsis und Apoapsis. Ihre Flächen folgen A₁:A₂; die Zeitintervalle haben dasselbe Verhältnis. Gleiche Intervalle ergeben gleiche Flächen. Bahngrösse und Exzentrizität sind schematisch.',
};

export const searchUi = { label: 'Seite durchsuchen', placeholder: 'Themen, Rechner, Formeln und Konstanten…', result: 'Treffer', results: 'Treffer', noResults: 'Keine Treffer gefunden.', more: 'Weitere Treffer anzeigen' } as const;

export const obliqueUi = {
 "noApex": "Bei negativen Abwurfwinkeln werden Scheitelzeit, Steighöhe und maximale Höhe nicht berechnet.",
  "help": "Beliebige bekannte Grössen eingeben; alle eindeutig bestimmbaren Werte werden berechnet. Beobachtungszeit t und gesamte Flugzeit t_f sind unterschiedliche Grössen. Die Höhen y und y_peak beziehen sich auf den Boden; h ist die Steighöhe über dem Abwurfpunkt. Der Flug endet beim ersten Bodenkontakt.",
  "invalid": "Die markierten Eingaben prüfen. Geschwindigkeitsbeträge, Höhen und Zeiten müssen nichtnegativ sein, g muss positiv sein, und −180° ≤ α ≤ 180°. Horizontale Positionen und Geschwindigkeitskomponenten sind vorzeichenbehaftet; die vertikale Aufprallgeschwindigkeit darf nicht positiv sein.",
  "incomplete": "Unabhängige bekannte Grössen eingeben, etwa Geschwindigkeit und Winkel, beide Geschwindigkeitskomponenten oder Flugzeit und Wurfweite.",
  "partial": "Die Angaben bestimmen Teilresultate. Unabhängige Abwurfdaten ergänzen, um die gesamte Flugbahn darzustellen.",
  "conflict": "Diese Angaben beschreiben keinen konsistenten Flug vor dem ersten Bodenkontakt. Die eingegebenen Grössen prüfen.",
  "solution": "Lösung",
  "diagramSolution": "Lösung für die Flugbahn",
  "assumptions": "Angenommen:",
  "theory": "Ein Rechner beschreibt den schiefen, senkrechten und waagerechten Wurf. Fehlende Grössen werden mit expliziten Umstellungen bestimmt und gegen die ursprünglichen Bewegungsgleichungen geprüft. Mehrere Winkel oder Beobachtungszeiten bleiben erhalten, wenn sie alle Angaben erfüllen. Die Vorgaben y₀ = 0 m und g = 9,81 m/s² gelten erst nach der Auswertung der eingegebenen Daten; sie bleiben sichtbar und werden nie in Eingabefelder eingesetzt."
} as const;
