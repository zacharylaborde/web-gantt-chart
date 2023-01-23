class SDAGanttRowSelector extends HTMLElement {
    constructor(type) {
        super();
        this.innerHTML = `<select class="sda-gantt-row-selector" id="selection"></select>`
        this.type = type;
        this.stylesheet = new SDAGanttStyle('sda-gantt-row-selector.css');
    }

    connectedCallback() {
        this.getRootNode().appendChild(this.stylesheet);
        fetch(`sda-event-categories/${this.type}`)
            .then((response) => response.json())
            .then((data) => {
                let hasValue = false;
                Object.keys(data).forEach((key) => {
                    let sectionRowNames = []
                    this.section.rows.forEach((row) => sectionRowNames.push(row.title));
                    data[key].forEach((row_name) => {
                        if (!sectionRowNames.includes(row_name)) {
                            let option = document.createElement("option");
                            option.value = row_name;
                            option.innerText = row_name;
                            this.querySelector('#selection').appendChild(option);
                            hasValue = true;
                        }
                    });
                });
                this.querySelector("#selection").value = null;
                this.querySelector("#selection").onchange = () => {
                    this.parentNode.parentNode.replaceWith(new SDAGanttRow(this.querySelector("#selection").value));
                }
                if (data === "error") this.remove();
                if (!hasValue) this.parentNode.parentNode.remove();
        });
    }

    get section() {
        return this.parentNode.parentNode.parentNode;
    }
}

customElements.define('sda-gantt-row-selector', SDAGanttRowSelector)