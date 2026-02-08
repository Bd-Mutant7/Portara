/**
 * Svelte Init
 * =====================
 * Create svelte app
 *
 * @contributors: Henry [@henryjw] <3443648+henryjw@users.noreply.github.com>
 *
 * @license: MIT License
 *
 */
import App from "@app/pages/index/index.svelte";

const app = new App({
	target: document.body,
});

export default app;
