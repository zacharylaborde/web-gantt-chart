class SDAGanttEvent extends HTMLElement {
    constructor(name, activityCode, id, options={}) {
        super();
        this.innerHTML = `<div class="flag-holder"></div><p class="event-text"></p>`;
        this.name = name;
        this.activityCode = activityCode;
        this.id = id;
        Object.keys(options).forEach((key) => this[key] = options[key])
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-event.css');
        this.activityCode = this.activityCode;
        this.tabIndex = 0;
        this.draggable = true;
        this.ondragstart = this._ondragstart;
        this.ondragend = this._ondragend;
        this.onkeydown = this._onkeydown;
        this.onclick = this._onclick;
        this.onmouseenter = this._onmouseenter;
        this.onmouseleave = this._onmouseleave;
    }

    set day(day) {
        for (const cell of this.row.cells)
            if (cell.day === day) cell.appendEvent(this);
    }

    get day() {
        return this.cell.day;
    }

    get cell() {
        for (const cell of this.row.querySelectorAll('td[is=sda-gantt-cell]'))
            if (cell.contains(this)) return cell;
    }

    get row() {
        for (const row of this.getRootNode().querySelectorAll('tr[is=sda-gantt-row]'))
            if (row.contains(this)) return row;
    }

    set name(name) {
        this.querySelector('.event-text').innerText = name;
    }

    get name() {
        return this.querySelector('.event-text').innerText;
    }

    set activityCode(activityCode) {
        this.dataset.activityCode = activityCode;
        if (this.isConnected)
            this.className = `gantt-event ${this.getRootNode().host.activityCodeColors[this.type][activityCode]} ${this.getRootNode().host.activityCodeColors[this.type][activityCode]}-border`;
    }

    get activityCode() {
        return this.dataset.activityCode;
    }

    get type() {
        for (const section of this.getRootNode().querySelectorAll('tbody[is=sda-gantt-section]'))
            for (const event of section.querySelectorAll('sda-gantt-event'))
                if (event === this) return section.title;
    }

    set type(type) {

    }

    deleteEvent() {
        if (this.getRootNode().querySelector('sda-gantt-bottom-editor-panel').isExpanded())
            this.getRootNode().querySelector('.editor-panel-close-button').click();
        this.classList.add("loading-event");
        this.getRootNode().host.updateManager.deleteEvent(this.id);
    }

    addFlag(type, description) {
        this.querySelector(".flag-holder").appendChild(new SDAGanttFlag(type, description));
    }

    clearFlags() {
        this.querySelectorAll("sda-gantt-flag").forEach((flag) => flag.remove());
    }

    updateTo(event) {
        Object.keys(event).forEach((key) => this[key] = event[key]);
    }

    generateForms() {
        return [new SDAGeneralEventPanel(this)];
    }

    _ondragstart(event) {
        this.style.opacity = '0.4';
        event.dataTransfer.setData("text", this.id);
        if (event.shiftKey) event.dataTransfer.effectAllowed = 'copy';
        else event.dataTransfer.effectAllowed = 'move';
    }

    _onkeydown(event) {
        if (event.keyCode !== undefined)
            if (event.keyCode === 8 || event.keyCode === 46) this.deleteEvent();
        else
            if (event.key === 8 || event.key === 46) this.deleteEvent();
    }

    _onclick(event) {
        if (!this.getRootNode().querySelector('sda-gantt-bottom-editor-panel').isExpanded())
            this.getRootNode().querySelector('.editor-panel-close-button').click();
        this.getRootNode().querySelector('sda-gantt-bottom-editor-panel')
                .addForms(this.generateForms());

    }
}

customElements.define("sda-gantt-event", SDAGanttEvent);