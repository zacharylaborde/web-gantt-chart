class SDAGanttTableController extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<button>SDA Gantt Table Controller</button>`
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-table-controller.css');
        this.appendChild(new SDADateRangePicker());
        this.getRootNode().querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: "10JAN2023"}));
        this.getRootNode().appendChild(new SDAGanttBottomEditorPanel());
    }
}

customElements.define("sda-gantt-table-controller", SDAGanttTableController);