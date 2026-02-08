type ExponentialBackoffOptions = {
	/**
	 * Keeps trying until function returns `true`, `maxReties` are exhausted, or `maxDelayMs` is reached
	 */
	fn: () => boolean,
	maxRetries: number,
	initialDelay: number,
	maxDelayMs: number
}

export async function wait(timeout: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

export async function exponentialBackoff(options: ExponentialBackoffOptions): Promise<boolean> {
	let tries = 0;
	let totalTimeMs = 0;

	while (tries < options.maxRetries && totalTimeMs < options.maxDelayMs) {
		const success = options.fn();
		if (success) {
			return true; // Exit early if the callback succeeds
		}

		// Calculate exponential backoff delay
		const delay = Math.min(options.initialDelay * Math.pow(2, tries), options.maxDelayMs);
		await wait(delay);

		tries += 1;
		totalTimeMs += delay;
	}

	return false; // Return false if all retries fail
}
