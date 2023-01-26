class SDAProjectNameLookup extends HTMLElement {
    constructor(eventRef) {
        super();
        this.innerHTML = `
        <label class='project-name-lookup-label' for="projectName">Project Name:</label>
        <input type="search" list="projects" class='project-name-lookup' name="projectName" maxlength="5" autocomplete>`;
        this.eventRef = eventRef;
        this.label = this.querySelector('label');
        this.search = this.querySelector('input[type=search]');
    }

    connectedCallback() {
        this.stylesheet = this.getRootNode().host.addStylesheet('form-styles/sda-project-name-lookup.css');
        const datalist = document.createElement('datalist');
        datalist.id = "projects";
        this.getRootNode().host.updateManager.getAllProjects()
            .then((allProjects) => {
            for (const key in Object.keys(allProjects)) {
                const option = document.createElement('option');
                option.value = allProjects[key].name;
                datalist.appendChild(option);
            }
            this.appendChild(datalist);
        });
    }

    generateOptions() {

    }

    _onchange() {

    }
}

customElements.define('sda-project-name-lookup', SDAProjectNameLookup);