class SDAGanttTableController extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<button>SDA Gantt Table Controller</button>`
        this.stylesheet = new SDAGanttStyle("sda-gantt-table-controller.css")
    }

    connectedCallback() {
        this.getRootNode().appendChild(this.stylesheet);
        this.appendChild(new SDADateRangePicker());
        this.getRootNode().querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: "10JAN2023"}));
        this.getRootNode().appendChild(new SDAGanttBottomEditorPanel());
    }
}

customElements.define("sda-gantt-table-controller", SDAGanttTableController);