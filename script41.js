import * as d3 from "d3";

const data4 = [
  { name: "One unit detached", value: 9394 },
  { name: "One unit attached", value: 1138 },
  { name: "Two units", value: 267 },
  { name: "Three or four units", value: 320 },
  { name: "Five to nine units", value: 250 },
  { name: "Ten to nineteen units", value: 488 },
  { name: "Twenty or more units", value: 897 },
  { name: "Mobile home", value: 0 },
  { name: "Boat, RV, van, etc.", value: 0 },
];

const width = 400;
const height = 400;
const strokeWidth = 2;
const gap = 3;

const svg4 = d3
  .select("#chart4")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", width)
  .attr("height", height);

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

const maxValue = d3.max(data4, (d) => d.value) || 1;
const radiusScale = d3.scaleSqrt().domain([0, maxValue]).range([6, 100]);

const nodes = data4.map((d) => ({
  ...d,
  r: radiusScale(d.value),
}));

const color = d3.scaleOrdinal(d3.schemeTableau10);

const nodeGroups = svg4
  .selectAll("g.node")
  .data(nodes)
  .join("g")
  .attr("class", "node")
  .on("mouseover", function (event, d) {
    tooltip.style("opacity", 1).text(`${d.name}: ${d.value}`);
  })
  .on("mousemove", function (event) {
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0);
  });

nodeGroups
  .append("circle")
  .attr("class", "stroke")
  .attr("r", (d) => Math.max(0, d.r - strokeWidth / 2))
  .attr("fill", "none")
  .attr("stroke", "#808080")
  .attr("stroke-width", strokeWidth);

nodeGroups
  .append("circle")
  .attr("class", "fill")
  .attr("r", (d) => Math.max(0, d.r - strokeWidth / 2 - gap))
  .attr("fill", (d, i) => color(i));

const simulation = d3
  .forceSimulation(nodes)
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("x", d3.forceX(width / 2).strength(0.08))
  .force("y", d3.forceY(height / 2).strength(0.08))
  .force(
    "collide",
    d3.forceCollide((d) => d.r + 1),
  )
  .on("tick", () => {
    nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });
