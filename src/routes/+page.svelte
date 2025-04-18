<script lang="ts">
    import { onMount } from 'svelte';
    import Orbiter from './Orbiter.svelte';

    const MILLIS_PER_CYCLE: number = 16_000;
    const TICKS_PER_CYCLE: number = 12_000;

    let currentTicks: number = $state(0);
    let cycleProgress: number = $derived(currentTicks / TICKS_PER_CYCLE);
    let playing: boolean = $state(true);
    let buttonText: string = $derived(playing ? '⏸' : '▸');

    onMount(async () => update());

    function handleClick() {
		playing = !playing;
		update();
	}

    function update() {
        if (playing) {
            requestAnimationFrame(step);
        }
    }

    function step(currentMillis: number, previousMillis?: number) {
        if (previousMillis !== undefined) {
            currentTicks += (currentMillis - previousMillis) * TICKS_PER_CYCLE / MILLIS_PER_CYCLE;
            if (currentTicks > TICKS_PER_CYCLE) {
                currentTicks = currentTicks % TICKS_PER_CYCLE;
            }
        }
        if (playing) {
            requestAnimationFrame((nextMillis) => step(nextMillis, currentMillis));
        }
    }
</script>

<svelte:head>
    <title>Drowzee</title>
    <meta name="description" content="Drowzee" />
</svelte:head>
<main>
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <Orbiter index={1} count={12} time={cycleProgress} />
        <Orbiter index={2} count={12} time={cycleProgress} />
        <Orbiter index={3} count={12} time={cycleProgress} />
        <Orbiter index={4} count={12} time={cycleProgress} />
        <Orbiter index={5} count={12} time={cycleProgress} />
        <Orbiter index={6} count={12} time={cycleProgress} />
        <Orbiter index={7} count={12} time={cycleProgress} />
        <Orbiter index={8} count={12} time={cycleProgress} />
        <Orbiter index={9} count={12} time={cycleProgress} />
        <Orbiter index={10} count={12} time={cycleProgress} />
        <Orbiter index={11} count={12} time={cycleProgress} />
        <Orbiter index={12} count={12} time={cycleProgress} />
    </svg>
</main>
<footer>
	<button class="control" onclick={handleClick}>{buttonText}</button>
    <input class="slider" type="range" id="time" min="0" max="10000" bind:value={currentTicks} />
</footer>

<style>
    main {
		width: calc(100vmin - 5rem);
		height: calc(100vmin - 5rem);
	}

	svg {
		width: 100%;
		height: 100%;
	}

	footer {
		height: 4rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    button {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        margin-left: 1rem;
    }

	.slider {
        cursor: pointer;
		width: 100%;
		margin: 1rem;
	}
</style>
