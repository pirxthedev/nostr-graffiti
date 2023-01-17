import App from './App.svelte';

const svelteDiv = document.createElement('div');
svelteDiv.setAttribute('id', 'nostr-graffiti');
document.body.appendChild(svelteDiv);

const app = new App({
	target: document.querySelector("#nostr-graffiti")
});

export default app;