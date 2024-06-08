<script lang="ts">
	import { invalidate } from "$app/navigation";
	import * as fields from "$lib/cms.config";
	import { Button, Modal, icons } from "$lib/core/components";
	import { post } from "$lib/core/utils";
	import { flip } from "svelte/animate";
	import type { Entry } from "../utils/types";
	import AddEntry from "./add-entry.svelte";

	type Props = { entries: Entry[]; api: string; table: keyof typeof fields; title?: string };

	let { entries, api, table, title }: Props = $props();

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
		invalidate(`cms:${api}`);
	};

	const handleOpen = (id: number | null) => () => {
		open = true;
		editing = id;
	};

	const handleClick = () => {
		open = false;
		invalidate(`cms:${api}`);
	};
</script>

<section>
	<div class="container">
		<div>
			{#if title}
				<h1>{title}</h1>
			{/if}
			<Button onclick={handleOpen(null)}>Añadir</Button>
		</div>
		{#if entries.length > 0}
			<table>
				{#if columns.length > 1}
					<thead>
						<tr>
							<td></td>
							{#each columns as column}
								<th>{tableFields[column].label}</th>
							{/each}
						</tr>
					</thead>
				{/if}

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
			No hay elementos
		{/if}
	</div>
</section>

<Modal bind:open>
	<AddEntry
		{api}
		{table}
		entry={editing !== null ? { ...entries[editing] } : null}
		onclick={handleClick}
	/>
</Modal>

<style lang="scss">
	@use "$lib/core/styles";

	section {
		padding: 2rem;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	tr {
		@extend %background;

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
		padding: 1rem;
		text-align: start;
	}

	td {
		padding: 1rem;
	}

	td:first-child {
		width: 0;
	}
</style>
