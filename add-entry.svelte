<script lang="ts">
	import { fields } from "$lib/cms.config";
	import Button from "$lib/core/components/button.svelte";
	import Input from "$lib/core/components/input.svelte";
	import { post } from "$lib/core/utils/fetch";
	import type { ComponentType } from "svelte";
	import type { Entry } from "./types";

	let { api, onclick, entry }: { api: string; onclick: () => void; entry: Entry | null } = $props();

	let values = $state<Entry>(entry || {});
	let loading = $state(false);

	const handleClick = async () => {
		loading = true;
		await post(api, $state.snapshot(values));
		onclick();
	};

	const fieldsEntries = Object.entries(fields);

	let disabled = $derived(
		fieldsEntries.some(([name, { required }]) => {
			return required && !values[name];
		}),
	);
</script>

<div class="container">
	{#each fieldsEntries as [name, { component = Input, label, props }]}
		<svelte:component
			this={component as ComponentType}
			bind:value={values[name]}
			{label}
			{...props}
		/>
	{/each}

	<Button {loading} {disabled} onclick={handleClick}>Enviar</Button>
</div>

<style lang="scss">
	.container {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		:global(.button) {
			align-self: start;
		}
	}
</style>
