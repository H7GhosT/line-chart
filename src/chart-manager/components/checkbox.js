import styles from "./styles/checkbox.css";

export class Checkbox {
  constructor({ label, checked = false, $container, color }) {
    this.label = label;
    this.subscribers = [];
    this.$container = $container;

    this.checked = false;

    this.$checkboxWrapper = document.createElement("div");
    this.$checkboxWrapper.classList.add(styles.checkboxWrapper);
    this.$checkboxWrapper.style.setProperty("--color", color);

    this.$checkbox = document.createElement("span");
    this.$checkbox.classList.add(styles.checkbox);
    this.$label = document.createElement("span");
    this.$label.classList.add(styles.label);
    this.$label.textContent = label;

    this.$checkboxWrapper.appendChild(this.$checkbox);
    this.$checkboxWrapper.appendChild(this.$label);
    this.$checkboxWrapper.addEventListener("click", () =>
      this.toggleChecked()
    );
    checked && this.toggleChecked();
  }

  set onChange(func) {
    this.subscribers.push(func);
  }

  toggleChecked() {
    this.checked = !this.checked;
    
    this.$checkbox.classList.remove(styles.boom);
    void this.$checkbox.offsetWidth
    this.$checkbox.classList.add(styles.boom);
    
    this.checked ? this.$checkbox.classList.add(styles.checked) : this.$checkbox.classList.remove(styles.checked);

    this.subscribers.forEach(s => s(this.checked));
  }

  render() {
    this.$container.appendChild(this.$checkboxWrapper);
  }
}
