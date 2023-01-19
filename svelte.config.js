import adapter from 'sveltekit-adapter-browser-extension';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		appDir: 'app',
		prerender: {
			default: true
		}
	}
};

export default config;
