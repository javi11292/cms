<script lang="ts">
	import { invalidate } from "$app/navigation";
	import * as fields from "$lib/cms.config";
	import { Button, Modal, icons } from "$lib/core/components";
	import { post } from "$lib/core/utils";
	import { flip } from "svelte/animate";
	import type { Entry } from "../utils/types";
	import AddEntry from "./add-entry.svelte";

	type Props = { entries: Entry[]; api: string; table: keyof typeof fields };

	let { entries, api, table }: Props = $props();

	let open = $state(false);
	let editing = $state<number | null>(null);
	let tableFields = $derived(fields[table]);
	let columns = $derived(
		Object.entries(tableFields).reduce<string[]>((acc, [key, field]) => {
			if (field.visible) {
				acc.push(key);
			}
			return acc;
		}, []),
	);

	const handleDelete = (id: unknown) => async (event: Event) => {
		event.stopPropagation();
		event.preventDefault();

		await post(api, { id }, { method: "DELETE" });
		invalidate(api);
	};

	const handleOpen = (id: number | null) => () => {
		open = true;
		editing = id;
	};

	const handleClick = () => {
		open = false;
		invalidate(api);
	};
</script>

<main>
	<div class="container">
		<Button onclick={handleOpen(null)}>Añadir</Button>
		{#if entries.length > 0}
			<table>
				<thead>
					<tr>
						<td></td>
						{#each columns as column}
							<th>{tableFields[column].label}</th>
						{/each}
					</tr>
				</thead>

				<tbody>
					{#each entries as entry, index (entry.id)}
						<tr animate:flip={{ duration: 200 }} onclick={handleOpen(index)}>
							<td><Button icon={icons.delete} text onclick={handleDelete(entry.id)} /></td>
							{#each columns as column}
								<td>{entry[column]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<h1>No hay elementos</h1>
		{/if}
	</div>
</main>

<Modal bind:open>
	<AddEntry
		{api}
		{table}
		entry={editing !== null ? { ...entries[editing] } : null}
		onclick={handleClick}
	/>
</Modal>

<style lang="scss">
	@use "$lib/core/styles/hover";

	main {
		padding: 2rem;
	}

	.container {
		display: inline-flex;
		flex-direction: column;
		gap: 1rem;

		:global(> .button) {
			align-self: start;
		}
	}

	table {
		border-collapse: collapse;
		text-align: center;
		color: black;
	}

	tr {
		@extend %background;
		box-shadow: 0 -1px lightgrey inset;

		&:has(button:active) {
			&::before {
				background: none;
			}
		}

		&:has(button:hover) {
			&::before {
				background: none;
			}
		}
	}

	th {
		text-transform: uppercase;
		font-size: 0.75rem;
		padding: 1rem 3rem;
	}

	td {
		padding: 1rem;
	}
</style>
