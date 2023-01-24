class SDAGanttBottomEditorPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <button class="editor-panel-close-button">EDITOR PANEL ${"\u2630"}</button>
        <div class="editor-panel-form-content"></div>`;
        this.button = this.querySelector('.editor-panel-close-button');
        this.button.onclick = (event) => {
            if (this.isExpanded())
                this.collapse()
            else this.expand();
        };
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('sda-gantt-bottom-editor-panel.css');
    }

    expand() {
        this.classList.add("expanded-horizontal");
    }

    collapse() {
        this.classList.remove("expanded-horizontal");
    }

    isExpanded() {
        return this.classList.contains('expanded-horizontal');
    }

    clearForms() {
        this.querySelector('.editor-panel-form-content').childNodes.forEach((child) => child.remove())
    }

    addForm(form) {
        this.clearForms();
        this.querySelector('.editor-panel-form-content').appendChild(form);
    }
}

customElements.define("sda-gantt-bottom-editor-panel", SDAGanttBottomEditorPanel);