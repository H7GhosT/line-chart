import { createAnimation, hexOpacity } from "../../utils";

export class LineChart {
  constructor(config) {
    this.config = config;

    this.canvas = document.createElement("canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    this.ctx = this.canvas.getContext("2d");

    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = config.lineWidth || 1;

    this.state = {
      minX: config.xAxis[0],
      maxX: config.xAxis.last(),
      minY: 0,
      maxY: 1
    };

    for (const l in config.columns) {
      this.state["opacity_" + l] = 1;
    }
    this.animate = createAnimation(
      this.state,
      () => {
        this.clear();
        this.draw();
      },
      config.animationSpeed
    );
  }

  draw() {
    this.drawLines();
  }

  drawLines() {
    const { config, ctx, state } = this;
    const { xAxis, columns, lineWidth } = config;
    ctx.lineWidth = lineWidth;
    for (const l in columns) {
      ctx.beginPath();
      ctx.strokeStyle = hexOpacity(columns[l].color, state["opacity_" + l]);

      const yAxis = columns[l].values;

      for (let i = 0; i < yAxis.length; i++) {
        const x = this.x(this.scaleX(xAxis[i]));
        if(x < 0 || i === 0) {
          ctx.moveTo(this.x(this.scaleX(xAxis[i])), this.y(this.scaleY(yAxis[i])));
        }
        ctx.lineTo(
          x,
          this.y(this.scaleY(yAxis[i]))
          );
        if(x > this.config.width) break;
      }

      ctx.stroke();
      ctx.closePath();
    }
  }

  x(x) {
    return x;
  }

  y(y) {
    return this.config.height - y;
  }

  scaleX(x) {
    const { config, state } = this;
    const { width } = config;
    const { minX, maxX } = state;

    const diffX = maxX - minX;

    const kx = width / diffX;

    return (x - minX) * kx;
  }

  scaleY(y) {
    const { config, state } = this;
    const { height } = config;
    const { minY, maxY } = state;

    const diffY = maxY - minY;

    const ky = height / diffY;

    return (y - minY) * ky;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height);
  }

  render() {
    this.config.$container.appendChild(this.canvas);
    this.draw();
  }
}
