/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Process } from "@app/services/processreader";

export async function terminate(process: Process, maxWaitTimeMs = 3000): Promise<boolean> {
	// @ts-ignore See https:// www.electronjs.org/docs/tutorial/process-model#preload-scripts
	return window.process.terminate(process, maxWaitTimeMs);
}

export async function stop(process: Process, maxWaitTimeMs = 3000): Promise<boolean> {
	// @ts-ignore See https:// www.electronjs.org/docs/tutorial/process-model#preload-scripts
	return window.process.stop(process, maxWaitTimeMs);
}
