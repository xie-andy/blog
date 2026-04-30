import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const slug = new URL(context.request.url).searchParams.get('slug');
  if (!slug) return new Response(JSON.stringify({ error: 'slug required' }), { status: 400 });

  const db = getDB(context);
  const { results } = await db
    .prepare('SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC')
    .bind(slug)
    .all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  const { post_slug, author_name, content } = await context.request.json();
  if (!post_slug || !content) {
    return new Response(JSON.stringify({ error: 'post_slug and content required' }), { status: 400 });
  }

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const db = getDB(context);

  await db
    .prepare('INSERT INTO comments (id, post_slug, author_name, content, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, post_slug, author_name ?? null, content, created_at)
    .run();

  return new Response(
    JSON.stringify({ id, post_slug, author_name: author_name ?? null, content, created_at }),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
};
