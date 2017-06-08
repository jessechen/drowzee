$(function() {
    const TAU = 2 * Math.PI;
    const framesPerSecond = 6;
    const maxRadius = 386;

    const circleCount = 12;

    const calculateRadius = (index) => {
        return index / circleCount * maxRadius;
    };

    const getX = (index, distance) => {
        return index * distance;
    };

    const getY = (index, distance) => {
        return index * distance;
    };

    const draw = (distance) => {
        foreground
            .attr("cx", (o) => { return getX(o, distance) })
            .attr("cy", (o) => { return getY(o, distance) })
    };

    const canvas = d3.select("svg");

    const background = canvas
        .selectAll(".background")
        .data(_.range(1, circleCount + 1))
        .enter().append("circle")
            .classed("background", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", calculateRadius)
            .attr("stroke", "blue")
            .attr("fill-opacity", 0);

    const foreground = canvas
        .selectAll(".foreground")
        .data(_.range(1, circleCount + 1))
        .enter().append("circle")
            .classed("foreground", true)
            .attr("cx", getX)
            .attr("cy", getY)
            .attr("r", 8)
            .attr("stroke", "black")
            .attr("fill", "purple");

    d3.timer((time) => {
        const distance = time/1000 * framesPerSecond;
        draw(distance);
    });
});