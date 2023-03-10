class MainSDAGanttContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.updateManager = new UpdateManager();
        this.shadowRoot.innerHTML = `
        <div class="table-controller"></div>
        <div class="gantt-content"><div class="gantt-table-container"></div></div>`;
    }

    async connectedCallback() {
        this.addStylesheet('main-sda-gantt-container.css');
        this.activityCodeColors = await getActivityCodeColors();
        this.shadowRoot.querySelector('.table-controller')
            .appendChild(new SDAGanttTableController());
        this.shadowRoot.appendChild(new SDAGanttStyle('animations.css'))
        this.shadowRoot.appendChild(new SDAGanttStyle('colors.css'));
        this.shadowRoot.appendChild(new SDAGanttStyle('styles.css'));


        this.updateManager.socket.on("update", (data) => {
            let shouldAddEvent = true;
            this.shadowRoot.querySelectorAll("sda-gantt-event").forEach((currentEvent) => {
                if (data.id.toString() === currentEvent.id.toString()) {
                    currentEvent.updateTo(data);
                    shouldAddEvent = false;
                }
            });
            if (shouldAddEvent) this.shadowRoot.querySelector('table[is=sda-gantt-table]').addEvent(data);
            this.shadowRoot.querySelector('table[is=sda-gantt-table]').refreshAllConflictsAndWarnings();
        });

        this.updateManager.socket.on("delete", (data) => {
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
            this.shadowRoot.querySelector('table[is=sda-gantt-table]').refreshAllConflictsAndWarnings();
        });
    }

    refreshConflictsAndWarnings() {
        this.shadowRoot.querySelectorAll('sda-gantt-flag')
            .forEach((flag) => flag.remove());
        this.updateManager.gatherConflicts()
            .then((conflicts) => {
                conflicts.forEach((conflict) => {
                    this.shadowRoot.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                        if (event.id === conflict.event_id.toString())
                            event.addFlag("conflict", conflict.description)
                })
            })
        })
        this.updateManager.gatherWarnings()
            .then((warnings) => {
                warnings.forEach((warning) => {
                    this.shadowRoot.querySelectorAll(`sda-gantt-event`).forEach((event) => {
                        if (event.id === warning.event_id.toString())
                            event.addFlag("warning", warning.description)
                })
            })
        })
    }

    addStylesheet(stylesheetName) {
        for(const stylesheet of this.shadowRoot.querySelectorAll('link[is=sda-gantt-style]'))
            if (stylesheet.href.includes(stylesheetName)) return stylesheet;

        const newStylesheet = new SDAGanttStyle(stylesheetName)
        this.shadowRoot.appendChild(newStylesheet);
        return newStylesheet
    }
}

customElements.define("main-sda-gantt-container", MainSDAGanttContainer);