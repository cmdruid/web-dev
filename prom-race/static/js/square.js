export default function Square(id) {

    this.id       = id;
    this.elem     = document.createElement('div');
    this.label    = document.createElement('span');
    this.tooltip  = document.createElement('span');

    this.elem.setAttribute('class', 'square tooltip');
    this.elem.setAttribute('id', `${this.id}`);

    this.label.setAttribute('class', 'square-label');
    this.elem.appendChild(this.label);

    this.tooltip.setAttribute('class', 'tooltiptext');
    this.elem.appendChild(this.tooltip);

    this.setLabel(`${this.id}`);
    this.setTooltip(`This is a test for: ${this.id}`);
}

Square.prototype.applyColor = function applyColor(string) {

    this.elem.style.backgroundColor = string;
}

Square.prototype.setLabel = function setLabel(content) {
    this.label.textContent = content || '';
}


Square.prototype.setTooltip = function setTooltip(content) {
    this.tooltip.textContent = content || '';
}