class SDADateRangePicker extends HTMLInputElement {
    constructor() {
        super();
        this.setAttribute('is', 'sda-gantt-date-range-picker');
        this.type = 'week';
        this.onchange = this._onchange;
        const currentDay = new Date();
        this.value = currentDay.asHTMLWeek();
        this.required = true;
        this.min = currentDay.asHTMLWeek();
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-date-range-picker.css');
    }

    _onchange() {
        // which friday do we start on?
        const table = this.getRootNode().querySelector('table[is=sda-gantt-table]');
        if (table !== null)
            table.remove()
        if (this.value >= this.min)
            this.getRootNode().querySelector('.gantt-table-container')
                .appendChild(new SDAGanttTable({numDays: 17, startDay: this.valueAsDate.addDays(-2).toLocaleDateString()}))
    }
}

customElements.define('sda-gantt-date-range-picker', SDADateRangePicker, {extends: "input"});