import { defineMiddleware } from 'astro:middleware';

const PASSWORD = 'lexieblogs72';
const COOKIE_NAME = 'journal_auth';

export const onRequest = defineMiddleware(async (context, next) => {
	if (!context.url.pathname.startsWith('/journal')) return next();

	const cookie = context.cookies.get(COOKIE_NAME)?.value;
	if (cookie === PASSWORD) return next();

	if (context.request.method === 'POST') {
		const form = await context.request.formData();
		if (form.get('password') === PASSWORD) {
			const response = await next();
			response.headers.append(
				'Set-Cookie',
				`${COOKIE_NAME}=${PASSWORD}; Path=/journal; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
			);
			return response;
		}
	}

	return new Response(
		`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;display:flex;justify-content:center;padding-top:20vh;margin:0">
<form method="POST" style="display:flex;flex-direction:column;gap:0.75rem;min-width:220px">
  <label style="font-size:0.9em;color:#555">Password</label>
  <input type="password" name="password" autofocus style="padding:0.5rem;border:1px solid #ccc;border-radius:4px;font-size:1rem">
  <button type="submit" style="padding:0.5rem;background:#000;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:1rem">Enter</button>
</form>
</body></html>`,
		{ status: 401, headers: { 'Content-Type': 'text/html' } },
	);
});
