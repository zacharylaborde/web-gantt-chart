window.dash_clientside = Object.assign({}, window.dash_clientside, {
    gantt: {
        init_gantt: function(id) {
            document.body.appendChild(new MainSDAGanttContainer());

            return "sda-gantt-display"
        },
    },
})
