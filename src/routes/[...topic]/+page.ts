import { error, redirect } from '@sveltejs/kit';
import { topics } from '#lib/content/topics.ts';
import type { EntryGenerator, PageLoad } from './$types';
export const entries: EntryGenerator = () => topics.filter(topic => topic.published).map(topic => ({ topic: topic.path.slice(1) }));
export const load: PageLoad = ({ params }) => {
  if (params.topic === 'electromagnetism/transformers') redirect(301, '/electromagnetism/inductors');
  const topic = topics.find(topic => topic.published && topic.path === `/${params.topic}`);
  if (!topic) error(404, 'This topic is not available.');
  return { topic };
};
