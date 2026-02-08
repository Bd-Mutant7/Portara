export function isWindows(): boolean {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const platform: NodeJS.Platform = window.process.getPlatform();

	return platform === "win32";
}
