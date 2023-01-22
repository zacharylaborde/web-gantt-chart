class SDAGanttContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.socket = io.connect();
        this.shadowRoot.innerHTML = `
        <div class="gantt-table-container"></div>
        <div class="editor-panel"></div>
        `
        this.className = 'gantt-container';
    }

    connectedCallback() {
        this.shadowRoot.appendChild(new SDAGanttStyle("form-fields.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("gantt-events.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("gantt-heads.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("scroll-bar.css"));
        this.shadowRoot.appendChild(new SDAGanttStyle("colors.css"));
        this.shadowRoot.querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: "10JAN2023"}));
        this.shadowRoot.appendChild(new SDAGanttEditorPanel());
        this.socket.on("update", (data) => {
            let shouldAddEvent = true;
            this.shadowRoot.querySelectorAll("sda-gantt-event").forEach((currentEvent) => {
                if (data.id.toString() === currentEvent.id.toString()) {
                    currentEvent.updateTo(data);
                    shouldAddEvent = false;
                }
            });
            if (shouldAddEvent) this.shadowRoot.querySelector('table[is=sda-gantt-table]').addEvent(data);
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
                })
        });

    }


}

customElements.define("sda-gantt-container", SDAGanttContainer);