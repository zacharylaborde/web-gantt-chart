class SDAGanttEvent extends HTMLElement {
    constructor(name, activityCode, id, options={}) {
        super();
        this.innerHTML = `
            <div class="flag-holder"></div>
            <p class="event-text"></p>
        `
        this.name = "name";
        this.activityCode = activityCode;
        Object.keys(options).forEach((key) => this.dataset[key] = options[key])
        this.tabIndex = 0;
        this.id = id;
    }

    connectedCallback() {
        this.draggable = true;
        this.ondragstart = this._ondragstart;
        this.ondragend = this._ondragend;
        this.onkeydown = this._onkeydown;
        this.onclick = this._onclick;
        this.onmouseenter = this._onmouseenter;
        this.onmouseleave = this._onmouseleave;
    }

    set day(day) {
        let remove = true;
        this.parentRowCells((cell) => {
            if (cell.dataset.day === day) {
                cell.appendEvent(this);
                remove = false;
            }
        });
        if (remove) this.remove();
    }

    get parentRowName() {
        return this.parentRow.title;
    }

    get parentRow() {
        let parentRow;
        this.getRootNode().querySelectorAll('tr[is=sda-gantt-row]').forEach((row) => {
                row.querySelectorAll('sda-gantt-event').forEach((event) => {
                    if (event.id === this.id) parentRow = row;
                });
            });
        return parentRow;
    }

    get isSpikeUser() {
        return spikeUsers.includes(this.parentRowName);
    }

    get day() {
        return this.parentNode.day;
    }

    set name(name) {
        this.querySelector('.event-text').innerText = name;
    }

    get name() {
        return this.querySelector('.event-text').innerText;
    }

    set activityCode(activityCode) {
        this.dataset.activityCode = activityCode;
        this.className = `ellipsis-overflow gantt-event ${activityCodeColors[activityCode]} ${activityCodeColors[activityCode]}-border`;
    }

    get activityCode() {
        return this.dataset.activityCode;
    }

    deleteEvent() {
        let req = {event: this.id}
        this.getRootNode().host.socket.emit('delete', req)
    }

    addFlag(type, description) {
        this.querySelector(".flag-holder").appendChild(new SDAGanttFlag(type, description));
    }

    clearFlags() {
        this.querySelectorAll("sda-gantt-flag").forEach((flag) => flag.remove());
    }

    parentRowEvents(modify) {
        this.parentRowCells((cell) => {
            cell.events.forEach((event) => {
                modify(event);
            })
        })
    }

    updateTo(event) {
        this.name = event.name;
        this.activityCode = event.activityCode;
        this.day = event.day;
        if (event.options)
            Object.keys(event.options).forEach((key) => this.dataset[key] = event.options[key])
    }

    parentRowCells(modify) {
        this.parentNode.parentRowCells((cell) => {
            modify(cell);
        });
    }

    _ondragstart(event) {
        this.style.opacity = '0.4';
        event.dataTransfer.setData("text", this.id);
        if (event.shiftKey) event.dataTransfer.effectAllowed = 'copy';
        else event.dataTransfer.effectAllowed = 'move';
    }

    _onkeydown(event) {
        if (event.keyCode === 8 || event.keyCode === 46) {
            this.classList.add("loading-event")
            this.deleteEvent();
        }
    }

    _onclick(event) {
        event.stopPropagation();
    }
}

customElements.define("sda-gantt-event", SDAGanttEvent);