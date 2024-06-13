<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, Input } from "$lib/core/components";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Fields, Item } from "../types";

	type Props = {
		onclick: () => void;
		item?: Item;
		fields: Fields;
	};

	let { onclick, item, fields }: Props = $props();

	let values = $state<Omit<Item, "id"> & { id?: number }>({ ...item });
	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ update }) => {
			update();
			onclick();
		};
	};

	const fieldsEntries = $derived(Object.entries(fields));

	let disabled = $derived(
		fieldsEntries.some(([name, { required }]) => {
			return required && !values[name];
		}),
	);
</script>

<form use:enhance={handleSubmit} method="POST" action="?/post" class="container">
	<input hidden name="id" value={item?.id} />

	{#each fieldsEntries as [name, { label, props }]}
		<Input bind:value={values[name]} {name} {label} {...props} />
	{/each}

	<div class="buttons">
		<Button {onclick} text>Cancelar</Button>
		<Button {loading} {disabled} type="submit">Enviar</Button>
	</div>
</form>

<style lang="scss">
	.container {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 5rem;

		:global(.button) {
			align-self: start;
		}
	}

	.buttons {
		display: flex;
		gap: 5rem;
		justify-content: space-between;
	}
</style>
