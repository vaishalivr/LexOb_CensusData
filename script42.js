import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";

const data2 = {
  name: "lex_housing_units",
  children: [
    { name: "One unit detached", value: 9394 },
    { name: "One unit attached", value: 1138 },
    { name: "2 units", value: 267 },
    { name: "3 or 4 units", value: 320 },
    { name: "5 to 9 units", value: 250 },
    { name: "10 to 19 units", value: 488 },
    { name: "20+ units", value: 897 },
    { name: "Mobile home", value: 0 },
    { name: "RV etc.", value: 0 },
  ],
};

const width = 400;
const height = 400;
const strokeWidth = 3;
const borderGap = 6;
const circleInset = 10;

const svg2 = d3
  .select("#chart42")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", width)
  .attr("height", height);

const root2 = d3
  .hierarchy(data2)
  .sum((d) => d.value || 0)
  .sort((a, b) => b.value - a.value);

const clipPolygon = d3
  .range(0, Math.PI * 2, (Math.PI * 2) / 120)
  .map((angle) => [
    width / 2 +
      (Math.min(width, height) / 2 -
        strokeWidth / 2 -
        borderGap -
        circleInset) *
        Math.cos(angle),
    height / 2 +
      (Math.min(width, height) / 2 -
        strokeWidth / 2 -
        borderGap -
        circleInset) *
        Math.sin(angle),
  ]);

const rng = d3.randomLcg(0.5);
const layout2 = voronoiTreemap().clip(clipPolygon).prng(rng);
layout2(root2);

const leaves2 = root2.leaves();

const color = d3
  .scaleOrdinal()
  .domain(leaves2.map((d) => d.data.name))
  .range(d3.schemeTableau10);

const polygonPath = (poly) => `M${poly.join("L")}Z`;

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background", "white")
  .style("color", "#111")
  .style("padding", "6px 8px")
  .style("border-radius", "3px")
  .style("font-size", "12px")
  .style("opacity", 0);

svg2
  .selectAll("path")
  .data(leaves2)
  .join("path")
  .attr("d", (d) => polygonPath(d.polygon))
  .attr("fill", (d) => color(d.data.name))
  .attr("stroke", "#fff")
  .attr("stroke-width", 3)
  .on("mouseover", function (event, d) {
    tooltip.style("opacity", 1).text(`${d.data.name}: ${d.data.value} `);
  })
  .on("mousemove", function (event) {
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0);
  });

svg2
  .selectAll("text")
  .data(leaves2)
  .join("text")
  .attr("x", (d) => d3.polygonCentroid(d.polygon)[0])
  .attr("y", (d) => d3.polygonCentroid(d.polygon)[1])
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "#fff")
  .attr("font-size", 12)
  .style("pointer-events", "none")
  .each(function (d) {
    const text = d3.select(this);
    const name = d.data.name;
    const hasUnits = /\bunits\b/i.test(name);
    const firstLine = hasUnits ? name.replace(/\bunits\b/i, "").trim() : name;

    text
      .append("tspan")
      .attr("x", text.attr("x"))
      .attr("dy", hasUnits ? "-0.4em" : "0em")
      .text(firstLine);

    if (hasUnits) {
      text
        .append("tspan")
        .attr("x", text.attr("x"))
        .attr("dy", "1.1em")
        .text("units");
    }

    const bbox = this.getBBox();
    const corners = [
      [bbox.x, bbox.y],
      [bbox.x + bbox.width, bbox.y],
      [bbox.x, bbox.y + bbox.height],
      [bbox.x + bbox.width, bbox.y + bbox.height],
    ];
    const fits = corners.every((pt) => d3.polygonContains(d.polygon, pt));
    if (!fits) text.remove();
  });

// Circular border around the treemap (inset to avoid clipping)
svg2
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr(
    "r",
    Math.min(width, height) / 2 - strokeWidth / 2 + borderGap - circleInset,
  )
  .attr("fill", "none")
  .attr("stroke", "#333")
  .attr("stroke-width", strokeWidth);
