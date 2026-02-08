/**
 * Preload
 * =====================
 *
 * @contributors: Henry [@henryjw] <3443648+henryjw@users.noreply.github.com>
 *
 * @license: MIT License
 *
 */

import { contextBridge } from "electron";
import { exec } from "child_process";
import { promisify } from "util";

import { Process } from "../app/services/processreader";
import { MAX_PORT_NUMBER, MIN_PORT_NUMBER } from "../app/constants/numbers";
import { exponentialBackoff } from "../app/utils/wait";

const execAsync = promisify(exec);

const WINDOWS_NEWLINE = "\r\n";
const UNIX_NEWLINE = "\n";

const LSOF_EXIT_CODES = {
	OK: 0,
	NO_RESULTS: 1,
	COMMAND_NOT_FOUND: 127,
};

const INVALID_PORT_NUMBER_CODE = -1;

async function getProcessesUnix({ wsl = false }): Promise<Process[]> {
	// `+c {number}` expands the number of characters lsof returns for each command name; the default length is 9, which
	// is too short
	const script = `${wsl ? "wsl" : ""} lsof -PiTCP -sTCP:LISTEN +c 100`;
	console.debug("GetProcesses Script: ", script);

	let scriptResult: string;

	try {
		scriptResult = (await execAsync(script)).stdout.trim();
		console.debug("Script result: ", scriptResult);
	} catch (err) {
		console.error("Error getting processes", err);
		if (err.code == LSOF_EXIT_CODES.NO_RESULTS) {
			return [];
		}

		if (err.code == LSOF_EXIT_CODES.COMMAND_NOT_FOUND) {
			const message = wsl
				? "Failed to read WSL processes. Make sure `lsof` command is installed inside your distro."
				: "Failed to read processes. Make sure `lsof` is installed.";

			throw new Error(message);
		}

		throw err;
	}

	const rows = scriptResult.split(UNIX_NEWLINE).slice(1);

	return rows.map((row) => {
		const columnSeparator = "  ";
		row = row.trim().replace(/[ ]+/g, columnSeparator);

		const [command, pid, user, fd, type, deviceSize, offset, node, name] = row.split(columnSeparator);
		const [ipAddress, portNumber] = name.split(":");

		return {
			command,
			id: Number.parseInt(pid, 10),
			portNumber: Number.parseInt(portNumber, 10) || INVALID_PORT_NUMBER_CODE,
			isWSL: wsl,
		};
	});
	// .filter((process) => process.portNumber !== INVALID_PORT_NUMBER_CODE);
}

async function getProcessesWindows(): Promise<Process[]> {
	const scriptResult = (await execAsync('netstat -aon | findstr "LISTENING"')).stdout.trim();

	const rows = scriptResult.split(WINDOWS_NEWLINE).slice(1);

	const processes = rows
		.map((row): Process => {
			const columnSeparator = "  ";
			row = row.trim().replace(/[ ]+/g, columnSeparator);

			const [_, name, __, ___, pid] = row.split(columnSeparator);
			const [ipAddress, portNumber] = name.match(/.+:(?<portNumber>[0-9]+)/g)[0].split(":");

			if (ipAddress !== "127.0.0.1") {
				return null;
			}

			return {
				command: "",
				id: Number.parseInt(pid, 10),
				portNumber: Number.parseInt(portNumber, 10),
				isWSL: false,
			};
		})
		.filter(Boolean); // Filter out invalid processes

	for (const process of processes) {
		// TODO: optimize this to be executed as a single command instead of one command per process

		// Example out script output:
		// Image Name                     PID Services
		// ========================= ======== ============================================
		// webstorm64.exe                3004 N/A

		try {
			process.command = (await execAsync(`tasklist /svc /FI "PID eq ${process.id}"`)).stdout
				.trim()
				.split(WINDOWS_NEWLINE)
				.slice(2)[0]
				.replace(/ [0-9]+ .+$/, "")
				.trim();
		} catch (err) {
			console.error(`Error getting process name for process with ID ${process.id}`, err);
		}
	}

	return processes;
}

async function getProcesses(fromPort = MIN_PORT_NUMBER, toPort = MAX_PORT_NUMBER, checkWslProcesses = false): Promise<Process[]> {
	const isWindows = getPlatform() === "win32";

	let processes: Process[] = [];
	if (!isWindows || (isWindows && checkWslProcesses)) {
		processes = processes.concat(await getProcessesUnix({ wsl: isWindows }));
	}

	if (isWindows) {
		processes = processes.concat(await getProcessesWindows());
	}
	return processes.filter((process) => process.portNumber >= fromPort && process.portNumber <= toPort);
}

function getPlatform() {
	return process.platform;
}

/**
 * Returns true if signal to stop process was sent successfully. False otherwise (e.g., if process is no longer running)
 */
function tryKill(pid: number, wsl: boolean, signal: "SIGINT" | "SIGKILL"): boolean {
	try {
		if (wsl) {
			return exec(`wsl kill ${pid}`).exitCode === 0;
		}
		return process.kill(pid, signal);
	} catch (err) {
		if (err.code === "ESRCH") {
			return false;
		}

		throw err;
	}
}

async function terminate(process: Process, maxWaitTimeMs: number): Promise<boolean> {
	return exponentialBackoff({
		maxDelayMs: maxWaitTimeMs,
		initialDelay: 100,
		maxRetries: 1000, // Doesn't matter; we only care about the time
		fn() {
			// Keep trying until `tryKill()` returns `false`; i.e., the process was terminated
			const signalSent = tryKill(process.id, process.isWSL, "SIGKILL");

			if (signalSent) {
				console.debug("Process is still running; will try to send signal again");
			} else {
				console.debug("Process terminated successfully");
			}

			return !signalSent;
		},
	});
}

async function stop(process: Process, maxWaitTimeMs: number): Promise<boolean> {
	return exponentialBackoff({
		maxDelayMs: maxWaitTimeMs,
		initialDelay: 100,
		maxRetries: 1000, // Doesn't matter; we only care about the time
		fn() {
			// Keep trying until `tryKill()` returns `false`; i.e., the process was terminated
			const signalSent = tryKill(process.id, process.isWSL, "SIGINT");

			if (signalSent) {
				console.debug("Process is still running; will try to send signal again");
			} else {
				console.debug("Process stopped successfully");
			}

			return !signalSent;
		},
	});
}

// https:// www.electronjs.org/docs/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("process", {
	getProcesses,
	terminate,
	getPlatform,
	stop,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ElectronStore = require("electron-store");
const electronStore = new ElectronStore();


contextBridge.exposeInMainWorld("store", {
	set: function(key, value) {
		electronStore.set(key, value);
	},
	get: function(key, defaultValue) {
		return electronStore.get(key, defaultValue);
	},
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
	const replaceText = (selector: string, text: string) => {
		const element = document.getElementById(selector);
		if (element) {
			element.innerText = text;
		}
	};

	for (const type of ["chrome", "node", "electron"]) {
		replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
	}
});
