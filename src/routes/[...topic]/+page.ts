import { error, redirect } from '@sveltejs/kit';
import { topics } from '#lib/content/topics.ts';
import type { EntryGenerator, PageLoad } from './$types';
export const entries: EntryGenerator = () => [{ topic: 'de' }, ...topics.filter(topic => topic.published).flatMap(topic => [{ topic: topic.path.slice(1) }, { topic: `de${topic.path}` }])];
export const load: PageLoad = ({ params }) => {
  const path = `/${params.topic}`.replace(/^\/de(?=\/|$)/, '') || '/';
  const prefix = params.topic === 'de' || params.topic.startsWith('de/') ? '/de' : '';
  if (path === '/') return { topic: null };
  if (path === '/electromagnetism/transformers') redirect(301, `${prefix}/electromagnetism/inductors`);
  const topic = topics.find(topic => topic.published && topic.path === path);
  if (!topic) error(404, 'This topic is not available.');
  return { topic };
};
