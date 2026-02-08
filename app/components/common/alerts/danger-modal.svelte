<script lang="ts">
	import { onMount } from "svelte";
	import { Modal } from "bootstrap";

	type ClickHandler = () => Promise<void>;
	let modalInstance: Modal;

	export let modalId: string;
	export let cancelButtonText = "Cancel";
	export let message: string;
	export let title: string;
	export let acceptButtonText: string;
	export let onAccept: ClickHandler;
	let loading = false;

	onMount(() => {
		modalInstance = new Modal(document.getElementById(modalId));
	})

	const closeModal = () => {
		console.debug("closing modal...");
		modalInstance.hide();
	};


	const handleOnClick: ClickHandler = async () => {
		loading = true;
		try {
			await onAccept();
			closeModal();
		} catch (err) {
			console.error("Error in click handler", err);
		} finally {
			loading = false;
		}
	};
</script>

<div id="{modalId}" class="modal fade" data-bs-backdrop="static" aria-hidden="true" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content flex-container">
			<div class="modal-header">
				<h5 class="modal-title">{title}</h5>
				<button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
			</div>
			{#if !loading}
				<div class="modal-body">
					{message}
					<slot name="submessage"></slot>
				</div>
			{/if}
			{#if loading}
				<div class="d-flex justify-content-center align-items-center p-3">
					<div id="loader" class="spinner-border" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			{/if}
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" on:click={closeModal}
						disabled="{loading}">{cancelButtonText}</button>
				<button type="button" class="btn btn-danger" on:click={handleOnClick}
						disabled="{loading}">{acceptButtonText}</button>
			</div>
		</div>
	</div>
</div>