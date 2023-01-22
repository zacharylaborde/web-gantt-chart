class SDAGanttEventList extends HTMLElement {
    constructor() {
        super();
        this.ondrop = this._ondrop;
    }

    addEvent({name, activityCode, id, options}) {
        this.appendChild(new SDAGanttEvent(
            name,
            activityCode,
            id,
            options
        ));
    }

    moveEvent(event) {
        event.classList.add("loading-event");
        let req = {event: event.id, property: "day", to: this.day};
        this.getRootNode().host.socket.emit('update', req);
    }

    createEvent(event) {
        let req = {
            name: event.name,
            activityCode: event.activityCode,
            day: this.day,
            parentRowName: this.parentRowName,
            type: this.type,
            options: event.options,
        }
        this.getRootNode().host.socket.emit('create', req)
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

    get type() {
        return this.parentNode.type;
    }

    _ondrop(event) {
        event.preventDefault();
        const eventId = event.dataTransfer.getData("text");
        let ganttEvent = this.getRootNode().getElementById(eventId);
        if (event.dataTransfer.effectAllowed === "copy") this.createEvent({
            name: ganttEvent.name,
            activityCode: ganttEvent.activityCode,
            options: ganttEvent.options
        });
        else this.moveEvent(ganttEvent);
    }
}

customElements.define("sda-gantt-event-list", SDAGanttEventList);