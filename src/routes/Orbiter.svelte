<script lang="ts">
    let {index, count, time} = $props();

    const TAU: number = 2 * Math.PI;
    const CENTER: number = 500;
    const MAX_DISTANCE: number = 480;

    let speed: number = $derived(count - index + 1);
    let distance: number = $derived(MAX_DISTANCE * ((index + 1) / count));
    let hue: number = $derived(360 * ((index + 1) / count));
    let cx: number = $derived(Math.cos(time * TAU * speed) * distance + CENTER);
    let cy: number = $derived(Math.sin(time * TAU * speed) * distance + CENTER);
</script>

<circle cx={CENTER} cy={CENTER} r={distance} stroke="oklch(0.5 50% {hue})" stroke-width="2" fill="none" />
<circle {cx} {cy} r=16 fill="oklch(0.2 50% 240)" />
