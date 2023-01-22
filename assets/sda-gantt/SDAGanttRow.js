class SDAGanttRow extends HTMLTableRowElement {
    constructor(title) {
        super();
        this.setAttribute('is', 'sda-gantt-row');
        this.innerHTML = `<td class="gantt-head primary-light"></td>`
        this.title = title;
        this.ondragstart = this._ondragstart;
        this.ondragend = this._ondragend;
    }

    connectedCallback() {
        this.appendNewCells(this.numDays)
    }

    get startDay() {
        return this.parentNode.startDay;
    }

    get section() {
        return this.parentNode;
    }

    set title(title) {
        this.firstChild.textContent = title;
    }

    get title() {
        return this.firstChild.textContent;
    }

    get cells() {
        return this.childNodes;
    }

    addEvent(event) {
        this.querySelectorAll('td[is=sda-gantt-cell]').forEach((cell) => {
            new Date(cell.dataset.day).toString() === new Date(event.day).toString() ?
                    cell.addEvent(event) : null
            }
        );
    }

    _ondragstart() {
        this.querySelectorAll('sda-gantt-event')
            .forEach((cell) => cell.style.opacity = '0.3');
    }

    _ondragend(){
        this.querySelectorAll('sda-gantt-event')
            .forEach((cell) => cell.removeAttribute('style'));
    }

    get events() {
        let events = [];
        this.positions.forEach((position) => {
            position.events.forEach((event) => {
                events.push(event)
            });
        })
        return events;
    }

    get numDays() {
        return this.parentNode.numDays;
    }

    appendNewCells(numCellsToAppend) {
        for (let i = 0; i < numCellsToAppend; i++)
            this.appendChild(new SDAGanttCell(this.createDay()));
    }

    popCellsFromList(numCellsToRemove) {
        for (let i = 0; i < numCellsToRemove; i++)
            this.removeChild(this.lastChild);
    }

    createDay() {
        if (this.children.length <= 1)
            return this.startDay;
        else
            return new Date(this.lastChild.dataset.day).addDays(1);
    }

    get positions() {
        let positions = []
        this.childNodes.forEach((child) => {
            if (child instanceof SDAGanttCell) positions.push(child);
        });
        return positions;
    }

    get type() {
        return this.parentNode.title;
    }

    get head() {
        return this.firstChild;
    }
}

customElements.define("sda-gantt-row", SDAGanttRow, {extends: 'tr'});