/// <reference types="@cloudflare/workers-types" />
import { env } from 'cloudflare:workers';

export function getDB(): D1Database {
  const db = (env as any).blog_db;
  if (!db) throw new Error('D1 binding "blog_db" not found');
  return db as D1Database;
}
