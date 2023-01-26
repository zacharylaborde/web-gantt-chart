class SDAGeneralEventPanel extends HTMLElement {
    constructor(eventRef) {
        super();
        this.innerHTML = `
        <h3>Event</h3>`;
        //<label for="projectName">Project Name</label><input name="projectName">
        //<label for="projectId">Project ID</label><input name="projectId">
        //<label for="date">Date</label><input name="date">
        //<label for="operationalHours">Operational Hours</label><input name="operationalHours">
        this.eventRef = eventRef;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('form-styles/sda-general-event-panel.css');
        this.appendChild(new SDAProjectNameLookup(this.eventRef));
        this.appendChild(new SDAActivityCodeSelector(this.eventRef));
    }
}

customElements.define('sda-general-event-panel', SDAGeneralEventPanel);