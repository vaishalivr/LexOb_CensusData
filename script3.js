import * as d3 from "d3";

const data3 = [
  { name: "- $10k", value: 405 },
  { name: "$10k to $15k", value: 220 },
  { name: "$15k to $25k", value: 312 },
  { name: "$25k to $35k", value: 327 },
  { name: "$35k to $50k", value: 354 },
  { name: "$50k to $75k", value: 461 },
  { name: "$75k to $100k", value: 557 },
  { name: "$100k to $150k", value: 1314 },
  { name: "$150k to $200k", value: 1497 },
  { name: "$200k or more", value: 7030 },
];

const width = 400;
const height = 600;
const strokeWidth = 3;
const borderGap = 6;
const inset = borderGap + strokeWidth / 2;

const container = d3.select(".charts");
const svg3 = container
  .select("#chart3")
  .attr("aria-label", "Treemap")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", width)
  .attr("height", height);

const root = d3
  .hierarchy({ name: "root", children: data3 })
  .sum((d) => d.value || 0)
  .sort((a, b) => b.value - a.value);

d3
  .treemap()
  .size([width - inset * 2, height - inset * 2])
  .padding(2)(root);

const nodes = root.leaves();

svg3
  .selectAll("rect")
  .data(nodes)
  .join("rect")
  .attr("x", (d) => d.x0 + inset)
  .attr("y", (d) => d.y0 + inset)
  .attr("width", (d) => d.x1 - d.x0)
  .attr("height", (d) => d.y1 - d.y0)
  .attr("fill", "#1f77b4");

svg3
  .selectAll("text")
  .data(nodes)
  .join("text")
  .attr("x", (d) => d.x0 + inset + 4)
  .attr("y", (d) => d.y0 + inset + 14)
  .attr("fill", "#ffffff")
  .attr("font-size", 10)
  .text((d) => d.data.name);

// Outer border with a 6px gap from treemap
svg3
  .append("rect")
  .attr("x", strokeWidth / 2)
  .attr("y", strokeWidth / 2)
  .attr("width", width - strokeWidth)
  .attr("height", height - strokeWidth)
  .attr("fill", "none")
  .attr("stroke", "#333")
  .attr("stroke-width", strokeWidth);
