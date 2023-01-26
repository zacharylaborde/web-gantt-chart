class SDAActivityCodeSelector extends HTMLElement {
    constructor(eventRef) {
        super();
        this.innerHTML = `
        <label class='activity-code-selector-label' for="activityCode">Activity Code:</label>
        <select class='activity-code-selector' name="activityCode"></select>`;
        this.eventRef = eventRef;
        this.label = this.querySelector('label');
        this.select = this.querySelector('select');
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('form-styles/sda-activity-code-selector.css');
        this.generateOptions();
        this.select.value = this.eventRef.activityCode;
        this.querySelector('select').onchange = this._onchange;
    }

    generateOptions() {
        for (const x of Object.keys(this.getRootNode().host.activityCodeColors[this.eventRef.type])) {
            const option = document.createElement('option')
            option.innerText = x;
            option.value = x;
            this.select.appendChild(option);
        }
    }

    _onchange() {
        const event = this.parentNode.eventRef
        event.activityCode = this.value;
        this.getRootNode().host.updateManager.updateEvent(event, 'activityCode', this.value);
    }
}

customElements.define('sda-activity-code-selector', SDAActivityCodeSelector);