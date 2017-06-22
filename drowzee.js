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
const MIN_ORBITS = 2;
const INITIAL_ORBITS = 12;
const MAX_ORBITS = 20;

let planetIndices = Array.from(Array(INITIAL_ORBITS).keys());
let initialAuts = 0;
let auts = 0;
let playing = false;

const getX = function(index) {
    const [r, theta] = getPolarCoordinates(index);
    return r * Math.sin(theta);
};

const getY = function(index) {
    const [r, theta] = getPolarCoordinates(index);
    return r * Math.cos(theta);
};

const getPolarCoordinates = function(index) {
    const radius = orbitRadius(index);
    const speed = planetIndices.length + OUTERMOST_REVOLUTIONS_PER_LOOP - index;
    const revolutions = auts / AUTS_PER_LOOP * speed;
    return [radius, revolutions * TAU];
};

const getColor = function(index) {
    return d3.hcl(index / planetIndices.length * 360, 50, 50);
};

const orbitRadius = function(index) {
    return (index + INNERMOST_ORBIT_INDEX) / (planetIndices.length + INNERMOST_ORBIT_INDEX) * LARGEST_ORBIT_RADIUS;
};

const togglePlay = function(value) {
    if (value === undefined) {
        value = !playing;
    }
    if (value) {
        playing = true;
        d3.timer(tick);
    } else {
        initialAuts = auts;
        playing = false;
    }
    playButton.text(playing ? "❚❚ Pause" : "▶ Play");
};

const seek = function() {
    togglePlay(false);
    let inputValue = parseInt(timeSlider.property("value"), 10);
    if (initialAuts != inputValue) {
        initialAuts = inputValue;
        auts = inputValue;
        draw(initialAuts);
    }
};

const parse = function() {
    togglePlay(false);
    let inputValue = parseInt(timeInput.property("value"), 10);
    if (isNaN(inputValue) || inputValue < 0) {
        inputValue = 0;
    } else if (inputValue > AUTS_PER_LOOP) {
        inputValue = AUTS_PER_LOOP - 1;
    }
    timeInput.property("value", inputValue);
    if (initialAuts != inputValue) {
        initialAuts = inputValue;
        auts = inputValue;
        draw(initialAuts);
    }
};

const add = function() {
    if (planetIndices.length < MAX_ORBITS) {
        planetIndices.push(planetIndices.length);
        draw();
    }
};

const remove = function() {
    if (planetIndices.length > MIN_ORBITS) {
        planetIndices.pop();
        draw();
    }
};

const draw = function() {
    update(planetIndices);
    timeSlider.property("value", Math.floor(auts));
    timeInput.property("value", Math.floor(auts));
};

const tick = function(time) {
    if (playing) {
        auts = (initialAuts + (time / 1000) * (AUTS_PER_LOOP / SECONDS_PER_LOOP)) % AUTS_PER_LOOP;
        draw();
    }
    return !playing;
};

const surface = d3.select("svg");

const update = function(planetIndices) {
    var orbits = surface
        .selectAll(".orbit")
        .data(planetIndices);

    orbits.enter().append("circle")
            .classed("orbit", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("fill-opacity", 0)
        .merge(orbits)
            .attr("r", orbitRadius)
            .attr("stroke", getColor);
    orbits.exit().remove();

    var planets = surface
        .selectAll(".planet")
        .data(planetIndices);

    planets.enter().append("circle")
            .classed("planet", true)
            .attr("r", 8)
            .attr("stroke", "black")
            .attr("fill", "#22c")
        .merge(planets)
            .attr("cx", getX)
            .attr("cy", getY);

    planets.exit().remove();
};

const playButton = d3.select(".play-button")
    .on("click", togglePlay);

const addButton = d3.select(".add-button")
    .text("+")
    .on("click", add);

const removeButton = d3.select(".remove-button")
    .text("-")
    .on("click", remove);

const timeSlider = d3.select(".time-slider")
    .attr("min", 0)
    .attr("max", AUTS_PER_LOOP - 1)
    .on("input", seek);

const timeInput = d3.select(".time-input")
    .on("input", parse);

draw(0);
togglePlay(false);
