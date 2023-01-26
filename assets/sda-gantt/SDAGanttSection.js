class SDAGanttSection extends HTMLTableSectionElement {
    constructor(title) {
        super();
        this.setAttribute('is', 'sda-gantt-section');
        this.innerHTML = `
        <tr>
            <td class="gantt-titles primary">
                <div id="title" class="gantt-titles-text"></div>
            </td>
        </tr>`;
        this.title = title;
        this.onmouseenter = this._onmouseenter;
        this.onmouseleave = this._onmouseleave;
        this.hiddenRow = false;
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-section.css');
        this.getRootNode().appendChild(this.stylesheet);
        this.querySelector(".gantt-titles").colSpan = this.numDays + 1
        this.querySelector(".gantt-titles").onclick = () => {
            this.hiddenRow = !this.hiddenRow;
            this.rows.forEach((row) => {
                if (this.hiddenRow) row.style.display = "none";
                else row.style.display = "table-row";
            });
            if (this.hiddenRow) {
                this.onmouseenter = null;
                this.onmouseleave = null;
                this.removeMirage();
            }
            else {
                this.onmouseenter = this._onmouseenter;
                this.onmouseleave = this._onmouseleave;
                this.addMirage();
            }
        }
    }

    addRow(title) {
        this.removeMirage();
        if (this.containsEmptyRow) this.emptyRow.remove();
        let newRow = new SDAGanttRow(title)
        this.appendChild(newRow);
        return newRow;
    }

    addEmptyRow() {
        let newRow = new SDAGanttRowDisabled();
        this.removeMirage();
        this.appendChild(newRow);
        return newRow;
    }

    update(){
        this.querySelector(".gantt-titles").colSpan = this.numDays + 1
    }

    set title(title) {
        this.querySelector(`#title`).innerText = title;
    }

    get startDay() {
        return this.parentNode.startDay;
    }

    get title() {
        return this.querySelector(`#title`).innerText.split('\n')[0];
    }

    get numDays() {
        return this.getRootNode().querySelector('table[is=sda-gantt-table]').numDays;
    }

    get rows() {
        let rows = [];
        this.childNodes.forEach((child) => {
            if (child instanceof SDAGanttRow || child instanceof SDAGanttRowDisabled) rows.push(child);
        })
        return rows;
    }

    get containsEmptyRow() {
        let containsEmptyRow = false;
        this.rows.forEach((row) => {
            if (row instanceof SDAGanttRowDisabled) containsEmptyRow = true;
        });
        return containsEmptyRow;
    }

    get emptyRow() {
        let emptyRow;
        this.rows.forEach((row) => {
            if (row instanceof SDAGanttRowDisabled) emptyRow = row;
        });
        return this.querySelector("[is=sda-gantt-row-disabled]")
    }

    addMirage() {
        if (this.containsEmptyRow) return;
        this.removeMirage();
        let mirage = document.createElement("div");
        this.querySelector('.gantt-titles-text').appendChild(mirage);
        let mirageContent = document.createElement("div");
        mirage.appendChild(mirageContent);
        mirageContent.className = "new-row-mirage";
        mirageContent.colSpan = parseInt(this.numDays) + 1;
        mirageContent.textContent = "+";
        mirage.id = "mirage";
        mirage.onclick = (event) => {
            event.stopPropagation();
            this.removeMirage();
            this.addEmptyRow()
        }
    }

    removeMirage() {
        this.querySelectorAll("#mirage").forEach((mirage) => {
            mirage.remove();
        });
    }

    _onmouseenter(event) {
        this.addMirage();
    }

    _onmouseleave(event) {
        this.removeMirage();
    }
}

customElements.define('sda-gantt-section', SDAGanttSection, {extends: "tbody"})