<script lang="ts">
    import { onMount } from 'svelte';
    import Orbiter from './Orbiter.svelte';

    const MILLIS_PER_CYCLE: number = 16_000;
    const TICKS_PER_CYCLE: number = 12_000;

    let currentTicks: number = $state(0);
    let orbiterCount: number = $state(12);
    let cycleProgress: number = $derived(currentTicks / TICKS_PER_CYCLE);
    let playing: boolean = $state(true);
    let buttonText: string = $derived(playing ? '⏸' : '▸');

    onMount(async () => update());

    function update() {
        if (playing) {
            requestAnimationFrame(step);
        }
    }

    function step(currentMillis: number, previousMillis?: number) {
        if (previousMillis !== undefined) {
            currentTicks += Math.floor((currentMillis - previousMillis) * TICKS_PER_CYCLE / MILLIS_PER_CYCLE);
            if (currentTicks > TICKS_PER_CYCLE) {
                currentTicks = currentTicks % TICKS_PER_CYCLE;
            }
        }
        if (playing) {
            requestAnimationFrame((nextMillis) => step(nextMillis, currentMillis));
        }
    }

    function togglePause() {
		playing = !playing;
		update();
	}

    function increment() {
        if (orbiterCount < 20) {
            orbiterCount++;
        }
    }

    function decrement() {
        if (orbiterCount > 3) {
            orbiterCount--;
        }
    }
</script>

<svelte:head>
    <title>Drowzee</title>
    <meta name="description" content="Drowzee" />
</svelte:head>
<main>
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        {#each { length: orbiterCount }, index}
            <Orbiter {index} count={orbiterCount} time={cycleProgress} />
        {/each}
    </svg>
</main>
<footer>
	<button class="pause" onclick={togglePause}>{buttonText}</button>
    <input class="ticks" type="number" min="0" step="100" max={TICKS_PER_CYCLE} bind:value={currentTicks} />
    <input class="slider" type="range" min="0" max={TICKS_PER_CYCLE} bind:value={currentTicks} />
    <p class="display">{orbiterCount}</p>
    <span class="spinner">
        <button onclick={increment}>▲</button>
        <button onclick={decrement}>▼</button>
    </span>
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

    .pause {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        margin-left: 1rem;
    }

    .ticks {
        width: 4rem;
        height: 2rem;
        margin-left: 1rem;
        text-align: end;
    }

	.slider {
        cursor: pointer;
		width: 100%;
		margin: 1rem;
	}

    .spinner {
        display: flex;
        flex-direction: column;
        width: min-content;
    }

    .spinner button {
        font-size: 0.5rem;
        cursor: pointer;
        width: 2rem;
        height: 1rem;
        margin: 0 1rem;
    }
</style>
