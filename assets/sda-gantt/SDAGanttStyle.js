class SDAGanttStyle extends HTMLLinkElement {
    constructor(stylesheet) {
        super();
        this.setAttribute('is', 'sda-gantt-style');
        this.rel = 'stylesheet';
        this.href = `/assets/sda-gantt/styles/${stylesheet}`;
    }
}

customElements.define("sda-gantt-style", SDAGanttStyle, {extends: "link"})