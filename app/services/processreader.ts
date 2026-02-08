import { MAX_PORT_NUMBER, MIN_PORT_NUMBER } from "../constants/numbers";

export type Process = {
	portNumber: number;
	id: number;
	command: string;
	isWSL: boolean;
};

/**
 * Returns a list of processes using the TCP ports in the specified range
 * @param fromPort
 * @param toPort
 * @param checkWslProcesses
 */
export async function getProcesses(fromPort = MIN_PORT_NUMBER, toPort = MAX_PORT_NUMBER, checkWslProcesses = false): Promise<Process[]> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore See https://www.electronjs.org/docs/tutorial/process-model#preload-scripts
	return window.process.getProcesses(fromPort, toPort, checkWslProcesses);
}
