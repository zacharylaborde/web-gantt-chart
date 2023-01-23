class SDAGanttBottomEditorPanel extends HTMLElement {
    constructor() {
        super();
        this.stylesheet = new SDAGanttStyle('sda-gantt-bottom-editor-panel.css');
        this.innerHTML = `<button class="editor-panel-close-button">EDITOR PANEL ${"\u2630"}</button>`
        this.button = this.querySelector('.editor-panel-close-button');
        this.button.onclick = (event) => {
            if (this.classList.contains("expanded-horizontal"))
                this.classList.remove("expanded-horizontal");
            else this.classList.add("expanded-horizontal");
        };
    }

    connectedCallback() {
        this.getRootNode().appendChild(this.stylesheet)
    }


}

customElements.define("sda-gantt-bottom-editor-panel", SDAGanttBottomEditorPanel);