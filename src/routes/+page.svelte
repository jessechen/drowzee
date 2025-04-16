<script lang="ts">
    import { onMount } from 'svelte';
    import Orbiter from './Orbiter.svelte';

    const TICKS_PER_MILLI: number = 10;
    const TICKS_PER_CYCLE: number = 10_000;

    let time: number = 0;
    let playing: boolean = true;
    let buttonText: string = '⏸';

    onMount(async () => update());

    function handleClick() {
		playing = !playing;
		buttonText = playing ? '⏸' : '▸';
		update();
	}

    function update() {
        if (playing) {
            requestAnimationFrame(step);
        }
    }

    function step(currentMillis: number, previousMillis?: number) {
        if (previousMillis !== undefined) {
            time += (currentMillis - previousMillis) / TICKS_PER_MILLI;
            if (time > TICKS_PER_CYCLE) {
                time = time % TICKS_PER_CYCLE;
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
        <Orbiter color="red" orbits={3} distance={100} {time} />
        <Orbiter color="orange" orbits={2} distance={200} {time} />
        <Orbiter color="yellow" orbits={1} distance={300} {time} />
    </svg>
</main>
<footer>
	<button class="control" onclick={handleClick}>{buttonText}</button>
    <input class="slider" type="range" id="time" min="0" max="10000" bind:value={time} />
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
		height: 5rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    button, input {
        cursor: pointer;
    }

	.slider {
		width: 100%;
		margin: 1rem;
	}
</style>
