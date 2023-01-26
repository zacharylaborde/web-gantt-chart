class SDAGanttEventList extends HTMLElement {
    constructor() {
        super();
        this.ondrop = this._ondrop;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-event-list.css');
    }

    addEvent({name, activityCode, id, options}) {
        this.appendChild(new SDAGanttEvent(
            name,
            activityCode,
            id,
            options
        ));
    }

    get type() {
        for (const section of this.getRootNode().querySelectorAll('tbody[is=sda-gantt-section]'))
            for (const eventList of section.querySelectorAll('sda-gantt-event-list'))
                if (eventList === this) return section.title;
    }

    appendEvent(event) {
        this.appendChild(event);
    }

    del(id) {
        this.childNodes.forEach((child) => {
            if (child.id === id) child.remove();
        })
    }

    parentRowCells(modify) {
        this.parentNode.parentRowCells((cell) => {
            modify(cell);
        })
    }

    get day() {
        return this.parentNode.day;
    }

    get parentRowName() {
        return this.parentNode.parentRowName;
    }

    _ondrop(event) {
        event.preventDefault();
        const eventId = event.dataTransfer.getData("text");
        let ganttEvent = this.getRootNode().getElementById(eventId);
        if (event.dataTransfer.effectAllowed === "copy")
            this.getRootNode().host.updateManager.createEvent({
            name: ganttEvent.name,
            activityCode: ganttEvent.activityCode,
            options: ganttEvent.options,
            day: this.day,
            parentRowName: this.parentRowName,
        });
        else {
            ganttEvent.classList.add('loading-event');
            this.getRootNode().host.updateManager.updateEvent(ganttEvent, "day", this.day);
        }
    }
}

customElements.define("sda-gantt-event-list", SDAGanttEventList);