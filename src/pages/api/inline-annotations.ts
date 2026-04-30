import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const slug = new URL(context.request.url).searchParams.get('slug');
  if (!slug) return new Response(JSON.stringify({ error: 'slug required' }), { status: 400 });

  const db = getDB(context);
  const { results } = await db
    .prepare('SELECT * FROM inline_annotations WHERE post_slug = ?')
    .bind(slug)
    .all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  const { post_slug, selected_text, occurrence_index, annotation_type, reaction_type, content, author_name } =
    await context.request.json();

  if (!post_slug || !selected_text || !['reaction', 'comment'].includes(annotation_type)) {
    return new Response(JSON.stringify({ error: 'invalid' }), { status: 400 });
  }

  const created_at = new Date().toISOString();
  const db = getDB(context);

  await db
    .prepare(
      'INSERT INTO inline_annotations (post_slug, selected_text, occurrence_index, annotation_type, reaction_type, content, author_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(
      post_slug,
      selected_text,
      occurrence_index ?? 0,
      annotation_type,
      reaction_type ?? null,
      content ?? null,
      author_name ?? null,
      created_at
    )
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
