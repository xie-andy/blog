import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const raw = new URL(context.request.url).searchParams.get('ids');
  if (!raw) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

  const ids = raw.split(',').filter(Boolean);
  if (ids.length === 0) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

  const db = getDB(context);
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT comment_id, vote_type FROM comment_votes WHERE comment_id IN (${placeholders})`)
    .bind(...ids)
    .all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  const { comment_id, vote_type } = await context.request.json();
  if (!comment_id || !['up', 'down'].includes(vote_type)) {
    return new Response(JSON.stringify({ error: 'invalid' }), { status: 400 });
  }

  const db = getDB(context);
  await db
    .prepare('INSERT INTO comment_votes (comment_id, vote_type) VALUES (?, ?)')
    .bind(comment_id, vote_type)
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
