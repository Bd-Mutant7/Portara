export function set<T>(key: string, value: T): void {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore See https://www.electronjs.org/docs/tutorial/process-model#preload-scripts
	window.store.set(key, value);
}

export function get<T>(key: string, defaultValue: T): T | undefined {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore See https://www.electronjs.org/docs/tutorial/process-model#preload-scripts
	return window.store.get(key, defaultValue) as T | undefined;
}
