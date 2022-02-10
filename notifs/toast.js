const Toast = {
  init() {
    this.hideTimeout = null;

    this.element = document.createElement("div");
    this.element.className = "toast";
    document.body.appendChild(this.element);
  },
  show(message, timeout = 2000) {
    clearTimeout(this.hideTimeout);

    this.element.textContent = message;
    this.element.className = "toast toast-visible";

    this.hideTimeout = setTimeout(() => {
      this.element.classList.remove("toast-visible");
    }, timeout);
  },
};

Toast.init();
