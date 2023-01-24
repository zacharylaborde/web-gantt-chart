class SDAGeneralEventPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <h3 style="grid-column: span 2">Event</h3>
        <label for="projectName">Project Name</label><input name="projectName">
        <label for="projectId">Project ID</label><input name="projectId">
        <label for="activityCode">Activity Code</label><input name="activityCode">
        <label for="date">Date</label><input name="date">
        <label for="operationalHours">Operational Hours</label><input name="operationalHours">`;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-general-event-panel.css');
    }
}

customElements.define('sda-general-event-panel', SDAGeneralEventPanel);