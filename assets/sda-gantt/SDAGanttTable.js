class SDAGanttTable extends HTMLTableElement {
    constructor({numDays, startDay}) {
        super();
        this.setAttribute('is', 'sda-gantt-table');
        this.innerHTML = `
        <thead class="gantt-header">
            <tr>
                <th class="jet-black gantt-time"></th>
            </tr>
        </thead>`;
        this.startDay = new Date(startDay).toString();
        this.numDays = numDays;
        this.appendTimeCells(numDays);
    }

    appendTimeCells(numDays) {
        for (let i = 0; i < numDays; i++) {
            let cell = document.createElement("th");
            cell.className = "gantt-time jet-black";
            cell.innerText = this.createDay();
            if (new Date().dayEquals(cell.innerText)) cell.style.color = 'var(--support-light)';
            this.querySelector("thead tr").appendChild(cell);
        }
    }

    async connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-table.css');
        let sections = await this.getRootNode().host.updateManager.gatherEventTypes()
        sections.forEach((sectionTitle) =>{
            this.addSection(sectionTitle);
        });
        await this.renderEventsConflictsAndWarnings(this.startDay, this.numDays)
        this.getRootNode().querySelector('.gantt-table-container').onscroll = this._onscroll;
    }

    async addDays(numDays) {
        this.appendTimeCells(numDays);
        for (const row of this.querySelectorAll('tr[is=sda-gantt-row]'))
                row.appendNewCells(numDays);
        this.numDays += parseInt(numDays);
        for (const section of this.querySelectorAll('tbody[is=sda-gantt-section]'))
            section.update();
        await this.renderEventsConflictsAndWarnings(new Date(this.startDay).addDays(parseInt(numDays)).toString(), numDays);
    }

    async renderEventsConflictsAndWarnings(startDay, numDays) {
        let events = await this.getRootNode().host.updateManager.gatherEvents("current", startDay, numDays);
        events.forEach((event) => this.addEvent(event));
        await this.renderConflictsAndWarnings(startDay, numDays);
    }

    async renderConflictsAndWarnings(startDay, numDays) {
        let conflicts = await this.getRootNode().host.updateManager.gatherConflicts("current", startDay, numDays);
        let warnings = await this.getRootNode().host.updateManager.gatherWarnings("current", startDay, numDays);
        for (const event of this.querySelectorAll(`sda-gantt-event`))
            event.clearFlags();
        conflicts.forEach((conflict) => {
            this.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                if (event.id === conflict.event_id.toString()) {
                    event.addFlag("conflict", conflict.description)
                }
            })
        });
        warnings.forEach((warning) => {
            this.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                if (event.id === warning.event_id.toString()) event.addFlag("warning", warning.description)
            })
        })
    }

    async refreshAllConflictsAndWarnings() {
        await this.renderConflictsAndWarnings(this.startDay, this.numDays);
    }

    addSection(title) {
        this.appendChild(new SDAGanttSection(title));
    }

    addRow(title, sectionTitle) {
        let shouldCreateNewSection = true;
        let sections = this.querySelectorAll("tbody[is=sda-gantt-section]");
        sections.forEach((section) => {
            if (section.title === sectionTitle) {
                section.addRow(title);
                shouldCreateNewSection = false;
            }
        });
        if (shouldCreateNewSection) {
            this.addSection(sectionTitle);
            sections.forEach((section) => {
                if (section.title === sectionTitle) section.addRow(title);
            })
        }
    }

    addEvent(event) {
        let shouldAddEvent = true;
        this.querySelectorAll(`sda-gantt-event`)
            .forEach((e) =>  {
                if (e.id === event.id.toString()) shouldAddEvent = false;
        });
        if (!shouldAddEvent) return;
        let shouldCreateNewRow = true;
        let rows = this.querySelectorAll("tr[is=sda-gantt-row]");
        if (rows.length !== 0)
            rows.forEach((row) => {
                if (row.title === event.parentRowName) {
                    row.addEvent(event);
                    shouldCreateNewRow = false;
                }
        });
        if (shouldCreateNewRow) {
            this.addRow(event.parentRowName, event.type);
            this.querySelectorAll("tr[is=sda-gantt-row]").forEach((row) => {
                if (row.title === event.parentRowName) row.addEvent(event);
            });
        }
    }

    createDay() {
        if (this.querySelector("thead tr").children.length <= 1)
            return new Date(this.startDay).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"});
        else
            return new Date(this.querySelector("thead tr").lastChild.textContent).addDays(1).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"});
    }

    async _onscroll(event) {
        if (this.scrollLeft / (this.scrollWidth - this.offsetWidth) > 0.98)
            await this.getRootNode().querySelector('table[is=sda-gantt-table]').addDays(14);
    }
}

customElements.define("sda-gantt-table", SDAGanttTable, {extends: "table"})