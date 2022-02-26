export default class Toast {
  constructor() {
    this.init();
  }

  init() {
    this.hideTimeout = null;
    this.element = document.createElement("div");
    this.element.style.display = "none";
    this.element.className = "toast";
    document.body.appendChild(this.element);
  }

  show(message, timeout = 2000) {
    clearTimeout(this.hideTimeout);
    this.element.textContent = message;
    this.element.className = "toast toast-visible";
    this.hideTimeout = setTimeout(() => {
      this.element.classList.remove("toast-visible");
    }, timeout);
  }
}
