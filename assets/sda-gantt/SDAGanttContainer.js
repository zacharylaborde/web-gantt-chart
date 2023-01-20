class SDAGanttContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }


}

customElements.define("sda-gantt-container", SDAGanttContainer);