<script lang="ts">
    let {index, count, time} = $props();

    const TAU: number = 2 * Math.PI;
    const CENTER: number = 500;
    const MAX_DISTANCE: number = 480;

    let speed: number = $derived(count - index + 2);
    let distance: number = $derived(MAX_DISTANCE * (index / count));
    let cx: number = $derived(Math.cos(time * TAU * speed) * distance + CENTER);
    let cy: number = $derived(Math.sin(time * TAU * speed) * distance + CENTER);
</script>

<circle cx={CENTER} cy={CENTER} r={distance} stroke="green" stroke-width="2" fill="none" />
<circle {cx} {cy} r=16 fill="navy" />
