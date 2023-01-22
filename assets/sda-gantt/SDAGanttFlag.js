class SDAGanttFlag extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<div class="gantt-flag">\u2691</div>`;
    }

    connectedCallback() {

    }
}

customElements.define('sda-gantt-flag', SDAGanttFlag);