class SDAGanttEventList extends HTMLElement {
    constructor() {
        super();
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
        this.socket.emit('update', req);
    }

    get parentRow() {
        return this.parentNode.parentRow;
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
        this.socket.emit('create', req)
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

    get events() {
        return this.childNodes;
    }

    get day() {
        return this.parentNode.day;
    }

    get parentRowName() {
        return this.parentNode.parentRowName;
    }

    get socket() {
        return this.parentNode.socket;
    }

    get type() {
        return this.parentNode.type;
    }
}

customElements.define("sda-gantt-event-list", SDAGanttEventList);