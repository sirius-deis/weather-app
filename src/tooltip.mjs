function ToolTip(container) {
    this.toolTip = document.createElement("div");
    this.toolTip.classList.add("tooltip", "hidden");
    this.text = document.createElement("p");
    const button = document.createElement("button");
    button.className = "tooltip__close";
    button.innerHTML = "&times;";
    button.addEventListener("click", () => {
        this.hide();
    });
    this.toolTip.append(this.text, button);
    container.append(this.toolTip);
}

ToolTip.prototype.hide = function () {
    this.isShown = false;
    this.toolTip.classList.add("hidden");
};

ToolTip.prototype.show = function (element, text) {
    const rectEl = element.getBoundingClientRect();
    this.toolTip.classList.remove("hidden");
    const cs = getComputedStyle(this.toolTip);
    this.text.innerText = text;
    this.toolTip.style.top = `${element.offsetTop - parseInt(cs.height) - 20}px`;
    this.toolTip.style.left = `${element.offsetLeft - parseInt(cs.width) / 2 + rectEl.width / 2}px`;
    this.isShown = true;
};

export default ToolTip;
