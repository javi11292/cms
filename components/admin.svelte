<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import * as fields from "$lib/cms.config";
	import { Button, Modal, icons } from "$lib/core/components";
	import { upload } from "$lib/core/utils";
	import { flip } from "svelte/animate";
	import type { Entry } from "../utils/types";
	import AddEntry from "./add-entry.svelte";

	type Props = { entries: Entry[]; table: keyof typeof fields; title?: string };

	let { entries, table, title }: Props = $props();

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

	const handleDelete = (id: number) => async (event: Event) => {
		event.stopPropagation();
		event.preventDefault();

		await upload("?/delete", { id: id.toString() });
		invalidateAll();
	};

	const handleOpen = (id: number | null) => () => {
		open = true;
		editing = id;
	};

	const handleClick = (event?: Event) => {
		event?.preventDefault();
		open = false;
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
		onclick={handleClick}
		fields={tableFields}
		entry={editing !== null ? { ...entries[editing] } : null}
	/>
</Modal>

<style lang="scss">
	@use "$lib/core/styles";

	section {
		padding: 3.2rem;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
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
		font-size: 1.2rem;
		padding: 1.6rem;
		text-align: start;
	}

	td {
		padding: 1.6rem;
	}

	td:first-child {
		width: 0;
	}
</style>
