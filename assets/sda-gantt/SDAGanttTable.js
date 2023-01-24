class SDAGanttTable extends HTMLTableElement {
    constructor({numDays, startDay}) {
        super();
        this.setAttribute('is', 'sda-gantt-table');
        this.innerHTML = `
        <thead class="gantt-header">
            <tr>
                <th class="jet-black gantt-time"></th>
            </tr>
        </thead>
        `;
        this.startDay = new Date(startDay).toString();
        this.numDays = numDays;
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
        let sections = await this.gatherSections()
        sections.forEach((sectionTitle) =>{
            this.addSection(sectionTitle);
        });
        await this.gatherEventsConflictsAndWarnings(this.startDay, this.numDays)
        this.getRootNode().querySelector('.gantt-table-container').onscroll = this._onscroll;
    }

    async gatherConflicts() {
        return fetch("sda-gantt/get-conflicts-and-warnings", {
            credentials: "include",
            method: "UPDATE",
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: this.startDay, numDays: this.numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.conflicts;});
    }

    async gatherWarnings() {
        return fetch("sda-gantt/get-conflicts-and-warnings", {
            credentials: "include",
            method: "UPDATE",
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: this.startDay, numDays: this.numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.warnings;});
    }

    async gatherSections() {
        return fetch("/sda-gantt/get-sections",{
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {return data.sections});
    }

    async gatherEvents(schedule, start, numDays) {
        return fetch("/sda-gantt/get-events", {
            method: 'UPDATE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({schedule: schedule, startDay: start, numDays: numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.events;});
    }

    async addDays(numDays) {
        for (let i = 0; i < numDays; i++) {
            let cell = document.createElement("th");
            cell.className = "gantt-time jet-black";
            cell.innerText = this.createDay();
            console.log(this.createDay());
            if (new Date(this.createDay()).getWeek() === new Date().getWeek()) cell.classList.add('today-head');
            this.querySelector("thead tr").appendChild(cell);
            for (const row of this.querySelectorAll('tr[is=sda-gantt-row]'))
                row.appendNewCells(1);
        }
        this.numDays += parseInt(numDays);
        for (const section of this.querySelectorAll('tbody[is=sda-gantt-section]'))
            section.update();
        await this.gatherEventsConflictsAndWarnings(new Date(this.startDay).addDays(parseInt(numDays)).toString(), numDays);
    }

    async gatherEventsConflictsAndWarnings(startDay, numDays) {
        let events = await this.gatherEvents("current", startDay, numDays);
        events.forEach((event) => this.addEvent(event));
        let conflicts = await this.gatherConflicts();
        let warnings = await this.gatherWarnings();
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

    addConflict(conflict) {

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

    get startDay() {
        return this.dataset.startDay;
    }

    set startDay(startDay) {
        this.dataset.startDay = startDay
    }
}

customElements.define("sda-gantt-table", SDAGanttTable, {extends: "table"})