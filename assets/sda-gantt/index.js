window.dash_clientside = Object.assign({}, window.dash_clientside, {
    gantt: {
        init_gantt: function(id) {
            let gantt = new SDAGanttTable({numDays: "10", startDay: "6JAN2023"});
            document.getElementById(id).appendChild(gantt);
            return "sda-gantt-display"
        },
    },
})
