class SDAGanttTable extends HTMLTableElement {
    constructor({numDays, startDay}) {
        super();
        this.setAttribute('is', 'sda-gantt-table');
        this.innerHTML = `
        <thead class="gantt-header">
            <tr id="gantt-time" class="gantt-time jet-black">
                <th class="jet-black gantt-time"></th>
            </tr>
        </thead>
        `;
        this.startDay = new Date(startDay).toString();
        this.numDays = numDays;
        this.addDays(numDays);
        this.socket = io.connect()
    }

    connectedCallback() {
        fetch("/sda-gantt/get-sections",{
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                data.sections.forEach((sectionTitle) =>{
                    this.addSection(sectionTitle);
                });
        });
        this.socket.on("update", (data) => {
            this.updateEvent(data);
        });
        this.socket.on("delete", (data) => {
            this.deleteEvent(data);
        })
        this.getEventsFromServer()
    }

    getEventsFromServer() {
        fetch("/sda-gantt/get-events", {
            method: 'UPDATE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({startDay: this.startDay, numDays: this.numDays})
        })
            .then((response) => response.json())
            .then((data) => {
                data.events.forEach((event) => {
                    this.addEvent(event);
            });
        });
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
        this.sections.forEach((section) => {
            if (section.title === sectionTitle) {
                section.addRow(title);
                shouldCreateNewSection = false;
            }
        });
        if (shouldCreateNewSection) {
            this.addSection(sectionTitle);
            this.sections.forEach((section) => {
                if (section.title === sectionTitle) section.addRow(title);
            })
        }
    }

    addEvent(event) {
        let shouldCreateNewRow = true;
        if (this.rows)
            this.rows.forEach((row) => {
                if (row.title === event.parentRowName) {
                    row.addEvent(event);
                    shouldCreateNewRow = false;
                }
            });
        if (shouldCreateNewRow) {
            this.addRow(event.parentRowName, event.type);
            this.rows.forEach((row) => {
                if (row.title === event.parentRowName) row.addEvent(event);
            });
        }
    }

    updateEvent(event) {
        let shouldAddEvent = true;
        this.events.forEach((currentEvent) => {
            if (event.id.toString() === currentEvent.id.toString()) {
                currentEvent.updateTo(event);
                shouldAddEvent = false;
            }
        });
        if (shouldAddEvent) this.addEvent(event);
    }

    deleteEvent(id) {
        this.events.forEach((currentEvent) => {
            if (id.event.toString() === currentEvent.id.toString()) {
                currentEvent.remove();
            }
        });
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

    get sections() {
        let sections = [];
        this.childNodes.forEach((child) => {
            if (child instanceof SDAGanttSection) sections.push(child);
        });
        return sections;
    }

    get rows() {
        let rows = [];
        this.sections.forEach((section) => {
            if (section.rows) {
                section.rows.forEach((row) => {
                    rows.push(row);
                });
            }
        });
        return rows;
    }

    get events() {
        let events = []
        this.rows.forEach((row) => {
            if (row instanceof SDAGanttRow)
                row.events.forEach((event) => {
                    events.push(event);
                });
        });
        return events;
    }
}

customElements.define("sda-gantt-table", SDAGanttTable, {extends: "table"})