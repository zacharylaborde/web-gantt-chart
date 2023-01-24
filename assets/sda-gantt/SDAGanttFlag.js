class SDAGanttFlag extends HTMLElement {
    constructor(type, description) {
        super();
        let flagString = "\u2691";
        this.type = type;
        this.description = description;
        this.innerHTML = `<div class="gantt-flag ${this.type}">${"\u2691"}</div>`;
        this.querySelector('.gantt-flag').onmouseenter = this._onmouseenter;
        this.querySelector('.gantt-flag').onmouseleave = this._onmouseleave;
        this.message = this.constructMessage(type, description);
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-flag.css');
    }

    constructMessage(type, description) {
        let message = document.createElement('p');
        message.innerText = `${type}: ${description}`
        message.className = `flag-message ${type}-background`;
        return message;
    }

    clearMessage() {
        this.getRootNode().querySelectorAll('.table-message-box')
            .forEach((messageBox) => {messageBox.querySelectorAll('.flag-message').forEach((message)=> {
                message.remove();
            })});
    }

    _onmouseenter() {
        this.parentNode.clearMessage();
        this.getRootNode().querySelector('.table-message-box')
            .appendChild(this.parentNode.message.cloneNode(true));
    }

    _onmouseleave() {
        this.parentNode.clearMessage();
    }
}

customElements.define('sda-gantt-flag', SDAGanttFlag);