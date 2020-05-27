import styles from "./styles/slider.css";

import { createAnimation } from "../utils";

export class Slider {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.$container = config.$container;
    this.dragWidth = config.dragWidth;
    this.maxGap = (config.maxGap + this.dragWidth * 2) / this.width;
    this.state = {
      left: 0.5 * (1 - 2 * this.maxGap),
      right: 0.5 * (1 + 2 * this.maxGap)
    }
    this.subscribers = [];
    this.mouseDown = false;

    this.$sliderWrapper = document.createElement("div");
    this.$sliderWrapper.classList.add(styles.sliderWrapper);

    const $slider = document.createElement("div");
    $slider.classList.add(styles.slider);

    this.$sliderWrapper.appendChild($slider);

    this.$sliderWrapper.style.setProperty("--width", this.width);
    this.$sliderWrapper.style.setProperty("--height", this.height);
    this.$sliderWrapper.style.setProperty("--drag-width", this.dragWidth);

    const $sliderWindow = document.createElement("div");
    $sliderWindow.classList.add(styles.sliderWindow);

    $slider.appendChild($sliderWindow);

    const $blurLeft = document.createElement("div");
    const $blurRight = document.createElement("div");
    $blurLeft.classList.add(styles.blurLeft);
    $blurRight.classList.add(styles.blurRight);

    $sliderWindow.appendChild($blurLeft);
    $sliderWindow.appendChild($blurRight);

    this.$slider = $slider;
    this.$sliderWindow = $sliderWindow;

    this.updateSlider = this.updateSlider.bind(this);
  }

  set onChange(func) {
    this.subscribers.push(func);
  }

  dragHandler(event) {
    const { state } = this;
    const x =
      (event.clientX - this.$slider.getBoundingClientRect().left) / this.width;
    if (!(this.draggingLeft || this.draggingRight || this.draggingAll)) {
      if (x < state.left + this.dragWidth / this.width) {
        this.draggingLeft = true;
      } else if (x > state.right - this.dragWidth / this.width) {
        this.draggingRight = true;
      } else {
        this.draggingAll = true;
      }
      this.startDrag = [x, state.left, state.right];
    }

    const change = x - this.startDrag[0];

    let { left, right } = this.state;
    
    !this.draggingRight &&
      (left = Math.max(
        0,
        Math.min(state.right - this.maxGap, this.startDrag[1] + change)
      ));
    !this.draggingLeft &&
      (right = Math.min(
        1,
        Math.max(state.left + this.maxGap, this.startDrag[2] + change)
      ));
    this.publish(left, right);
    this.state = { left, right };
    window.requestAnimationFrame(this.updateSlider);
  }

  publish(left, right) {
    this.subscribers.forEach(s => s(left, right));
  }

  setListeners() {
    this.$sliderWindow.addEventListener("mousedown", () => {
      this.mouseDown = true;
    });
    document.addEventListener("mouseup", () => {
      this.mouseDown = false;
      this.draggingLeft = false;
      this.draggingRight = false;
      this.draggingAll = false;
      this.startDrag = null;
    });
    document.addEventListener("mousemove", e => {
      if (this.mouseDown) {
        this.dragHandler(e);
      }
    });
  }
  updateSlider() {
    const { state } = this;
    
    this.$slider.style.setProperty("--left", state.left * this.width);
    this.$slider.style.setProperty("--right", (1 - state.right) * this.width);
  }
  render() {
    const { state } = this
    this.$container.appendChild(this.$sliderWrapper);

    this.updateSlider();
    this.setListeners();
    this.publish(state.left, state.right);
  }
}
