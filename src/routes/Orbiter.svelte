<script lang="ts">
    let {color, orbits, distance, time} = $props();

    const TAU: number = 2 * Math.PI;
    const TICKS_PER_CYCLE: number = 10_000;

    let cx = $derived(Math.cos((time * TAU * orbits) / TICKS_PER_CYCLE) * distance + 500);
    let cy = $derived(Math.sin((time * TAU * orbits) / TICKS_PER_CYCLE) * distance + 500);
</script>

<circle cx="500" cy="500" r={distance} stroke="#2d3359" fill="none" />
<circle {cx} {cy} r=20 fill={color} />
