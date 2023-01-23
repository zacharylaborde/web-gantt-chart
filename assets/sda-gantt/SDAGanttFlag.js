class SDAGanttFlag extends HTMLElement {
    constructor(type, description) {
        super();
        let flagString = "\u2691";
        this.innerHTML = `<div class="gantt-flag ${type}">${"\u2691"}</div>`;
        this.querySelector('.gantt-flag').onmouseenter = this._onmouseenter;
        this.querySelector('.gantt-flag').onmouseleave = this._onmouseleave;
        this.message = this.constructMessage(type, description);
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-flag.css');
    }

    constructMessage(type, description) {
        let message = document.createElement('div');
        message.innerHTML = `<p class="flag-message ${type}-background">${type}: ${description}</p>`
        message.className = 'flag-message';
        return message;
    }

    _onmouseenter() {
        this.getRootNode().querySelector('.table-message-box')
            .appendChild(this.parentNode.message.cloneNode(true));
    }

    _onmouseleave() {
        this.getRootNode().querySelectorAll('.table-message-box')
            .forEach((messageBox) => {messageBox.querySelectorAll('.flag-message').forEach((message)=> {
                message.remove();
            })});
    }
}

customElements.define('sda-gantt-flag', SDAGanttFlag);