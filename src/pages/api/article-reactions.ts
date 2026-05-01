import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const slug = new URL(context.request.url).searchParams.get('slug');
  if (!slug) return new Response(JSON.stringify({ error: 'slug required' }), { status: 400 });

  const db = getDB();
  const { results } = await db
    .prepare('SELECT reaction_type FROM article_reactions WHERE post_slug = ?')
    .bind(slug)
    .all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  const { post_slug, reaction_type } = await context.request.json();
  const valid = ['heart', 'laugh', 'wow', 'cry'];
  if (!post_slug || !valid.includes(reaction_type)) {
    return new Response(JSON.stringify({ error: 'invalid' }), { status: 400 });
  }

  const db = getDB();
  await db
    .prepare('INSERT INTO article_reactions (post_slug, reaction_type) VALUES (?, ?)')
    .bind(post_slug, reaction_type)
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
