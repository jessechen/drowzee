<script lang="ts">
    let {color, orbits, distance, time} = $props();

    const TAU: number = 2 * Math.PI;

    let cx = $derived(Math.cos(time * TAU * orbits) * distance + 500);
    let cy = $derived(Math.sin(time * TAU * orbits) * distance + 500);
</script>

<circle cx="500" cy="500" r={distance} stroke={color} stroke-width="2" fill="none" />
<circle {cx} {cy} r=16 fill="navy" />
