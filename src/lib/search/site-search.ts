import { models, topics } from '../content/topics.ts';
import { groupTopicModels } from '../content/model-groups.ts';
import { baseUnits, namedUnits, commonUnits, physicalConstants } from '../content/si-reference.ts';
import { germanText } from '../i18n/text-de.ts';
import { languagePath, type Locale } from '../i18n/locale.ts';

export interface SearchEntry {
  id: string;
  href: string;
  path: readonly string[];
  title: string;
  hierarchy: string;
  content: string;
  formulas: string;
}

/** Ignore accents, separators and LaTeX layout commands, while retaining symbols and numbers. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/ß/g, 'ss')
    .replace(/\\(?:mathrm|mathbf|mathit|text|frac|sqrt|left|right|cdot|times|!|,|;)/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
const compact = (value: string) => value.replace(/ /g, '');
const translate = (value: string) => germanText[value] ?? germanText[value.toLowerCase()] ?? value;
const bilingual = (values: readonly string[]) => values.flatMap(value => [value, translate(value)]).join(' ');

/** Content comes from the same catalogue as the pages, including every grouped variant. */
export function createSiteSearchIndex(locale: Locale): SearchEntry[] {
  const display = locale === 'de' ? translate : (value: string) => value;
  const published = topics.filter(topic => topic.published);
  const byId = new Map(published.map(topic => [topic.id, topic]));
  const hierarchy = (id: string): string[] => {
    const topic = byId.get(id);
    return topic ? [...(topic.parentId ? hierarchy(topic.parentId) : []), topic.title] : [];
  };
  const entry = (id: string, path: string[], url: string, title: string[], content: string[], formulas: string[] = []): SearchEntry => ({
    id, path: path.map(display), href: url,
    title: normalizeSearch(bilingual(title)), hierarchy: normalizeSearch(bilingual(path)),
    content: normalizeSearch(bilingual(content)), formulas: normalizeSearch(formulas.join(' '))
  });
  const result = published.map(topic => entry(`topic:${topic.id}`, hierarchy(topic.id), languagePath(topic.path, locale),
    [topic.title, topic.navigationTitle ?? ''], [topic.description, topic.seo?.description ?? '']));
  for (const model of models) {
    const topic = byId.get(model.topicId);
    if (!topic) continue;
    const card = groupTopicModels(models.filter(item => item.topicId === model.topicId))
      .find(card => card.id === model.id || card.variants?.some(variant => variant.model.id === model.id));
    result.push(entry(`model:${model.id}`, [...hierarchy(topic.id), model.title],
      `${languagePath(topic.path, locale)}#model-${encodeURIComponent(model.id)}`,
      [model.title, card?.title ?? ''], [
        ...model.variables.flatMap(variable => [variable.name, variable.symbol, variable.unit, variable.unitName]),
        ...model.formulas.flatMap(formula => [formula.label, formula.expression]),
        ...(model.notes ?? []).flatMap(note => [note.text, note.expression ?? ''])
      ], model.formulas.map(formula => formula.expression)));
  }
  const reference = byId.get('si-reference');
  if (reference) {
    const sections = [
      { id: 'base-units', title: 'Base units', values: baseUnits },
      { id: 'derived-units', title: 'Named derived units', values: namedUnits },
      { id: 'unit-relationships', title: 'Unit relationships', values: commonUnits },
      { id: 'constants', title: 'Physical constants', values: physicalConstants }
    ];
    for (const section of sections) result.push(entry(`reference:${section.id}`, [reference.title, section.title],
      `${languagePath(reference.path, locale)}#${section.id}`, [section.title],
      section.values.flatMap(value => Object.values(value))));
  }
  return result;
}

/** Every query term must match; compact matching also accepts “Uniformmotion” and paths. */
export function searchSite(index: readonly SearchEntry[], query: string): SearchEntry[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const terms = normalized.split(' ');
  return index.flatMap(entry => {
    const fields = [entry.title, entry.hierarchy, entry.content];
    const matches = terms.every(term => fields.some(field => field.includes(term) || compact(field).includes(term)));
    if (!matches) return [];
    const score = (compact(entry.title).includes(compact(normalized)) ? 100 : 0)
      + (compact(entry.formulas).includes(compact(normalized)) ? 80 : 0)
      + terms.reduce((sum, term) => sum + (entry.title.includes(term) ? 20 : entry.hierarchy.includes(term) ? 5 : 1), 0);
    return [{ entry, score }];
  }).sort((a, b) => b.score - a.score || a.entry.path.join('/').localeCompare(b.entry.path.join('/'))).map(match => match.entry);
}
