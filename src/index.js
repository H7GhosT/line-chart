import "./styles.css"
import fs from "fs";
import path from "path";
import { ChartManager } from "./chart-manager/components/chart-manager";

const $root = document.querySelector(".root");

for(const chart of getCharts()) {
  const chartManager = new ChartManager({
    width: 600,
    height: 310,
    overviewHeight: 72,
    chart: parseChart(chart),
    animationSpeed: 170,
    $container: $root
  });
  
  chartManager.render();
}


function getOneChart() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "one_chart.json")));
}

function getCharts() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "chart_data.json")));
}



function parseChart(chart) {
  const parsed = {
    columns: {}
  };

  for (const column of chart.columns) {
    const label = column[0];
    if (chart.types[label] === "x") {
      parsed.xAxis = column.slice(1);
    } else {
      const c = (parsed.columns[label] = {});
      c.values = column.slice(1);
      c.color = chart.colors[label];
      c.name = chart.names[label];
      c.type = chart.types[label];
    }
  }
  return parsed;
}
