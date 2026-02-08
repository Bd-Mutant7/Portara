<script lang="ts">
	import { Modal } from "bootstrap";
	import DangerModal from "../common/alerts/danger-modal.svelte";
	import type { Process } from "../../services/processreader";
	import * as processManager from "../../services/processmanager";

	export let processes: Process[];
	/**
	 * This callback is executed when any change is performed to a process (e.g., process is terminated)
	 */
	export let onProcessChange: () => void;
	export let loading = false;
	let selectedProcess: Process | null;

	const stopProcessModalId = "stop-process-modal";
	const terminateProcessModalId = "terminate-process-modal";

	const setSelectedProcess = (process: Process): void => {
		selectedProcess = process;
	};

	const terminateProcess = async (process: Process) => {
		const terminated = await processManager.terminate(process);

		if (terminated) {
			console.debug(`Terminated process "${process.command}" (${process.id})`);
			alert(`Process "${process.command}" terminated`);
			onProcessChange();
		} else {
			alert("Unable to terminate process");
		}
	};

	const stopProcess = async (process: Process) => {
		const stopped = await processManager.stop(process, 5_000);

		if (stopped) {
			console.debug(`Stopped process "${process.command}" (${process.id})`);
			alert(`Process "${process.command}" stopped`);
			onProcessChange();
		} else {
			const terminateProcessModal = Modal.getInstance(document.getElementById(terminateProcessModalId));
			terminateProcessModal.show();
		}
	};
</script>

<DangerModal
	modalId="{terminateProcessModalId}"
	title="Terminate Process?"
	message="Unable to stop process. Would you like to force kill (terminate) this process?"
	acceptButtonText="Terminate"
	cancelButtonText="Cancel"
	onAccept={async () => await terminateProcess(selectedProcess)}
	on:close={() => (selectedProcess = null)}
>
	<!-- More on Svelte Slots: https://svelte.dev/docs/svelte/legacy-slots -->
	<p style="color:red;" slot="submessage">Note that terminating an application or process might leave it in a bad state.</p>
</DangerModal>


<DangerModal
	modalId="{stopProcessModalId}"
	title="Stop Process?"
	message="Are you sure you want to stop the process?"
	acceptButtonText="Stop"
	cancelButtonText="Cancel"
	onAccept={async () => await stopProcess(selectedProcess)}
	on:close={() => (selectedProcess = null)}
/>

<table class="table table-hover align-middle">
	<thead>
	<tr>
		<th scope="col"></th>
		<th scope="col">Port</th>
		<th scope="col">Command</th>
		<th scope="col">PID</th>
	</tr>
	</thead>
	{#if !loading}
		<tbody>
		{#each processes as process}
			<tr>
				<th scope="row">
					<button
						type="button"
						class="btn-close"
						aria-label="Close"
						data-toggle="modal"
						data-target="#{stopProcessModalId}"
						on:click={() => {
							setSelectedProcess(process)
							const modal = Modal.getInstance(document.getElementById(stopProcessModalId));
							modal.show();
						}} />
				</th>
				<td>
					{process.portNumber}
				</td>
				<td>
					{process.command}
					{#if process.isWSL}
						<span id="wsl-indicator">[WSL]</span>
					{/if}
				</td>
				<td>
					{process.id}
				</td>
			</tr>
		{/each}
		</tbody>
	{/if}
</table>
{#if loading}
	<div class="flex-container justify-content-center">
		<div id="loader" class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
{/if}

<style lang="scss">
	@import "./processtable.scss";
</style>
