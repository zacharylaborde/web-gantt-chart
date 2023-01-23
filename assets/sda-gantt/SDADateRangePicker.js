class SDADateRangePicker extends HTMLElement {
    constructor() {
        super();
        this.stylesheet = new SDAGanttStyle('sda-date-range-picker.css');
    }

    connectedCallback() {
        this.getRootNode().appendChild(this.stylesheet);
    }

}

customElements.define('sda-date-range-picker', SDADateRangePicker);