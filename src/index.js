import "./styles.css"
import chartData from "./chart_data";
import { ChartManager } from "./chart-manager/components/chart-manager";

const $root = document.querySelector(".root");

for (const chart of chartData) {
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
