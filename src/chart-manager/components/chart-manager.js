import "../builtins-upgrade";

import styles from "./styles/chart-manager.css";
import { LineChart } from "./charts/line-chart";
import { LineChartWithMarks } from "./charts/line-chart-with-marks";
import { Slider } from "./slider";
import { Checkbox } from "./checkbox";

export class ChartManager {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.overviewHeight = config.overviewHeight;
    this.chart = config.chart;
    this.animationSpeed = config.animationSpeed;
    this.$container = config.$container;

    this.$chartManager = document.createElement("div");
    this.$chartManager.classList.add(styles.chartManager);
    this.$chartManager.style.setProperty("--width", this.width + "px");

    this.shownCharts = new Set(Object.keys(this.chart.columns));

    this.$mainChartContainer = document.createElement("div");

    this.$chartManager.appendChild(this.$mainChartContainer);

    const { minY: absMinY, maxY: absMaxY } = this.minMaxY(
      0,
      this.chart.xAxis.length - 1
    );

    this.mainLineChart = new LineChartWithMarks({
      width: this.width,
      height: this.height,
      lineWidth: 2,
      ...this.chart,
      $container: this.$mainChartContainer,
      animationSpeed: this.animationSpeed,
      fontSize: 14,
      absMinY,
      absMaxY
    });

    this.$sliderContainer = document.createElement("div");
    this.$chartManager.appendChild(this.$sliderContainer);

    this.slider = new Slider({
      $container: this.$sliderContainer,
      dragWidth: 10,
      height: this.overviewHeight,
      maxGap: 30,
      width: this.width
    });

    this.slider.onChange = (...r) => this.setRange(...r);

    this.overviewLineChart = new LineChart({
      width: this.width,
      height: this.overviewHeight,
      lineWidth: 1,
      ...this.chart,
      $container: this.slider.$slider,
      animationSpeed: this.animationSpeed
    });

    this.overviewLineChart.canvas.style.position = "absolute";

    this.$checkboxContainer = document.createElement("div");
    this.$checkboxContainer.classList.add(styles.checkboxContainer);

    this.$chartManager.appendChild(this.$checkboxContainer);

    this.checkboxes = [];

    Object.keys(this.chart.columns).forEach(l => {
      const checkbox = new Checkbox({
        $container: this.$checkboxContainer,
        label: this.chart.columns[l].name,
        color: this.chart.columns[l].color,
        checked: true
      });
      checkbox.onChange = checked => {
        this.handleCheckbox(l, checked);
      };
      this.checkboxes.push(checkbox);
    });
  }

  setRange(left, right) {
    this.range = [left, right];
    this.update();
  }

  update() {
    const [left, right] = this.range;
    const start = Math.floor((this.chart.xAxis.length - 1) * left),
      end = Math.floor((this.chart.xAxis.length - 1) * right);

    const spreadX = this.chart.xAxis.last() - this.chart.xAxis[0];
    const minX = this.chart.xAxis[0] + left * spreadX,
      maxX = this.chart.xAxis[0] + right * spreadX;

    const newMainState = {
      minX,
      maxX,
      ...this.minMaxY(start, end)
    };
    const newOverviewState = {
      ...this.minMaxY(0, this.chart.xAxis.length - 1)
    };

    Object.keys(this.chart.columns).forEach(l => {
      const o = this.shownCharts.has(l) ? 1 : 0;
      newMainState[`opacity_${l}`] = newOverviewState[`opacity_${l}`] = o;
    });

    this.mainLineChart.animate(newMainState);
    this.overviewLineChart.animate(newOverviewState);
  }

  minMaxY(start, end) {
    let minY, maxY;

    for (const label of this.shownCharts) {
      for (let i = start; i <= end; i++) {
        const val = this.chart.columns[label].values[i];

        if (!minY || minY > val) minY = val;
        if (!maxY || maxY < val) maxY = val;
      }
    }
    return { minY: minY || 0, maxY: maxY || 0 };
  }

  handleCheckbox(label, checked) {
    checked ? this.shownCharts.add(label) : this.shownCharts.delete(label);
    this.update();
  }

  render() {
    this.$container.appendChild(this.$chartManager);
    this.mainLineChart.render();
    this.slider.render();
    this.overviewLineChart.render();
    this.checkboxes.forEach(cb => cb.render());
    this.update();
  }
}
