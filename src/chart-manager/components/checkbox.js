import "./styles/checkbox.css";

export class Checkbox {
  constructor({ label, checked = false, $container, color }) {
    this.label = label;
    this.subscribers = [];
    this.$container = $container;

    this.checked = false;

    this.$checkboxWrapper = document.createElement("div");
    this.$checkboxWrapper.classList.add("checkboxWrapper");
    this.$checkboxWrapper.style.setProperty("--color", color);

    this.$checkbox = document.createElement("span");
    this.$checkbox.classList.add("checkbox");
    this.$label = document.createElement("span");
    this.$label.classList.add("label");
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

    this.$checkbox.classList.remove("boom");
    void this.$checkbox.offsetWidth
    this.$checkbox.classList.add("boom");

    this.checked ? this.$checkbox.classList.add("checked") : this.$checkbox.classList.remove("checked");

    this.subscribers.forEach(s => s(this.checked));
  }

  render() {
    this.$container.appendChild(this.$checkboxWrapper);
  }
}
