class SDAGanttRowDisabled extends HTMLTableRowElement {
    constructor() {
        super();
        this.setAttribute("is", "sda-gantt-row-disabled");
        this.innerHTML = `<td class="gantt-head primary-light"><div class="row-delete"></div></td>`;
    }

    connectedCallback() {
        this.querySelector(".gantt-head").appendChild(new SDARowSelector(this.type));
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