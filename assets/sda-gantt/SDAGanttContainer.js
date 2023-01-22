class SDAGanttContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.socket = io.connect();
        this.shadowRoot.innerHTML = `
        <div class="gantt-table-container"></div>`;
        this.className = 'gantt-container';
    }

    connectedCallback() {
        this.shadowRoot.appendChild(new SDAGanttStyle("form-fields.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("gantt-events.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("gantt-heads.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("scroll-bar.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("colors.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("conflict-flags.css"));
        this.shadowRoot.querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: "10JAN2023"}));
        this.shadowRoot.appendChild(new SDAGanttButtomEditorPanel());

        this.socket.on("update", (data) => {
            let shouldAddEvent = true;
            this.shadowRoot.querySelectorAll("sda-gantt-event").forEach((currentEvent) => {
                if (data.id.toString() === currentEvent.id.toString()) {
                    currentEvent.updateTo(data);
                    shouldAddEvent = false;
                }
            });
            if (shouldAddEvent) this.shadowRoot.querySelector('table[is=sda-gantt-table]').addEvent(data);
            this.refreshConflictsAndWarnings();
        });

        this.socket.on("delete", (data) => {
            this.shadowRoot.querySelectorAll("sda-gantt-event").forEach((currentEvent) => {
                if (data.event.toString() === currentEvent.id.toString()) currentEvent.remove();
            });
            this.shadowRoot.querySelectorAll("tr[is=sda-gantt-row]").forEach((row) => {
                if (row.querySelectorAll("sda-gantt-event").length === 0)
                    row.remove();
            });
            this.shadowRoot.querySelectorAll("tbody[is=sda-gantt-section]").forEach((section) => {
                if (section.querySelectorAll("tr[is=sda-gantt-row]").length === 0)
                    section.removeMirage();
            });
            this.refreshConflictsAndWarnings();
        });
    }

    refreshConflictsAndWarnings() {
        this.shadowRoot.querySelectorAll('sda-gantt-flag')
            .forEach((flag) => flag.remove());
        this.shadowRoot.querySelector('table[is=sda-gantt-table]').gatherConflicts()
            .then((conflicts) => {
                conflicts.forEach((conflict) => {
                    this.shadowRoot.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                        if (event.id === conflict.event_id.toString())
                            event.addFlag("conflict", conflict.description)
                })
            })
        })
        this.shadowRoot.querySelector('table[is=sda-gantt-table]').gatherWarnings()
            .then((conflicts) => {
                conflicts.forEach((warning) => {
                    this.shadowRoot.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                        if (event.id === warning.event_id.toString())
                            event.addFlag("warning", warning.description)
                })
            })
        })
    }
}

customElements.define("sda-gantt-container", SDAGanttContainer);