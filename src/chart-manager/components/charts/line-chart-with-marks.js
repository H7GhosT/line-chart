import "../../builtins-upgrade";
import { formatUnix, hexOpacity } from "../../utils";
import { LineChart } from "./line-chart";

export class LineChartWithMarks extends LineChart {
  constructor(config) {
    super(config);
    this.ctx.font = `${this.config.fontSize}px sans-serif`;

    this.absMinX = config.xAxis[0];
    this.absMaxX = config.xAxis.last();
  }

  draw() {
    this.drawLines();
    this.drawMarksX();
    this.drawMarksY();
  }

  drawMarksX() {
    const { ctx, config } = this;
    const { fontSize } = config;

    const { absMinX, absMaxX } = this;

    const lmx = this.x(this.scaleX(absMinX));
    const rmx = this.x(this.scaleX(absMaxX));

    const k = (absMaxX - absMinX) / (rmx - lmx);

    const drawMark = (lx, rx) => {
      const mx = lx + (rx - lx) / 2;

      let opacity = 1;

      const d = absMinX + (mx - lmx) * k;

      const txt = formatUnix(d);
      const textMetrics = ctx.measureText(txt);
      const w = textMetrics.width;

      if (rx - lx <= 3.5 * w) {
        opacity = (rx - lx - w) / (3.5 * w);
      }

      if (mx > w / 3 && mx < config.width - w / 3) {
        ctx.fillStyle = hexOpacity("#606060", opacity);
        ctx.fillText(txt, mx - w / 2, this.y(-fontSize * 0.8));
      }

      if (rx - lx > 4 * w) {
        drawMark(lx, mx);
        drawMark(mx, rx);
      }
    };

    drawMark(lmx, rmx);
  }

  drawMarksY() {
    const { ctx, config, state } = this;
    const { absMinY, absMaxY, fontSize, width, height } = config;
    const { minY, maxY } = state;
    if (!(maxY - minY)) return;
    ctx.fillStyle = "#4a4a4a";
    ctx.strokeStyle =  "#000000a1";
    ctx.lineWidth = 1;

    const lmy = this.scaleY(absMinY);
    const umy = this.scaleY(absMaxY);

    const k = (absMaxY - absMinY) / (umy - lmy);

    const startY =
      ((this.scaleY(minY) - lmy + umy - this.scaleY(maxY)) % fontSize) * 3;

    ctx.beginPath();
    for (let y = -startY; y < height - fontSize; y += fontSize * 3.2) {
      if (y < 10) continue;
      ctx.moveTo(this.x(0), this.y(y));
      ctx.fillText(Math.floor(minY + y * k), 0, this.y(y) - 5);
      ctx.lineTo(this.x(width), this.y(y));
    }
    ctx.stroke();
    ctx.closePath();
  }

  y(y) {
    const { height, fontSize } = this.config;
    const h = height - fontSize;

    return ((height - y) * h) / height;
  }
}
