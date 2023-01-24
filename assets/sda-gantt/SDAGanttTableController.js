class SDAGanttTableController extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="form-panel"></div>
        <div class="table-message-box"></div>`;
        this.dateRangePicker = new SDAGanttDateRangePicker();
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-table-controller.css');
        this.querySelector('.form-panel').appendChild(this.dateRangePicker);
        this.getRootNode().querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: this.dateRangePicker.valueAsDate.addDays(-2).toLocaleDateString()}));
        this.getRootNode().querySelector('.gantt-content').appendChild(new SDAGanttBottomEditorPanel());
    }
}

customElements.define("sda-gantt-table-controller", SDAGanttTableController);