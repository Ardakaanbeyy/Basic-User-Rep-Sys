/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// CORS headers ekle
	const response = await resolve(event);
	
	if (event.url.pathname.startsWith('/api')) {
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	}
	
	return response;
}