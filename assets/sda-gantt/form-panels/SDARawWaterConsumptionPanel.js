class SDARawWaterConsumptionPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <h3 style="grid-column: span 2">Raw Water Consumption</h3>
        <label for="maxKgpm">Maximum Kgpm Consumed</label><input name="maxKgpm">
        <label for="from">From</label><input name="from">`;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-raw-water-consumption-panel.css');
    }
}

customElements.define('sda-raw-water-consumption-panel', SDARawWaterConsumptionPanel);