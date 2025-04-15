<script lang="ts">
    import Orbiter from './Orbiter.svelte';

    const CYCLE_TIME: number = 10_000;

    let time: number = 0;
</script>

<svelte:head>
    <title>Drowzee</title>
    <meta name="description" content="Drowzee" />
</svelte:head>
<main>
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <Orbiter color="red" orbits={3} distance={100} {time} />
        <Orbiter color="orange" orbits={2} distance={200} {time} />
        <Orbiter color="yellow" orbits={1} distance={300} {time} />
    </svg>
</main>
<footer>
	<input class="slider" type="range" id="time" min="0" max="10000" bind:value={time} />
</footer>

<style>
    main {
		width: calc(100vmin - 50px);
		height: calc(100vmin - 50px);
	}

	svg {
		width: 100%;
		height: 100%;
	}

	footer {
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slider {
		width: 100%;
		margin: 10px;
	}
</style>
