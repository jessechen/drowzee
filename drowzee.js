const TAU = 2 * Math.PI;
// This many arbitrary units of time is one perfect loop.
const AUTS_PER_LOOP = 10000;
const AUTS_PER_SECOND = 500;
const LARGEST_ORBIT_RADIUS = 386;

// The number of revolutions a planet makes per perfect loop starts at this number
// and increases by 1 for each orbit closer to the center.
const OUTERMOST_REVOLUTIONS_PER_LOOP = 2;
// Don't draw any orbits smaller than this one.
const INNERMOST_ORBIT_INDEX = 3;

const orbitCount = 12;
let startAuts = 0;
let paused = false;

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
    const speed = orbitCount + INNERMOST_ORBIT_INDEX + OUTERMOST_REVOLUTIONS_PER_LOOP - index;
    const revolutions = auts / AUTS_PER_LOOP * speed;
    return [radius, revolutions * TAU];
};

const orbitRadius = function(index) {
    return index / (orbitCount + INNERMOST_ORBIT_INDEX) * LARGEST_ORBIT_RADIUS;
};

const seek = function(evt, auts) {
    startAuts = auts;
    paused = true;
    draw(startAuts);
};

const draw = function(auts) {
    planets
        .attr("cx", o => { return getX(o, auts) })
        .attr("cy", o => { return getY(o, auts) });
    slider.value(auts);
    autText.text(Math.floor(auts));
};

const surface = d3.select("svg");

const orbits = surface
    .selectAll(".orbit")
    .data(_.range(INNERMOST_ORBIT_INDEX, orbitCount + INNERMOST_ORBIT_INDEX))
    .enter().append("circle")
        .classed("orbit", true)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", orbitRadius)
        .attr("stroke", "#88f")
        .attr("fill-opacity", 0);

const planets = surface
    .selectAll(".planet")
    .data(_.range(INNERMOST_ORBIT_INDEX, orbitCount + INNERMOST_ORBIT_INDEX))
    .enter().append("circle")
        .classed("planet", true)
        .attr("cx", getX)
        .attr("cy", getY)
        .attr("r", 8)
        .attr("stroke", "black")
        .attr("fill", "purple");

const axis = d3.svg.axis();
const slider = d3.slider()
    .axis(axis).min(0).max(AUTS_PER_LOOP - 1)
    .on("slide", seek);

const autDisplay = d3.select("body").append("div")
    .style("width", "100vmin")
    .attr("id", "slider")
    .call(slider);

const autText = d3.select("body").append("span")
    .attr("id", "aut-text")
    .text("0");

draw(0);

d3.timer(time => {
    auts = (startAuts + time/1000 * AUTS_PER_SECOND) % AUTS_PER_LOOP;
    draw(auts);
    return paused;
});
