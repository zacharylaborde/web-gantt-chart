window.dash_clientside = Object.assign({}, window.dash_clientside, {
    gantt: {
        init_gantt: function(id) {
            const init = document.getElementById("gantt-init");
            backendData = JSON.parse(init.textContent);
            spikeUsers = backendData["spike_users"];
            let gantt = new SDAGanttTable({numDays: backendData["num_days"], startDay: backendData["start_day"]});
            document.getElementById(id).appendChild(gantt);
            init.remove();
            return "sda-gantt-display"
        },
        add_event: function(event) {

        }
    },
})
