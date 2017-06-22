const TAU = 2 * Math.PI;
// This many arbitrary units of time is one perfect loop.
const AUTS_PER_LOOP = 10000;
const SECONDS_PER_LOOP = 16;
const LARGEST_ORBIT_RADIUS = 386;

// The number of revolutions a planet makes per perfect loop starts at this number
// and increases by 1 for each orbit closer to the center.
const OUTERMOST_REVOLUTIONS_PER_LOOP = 2;
// Don't draw any orbits smaller than this one.
const INNERMOST_ORBIT_INDEX = 3;

const orbitCount = 12;
let startAuts = 0;
let playing = false;

const getX = function(index, auts) {
    const [r, theta] = getPolarCoordinates(index, auts);
    return r * Math.sin(theta);
};

const getY = function(index, auts) {
    const [r, theta] = getPolarCoordinates(index, auts);
    return r * Math.cos(theta);
};

const getPolarCoordinates = function(index, auts) {
    const radius = orbitRadius(index);
    const speed = orbitCount + OUTERMOST_REVOLUTIONS_PER_LOOP - index;
    const revolutions = auts / AUTS_PER_LOOP * speed;
    return [radius, revolutions * TAU];
};

const getColor = function(index) {
    return d3.hcl(index / orbitCount * 360, 50, 50);
};

const orbitRadius = function(index) {
    return (index + INNERMOST_ORBIT_INDEX) / (orbitCount + INNERMOST_ORBIT_INDEX) * LARGEST_ORBIT_RADIUS;
};

const togglePlay = function(value) {
    if (value === undefined) {
        value = !playing;
    }
    if (value) {
        playing = true;
        d3.timer(tick);
    } else {
        startAuts = parseInt(timeSlider.property("value"), 10);
        playing = false;
    }
    playButton.text(playing ? "❚❚ Pause" : "▶ Play");
};

const seek = function() {
    togglePlay(false);
    draw(startAuts);
};

const parse = function() {
    let inputValue = parseInt(timeInput.property("value"), 10);
    if (isNaN(inputValue) || inputValue < 0) {
        inputValue = 0;
    } else if (inputValue > AUTS_PER_LOOP) {
        inputValue = AUTS_PER_LOOP - 1;
    }
    timeInput.property("value", inputValue);
    if (parseInt(timeSlider.property("value"), 10) != inputValue) {
        timeSlider.property("value", inputValue);
        seek();
    }
};

const draw = function(auts) {
    planets
        .attr("cx", o => { return getX(o, auts) })
        .attr("cy", o => { return getY(o, auts) });
    timeSlider.property("value", Math.floor(auts));
    timeInput.property("value", Math.floor(auts));
};

const tick = function(time) {
    if (playing) {
        auts = (startAuts + (time / 1000) * (AUTS_PER_LOOP / SECONDS_PER_LOOP)) % AUTS_PER_LOOP;
        draw(auts);
    }
    return !playing;
};

const surface = d3.select("svg");

const orbits = surface
    .selectAll(".orbit")
    .data(Array.from(Array(orbitCount).keys()))
    .enter().append("circle")
        .classed("orbit", true)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", orbitRadius)
        .attr("stroke", getColor)
        .attr("fill-opacity", 0);

const planets = surface
    .selectAll(".planet")
    .data(Array.from(Array(orbitCount).keys()))
    .enter().append("circle")
        .classed("planet", true)
        .attr("cx", getX)
        .attr("cy", getY)
        .attr("r", 8)
        .attr("stroke", "black")
        .attr("fill", "#22c");

const playButton = d3.select(".play-button")
    .on("click", togglePlay);

const timeSlider = d3.select(".time-slider")
    .attr("min", 0)
    .attr("max", AUTS_PER_LOOP - 1)
    .on("input", seek);

const timeInput = d3.select(".time-input")
    .on("input", parse);

draw(0);
togglePlay(false);
