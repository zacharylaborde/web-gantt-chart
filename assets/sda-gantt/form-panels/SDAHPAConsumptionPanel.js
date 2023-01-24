class SDAHPAConsumptionPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <h3 style="grid-column: span 2">High Pressure Air Consumption</h3>
        <label for="spikeUser">Spike User</label><input name="spikeUser">
        <label for="startHour">Start Hour</label><input name="startHour">
        <label for="durationInMinutes">Duration In Minutes</label><input name="durationInMinutes">
        <label for="maxFlorRateInPPS">Max Flow Rate in PPS</label><input name="maxFlorRateInPPS">
        <label for="from">From</label><input name="from">`;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-hpa-consumption-panel.css');
    }
}

customElements.define('sda-hpa-consumption-panel', SDAHPAConsumptionPanel);