<script lang="ts">
	import Input from "$lib/core/components/input.svelte";
	import { post } from "$lib/core/utils/fetch";

	let name = $state("");
	let description = $state("");

	const handleClick = () => {
		post("/api/post", {});
	};
</script>

<Input label="Nombre" bind:value={name} />
<Input label="Descripción" rows={3} bind:value={description} />
<button onclick={handleClick}>Enviar</button>
