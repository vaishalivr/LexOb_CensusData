import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";

const data2 = {
  name: "lex_population_by_age",
  children: [
    { name: "under 5 ", value: 1286 },
    { name: "5 to 9 ", value: 2296 },
    { name: "10 to 14 ", value: 3151 },
    { name: "15 to 19 ", value: 2534 },
    { name: "20 to 24 ", value: 1026 },
    { name: "25 to 34 ", value: 1450 },
    { name: "35 to 44 ", value: 3865 },
    { name: "45 to 54 ", value: 6760 },
    { name: "55 to 59 ", value: 2434 },
    { name: "60 to 64 ", value: 2063 },
    { name: "65 to 74 ", value: 4231 },
    { name: "75 to 84 ", value: 2131 },
    { name: "85+", value: 1068 },
  ],
};

const width = 400;
const height = 400;
const strokeWidth = 3;
const borderGap = 6;
const circleInset = 10;

const svg2 = d3
  .select("#chart2")
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

const total = data2.children.reduce((sum, item) => sum + item.value, 0);

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background", "white")
  .style("color", "#111")
  .style("border", "2px solid #111")
  .style("padding", "6px 8px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("opacity", 0);

if (!document.getElementById("tooltip-highlight-style")) {
  const styleEl = document.createElement("style");
  styleEl.id = "tooltip-highlight-style";
  styleEl.textContent = `
    @keyframes tooltipHighlightSweep {
      from { background-size: 0% 100%; }
      to { background-size: 100% 100%; }
    }
  `;
  document.head.appendChild(styleEl);
}

svg2
  .selectAll("path")
  .data(leaves2)
  .join("path")
  .attr("d", (d) => polygonPath(d.polygon))
  .attr("fill", (d) => color(d.data.name))
  .attr("stroke", "#fff")
  .attr("stroke-width", 3)
  .on("mouseover", function (event, d) {
    const rows = data2.children
      .map((item, idx, arr) => {
        const isHovered = item.name === d.data.name;
        const c = d3.color(color(item.name));
        const highlight = isHovered
          ? `background-image: linear-gradient(90deg, rgba(${c.r}, ${c.g}, ${c.b}, 0.5) 0%, rgba(${c.r}, ${c.g}, ${c.b}, 0.5) 100%); background-repeat: no-repeat; background-size: 0% 100%; animation: tooltipHighlightSweep 450ms ease-out forwards; color: #fff;`
          : "";
        const percent = total ? ((item.value / total) * 100).toFixed(1) : "0.0";
        const isLast = idx === arr.length - 1;
        const bottom = isLast ? "" : "border-bottom: 1px dotted #999;";
        const cellRight = `padding: 3px 9px; border-right: 1px dotted #999; ${bottom} ${highlight}`;
        const cell = `padding: 3px 9px; ${bottom} ${highlight}`;
        return `
          <tr>
            <td style="${cellRight}">${item.name}</td>
            <td style="${cellRight}">${item.value}</td>
            <td style="${cell}">${percent}%</td>
          </tr>
        `;
      })
      .join("");

    const totalRow = `
      <tr>
        <td style="padding: 3px 9px; border-right: 1px dotted #999; border-top: 1px solid #999;">Total</td>
        <td style="padding: 3px 9px; border-right: 1px dotted #999; border-top: 1px solid #999;">${total}</td>
        <td style="padding: 3px 9px; border-top: 1px solid #999;"></td>
      </tr>
    `;

    tooltip.style("opacity", 1).html(`
      <table style="border-collapse: separate; border-spacing: 0;">
        ${rows}
        ${totalRow}
      </table>
    `);
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
    text
      .append("tspan")
      .attr("x", text.attr("x"))
      .attr("dy", "-0.3em")
      .text(d.data.name);
    text
      .append("tspan")
      .attr("x", text.attr("x"))
      .attr("dy", "1.1em")
      .text("years");
  });

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
