class SDAGanttRow extends HTMLTableRowElement {
    constructor(title) {
        super();
        this.setAttribute('is', 'sda-gantt-row');
        this.innerHTML = `<td class="gantt-head primary-light"></td>`
        this.title = title;
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
        this.positions.forEach((position) =>
            new Date(position.dataset.day).toString() === new Date(event.day).toString() ?
                position.addEvent(event) : null
        );
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

    get socket() {
        return this.parentNode.socket
    }

    get type() {
        return this.parentNode.title;
    }

    get head() {
        return this.firstChild;
    }
}

customElements.define("sda-gantt-row", SDAGanttRow, {extends: 'tr'});