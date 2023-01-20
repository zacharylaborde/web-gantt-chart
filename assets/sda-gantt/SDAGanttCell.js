class SDAGanttCell extends HTMLTableCellElement {
    constructor(day) {
        super();
        this.appendChild(new SDAGanttEventList())
        this.setAttribute('is', 'sda-gantt-cell');
        this.day = day;
        this.className = 'gantt-position';
        this.ondragover = this._ondragover;
        this.ondragenter = this._ondragenter;
        this.ondragleave = this._ondragleave;
        this.ondrop = this._ondrop;
        this.onmouseenter = this._onmouseenter;
        this.onmouseleave = this._onmouseleave;
    }

    connectedCallback() {
        this.fetchEvents()
    }

    fetchEvents() {
    }

    createEvent(event) {
        this.querySelector("sda-gantt-event-list").createEvent(event);
    }

    appendEvent(event) {
        this.querySelector("sda-gantt-event-list").appendEvent(event);
    }

    addEvent(event) {
        this.querySelector("sda-gantt-event-list").addEvent(event);
    }

    removeEvent(event) {
        this.querySelector("sda-gantt-event-list").del(event);
    }

    moveEvent(event) {
        this.querySelector("sda-gantt-event-list").moveEvent(event);
    }

    parentRowCells(modify) {
        this.parentNode.cells.forEach((cell) => {
            if (cell.classList.contains("gantt-position")) modify(cell);
        })
    }

    get day() {
        return this.dataset.day;
    }

    set day(day) {
        this.dataset.day = day;
    }

    get events() {
        return this.querySelector("sda-gantt-event-list").events;
    }

    get parentRowName() {
        return this.parentNode.title;
    }

    get socket() {
        return this.parentNode.socket;
    }

    get type() {
        return this.parentNode.type;
    }

    get parentRow() {
        return this.parentNode;
    }

    _ondragover(event) {
        event.preventDefault();
        return false;
    }

    _ondragenter() {
        this.classList.add("over");
    }

    _ondragleave() {
        this.classList.remove("over");
        let filters = this.querySelectorAll("#add-event-filter");
        if (filters != null) filters.forEach((filter) => filter.remove());
    }

    _ondrop(event) {
        event.preventDefault();
        this.classList.remove("over");
        const isCopyEvent = event.dataTransfer.effectAllowed === "copy";
        const eventId = event.dataTransfer.getData("text");
        let ganttEvent = document.getElementById(eventId); // change 'document' to shadowRoot.
        if (this.parentRowName === ganttEvent.parentRowName) {
            if (isCopyEvent) this.createEvent({
                name: ganttEvent.name,
                activityCode: ganttEvent.activityCode,
                options: ganttEvent.options
            });
            else this.moveEvent(ganttEvent);
        }
    }

    _onmouseenter(event) {
        let addEventDiv = document.createElement("div");
        addEventDiv.classList.add("add-event-filter");
        addEventDiv.id = "add-event-filter";
        addEventDiv.innerText = "+";
        if (this.events.length === 0) addEventDiv.style.opacity = "1";
        addEventDiv.onclick = () => {
            this.createEvent({name: "", activityCode: "TEST", options: {}});
        }
        this.appendChild(addEventDiv);
    }

    _onmouseleave(event) {
        let filters = this.querySelectorAll("#add-event-filter");
        if (filters != null) filters.forEach((filter) => filter.remove());
    }
}

customElements.define("sda-gantt-cell", SDAGanttCell, {extends: 'td'});