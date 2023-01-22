window.dash_clientside = Object.assign({}, window.dash_clientside, {
    gantt: {
        init_gantt: function(id) {
            document.getElementById(id).appendChild(new SDAGanttContainer());
            return "sda-gantt-display"
        },
    },
})
