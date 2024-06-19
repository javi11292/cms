<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { Button, Modal, icons } from "$lib/core/components";
	import { upload } from "$lib/core/utils";
	import { flip } from "svelte/animate";
	import type { Fields, Item } from "../types";
	import AddItem from "./add-item.svelte";
	import styles from "./admin.module.scss";

	type Props = { data: { items: Item[] }; fields: Fields; title?: string };

	let { data, title, fields }: Props = $props();

	let open = $state(false);
	let editing = $state<number | null>(null);
	let columns = $derived(
		Object.entries(fields).reduce<string[]>((acc, [key, field]) => {
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

	const handleClick = () => {
		open = false;
	};
</script>

<section class={styles.section}>
	<div class={styles.container}>
		<div>
			{#if title}
				<h1 class={styles.h1}>{title}</h1>
			{/if}
			<Button onclick={handleOpen(null)}>Añadir</Button>
		</div>
		{#if data.items.length > 0}
			<table>
				{#if columns.length > 1}
					<thead>
						<tr>
							<td></td>
							{#each columns as column}
								<th>{fields[column]!.label}</th>
							{/each}
						</tr>
					</thead>
				{/if}

				<tbody>
					{#each data.items as entry, index (entry.id)}
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
	<AddItem
		{fields}
		onclick={handleClick}
		item={editing !== null ? data.items[editing] : undefined}
	/>
</Modal>
