import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";

const data1 = {
  name: "lex_population",
  children: [
    { name: "Males", value: 16443 },
    { name: "Females", value: 17852 },
  ],
};

const width = 400;
const height = 400;
const strokeWidth = 3;
const borderGap = 6;
const circleInset = 10;

const svg1 = d3
  .select("#chart1")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", width)
  .attr("height", height);

const root = d3
  .hierarchy(data1)
  .sum((d) => d.value || 0)
  .sort((a, b) => b.value - a.value);

const clipPolygon = d3
  .range(0, Math.PI * 2, (Math.PI * 2) / 80)
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
const layout = voronoiTreemap().clip(clipPolygon).prng(rng);
layout(root);

const leaves = root.leaves();

const color = d3
  .scaleOrdinal()
  .domain(leaves.map((d) => d.data.name))
  .range(d3.schemeTableau10);

const polygonPath = (poly) => `M${poly.join("L")}Z`;

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background", "#fff")
  .style("color", "#111")
  .style("padding", "6px 8px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("opacity", 0);

svg1
  .selectAll("path")
  .data(leaves)
  .join("path")
  .attr("d", (d) => polygonPath(d.polygon))
  .attr("fill", (d) => color(d.data.name))
  .attr("stroke", "#fff")
  .attr("stroke-width", 3)
  .on("mouseover", function (event, d) {
    tooltip.style("opacity", 1).text(`${d.data.name}: ${d.data.value}`);
  })
  .on("mousemove", function (event) {
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0);
  });

// Circular border around the treemap (inset to avoid clipping)
svg1
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

svg1
  .selectAll("text")
  .data(leaves)
  .join("text")
  .attr("x", (d) => d3.polygonCentroid(d.polygon)[0])
  .attr("y", (d) => d3.polygonCentroid(d.polygon)[1])
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "#fff")
  .attr("font-size", 14)
  .style("pointer-events", "none")
  .text((d) => d.data.name);
