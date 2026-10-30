# SEO-Konfiguration und Prüfung

## Zentrale Quellen

- `src/lib/seo.ts`: Hauptdomain `https://calcphysics.com`, Standardmetadaten, kanonische URLs, veröffentlichte Pfade, XML- und robots-Ausgabe.
- `src/lib/content/topics.ts`: optionales `seo` mit Titel und Beschreibung pro Thema. Ohne Überschreibung greift ein gemeinsamer Fallback; Seiteneinleitung und SEO-Beschreibung sind getrennt.
- `src/lib/components/SeoHead.svelte`: ein gemeinsamer Head-Baustein im Root-Layout. Erzeugt Titel, Beschreibung, Canonical und Open-Graph-Texte für veröffentlichte Seiten. Keine zweite Metadatenkopie im Overview oder in einzelnen Seiten anlegen.
- `src/routes/sitemap.xml/+server.ts`: beim Build automatisch erzeugte Sitemap aus Home und veröffentlichten Themen. Neue veröffentlichte Themen benötigen keine manuelle XML-Anpassung. Keine erfundenen Änderungsdaten, keine `priority`-Werte.
- `src/routes/robots.txt/+server.ts`: erlaubt Produktions-Crawling und verweist auf dieselbe kanonische Sitemap.
- `_redirects` im Repository-Stamm: 301-Weiterleitungen von HTTP, www und der bekannten Produktionsadresse `calcphysics.netlify.app` auf HTTPS ohne www. Der installierte Netlify-Adapter übernimmt diese Datei nach `build/`; nicht nach `static/` verschieben.
- `netlify.toml`: Deploy-/Branch-Previews setzen `VITE_INDEXABLE=false`; sie erhalten `noindex, nofollow` und eine robots-Sperre. Lokale Entwicklung ist ebenfalls nicht indexierbar. Die expliziten Domain-Weiterleitungen erfassen keine Preview-Hosts.

Canonical-URLs enthalten weder Queryparameter noch Fragmente. Nicht veröffentlichte oder unbekannte Pfade bekommen keine vermeintlich gültigen SEO-Metadaten; die Fehlerseite bleibt `noindex`. Die Sitemap und interne Seitennavigation stammen aus derselben Themenregistry. Eigene Modellrouten wurden nicht neu eingeführt.

Bei späterem Domainwechsel die zentrale Origin und die expliziten Netlify-Redirectregeln zusammen aktualisieren. Einheiten-/Rechnerparameter sind keine eigenen indexierbaren Seiten. Deutsch erhält erst bei vorhandenen Übersetzungen eigene URLs und reziproke hreflang-Verknüpfungen.

## Bereits geprüfter Live-Zustand am 30.10.2026

- `https://calcphysics.com/mechanics/kinematics`: HTTP 200.
- `https://www.calcphysics.com/mechanics/kinematics`: HTTP 301 auf die Hauptdomain bereits vor diesen Änderungen.
- `https://calcphysics.netlify.app/mechanics/kinematics`: vorher HTTP 200 mit Canonical-Header auf die Hauptdomain. Eine zusätzliche explizite Weiterleitung ist jetzt im Repository vorbereitet.

Diese Implementierung hat weder Netlify-Kontoeinstellungen noch DNS verändert und wurde noch nicht veröffentlicht. Redirects werden erst nach Deployment durch Netlify wirksam; die lokale Vite-Vorschau bildet die Netlify-Domainweiterleitungen nicht nach. Danach HTTP, www und die bekannte Netlify-Adresse einschliesslich Unterpfaden erneut prüfen. Die zuvor heruntergeladene manuelle Sitemap wurde durch den automatischen Endpunkt ersetzt.

## Mobile Performance: Lighthouse-Labormessung

Messung der bereits veröffentlichten Version, nicht einer behaupteten neuen Produktionsauslieferung:

| Eigenschaft | Messwert |
| --- | --- |
| URL | https://calcphysics.com/mechanics/kinematics |
| Datum | 30.10.2026 |
| Werkzeug | Lighthouse 13.6.0, Chrome headless, mobiles Profil, Standard-Laborthrottling |
| Performance | 100 / 100 |
| SEO-Audit | 100 / 100 |
| First Contentful Paint | ca. 1,1 s |
| Largest Contentful Paint | ca. 1,1 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | ca. 1,1 s |

Ein einzelner Laborlauf ist kein Feldnachweis für reale mobile Geräte oder Core Web Vitals und keine Ranking-Garantie. Lighthouse meldete kleine mögliche Einsparungen bei ungenutztem JavaScript (ca. 24 KiB) und renderblockierenden Ressourcen (geschätzt 90 ms). Bei den gemessenen Werten wurde kein zusätzlicher Runtime-/Designumbau vorgenommen. Vor allem KaTeX nur bei nachgewiesenem Bedarf anders laden; die bestehenden Formeln sollen weiterhin im HTML stehen.

Die Google-PageSpeed-API antwortete mit HTTP 429. Deshalb wurde Lighthouse vorübergehend ausserhalb des Repositorys installiert; keine zusätzlichen Projektabhängigkeiten und kein neues Browserprofil des Nutzers wurden verwendet.

## Verifikation und weiteres Vorgehen

`npm test` prüft zentrale Canonical-/Metadatenregeln, Veröffentlichungsauswahl, XML-Escaping und robots-Ausgabe. `npm run check` und `npm run build` prüfen die Integration. Die erzeugten drei HTML-Seiten, Sitemap, robots, Redirectdatei und ein gesonderter Preview-Build werden auf korrekte Indexierbarkeit geprüft.

Nach Veröffentlichung die Sitemap in der bereits eingerichteten Search Console erneut abrufen lassen und die drei Seiten mit der URL-Prüfung kontrollieren. Suchanfragen und Indexierung dort über längere Zeit verfolgen. Noch keine künstlichen Rezensionen, nicht belegte strukturierte Daten oder Keyword-Blöcke hinzufügen. Fachliche Inhalte und Quellen bleiben der weitere Ausbau neben diesen technischen Grundlagen.

Referenzen: [Google zu Canonical-URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google zu Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Netlify-Weiterleitungen](https://docs.netlify.com/manage/routing/redirects/overview/).
