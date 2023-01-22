class SDAGanttButtomEditorPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<button class="editor-panel-close-button">EDITOR PANEL ${"\u2630"}</button>`
        this.className = "editor-panel";

        this.button = this.querySelector('.editor-panel-close-button');
        this.button.onclick = (event) => {
            if (this.classList.contains("expanded-panel"))
                this.classList.remove("expanded-panel");
            else this.classList.add("expanded-panel");
        };
    }


}

customElements.define("sda-gantt-editor-panel", SDAGanttButtomEditorPanel);