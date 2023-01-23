class SDADateRangePicker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-date-range-picker.css');
    }

}

customElements.define('sda-date-range-picker', SDADateRangePicker);