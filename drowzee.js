const TAU = 2 * Math.PI;
// This many arbitrary units of time is one perfect loop.
const AUTS_PER_LOOP = 10000;
const AUTS_PER_SECOND = 500;
const LARGEST_ORBIT_RADIUS = 386;

// The divisor starts at this number and increases by 1 for each orbit closer to the center.
const OUTERMOST_DIVISOR = 2;
// Don't draw any orbits smaller than this one.
const INNERMOST_ORBIT_INDEX = 3;

const orbitCount = 12;

const getX = function(index, auts) {
    return polarToCartesian(index, auts, Math.sin);
};

const getY = function(index, auts) {
    return polarToCartesian(index, auts, Math.cos);
};

const polarToCartesian = function(index, auts, fn) {
    const radius = orbitRadius(index);
    const revolutions = auts / AUTS_PER_LOOP * (orbitCount + INNERMOST_ORBIT_INDEX + OUTERMOST_DIVISOR - index);
    return radius * fn(revolutions * TAU);
};

const orbitRadius = function(index) {
    return index / (orbitCount + INNERMOST_ORBIT_INDEX) * LARGEST_ORBIT_RADIUS;
};

const draw = function(auts) {
    planets
        .attr("cx", o => { return getX(o, auts) })
        .attr("cy", o => { return getY(o, auts) })
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
        .attr("stroke", "blue")
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

d3.timer(time => {
    const auts = time/1000 * AUTS_PER_SECOND;
    draw(auts);
});