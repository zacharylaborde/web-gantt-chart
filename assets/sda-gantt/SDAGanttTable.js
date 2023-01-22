class SDAGanttTable extends HTMLTableElement {
    constructor({numDays, startDay}) {
        super();
        this.setAttribute('is', 'sda-gantt-table');
        this.innerHTML = `
        <div class="table-message-box">&nbsp;</div>
        <thead class="gantt-header">
            <tr id="gantt-time" class="gantt-time jet-black">
                <th class="jet-black gantt-time"></th>
            </tr>
        </thead>
        `;
        this.startDay = new Date(startDay).toString();
        this.numDays = numDays;
        this.addDays(numDays);
        this.className = 'gantt-table';
    }

    async connectedCallback() {
        let sections = await this.gatherSections()
        sections.forEach((sectionTitle) =>{
            this.addSection(sectionTitle);
        });
        let events = await this.gatherEvents();
        events.forEach((event) => {
            this.addEvent(event);
        });
        let conflicts = await this.gatherConflicts();
        conflicts.forEach((conflict) => {
            this.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                if (event.id === conflict.event_id.toString()) event.addFlag("conflict", conflict.description)
            })
        });
        let warnings = await this.gatherWarnings();
        warnings.forEach((warning) => {
            this.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                if (event.id === warning.event_id.toString()) event.addFlag("warning", warning.description)
            })
        })
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

    async gatherEvents() {
        return fetch("/sda-gantt/get-events", {
            method: 'UPDATE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: this.startDay, numDays: this.numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.events;});
    }

    addDays(numDays) {
        for (let i = 0; i < numDays; i++) {
            let cell = document.createElement("th");
            cell.className = "gantt-time jet-black";
            cell.innerText = this.createDay();
            this.querySelector("#gantt-time").appendChild(cell);
        }
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
        if (this.querySelector("#gantt-time").children.length <= 1)
            return new Date(this.startDay).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"});
        else
            return new Date(this.querySelector("#gantt-time").lastChild.textContent).addDays(1).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"});
    }

    get startDay() {
        return this.dataset.startDay;
    }

    set startDay(startDay) {
        this.dataset.startDay = startDay
    }

    get numDays() {
        return this.dataset.numDays;
    }

    set numDays(numDays) {
        this.dataset.numDays = numDays;
    }
}

customElements.define("sda-gantt-table", SDAGanttTable, {extends: "table"})