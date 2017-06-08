$(function() {
    const TAU = 2 * Math.PI;
    const revolutionsPerSecond = 0.05;
    const maxRadius = 386;

    const circleCount = 12;

    const calculateRadius = (index) => {
        return index / (circleCount + 3) * maxRadius;
    };

    const getX = (index, revolutions) => {
        const radius = calculateRadius(index);
        const actualRevolutions = revolutions * (circleCount + 5 - index);
        return radius * Math.sin(actualRevolutions * TAU);
    };

    const getY = (index, revolutions) => {
        const radius = calculateRadius(index);
        const actualRevolutions = revolutions * (circleCount + 5 - index);
        return radius * Math.cos(actualRevolutions * TAU);
    };

    const draw = (distance) => {
        foreground
            .attr("cx", (o) => { return getX(o, distance) })
            .attr("cy", (o) => { return getY(o, distance) })
    };

    const canvas = d3.select("svg");

    const background = canvas
        .selectAll(".background")
        .data(_.range(3, circleCount + 3))
        .enter().append("circle")
            .classed("background", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", calculateRadius)
            .attr("stroke", "blue")
            .attr("fill-opacity", 0);

    const foreground = canvas
        .selectAll(".foreground")
        .data(_.range(3, circleCount + 3))
        .enter().append("circle")
            .classed("foreground", true)
            .attr("cx", getX)
            .attr("cy", getY)
            .attr("r", 8)
            .attr("stroke", "black")
            .attr("fill", "purple");

    d3.timer((time) => {
        const revolutions = time/1000 * revolutionsPerSecond;
        draw(revolutions);
    });
});