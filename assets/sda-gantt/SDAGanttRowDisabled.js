class SDAGanttRowDisabled extends HTMLTableRowElement {
    constructor() {
        super();
        this.setAttribute("is", "sda-gantt-row-disabled");
        this.innerHTML = `<td class="disabled-gantt-head primary-light"><div class="row-delete"></div></td>`;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-row-disabled.css');
        this.getRootNode().appendChild(this.stylesheet);
        this.querySelector("td").appendChild(new SDAGanttRowSelector(this.type));
        let rowDelete = this.querySelector(".row-delete");
        rowDelete.innerText = "\u2715";
        rowDelete.onclick = () => {
            this.remove();
        }
    }

    get numDays() {
        return this.parentNode.numDays;
    }

    get type() {
        return this.parentNode.title;
    }

    appendNewCells(numCellsToAppend) {
        for (let i = 0; i < numCellsToAppend; i++)
            this.appendChild(new HTMLTableCellElement());
    }
}

customElements.define("sda-gantt-row-disabled", SDAGanttRowDisabled, {extends: "tr"});