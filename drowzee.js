const TAU = 2 * Math.PI;
// 10000 arbitrary units of time is one perfect loop.
const AUTS_PER_LOOP = 10000;
const AUTS_PER_SECOND = 500;
const LARGEST_ORBIT_RADIUS = 386;

const orbitCount = 12;

const orbitRadius = function(index) {
    return index / (orbitCount + 3) * LARGEST_ORBIT_RADIUS;
};

const getX = function(index, auts) {
    const radius = orbitRadius(index);
    const actualRevolutions = auts / AUTS_PER_LOOP * (orbitCount + 5 - index);
    return radius * Math.sin(actualRevolutions * TAU);
};

const getY = function(index, auts) {
    const radius = orbitRadius(index);
    const actualRevolutions = auts / AUTS_PER_LOOP * (orbitCount + 5 - index);
    return radius * Math.cos(actualRevolutions * TAU);
};

const draw = function(auts) {
    planets
        .attr("cx", o => { return getX(o, auts) })
        .attr("cy", o => { return getY(o, auts) })
};

const surface = d3.select("svg");

const orbits = surface
    .selectAll(".orbit")
    .data(_.range(3, orbitCount + 3))
    .enter().append("circle")
        .classed("orbit", true)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", orbitRadius)
        .attr("stroke", "blue")
        .attr("fill-opacity", 0);

const planets = surface
    .selectAll(".planet")
    .data(_.range(3, orbitCount + 3))
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