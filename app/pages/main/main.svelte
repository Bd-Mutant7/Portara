<script lang="ts">
	import { onMount } from "svelte";

	import { MAX_PORT_NUMBER, MIN_PORT_NUMBER } from "@app/constants/numbers";
	import { getProcesses } from "@app/services/processreader";
	import type { Process } from "@app/services/processreader";
	import ProcessTable from "@app/components/processtable/processtable.svelte";
	import { isWindows } from "@app/utils/platform";
	import { set as setSetting, get as getSetting } from "@app/utils/settings-store";
	import { wait } from "@app/utils/wait";
	import { generateRandomNumber } from "@app/utils/random-generator";
	import { sort } from "@app/utils/sort";

	const IS_WINDOWS = isWindows();
	const PLACE_HOLDER_LOAD_TIME_RANGE = {
		min: 500,
		max: 750,
	};
	const SETTING_KEYS = {
		startPort: "startPort",
		endPort: "endPort",
		restrictedRangeEnabled: "restrictedRangeEnabled",
		checkWslProcesses: "checkWslProcesses",
	};

	let startPort = getSetting<number>(SETTING_KEYS.startPort, MIN_PORT_NUMBER);
	let endPort = getSetting<number>(SETTING_KEYS.endPort, MAX_PORT_NUMBER);
	let restrictedRangeEnabled = getSetting<boolean>(SETTING_KEYS.restrictedRangeEnabled, false);
	let processes: Process[] = [];
	let isScanning = false;
	let checkWslProcesses = getSetting<boolean>(SETTING_KEYS.checkWslProcesses, true);
	let scanError: string | null = null;

	const performScan = async () => {
		try {
			isScanning = true;
			scanError = null;
			processes = [];

			const scanStart = Date.now();
			if (restrictedRangeEnabled) {
				processes = await getProcesses(startPort, endPort, checkWslProcesses);
			} else {
				processes = await getProcesses(MIN_PORT_NUMBER, MAX_PORT_NUMBER, checkWslProcesses);
			}

			const scanTime = Date.now() - scanStart;
			const waitTime = generateRandomNumber(PLACE_HOLDER_LOAD_TIME_RANGE.min, PLACE_HOLDER_LOAD_TIME_RANGE.max);

			// Wait a minimum amount of time to avoid flickering
			if (scanTime < waitTime) {
				await wait(waitTime - scanTime);
			}

			return processes;
		} catch (err) {
			console.error("Error getting processes", err);
			scanError = `Error scanning processes: "${err.message}"`;
		} 	finally {
			isScanning = false;
		}
	};

	const updateSetting = (key: string, value: boolean | string | number): void => {
		setSetting(key, value);
	};

	onMount(performScan);
</script>

<div class="container">
	<form id="scanner-form">
		<div>
			<input
				type="checkbox"
				bind:checked={restrictedRangeEnabled}
				on:change={e => updateSetting(SETTING_KEYS.restrictedRangeEnabled, e.target.checked)}
			/>
			<span>Only test ports between</span>
			<input
				type=number
				bind:value={startPort}
				min={MIN_PORT_NUMBER}
				max={MAX_PORT_NUMBER}
				disabled={!restrictedRangeEnabled}
				on:change={e => updateSetting(SETTING_KEYS.startPort, e.target.value)}
			/>
			<span>and</span>
			<input
				type=number
				bind:value={endPort}
				min={MIN_PORT_NUMBER}
				max={MAX_PORT_NUMBER}
				disabled={!restrictedRangeEnabled}
				on:change={e => updateSetting(SETTING_KEYS.endPort, e.target.value)}
			/>
			<button id="btn-scan" class="btn btn-primary" type="button" on:click={performScan} disabled={isScanning}>SCAN</button>
		</div>

		<div hidden={!IS_WINDOWS}>
			<input
				type="checkbox"
				bind:checked={checkWslProcesses}
				on:change={e => updateSetting(SETTING_KEYS.checkWslProcesses, e.target.checked)}
			/>
			<span>Check WSL Processes</span>
		</div>

		<ProcessTable processes={sort(processes, "portNumber", "asc")} onProcessChange={performScan} loading={isScanning}/>
		<span class="text-danger error" hidden={!scanError}>{scanError}</span>
	</form>
</div>

<style lang="scss">
	@import "main";
</style>
