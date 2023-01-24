class SDAGanttDateRangePicker extends HTMLInputElement {
    constructor() {
        super();
        this.setAttribute('is', 'sda-gantt-date-range-picker');
        this.type = 'week';
        this.onchange = this._onchange;
        const currentDay = new Date();
        this.value = `${currentDay.getFullYear()}-W${currentDay.getWeek().toString().padStart(2, '0')}`;
        this.required = true;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-date-range-picker.css');
    }

    _onchange() {
        // which friday do we start on?
        this.getRootNode().querySelector('table[is=sda-gantt-table]').remove()
        this.getRootNode().querySelector('.gantt-table-container')
            .appendChild(new SDAGanttTable({numDays: 17, startDay: this.valueAsDate.addDays(-2).toLocaleDateString()}))
    }
}

customElements.define('sda-gantt-date-range-picker', SDAGanttDateRangePicker, {extends: "input"});