import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";

const data1 = {
  name: "lex_population",
  children: [
    { name: "Males", value: 30 },
    { name: "Females", value: 15 },
  ],
};

// const data2 = {
//   name: "lex_population",
//   children: [
//     { name: "under 5 years", value: 10 },
//     { name: "5 to 9 years", value: 20 },
//     { name: "10 to 14 years", value: 15 },
//     { name: "15 to 19 years", value: 25 },
//     { name: "20 to 24 years", value: 30 },
//     { name: "25 to 34 years", value: 20 },
//     { name: "35 to 44 years", value: 5 },
//     { name: "45 to 54 years", value: 10 },
//     { name: "55 to 59 years", value: 10 },
//     { name: "60 to 64 years", value: 5 },
//     { name: "65 to 74 years", value: 15 },
//     { name: "75 to 84 years", value: 10 },
//     { name: "85 years and over", value: 5 },
//   ],
// };

const width = 150;
const height = 150;

const svg1 = d3.select("#chart1");

const root = d3
  .hierarchy(data1)
  .sum((d) => d.value || 0)
  .sort((a, b) => b.value - a.value);

const clipPolygon = d3
  .range(0, Math.PI * 2, (Math.PI * 2) / 80)
  .map((angle) => [
    width / 2 + (Math.min(width, height) / 2) * Math.cos(angle),
    height / 2 + (Math.min(width, height) / 2) * Math.sin(angle),
  ]);

const layout = voronoiTreemap().clip(clipPolygon);
layout(root);

const leaves = root.leaves();

const color = d3
  .scaleOrdinal()
  .domain(leaves.map((d) => d.data.name))
  .range(["#0f6b6f", "#f06b42"]);

const polygonPath = (poly) => `M${poly.join("L")}Z`;

svg1
  .selectAll("path")
  .data(leaves)
  .join("path")
  .attr("d", (d) => polygonPath(d.polygon))
  .attr("fill", (d) => color(d.data.name))
  .attr("stroke", "#fff")
  .attr("stroke-width", 3);

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
  .text((d) => d.data.name);

// const svg2 = d3.select("#chart2");

// const root2 = d3
//   .hierarchy(data2)
//   .sum((d) => d.value || 0)
//   .sort((a, b) => b.value - a.value);

// const layout2 = voronoiTreemap().clip(clipPolygon);
// layout(root2);

// const leaves2 = root2.leaves();

// svg2
//   .selectAll("path")
//   .data(leaves)
//   .join("path")
//   .attr("d", (d) => polygonPath(d.polygon))
//   .attr("fill", (d) => color(d.data.name))
//   .attr("stroke", "#fff")
//   .attr("stroke-width", 3);

// svg2
//   .selectAll("text")
//   .data(leaves)
//   .join("text")
//   .attr("x", (d) => d3.polygonCentroid(d.polygon)[0])
//   .attr("y", (d) => d3.polygonCentroid(d.polygon)[1])
//   .attr("text-anchor", "middle")
//   .attr("dominant-baseline", "middle")
//   .attr("fill", "#fff")
//   .attr("font-size", 14)
//   .text((d) => d.data.name);
