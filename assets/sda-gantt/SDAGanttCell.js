class SDAGanttCell extends HTMLTableCellElement {
    constructor(day) {
        super();
        this.setAttribute('is', 'sda-gantt-cell');
        this.day = day;
        this.ondragover = this._ondragover;
        this.ondragenter = this._ondragenter;
        this.ondragleave = this._ondragleave;
        this.ondrop = this._ondrop;
        this.onmouseenter = this._onmouseenter;
        this.onmouseleave = this._onmouseleave;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet("sda-gantt-cell.css");
        this.appendChild(new SDAGanttEventList());
        this.fetchEvents()

        if (this.isThisWeek) this.className = 'this-week';
        if (this.isToday) this.className = 'today';
    }

    get isToday() {
        return new Date(this.day).toLocaleDateString() === new Date().toLocaleDateString();
    }

    get isThisWeek() {
        return new Date(this.day).getWeek() === new Date().getWeek();
    }

    fetchEvents() {
    }

    appendEvent(event) {
        this.querySelector("sda-gantt-event-list").appendEvent(event);
    }

    addEvent(event) {
        this.querySelector("sda-gantt-event-list").addEvent(event);
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

    get parentRowName() {
        return this.parentNode.title;
    }

    get type() {
        for (const section of this.getRootNode().querySelector('tbody[is=sda-gantt-sectin]'))
            for (const event of section.querySelector('sda-gantt-event'))
                if (event.id === this.id) return section.title;
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
        this.classList.remove("over");
    }

    _onmouseenter() {
        let addEventDiv = document.createElement("div");
        addEventDiv.classList.add("add-event-filter");
        addEventDiv.id = "add-event-filter";
        addEventDiv.innerText = "+";
        if (this.querySelectorAll("sda-gantt-event").length === 0) addEventDiv.style.opacity = "1";
        addEventDiv.onclick = () => {
            const event = {
                name: "",
                activityCode: "NONE",
                day: this.day,
                parentRowName: this.parentRowName,
                options: {},
            }
            this.getRootNode().host.updateManager.createEvent(event);
        }
        this.appendChild(addEventDiv);
    }

    _onmouseleave(event) {
        let filters = this.querySelectorAll("#add-event-filter");
        if (filters != null) filters.forEach((filter) => filter.remove());
    }
}

customElements.define("sda-gantt-cell", SDAGanttCell, {extends: 'td'});