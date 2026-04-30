/// <reference types="@cloudflare/workers-types" />
import type { APIContext } from 'astro';

export function getDB(context: APIContext): D1Database {
  const db = (context.platform as any)?.env?.blog_db;
  if (!db) throw new Error('D1 binding "DB" not found. Ensure wrangler.toml is configured.');
  return db as D1Database;
}
