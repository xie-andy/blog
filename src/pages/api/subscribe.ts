import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const POST: APIRoute = async (context) => {
  const data = await context.request.formData();
  const email = data.get('email')?.toString().trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = getDB(context);
  try {
    await db
      .prepare('INSERT INTO email_subscribers (email) VALUES (?)')
      .bind(email)
      .run();
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: "You're already subscribed." }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Something went wrong. Try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
