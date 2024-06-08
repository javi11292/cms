<script lang="ts">
	import * as fields from "$lib/cms.config";
	import { Button, Input } from "$lib/core/components";
	import { post } from "$lib/core/utils";
	import type { ComponentType } from "svelte";
	import type { Entry } from "../utils/types";

	type Props = {
		api: string;
		onclick: () => void;
		entry: Entry | null;
		table: keyof typeof fields;
	};

	let { api, onclick, entry, table }: Props = $props();

	let values = $state<Entry>(entry || {});
	let loading = $state(false);

	const handleClick = async () => {
		loading = true;
		await post(api, $state.snapshot(values));
		onclick();
	};

	const fieldsEntries = Object.entries(fields[table]);

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
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;

		:global(.button) {
			align-self: start;
		}
	}
</style>
