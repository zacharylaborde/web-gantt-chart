class SDAGeneralMaintenanceEventPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <h3 style="grid-column: span 2">General Maintenance Event</h3>
        <label for="testCellsTakenOut">Test Cells Taken Out</label><input name="testCellsTakenOut">
        <label for="description">Description</label><input name="description">`;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-general-maintenance-event-panel.css');
    }
}

customElements.define('sda-general-maintenance-event-panel', SDAGeneralMaintenanceEventPanel);